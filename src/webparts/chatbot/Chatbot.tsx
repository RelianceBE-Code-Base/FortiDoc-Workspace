import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import styles from './Chatbot.module.scss';
import type { IChatbotProps } from './IChatbotProps';
// import { IChatbotState } from './IChatbotState'; 
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { SendIcon } from '@fluentui/react-icons-mdl2';

import Carousel from './Carousel';

import metaIcon from './assets/metaAiIcon.png';
import userIcon from './assets/user.png';

import dogImage from './assets/Dog.png';
import microsoftImage from './assets/Microsoft.png';
import googleImage from './assets/Google.png';
import AiImage from './assets/AI.png';

import invokePrompt from './services/ChatService';
import Spinner from 'react-bootstrap/Spinner';

const carouselItems = [
  {
    image: googleImage,
    alt: 'Google',
    caption: 'How big is Google?',
    description: 'Explore the scale and impact of this tech giant'
  },
  {
    image: microsoftImage,
    alt: 'Microsoft',
    caption: 'Tell me about Microsoft',
    description: 'Discover the history and products of Microsoft'
  },
  {
    image: AiImage,
    alt: 'AI',
    caption: 'How is AI going to shape the future',
    description: 'Is AI with or against us?'
  },
  {
    image: dogImage,
    alt: 'dog',
    caption: 'Describe dog breeds',
    description: 'Learn about various dog breeds and their characteristics'
  }
]


type Message = {
  role: string;
  content: string;
};


const Chatbot: React.FC<IChatbotProps> = (props) => {

  const user_name = props.pageContext?.user?.displayName || 'Guest';

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [themeColor, setThemeColor] = useState('#04a4ec')
  const [selectedButton, setSelectedButton] = useState('Balanced');

  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };


  const handleTemperatureButtonClick = (temperature:number, color:string) => {

    setThemeColor(color)
    
    setTemperature(temperature)

    setSelectedButton(temperature === 1 ? 'Creative' : temperature === 0 ? 'Precise' : 'Balanced');
  }

  const handleClick = async () => {
    if (query.trim() === "") {
      return;
    }

    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: "user", content: query }]);
    setQuery("");

    try {
      const botResponse = await invokePrompt([...messages, { role: "user", content: query }], temperature);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: botResponse.toString() }]);
    } catch (error) {
      console.error('Error invoking prompt:', error);
    } finally {
      setIsLoading(false);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  const clearHistory = () => {
    setMessages([])
  }

  return (
    <section className={styles.chatbot}>
      <div className={styles.container}>
        <div className="card" style={{ width: '100%', height: '100vh', overflowY: 'scroll', padding: '5px', backgroundColor: '#f4f4f4', overflowX: 'hidden' }} ref={containerRef}>
          <div className="card-body p-0">
            {messages.length === 0 &&
              <div className={styles.banner}>
                <img src={metaIcon} style={{ height: '40px', width: '40px', margin: '10px' }} />
                <h1>Reliance AI</h1>
              </div>
            }
            {messages.map((message, index) => (
              <div key={index} className={`card mb-2`} style={{ maxWidth: '80%', marginLeft: message.role === 'user' ? 'auto' : '10px', marginRight: message.role === 'user' ? '10px' : 'auto', marginBottom: '10px', backgroundColor: 'transparent' }}>
                <div className="card-body py-2 px-3">
                  <div className='d-flex'>
                    <img src={message.role === 'user' ? userIcon : metaIcon} className={styles.metaIcon} />
                    <div className={`font-weight-bold text-${message.role === 'user' ? 'primary' : 'secondary'}`}>{message.role === 'user' ? user_name : 'Chatbot'}</div>
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 &&

            <div style={{display : 'flex', flexDirection: 'column'}}>
              <Carousel items={carouselItems} />


              <div className={styles['button-card']}>
                <div className = {styles['btn-group']}>
                  <button type="button" 
                    className = {styles.temperatureButton} 
                    style={{ backgroundColor: selectedButton === 'Creative'? themeColor: 'white', color: selectedButton === 'Creative'? 'white' : 'black'}} 
                    onClick={() => handleTemperatureButtonClick(1,'purple')}>Creative</button>

                  <button type="button" 
                    className = {styles.temperatureButton} 
                    style={{ backgroundColor: selectedButton === 'Balanced'? themeColor: 'white', color: selectedButton === 'Balanced'? 'white' : 'black' }} 
                    onClick={() => handleTemperatureButtonClick(0.5,'#04a4ec')}>Balanced</button>

                  <button type="button" 
                  className = {styles.temperatureButton} 
                  style={{ backgroundColor: selectedButton === 'Precise'? themeColor: 'white', color: selectedButton === 'Precise'? 'white' : 'black'}} 
                  onClick={() => handleTemperatureButtonClick(0,'#154c79')}>Precise</button>
                  
                </div>
              </div>

            </div>


          }
          <div style={{ display: 'flex', alignSelf: 'center', width: '100%', justifyContent: 'center' }}>
            <button className={styles.sendButton} style={{ alignSelf: 'flex-start', borderRadius: '50%', backgroundColor: themeColor, borderColor: themeColor }} onClick={clearHistory} >New Topic</button>

            <div className={`card ${styles['input-card']}`} style={{ borderBottomColor: themeColor }}>
              <form className="" style={{ display: 'flex', flexDirection: 'column' }}>
                <input id="messageInput" className={styles.input} disabled={isLoading} placeholder="Ask me anything..." onChange={handleInputChange} value={query} />
                {isLoading && <Spinner animation="border" className={styles.spinner} />}
                {!isLoading && <button type="button" onClick={handleClick} className={styles.sendButton} style={{backgroundColor: themeColor, borderColor: themeColor}}>Send</button>}
                {SendIcon}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
