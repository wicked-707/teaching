import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VacancyDetail = () => {
  const { vancancy_id } = useParams();
  console.log(vancancy_id);
  const [vacancyDetails, setVacancyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacancyDetails = async () => {
    if (!vancancy_id || vancancy_id === ':vancancy_id') {
      console.error('Invalid vancancy_id:', vancancy_id);
      setError('Invalid Vacancy ID');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching vacancy details for ID:', vancancy_id);
      const response = await axios.get(`api/vacancy/${vancancy_id}`,{
        headers:{
          "ngrok-skip-browser-warning": '69420',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        
      });

      const data = response.data;  // Define data here
      setVacancyDetails(data);

      console.log('Response:', response);
      setVacancyDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vacancy details:', err);
      setError(`Error fetching vacancy details: ${err.message}`);
      setLoading(false);
    }
  };

  fetchVacancyDetails();
}, [vancancy_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!vacancyDetails) return <div>Vacancy not found</div>;

  return (
    <div>
      <h1>{vacancyDetails.primary_subject} - {vacancyDetails.secondary_subject}</h1>
      <p>Positions Available: {vacancyDetails.positions_available}</p>
      <p>Start Date: {vacancyDetails.start_date}</p>
      <p>End Date: {vacancyDetails.end_date}</p>
      <p>Application Deadline: {vacancyDetails.application_deadline}</p>
      <p>Application Method: {vacancyDetails.application_method}</p>
      <p>Coordinator Name: {vacancyDetails.coordinator_name}</p>
      <p>Coordinator Email: {vacancyDetails.coordinator_email}</p>
      <p>Coordinator Phone: {vacancyDetails.coordinator_phone}</p>
      <p>Accommodation Provided: {vacancyDetails.accommodation_provided ? 'Yes' : 'No'}</p>
      <p>Stipend Amount: {vacancyDetails.stipend_amount}</p>
      <h2>School Information</h2>
      <p>School Name: {vacancyDetails.school_name}</p>
      <p>Official Email: {vacancyDetails.official_email}</p>
      <p>Official Phone Number: {vacancyDetails.official_phone_number}</p>
      <p>County: {vacancyDetails.county}</p>
      <img src={vacancyDetails.school_photo_url} alt="School" />
    </div>
  );
};

export default VacancyDetail;
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const VacancyDetail = () => {
//   const { vancancy_id } = useParams();
//   const [vacancyDetails, setVacancyDetails] = useState(null);

//   console.log(vancancy_id); // Log to verify the parameter

//   useEffect(() => {
//     const fetchVacancyDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/vacancy/${vancancy_id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch vacancy details: ' + response.statusText);
//         }
//         console.log(response.data)
//         const data = await response.json();
//         setVacancyDetails(data);
//       } catch (error) {
//         console.error('Error fetching vacancy details:', error);
//       }
//     };

//     fetchVacancyDetails();
//   }, [vancancy_id]);

//   if (!vacancyDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>{vacancyDetails.primary_subject} - {vacancyDetails.secondary_subject}</h1>
//       <p>Positions Available: {vacancyDetails.positions_available}</p>
//       <p>Start Date: {vacancyDetails.start_date}</p>
//       <p>End Date: {vacancyDetails.end_date}</p>
//       <p>Application Deadline: {vacancyDetails.application_deadline}</p>
//       <p>Application Method: {vacancyDetails.application_method}</p>
//       <p>Coordinator Name: {vacancyDetails.coordinator_name}</p>
//       <p>Coordinator Email: {vacancyDetails.coordinator_email}</p>
//       <p>Coordinator Phone: {vacancyDetails.coordinator_phone}</p>
//       <p>Accommodation Provided: {vacancyDetails.accommodation_provided}</p>
//       <p>Stipend Amount: {vacancyDetails.stipend_amount}</p>
//       <h2>School Information</h2>
//       <p>School Name: {vacancyDetails.school_name}</p>
//       <p>Official Email: {vacancyDetails.official_email}</p>
//       <p>Official Phone Number: {vacancyDetails.official_phone_number}</p>
//       <p>County: {vacancyDetails.county}</p>
//       <img src={vacancyDetails.school_photo_url} alt="School" />
//     </div>
//   );
// };

// export default VacancyDetail;
