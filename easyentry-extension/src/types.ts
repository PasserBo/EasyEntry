// Type definitions for the EasyEntry Chrome extension

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

// Compiled data structure for form filling
export interface CompiledPresetData {
  personalInfo?: PersonalInfoData | PersonalInfoData[];
  education?: EducationData | EducationData[];
  workExperience?: WorkExperienceData | WorkExperienceData[];
  qualificationOrSkill?: QualificationSkillData | QualificationSkillData[];
  jikoPR?: JikoPRData | JikoPRData[];
} 