import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedList = ({ 
  items, 
  itemHeight = 60, 
  renderItem, 
  className = '',
  containerHeight = 400,
  overscan = 5
}) => {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${itemHeight}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Virtualized grid component for card layouts
export const VirtualizedGrid = ({ 
  items, 
  itemHeight = 200, 
  itemWidth = 300,
  renderItem, 
  className = '',
  containerHeight = 400,
  overscan = 5,
  columns = 3
}) => {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const endIndex = Math.min(startIndex + columns, items.length);
          
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${itemHeight}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '1rem',
                padding: '0 1rem',
              }}
            >
              {Array.from({ length: columns }, (_, columnIndex) => {
                const itemIndex = startIndex + columnIndex;
                if (itemIndex >= items.length) return null;
                
                return (
                  <div key={columnIndex}>
                    {renderItem(items[itemIndex], itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Virtualized table component
export const VirtualizedTable = ({ 
  items, 
  columns, 
  itemHeight = 50, 
  className = '',
  containerHeight = 400,
  overscan = 5
}) => {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  return (
    <div className={`overflow-auto ${className}`} style={{ height: containerHeight }}>
      <table className="w-full">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <tr
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${itemHeight}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-4 py-2 border-b border-gray-100"
                    style={{ width: column.width }}
                  >
                    {column.render ? column.render(items[virtualRow.index]) : items[virtualRow.index][column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </div>
        </tbody>
      </table>
    </div>
  );
};

export default VirtualizedList;
