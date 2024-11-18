import React from 'react';
import { Link } from 'react-router-dom';

const coursesData = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    description: 'Learn the basics of computer science and programming.',
    credits: 3,
    schedule: 'Mon-Wed-Fri 10:00 AM - 11:00 AM',
  },
  {
    id: 2,
    name: 'Advanced Mathematics',
    description: 'Explore advanced topics in mathematics.',
    credits: 4,
    schedule: 'Tue-Thu 1:00 PM - 3:00 PM',
  },
  // Add more course objects here
];

const FacultyCourseList = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-600">Here is the list of courses you are teaching.</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {coursesData.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800">{course.name}</h3>
            <p className="text-gray-700 mt-2">{course.description}</p>
            <div className="mt-4">
              <span className="block text-sm text-gray-600">
                <strong>Credits:</strong> {course.credits}
              </span>
              <span className="block text-sm text-gray-600">
                <strong>Schedule:</strong> {course.schedule}
              </span>
            </div>
            <div className="mt-4 text-center">
              <Link to={`/courses/${course.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FacultyCourseList;
