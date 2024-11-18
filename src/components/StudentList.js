import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const studentsData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    course: 'Computer Science',
    profilePicture: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    course: 'Mathematics',
    profilePicture: 'https://via.placeholder.com/150',
  },
  // Add more student objects here
];

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');

  const filteredStudents = studentsData
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'course') {
        return a.course.localeCompare(b.course);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Student List</h1>
        <p className="text-gray-600">Here is the list of students enrolled in your courses.</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-full md:w-1/3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded ml-4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="course">Sort by Course</option>
        </select>
      </div>

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center">
              <img src={student.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                <p className="text-gray-700 mt-2">{student.email}</p>
                <div className="mt-4">
                  <span className="block text-sm text-gray-600">
                    <strong>Course:</strong> {student.course}
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <Link to={`/students/${student.id}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default StudentList;
