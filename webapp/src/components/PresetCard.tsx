'use client';

import { Preset, ProfileItem, PersonalInfoData, EducationData, WorkExperienceData, QualificationSkillData, JikoPRData } from '@/types/profile';
import { Edit, Trash2, Bookmark, User, GraduationCap, Briefcase, Award, MessageSquare } from 'lucide-react';

interface PresetCardProps {
  preset: Preset;
  profileItems: ProfileItem[];
  onEdit: (preset: Preset) => void;
  onDelete: (presetId: string) => void;
}

export default function PresetCard({ preset, profileItems, onEdit, onDelete }: PresetCardProps) {
  const getItemById = (itemId: string) => {
    return profileItems.find(item => item.id === itemId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personalInfo':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'education':
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'workExperience':
        return <Briefcase className="h-4 w-4 text-purple-500" />;
      case 'qualificationOrSkill':
        return <Award className="h-4 w-4 text-orange-500" />;
      case 'jikoPR':
        return <MessageSquare className="h-4 w-4 text-pink-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
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

  const getTotalItemCount = () => {
    return Object.values(preset.selectedItems).reduce((total, items) => total + (items?.length || 0), 0);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the preset "${preset.name}"?`)) {
      onDelete(preset.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Bookmark className="h-6 w-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{preset.name}</h3>
            {preset.description && (
              <p className="text-sm text-gray-600">{preset.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(preset)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {getTotalItemCount()} item{getTotalItemCount() !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Selected Items Preview */}
      <div className="space-y-3">
        {Object.entries(preset.selectedItems).map(([type, itemIds]) => {
          if (!itemIds || itemIds.length === 0) return null;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(type)}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {type === 'personalInfo' ? 'Personal Info' :
                   type === 'workExperience' ? 'Work Experience' :
                   type === 'qualificationOrSkill' ? 'Qualification/Skill' :
                   type === 'jikoPR' ? 'Self Promotion' :
                   type}
                </span>
                <span className="text-xs text-gray-400">({itemIds.length})</span>
              </div>
              <div className="space-y-1">
                {itemIds.slice(0, 2).map(itemId => {
                  const item = getItemById(itemId);
                  if (!item) return (
                    <div key={itemId} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                      Item not found
                    </div>
                  );
                  
                  return (
                    <div key={itemId} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded truncate">
                      {getItemDisplayName(item)}
                    </div>
                  );
                })}
                {itemIds.length > 2 && (
                  <div className="text-xs text-gray-500 px-2 py-1">
                    +{itemIds.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {getTotalItemCount() === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No items selected</p>
        </div>
      )}
    </div>
  );
} 