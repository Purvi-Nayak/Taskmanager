import React, { useMemo } from 'react';

const Table = ({ 
  columns = [], 
  data = [], 
  className = '',
  pagination=
    {
      currentPage : 1,
      totalPages :1,
      Pagesize: 10,
      totalItems : 0,
      onPageChange : () => {}
    },
  
  emptyMessage = 'No data available'
}) => {
  
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    console.error('Table: columns and data must be arrays');
    return null;
  }

 
  const processedData = useMemo(() => {
    return data.map((row, index) => ({
      ...row,
      rowIndex: index + 1 
    }));
  }, [data]);

  // Log data with indices
 
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primarymain">
          <tr className='text-white-pure'>
            {/* Optional Index Column */}
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              #
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processedData.length > 0 ? (
            processedData.map((row, rowIndex) => (
              <tr 
                key={row.id || `row-${rowIndex}`} 
                className="hover:bg-gray-50"
              >
                {/* Row Index Cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.rowIndex}
                </td>
                {/* Data Cells */}
                {columns.map((column) => (
                  <td 
                    key={`${row.id}-${column.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  >
                    {column.render ? 
                      column.render({ row, rowIndex }) : 
                      column.field_name ? 
                        row[column.field_name] : 
                        '--'
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length + 1} 
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default Table;