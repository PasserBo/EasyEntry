'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UploadProgress {
  progress: number;
  fileName: string;
}

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      setError('You must be logged in to upload files');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploadProgress({ progress: 0, fileName: file.name });

    try {
      // Create a reference to store the file
      const fileRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${file.name}`);
      
      // Start the upload
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({ progress, fileName: file.name });
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload file. Please try again.');
          setUploadProgress(null);
        },
        async () => {
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save resume metadata to Firestore
            await addDoc(collection(db, 'resumes'), {
              userId: user.uid,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              downloadURL,
              uploadedAt: serverTimestamp(),
              status: 'processing', // Will be updated by the Firebase Function
              parsedData: null,
            });

            setUploadProgress(null);
            onUploadComplete?.();
          } catch (error) {
            console.error('Error saving resume metadata:', error);
            setError('File uploaded but failed to save metadata. Please try again.');
            setUploadProgress(null);
          }
        }
      );
    } catch (error) {
      console.error('Upload initiation error:', error);
      setError('Failed to start upload. Please try again.');
      setUploadProgress(null);
    }
  }, [user, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const clearError = () => setError('');

  if (uploadProgress) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <p className="text-sm text-gray-600 mb-2">Uploading {uploadProgress.fileName}...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{Math.round(uploadProgress.progress)}% complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-sm text-blue-600">Drop your resume here...</p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your resume here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, and DOCX files up to 5MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 