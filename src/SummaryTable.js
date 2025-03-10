import React from "react";

const SummaryTable = ({ summary }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Element Type</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(summary).map(([type, count]) => (
          <tr key={type}>
            <td>{type}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SummaryTable;