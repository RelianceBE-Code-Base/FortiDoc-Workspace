import * as React from 'react';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEnvelopeOpen, faReply } from '@fortawesome/free-solid-svg-icons';

interface InboxProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void;
  onRead: () => void; // Add onRead prop
  onReply: () => void; // Add onReply prop
}

const Inbox: React.FC<InboxProps> = ({ pinned, onPinClick, onRemove, onRead, onReply }) => {
  return (
    <div className="card">
      <div className="card-header" style={{ backgroundColor: '#e6f6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Inbox
        <div>
        <PinIcon pinned={pinned} onPinClick={onPinClick} />
          <button className="btn btn-sm btn-light" onClick={onRemove} style={{ marginLeft: '0px', backgroundColor: '#e6f6fd' }}>
            <FontAwesomeIcon icon={faWindowClose} size="lg" color="red"/>
          </button>
        </div>
      </div>
      <div className="card-body">
        {/* Message entry */}
        <div className="message-entry">
          <p>Just now - From: Account - You're sun to receive pniy refers and events in your inpor...</p>
          <div>
            <button className="btn btn-sm btn-primary" onClick={onRead}>
              <FontAwesomeIcon icon={faEnvelopeOpen} /> Read
            </button>
            <button className="btn btn-sm btn-secondary" onClick={onReply} style={{ marginLeft: '5px' }}>
              <FontAwesomeIcon icon={faReply} /> Reply
            </button>
          </div>
        </div>
        {/* Repeat for other messages */}
      </div>
    </div>
  );
};

export default Inbox;

// Add corresponding CSS for message-entry and buttons in your stylesheets
