'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Zap, Shield, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null; // Prevent flash of landing page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">EasyEntry</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Streamline Your Job Applications with{' '}
            <span className="text-blue-600">AI-Powered Auto-Fill</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your resume once, and let EasyEntry automatically fill job application forms 
            across the web. Save hours of repetitive data entry and focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo-application"
              className="inline-flex items-center px-8 py-3 border border-blue-300 text-base font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Try Demo Application
              <FileText className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Fill out job applications in seconds, not minutes. Our AI understands your resume 
                and maps it to application forms automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your personal information is encrypted and stored securely. We never share your 
                data with third parties or use it for advertising.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accurate Results</h3>
              <p className="text-gray-600">
                Advanced AI parsing ensures your information is correctly formatted and placed 
                in the right fields every time.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Try EasyEntry with Our Demo Application
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience how EasyEntry works by filling out our realistic demo job application. 
              It's perfect for testing the auto-fill functionality and learning how to use the system.
            </p>
            <Link
              href="/demo-application"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Open Demo Application
              <FileText className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How EasyEntry Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 mx-auto mb-4 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your resume in PDF or Word format. Our AI will parse and structure your information.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 mx-auto mb-4 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Install Browser Extension</h3>
              <p className="text-gray-600">
                Add our Chrome extension to automatically detect and fill job application forms.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 mx-auto mb-4 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply Effortlessly</h3>
              <p className="text-gray-600">
                Click a button and watch as your information automatically fills the application form.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to revolutionize your job search?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of job seekers who are saving time and landing more interviews with EasyEntry.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-xl font-bold">EasyEntry</span>
          </div>
          <p className="text-gray-400">
            Streamline your job applications with AI-powered auto-fill technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
