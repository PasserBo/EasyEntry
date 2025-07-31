'use client';

import { ProfileItem, PersonalInfoData, EducationData, WorkExperienceData, QualificationSkillData, JikoPRData } from '@/types/profile';
import { Edit, Trash2, User, GraduationCap, Briefcase, Award, MessageSquare } from 'lucide-react';

interface ProfileItemCardProps {
  item: ProfileItem;
  onEdit: (item: ProfileItem) => void;
  onDelete: (itemId: string) => void;
}

export default function ProfileItemCard({ item, onEdit, onDelete }: ProfileItemCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'personalInfo':
        return <User className="h-6 w-6 text-blue-500" />;
      case 'education':
        return <GraduationCap className="h-6 w-6 text-green-500" />;
      case 'workExperience':
        return <Briefcase className="h-6 w-6 text-purple-500" />;
      case 'qualificationOrSkill':
        return <Award className="h-6 w-6 text-orange-500" />;
      case 'jikoPR':
        return <MessageSquare className="h-6 w-6 text-pink-500" />;
      default:
        return <User className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'personalInfo':
        return 'Personal Info';
      case 'education':
        return 'Education';
      case 'workExperience':
        return 'Work Experience';
      case 'qualificationOrSkill':
        return 'Qualification/Skill';
      case 'jikoPR':
        return 'Self Promotion';
      default:
        return 'Unknown';
    }
  };

  const getMainContent = () => {
    switch (item.type) {
      case 'personalInfo': {
        const data = item.data as PersonalInfoData;
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.fullName}</h3>
            <p className="text-sm text-gray-600">{data.email}</p>
            {data.phoneNumber && (
              <p className="text-sm text-gray-600">{data.phoneNumber}</p>
            )}
          </div>
        );
      }
      case 'education': {
        const data = item.data as EducationData;
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.school}</h3>
            {data.faculty && <p className="text-sm text-gray-600">{data.faculty}</p>}
            {data.degree && <p className="text-sm text-gray-600">{data.degree}</p>}
            <p className="text-xs text-gray-500 mt-1">{data.status}</p>
          </div>
        );
      }
      case 'workExperience': {
        const data = item.data as WorkExperienceData;
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.position}</h3>
            <p className="text-sm text-gray-600">{data.company}</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.startDate} - {data.endDate}
            </p>
          </div>
        );
      }
      case 'qualificationOrSkill': {
        const data = item.data as QualificationSkillData;
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            {data.issuer && <p className="text-sm text-gray-600">{data.issuer}</p>}
            {data.acquisitionDate && (
              <p className="text-xs text-gray-500 mt-1">{data.acquisitionDate}</p>
            )}
          </div>
        );
      }
      case 'jikoPR': {
        const data = item.data as JikoPRData;
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {data.content}
            </p>
          </div>
        );
      }
      default:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Unknown Item</h3>
          </div>
        );
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-sm font-medium text-gray-500">{getTypeLabel()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(item)}
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

      {/* Content */}
      <div className="flex-1">
        {getMainContent()}
      </div>
    </div>
  );
} 