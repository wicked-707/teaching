// src/components/LessonPlan.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LessonPlan = () => {
  const [studentDetails, setStudentDetails] = useState({ name: '', studentNumber: '' });
  const [subjects, setSubjects] = useState([
    {
      name: '',
      topics: [
        {
          name: '',
          subtopics: [
            {
              name: '',
              date: '',
              time: '',
              objectives: {
                introduction: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
                development: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
                conclusion: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
              },
            },
          ],
        },
      ],
    },
  ]);

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

  const addSubject = () => {
    setSubjects([...subjects, { name: '', topics: [{ name: '', subtopics: [newSubtopic()] }] }]);
  };

  const addTopic = (subjectIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].topics.push({ name: '', subtopics: [newSubtopic()] });
    setSubjects(updatedSubjects);
  };

  const addSubtopic = (subjectIndex, topicIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].topics[topicIndex].subtopics.push(newSubtopic());
    setSubjects(updatedSubjects);
  };

  const newSubtopic = () => ({
    name: '',
    date: '',
    time: '',
    objectives: {
      introduction: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
      development: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
      conclusion: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
    },
  });

  const handleChange = (e, subjectIndex, topicIndex, subtopicIndex, group, field) => {
    const { name, value } = e.target;
    const updatedSubjects = [...subjects];
    if (group) {
      updatedSubjects[subjectIndex].topics[topicIndex].subtopics[subtopicIndex].objectives[group][field] = value;
    } else {
      updatedSubjects[subjectIndex].topics[topicIndex].subtopics[subtopicIndex][field] = value;
    }
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lessonPlanData = { studentDetails, subjects };
    try {
      await axios.post('/api/submit-lesson-plan', lessonPlanData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Lesson Plan submitted successfully!');
    } catch (error) {
      console.error('Error submitting lesson plan:', error);
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

      <h2>Lesson Plan</h2>
      {subjects.map((subject, subjectIndex) => (
        <div key={subjectIndex}>
          <h3>Subject</h3>
          <div>
            <label>Subject Name: </label>
            <input type="text" value={subject.name} onChange={(e) => handleChange(e, subjectIndex)} name="name" required />
          </div>
          {subject.topics.map((topic, topicIndex) => (
            <div key={topicIndex}>
              <h4>Topic</h4>
              <div>
                <label>Topic Name: </label>
                <input type="text" value={topic.name} onChange={(e) => handleChange(e, subjectIndex, topicIndex)} name="name" required />
              </div>
              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <div key={subtopicIndex}>
                  <h5>Subtopic</h5>
                  <div>
                    <label>Subtopic Name: </label>
                    <input type="text" value={subtopic.name} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="name" required />
                  </div>
                  <div>
                    <label>Date: </label>
                    <input type="date" value={subtopic.date} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="date" required />
                  </div>
                  <div>
                    <label>Time: </label>
                    <input type="time" value={subtopic.time} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="time" required />
                  </div>
                  <h6>Lesson Objectives</h6>
                  {['introduction', 'development', 'conclusion'].map((group) => (
                    <div key={group}>
                      <h7>{group.charAt(0).toUpperCase() + group.slice(1)}</h7>
                      {['time', 'content', 'teacherActivity', 'learnersActivity', 'resources'].map((field) => (
                        <div key={field}>
                          <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
                          <input type="text" value={subtopic.objectives[group][field]} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex, group, field)} name={field} required />
                        </div>
                      ))}
                    </div>
                  ))}
                  <button type="button" onClick={() => addSubtopic(subjectIndex, topicIndex)}>Add Subtopic</button>
                </div>
              ))}
              <button type="button" onClick={() => addTopic(subjectIndex)}>Add Topic</button>
            </div>
          ))}
          <button type="button" onClick={addSubject}>Add Subject</button>
        </div>
      ))}
      <button type="submit">Submit Lesson Plan</button>
    </form>
  );
};

export default LessonPlan;
