# EasyEntry Web Application

The user-facing website for EasyEntry - an AI-powered resume auto-fill assistant that streamlines job applications.

## Features

- **User Authentication**: Secure sign-up and login with Firebase Authentication
- **Resume Upload**: Drag-and-drop interface for uploading PDF and Word documents
- **Real-time Dashboard**: View uploaded resumes and their processing status
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **File Upload**: React Dropzone

## Prerequisites

Before setting up the project, make sure you have:

1. Node.js 18+ installed
2. A Firebase project with the following services enabled:
   - Authentication (Email/Password provider)
   - Firestore Database
   - Storage
   - (Optional) Firebase Functions for resume parsing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following services:
   - **Authentication**: Go to Authentication > Sign-in method, enable Email/Password
   - **Firestore**: Create a database in production mode
   - **Storage**: Create a default storage bucket

3. Get your Firebase configuration:
   - Go to Project Settings > General > Your apps
   - Click "Add app" and select Web
   - Copy the configuration object

4. Create environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Configure Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own resumes
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Storage Security Rules

Configure Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own resume files
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Sign-up page
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Landing page
├── components/           # Reusable components
│   ├── FileUpload.tsx   # File upload component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
└── lib/                # Utilities and configurations
    └── firebase.ts     # Firebase configuration
```

## Key Features Explained

### Authentication Flow
- Users can sign up with email/password
- Authentication state is managed globally via React Context
- Protected routes automatically redirect unauthenticated users
- Dashboard is only accessible to logged-in users

### File Upload System
- Supports PDF, DOC, and DOCX files up to 5MB
- Files are uploaded to Firebase Storage with user-specific paths
- Metadata is stored in Firestore for tracking and retrieval
- Real-time progress indicators during upload

### Real-time Dashboard
- Uses Firestore's real-time listeners to show live updates
- Displays upload status (processing, completed, error)
- Shows parsed resume data when available
- Clean, responsive design for easy navigation

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

## Development vs Production

The application is configured to use Firebase emulators in development mode for testing without affecting production data. In production, it connects directly to your Firebase project.

## Next Steps

After setting up the web application:

1. **Firebase Functions**: Set up serverless functions for resume parsing
2. **Chrome Extension**: Build the browser extension for auto-filling forms
3. **Advanced Features**: Add resume editing, multiple resume support, etc.

## Troubleshooting

### Common Issues

1. **Firebase connection errors**: Verify your environment variables and Firebase project configuration
2. **Authentication issues**: Ensure Email/Password provider is enabled in Firebase Console
3. **Upload failures**: Check Firebase Storage rules and bucket configuration
4. **Build errors**: Ensure all dependencies are installed and environment variables are set

### Development Tips

- Use Firebase Emulator Suite for local development
- Check browser console for detailed error messages
- Verify Firestore and Storage security rules
- Test with different file types and sizes

## Contributing

This is part of the EasyEntry project. Follow the established patterns for components, styling, and Firebase integration when making changes.
