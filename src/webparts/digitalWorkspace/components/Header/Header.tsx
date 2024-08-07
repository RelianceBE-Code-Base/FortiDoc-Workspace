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
  const [activeAction, setActiveAction] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (event: React.FormEvent) => {

    event.preventDefault();

    if (searchQuery.trim() === '') {
      return;
    }

    const entityTypes = [
      'driveItem',
      'message',
      'event',
      'person',
      'list',
      'site'
    ];

    const searchResults: any[] = [];

    for (const entityType of entityTypes) {
      try {
        const response = await graphClient.api('/search/query').version('v1.0').post({
          requests: [
            {
              entityTypes: [entityType],
              query: {
                queryString: searchQuery.trim()
              }
            }
          ]
        });

        if (!response || !response.value) {
          throw new Error('Unexpected response. Please check the network request.');
        }

        const responseData = response.value;

        if (responseData) {
          const formattedResults = responseData.map((result: any) => ({
            id: result.id,
            title: result.title || result.name || result.subject || 'No title',
            summary: result.summary || result.bodyPreview || result.description || 'No summary available',
            webUrl: result.webUrl || result.url,
            entityType: entityType,
            description: result.description,
            fileType: result.fileType,
            fileSize: result.size,
            lastModifiedDateTime: result.lastModifiedDateTime,
            start: result.start,
            end: result.end,
            location: result.location,
            body: result.body,
            url: result.webUrl || result.url
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

  return (
    <header className={`navbar navbar-expand-lg navbar-light bg-light ${styles.header}`}>
      <div className="container-fluid">
        <Link to="/">
          <button
            className={`btn ${styles.homeButton}`}
            type="button"
            onClick={() => {
              onHomeClick();
              setActiveAction('Home');
            }}
            style={{ color: activeAction === 'Home' ? '#01A88C' : '#353d54' }}
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
              <Link to="https://microdev.sharepoint.com/sites/IntranetPortal2/Shared%20Documents/Forms/AllItems.aspx">
                <button
                  className={`btn ${styles.actionButton}`}
                  onClick={() => setActiveAction('GeneralLibrary')}
                  style={{ color: activeAction === 'GeneralLibrary' ? '#01A88C' : '#353d54' }}
                >
                  General Library
                </button>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className={`btn ${styles.actionButton} dropdown-toggle`}
                onClick={() => setActiveAction('Departments')}
                style={{ color: activeAction === 'Departments' ? '#01A88C' : '#353d54' }}
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Departments
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="https://microdev.sharepoint.com/sites/Accounting">Accounting</a></li>
                <li><a className="dropdown-item" href="https://microdev.sharepoint.com/sites/Finance">Finance</a></li>
                <li><a className="dropdown-item" href="https://microdev.sharepoint.com/sites/SalesDepartment">Sales</a></li>
                <li><a className="dropdown-item" href="https://microdev.sharepoint.com/sites/InformationTechnology">InformationTechnology</a></li>
                <li><a className="dropdown-item" href="https://microdev.sharepoint.com/sites/hr">Human Resources</a></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
            <Dropdown onClick={ (onOptionsClick) => setActiveAction('Options')}>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className={styles.optionDropdown} style={{ color: activeAction === 'Options' ? '#01A88C' : '#353d54' }}
                >
                  Options
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.optionMenu}>
                  <div className={styles.gridLayout}>
                    {componentOptions.map((option, index) => (
                      <div key={index} className={styles.gridItem} onClick={() => onComponentAdd(option.name)}>
                        <img src={option.icon} alt={`${option.name} icon`} className={styles.optionIcon} />
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
            <input
              className= "form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
             <button className={styles.searchButton} type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
                         
          </form>
        </div>
      </div>
      <div ref={searchResultsRef} className={styles.searchResults}>
        {searchResults.length > 0 && (
          <div className={styles.searchResultsList}>
            {searchResults.map(result => (
              <div key={result.id} className={styles.searchResultItem}>
                <div>
                  <strong>{result.title}</strong>
                  <br />
                  {result.summary}
                  <br />
                  <a href={result.webUrl} target="_blank" rel="noopener noreferrer">
                    View More
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
