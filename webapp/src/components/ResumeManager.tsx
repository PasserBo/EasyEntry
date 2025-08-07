'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FileUpload from './FileUpload';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: { toDate?: () => Date };
  status: 'processing' | 'completed' | 'error';
  parsedData?: Record<string, unknown>;
}

export default function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for user's resumes
    const q = query(
      collection(db, 'resumes'),
      where('userId', '==', user.uid),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resumeList: Resume[] = [];
      snapshot.forEach((doc) => {
        resumeList.push({ id: doc.id, ...doc.data() } as Resume);
      });
      setResumes(resumeList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: Resume['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Resume['status']) => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Ready';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resume Upload & Management</h2>
        <p className="text-sm text-gray-600">Upload and manage your resume files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Upload New Resume
              </h3>
              <FileUpload onUploadComplete={() => {
                // Refresh will happen automatically via real-time listener
              }} />
            </div>
          </div>
        </div>

        {/* Resumes List */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Resumes
              </h3>
              
              {resumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">No resumes uploaded yet.</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your first resume to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {resume.fileName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(resume.fileSize)} • 
                              {resume.uploadedAt?.toDate?.()?.toLocaleDateString() || 'Recently uploaded'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(resume.status)}
                            <span className="text-sm text-gray-600">
                              {getStatusText(resume.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {resume.status === 'completed' && resume.parsedData && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">Parsed Information:</p>
                          <div className="bg-gray-50 rounded p-2 text-xs">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(resume.parsedData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 