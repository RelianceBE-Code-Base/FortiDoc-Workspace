import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Header.module.scss';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className={`navbar navbar-expand-lg navbar-light bg-light ${styles.header}`}>
      <div className="container-fluid">
        <button 
          className={`btn btn-outline-primary ${styles.homeButton}`} 
          type="button" 
          onClick={onHomeClick}
        >
          Home
        </button>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#general-library">General Library</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#product-catalogue">Product Catalogue</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#department">Department</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
