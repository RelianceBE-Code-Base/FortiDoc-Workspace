import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { ListGroup, ListGroupItem, FormControl, Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './StaffDirectory.module.scss';

import './StaffDirectory.module.scss'
import { TestImages } from '@fluentui/example-data';

// import { Persona } from '@fluentui/react';

// import { PersonaSize } from '@fluentui/react/lib/Persona';

// import { TestImages } from '@fluentui/example-data';

// import { Image, ImageFit } from '@fluentui/react/lib/Image';




interface StaffDirectoryProps {
  graphClient: MSGraphClientV3;
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
}

interface UserDetails extends User {
  manager?: User;
  reports?: User[];
  files?: any[];
  messages?: any[];
  linkedinProfile?: any;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ graphClient }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await graphClient.api('/users').get();
      const usersData: User[] = response.value.map((user: any) => ({
        id: user.id,
        displayName: user.displayName,
        jobTitle: user.jobTitle,
        mail: user.mail,
        mobilePhone: user.mobilePhone,
        officeLocation: user.officeLocation,
        department: user.department,
        businessPhones: user.businessPhones,
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

  const handleClose = () => setShowModal(false);

  const handleSearchIconClick = () => setShowSearchBox(!showSearchBox);

  return (
    <div className={styles.card} >
      <div className={styles['card-header']} style={{display: 'flex', flexDirection: 'row'}}>
        
      <FontAwesomeIcon icon={faUserCircle} className={styles.headerIcon} />

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

        
      </div>
      <div className={`${styles.cardBody} `}>
        {/* {filteredUsers.map(user => (
          <Card key={user.id} className={styles.userCard} onClick={() => handleUserClick(user)}>
            <Card.Body className="d-flex">
              <div className={styles.userImage}>
                <img
                  src={`https://graph.microsoft.com/v1.0/users/${user.id}/photo/$value`}
                  alt={`${user.displayName}'s profile`}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/60'; // Placeholder image URL
                  }}
                  className={styles.userImage}
                />
              </div>
              <div className={styles.userInfo}>
                <Card.Title className={styles.userName}>{user.displayName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{user.department}</Card.Subtitle>
                <ListGroup className="list-group-flush">
                  <ListGroupItem className={styles.userDetails}>{user.jobTitle}</ListGroupItem>
                  <ListGroupItem className={styles.userDetails}>{user.mail}</ListGroupItem>
                  <ListGroupItem className={styles.userDetails}>{user.mobilePhone || user.businessPhones.join(', ')}</ListGroupItem>
                  <ListGroupItem className={styles.userDetails}>{user.officeLocation}</ListGroupItem>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        ))}  */}



      {filteredUsers.map(user => (
        // <Card key={user.id} className={styles.userCard} onClick={() => handleUserClick(user)}>
        //   <Card.Body className="d-flex">
            
              // <Persona key={user.id} className={styles.userCard} onClick={() => handleUserClick(user)}
              //   // imageUrl={`https://graph.microsoft.com/v1.0/users/${user.id}/photo/$value`}
              //   // onRenderInitials={() => (
              //   //   <Image
              //   //     src="https://via.placeholder.com/60"
              //   //     alt={`${user.displayName}'s profile`}
              //   //     imageFit={ImageFit.cover}
              //   //     width={60}
              //   //     height={60}
                    
              //   //   />
              //   // )}
              //   imageUrl= {TestImages.personaMale}
              //   // text={user.displayName}
              //   secondaryText={user.department}
              //   tertiaryText={user.jobTitle}
              //   optionalText={user.mail}
              //   showSecondaryText={true}
              //   size={PersonaSize.size72}
              //   coinSize={50}
              // />


              <div className={styles.userCard} onClick={() => handleUserClick(user)}>
                  <img className= {styles.profileImage}  src={TestImages.personaMale} />
                  <div className={styles.details}>
                  <h2 className={styles.title}>{user.displayName}</h2>
                  <p className={styles.subtitle}>{user.jobTitle}</p>
                  {/* <p className={styles.subtitle}>{user.mail}</p> */}
                  {/* <p className={styles.subtitle}>{user.mobilePhone}</p> */}
                 
                </div>
              </div>


          
            /* <div className={styles.userInfo}>
              <Card.Title className={styles.userName}>{user.displayName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user.department}</Card.Subtitle>
              <ListGroup className="list-group-flush">
                <ListGroupItem className={styles.userDetails}>{user.jobTitle}</ListGroupItem>
                <ListGroupItem className={styles.userDetails}>{user.mail}</ListGroupItem>
                <ListGroupItem className={styles.userDetails}>{user.mobilePhone || user.businessPhones.join(', ')}</ListGroupItem>
                <ListGroupItem className={styles.userDetails}>{user.officeLocation}</ListGroupItem>
              </ListGroup>
            </div> 
          </Card.Body>
        </Card> */
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
