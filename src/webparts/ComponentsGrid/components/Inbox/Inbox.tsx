import * as React from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { Card, Button, Modal } from 'react-bootstrap';
import styles from './Inbox.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEnvelopeOpen, faReply, faClock } from '@fortawesome/free-solid-svg-icons';

const InboxIcon = require('./assets/InboxIcon.png')

interface InboxProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void;
  graphClient: MSGraphClientV3;
}

interface InboxState {
  messages: Message[];
  selectedMessage: Message | null;
  showModal: boolean;
}

interface Message {
  id: string;
  title: string;
  from: string;
  date: string;
  body: string;
  isRead: boolean;
  receivedTime: string;
}

class Inbox extends React.Component<InboxProps, InboxState> {
  constructor(props: InboxProps) {
    super(props);
    this.state = {
      messages: [],
      selectedMessage: null,
      showModal: false,
    };
  }

  componentDidMount() {
    console.log('graphClient prop:', this.props.graphClient);
    if (this.props.graphClient) {
      this.loadMessages();
    } else {
      console.error('graphClient is not initialized');
    }
  }
  
  loadMessages = async () => {
    try {
      const response = await this.props.graphClient
        ?.api('/me/messages')
        .select('id,subject,from,receivedDateTime,bodyPreview,isRead')
        .get();
  
      if (response) {
        const messages = response.value.map((msg: any) => ({
        id: msg.id,
        title: msg.subject,
        from: msg.from.emailAddress.name,
        date: new Date(msg.receivedDateTime).toLocaleString(),
        body: msg.bodyPreview,
        isRead: msg.isRead,
        receivedTime: this.calculateReceivedTime(msg.receivedDateTime)
        }));
  
        this.setState({ messages });
      } else {
        console.error('No response from graphClient');
      }
    } catch (error) {
      console.error('Error loading messages', error);
    }
  };
  

  calculateReceivedTime = (receivedDateTime: string): string => {
    const now = new Date();
    const receivedDate = new Date(receivedDateTime);
    const differenceInSeconds = (now.getTime() - receivedDate.getTime()) / 1000;

    if (differenceInSeconds < 60) {
      return 'Just now';
    } else if (differenceInSeconds < 3600) {
      return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
    } else if (differenceInSeconds < 86400) {
      return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    } else if (differenceInSeconds < 172800) {
      return 'A day ago';
    } else {
      return `${Math.floor(differenceInSeconds / 86400)} days ago`;
    }
  };

  markAsRead = (id: string) => {
    this.setState((prevState) => ({
      messages: prevState.messages.map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ),
      selectedMessage: prevState.messages.find((msg) => msg.id === id) || null,
      showModal: true,
    }));
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedMessage: null });
  };

  replyToMessage = (id: string) => {
    const message = this.state.messages.find((msg) => msg.id === id);
    if (message) {
      window.open(`https://outlook.office.com/mail/deeplink/compose?to=${message.from}&subject=Re:${message.title}`);
    }
  };

  render() {
    const { pinned, onPinClick, onRemove } = this.props;
    const { selectedMessage, showModal } = this.state;

    return (
      <div className={styles.card} >
        {/* <div className="card-header container" style={{ backgroundColor: '#e6f6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding:'2px' }}>
    
          <div style={{marginLeft:'10px'}}>Inbox</div>

          <div>
            <PinIcon pinned={pinned} onPinClick={onPinClick} />
            <button className="btn btn-link text-decoration-none" onClick={onRemove}>
              <FontAwesomeIcon icon={faWindowClose} size="lg" />
            </button>
          </div>


        </div> */}

      <div className={`${styles['card-header']}`}>
          <img src={InboxIcon} style={{display: 'flex'}}/>
          <p style={{display: 'flex', justifySelf: 'center'}}>Inbox</p>
      <div>


          <PinIcon pinned={pinned} onPinClick={onPinClick} />
          <button className="btn btn-sm btn-light" onClick={onRemove} style={{ marginLeft: '0px', backgroundColor: '#e6f6fd' }}>
            <FontAwesomeIcon icon={faWindowClose} size='sm' color="red"/>
          </button>
        </div>
      </div>
        
          
        
        <div className={`${styles.card} ${styles['inbox-content']}` } >
          <div className={styles.inbox}>
            {this.state.messages.map((msg) => (
              <Card key={msg.id} className={`${styles.messageCard} ${msg.isRead ? styles.read : ''}`}>
                <Card.Header className={`${styles["card-header"]} d-flex justify-content-between align-items-center`}>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                    <div className={styles.receivedTime}>{msg.receivedTime}</div>
                  </div>
                </Card.Header>
                <Card.Body className={styles["card-body"]}>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className={styles.messageFrom}>From: {msg.from}</Card.Title>
                    <div className={styles.messageDate}>{msg.date}</div>
                  </div>
                  <Card.Text className={styles.messageBody}>{msg.body}</Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button className={styles.readButton} onClick={() => this.markAsRead(msg.id)}>
                      <FontAwesomeIcon icon={faEnvelopeOpen} /> Read
                    </Button>
                    <Button className={styles.replyButton} onClick={() => this.replyToMessage(msg.id)}>
                      <FontAwesomeIcon icon={faReply} /> Reply
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
        {selectedMessage && (
          <Modal show={showModal} onHide={this.handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMessage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>From:</strong> {selectedMessage.from}</p>
              <p>{selectedMessage.body}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}

export default Inbox;
