import React from 'react';

const Events = () => {
  const upcoming = [
    { id: 1, title: 'Faculty Meeting', date: '2025-09-15', desc: 'Monthly department sync.' },
    { id: 2, title: 'Science Fair', date: '2025-10-02', desc: 'Student projects showcase.' },
    { id: 3, title: 'Workshop: GenAI in Teaching', date: '2025-11-01', desc: 'Hands-on best practices.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map(e => (
            <div key={e.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <p className="text-sm text-gray-500 mb-1">{new Date(e.date).toDateString()}</p>
              <h3 className="text-xl font-semibold text-gray-800">{e.title}</h3>
              <p className="text-gray-600 mt-2">{e.desc}</p>
              <button className="mt-4 inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Add to Calendar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;


