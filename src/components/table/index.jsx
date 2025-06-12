import React from 'react';

const Table = ({ headers, children, className }) => {
  return (
    <div className="bg-white-pure rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-secondary-500">
        <thead className="bg-secondary-500">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-roboto font-medium text-white-pure uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white-pure divide-y divide-secondary-500">
          {children}
        </tbody>
      </table>
    </div>
  );
};

// Reusable table row component
export const TableRow = ({ children, className }) => (
  <tr className={`hover:bg-secondary-500/5 transition-colors ${className}`}>
    {children}
  </tr>
);

// Reusable table cell component
export const TableCell = ({ children, className }) => (
  <td className={`px-6 py-4 font-roboto ${className}`}>
    {children}
  </td>
);

export default Table;