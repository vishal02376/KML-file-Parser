import React from "react";

const DetailedInfo = ({ details }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Element Type</th>
          <th>Length</th>
        </tr>
      </thead>
      <tbody>
        {details.map((detail, index) => (
          <tr key={index}>
            <td>{detail.type}</td>
            <td>{detail.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetailedInfo;