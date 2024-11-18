// src/components/CourseList.js

import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  { id: 1, name: 'Introduction to Computer Science', year: 2023, semester: 'Spring' },
  { id: 2, name: 'Advanced Mathematics', year: 2023, semester: 'Spring' },
  // Add more courses here
];

const Grades = () => {
  return (
    <div className="min-h-screen bg-light p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course.id} className="border p-4 rounded shadow-sm bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
              <p className="text-gray-600">Year: {course.year}</p>
              <p className="text-gray-600">Semester: {course.semester}</p>
              <Link to={`/grades/${course.id} `} className="text-blue-500 mt-2 block">View Students</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grades;
