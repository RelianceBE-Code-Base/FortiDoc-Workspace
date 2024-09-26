import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './DigitalWorkspace.module.scss';
import { IDigitalWorkspaceProps } from './IDigitalWorkspaceProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header/Header';
import ComponentsGrid from '../../ComponentsGrid/ComponentsGrid';
import Chatbot from '../../chatbot/Chatbot';

export default class DigitalWorkspace extends React.Component<IDigitalWorkspaceProps> {
  componentsGridRef = React.createRef<ComponentsGrid>();

  handleHomeClick = (): void => {
    // Your code here
  }

  handleOptionsClick = (): void => {
    // Your code here
  }

  handleDismissSearchResults = (): void => {
    // This function will be passed to the Header component to handle search results dismissal
  }

  handleComponentAdd = (componentName: string): void => {
    if (this.componentsGridRef.current) {
      this.componentsGridRef.current.handleComponentAdd(componentName);
    }
  }

  public render(): React.ReactElement<IDigitalWorkspaceProps> {
    console.log('Tenant URL in DigitalWorkspace:', this.props.tenantUrl); // Debug log

    return (
      <Router>
        <section className={styles.digitalWorkspace}>
          <Header 
            onHomeClick={this.handleHomeClick}
            graphClient={this.props.graphClient}
            onDismissSearchResults={this.handleDismissSearchResults}
            onOptionsClick={this.handleOptionsClick}
            onComponentAdd={this.handleComponentAdd}
            existingComponents={this.componentsGridRef.current ? this.componentsGridRef.current.state.components.map(c => c.name) : []}
            spHttpClient={this.props.context.spHttpClient}
            siteUrl={this.props.tenantUrl}
          />

          <div className="d-flex">
            {/* <div className="container-fluid" style={{ position: 'relative', zIndex: 1 }} > */}
            <div className="container-fluid" >
              <Switch>
                <Route 
                  exact 
                  path="/" 
                  render={(props) => (
                    <ComponentsGrid 
                      ref={this.componentsGridRef}
                      graphClient={this.props.graphClient}
                      tenantUrl={this.props.tenantUrl}
                      context={this.props.pageContext}
                      listName={''}
                    />
                  )} 
                />
                <Route 
                  path="/chatbot" 
                  render={(props) => (
                    <Chatbot 
                      pageContext={this.props.pageContext} 
                    />
                  )} 
                />
              </Switch>
            </div>
          </div>
        </section>
      </Router>
    );
  }
}
