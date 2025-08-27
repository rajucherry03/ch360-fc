import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PageHeader = ({ icon, title, subtitle, right }) => {
  return (
    <div className="page-container">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="icon w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
          )}
          <div>
            <h1 className="text-gray-900 text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="mt-4 lg:mt-0">{right}</div>}
      </header>
    </div>
  );
};

export default PageHeader;


