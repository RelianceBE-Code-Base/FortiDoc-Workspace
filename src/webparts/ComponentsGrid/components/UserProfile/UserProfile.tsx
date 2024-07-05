import React, { useState, useEffect } from 'react';
import styles from './UserProfile.module.scss';
import { IUserProfileProps } from './IUserProfileProps';
import { ResponseType } from '@microsoft/microsoft-graph-client';
// import { TestImages } from '@fluentui/example-data';

const UserProfileIcon = require('./assets/UserProfile.png')

import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose} from '@fortawesome/free-solid-svg-icons';



class UserProfile extends React.Component<IUserProfileProps, IUserProfileState> {

  constructor(props: IUserProfileProps){
    super(props)
    this.state = {
      profilePhoto: ""
    }
  }
const UserProfileIcon = require('./assets/UserProfile.png');

const UserProfile: React.FC<IUserProfileProps> = (props) => {
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userJobTitle, setUserJobTitle] = useState<string>('');

  const getProfilePhoto = async () => {
    try {
      const response = await props.graphClient
        .api('me/photo/$value')
        .responseType(ResponseType.BLOB)
        .get();

      const imageUrl = URL.createObjectURL(response);
      setProfilePhoto(imageUrl);
    } catch (error) {
      console.log("Image not found");
      setProfilePhoto("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    }
  }

  // loadProfile = async () => {

  //   try {
  //     const response = await this.props.graphClient
  //     .api('/me')
  //   }

  // }


  componentDidMount(): void {

    // this.getProfilePhoto();

    // this.setState({profilePhoto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"})
    this.setState({profilePhoto: TestImages.personaMale})
    
  }


 

  render(): React.ReactNode {
      const { pinned, onPinClick, onRemove } = this.props;

    return(
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <img src={UserProfileIcon}/>
          <p style={{display: 'flex'}}>My Profile</p>
          <div style={{display: 'flex'}}>

          
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          
          <FontAwesomeIcon onClick={onRemove} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/>
           
          </div>
       </div>



       <div className={styles['card-body']}>
         <div className= {styles['profile-image-frame']}>
            <img className= {styles['profile-image']}  src={this.state.profilePhoto} alt='Profile Photo' />
         </div>
         <div className={styles.details}>
          <div className={styles.title}>Toba Gbeleyi</div>
          <div className={styles.subtitle}>Developer</div>
         </div>

          <div className="contact">
            <span></span>
          </div>

         </div>
       </div>
    )
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
    // Uncomment the following lines to fetch the profile photo and user details from the Graph API
    getProfilePhoto();
    getUserDetails();

    // Set default values for testing purposes
    // setProfilePhoto(TestImages.personaMale);
    // setUserName("Toba Gbeleyi");
    // setUserJobTitle("Developer");
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={UserProfileIcon} alt="User Profile Icon"/>
        <p style={{ display: 'flex' }}>My Profile</p>
        <div></div>
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
