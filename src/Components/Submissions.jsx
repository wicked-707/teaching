// src/components/Submissions.jsx
import React, { useState } from 'react';
import SchemesofWork from './SchemesofWork';
import LessonPlan from './LessonPlan';
import RecordOfWork from './RecordOfWork';

const Submissions = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  const renderForm = () => {
    switch (selectedForm) {
      case 'assessment':
        return <SchemesofWork />;
      case 'lessonPlan':
        return <LessonPlan />;
      case 'recordOfWork':
        return <RecordOfWork />;
      default:
        return <p>Please select the activity to fill and submit.</p>;
    }
  };

  return (
    <div className="p-6">
        
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <div className="mb-4">
        <button
          onClick={() => setSelectedForm('assessment')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Scheme Of Work
        </button>
        <button
          onClick={() => setSelectedForm('lessonPlan')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Lesson Plan
        </button>
        <button
          onClick={() => setSelectedForm('recordOfWork')}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Records of Work
        </button>
      </div>
      <div className="mt-4">
        {renderForm()}
      </div>
    </div>
  );
};

export default Submissions;
