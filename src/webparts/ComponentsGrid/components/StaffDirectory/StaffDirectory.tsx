import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { ListGroup, ListGroupItem, FormControl, Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './StaffDirectory.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import './StaffDirectory.module.scss'
// import { TestImages } from '@fluentui/example-data';


const StaffDirectoryIcon = require('./assets/StaffDirectoryIcon.png')
const CloseIcon = require('./assets/close-square.png')


interface StaffDirectoryProps {
  graphClient: MSGraphClientV3;
    pinned: boolean;
    onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
}


interface User {
  id: string;
  displayName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  department: string;
  businessPhones: string[];
  photoUrl: string | null;
}

interface UserDetails extends User {
  manager?: User;
  reports?: User[];
  files?: any[];
  messages?: any[];
  linkedinProfile?: any;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ graphClient,pinned, onPinClick, onRemoveClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [defaultProfileImage, setDefaultProfileImage] = useState("");

  useEffect(() => {
    fetchUsers();
    setDefaultProfileImage("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png")
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await graphClient.api('/users').get();
      const usersData: User[] = await Promise.all(response.value.map(async (user: any) => {
        let photoUrl = null;
        try {
          const photoResponse = await graphClient.api(`/users/${user.id}/photo/$value`).get();
          photoUrl = URL.createObjectURL(photoResponse);
        } catch (photoError) {
          console.warn(`Failed to fetch photo for user ${user.id}`, photoError);
        }
        
        return {
          id: user.id,
          displayName: user.displayName,
          jobTitle: user.jobTitle,
          mail: user.mail,
          mobilePhone: user.mobilePhone,
          officeLocation: user.officeLocation,
          department: user.department,
          businessPhones: user.businessPhones,
          photoUrl: photoUrl,
        };
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const userResponse = await graphClient.api(`/users/${userId}`).get();
      let managerResponse, reportsResponse, filesResponse, messagesResponse, linkedinResponse;

      try {
        managerResponse = await graphClient.api(`/users/${userId}/manager`).get();
      } catch (error) {
        managerResponse = null; // Handle if the user has no manager
      }

      try {
        reportsResponse = await graphClient.api(`/users/${userId}/directReports`).get();
      } catch (error) {
        reportsResponse = { value: [] }; // Handle if the user has no direct reports
      }

      try {
        filesResponse = await graphClient.api(`/users/${userId}/drive/root/children`).get();
      } catch (error) {
        filesResponse = { value: [] }; // Handle if the user has no files
      }

      try {
        messagesResponse = await graphClient.api(`/users/${userId}/messages`).get();
      } catch (error) {
        messagesResponse = { value: [] }; // Handle if the user has no messages
      }

      linkedinResponse = {}; // Mock LinkedIn data as it would require LinkedIn API

      const userDetails: UserDetails = {
        ...userResponse,
        manager: managerResponse,
        reports: reportsResponse.value,
        files: filesResponse.value,
        messages: messagesResponse.value,
        linkedinProfile: linkedinResponse,
      };

      console.log('User Details:', userDetails);
      setSelectedUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleUserClick = (user: User) => {
    console.log('User clicked:', user);
    fetchUserDetails(user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSearchIconClick = () => setShowSearchBox(!showSearchBox);

  return (
    <div className={styles.card} >
      <div className={styles['card-header']} style={{display: 'flex', flexDirection: 'row'}}>
        
      {/* <FontAwesomeIcon icon={faUserCircle} className={styles.headerIcon} /> */}
      <img src={StaffDirectoryIcon} style={{display: 'flex'}}/>

        {!showSearchBox &&
        <div >
          
          <p>Staff Directory</p>
        
        </div>}

        {showSearchBox &&
        <div className={styles.searchContainer}>
          <FormControl
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />

        </div>
        
        }
        
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} onClick={handleSearchIconClick}/>
        <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} /> 
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '0px' }}>
          <img src={CloseIcon} style={{display: 'flex'}}/>
          </button>
          </div>

        
      </div>

      <div className={`${styles.cardBody} `}>
        



      {filteredUsers.map(user => (
       

              <div className={styles.userCard} onClick={() => handleUserClick(user)}>
                  <img className= {styles.profileImage}  src={user.photoUrl || defaultProfileImage} />
                  <div className={styles.details}>
                  <h2 className={styles.title}>{user.displayName}</h2>
                  <p className={styles.subtitle}>{user.jobTitle}</p>
                </div>
              </div>
      ))}




      </div>

      {selectedUser && (
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser.displayName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-center mb-3">
              <img
                src={`https://graph.microsoft.com/v1.0/users/${selectedUser.id}/photo/$value`}
                alt={`${selectedUser.displayName}'s profile`}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/60'; // Placeholder image URL
                }}
                className={styles.profileImage}
              />
              <div className="ml-3">
                <h5>{selectedUser.displayName}</h5>
                <p className="text-muted">{selectedUser.department}</p>
              </div>
            </div>
            <Tabs defaultActiveKey="overview" id="user-details-tabs">
              <Tab eventKey="overview" title="Overview">
                <ListGroup>
                  <ListGroupItem><strong>Job Title:</strong> {selectedUser.jobTitle}</ListGroupItem>
                  <ListGroupItem><strong>Email:</strong> {selectedUser.mail}</ListGroupItem>
                  <ListGroupItem><strong>Phone:</strong> {selectedUser.mobilePhone || selectedUser.businessPhones.join(', ')}</ListGroupItem>
                  <ListGroupItem><strong>Office Location:</strong> {selectedUser.officeLocation}</ListGroupItem>
                </ListGroup>
              </Tab>
              <Tab eventKey="contact" title="Contact">
                <ListGroup>
                  <ListGroupItem><strong>Email:</strong> {selectedUser.mail}</ListGroupItem>
                  <ListGroupItem><strong>Chat:</strong> {selectedUser.mail}</ListGroupItem>
                  <ListGroupItem><strong>Phone:</strong> {selectedUser.mobilePhone || selectedUser.businessPhones.join(', ')}</ListGroupItem>
                </ListGroup>
              </Tab>
              <Tab eventKey="organization" title="Organization">
                <h6>Manager</h6>
                {selectedUser.manager ? (
                  <ListGroup>
                    <ListGroupItem>{selectedUser.manager.displayName}</ListGroupItem>
                  </ListGroup>
                ) : (
                  <p>No manager found.</p>
                )}
                <h6>Direct Reports</h6>
                {selectedUser.reports && selectedUser.reports.length > 0 ? (
                  <ListGroup>
                    {selectedUser.reports.map(report => (
                      <ListGroupItem key={report.id}>{report.displayName}</ListGroupItem>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No direct reports found.</p>
                )}
              </Tab>
              <Tab eventKey="files" title="Files">
                {selectedUser.files && selectedUser.files.map(file => (
                  <ListGroup key={file.id}>
                    <ListGroupItem>{file.name}</ListGroupItem>
                  </ListGroup>
                ))}
              </Tab>
              <Tab eventKey="messages" title="Messages">
                {selectedUser.messages && selectedUser.messages.map(message => (
                  <ListGroup key={message.id}>
                    <ListGroupItem>{message.subject}</ListGroupItem>
                  </ListGroup>
                ))}
              </Tab>
              <Tab eventKey="linkedin" title="LinkedIn">
                <ListGroup>
                  <ListGroupItem>LinkedIn profile data here</ListGroupItem>
                </ListGroup>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StaffDirectory;
