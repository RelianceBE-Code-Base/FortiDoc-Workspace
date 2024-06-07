import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { Card, ListGroup, ListGroupItem, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './StaffDirectory.module.scss';

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

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ graphClient }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="card" style={{ maxHeight: '500px', overflow: 'auto', height: '245px' }}>
    <div className="card-header" style={{ backgroundColor: '#e6f6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding:'2px' }}>
          <div className={styles.headerLeft}>
            <FontAwesomeIcon icon={faUserCircle} className={styles.headerIcon} />
            <span>Staff Directory</span>
          </div>
          <div className={styles.searchContainer}>
            <FormControl
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          </div>
        </div>
        <Card.Body className={styles.cardBody}>
          {filteredUsers.map(user => (
            <Card key={user.id} className={styles.userCard}>
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
                  <Card.Title>{user.displayName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{user.department}</Card.Subtitle>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>{user.jobTitle}</ListGroupItem>
                    <ListGroupItem>{user.mail}</ListGroupItem>
                    <ListGroupItem>{user.mobilePhone || user.businessPhones.join(', ')}</ListGroupItem>
                    <ListGroupItem>{user.officeLocation}</ListGroupItem>
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
    </div>
  );
};

export default StaffDirectory;
