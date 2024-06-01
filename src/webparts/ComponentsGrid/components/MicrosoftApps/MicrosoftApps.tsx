import * as React from 'react';

const MicrosoftApps: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
        Microsoft Apps
      </div>
      <div className="card-body">
        <p>Just now - From: Account - Message...</p>
        <p>A day ago - From: IT Support - Message...</p>
        <p>2 days ago - From: IT Support - Message...</p>
      </div>
    </div>
  );
};

export default MicrosoftApps;