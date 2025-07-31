import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Preset, CompiledPresetData } from './types';

interface PresetSelectorProps {
  user: any; // User object from Chrome storage
}

function PresetSelector({ user }: PresetSelectorProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      if (!user || !user.uid) {
        console.error("❌ PresetSelector: No user UID available");
        setLoading(false);
        return;
      }

      try {
        console.log("📋 PresetSelector: Fetching presets for user:", user.uid);
        const presetsCol = collection(db, 'users', user.uid, 'presets');
        const presetSnapshot = await getDocs(presetsCol);
        const presetList: Preset[] = presetSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Preset));
        
        console.log("✅ PresetSelector: Found", presetList.length, "presets");
        setPresets(presetList);
        if (presetList.length > 0) {
          setSelectedPresetId(presetList[0].id);
        }
      } catch (error) {
        console.error('❌ PresetSelector: Error fetching presets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.uid) {
      fetchPresets();
    } else {
      setLoading(false);
    }
  }, [user]); // Re-run if the user prop changes

  const handleFillPage = async () => {
    if (!selectedPresetId) {
      alert('Please select a preset.');
      return;
    }

    if (!user || !user.uid) {
      alert('User session not available.');
      return;
    }

    setFilling(true);

    try {
      console.log("🔄 PresetSelector: Starting form fill for preset:", selectedPresetId);
      
      // 1. Get the selected preset document
      const presetRef = doc(db, 'users', user.uid, 'presets', selectedPresetId);
      const presetSnap = await getDoc(presetRef);
      const presetData = presetSnap.data() as Preset;

      if (!presetData) {
        alert('Preset not found.');
        return;
      }

      // 2. Fetch all referenced profileItems
      const compiledData: CompiledPresetData = {};
      
      for (const [type, itemIds] of Object.entries(presetData.selectedItems)) {
        if (!itemIds || itemIds.length === 0) continue;
        
        const itemDataArray = [];
        for (const itemId of itemIds) {
          const itemRef = doc(db, 'users', user.uid, 'profileItems', itemId);
          const itemSnap = await getDoc(itemRef);
          if (itemSnap.exists()) {
            itemDataArray.push(itemSnap.data().data);
          }
        }
        
        // For single items, don't use an array
        if (itemDataArray.length === 1) {
          compiledData[type as keyof CompiledPresetData] = itemDataArray[0];
        } else if (itemDataArray.length > 1) {
          compiledData[type as keyof CompiledPresetData] = itemDataArray;
        }
      }

      console.log("📦 PresetSelector: Compiled data:", compiledData);

      // 3. Send the compiled data to the active tab's content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        alert('Could not find active tab.');
        return;
      }

      console.log("📤 PresetSelector: Sending data to content script on tab:", tab.url);
      chrome.tabs.sendMessage(tab.id, {
        type: "FILL_FORM",
        data: compiledData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('❌ PresetSelector: Error sending message:', chrome.runtime.lastError);
          alert('Error: Could not communicate with the page. Make sure you are on a supported job application site.');
        } else if (response?.status === 'success') {
          console.log("✅ PresetSelector: Form filled successfully");
          alert('Form filled successfully!');
        } else {
          console.log("ℹ️ PresetSelector: Form filling completed with response:", response);
          alert('Form filling completed, but please verify the results.');
        }
      });

    } catch (error) {
      console.error('❌ PresetSelector: Error filling form:', error);
      alert('Error occurred while filling the form.');
    } finally {
      setFilling(false);
    }
  };

  const selectedPreset = presets.find(p => p.id === selectedPresetId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (presets.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">No presets found.</p>
        <p className="text-sm text-gray-500">Create presets in the EasyEntry web app first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Preset:
        </label>
        <select 
          value={selectedPresetId} 
          onChange={(e) => setSelectedPresetId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPreset && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-900">
            {selectedPreset.name}
          </p>
          {selectedPreset.description && (
            <p className="text-xs text-gray-600 mt-1">
              {selectedPreset.description}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Items: {Object.values(selectedPreset.selectedItems).reduce((total, items) => total + (items?.length || 0), 0)}
          </p>
        </div>
      )}

      <button
        onClick={handleFillPage}
        disabled={!selectedPresetId || filling}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {filling ? 'Filling Form...' : 'Auto-fill this Page'}
      </button>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Make sure you're on a supported job application page
      </p>
    </div>
  );
}

export default PresetSelector; 