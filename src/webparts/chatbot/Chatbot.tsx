import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import styles from './Chatbot.module.scss';
import type { IChatbotProps } from './IChatbotProps';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { SendIcon } from '@fluentui/react-icons-mdl2';
import { Icon } from '@fluentui/react/lib/Icon';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Link } from '@fluentui/react/lib/Link';
import metaIcon from './assets/metaAiIcon.png';
import userIcon from './assets/user.png';
// import invokePrompt from '../../services/ChatService';
import { invokePrompt, invokePromptWithBing } from '../../services/ChatService';
import Spinner from 'react-bootstrap/Spinner';
import CardGrid from './CardGrid';

import TypewriterMessage from './TypewriterMessage';

import { searchTavily } from '../../services/TavilyService';

// Define the Result type
type Result = {
  url: string;
};

// Update the Message type
type Message = {
  role: string;
  content: string;
  links?: string[];
};

const Chatbot: React.FC<IChatbotProps> = (props) => {
  const user_name = props.pageContext?.user?.displayName || 'Guest';

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.5); // Add this line
  const [themeColor, setThemeColor] = useState('#04a4ec');
  const [selectedButton, setSelectedButton] = useState('Balanced');
  const [useBing, setUseBing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleCardGridClick = async (query: string) => {
    setQuery(query);

    if (query.trim() === "") {
      return;
    }

    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: "user", content: query }]);
    setQuery("");

    try {
      let botResponse: string;
      if (useBing) {
        botResponse = await invokePromptWithBing(query);
      } else {
        botResponse = await invokePrompt([...messages, { role: "user", content: query }], temperature);
      }
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error('Error invoking prompt:', error);
    } finally {
      setIsLoading(false);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }

  const handleTemperatureButtonClick = (temp: number, color: string) => {
    setThemeColor(color);
    setTemperature(temp); // Uncomment this line
    setSelectedButton(temp === 1 ? 'Creative' : temp === 0 ? 'Precise' : 'Balanced');
  };

  const handleClick = async () => {
    if (query.trim() === "") {
      return;
    }

    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: "user", content: query }]);
    setQuery("");

    try {
      const searchResult = await searchTavily({
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        topic: useBing ? 'news' : 'general'
      });

      const botResponse = searchResult.answer;
      const links = searchResult.results.map((result: Result) => result.url);

      setMessages(prevMessages => [
        ...prevMessages, 
        { role: "assistant", content: botResponse, links: links }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  const handleToggleChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
    setUseBing(checked || false);
  };

  const clearHistory = () => {
    setIsLoading(false);
    setQuery("");
    setMessages([]);
  };

  // Helper function to extract domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <section className={styles.chatbot}>
      <div className={styles.container}>
        <div className="card" style={{ width: '100%', height: '100vh', overflowY: 'scroll', padding: '5px', backgroundColor: '#f4f4f4', overflowX: 'hidden' }} ref={containerRef}>
          <div className="card-body p-0">
            {messages.length === 0 && 
              <div className={styles.banner}>
                <img src={metaIcon} style={{ height: '40px', width: '40px', margin: '10px' }} alt="meta icon" />
                <h1>Reliance AI</h1>
              </div>
            }
            {messages.map((message, index) => (
              <div key={index} className={`card mb-2`} style={{ maxWidth: '80%', marginLeft: message.role === 'user' ? 'auto' : '10px', marginRight: message.role === 'user' ? '10px' : 'auto', marginBottom: '10px', backgroundColor: 'transparent' }}>
                <div className="card-body py-2 px-3">
                  <div className='d-flex'>
                    <img src={message.role === 'user' ? userIcon : metaIcon} className={styles.metaIcon} alt={message.role} />
                    <div className={`font-weight-bold text-${message.role === 'user' ? 'primary' : 'secondary'}`}>{message.role === 'user' ? user_name : 'Chatbot'}</div>
                  </div>
                  {message.role === 'user' ? message.content : <TypewriterMessage content={message.content} />}
                  {message.role === 'assistant' && message.links && message.links.length > 0 && (
                    <div className={styles.references}>
                      <h6 className={styles.referencesHeader}>References</h6>
                      <div className={styles.linkBubbles}>
                        {message.links.map((link, linkIndex) => (
                          <Link 
                            key={linkIndex} 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.linkBubble}
                          >
                            {getDomain(link)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 &&
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CardGrid handleClick={handleCardGridClick}/>
              <div className={`${styles['button-card']} ${styles.card}`} style={{height: 'max-content'}}>
                <div className={styles['btn-group']}>
                  <button type="button"
                    className={styles.temperatureButton}
                    style={{ backgroundColor: selectedButton === 'Creative' ? themeColor : 'white', color: selectedButton === 'Creative' ? 'white' : 'black' }}
                    onClick={() => handleTemperatureButtonClick(1, 'purple')}>Creative</button>

                  <button type="button"
                    className={styles.temperatureButton}
                    style={{ backgroundColor: selectedButton === 'Balanced' ? themeColor : 'white', color: selectedButton === 'Balanced' ? 'white' : 'black' }}
                    onClick={() => handleTemperatureButtonClick(0.5, '#04a4ec')}>Balanced</button>

                  <button type="button"
                    className={styles.temperatureButton}
                    style={{ backgroundColor: selectedButton === 'Precise' ? themeColor : 'white', color: selectedButton === 'Precise' ? 'white' : 'black' }}
                    onClick={() => handleTemperatureButtonClick(0, '#154c79')}>Precise</button>
                </div>
              </div>
            </div>
          }

          <div style={{ display: 'flex', alignSelf: 'center', width: '100%', justifyContent: 'center' }}>
            <Toggle
              label="Web"
              checked={useBing}
              onChange={handleToggleChange}
              styles={{ root: { marginRight: '10px' } }}
            />
            <button title='New Chat' className={styles.clearChat} style={{ backgroundColor: themeColor, borderColor: themeColor }} onClick={clearHistory}>
              <Icon iconName='SkypeMessage' style={{ width: '24px', height: '24px', display: 'block' }} />
            </button>

            <div className={`card ${styles['input-card']}`} style={{ borderBottomColor: themeColor }}>
              <form className="" style={{ display: 'flex', flexDirection: 'column' }}>
                <input id="messageInput" className={styles.input} disabled={isLoading} placeholder="Ask me anything..." onChange={handleInputChange} value={query} />
                {isLoading && <Spinner animation="border" className={styles.spinner} />}
                {!isLoading && <button type="button" onClick={handleClick} className={styles.sendButton} style={{ color: themeColor }}><Icon iconName='Send' /></button>}
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

