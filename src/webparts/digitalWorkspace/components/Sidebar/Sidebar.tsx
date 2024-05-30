import * as React from 'react';
import { ComponentConfig } from '../DigitalWorkspace';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars, faImage, faRobot, faUser } from '@fortawesome/free-solid-svg-icons'; // Import the bars icon
import { IconDefinition } from '@fortawesome/fontawesome-common-types'; // Import this to use IconDefinition type
import styles from './Sidebar.module.scss';

import GallerySlider from '../Slider/Galleryslider';
import UserProfile from '../UserProfile/UserProfile';
import OpenAI from '../OpenAI/OpenAI';
import OrganisationalCharts from '../OrganisationalCharts/OrganisationalCharts';
import Inbox from '../Inbox/Inbox';
import MicrosoftTeams from '../Teams/MicrosoftTeams';
import Task from '../Task/Task';
import Calendar from '../Calendar/Calendar';
import CompanyEvents from '../CompanyEvents/CompanyEvents';
import MicrosoftApps from '../MicrosoftApps/MicrosoftApps';
import BusinessApps from '../BusinessApps/BusinessApps';
import StaffDirectory from '../StaffDirectory/StaffDirectory';
import Announcement from '../Announcement/Announcement';
import DailyPerformanceAnalytics from '../DailyPerformanceAnalytics/DailyPerformanceAnalytics';
import WeeklyAnalytics from '../WeeklyAnalytics/WeeklyAnalytics';

interface SidebarProps {
  onAddComponent: (component: ComponentConfig) => void;
  addedComponents: string[]; // Pass the names of added components
}

interface ComponentInfo {
  name: string;
  component: React.ComponentType<any>;
  width: string;
  pinned: boolean;
  icon: IconDefinition; // Icon for the component
  tooltip: string; // Tooltip text for the component
}

const Sidebar: React.FC<SidebarProps> = ({ onAddComponent, addedComponents }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddComponent = (component: ComponentConfig) => {
    if (addedComponents.includes(component.name)) {
      alert(`${component.name} has already been added.`);
    } else {
      onAddComponent(component);
    }
  };

  const components: ComponentInfo[] = [
    { name: 'GallerySlider', component: GallerySlider, width: 'col-md-12', pinned: false, icon: faImage, tooltip: 'Gallery' },
    { name: 'UserProfile', component: UserProfile, width: 'col-md-4', pinned: false, icon: faUser, tooltip: 'User Profile' },
    { name: 'OpenAI', component: OpenAI, width: 'col-md-4', pinned: false, icon: faRobot, tooltip: 'Open AI' },
    { name: 'OrganisationalCharts', component: OrganisationalCharts, width: 'col-md-8', pinned: false, icon: faPlus, tooltip: 'Organisational Charts' },
    { name: 'Inbox', component: Inbox, width: 'col-md-4', pinned: false, icon: faImage, tooltip: 'Inbox' },
    { name: 'MicrosoftTeams', component: MicrosoftTeams, width: 'col-md-4', pinned: false, icon: faPlus, tooltip: 'Microsoft Teams' },
    { name: 'Task', component: Task, width: 'col-md-4', pinned: false, icon: faPlus, tooltip: 'Task' },
    { name: 'Calendar', component: Calendar, width: 'col-md-4', pinned: false, icon: faRobot, tooltip: 'Calendar' },
    { name: 'CompanyEvents', component: CompanyEvents, width: 'col-md-4', pinned: false, icon: faUser, tooltip: 'Company Events' },
    { name: 'MicrosoftApps', component: MicrosoftApps, width: 'col-md-4', pinned: false, icon: faBars, tooltip: 'Microsoft Apps' },
    { name: 'BusinessApps', component: BusinessApps, width: 'col-md-4', pinned: false, icon: faBars, tooltip: 'Business Apps' },
    { name: 'StaffDirectory', component: StaffDirectory, width: 'col-md-4', pinned: false, icon: faUser, tooltip: 'Staff Directory' },
    { name: 'Announcement', component: Announcement, width: 'col-md-4', pinned: false, icon: faRobot, tooltip: 'Announcement' },
    { name: 'DailyPerformanceAnalytics', component: DailyPerformanceAnalytics, width: 'col-md-4', pinned: false, icon: faBars, tooltip: 'Daily Performance Analytics' },
    { name: 'WeeklyAnalytics', component: WeeklyAnalytics, width: 'col-md-4', pinned: false, icon: faBars, tooltip: 'Weekly Analytics' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarToggle} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className={`${styles.sidebarContent} ${isOpen ? styles.open : ''}`}>
        {components.map((component, index) => (
          <div key={index} className={styles.sidebarIcon} onClick={() => handleAddComponent(component)}>
            <FontAwesomeIcon icon={component.icon} />
            {isOpen && <span className={styles.tooltip}>{component.tooltip}</span>} {/* Tooltip */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
