import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import metaAiIcon from '../../assets/metaAiIcon.png';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onHomeClick: () => void;
  graphClient: MSGraphClientV3;
  onDismissSearchResults: () => void;
  onOptionsClick: () => void;
  onComponentAdd: (componentName: string) => void; // Add this line
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, graphClient, onDismissSearchResults, onOptionsClick, onComponentAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

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

  const handleOptionsClick = () => {
    setOptionsVisible(!optionsVisible);
    onOptionsClick();
  };
  const componentsList = [
    { name: 'GallerySlider', icon: '📸' },
    { name: 'UserProfile', icon: '👤' },
    { name: 'Inbox', icon: '📥' },
    { name: 'MicrosoftTeams', icon: '👥' },
    { name: 'MicrosoftApps', icon: '📦' },
    { name: 'BusinessApps', icon: '💼' },
    { name: 'StaffDirectory', icon: '📇' },
    { name: 'Task', icon: '📝' },
    { name: 'Calendar', icon: '📅' },
    { name: 'CompanyEvents', icon: '🎉' },
    { name: 'Announcement', icon: '📢' },
    { name: 'Birthday', icon: '🎂' },
    { name: 'Anniversary', icon: '🎉' },
  ];

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
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleOptionsClick}>Options</button>
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
      {optionsVisible && (
        <div className={`dropdown-menu ${styles.optionsDropdown}`} style={{ display: 'block' }}>
          <div className="row">
            {componentsList.map((component, index) => (
              <div className="col-6" key={index}>
                <button
                  className="btn btn-light"
                  onClick={() => onComponentAdd(component.name)}
                >
                  {component.icon} {component.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
