import * as React from 'react';

const WeeklyAnalytics: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
        Weekly Analytics
      </div>
      <div className="card-body">
        <p>Just now - From: Account - Message...</p>
        <p>A day ago - From: IT Support - Message...</p>
        <p>2 days ago - From: IT Support - Message...</p>
      </div>
    </div>
  );
};

export default WeeklyAnalytics;
