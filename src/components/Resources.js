import React from 'react';

const Resources = () => {
  const items = [
    { id: 1, name: 'Syllabus Template', type: 'Document', size: '120 KB' },
    { id: 2, name: 'Lecture Slides Sample', type: 'PPTX', size: '2.1 MB' },
    { id: 3, name: 'Grading Rubric', type: 'Spreadsheet', size: '54 KB' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Resources</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Size</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="px-6 py-3">{r.name}</td>
                  <td className="px-6 py-3">{r.type}</td>
                  <td className="px-6 py-3">{r.size}</td>
                  <td className="px-6 py-3 text-right">
                    <button className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resources;


