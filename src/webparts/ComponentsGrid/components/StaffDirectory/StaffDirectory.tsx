import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { FormControl, Modal, Button, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './StaffDirectory.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const StaffDirectoryIcon = require('./assets/StaffDirectoryIcon.png');
const CloseIcon = require('./assets/close-square.png');

interface StaffDirectoryProps {
  graphClient: MSGraphClientV3;
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
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
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ graphClient, pinned, onPinClick, onRemoveClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [defaultProfileImage, setDefaultProfileImage] = useState<string>("");
  const [nextLink, setNextLink] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    fetchUsers();
    setDefaultProfileImage("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
  }, []);

  const fetchUsers = async (link: string | null = null, query: string = '') => {
    try {
      let response;
      if (link) {
        response = await graphClient.api(link).get();
      } else {
        const filterQuery = query
          ? `startswith(displayName,'${query}') or startswith(mail,'${query}') or startswith(jobTitle,'${query}') or startswith(department,'${query}')`
          : '';
  
        response = await graphClient
          .api('/users')
          .select('id,displayName,jobTitle,mail,mobilePhone,officeLocation,department,businessPhones,accountEnabled,assignedLicenses')
          .filter(filterQuery)
          .top(pageSize)
          .get();
      }
  
      const filteredUsers = response.value.filter((user: any) => 
        user.accountEnabled && user.assignedLicenses && user.assignedLicenses.length > 0
      );

      const usersData: User[] = await Promise.all(
        filteredUsers.map(async (user: any) => {
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
        })
      );

      setUsers(prevUsers => link ? [...prevUsers, ...usersData] : usersData);
      setNextLink(response['@odata.nextLink'] || null);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchUsers(null, query);
  };
  const handleUserClick = (user: User) => {
    fetchUserDetails(user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const userResponse = await graphClient
        .api(`/users/${userId}`)
        .select('id,displayName,jobTitle,mail,mobilePhone,officeLocation,department,businessPhones')
        .get();
      let managerResponse, reportsResponse, filesResponse, messagesResponse;

      try {
        managerResponse = await graphClient.api(`/users/${userId}/manager`).get();
      } catch (error) {
        managerResponse = null;
      }

      try {
        reportsResponse = await graphClient.api(`/users/${userId}/directReports`).get();
      } catch (error) {
        reportsResponse = { value: [] };
      }

      try {
        filesResponse = await graphClient.api(`/users/${userId}/drive/root/children`).get();
      } catch (error) {
        filesResponse = { value: [] };
      }

      try {
        messagesResponse = await graphClient.api(`/users/${userId}/messages`).get();
      } catch (error) {
        messagesResponse = { value: [] };
      }

      const userDetails: UserDetails = {
        ...userResponse,
        manager: managerResponse,
        reports: reportsResponse.value,
        files: filesResponse.value,
        messages: messagesResponse.value,
      };

      setSelectedUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };

  const handleLoadMore = () => {
    if (nextLink) {
      fetchUsers(nextLink, searchQuery);
    }
  };

  const handleSearchIconClick = () => setShowSearchBox(!showSearchBox);

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} style={{ display: 'flex', flexDirection: 'row' }}>
        <img src={StaffDirectoryIcon} style={{ display: 'flex' }} />
        {!showSearchBox &&
          <div>
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
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} onClick={handleSearchIconClick} />
        <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
            <img src={CloseIcon} style={{ display: 'flex', height: '24px', width: '24px' }} />
          </button>
        </div>
      </div>

      <div className={`${styles.cardBody}`}>
        {users.map(user => (
          <div className={styles.userCard} key={user.id} onClick={() => handleUserClick(user)}>
            <img className={styles.profileImage} src={user.photoUrl || defaultProfileImage} />
            <div className={styles.details}>
              <h2 className={styles.title}>{user.displayName}</h2>
              <p className={styles.subtitle}>{user.jobTitle}</p>
              <p className={styles.subtitle}>{user.department}</p>
            </div>
          </div>
        ))}
      </div>

      {nextLink && (
        <div className={styles.loadMoreContainer}>
          <button 
            onClick={handleLoadMore} 
            className={`${styles.loadMoreButton} ${styles['card-header']}`}
          >
            Click to load More ...
          </button>
        </div>
      )}

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.displayName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="details" title="Details">
              <h4>Details:</h4>
              <p>Name: {selectedUser?.displayName}</p>
              <p>Job Title: {selectedUser?.jobTitle}</p>
              <p>Email: {selectedUser?.mail}</p>
              <p>Mobile Phone: {selectedUser?.mobilePhone}</p>
              <p>Office Location: {selectedUser?.officeLocation}</p>
              <p>Department: {selectedUser?.department}</p>
              {selectedUser?.manager && (
                <>
                  <h5>Manager:</h5>
                  <p>{selectedUser.manager.displayName} - {selectedUser.manager.jobTitle}</p>
                </>
              )}
              {selectedUser?.reports && selectedUser.reports.length > 0 && (
                <>
                  <h5>Direct Reports:</h5>
                  <ul>
                    {selectedUser.reports.map((report, idx) => (
                      <li key={idx}>{report.displayName} - {report.jobTitle}</li>
                    ))}
                  </ul>
                </>
              )}
            </Tab>
            <Tab eventKey="files" title="Files">
              <h4>Files:</h4>
              <ul>
                {selectedUser?.files && selectedUser.files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </Tab>
            <Tab eventKey="messages" title="Messages">
              <h4>Messages:</h4>
              <ul>
                {selectedUser?.messages && selectedUser.messages.map((message, idx) => (
                  <li key={idx}>{message.subject}</li>
                ))}
              </ul>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffDirectory;