const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// const DB_USER = 'postgres';
// const DB_PASSWORD = '960X513OV';
// const DB_HOST = 'localhost';
// const DB_PORT = 5432;
// const DB_NAME = 'tp';


const app = express();
const port = 5000;

// Middleware
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin']
}));

const JWT_SECRET = process.env.JWT_SECRET;





// PostgreSQL Pool

const pool = new Pool({
  user: 'postgres',
  password: 'drowssap',
  host: 'localhost',
  port: 5432,
  database: 'tp',
  // JWT_SECRET:'191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
  ssl: false, // Set to true if your PostgreSQL server requires SSL
  auth: {
    method: 'scram-sha-256' // Adjust based on your PostgreSQL authentication method
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});


cloudinary.config({
  cloud_name: 'dmfa4ntvh',
  api_key: '275433718151248',
  api_secret: 'QYcCgy1iH5nCM47Ck-v7EOlLulo'
});

// Configure multer for Cloudinary upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'high_school_photos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });










// Fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const allCourses = await pool.query('SELECT * FROM course');
    res.json(allCourses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});











// -----------------------------------------------------------------------------------

// Student signUp
app.post('/student', async (req, res) => {
  try {
    const {
      first_name, last_name, id_number,email, phone_number,
      university_id, graduation_date,
      primary_teaching_subject, secondary_teaching_subject, kenya_county, hashed_password, confirm_pass
    } = req.body;

    // Check if passwords match
    if (hashed_password !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing student
    const existingStudent = await pool.query(
      'SELECT * FROM student WHERE id_number = $1 OR email = $2',
      [id_number, email]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ msg: 'Student with this ID number or email already exists' });
    }

    // Hash the password
    // const hashedPass = await bcrypt.hash(hashed_password, 10);

    // Insert into database
    const newStudent = await pool.query(
      `INSERT INTO student (
        first_name, last_name, id_number,  email, phone_number,
        university_id, graduation_date, primary_teaching_subject, secondary_teaching_subject,
        kenya_county, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
                $8, $9, $10, $11)
       RETURNING *`,
      [
        first_name, last_name, id_number, email, phone_number,
        university_id, graduation_date, primary_teaching_subject, secondary_teaching_subject,
        kenya_county, hashed_password
      ]
    );

    // Return the newly created student record
    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});





// student signin
app.post('/student/signin', async (req, res) => {
    console.log('Received body:', req.body);

  if(req.get('Content-Type') !== 'application/json') {
    return res.status(415).send('Unsupported Media Type');
  }
  try {
    const { email, hashed_password } = req.body;

    // Validate input
    if (!email || !hashed_password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the student exists
    const result = await pool.query('SELECT * FROM student WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const student = result.rows[0];
    console.log(student);

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, student.hashed_password);
    if (hashed_password !== student.password) {
      return res.status(400).json({ msg: 'Invalid email or passworddd' });
    }

    // // Check for JWT_SECRET
    // if (!process.env.JWT_SECRET) {
    //   throw new Error('JWT_SECRET is not defined in the environment variables');
    // }

    // Generate token
    const token = jwt.sign(
      { 
        registration_id: student.registration_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        university_name: student.university_id,
        role: "student"
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      // student
        });

  } catch (error) {
    console.error('Signin errorrrr:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// -----------------------------------------------------------------------------------











// University signup
app.post('/university', async (req, res) => {
  try {
    const { 
      university_name, registration_number, charter_number,
      official_email, website, county 
    } = req.body;

  

    // Check for existing university
    const existingUniversity = await pool.query(
      'SELECT * FROM university WHERE registration_number = $1 OR official_email = $2',
      [registration_number, official_email]
    );

    if (existingUniversity.rows.length > 0) {
      return res.status(400).json({ msg: 'University with this registration number or email already exists' });
    }

    // Insert into database
    const newUniversity = await pool.query(
      `INSERT INTO university (
        university_name, registration_number, charter_number, official_email, website, county
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        university_name, registration_number, charter_number,
        official_email, website, county
      ]
    );

    // Return the newly created university record
    res.json(newUniversity.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});

// -----------------------------------------------------------------------------------










// HIGH SCHOOL SIGNUP
app.post('/high_school', async (req, res) => {
  try {
    const {
      school_name, registration_number, school_level,
      education_system, school_type, official_email,
      website, principal_name, principal_email,
      county,password
    } = req.body;


    // Insert into database
    const newHighSchool = await pool.query(
      `INSERT INTO high_school (
        school_name, registration_number, school_level,
        education_system, school_type, official_email,
        website, principal_name, principal_email,
        county, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        school_name, registration_number, school_level,
        education_system, school_type, official_email,
        website, principal_name, principal_email,
        county, password
      ]
    );
    res.json(newHighSchool.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



//  HIGH SCHOOL SIGN IN
app.post('/high_school/signin', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { official_email, password } = req.body;


    // Check if the high school exists
    const result = await pool.query('SELECT * FROM high_school WHERE official_email = $1', [official_email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const high_school = result.rows[0];

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, high_school.password);
    if (password !== high_school.password) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        school_id: high_school.school_id,
        school_name: high_school.school_name,
        official_email: high_school.official_email,
        role: 'highschool'
      },
     '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      high_school
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// -----------------------------------------------------------------------------------













// HOD signUp
app.post('/hods', async (req, res) => {
  try {
    const { hod_name, email, university_id, password } = req.body;

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Check for existing HOD
    const existingHod = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (existingHod.rows.length > 0) {
      return res.status(400).json({ msg: 'HOD with this email already exists' });
    }

    // Insert into database
    const newHod = await pool.query(
      `INSERT INTO hods (
        hod_name, email, password, university_id
      ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        hod_name, email, password, university_id
      ]
    );
    // Return the newly created HOD record
    res.json(newHod.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});





// HOD login
app.post('/hod/login', async (req, res) => {
  try {
    const { email, password } = req.body;

  

    // Check if HOD exists
    const hodResult = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (hodResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const hod = hodResult.rows[0];

    // Compare the provided password with the hashed password in the database
    // const isMatch = await bcrypt.compare(password, hod.password);

    if (password !== hod.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Fetch university details
    const universityResult = await pool.query(
      'SELECT university_name FROM university WHERE university_id = $1',
      [hod.university_id]
    );

    if (universityResult.rows.length === 0) {
      return res.status(500).json({ message: 'University details not found' });
    }

    const university = universityResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        hod_id: hod.hod_id,
        hod_name: hod.hod_name,
        email: hod.email,
        university_name: university.university_name,
        role: "hod"
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      hod: {
        hod_id: hod.hod_id,
        hod_name: hod.hod_name,
        email: hod.email,
        university_name: university.university_name
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});

// -----------------------------------------------------------------------------------










// supervisors signUp
app.post('/supervisors', async (req, res) => {
  try {
    const { supervisor_name, email, university_id, course_id, password } = req.body;

    const newSupervisors = await pool.query(
      `INSERT INTO supervisors (
        supervisor_name, email, approval_status, university_id, course_id, password
      ) VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING *`,
      [supervisor_name, email, university_id, course_id, password]
    ); 

    res.json(newSupervisors.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// SUPERVISOR login
app.post('/supervisors/signin', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { email, password } = req.body;

    // Check if the supervisor exists
    const result = await pool.query('SELECT * FROM supervisors WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const supervisor = result.rows[0];

  
    if (password !== supervisor.password) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }


    // Generate token
    const token = jwt.sign(
      { 
        id: supervisor.id,
        supervisor_name: supervisor.supervisor_name,
        email: supervisor.email,
        approval_status: supervisor.approval_status,
        university_id: supervisor.university_id,
        course_id: supervisor.course_id,
        role: 'supervisor'
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      supervisor
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});









// ================================================================================



// Endpoint to handle POST requests to insert into vacancy table
app.post('/vacancy', async (req, res) => {
  try {
      const {
          primary_subject,
          secondary_subject,
          positions_available,
          stat_date,
          end_date,
          application_deadline,
          coordinator_name,
          coordinator_email,
          coordinator_phone,
          accommodation_provided,
          stipend_amount,
          school_id
      } = req.body;


      // Insert new vacancy into the database
      const newVacancy = await pool.query(
          `INSERT INTO vacancy (
              primary_subject,
              secondary_subject,
              positions_available,
              stat_date,
              end_date,
              application_deadline,
              coordinator_name,
              coordinator_email,
              coordinator_phone,
              accommodation_provided,
              stipend_amount,
              school_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [
              primary_subject,
              secondary_subject,
              positions_available,
              stat_date,
              end_date,
              application_deadline,
              coordinator_name,
              coordinator_email,
              coordinator_phone,
              accommodation_provided,
              stipend_amount,
              school_id
          ]
      );

      // Send response
      res.json(newVacancy.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});


// GET all vacancies
app.get('/vacancies', async (req, res) => {
  try {
    const query = `
      SELECT 
        v.vancancy_id, 
        v.primary_subject, 
        v.secondary_subject, 
        v.positions_available, 
        v.stat_date AS start_date, 
        v.end_date, 
        v.application_deadline,
        v.coordinator_name,
        v.coordinator_email,
        v.coordinator_phone,
        v.accommodation_provided,
        v.stipend_amount,
        h.school_id
      FROM 
        vacancy v
      JOIN 
        high_school h ON v.school_id = h.school_id
      WHERE 
        v.application_deadline >= CURRENT_DATE
      ORDER BY 
        v.application_deadline ASC
    `;
    
    const result = await pool.query(query);
    console.log(result); // Log the result for debugging purposes
    res.json({ vacancies: result.rows });
  } catch (err) {
    console.error('Error fetching vacancies:', err);
    res.status(500).json({ message: 'Server error while fetching vacancies' });
  }
});


// VACANCY BY ID
app.get('/vacancy/:vancancy_id', async (req, res) => {
  try {
    const { vancancy_id } = req.params;
    const query = `
      SELECT 
        v.vancancy_id, 
        v.primary_subject, 
        v.secondary_subject, 
        v.positions_available,
        v.stat_date AS start_date, 
        v.end_date, 
        v.application_deadline,
        v.coordinator_name, 
        v.coordinator_email, 
        v.coordinator_phone,
        v.accommodation_provided, 
        v.stipend_amount,
        h.school_id
      FROM vacancy v
      JOIN high_school h ON v.school_id = h.school_id
      WHERE v.vancancy_id = $1
    `;
    const result = await pool.query(query, [vancancy_id]);
    console.log(result);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vacancy details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================================================================================================================================================================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});



// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Protected Routes
app.get('/student', authenticateJWT, (req, res) => {
  if (req.user.role !== 'student-teacher') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the student-teacher portal' });
});

app.get('/hod', authenticateJWT, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the HOD portal' });
});

app.get('/highschool', authenticateJWT, (req, res) => {
  if (req.user.role !== 'highschool') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the highschool portal' });
});

const secretKey='OjazGiWFIoxCtcyduO5yDrnhqJYUzV31';
// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};



// Get school details by ID route
app.get('/school/:id', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const school_id = decodedToken.school_id;


    // Fetch the school details from the database
    const query = 'SELECT * FROM high_school WHERE school_id = $1';
    const values = [school_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({ school: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Route to handle form submissions
app.post('/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json(result.rows[0]);
    console.log(res);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
