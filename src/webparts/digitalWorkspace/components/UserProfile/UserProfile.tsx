import * as React from 'react';
import { IDigitalWorkspaceProps } from '../IDigitalWorkspaceProps';

interface IUserProfileProps extends Pick<IDigitalWorkspaceProps, 'isDarkTheme' | 'userDisplayName' | 'environmentMessage'> {
  // Add any other specific props for UserProfile if needed
}

const UserProfile: React.FC<IUserProfileProps> = ({ isDarkTheme, userDisplayName, environmentMessage }) => {
  return (
    <div className="card">
      <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
        My Profile
      </div>
      <div className="card-body">
        <p>Welcome</p>
        <p>A day ago - From: IT Support - Message...</p>
        <p>2 days ago - From: IT Support - Message...</p>
        </div>
      </div>
  );
};

export default UserProfile;
