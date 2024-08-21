import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { FormControl, Modal, Button, Pagination, Tab, Tabs } from 'react-bootstrap';
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
  linkedinProfile?: any;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ graphClient, pinned, onPinClick, onRemoveClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [defaultProfileImage, setDefaultProfileImage] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [nextLink, setNextLink] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchUsers();
    setDefaultProfileImage("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
  }, []);

  const fetchUsers = async (nextPageLink: string | null = null, query: string = '') => {
    try {
      const filterQuery = query 
        ? `accountEnabled eq true and startswith(displayName, '${query}')`
        : `accountEnabled eq true`;

      const response = nextPageLink
        ? await graphClient.api(nextPageLink).get()
        : await graphClient
            .api('/users')
            .filter(filterQuery)
            .select('id,displayName,jobTitle,mail,mobilePhone,officeLocation,department,businessPhones,assignedLicenses')
            .top(20)
            .get();

      const usersData: User[] = await Promise.all(
        response.value
          .filter((user: any) => user.assignedLicenses && user.assignedLicenses.length > 0)
          .map(async (user: any) => {
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

      if (nextPageLink) {
        setUsers(prevUsers => [...prevUsers, ...usersData]);
      } else {
        setUsers(usersData);
      }

      setNextLink(response['@odata.nextLink'] || null);

      if (response['@odata.count'] !== undefined && response['@odata.count'] !== null) {
        setTotalPages(Math.ceil(response['@odata.count'] / 20));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setUsers([]);  // Clear current users
    setPage(1);
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
      const userResponse = await graphClient.api(`/users/${userId}`).get();
      let managerResponse, reportsResponse, filesResponse, messagesResponse, linkedinResponse;

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

      linkedinResponse = {}; // Mock LinkedIn data as it would require LinkedIn API

      const userDetails: UserDetails = {
        ...userResponse,
        manager: managerResponse,
        reports: reportsResponse.value,
        files: filesResponse.value,
        messages: messagesResponse.value,
        linkedinProfile: linkedinResponse,
      };

      setSelectedUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    console.log(`handlePageChange called with newPage: ${newPage}`);
    if (newPage !== page) {
      setPage(newPage);
      if (newPage > 1 && nextLink) {
        console.log(`Fetching next page of users from ${nextLink}`);
        fetchUsers(nextLink, searchQuery);
      } else if (newPage === 1) {
        console.log(`Resetting users and fetching first page`);
        setUsers([]);  // Reset users for the first page
        fetchUsers(null, searchQuery);
      }
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
            </div>
          </div>
        ))}
      </div>

      {users.length > 0 && totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
          </Pagination>
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
            <Tab eventKey="linkedin" title="LinkedIn">
              <h4>LinkedIn Profile:</h4>
              <p>LinkedIn profile information here</p>
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