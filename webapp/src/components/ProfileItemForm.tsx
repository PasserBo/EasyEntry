'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  ProfileItem,
  ProfileItemType,
  PersonalInfoData,
  EducationData,
  WorkExperienceData,
  QualificationSkillData,
  JikoPRData
} from '@/types/profile';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ProfileItemFormProps {
  type: ProfileItemType;
  initialData?: ProfileItem | null;
  onSave: (data: {
    type: ProfileItemType;
    data: PersonalInfoData | EducationData | WorkExperienceData | QualificationSkillData | JikoPRData;
  }) => void;
  onCancel: () => void;
}

export default function ProfileItemForm({ type, initialData, onSave, onCancel }: ProfileItemFormProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData.data);
    } else {
      // Initialize with empty data based on type
      switch (type) {
        case 'personalInfo':
          setFormData({
            fullName: '',
            furiganaName: '',
            birthDate: '',
            email: '',
            phoneNumber: '',
            address: {
              postalCode: '',
              prefecture: '',
              city: '',
              streetAddress: ''
            }
          });
          break;
        case 'education':
          setFormData({
            school: '',
            faculty: '',
            degree: '',
            status: 'Currently Enrolled',
            startDate: '',
            endDate: ''
          });
          break;
        case 'workExperience':
          setFormData({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
          });
          break;
        case 'qualificationOrSkill':
          setFormData({
            name: '',
            issuer: '',
            acquisitionDate: ''
          });
          break;
        case 'jikoPR':
          setFormData({
            title: '',
            content: ''
          });
          break;
      }
    }
  }, [type, initialData]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ type, data: formData });
  };

  const getFormTitle = () => {
    const action = initialData ? 'Edit' : 'Add';
    switch (type) {
      case 'personalInfo':
        return `${action} Personal Information`;
      case 'education':
        return `${action} Education`;
      case 'workExperience':
        return `${action} Work Experience`;
      case 'qualificationOrSkill':
        return `${action} Qualification/Skill`;
      case 'jikoPR':
        return `${action} Self Promotion`;
      default:
        return `${action} Item`;
    }
  };

  const renderPersonalInfoForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Furigana Name
          </label>
          <input
            type="text"
            value={formData.furiganaName || ''}
            onChange={(e) => handleInputChange('furiganaName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Birth Date
        </label>
        <input
          type="date"
          value={formData.birthDate || ''}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Postal Code</label>
            <input
              type="text"
              value={formData.address?.postalCode || ''}
              onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Prefecture</label>
            <input
              type="text"
              value={formData.address?.prefecture || ''}
              onChange={(e) => handleInputChange('address.prefecture', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">City</label>
            <input
              type="text"
              value={formData.address?.city || ''}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Street Address</label>
            <input
              type="text"
              value={formData.address?.streetAddress || ''}
              onChange={(e) => handleInputChange('address.streetAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducationForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          School *
        </label>
        <input
          type="text"
          value={formData.school || ''}
          onChange={(e) => handleInputChange('school', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculty/Department
          </label>
          <input
            type="text"
            value={formData.faculty || ''}
            onChange={(e) => handleInputChange('faculty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <input
            type="text"
            value={formData.degree || ''}
            onChange={(e) => handleInputChange('degree', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          value={formData.status || 'Currently Enrolled'}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Currently Enrolled">Currently Enrolled</option>
          <option value="Graduated">Graduated</option>
          <option value="Expected to Graduate">Expected to Graduate</option>
          <option value="Withdrew">Withdrew</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="month"
            value={formData.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="month"
            value={formData.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderWorkExperienceForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            value={formData.position || ''}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="month"
            value={formData.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="text"
            placeholder="YYYY-MM or 'Present'"
            value={formData.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your responsibilities and achievements..."
        />
      </div>
    </div>
  );

  const renderQualificationSkillForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., TOEIC Listening & Reading Test: 950"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuer
          </label>
          <input
            type="text"
            value={formData.issuer || ''}
            onChange={(e) => handleInputChange('issuer', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., ETS, Google, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acquisition Date
          </label>
          <input
            type="month"
            value={formData.acquisitionDate || ''}
            onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderJikoPRForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., For Software Engineer Roles (Frontend-focused)"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your personal statement or self-promotion text..."
          required
        />
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (type) {
      case 'personalInfo':
        return renderPersonalInfoForm();
      case 'education':
        return renderEducationForm();
      case 'workExperience':
        return renderWorkExperienceForm();
      case 'qualificationOrSkill':
        return renderQualificationSkillForm();
      case 'jikoPR':
        return renderJikoPRForm();
      default:
        return <div>Unknown form type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {getFormTitle()}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderFormContent()}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 