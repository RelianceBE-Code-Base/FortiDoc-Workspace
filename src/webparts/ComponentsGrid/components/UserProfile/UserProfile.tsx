import * as React from 'react';
import styles from './UserProfile.module.scss';
import { IUserProfileProps } from './IUserProfileProps';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const UserProfileIcon = require('./assets/UserProfile.png');
const TeamsIcon = require('./assets/TeamsIcon.png');

const UserProfile: React.FC<IUserProfileProps> = (props) => {
  const [profilePhoto, setProfilePhoto] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('Toba Gbeleyi');
  const [unreadEmailCount, setUnreadEmailCount] = React.useState<number>(0);
  const [recentContacts, setRecentContacts] = React.useState<any[]>([]);

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
    } catch (error) {
      console.log("User details not found");
    }
  };

  const getUnreadEmailCount = async () => {
    try {
      const response = await props.graphClient.api('/me/mailFolders/Inbox').get();
      setUnreadEmailCount(response.unreadItemCount);
    } catch (error) {
      console.log("Unread email count not found");
    }
  };

  const getRecentContacts = async () => {
    try {
      const response = await props.graphClient
        .api('/me/people')
        .top(12)
        .get();
      const contacts = response.value;
      
      const contactsWithPhotos = await Promise.all(
        contacts.map(async (contact: any) => {
          let photoUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
          try {
            const photoResponse = await props.graphClient
              .api(`/users/${contact.userPrincipalName}/photo/$value`)
              .responseType(ResponseType.BLOB)
              .get();
            photoUrl = URL.createObjectURL(photoResponse);
          } catch (error) {
            console.log(`Photo not found for ${contact.displayName}`, error);
          }
          return { ...contact, photoUrl };
        })
      );
      setRecentContacts(contactsWithPhotos);
    } catch (error) {
      console.log("Recent contacts not found", error);
    }
  };

  React.useEffect(() => {
    getProfilePhoto();
    getUserDetails();
    getUnreadEmailCount();
    getRecentContacts();
  }, []);

  const { pinned, onPinClick, onRemoveClick } = props;

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={UserProfileIcon} alt="User Profile Icon"/>
        <p style={{ display: 'flex' }}>My Profile</p>
        <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon 
            onClick={onRemoveClick} 
            icon={faWindowClose} 
            size='sm' 
            color="red" 
            style={{ margin: '5px', cursor: 'pointer' }}
          />
        </div>
      </div>
      <div className={styles['UP-content']}>
        <div className={styles['card-body-UP']}>
          <div className={styles['profile-image-frame']}>
            <img className={styles['profile-image']} src={profilePhoto} alt='Profile Photo' />
          </div>
          <div className={styles.details}>
            <div className={styles['title-Header']}>WELCOME</div>
            <div className={styles.title}>{userName}</div>
            <div className={styles['title-Header']}>
              <p>
                <a href="https://outlook.office.com/mail/inbox" target="_blank">
                  You have <span>{unreadEmailCount}</span> notifications
                </a>
              </p>
            </div>
          </div>
          <div className={styles['title-Header-Recent']}>
            <img src={TeamsIcon} alt="Recent Contacts"/>
            <p>My Recent Contacts</p>
          </div>
         
          <div className={styles['recent-contacts']}>
            {recentContacts.map(contact => (
              <div className={styles['contact-item']} key={contact.id}>
                <img 
                  className={styles['contact-image']} 
                  src={contact.photoUrl} 
                  title={contact.displayName} 
                  onClick={() => window.open(`https://delve.office.com/?u=${contact.userPrincipalName}`, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
