console.log("EasyEntry content script loaded on:", window.location.href);
console.log("Hostname:", window.location.hostname.toLowerCase());
console.log("Pathname:", window.location.pathname.toLowerCase());

// Helper function to safely set input values
function setInputValue(selector, value) {
  if (!value) return false;
  
  const element = document.querySelector(selector);
  if (!element) return false;
  
  // Handle different input types
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.value = value;
    
    // Trigger events to ensure the website recognizes the change
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  
  return false;
}

// Helper function to select radio buttons or checkboxes
function selectOption(selector, value) {
  if (!value) return false;
  
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    if (element.value === value || element.textContent.trim() === value) {
      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

// Helper function to select dropdown options
function selectDropdown(selector, value) {
  if (!value) return false;
  
  const select = document.querySelector(selector);
  if (!select) return false;
  
  // Try to find option by value or text
  for (const option of select.options) {
    if (option.value === value || option.textContent.trim() === value) {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

// Rikunabi-specific form filling adapter
function fillRikunabiForm(data) {
  console.log("Filling Rikunabi form with data:", data);
  let filledFields = 0;
  
  const { personalInfo, education, workExperience, jikoPR } = data;
  
  // Personal Information
  if (personalInfo) {
    // Split full name into last and first name (common in Japan)
    const nameParts = personalInfo.fullName.split(' ');
    const lastName = nameParts[0] || '';
    const firstName = nameParts.slice(1).join(' ') || '';
    
    // Common field selectors for Japanese job sites
    if (setInputValue('input[name*="nmSei"], input[name*="lastName"], #shimei_sei_id', lastName)) filledFields++;
    if (setInputValue('input[name*="nmMei"], input[name*="firstName"], #shimei_mei_id', firstName)) filledFields++;
    
    // Furigana (phonetic reading)
    if (personalInfo.furiganaName) {
      const furiganaParts = personalInfo.furiganaName.split(' ');
      const lastNameFurigana = furiganaParts[0] || '';
      const firstNameFurigana = furiganaParts.slice(1).join(' ') || '';
      
      if (setInputValue('input[name*="nmSeiKana"], input[name*="lastNameKana"]', lastNameFurigana)) filledFields++;
      if (setInputValue('input[name*="nmMeiKana"], input[name*="firstNameKana"]', firstNameFurigana)) filledFields++;
    }
    
    // Email
    if (setInputValue('input[type="email"], input[name*="email"], input[name*="mail"]', personalInfo.email)) filledFields++;
    
    // Phone number
    if (personalInfo.phoneNumber) {
      if (setInputValue('input[name*="tel"], input[name*="phone"]', personalInfo.phoneNumber)) filledFields++;
    }
    
    // Birth date
    if (personalInfo.birthDate) {
      const birthDateParts = personalInfo.birthDate.split('-');
      if (birthDateParts.length === 3) {
        const [year, month, day] = birthDateParts;
        
        // Try different date field patterns
        selectDropdown('select[name*="birthYear"], select[name*="birth_year"]', year);
        selectDropdown('select[name*="birthMonth"], select[name*="birth_month"]', month);
        selectDropdown('select[name*="birthDay"], select[name*="birth_day"]', day);
        
        // Alternative: single date input
        setInputValue('input[type="date"], input[name*="birth"]', personalInfo.birthDate);
        filledFields++;
      }
    }
    
    // Address
    if (personalInfo.address) {
      if (setInputValue('input[name*="postalCode"], input[name*="zipcode"]', personalInfo.address.postalCode)) filledFields++;
      if (selectDropdown('select[name*="prefecture"], select[name*="pref"]', personalInfo.address.prefecture)) filledFields++;
      if (setInputValue('input[name*="city"], input[name*="addr1"]', personalInfo.address.city)) filledFields++;
      if (setInputValue('input[name*="address"], input[name*="addr2"]', personalInfo.address.streetAddress)) filledFields++;
    }
  }
  
  // Education
  if (education) {
    const eduData = Array.isArray(education) ? education[0] : education; // Use first education entry
    
    if (setInputValue('input[name*="school"], input[name*="university"]', eduData.school)) filledFields++;
    if (setInputValue('input[name*="faculty"], input[name*="department"]', eduData.faculty)) filledFields++;
    if (setInputValue('input[name*="degree"], input[name*="major"]', eduData.degree)) filledFields++;
    
    // Education dates
    if (eduData.startDate) {
      const [year, month] = eduData.startDate.split('-');
      selectDropdown('select[name*="eduStartYear"]', year);
      selectDropdown('select[name*="eduStartMonth"]', month);
    }
    
    if (eduData.endDate) {
      const [year, month] = eduData.endDate.split('-');
      selectDropdown('select[name*="eduEndYear"]', year);
      selectDropdown('select[name*="eduEndMonth"]', month);
    }
    
    // Education status
    if (eduData.status) {
      selectDropdown('select[name*="eduStatus"], select[name*="graduation"]', eduData.status);
    }
  }
  
  // Work Experience
  if (workExperience) {
    const workData = Array.isArray(workExperience) ? workExperience[0] : workExperience; // Use first work experience
    
    if (setInputValue('input[name*="company"], input[name*="workplace"]', workData.company)) filledFields++;
    if (setInputValue('input[name*="position"], input[name*="job"]', workData.position)) filledFields++;
    if (setInputValue('textarea[name*="workDesc"], textarea[name*="experience"]', workData.description)) filledFields++;
    
    // Work dates
    if (workData.startDate) {
      const [year, month] = workData.startDate.split('-');
      selectDropdown('select[name*="workStartYear"]', year);
      selectDropdown('select[name*="workStartMonth"]', month);
    }
    
    if (workData.endDate && workData.endDate !== 'Present') {
      const [year, month] = workData.endDate.split('-');
      selectDropdown('select[name*="workEndYear"]', year);
      selectDropdown('select[name*="workEndMonth"]', month);
    }
  }
  
  // Self Promotion (Jiko PR)
  if (jikoPR) {
    const prData = Array.isArray(jikoPR) ? jikoPR[0] : jikoPR; // Use first PR entry
    
    if (setInputValue('textarea[name*="jiko"], textarea[name*="pr"], textarea[name*="appeal"]', prData.content)) filledFields++;
    if (setInputValue('textarea[name*="motivation"], textarea[name*="志望動機"]', prData.content)) filledFields++;
  }
  
  return filledFields;
}

// Demo application form filling adapter
function fillDemoApplicationForm(data) {
  console.log("Filling demo application form with data:", data);
  let filledFields = 0;
  
  const { personalInfo, education, workExperience, jikoPR } = data;
  
  // Personal Information
  if (personalInfo) {
    // Split full name into first and last name
    const nameParts = personalInfo.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    if (setInputValue('input[name="firstName"]', firstName)) filledFields++;
    if (setInputValue('input[name="lastName"]', lastName)) filledFields++;
    if (setInputValue('input[name="email"]', personalInfo.email)) filledFields++;
    if (setInputValue('input[name="phone"]', personalInfo.phoneNumber)) filledFields++;
    
    // Address fields
    if (personalInfo.address) {
      if (setInputValue('input[name="address"]', personalInfo.address.streetAddress)) filledFields++;
      if (setInputValue('input[name="city"]', personalInfo.address.city)) filledFields++;
      if (setInputValue('input[name="state"]', personalInfo.address.prefecture)) filledFields++;
    }
  }
  
  // Education
  if (education) {
    const eduData = Array.isArray(education) ? education[0] : education;
    
    if (setInputValue('input[name="university"]', eduData.school)) filledFields++;
    if (setInputValue('input[name="major"]', eduData.faculty || eduData.degree)) filledFields++;
    if (selectDropdown('select[name="degree"]', eduData.degree)) filledFields++;
    if (setInputValue('input[name="graduationDate"]', eduData.endDate)) filledFields++;
  }
  
  // Work Experience
  if (workExperience) {
    const workData = Array.isArray(workExperience) ? workExperience[0] : workExperience;
    
    if (setInputValue('input[name="currentCompany"]', workData.company)) filledFields++;
    if (setInputValue('input[name="currentPosition"]', workData.position)) filledFields++;
    if (setInputValue('input[name="workStartDate"]', workData.startDate)) filledFields++;
    if (workData.endDate && workData.endDate !== 'Present') {
      if (setInputValue('input[name="workEndDate"]', workData.endDate)) filledFields++;
    }
    if (setInputValue('textarea[name="responsibilities"]', workData.description)) filledFields++;
  }
  
  // Skills (if available in qualificationOrSkill data)
  if (data.qualificationOrSkill) {
    const skills = Array.isArray(data.qualificationOrSkill) ? 
      data.qualificationOrSkill.map(skill => skill.name).join(', ') : 
      data.qualificationOrSkill.name;
    if (setInputValue('textarea[name="skills"]', skills)) filledFields++;
  }
  
  // Cover Letter / Self Promotion
  if (jikoPR) {
    const prData = Array.isArray(jikoPR) ? jikoPR[0] : jikoPR;
    if (setInputValue('textarea[name="coverLetter"]', prData.content)) filledFields++;
  }
  
  // Additional fields that could be filled if available in personalInfo
  if (personalInfo) {
    // These would need to be added to the profile data structure if needed
    // For now, we'll leave them for manual entry
    // if (setInputValue('input[name="linkedinUrl"]', personalInfo.linkedinUrl)) filledFields++;
    // if (setInputValue('input[name="portfolioUrl"]', personalInfo.portfolioUrl)) filledFields++;
  }
  
  return filledFields;
}

// Generic form filling adapter (fallback)
function fillGenericForm(data) {
  console.log("Filling generic form with data:", data);
  let filledFields = 0;
  
  const { personalInfo, jikoPR } = data;
  
  // Basic personal info
  if (personalInfo) {
    if (setInputValue('input[type="email"]', personalInfo.email)) filledFields++;
    if (setInputValue('input[name*="name"]', personalInfo.fullName)) filledFields++;
  }
  
  // Basic text areas
  if (jikoPR) {
    const prData = Array.isArray(jikoPR) ? jikoPR[0] : jikoPR;
    if (setInputValue('textarea', prData.content)) filledFields++;
  }
  
  return filledFields;
}

// Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request.type, "on", window.location.href);
  if (request.type === "FILL_FORM") {
    console.log("Received data to fill:", request.data);
    
    try {
      let filledFields = 0;
      
      // Detect which site we're on and use appropriate adapter
      const hostname = window.location.hostname.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      
      if (hostname.includes('rikunabi') || hostname.includes('recruit.co.jp')) {
        filledFields = fillRikunabiForm(request.data);
      } else if (hostname === 'localhost' && pathname.includes('/demo-application')) {
        filledFields = fillDemoApplicationForm(request.data);
      } else {
        filledFields = fillGenericForm(request.data);
      }
      
      console.log(`Filled ${filledFields} fields`);
      
      // Send success response
      sendResponse({ 
        status: "success", 
        message: `Successfully filled ${filledFields} fields`,
        filledFields: filledFields
      });
      
      // Show a brief notification to the user
      if (filledFields > 0) {
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
          ">
            ✓ EasyEntry: Filled ${filledFields} fields
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error filling form:', error);
      sendResponse({ 
        status: "error", 
        message: error.message 
      });
    }
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
}); 