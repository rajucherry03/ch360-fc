// Component preloading utility for better UX

// Store preloaded components
const preloadedComponents = new Set();

// Preload a component
export const preloadComponent = (componentImport) => {
  if (preloadedComponents.has(componentImport)) {
    return; // Already preloaded
  }
  
  // Start preloading
  componentImport().then(() => {
    preloadedComponents.add(componentImport);
  });
};

// Preload multiple components
export const preloadComponents = (componentImports) => {
  componentImports.forEach(preloadComponent);
};

// Preload on hover for better UX
export const preloadOnHover = (componentImport) => {
  return {
    onMouseEnter: () => preloadComponent(componentImport),
    onFocus: () => preloadComponent(componentImport),
  };
};

// Preload critical components immediately
export const preloadCriticalComponents = () => {
  // Preload the most commonly used components
  const criticalComponents = [
    () => import('../components/Home.jsx'),
    () => import('../components/Dashboard.jsx'),
    () => import('../components/StudentList.jsx'),
    () => import('../components/Course.jsx'),
  ];
  
  preloadComponents(criticalComponents);
};

// Preload components based on user role or preferences
export const preloadUserSpecificComponents = (userRole) => {
  const roleBasedComponents = {
    faculty: [
      () => import('../components/AttendanceList.jsx'),
      () => import('../components/Exam.jsx'),
      () => import('../components/Grades.jsx'),
    ],
    coordinator: [
      () => import('../components/ApprovalWorkflow.jsx'),
      () => import('../components/CoordinatorApproval.jsx'),
    ],
    mentor: [
      () => import('../components/MentorApproval.jsx'),
    ],
  };
  
  const components = roleBasedComponents[userRole] || [];
  preloadComponents(components);
};
