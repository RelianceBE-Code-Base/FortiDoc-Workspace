import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import styles from './Header.module.scss';
import { SPHttpClient } from '@microsoft/sp-http';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import metaAiIcon from '../../assets/metaAiIcon.png';
import { Link } from 'react-router-dom';

interface SearchHit {
  url: string | undefined;
  entityType: string;
  title: string;
  description?: string;
  id: string;
  fileType?: string;
  fileSize?: string;
  lastModifiedDateTime?: string;
  start?: { dateTime: string };
  end?: { dateTime: string };
  location?: { displayName: string };
  body?: {
    text: any; content: string 
  };
  webUrl?: string;
  summary?: string;
}

interface HeaderProps {
  onHomeClick: () => void;
  onDismissSearchResults: () => void;
  onOptionsClick: () => void;
  onComponentAdd: (componentName: string) => void;
  existingComponents: string[];
  spHttpClient: SPHttpClient;
  siteUrl: string;
  graphClient: MSGraphClientV3;
}

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

const Header: React.FC<HeaderProps> = ({
  onHomeClick,
  onDismissSearchResults,
  onOptionsClick,
  onComponentAdd,
  existingComponents,
  spHttpClient,
  siteUrl,
  graphClient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() === '') {
      return;
    }
  
    const entityTypes = [
      'Microsoft.Graph.DriveItem',
      'Microsoft.Graph.Message',
      'Microsoft.Graph.Event',
      'Microsoft.Graph.Person',
      'Microsoft.Graph.List',
      'Microsoft.Graph.Site'
    ];
  
    const searchResults: any[] = [];
  
    for (const entityType of entityTypes) {
      try {
        console.log(`Searching for ${entityType}...`);
        const response = await graphClient.api('/search/query').version('v1.0').post({
          requests: [
            {
              query: {
                queryString: searchQuery.trim(), // Ensure the searchQuery is trimmed
                entityTypes: [entityType],
              },
            },
          ],
        });
  
        if (!response.ok) {
          console.error('Failed to fetch search results:', await response.json());
          continue;
        }
  
        const responseData = await response.json();
  
        if (responseData.value) {
          const formattedResults = responseData.value.map((result: any) => ({
            id: result.id,
            title: result.title,
            summary: result.summary,
            webUrl: result.webUrl,
            entityType: result["@odata.type"].split('.').pop(),
            description: result.description,
            fileType: result.fileType,
            fileSize: result.size,
            lastModifiedDateTime: result.lastModifiedDateTime,
            start: result.start,
            end: result.end,
            location: result.location,
            body: result.body,
            url: result.webUrl
          }));
          searchResults.push(...formattedResults);
        }
      } catch (error) {
        console.error('Error searching with Microsoft Graph API', error);
      }
    }
  
    setSearchResults(searchResults);
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

  const formatSummary = (result: SearchHit) => {
    switch (result.entityType) {
      case 'person':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            {result.description ? result.description : 'No description available'}
            <br />
            <a href={`https://graph.microsoft.com/v1.0/users/${result.id}`} target="_blank" rel="noopener noreferrer">
              View Profile
            </a>
          </div>
        );
      case 'driveItem':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            File Type: {result.fileType ? result.fileType : 'Unknown'}
            <br />
            File Size: {result.fileSize ? result.fileSize : 'Unknown'}
            <br />
            Last Modified: {result.lastModifiedDateTime ? result.lastModifiedDateTime : 'Unknown'}
            <br />
            <a href={result.webUrl} target="_blank" rel="noopener noreferrer">
              Open File
            </a>
          </div>
        );
      case 'event':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            Start Time: {result.start ? result.start.dateTime : 'Unknown'}
            <br />
            End Time: {result.end ? result.end.dateTime : 'Unknown'}
            <br />
            Location: {result.location ? result.location.displayName : 'Unknown'}
            <br />
            {result.body ? result.body.content : 'No description available'}
            <br />
            <a href={result.webUrl} target="_blank" rel="noopener noreferrer">
              View Event
            </a>
          </div>
        );
      case 'message':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            {result.body ? result.body.content.replace(/<[^>]+>/g, '') : 'No content available'}
            <br />
            <a href={`https://graph.microsoft.com/v1.0/me/messages/${result.id}`} target="_blank" rel="noopener noreferrer">
              View Email
            </a>
          </div>
        );
      case 'site':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            {result.description ? result.description : 'No description available'}
            <br />
            <a href={result.webUrl} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </div>
        );
      case 'list':
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            {result.description ? result.description : 'No description available'}
            <br />
            <a href={result.webUrl} target="_blank" rel="noopener noreferrer">
              View List
            </a>
          </div>
        );
      default:
        return (
          <div>
            <strong>{result.title}</strong>
            <br />
            {result.summary ? result.summary : 'No summary available'}
          </div>
        );
    }
  };

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
              <a className="nav-link" href="https://microdev.sharepoint.com/sites/IntranetPortal2/Shared%20Documents/Forms/AllItems.aspx">General Library</a>
            </li>
            <li className="nav-item">
            <Dropdown onClick={onOptionsClick}>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className={styles.optionDropdown}>
                Departments
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.optionMenu}>
                <Dropdown.Item href="https://microdev.sharepoint.com/sites/Accounting">Accounting</Dropdown.Item>
                <Dropdown.Item href="https://microdev.sharepoint.com/sites/Finance">Finance</Dropdown.Item>
                <Dropdown.Item href="https://microdev.sharepoint.com/sites/SalesDepartment">Sales</Dropdown.Item>
        <Dropdown.Item href="https://microdev.sharepoint.com/sites/InformationTechnology">InformationTechnology</Dropdown.Item>
        <Dropdown.Item href="https://microdev.sharepoint.com/sites/hr">Human Resources</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </li>
            <li className="nav-item dropdown">
              <Dropdown onClick={onOptionsClick}>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className={styles.optionDropdown}>
                  Options
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.optionMenu}>
                  <div className={styles.gridLayout}>
                    {componentOptions.map((option, index) => (
                      <div key={index} className={styles.gridItem} onClick={() => onComponentAdd(option.name)}>
                        <img src={option.icon} className={styles.optionIcon} alt={`${option.name} icon`} />
                        <span className={styles.optionText}>{option.name}</span>
                      </div>
                    ))}
                  </div>
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
            {searchResults.map((result: SearchHit) => (
              <li key={result.id}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  <strong>{result.title}</strong>
                  <br />
                  {formatSummary(result)}
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
