import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import styles from './Header.module.scss';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import metaAiIcon from '../../assets/metaAiIcon.png';
import { Link } from 'react-router-dom';
import wordIcon from './assets/word-icon.png';
import excelIcon from './assets/excel-icon.png';
import powerpointIcon from './assets/powerpoint-icon.png';
import sharepointIcon from './assets/sharepoint-icon.png';
import defaultIcon from './assets/default-icon.png';
import pdfIcon from './assets/pdf-icon.png';

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

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'docx':
    case 'doc':
      return wordIcon;
    case 'xlsx':
    case 'xls':
      return excelIcon;
    case 'pptx':
    case 'ppt':
      return powerpointIcon;
    case 'pdf':
      return pdfIcon;
    case 'aspx':
      return sharepointIcon;
    default:
      return defaultIcon;
  }
};

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
  const [generalLibraryLink, setGeneralLibraryLink] = useState<string>('');
  const [departments, setDepartments] = useState<{ title: string, url: string }[]>([]);
  const [submenuLinks, setSubmenuLinks] = useState<{ title: string, url: string, department: string }[]>([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (searchQuery.trim() === '') {
      return;
    }

    try {
      const response = await spHttpClient.get(
        `${siteUrl}/_api/search/query?querytext='${encodeURIComponent(searchQuery)}*'&rowlimit=10&selectproperties='Title,Path,FileType,Author,AuthorEmail,ServerRedirectedEmbedURL'`,
        SPHttpClient.configurations.v1
      );

      const data = await response.json();

      if (data && data.PrimaryQueryResult && data.PrimaryQueryResult.RelevantResults) {
        const results = data.PrimaryQueryResult.RelevantResults.Table.Rows.map((row: any) => {
          const cells = row.Cells;
          return {
            title: cells.find((c: any) => c.Key === 'Title')?.Value || 'Untitled',
            url: cells.find((c: any) => c.Key === 'Path')?.Value || '#',
            fileType: cells.find((c: any) => c.Key === 'FileType')?.Value || 'Unknown',
            author: cells.find((c: any) => c.Key === 'Author')?.Value || 'Unknown',
            authorEmail: cells.find((c: any) => c.Key === 'AuthorEmail')?.Value || '',
            webUrl: cells.find((c: any) => c.Key === 'ServerRedirectedEmbedURL')?.Value || ''
          };
        });

        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching with SharePoint Search API', error);
      if (error.response) {
        console.error('Error response:', await error.response.text());
      }
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

  useEffect(() => {
    const generalLibraryListName = 'GeneralLibrarySettings';
    const departmentsListName = 'Departments';
    const submenuLinksListName = 'SubmenuLinks';

    spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${generalLibraryListName}')/items?$select=Title,LibraryUrl`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data) => {
        if (data && data.value && data.value.length > 0) {
          setGeneralLibraryLink(data.value[0].LibraryUrl);
        }
      })
      .catch(error => console.error('Error fetching General Library URL:', error));

    spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${departmentsListName}')/items?$select=Title,DepartmentUrl`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data) => {
        if (data && data.value) {
          const departmentLinks = data.value.map((item: any) => ({
            title: item.Title,
            url: item.DepartmentUrl
          }));
          setDepartments(departmentLinks);
        }
      })
      .catch(error => console.error('Error fetching Departments:', error));

    spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${submenuLinksListName}')/items?$select=Title,Url,Department/Title&$expand=Department`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data) => {
        if (data && data.value) {
          const submenuLinks = data.value.map((item: any) => ({
            title: item.Title,
            url: item.Url,
            department: item.Department.Title
          }));
          setSubmenuLinks(submenuLinks);
        }
      })
      .catch(error => console.error('Error fetching Submenu Links:', error));
  }, [siteUrl, spHttpClient]);

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
            <li> 
              <a
                href={generalLibraryLink}
                className={`btn ${styles.actionButton}`}
                onClick={() => setActiveAction('GeneralLibrary')}
                style={{ color: activeAction === 'GeneralLibrary' ? '#01A88C' : '#353d54' }}
              >
                Document Management
              </a>
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
                {departments.map((department, index) => (
                  <li key={index}>
                    <a className="dropdown-item" href={department.url}>
                      {department.title}
                    </a>
                    <ul>
                      {submenuLinks.filter(submenuLink => submenuLink.department === department.title).map((submenuLink, index) => (
                        <li key={index}>
                          <a className="dropdown-item" href={submenuLink.url}>
                            {submenuLink.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Dropdown onClick={() => setActiveAction('Options')}>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className={styles.optionDropdown} style={{ color: activeAction === 'Options' ? '#01A88C' : '#353d54' }}>
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
              className="form-control me-2"
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
        {searchResults.map((result, index) => (
          <div key={index} className={styles.searchResultItem}>
            <div className={styles.resultHeader}>
              <img src={getFileIcon(result.fileType)} alt={result.fileType} className={styles.fileIcon} />
              <h5>{result.title || 'Untitled'}</h5>
            </div>
            <p>{result.fileType || 'Unknown file type'}</p>
            <p>Author: {result.author || 'Unknown'} {result.authorEmail ? `(${result.authorEmail})` : ''}</p>
            <div className={styles.resultActions}>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                Open in SharePoint
              </a>
              {result.webUrl && (
                <a href={result.webUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                  Open in Web App
                </a>
              )}
              {result.fileType && result.fileType.toLowerCase() === 'docx' && (
                <a href={`ms-word:ofe|u|${result.url}`} className={styles.actionLink}>
                  Open in Desktop App
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;