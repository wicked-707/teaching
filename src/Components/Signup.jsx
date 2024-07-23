import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
    date_of_birth: '',
    gender: '',
    email: '',
    phone_number: '',
    university_name: '',
    course_name: '',
    specialization: '',
    graduation_date: '',
    primary_teaching_subject: '',
    secondary_teaching_subject: '',
    kenya_county: '',
    hashed_password: '',
    confirm_pass: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    console.log('Current Step:', currentStep);
    console.log('Form Data:', formData);
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    console.log('Current Step:', currentStep);
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({});

    // Validate passwords
    if (formData.hashed_password !== formData.confirm_pass) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: 'Passwords do not match'
      }));
      return;
    }

    try {
      // Validate required fields
      const requiredFields = [
        'first_name', 'last_name', 'id_number', 'date_of_birth', 'gender', 'email', 'phone_number',
        'university_name', 'course_name', 'specialization', 'graduation_date',
        'primary_teaching_subject', 'secondary_teaching_subject', 'kenya_county', 'hashed_password'
      ];

      const errorsObj = {};
      let hasErrors = false;

      requiredFields.forEach(field => {
        if (!formData[field]) {
          errorsObj[field] = 'This field is required';
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setErrors(errorsObj);
        return;
      }

      // Send data to backend
      const response = await axios.post('http://localhost:5000/student', formData);
      console.log(response.data); // Assuming response contains the newly created student data

      if (response.status === 200){
        setSuccess('signUp successful');
      }
      // Optionally: Redirect to another page upon successful signup
      // history.push('/dashboard'); // Import history from react-router-dom

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to sign up');
    }
  };

  return (
  <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-screen mx-auto p-8 bg-slate-100 shadow-lg rounded-lg">
      
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-4">We're excited you're joining us in shaping the future of education</h1>
          <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
            To get started, we need some key information about your school.
          </h2>      
          <div className="p-8 max-w-md w-full">
            {/* Form fields for Step 1 */}
             {/* First Name */}
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        {errors.first_name && <span className="error">{errors.first_name}</span>}

        {/* Last Name */}
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        {errors.last_name && <span className="error">{errors.last_name}</span>}

        {/* ID Number */}
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleChange}
          placeholder="ID Number"
          required
        />
        {errors.id_number && <span className="error">{errors.id_number}</span>}

        {/* Date of Birth */}
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}

        {/* Gender */}
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
            {/* ... */}
            <div className="flex justify-between w-full">
              <Link to="/loginchoice" className="text-cyan-500 pr-4 py-1 pl-3 rounded-3xl hover:underline flex items-center bg-slate-950 lg:ml-[18px]">
                Back
              </Link>
              <button 
                type="button" 
                onClick={handleNext} 
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Educational Details */}
      {currentStep === 2 && (
        <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
          {/* Content for Step 2 */}
          {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}

        {/* Phone Number */}
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        {errors.phone_number && <span className="error">{errors.phone_number}</span>}

        {/* University Name */}
        <input
          type="text"
          name="university_name"
          value={formData.university_name}
          onChange={handleChange}
          placeholder="University Name"
          required
        />
        {errors.university_name && <span className="error">{errors.university_name}</span>}

        {/* Course Name */}
        <input
          type="text"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          placeholder="Course Name"
          required
        />
        {errors.course_name && <span className="error">{errors.course_name}</span>}

          {/* ... */}
          <div className="p-8 max-w-md w-full">
            {/* Form fields for Step 2 */}
            {/* ... */}
            <div className="flex justify-between w-full">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Location Details */}
      {currentStep === 3 && (
        <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
          {/* Content for Step 3 */}
          {/* ... */}
          <div className="p-8 max-w-md w-full">
            {/* Form fields for Step 3 */}
            {/* Specialization */}
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          required
        />
        {errors.specialization && <span className="error">{errors.specialization}</span>}

        {/* Graduation Date */}
        <input
          type="date"
          name="graduation_date"
          value={formData.graduation_date}
          onChange={handleChange}
          required
        />
        {errors.graduation_date && <span className="error">{errors.graduation_date}</span>}

        {/* Primary Teaching Subject */}
        <input
          type="text"
          name="primary_teaching_subject"
          value={formData.primary_teaching_subject}
          onChange={handleChange}
          placeholder="Primary Teaching Subject"
          required
        />
        {errors.primary_teaching_subject && <span className="error">{errors.primary_teaching_subject}</span>}

        {/* Secondary Teaching Subject */}
        <input
          type="text"
          name="secondary_teaching_subject"
          value={formData.secondary_teaching_subject}
          onChange={handleChange}
          placeholder="Secondary Teaching Subject"
          required
        />
        {errors.secondary_teaching_subject && <span className="error">{errors.secondary_teaching_subject}</span>}

        {/* Kenya County */}
        <input
          type="text"
          name="kenya_county"
          value={formData.kenya_county}
          onChange={handleChange}
          placeholder="Kenya County"
          required
        />
        {errors.kenya_county && <span className="error">{errors.kenya_county}</span>}
            <div className="flex justify-between w-full">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Password */}
      {currentStep === 4 && (
        <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
          {/* Content for Step 4 */}
          <div className="p-8 max-w-md w-full">
            {/* Form fields for Step 4 */}
            {/* Hashed Password */}
        <input
          type="password"
          name="hashed_password"
          value={formData.hashed_password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {errors.hashed_password && <span className="error">{errors.hashed_password}</span>}

        {/* Confirm Password */}
        <input
          type="password"
          name="confirm_pass"
          value={formData.confirm_pass}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        {errors.confirm_pass && <span className="error">{errors.confirm_pass}</span>}
            <div className="flex justify-between w-full">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Signup;
