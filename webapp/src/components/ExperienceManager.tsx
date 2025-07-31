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
import { 
  ProfileItem, 
  ProfileItemType,
  PersonalInfoData,
  EducationData,
  WorkExperienceData,
  QualificationSkillData,
  JikoPRData
} from '@/types/profile';
import ProfileItemForm from './ProfileItemForm';
import ProfileItemCard from './ProfileItemCard';
import { Plus, Search } from 'lucide-react';

export default function ExperienceManager() {
  const [profileItems, setProfileItems] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ProfileItem | null>(null);
  const [selectedType, setSelectedType] = useState<ProfileItemType>('personalInfo');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProfileItemType | 'all'>('all');
  const { user } = useAuth();

  const profileItemTypes: { value: ProfileItemType; label: string }[] = [
    { value: 'personalInfo', label: 'Personal Information' },
    { value: 'education', label: 'Education' },
    { value: 'workExperience', label: 'Work Experience' },
    { value: 'qualificationOrSkill', label: 'Qualification/Skill' },
    { value: 'jikoPR', label: 'Self Promotion' }
  ];

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/profileItems`),
      orderBy('type')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ProfileItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ProfileItem);
      });
      setProfileItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveItem = async (itemData: {
    type: ProfileItemType;
    data: PersonalInfoData | EducationData | WorkExperienceData | QualificationSkillData | JikoPRData;
  }) => {
    if (!user) return;

    try {
      if (editingItem) {
        // Update existing item
        await updateDoc(
          doc(db, `users/${user.uid}/profileItems`, editingItem.id),
          itemData
        );
      } else {
        // Create new item
        await addDoc(
          collection(db, `users/${user.uid}/profileItems`),
          itemData
        );
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving profile item:', error);
    }
  };

  const handleEditItem = (item: ProfileItem) => {
    setEditingItem(item);
    setSelectedType(item.type);
    setShowForm(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/profileItems`, itemId));
    } catch (error) {
      console.error('Error deleting profile item:', error);
    }
  };

  const handleCreateNew = (type: ProfileItemType) => {
    setSelectedType(type);
    setEditingItem(null);
    setShowForm(true);
  };

  const filteredItems = profileItems.filter(item => {
    const matchesSearch = item.type === 'personalInfo' 
      ? (item.data as PersonalInfoData).fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : item.type === 'education'
      ? (item.data as EducationData).school.toLowerCase().includes(searchTerm.toLowerCase())
      : item.type === 'workExperience'
      ? (item.data as WorkExperienceData).company.toLowerCase().includes(searchTerm.toLowerCase())
      : item.type === 'qualificationOrSkill'
      ? (item.data as QualificationSkillData).name.toLowerCase().includes(searchTerm.toLowerCase())
      : item.type === 'jikoPR'
      ? (item.data as JikoPRData).title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">Experience Library</h2>
          <p className="text-sm text-gray-600">Manage your profile information and experiences</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ProfileItemType | 'all')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          {profileItemTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {profileItemTypes.map(type => (
          <button
            key={type.value}
            onClick={() => handleCreateNew(type.value)}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Start building your profile by adding your first experience.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ProfileItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProfileItemForm
          type={selectedType}
          initialData={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
} 