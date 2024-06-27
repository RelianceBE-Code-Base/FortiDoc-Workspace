import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import styles from './MicrosoftTeams.module.scss';

const TeamsIcon = require('./assets/TeamsIcon.png');

interface MicrosoftTeamsProps {
  graphClient: MSGraphClientV3;
}

interface Chat {
  id: string;
  topic: string;
}

interface ChatMessage {
  id: string;
  from: {
    user: {
      displayName: string;
      id: string;
    };
  } | null; // from can be null
  body: {
    content: string;
  };
  createdDateTime: string;
}

const MicrosoftTeams: React.FC<MicrosoftTeamsProps> = ({ graphClient }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({});
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string | null }>({});
  const [loginUserId, setLoginUserId] = useState<string>('');

  useEffect(() => {
    fetchChats();
    fetchLoginUser();
  }, []);

  const fetchLoginUser = async () => {
    try {
      const response = await graphClient.api('/me').get();
      setLoginUserId(response.id);
    } catch (error) {
      console.error('Error fetching login user', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await graphClient.api('/me/chats').get();
      const chats: Chat[] = response.value;
      setChats(chats);
      fetchMessagesForChats(chats);
    } catch (error) {
      console.error('Error fetching chats', error);
      setError('Failed to load chats.');
    }
  };

  const fetchMessagesForChats = async (chats: Chat[]) => {
    try {
      const allMessages: { [key: string]: ChatMessage[] } = {};
      for (const chat of chats) {
        const response = await graphClient.api(`/me/chats/${chat.id}/messages`).get();
        allMessages[chat.id] = response.value;
      }
      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching messages', error);
      setError('Failed to load messages.');
    }
  };

  const fetchUserPhoto = async (userId: string) => {
    try {
      const response = await graphClient.api(`/users/${userId}/photo/$value`).get();
      const url = URL.createObjectURL(response);
      setPhotoUrls((prevPhotoUrls) => ({ ...prevPhotoUrls, [userId]: url }));
    } catch (error) {
      console.error('Error fetching user photo', error);
      setPhotoUrls((prevPhotoUrls) => ({ ...prevPhotoUrls, [userId]: null }));
    }
  };

  useEffect(() => {
    Object.values(messages).reduce((acc, curr) => [...acc, ...curr], []).forEach((message) => {
      if (message.from && message.from.user && message.from.user.id) {
        fetchUserPhoto(message.from.user.id);
      }
    });
  }, [messages, graphClient]);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedChatMessages(messages[chat.id] || []);
  };

  const handleCloseModal = () => {
    setSelectedChat(null);
    setSelectedChatMessages([]);
  };

  const formatMessagePreview = (message: ChatMessage) => {
  const content = message.body.content.replace(/<[^>]+>/g, ''); // Remove HTML tags
  if (message.from && message.from.user) {
    return message.from.user.id === loginUserId? `You: ${content}` : content;
  } else {
    return content; // Display the message body even if the sender is unknown
  }
};

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} style={{ backgroundColor: '#e6f6fd' }}>
        <img src={TeamsIcon} style={{ display: 'flex' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Microsoft Teams</p>
        <div></div>
      </div>
      <div className={styles['card-body']}>
        {chats.map((chat) => {
          const lastMessage = messages[chat.id] ? messages[chat.id][messages[chat.id].length - 1] : null;
          if (!lastMessage) return null;
          return (
<div key={chat.id} className={styles.message} onClick={() => handleChatClick(chat)}>
              <div className={styles.messageHeader}>
                {lastMessage.from && lastMessage.from.user? (
                  <>
                    <img src={photoUrls[lastMessage.from.user.id] || ''} className={styles.avatar} alt="Avatar" />
                    <div className={styles.messageInfo}>
                      <div className={styles.senderName}>{lastMessage.from.user.displayName}</div>
                      <div className={styles.messagePreview} dangerouslySetInnerHTML={{ __html: formatMessagePreview(lastMessage) }} />
                    </div>
                  </>
                ) : (
                  <div className={styles.messageInfo}>
                    <div className={styles.senderName}>Unknown Sender</div>
                    <div className={styles.messagePreview} dangerouslySetInnerHTML={{ __html: formatMessagePreview(lastMessage) }} />
                  </div>
                )}
              </div>
              <div className={styles.messageTime}>
                {new Date(lastMessage.createdDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
      </div>
      {selectedChat && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleCloseModal}>
              &times;
            </span>
            {selectedChatMessages.map((message) => (
              <div key={message.id} className={styles.chatMessage}>
                <div className={styles.messageHeader}>
                  {message.from && message.from.user? (
                    <>
                      <img src={photoUrls[message.from.user.id] || ''} className={styles.avatar} alt="Avatar" />
                      <div className={styles.messageInfo}>
                        <div className={styles.senderName}>
                          {message.from.user.id === loginUserId? 'You' : message.from.user.displayName}
                        </div>
                        <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: message.body.content }} />
                      </div>
                    </>
                  ) : (
                    <div className={styles.messageInfo}>
                      <div className={styles.senderName}>Unknown Sender</div>
                      <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: message.body.content }} />
                    </div>
                  )}
                </div>
                <div className={styles.messageTime}>
                  {new Date(message.createdDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrosoftTeams;