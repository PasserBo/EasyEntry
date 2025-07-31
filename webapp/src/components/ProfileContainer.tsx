'use client';

import { useState } from 'react';
import { User, Bookmark, FileText } from 'lucide-react';
import ExperienceManager from './ExperienceManager';
import PresetsManager from './PresetsManager';
import ResumeManager from './ResumeManager';

type TabType = 'experience' | 'presets' | 'resumes';

export default function ProfileContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('resumes');

  const tabs = [
    {
      id: 'resumes' as TabType,
      name: 'Resumes',
      icon: FileText,
      description: 'Upload and manage resume files'
    },
    {
      id: 'experience' as TabType,
      name: 'Experience',
      icon: User,
      description: 'Manage your profile library'
    },
    {
      id: 'presets' as TabType,
      name: 'Presets',
      icon: Bookmark,
      description: 'Create resume combinations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none
                      ${isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon
                      className={`
                        -ml-0.5 mr-2 h-5 w-5
                        ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'resumes' && <ResumeManager />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'presets' && <PresetsManager />}
        </div>
      </main>
    </div>
  );
} 