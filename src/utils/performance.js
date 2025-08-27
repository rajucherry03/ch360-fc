// Performance monitoring utilities for CampusHub360

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  // Start timing a specific operation
  startTimer(operationName) {
    this.metrics[operationName] = {
      startTime: performance.now(),
      endTime: null,
      duration: null
    };
  }

  // End timing and calculate duration
  endTimer(operationName) {
    if (this.metrics[operationName]) {
      this.metrics[operationName].endTime = performance.now();
      this.metrics[operationName].duration = 
        this.metrics[operationName].endTime - this.metrics[operationName].startTime;
      
      // Log if duration is significant
      if (this.metrics[operationName].duration > 100) {
        console.warn(`Slow operation detected: ${operationName} took ${this.metrics[operationName].duration.toFixed(2)}ms`);
      }
      
      return this.metrics[operationName].duration;
    }
    return null;
  }

  // Measure component render time
  measureRender(componentName, renderFn) {
    this.startTimer(`${componentName}_render`);
    const result = renderFn();
    this.endTimer(`${componentName}_render`);
    return result;
  }

  // Track memory usage
  trackMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Track Core Web Vitals
  trackWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      this.metrics.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      let cls = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      console.log('CLS:', cls);
      this.metrics.cls = cls;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {};
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const { width = 800, quality = 80, format = 'webp' } = options;
  
  // If using vite-imagetools, you can use the ?w= query parameter
  if (src.includes('?')) {
    return `${src}&w=${width}&q=${quality}&format=${format}`;
  }
  return `${src}?w=${width}&q=${quality}&format=${format}`;
};

// Debounce utility for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const modules = performance.getEntriesByType('resource');
    const jsModules = modules.filter(module => module.name.includes('.js'));
    
    console.log('Bundle Analysis:');
    jsModules.forEach(module => {
      console.log(`${module.name}: ${(module.transferSize / 1024).toFixed(2)}KB`);
    });
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Track Web Vitals
  performanceMonitor.trackWebVitals();
  
  // Track memory usage periodically
  setInterval(() => {
    const memory = performanceMonitor.trackMemory();
    if (memory && memory.percentage > 80) {
      console.warn('High memory usage detected:', memory.percentage.toFixed(2) + '%');
    }
  }, 30000); // Check every 30 seconds
  
  // Analyze bundle size in development
  if (process.env.NODE_ENV === 'development') {
    analyzeBundleSize();
  }
};

export default PerformanceMonitor;
