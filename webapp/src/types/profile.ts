// Type definitions for the new EasyEntry data model

export type ProfileItemType = 
  | 'personalInfo' 
  | 'education' 
  | 'workExperience' 
  | 'qualificationOrSkill' 
  | 'jikoPR';

// Base interface for all profile items
export interface ProfileItem {
  id: string;
  type: ProfileItemType;
  data: PersonalInfoData | EducationData | WorkExperienceData | QualificationSkillData | JikoPRData;
}

// Personal Information
export interface PersonalInfoData {
  fullName: string;
  furiganaName?: string;
  birthDate?: string; // YYYY-MM-DD format
  email: string;
  phoneNumber?: string;
  address?: {
    postalCode?: string;
    prefecture?: string;
    city?: string;
    streetAddress?: string;
  };
}

// Education
export interface EducationData {
  school: string;
  faculty?: string;
  degree?: string;
  status: 'Graduated' | 'Withdrew' | 'Expected to Graduate' | 'Currently Enrolled';
  startDate?: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format
}

// Work Experience
export interface WorkExperienceData {
  company: string;
  position: string;
  startDate: string; // YYYY-MM format
  endDate: string; // YYYY-MM format or "Present"
  description?: string;
}

// Qualification or Skill
export interface QualificationSkillData {
  name: string;
  issuer?: string;
  acquisitionDate?: string; // YYYY-MM format
}

// Jiko PR (Self Promotion)
export interface JikoPRData {
  title: string;
  content: string;
}

// Preset structure
export interface Preset {
  id: string;
  name: string;
  description?: string;
  selectedItems: {
    personalInfo?: string[];
    education?: string[];
    workExperience?: string[];
    qualificationOrSkill?: string[];
    jikoPR?: string[];
  };
}

// Type guards for data types
export const isPersonalInfoData = (data: unknown): data is PersonalInfoData => {
  return typeof data === 'object' && data !== null && 
         typeof (data as PersonalInfoData).fullName === 'string' && 
         typeof (data as PersonalInfoData).email === 'string';
};

export const isEducationData = (data: unknown): data is EducationData => {
  return typeof data === 'object' && data !== null &&
         typeof (data as EducationData).school === 'string' && 
         typeof (data as EducationData).status === 'string';
};

export const isWorkExperienceData = (data: unknown): data is WorkExperienceData => {
  return typeof data === 'object' && data !== null &&
         typeof (data as WorkExperienceData).company === 'string' && 
         typeof (data as WorkExperienceData).position === 'string' && 
         typeof (data as WorkExperienceData).startDate === 'string' && 
         typeof (data as WorkExperienceData).endDate === 'string';
};

export const isQualificationSkillData = (data: unknown): data is QualificationSkillData => {
  return typeof data === 'object' && data !== null &&
         typeof (data as QualificationSkillData).name === 'string';
};

export const isJikoPRData = (data: unknown): data is JikoPRData => {
  return typeof data === 'object' && data !== null &&
         typeof (data as JikoPRData).title === 'string' && 
         typeof (data as JikoPRData).content === 'string';
}; 