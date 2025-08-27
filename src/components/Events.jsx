import React from 'react';

const Events = () => {
  const upcoming = [
    { id: 1, title: 'Faculty Meeting', date: '2025-09-15', desc: 'Monthly department sync.' },
    { id: 2, title: 'Science Fair', date: '2025-10-02', desc: 'Student projects showcase.' },
    { id: 3, title: 'Workshop: GenAI in Teaching', date: '2025-11-01', desc: 'Hands-on best practices.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map(e => (
            <div key={e.id} className="compact-card hover:shadow-sm transition-shadow">
              <p className="text-xs text-gray-500 mb-1">{new Date(e.date).toDateString()}</p>
              <h3 className="text-base font-semibold text-gray-900">{e.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{e.desc}</p>
              <button className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Add to Calendar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;


