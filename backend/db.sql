CREATE TABLE university (
    university_id SERIAL PRIMARY KEY,
    university_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    charter_number VARCHAR(50) UNIQUE,
    official_email VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(100),
    county VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hods (
  hod_id SERIAL PRIMARY KEY,
  hod_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  university_id INTEGER REFERENCES university(university_id)
);

CREATE TABLE course (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(10) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL
);


CREATE TABLE supervisors (
  id SERIAL PRIMARY KEY,
  supervisor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  approval_status VARCHAR(50) DEFAULT 'pending',
  university_id INTEGER REFERENCES university(university_id),
  course_id INTEGER REFERENCES course(course_id),
  password VARCHAR(255) NOT NULL
);

CREATE TABLE student(
    registration_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(17) NOT NULL,
    university_id INTEGER REFERENCES university(university_id),
    graduation_date DATE,
    primary_teaching_subject INTEGER NOT NULL REFERENCES course(course_id),
    secondary_teaching_subject INTEGER REFERENCES course(course_id),
    kenya_county VARCHAR(50) NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'pending',
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);




CREATE TABLE high_school (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    school_level VARCHAR(20), --e.g., 'district Level', 'county Level', 'Extra-County', 'Regional', 'National', 'international'
    education_system VARCHAR(50) NOT NULL, -- e.g., '8-4-4', 'CBC', etc.
    school_type VARCHAR(50) NOT NULL, -- e.g., 'Public', 'Private',
    official_email VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(100),
    principal_name VARCHAR(100) NOT NULL,
    principal_email VARCHAR(100) NOT NULL,
    county VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE vacancy(
    vancancy_id SERIAL PRIMARY KEY,
    primary_subject varchar(50),
    secondary_subject varchar(50),
    positions_available INTEGER,
    stat_date DATE NOT NULL,
    end_date DATE NOT NULL,
    application_deadline DATE,
    coordinator_name VARCHAR(100),
    coordinator_email VARCHAR(100),
    coordinator_phone VARCHAR(20),
    accommodation_provided BOOLEAN,    
    stipend_amount DECIMAL(10, 2),
    school_id INTEGER NOT NULL,
    FOREIGN KEY (school_id) REFERENCES high_school (school_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- courses:
INSERT INTO course (course_code, course_name) VALUES
('CHEM101', 'Chemistry'),
('MATH101', 'Mathematics'),
('ENG101', 'English'),
('LIT101', 'Literature'),
('HIST101', 'History'),
('KIS101', 'Kiswahili'),
('BIO101', 'Biology'),
('PHY101', 'Physics'),
('FRE101', 'French'),
('GEO101', 'Geography'),
('ECON101', 'Economics'),
('PSY101', 'Psychology'),
('SOC101', 'Sociology'),
('PHIL101', 'Philosophy'),
('MUS101', 'Music'),
('ART101', 'Art'),
('PE101', 'Physical Education'),
('COMP101', 'Computer Science'),
('BUS101', 'Business Studies'),
('HE101', 'Home Economics');


-- university data
{
  "university_name": "Tech Valley University",
  "registration_number": "TVU2024001",
  "charter_number": "TVU-CN1234",
  "official_email": "info@techvalley.edu",
  "website": "http://www.techvalley.edu",
  "county": "Nairobi"
}


-- student data
{
  "first_name": "John",
  "last_name": "Doe",
  "id_number": "12345678",
  "email": "john.doe@example.com",
  "phone_number": "+254700123456",
  "university_id": 1,
  "graduation_date": "2024-12-15",
  "primary_teaching_subject": 1,
  "secondary_teaching_subject": 2,
  "kenya_county": "Nairobi",
  "hashed_password": "password123",
  "confirm_pass": "password123"
}


-- high school data
{
  "school_name": "Example High School",
  "registration_number": "HS12345",
  "school_level": "National",
  "education_system": "8-4-4",
  "school_type": "Public",
  "official_email": "contact@example.com",
  "website": "http://example.com",
  "principal_name": "John Doe",
  "principal_email": "john.doe@example.com",
  "county": "Example County",
  "password":"123456789"
}


-- supervisors
{
  "supervisor_name": "Jane Doe",
  "email": "jane.doe@example.com",
  "university_id": 1,
  "course_id": 5,
  "password": "SecureP@ssw0rd"
}
