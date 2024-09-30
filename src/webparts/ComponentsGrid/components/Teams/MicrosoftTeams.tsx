import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import styles from './MicrosoftTeams.module.scss';
import { Card, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import PinIcon from '../PinIcon/PinIcon';

const TeamsIcon = require('./assets/TeamsIcon.png');
const CloseIcon = require('./assets/close-square.png');

interface MicrosoftTeamsProps {
  graphClient: MSGraphClient;
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
}

interface Message {
  id: string;
  content: string;
  createdDateTime: string;
  sender: string;
  type: 'chat' | 'channel';
  chatId?: string;
  teamId?: string;
  channelId?: string;
}

const MicrosoftTeams: React.FC<MicrosoftTeamsProps> = ({ graphClient, pinned, onPinClick, onRemoveClick }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [graphClient]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      setLoading(true);
      setError(null);

      const chats = await graphClient.api('/me/chats').get();
      console.log('Chats:', chats);

      const teams = await graphClient.api('/me/joinedTeams').get();
      console.log('Teams:', teams);

      const allMessages: Message[] = [];

      // Fetch chat messages
      for (const chat of chats.value) {
        const messages = await graphClient.api(`/me/chats/${chat.id}/messages`).top(5).get();
        allMessages.push(...messages.value.map((m: any) => ({
          id: m.id,
          content: m.body.content,
          createdDateTime: m.createdDateTime,
          sender: m.from?.user?.displayName || (m.from ? 'System Message' : 'Unknown'),
          type: 'chat',
          chatId: chat.id
        })));
      }

      // Fetch channel messages
      for (const team of teams.value) {
        const channels = await graphClient.api(`/teams/${team.id}/channels`).get();
        for (const channel of channels.value) {
          const messages = await graphClient.api(`/teams/${team.id}/channels/${channel.id}/messages`).top(5).get();
          allMessages.push(...messages.value.map((m: any) => ({
            id: m.id,
            content: m.body.content,
            createdDateTime: m.createdDateTime,
            sender: m.from?.user?.displayName || (m.from ? 'System Message' : 'Unknown'),
            type: 'channel',
            teamId: team.id,
            channelId: channel.id
          })));        }
      }

      allMessages.sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime());
      setMessages(allMessages);
      console.log('Updated messages:', allMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRead = (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText) return;

    try {
      if (selectedMessage.type === 'chat') {
        await graphClient.api(`/me/chats/${selectedMessage.chatId}/messages`).post({
          body: {
            content: replyText
          }
        });
      } else if (selectedMessage.type === 'channel') {
        await graphClient.api(`/teams/${selectedMessage.teamId}/channels/${selectedMessage.channelId}/messages`).post({
          body: {
            content: replyText
          }
        });
      }
      setReplyText('');
      setShowModal(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    }
  };

  const calculateReceivedTime = (receivedDateTime: string): string => {
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

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={TeamsIcon} alt="Teams Icon" />
        <p style={{display: 'flex', justifySelf: 'center'}}>Microsoft Teams</p>
          <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick}>
            <img src={CloseIcon} alt="Close" />
          </button>
        </div>
      </div>
      <div className={`${styles.card} ${styles['Teams-content']}` } >
          <div className={styles.inbox}>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p>{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={styles.messageCard}>
              <Card.Header className={`${styles["card-header"]} d-flex justify-content-between align-items-center`}>
              <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                    <div>{calculateReceivedTime(message.createdDateTime)}</div>
                  </div>
              </Card.Header>
              <div className={styles["card-body"]}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Card.Title className={styles.messageFrom}>From: {message.sender}</Card.Title>
                    <p className={styles.messageDate}>{calculateReceivedTime(message.createdDateTime)}</p>
                  </div>
              
                <Card.Text className={styles.messageBody}>{message.content.substring(0, 50)}...</Card.Text>
                <div className={styles['button-holder']}>
                  <button className={styles.readButton} onClick={() => handleRead(message)}>
                    <FontAwesomeIcon icon={faEnvelopeOpen} /> Read
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMessage?.sender}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedMessage?.content}</p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MicrosoftTeams;