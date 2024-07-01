import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import { Modal } from 'react-bootstrap';
import styles from './MicrosoftTeams.module.scss';

const TeamsIcon = require('./assets/TeamsIcon.png');

interface MicrosoftTeamsProps {
  graphClient: MSGraphClient;
}

interface Chat {
  id: string;
  lastMessage: {
    sender: {
      user: {
        displayName: string;
        userId: string;
      } | null;
    } | null;
    body: {
      content: string;
    } | null;
    createdDateTime: string | null;
  } | null;
  photo: string;
}

interface Message {
  id: string;
  from: {
    user: {
      displayName: string;
    } | null;
  };
  body: {
    content: string;
  };
  createdDateTime: string;
}

const MicrosoftTeams: React.FC<MicrosoftTeamsProps> = ({ graphClient }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await graphClient.api('/me/chats').get();
      const chatData: Chat[] = await Promise.all(
        response.value.map(async (chat: any) => {
          if (chat.lastMessage?.sender) {
            try {
              const photoResponse = await graphClient.api(`/users/${chat.lastMessage.sender.user.userId}/photo/$value`).get();
              if (photoResponse.ok) {
                const photoBlob = await photoResponse.blob();
                const photoUrl = URL.createObjectURL(photoBlob);
                return {
                  ...chat,
                  photo: photoUrl,
                };
              } else {
                console.error(`Failed to fetch photo for user ${chat.lastMessage.sender.user.userId}`);
                return {
                  ...chat,
                  photo: 'https://via.placeholder.com/50',
                };
              }
            } catch (error) {
              console.error(`Error fetching photo for user ${chat.lastMessage.sender.user.userId}:`, error);
              return {
                ...chat,
                photo: 'https://via.placeholder.com/50',
              };
            }
          } else {
            return {
              ...chat,
              photo: 'https://via.placeholder.com/50',
            };
          }
        })
      );
      setChats(chatData);
      setLoading(false);
    } catch (error) {
      setError('Error fetching chats');
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await graphClient.api(`/me/chats/${chatId}/messages`).get();
      const messagesData: Message[] = response.value;
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setShowModal(true);
    fetchMessages(chat.id);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedChat(null);
    setMessages([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
          <img src={TeamsIcon} style={{ display: 'flex' }} alt="Teams Icon" />
          <p style={{ display: 'flex', justifySelf: 'center' }}>Microsoft Teams</p>
          <div></div>
        </div>
        <div className={styles['Teams-content']}>
        <div className={styles['card-body']}>
        {chats.map((chat) => (
  <div key={chat.id} className={styles.chatItem} onClick={() => handleChatClick(chat)}>
    <img src={chat.photo} alt="User Photo" className={styles.userPhoto} />
    <div className={styles.chatDetails}>
      <div className={styles.senderName}>
        {chat.lastMessage && chat.lastMessage.sender && chat.lastMessage.sender.user
         ? chat.lastMessage.sender.user.displayName
          : 'You'}
      </div>
      <div className={styles.chatSnippet}>
        {chat.lastMessage && chat.lastMessage.body? chat.lastMessage.body.content : ''}
      </div>
    </div>
    <div className={styles.chatTime}>
      {chat.lastMessage && chat.lastMessage.createdDateTime
       ? new Date(chat.lastMessage.createdDateTime).toLocaleTimeString()
        : ''}
    </div>
  </div>
))}
        </div>
      </div>
      

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Conversation with {selectedChat?.lastMessage?.sender?.user?.displayName || 'You'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {messages.map((message) => (
  <div key={message.id} className={styles.message}>
    <div className={styles.messageHeader}>
      <img
        src={selectedChat?.photo || 'https://via.placeholder.com/50'}
        alt="User Photo"
        className={styles.userPhoto}
      />
      <div className={styles.senderName}>
        {message.from && message.from.user? message.from.user.displayName : 'Unknown'}
      </div>
      <div className={styles.messageTime}>
        {new Date(message.createdDateTime).toLocaleTimeString()}
      </div>
    </div>
    <div className={styles.messageBody}>{message.body.content}</div>
  </div>
))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MicrosoftTeams;
