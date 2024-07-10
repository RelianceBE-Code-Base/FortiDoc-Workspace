import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import styles from './Header.module.scss';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import metaAiIcon from '../../assets/metaAiIcon.png';
import { Link } from 'react-router-dom';

const componentOptions = [
  { name: 'UserProfile', icon: require('./assets/UserProfile.png') },
  { name: 'Inbox', icon: require('./assets/InboxIcon.png') },
  { name: 'MicrosoftTeams', icon: require('./assets/TeamsIcon.png') },
  { name: 'Task', icon: require('./assets/TaskIcon.png') },
  { name: 'Calendar', icon: require('./assets/CalendarIcon.png') },
  { name: 'CompanyEvents', icon: require('./assets/Events.png') },
  { name: 'MicrosoftApps', icon: require('./assets/MicrosoftAppsIcon.png') },
  { name: 'BusinessApps', icon: require('./assets/BusinessAppsIcon.png') },
  { name: 'StaffDirectory', icon: require('./assets/StaffDirectoryIcon.png') },
  { name: 'GallerySlider', icon: require('./assets/MicrosoftAppsIcon.png') },
  { name: 'Anniversary', icon: require('./assets/Anniversary.png') },
  { name: 'Birthday', icon: require('./assets/Birthday.png') },
  { name: 'Announcement', icon: require('./assets/Announcement.png') }
];

interface HeaderProps {
  onHomeClick: () => void;
  graphClient: MSGraphClientV3;
  onDismissSearchResults: () => void;
  onOptionsClick: () => void;
  onComponentAdd: (componentName: string) => void;
  existingComponents: string[];
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, graphClient, onDismissSearchResults, onOptionsClick, onComponentAdd, existingComponents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() === '') {
      return;
    }

    try {
      const response = await graphClient.api('/search/query')
        .post({
          requests: [
            {
              entityTypes: ['message'],
              query: {
                queryString: searchQuery
              },
              from: 0,
              size: 25
            }
          ]
        });

      setSearchResults(response.value[0].hitsContainers[0].hits);
    } catch (error) {
      console.error('Error searching with Microsoft Graph', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        onDismissSearchResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onDismissSearchResults]);

  return (
    <header className={`navbar navbar-expand-lg navbar-light bg-light ${styles.header}`}>
      <div className="container-fluid">
        <Link to="/">
          <button 
            className={`btn btn-outline-primary ${styles.homeButton}`} 
            type="button" 
            onClick={onHomeClick}
          >
            Home
          </button>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#general-library">General Library</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#department">Department</a>
            </li>
            <li className="nav-item dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Options
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {componentOptions.map((option) => (
                    <Dropdown.Item 
                      key={option.name} 
                      onClick={() => onComponentAdd(option.name)}
                    >
      <img src={option.icon} className={styles.optionIcon} alt={`${option.name} icon`} /> {option.name}
    </Dropdown.Item>
  ))}
</Dropdown.Menu>

              </Dropdown>
            </li>
          </ul>
          
          <form className={`d-flex ${styles.searchForm}`} onSubmit={handleSearch}>
            <Link to="/chatbot"><img src={metaAiIcon} className={styles.metaIcon} alt="Meta AI Icon" /></Link>
            <div className={styles.searchBox}>
              <input
                className={`form-control ${styles.searchInput}`}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.searchButton} type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div ref={searchResultsRef} className={styles.searchResults}>
          <ul>
            {searchResults.map((result: any) => (
              <li key={result.hitId}>
                <a href={`https://outlook.office.com/mail/deeplink/read/${result.hitId}`}>
                  {result.summary}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
