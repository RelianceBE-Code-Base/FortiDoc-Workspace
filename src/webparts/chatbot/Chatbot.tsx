import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import styles from './Chatbot.module.scss';
import type { IChatbotProps } from './IChatbotProps';
import { IChatbotState } from './IChatbotState'; 
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
// import invokePrompt from '../../services/ChatService';

import {SendIcon} from '@fluentui/react-icons-mdl2'





import invokePrompt from './services/ChatService';
import Spinner from 'react-bootstrap/Spinner';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




export default class Chatbot extends React.Component<IChatbotProps, IChatbotState> {
  
  private user_name: string;

  containerRef:React.RefObject<HTMLDivElement>;

  

  constructor (props: IChatbotProps){
    super(props);
    if (this.props.pageContext && this.props.pageContext.user) {
      this.user_name = this.props.pageContext.user.displayName;
    } else {
      this.user_name = 'Guest'; // Default to 'Guest' if user or pageContext is undefined
      console.error('pageContext or user is missing');
    }

    this.state = {
      messages: [],
      query: "",
      isLoading: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.containerRef = React.createRef()
  }

  componentDidMount(): void {
    this.setState(prevstate => ({
      // messages: [...prevstate.messages, {role: "assistant", content: `Hello ${this.user_name}. How can I help you?`}]
      messages: [...prevstate.messages, {role: "assistant", content: `Hello. How can I assist you?`}]
    }));
  }

  public handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({query: event.currentTarget.value});
  }

  public async handleClick() {
    if (this.state.query.trim() === "") {
        return;
    }

    this.setState({ isLoading : true });

    this.setState(prevState => ({
        messages: [...prevState.messages, { role: "user", content: prevState.query }]
    }), async () => {
        try {
          const inputElement = document.getElementById('messageInput') as HTMLInputElement;
          if (inputElement) {
              inputElement.value = '';
          }

          const botResponse = await invokePrompt(this.state.messages);

          this.setState(prevState => ({
              messages: [...prevState.messages, { role: "assistant", content: botResponse.toString() }]
          }), () => {
              console.log(this.state.messages);
              this.setState({ isLoading: false });

              if (this.containerRef.current) {
                this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
              }

          });
        } catch (error) {
            console.error('Error invoking prompt:', error);
        }
    });
  }

  public render(): React.ReactElement<IChatbotProps> {
    return (
      <section className={styles.chatbot}>
        <div className={styles.container}>
          {/* <div className="card" style={{ height: '400px', overflowY: 'auto', padding: '5px', backgroundColor: '#F0F0F0' }} > */}
          <div className="card" style={{ height: '100vh', overflowY: 'scroll', padding: '5px', backgroundColor: '#f4f4f4', overflowX: 'hidden' }} >
            <div className="card-body p-0">
              {this.state.messages.map((message, index) => (
                <div key={index} className={`card border-${message.role === 'user' ? 'primary' : 'secondary'} mb-2`} style={{ maxWidth: '80%', marginLeft: message.role === 'user' ? 'auto' : '10px', marginRight: message.role === 'user' ? '10px' : 'auto', marginBottom: '10px', backgroundColor: message.role === 'user' ? '#E6F7FF' : '#D5F5E3'}}>
                  <div className="card-body py-2 px-3">
                    <div className={`font-weight-bold text-${message.role === 'user' ? 'primary' : 'secondary'}`}>{message.role === 'user' ? this.user_name : 'Chatbot'}</div>
                    <div>{message.content}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className='card'>


              <form className="" style={{display: 'flex', flexDirection: 'column'}}>
           
               
                <input id="messageInput" className={styles.input} disabled={this.state.isLoading} placeholder="Ask me anything..." onChange={this.handleInputChange} />
             
                {this.state.isLoading && <Spinner animation="border" className={styles.spinner} />}
                {!this.state.isLoading && <button onClick={this.handleClick} className={styles.sendButton}>Send</button>}
                {SendIcon}
              
            </form>
            </div>



          </div>

          {/* <div className='card'>


              <form className="" style={{display: 'flex', flexDirection: 'column'}}>
           
               
                <input id="messageInput" className={styles.input} disabled={this.state.isLoading} placeholder="Ask me anything..." onChange={this.handleInputChange} />
             
                {this.state.isLoading && <Spinner animation="border" className={styles.spinner} />}
                {!this.state.isLoading && <button onClick={this.handleClick} className={styles.sendButton}>Send</button>}
                {SendIcon}
              
            </form>
            </div> */}
          
        </div>
      </section>
    );
  }
}
