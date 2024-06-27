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

import Carousel from './Carousel';

import metaIcon from './assets/metaAiIcon.png'
import userIcon from './assets/user.png'

import dogImage from './assets/Dog.png'
import microsoftImage from './assets/Microsoft.png'
import googleImage from './assets/Google.png'
import AiImage from './assets/AI.png'





import invokePrompt from './services/ChatService';
import Spinner from 'react-bootstrap/Spinner';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




export default class Chatbot extends React.Component<IChatbotProps, IChatbotState> {
  
  private user_name: string;

  containerRef:React.RefObject<HTMLDivElement>;

  // test_image =  require('./Dog.jpeg')
  

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
    // this.setState(prevstate => ({
    //   // messages: [...prevstate.messages, {role: "assistant", content: `Hello ${this.user_name}. How can I help you?`}]
    //   messages: [...prevstate.messages, {role: "assistant", content: `Hello. How can I assist you?`}]
    // }));
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
          <div className="card" style={{width : '100%', height: '100vh', overflowY: 'scroll', padding: '5px', backgroundColor: '#f4f4f4', overflowX: 'hidden' }} >
            <div className="card-body p-0">

            { this.state.messages.length == 0 &&
              <div className={styles.banner}>
                <img src={metaIcon} style={{height: '40px', width: '40px', margin: '10px'}}/>
                <h1>Reliance AI</h1>
              </div>
            }




              {this.state.messages.map((message, index) => (
                // <div key={index} className={`card border-${message.role === 'user' ? 'primary' : 'secondary'} mb-2`} style={{ maxWidth: '80%', marginLeft: message.role === 'user' ? 'auto' : '10px', marginRight: message.role === 'user' ? '10px' : 'auto', marginBottom: '10px', backgroundColor: message.role === 'user' ? '#E6F7FF' : '#D5F5E3'}}>
                <div key={index} className={`card  mb-2`} style={{ maxWidth: '80%', marginLeft: message.role === 'user' ? 'auto' : '10px', marginRight: message.role === 'user' ? '10px' : 'auto', marginBottom: '10px', backgroundColor: 'transparent'}}>
                  <div className="card-body py-2 px-3">
                    <div className='d-flex'>
                      {message.role == 'user' ? <img src={userIcon} className={styles.metaIcon}/>: <img src={metaIcon} className={styles.metaIcon}/>}
                      <div className={`font-weight-bold text-${message.role === 'user' ? 'primary' : 'secondary'}`}>{message.role === 'user' ? this.user_name : 'Chatbot'}</div>
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
            { this.state.messages.length == 0 && 

             
              <div>

                 


                <Carousel items={[
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
                    ]} />

                <div className="d-flex justify-content-center my-4">
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary btn-sm">Creative</button>
                    <button type="button" className="btn btn-secondary btn-sm">Balanced</button>
                    <button type="button" className="btn btn-secondary btn-sm">Precise</button>
                  </div>
                </div>
              </div>
            }

            

            



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
