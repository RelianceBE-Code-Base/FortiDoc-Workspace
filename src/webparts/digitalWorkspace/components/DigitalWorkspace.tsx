import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './DigitalWorkspace.module.scss';
import { IDigitalWorkspaceProps } from './IDigitalWorkspaceProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header/Header';
import ComponentsGrid from '../../ComponentsGrid/ComponentsGrid';
import Chatbot from '../../chatbot/Chatbot';

export default class DigitalWorkspace extends React.Component<IDigitalWorkspaceProps> {
  handleHomeClick = (): void => {
    window.location.reload();
  }

<<<<<<< HEAD
  handlePinComponent = (name: string): void => {
    this.setState((prevState) => ({
      components: prevState.components.map((component) => {
        if (component.name === name) {
          return { ...component, pinned: !component.pinned };
        }
        return component;
      }),
    }));
  }

  handleAddComponent = (component: ComponentConfig): void => {
    this.setState((prevState) => {
      if (prevState.components.some(c => c.name === component.name)) {
        toast.warning(`${component.name} is already added.`);
        return prevState;
      }
      return {
        components: [...prevState.components, component],
      };
    });
  }

  handleRemoveComponent = (name: string): void => {
    this.setState((prevState) => ({
      components: prevState.components.filter((component) => component.name !== name),
    }));
  }

  onDragEnd = (result: DropResult): void => {
    const { destination, source } = result;

    // If there's no destination or if the item was dropped in the same place, do nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    // Check if the source or destination component is pinned
    const sourceComponent = this.state.components[source.index];
    const destinationComponent = this.state.components[destination.index];

    if (sourceComponent.pinned || destinationComponent.pinned) {
      toast.info("Pinned components cannot be moved.");
      return;
    }

    // Proceed with the drag and drop operation
    const reorderedComponents = Array.from(this.state.components);
    const [removed] = reorderedComponents.splice(source.index, 1);
    reorderedComponents.splice(destination.index, 0, removed);
    this.setState({ components: reorderedComponents });
  }

  handleDismissSearchResults = (): void => {
    // This function will be passed to the Header component to handle search results dismissal
  }

  renderComponents(): React.ReactNode {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="row mb-3"
            >
              {this.state.components.map((component, index) => {
                const Component = component.component;
                return (
                  <Draggable key={component.name} draggableId={component.name} index={index} isDragDisabled={component.pinned}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...(component.pinned ? {} : provided.dragHandleProps)}
                        className={`mb-3 ${component.width}`}
                      >
                        <Component 
                          pinned={component.pinned} 
                          onPinClick={() => this.handlePinComponent(component.name)} 
                          onRemove={() => this.handleRemoveComponent(component.name)} 
                          graphClient={this.props.graphClient} // Pass the graphClient prop
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

=======
>>>>>>> 80bd38a159d636811db8d53902e6b8339ffb836f
  public render(): React.ReactElement<IDigitalWorkspaceProps> {
    const { hasTeamsContext } = this.props;

    return (
<<<<<<< HEAD
      <section className={`${styles.digitalWorkspace} ${hasTeamsContext ? styles.teams : ''}`}>
        <Header 
          onHomeClick={this.handleHomeClick}
          graphClient={this.props.graphClient}
          onDismissSearchResults={this.handleDismissSearchResults} onOptionsClick={function (): void {
            throw new Error('Function not implemented.');
          } }        />
        <div className="d-flex">
          <Sidebar onAddComponent={this.handleAddComponent} addedComponents={[]} />
          <div className="container-fluid">
            {this.renderComponents()}
=======
      <Router>
        <section className={`${styles.digitalWorkspace} ${hasTeamsContext ? styles.teams : ''}`}>
          <Header onHomeClick={this.handleHomeClick} />
          <div className="d-flex">
            
          
            <div className="container-fluid">
              <Switch>
                <Route exact path="/" component={ComponentsGrid} />
                {/* <Route path="/" component={Chatbot} /> */}
               
                <Route path="/chatbot" render={(props) => <Chatbot pageContext={this.props.pageContext}/>}/>
              </Switch>
            </div>
>>>>>>> 80bd38a159d636811db8d53902e6b8339ffb836f
          </div>
        </section>
      </Router>
    );
  }
}
