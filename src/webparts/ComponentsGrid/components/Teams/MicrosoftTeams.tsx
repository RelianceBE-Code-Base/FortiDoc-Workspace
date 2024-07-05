import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import styles from './MicrosoftTeams.module.scss';

const TeamsIcon = require('./assets/TeamsIcon.png');

interface MicrosoftTeamsProps {
  graphClient: MSGraphClient;
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void; 
}

// interface Chat {
//   id: string;
//   lastMessage: {
//     sender: {
//       user: {
//         displayName: string;
//         userId: string;
//       } | null;
//     } | null;
//     body: {
//       content: string;
//     } | null;
//     createdDateTime: string | null;
//   } | null;
//   photo: string;
// }

// interface Message {
//   id: string;
//   from: {
//     user: {
//       displayName: string;
//     } | null;
//   };
//   body: {
//     content: string;
//   };
//   createdDateTime: string;

// }



interface LastMessagePreview {
  body?: {
    content?: string;
  };
  createdDateTime?: string;
  from?: {
    user?: {
      displayName?: string;
    };
  };
}

interface ChatWithLastMessagePreview {
  id?: string;
  lastMessagePreview?: LastMessagePreview;
}





const MicrosoftTeams: React.FC<MicrosoftTeamsProps> = ({ graphClient }) => {
  // const [chats, setChats] = useState<Chat[]>([]);
  // const [showModal, setShowModal] = useState(false);
  // const [messages, setMessages] = useState<Message[]>([]);
  // const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [recentMessages, setRecentMessages] = useState<Array<{
    chatId: string;
    content: string;
    createdDateTime: string;
    sender: string;
  }>>([]);


  useEffect(() => {
    // fetchChats();
    getRecentChats();
  }, []);


  const getRecentChats = async () => {
    try {
      const response: { value: ChatWithLastMessagePreview[] } = await graphClient
        .api('/me/chats')
        .top(50)
        .expand('lastMessagePreview')
        .select('id,lastMessagePreview')
        .orderby('lastMessagePreview/createdDateTime desc')
        .get();

        const htmlToText = (html: string) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          return tempDiv.textContent || tempDiv.innerText || "";
      };
  
      const recentMessages = response.value.map((chat: ChatWithLastMessagePreview) => {
        const lastMessagePreview = chat.lastMessagePreview || {};
        return {
          chatId: chat.id || '',
          content: htmlToText(lastMessagePreview.body?.content! || ''),
          createdDateTime:   new Date(lastMessagePreview.createdDateTime!).toLocaleDateString() || '',
          sender: lastMessagePreview.from?.user?.displayName || 'Unknown'
        };
      });
  
      console.log('Recent messages:', recentMessages);
      
      // If you want to store it in state
      setRecentMessages(recentMessages);
  
    } catch (error) {
      console.error("Error fetching recent chats:", error);
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


  // const fetchChats = async () => {
  //   try {
  //     const response = await graphClient.api('/me/chats').get();
  //     const chatData: Chat[] = await Promise.all(
  //       response.value.map(async (chat: any) => {
  //         if (chat.lastMessage?.sender) {
  //           try {
  //             const photoResponse = await graphClient.api(`/users/${chat.lastMessage.sender.user.userId}/photo/$value`).get();
  //             if (photoResponse.ok) {
  //               const photoBlob = await photoResponse.blob();
  //               const photoUrl = URL.createObjectURL(photoBlob);
  //               return {
  //                 ...chat,
  //                 photo: photoUrl,
  //               };
  //             } else {
  //               console.error(`Failed to fetch photo for user ${chat.lastMessage.sender.user.userId}`);
  //               return {
  //                 ...chat,
  //                 photo: 'https://via.placeholder.com/50',
  //               };
  //             }
  //           } catch (error) {
  //             console.error(`Error fetching photo for user ${chat.lastMessage.sender.user.userId}:`, error);
  //             return {
  //               ...chat,
  //               photo: 'https://via.placeholder.com/50',
  //             };
  //           }
  //         } else {
  //           return {
  //             ...chat,
  //             photo: 'https://via.placeholder.com/50',
  //           };
  //         }
  //       })
  //     );
  //     setChats(chatData);
  //     setLoading(false);
  //   } catch (error) {
  //     setError('Error fetching chats');
  //     setLoading(false);
  //   }
  // };

  // const fetchMessages = async (chatId: string) => {
  //   try {
  //     const response = await graphClient.api(`/me/chats/${chatId}/messages`).get();
  //     const messagesData: Message[] = response.value;
  //     setMessages(messagesData);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // };

  // const handleChatClick = (chat: Chat) => {
  //   setSelectedChat(chat);
  //   setShowModal(true);
  //   fetchMessages(chat.id);
  // };

  // const handleClose = () => {
  //   setShowModal(false);
  //   setSelectedChat(null);
  //   setMessages([]);
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

//   return (
//     <div className={styles.card}>
//       <div className={styles['card-header']}>
//           <img src={TeamsIcon} style={{ display: 'flex' }} alt="Teams Icon" />
//           <p style={{ display: 'flex', justifySelf: 'center' }}>Microsoft Teams</p>
//           <div></div>
//         </div>
//         <div className={styles['Teams-content']}>
//         <div className={styles['card-body']}>
//         {chats.map((chat) => (
//   <div key={chat.id} className={styles.chatItem} onClick={() => handleChatClick(chat)}>
//     <img src={chat.photo} alt="User Photo" className={styles.userPhoto} />
//     <div className={styles.chatDetails}>
//       <div className={styles.senderName}>
//         {chat.lastMessage && chat.lastMessage.sender && chat.lastMessage.sender.user
//          ? chat.lastMessage.sender.user.displayName
//           : 'You'}
//       </div>
//       <div className={styles.chatSnippet}>
//         {chat.lastMessage && chat.lastMessage.body? chat.lastMessage.body.content : ''}
//       </div>
//     </div>
//     <div className={styles.chatTime}>
//       {chat.lastMessage && chat.lastMessage.createdDateTime
//        ? new Date(chat.lastMessage.createdDateTime).toLocaleTimeString()
//         : ''}
//     </div>
//   </div>
// ))}
//         </div>
//       </div>
      

//       <Modal show={showModal} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Conversation with {selectedChat?.lastMessage?.sender?.user?.displayName || 'You'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         {messages.map((message) => (
//   <div key={message.id} className={styles.message}>
//     <div className={styles.messageHeader}>
//       <img
//         src={selectedChat?.photo || 'https://via.placeholder.com/50'}
//         alt="User Photo"
//         className={styles.userPhoto}
//       />
//       <div className={styles.senderName}>
//         {message.from && message.from.user? message.from.user.displayName : 'Unknown'}
//       </div>
//       <div className={styles.messageTime}>
//         {new Date(message.createdDateTime).toLocaleTimeString()}
//       </div>
//     </div>
//     <div className={styles.messageBody}>{message.body.content}</div>
//   </div>
// ))}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );


return(

  <div className={styles.card} >
        

      <div className={`${styles['card-header']}`}>
          
          <img src={TeamsIcon} style={{display: 'flex'}}/>
          
          <p style={{display: 'flex', justifySelf: 'center'}}>Teams</p>
          
          <div style={{display: 'flex'}}>

          
          {/* <PinIcon pinned={pinned} onPinClick={onPinClick} />
          
          <FontAwesomeIcon onClick={onRemove} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/> */}
           
          </div>
      </div>
        
          
        
        <div className={`${styles.cardBody} ` } >
          <div className={styles.inbox}>
            {recentMessages.map((msg) => (
              <Card key={msg.chatId} className={`${styles.messageCard} `}>
                <Card.Header className={`${styles["card-header"]}`}>
                  <div className="d-flex align-items-center" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                    <div className={styles.receivedTime}>{calculateReceivedTime(msg.createdDateTime)}</div>
                  </div>
                </Card.Header>
                <div className={styles["card-body"]}>

                  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Card.Title className={styles.messageFrom} style={{justifySelf: 'flex-start'}}>From: {msg.sender}</Card.Title>
                    <p className={styles.messageDate} style={{justifySelf: 'flex-end'}}>{msg.createdDateTime}</p>
                  </div>

                  <Card.Text className={styles.messageBody}>{msg.content}</Card.Text>


                  <div className={styles['button-holder']}>
                    <button className={styles.readButton} >
                      <FontAwesomeIcon icon={faEnvelopeOpen} /> Read
                    </button>
                    <button className={styles.replyButton} >
                      <FontAwesomeIcon icon={faReply} /> Reply
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* {selectedMessage && (
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
        )} */}
      </div>

)
};

export default MicrosoftTeams;
