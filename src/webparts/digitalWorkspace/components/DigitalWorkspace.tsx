import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './DigitalWorkspace.module.scss';
import { IDigitalWorkspaceProps } from './IDigitalWorkspaceProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header/Header'
import ComponentsGrid from '../../ComponentsGrid/ComponentsGrid';
import Chatbot from '../../chatbot/Chatbot';
// import { Router, Route, Switch } from 'react-router';
// import { HashRouter } from 'react-router-dom';






export default class DigitalWorkspace extends React.Component<IDigitalWorkspaceProps> {
 

 
  handleHomeClick = (): void => {

  }


  handleOptionsClick = (): void => {

  }
 

  

 

  handleDismissSearchResults = (): void => {
    // This function will be passed to the Header component to handle search results dismissal
  }

  

  public render(): React.ReactElement<IDigitalWorkspaceProps> {
    // const { hasTeamsContext } = this.props;

    return (
      <Router>
        <section className={styles.digitalWorkspace}>
          <Header onHomeClick={ this.handleHomeClick} graphClient={this.props.graphClient} onDismissSearchResults={this.handleDismissSearchResults} onOptionsClick={this.handleOptionsClick}/>
          <div className="d-flex">
            
          
            <div className="container-fluid">
              <Switch>
                <Route exact path="/" component={ComponentsGrid} />
                 <Route path="/" component={Chatbot} /> 
               
                <Route path="/chatbot" render={(props) => <Chatbot pageContext={this.props.pageContext}/>}/>
              </Switch>
            </div>
          </div>
        </section>
      </Router>
    )}}