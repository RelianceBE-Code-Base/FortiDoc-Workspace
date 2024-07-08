import * as React from 'react';

import styles from './UserProfile.module.scss';

import { IUserProfileProps } from './IUserProfileProps';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const UserProfileIcon = require('./assets/UserProfile.png');

const UserProfile: React.FC<IUserProfileProps> = (props) => {
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [userName, setUserName] = useState<string>('Toba Gbeleyi');
  const [userJobTitle, setUserJobTitle] = useState<string>('Developer');

  const getProfilePhoto = async () => {
    try {
      const response = await props.graphClient
        .api('me/photo/$value')
        .responseType(ResponseType.BLOB)
        .get();

      const imageUrl = URL.createObjectURL(response);
      setProfilePhoto(imageUrl);
    } catch (error) {
      console.log("Profile image not found");
      setProfilePhoto("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await props.graphClient.api('/me').get();
      setUserName(response.displayName);
      setUserJobTitle(response.jobTitle);
    } catch (error) {
      console.log("User details not found");
    }
  };

  useEffect(() => {
    getProfilePhoto();
    getUserDetails();
  }, []);

  const { pinned, onPinClick, onRemove } = props;

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={UserProfileIcon} alt="User Profile Icon"/>
        <p style={{ display: 'flex' }}>My Profile</p>
        <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon 
            onClick={onRemove} 
            icon={faWindowClose} 
            size='sm' 
            color="red" 
            style={{ margin: '5px', cursor: 'pointer' }}
          />
        </div>
      </div>
      <div className={styles['card-body']}>
        <div className={styles['profile-image-frame']}>
          <img className={styles['profile-image']} src={profilePhoto} alt='Profile Photo' />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>{userName}</div>
          <div className={styles.subtitle}>{userJobTitle}</div>
        </div>
        <div className="contact">
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;