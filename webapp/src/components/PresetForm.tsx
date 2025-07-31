'use client';

import { useState, useEffect } from 'react';
import { X, Check, User, GraduationCap, Briefcase, Award, MessageSquare } from 'lucide-react';
import { Preset, ProfileItem, PersonalInfoData, EducationData, WorkExperienceData, QualificationSkillData, JikoPRData } from '@/types/profile';

interface PresetFormProps {
  profileItems: ProfileItem[];
  initialData?: Preset | null;
  onSave: (data: {
    name: string;
    description?: string;
    selectedItems: Preset['selectedItems'];
  }) => void;
  onCancel: () => void;
}

export default function PresetForm({ profileItems, initialData, onSave, onCancel }: PresetFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<Preset['selectedItems']>({
    personalInfo: [],
    education: [],
    workExperience: [],
    qualificationOrSkill: [],
    jikoPR: []
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setSelectedItems(initialData.selectedItems);
    }
  }, [initialData]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personalInfo':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'education':
        return <GraduationCap className="h-5 w-5 text-green-500" />;
      case 'workExperience':
        return <Briefcase className="h-5 w-5 text-purple-500" />;
      case 'qualificationOrSkill':
        return <Award className="h-5 w-5 text-orange-500" />;
      case 'jikoPR':
        return <MessageSquare className="h-5 w-5 text-pink-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'personalInfo':
        return 'Personal Information';
      case 'education':
        return 'Education';
      case 'workExperience':
        return 'Work Experience';
      case 'qualificationOrSkill':
        return 'Qualifications & Skills';
      case 'jikoPR':
        return 'Self Promotion';
      default:
        return type;
    }
  };

  const getItemDisplayName = (item: ProfileItem) => {
    switch (item.type) {
      case 'personalInfo':
        return (item.data as PersonalInfoData).fullName;
      case 'education':
        return (item.data as EducationData).school;
      case 'workExperience':
        return `${(item.data as WorkExperienceData).position} at ${(item.data as WorkExperienceData).company}`;
      case 'qualificationOrSkill':
        return (item.data as QualificationSkillData).name;
      case 'jikoPR':
        return (item.data as JikoPRData).title;
      default:
        return 'Unknown Item';
    }
  };

  const getItemSubtitle = (item: ProfileItem) => {
    switch (item.type) {
      case 'personalInfo':
        return (item.data as PersonalInfoData).email;
      case 'education':
        const eduData = item.data as EducationData;
        return `${eduData.faculty || ''} ${eduData.degree || ''}`.trim();
      case 'workExperience':
        const workData = item.data as WorkExperienceData;
        return `${workData.startDate} - ${workData.endDate}`;
      case 'qualificationOrSkill':
        const skillData = item.data as QualificationSkillData;
        return skillData.issuer || skillData.acquisitionDate || '';
      case 'jikoPR':
        return (item.data as JikoPRData).content.substring(0, 60) + '...';
      default:
        return '';
    }
  };

  const handleItemToggle = (itemId: string, itemType: string) => {
    setSelectedItems(prev => {
      const currentItems = prev[itemType as keyof Preset['selectedItems']] || [];
      const isSelected = currentItems.includes(itemId);
      
      if (isSelected) {
        // Remove item
        return {
          ...prev,
          [itemType]: currentItems.filter(id => id !== itemId)
        };
      } else {
        // Add item
        return {
          ...prev,
          [itemType]: [...currentItems, itemId]
        };
      }
    });
  };

  const isItemSelected = (itemId: string, itemType: string) => {
    const currentItems = selectedItems[itemType as keyof Preset['selectedItems']] || [];
    return currentItems.includes(itemId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      selectedItems
    });
  };

  const groupedItems = profileItems.reduce((groups, item) => {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }
    groups[item.type].push(item);
    return groups;
  }, {} as Record<string, ProfileItem[]>);

  const getTotalSelected = () => {
    return Object.values(selectedItems).reduce((total, items) => total + (items?.length || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {initialData ? 'Edit Preset' : 'Create New Preset'}
            </h3>
            <p className="text-sm text-gray-600">
              Combine your experiences to create a tailored resume preset
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preset Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Frontend Developer Application"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional description for your reference"
              />
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              {getTotalSelected()} item{getTotalSelected() !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Item Selection */}
          <div className="mb-6 space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Select Items for Preset</h4>
            
            {Object.entries(groupedItems).map(([type, items]) => (
              <div key={type} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                  {getTypeIcon(type)}
                  <h5 className="text-sm font-semibold text-gray-800">
                    {getTypeLabel(type)}
                  </h5>
                  <span className="text-xs text-gray-500">
                    ({(selectedItems[type as keyof Preset['selectedItems']] || []).length} of {items.length} selected)
                  </span>
                </div>
                
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 ml-7">No items available</p>
                ) : (
                  <div className="space-y-2">
                    {items.map(item => {
                      const isSelected = isItemSelected(item.id, item.type);
                      
                      return (
                        <div
                          key={item.id}
                          className={`
                            flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors
                            ${isSelected 
                              ? 'border-blue-300 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                          onClick={() => handleItemToggle(item.id, item.type)}
                        >
                          <div className={`
                            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                          `}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h6 className="text-sm font-medium text-gray-900 truncate">
                              {getItemDisplayName(item)}
                            </h6>
                            {getItemSubtitle(item) && (
                              <p className="text-xs text-gray-600 truncate">
                                {getItemSubtitle(item)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {initialData ? 'Update Preset' : 'Create Preset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 