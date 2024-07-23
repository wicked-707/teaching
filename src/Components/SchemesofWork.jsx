// src/components/AssessmentForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemesofWork = () => {
  const [studentDetails, setStudentDetails] = useState({ name: '', studentNumber: '' });
  const [schoolDetails, setSchoolDetails] = useState({ schoolName: '', formGrade: '', primarySubject: '', year: '', term: '' });
  const [schemesOfWork, setSchemesOfWork] = useState([{ week: 1, lessons: [{ lessonNumber: 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' }] }]);

  // Fetch student details from token
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get('/api/student-details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStudentDetails(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudentDetails();
  }, []);

  const addWeek = () => {
    setSchemesOfWork([...schemesOfWork, { week: schemesOfWork.length + 1, lessons: [{ lessonNumber: 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' }] }]);
  };

  const addLesson = (weekIndex) => {
    const updatedSchemesOfWork = [...schemesOfWork];
    updatedSchemesOfWork[weekIndex].lessons.push({ lessonNumber: updatedSchemesOfWork[weekIndex].lessons.length + 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' });
    setSchemesOfWork(updatedSchemesOfWork);
  };

  const handleChange = (e, weekIndex, lessonIndex) => {
    const { name, value } = e.target;
    const updatedSchemesOfWork = [...schemesOfWork];
    updatedSchemesOfWork[weekIndex].lessons[lessonIndex][name] = value;
    setSchemesOfWork(updatedSchemesOfWork);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assessmentData = { studentDetails, schoolDetails, schemesOfWork };
    try {
      await axios.post('/api/submit-assessment', assessmentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Assessment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Student Details</h2>
      <div>
        <label>Name: {studentDetails.name}</label>
      </div>
      <div>
        <label>Student Number: {studentDetails.studentNumber}</label>
      </div>

      <h2>School Details</h2>
      <div>
        <label>School Name: </label>
        <input type="text" value={schoolDetails.schoolName} onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolName: e.target.value })} required />
      </div>
      <div>
        <label>Form/Grade: </label>
        <input type="text" value={schoolDetails.formGrade} onChange={(e) => setSchoolDetails({ ...schoolDetails, formGrade: e.target.value })} required />
      </div>
      <div>
        <label>Primary Subject: </label>
        <input type="text" value={schoolDetails.primarySubject} onChange={(e) => setSchoolDetails({ ...schoolDetails, primarySubject: e.target.value })} required />
      </div>
      <div>
        <label>Year: </label>
        <input type="text" value={schoolDetails.year} onChange={(e) => setSchoolDetails({ ...schoolDetails, year: e.target.value })} required />
      </div>
      <div>
        <label>Term: </label>
        <input type="text" value={schoolDetails.term} onChange={(e) => setSchoolDetails({ ...schoolDetails, term: e.target.value })} required />
      </div>

      <h2>Schemes of Work</h2>
      {schemesOfWork.map((week, weekIndex) => (
        <div key={weekIndex}>
          <h3>Week {week.week}</h3>
          {week.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex}>
              <h4>Lesson {lesson.lessonNumber}</h4>
              <div>
                <label>Instructional Objectives/Learning outcomes: </label>
                <input type="text" name="objectives" value={lesson.objectives} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Life Approach: </label>
                <input type="text" name="lifeApproach" value={lesson.lifeApproach} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Teaching activities: </label>
                <input type="text" name="activities" value={lesson.activities} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Methods/strategies: </label>
                <input type="text" name="methods" value={lesson.methods} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Resources/references: </label>
                <input type="text" name="resources" value={lesson.resources} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Assessment: </label>
                <input type="text" name="assessment" value={lesson.assessment} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
              <div>
                <label>Remarks: </label>
                <input type="text" name="remarks" value={lesson.remarks} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addLesson(weekIndex)}>Add Lesson</button>
        </div>
      ))}
      <button type="button" onClick={addWeek}>Add Week</button>
      <button type="submit">Submit Assessment</button>
    </form>
  );
};

export default SchemesofWork;
