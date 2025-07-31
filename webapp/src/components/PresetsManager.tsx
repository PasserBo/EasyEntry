'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Preset, ProfileItem } from '@/types/profile';
import PresetCard from './PresetCard';
import PresetForm from './PresetForm';
import { Plus, Search, Bookmark } from 'lucide-react';

export default function PresetsManager() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [profileItems, setProfileItems] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for presets
    const presetsQuery = query(
      collection(db, `users/${user.uid}/presets`),
      orderBy('name')
    );

    const unsubscribePresets = onSnapshot(presetsQuery, (snapshot) => {
      const presetsList: Preset[] = [];
      snapshot.forEach((doc) => {
        presetsList.push({ id: doc.id, ...doc.data() } as Preset);
      });
      setPresets(presetsList);
      setLoading(false);
    });

    // Set up real-time listener for profile items (needed for preset creation)
    const itemsQuery = query(
      collection(db, `users/${user.uid}/profileItems`),
      orderBy('type')
    );

    const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
      const itemsList: ProfileItem[] = [];
      snapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() } as ProfileItem);
      });
      setProfileItems(itemsList);
    });

    return () => {
      unsubscribePresets();
      unsubscribeItems();
    };
  }, [user]);

  const handleSavePreset = async (presetData: {
    name: string;
    description?: string;
    selectedItems: Preset['selectedItems'];
  }) => {
    if (!user) return;

    try {
      if (editingPreset) {
        // Update existing preset
        await updateDoc(
          doc(db, `users/${user.uid}/presets`, editingPreset.id),
          presetData
        );
      } else {
        // Create new preset
        await addDoc(
          collection(db, `users/${user.uid}/presets`),
          presetData
        );
      }
      setShowForm(false);
      setEditingPreset(null);
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  };

  const handleEditPreset = (preset: Preset) => {
    setEditingPreset(preset);
    setShowForm(true);
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/presets`, presetId));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  const handleCreateNew = () => {
    setEditingPreset(null);
    setShowForm(true);
  };

  const filteredPresets = presets.filter(preset =>
    preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (preset.description && preset.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resume Presets</h2>
          <p className="text-sm text-gray-600">Create combinations of your experiences for different applications</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Preset
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search presets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Presets Grid */}
      {filteredPresets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bookmark className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No presets found' : 'No presets created yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'Create your first preset by combining experiences from your library.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Preset
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              profileItems={profileItems}
              onEdit={handleEditPreset}
              onDelete={handleDeletePreset}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PresetForm
          profileItems={profileItems}
          initialData={editingPreset}
          onSave={handleSavePreset}
          onCancel={() => {
            setShowForm(false);
            setEditingPreset(null);
          }}
        />
      )}
    </div>
  );
} 