import React from 'react';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Help & Support</h1>
        <p className="text-gray-600 mb-6">Find quick answers to common questions.</p>
        <div className="bg-white rounded-lg shadow divide-y">
          <details className="p-4" open>
            <summary className="font-semibold cursor-pointer">How do I reset my password?</summary>
            <p className="mt-2 text-gray-600">Use the "Forgot Password" link on the login page and follow the instructions.</p>
          </details>
          <details className="p-4">
            <summary className="font-semibold cursor-pointer">Where can I view my courses?</summary>
            <p className="mt-2 text-gray-600">Navigate to the Courses page from the sidebar to manage your courses.</p>
          </details>
          <details className="p-4">
            <summary className="font-semibold cursor-pointer">Who do I contact for support?</summary>
            <p className="mt-2 text-gray-600">Email support@campushub360.edu for assistance.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Help;


