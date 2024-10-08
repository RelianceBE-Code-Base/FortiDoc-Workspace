import * as React from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { Card, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './Inbox.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faReply, faClock } from '@fortawesome/free-solid-svg-icons';
import { invokePrompt } from '../../../../services/ChatService';
import Spinner from 'react-bootstrap/Spinner';


const InboxIcon = require('./assets/InboxIcon.png')
const CloseIcon = require('./assets/close-square.png')
const MetaIcon = require('./assets/metaAiIcon.png')

interface InboxProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  graphClient: MSGraphClientV3;
}

interface InboxState {
  messages: Message[];
  selectedMessage: Message | null;
  showModal: boolean;
  showReplyModal: boolean;
  isGeneratingReply: boolean;
}

interface Message {
  id: string;
  title: string;
  from: string;
  date: string;
  body: string;
  fullBody: string;
  isRead: boolean;
  receivedTime: string;
}

interface AutocompleteInputProps {
  id: string;
  label: string;
  defaultValue?: string;
  onSearch: (query: string) => Promise<any[]>;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ id, label, defaultValue, onSearch }) => {
  const [value, setValue] = React.useState(defaultValue || '');
  const [suggestions, setSuggestions] = React.useState<any[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (newValue.length > 2) {
      const results = await onSearch(newValue);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: any) => {
    setValue(suggestion.mail);
    setSuggestions([]);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        className="form-control"
        id={id}
        value={value}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="list-group-item"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.displayName} ({suggestion.mail})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

class Inbox extends React.Component<InboxProps, InboxState> {
  constructor(props: InboxProps) {
    super(props);
    this.state = {
      messages: [],
      selectedMessage: null,
      showModal: false,
      showReplyModal: false,
      isGeneratingReply: false, 
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
        .select('id,subject,from,receivedDateTime,bodyPreview,body,isRead')
        .top(50)
        .get();
  
      if (response) {
        const messages = response.value.map((msg: any) => ({
          id: msg.id,
          title: msg.subject,
          from: msg.from.emailAddress.name,
          date: new Date(msg.receivedDateTime).toLocaleDateString(),
          body: msg.bodyPreview,
          fullBody: msg.body.content,
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
      this.setState({
        selectedMessage: message,
        showReplyModal: true,
      });
    }
  };

  handleCloseReplyModal = () => {
    this.setState({ showReplyModal: false });
  };

  sendReply = async () => {
    const to = (document.getElementById('replyTo') as HTMLInputElement).value;
    const cc = (document.getElementById('replyCC') as HTMLInputElement).value;
    const bcc = (document.getElementById('replyBCC') as HTMLInputElement).value;
    const subject = (document.getElementById('replySubject') as HTMLInputElement).value;
    const body = (document.getElementById('replyBody') as HTMLTextAreaElement).value;

    try {
      await this.props.graphClient
        .api('/me/sendMail')
        .post({
          message: {
            subject: subject,
            body: {
              contentType: 'Text',
              content: body
            },
            toRecipients: [{ emailAddress: { address: to } }],
            ccRecipients: cc ? [{ emailAddress: { address: cc } }] : [],
            bccRecipients: bcc ? [{ emailAddress: { address: bcc } }] : []
          }
        });

      this.handleCloseReplyModal();
      this.loadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  searchUsers = async (query: string): Promise<any[]> => {
    try {
      const response = await this.props.graphClient
        .api('/users')
        .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
        .select('displayName,mail')
        .top(10)
        .get();
      return response.value;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  generateReply = async () => {
    const { selectedMessage } = this.state;
  
    if (!selectedMessage) {
      return;
    }

    this.setState({ isGeneratingReply: true });


  
    try {
      const prompt = `Generate a professional email reply based on the following email content: \n\n${selectedMessage.fullBody}
                      Only reply with the body of the email. Do not add any other suggestions or recommendations. Also end at "Best regards"
                      The name of the sender is not required at the end of the email`;
      const generatedReply = await invokePrompt([{ role: 'user', content: prompt }], 0.5); // Adjust temperature as needed
      
      console.log(generatedReply)

      // Populate the textarea in the reply modal
      const replyBodyElement = document.getElementById('replyBody') as HTMLTextAreaElement;
      
      if (replyBodyElement) {
        replyBodyElement.value = generatedReply;
      }
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      this.setState({ isGeneratingReply: false });
    }
  };

  render() {
    const { pinned, onPinClick, onRemoveClick } = this.props;
    const { selectedMessage, showModal, showReplyModal } = this.state;

    return (
      <div className={styles.card} >
        <div className={`${styles['card-header']}`}>
          <img src={InboxIcon} style={{display: 'flex'}}/>
          <p style={{display: 'flex', justifySelf: 'center'}}>Inbox</p>
          <div style={{display: 'flex'}}>
            <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''}/>
            <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
              <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
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
                <div className={styles["card-body"]}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Card.Title className={styles.messageFrom}>From: {msg.from}</Card.Title>
                    <p className={styles.messageDate}>{msg.date}</p>
                  </div>
                  <Card.Text className={styles.messageBody}>{msg.body.split(/\s+/).slice(0,15).join(' ') + ' ...'}</Card.Text>
                  <div className={styles['button-holder']}>
                    <button className={styles.readButton} onClick={() => this.markAsRead(msg.id)}>
                      <FontAwesomeIcon icon={faEnvelopeOpen} /> Read
                    </button>
                    <button className={styles.replyButton} onClick={() => this.replyToMessage(msg.id)}>
                      <FontAwesomeIcon icon={faReply} /> Reply
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {selectedMessage && (
          <Modal show={showModal} onHide={this.handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedMessage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
              <div className={styles.emailDetails}>
                <p><strong>From:</strong> {selectedMessage.from}</p>
                <p><strong>Date:</strong> {selectedMessage.date}</p>
              </div>
              <div className={styles.emailContent}>
                <div dangerouslySetInnerHTML={{ __html: selectedMessage.fullBody }} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {selectedMessage && (
          <Modal show={showReplyModal} onHide={this.handleCloseReplyModal}>
          <Modal.Header closeButton>
            <Modal.Title>Reply to: {selectedMessage.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <AutocompleteInput
                id="replyTo"
                label="To:"
                defaultValue={selectedMessage.from}
                onSearch={this.searchUsers}
              />
              <AutocompleteInput
                id="replyCC"
                label="CC:"
                onSearch={this.searchUsers}
              />
              <AutocompleteInput
                id="replyBCC"
                label="BCC:"
                onSearch={this.searchUsers}
              />
              <div className="form-group">
                <label htmlFor="replySubject">Subject:</label>
                <input type="text" className="form-control" id="replySubject" defaultValue={`Re: ${selectedMessage.title}`} />
              </div>
              <div className="form-group">
                <label htmlFor="replyBody">Message:</label>
                <textarea className="form-control" id="replyBody" rows={5}></textarea>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className={styles.replyModalFooter}>
              {this.state.isGeneratingReply && <Spinner animation="border" className={styles.spinner} />}
              {!this.state.isGeneratingReply && (
                <div className="left">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-generate-reply`}>Generate AI Reply</Tooltip>}
                  >
                    <Button className={styles.generateReplyButton} onClick={this.generateReply}>
                      <img src={MetaIcon} alt="Generate Reply" />
                    </Button>
                  </OverlayTrigger>
                </div>
              )}
              <div className={`${styles.buttonContainer} right`}>
                <Button variant="secondary" onClick={this.handleCloseReplyModal} className={styles.modalButton}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={this.sendReply} className={styles.modalButton}>
                  Send
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
        )}
      </div>
    );
  }
}

export default Inbox;