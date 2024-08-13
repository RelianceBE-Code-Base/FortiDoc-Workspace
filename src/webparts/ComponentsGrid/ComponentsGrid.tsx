import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web } from '@pnp/sp';

import GallerySlider from './components/Slider/Galleryslider';
import UserProfile from './components/UserProfile/UserProfile';
import Inbox from './components/Inbox/Inbox';
import MicrosoftTeams from './components/Teams/MicrosoftTeams';
import MicrosoftApps from './components/MicrosoftApps/MicrosoftApps';
import BusinessApps from './components/BusinessApps/BusinessApps';
import StaffDirectory from './components/StaffDirectory/StaffDirectory';
import Task from './components/Task/Task';
import Calendar from './components/Calendar/Calendar';
import CompanyEvents from './components/CompanyEvents/CompanyEvents';
import Announcement from './components/Announcement/Announcement';
import Birthday from './components/Birthday/Birthday';
import Anniversary from './components/Anniversary/Anniversary';
import checkAndCreateLists from './components/ListManager/ListManagerScript';
import { MSGraphClientV3 } from '@microsoft/sp-http';

interface ComponentConfig {
  name: string;
  component: React.ComponentType<any> | null;
  width: string;
  pinned: boolean;
  msGraphClient?: any;
  order: number;
  isRemoved: boolean;
}

interface ComponentsGridProps {
  graphClient: MSGraphClientV3;
  tenantUrl: string;
  context: any; // Replace 'any' with the correct type for your context if possible
  listName: string;
}

interface ComponentsGridState {
  components: ComponentConfig[];
  userEmail: string | null;
  newComponent?: ComponentConfig; // Add newComponent to state definition
  // other state fields...
}

export default class ComponentsGrid extends React.Component<ComponentsGridProps, ComponentsGridState> {
  constructor(props: ComponentsGridProps) {
    super(props);
    this.state = {
      components: [
        { name: 'GallerySlider', component: GallerySlider, width: 'col-md-12', pinned: false, order: 0, isRemoved: false },
        { name: 'UserProfile', component: UserProfile, width: 'col-md-4', pinned: false, order: 1, isRemoved: false },
        { name: 'Inbox', component: Inbox, width: 'col-md-4', pinned: false, order: 2, isRemoved: false, msGraphClient: this.props.graphClient },
        { name: 'MicrosoftTeams', component: MicrosoftTeams, width: 'col-md-4', pinned: false, order: 3, isRemoved: false, msGraphClient: this.props.graphClient },
        { name: 'MicrosoftApps', component: MicrosoftApps, width: 'col-md-4', pinned: false, order: 4, isRemoved: false },
        { name: 'BusinessApps', component: BusinessApps, width: 'col-md-4', pinned: false, order: 5, isRemoved: false },
        { name: 'StaffDirectory', component: StaffDirectory, width: 'col-md-4', pinned: false, order: 6, isRemoved: false },
        { name: 'Task', component: Task, width: 'col-md-4', pinned: false, order: 7, isRemoved: false },
        { name: 'Calendar', component: Calendar, width: 'col-md-4', pinned: false, order: 8, isRemoved: false },
        { name: 'CompanyEvents', component: CompanyEvents, width: 'col-md-4', pinned: false, order: 9, isRemoved: false },
        { name: 'Announcement', component: Announcement, width: 'col-md-4', pinned: false, order: 10, isRemoved: false },
        { name: 'Birthday', component: Birthday, width: 'col-md-4', pinned: false, order: 11, isRemoved: false },
        { name: 'Anniversary', component: Anniversary, width: 'col-md-4', pinned: false, order: 12, isRemoved: false }
      ],
      userEmail: null,
    };
  }

  componentDidMount() {
    const { tenantUrl } = this.props;
    const web = new Web(tenantUrl);

    web.currentUser.get().then((user: { Email: string }) => {
      this.setState({ userEmail: user.Email }, () => {
        this.loadComponents();
        checkAndCreateLists(tenantUrl, this.context.spHttpClient);
      });
    }).catch(error => {
      console.error('Error getting current user:', error);
    });
  }

  loadComponents = async () => {
    try {
      const web = new Web(this.props.tenantUrl);
      const list = await web.lists.getByTitle('PinnedComponents');
      if (!list) {
        console.error(`List 'PinnedComponents' does not exist`);
        return;
      }
      const items = await list.items.filter(`UserEmail eq '${this.state.userEmail}'`).orderBy('Order0').select('Title', 'Pinned', 'Order0', 'IsRemoved').get();

      const components = this.state.components.map((component) => {
        const item = items.find((i) => i.Title === component.name);
        if (item) {
          component.pinned = item.Pinned;
          component.order = item.Order0;
          component.isRemoved = item.IsRemoved;
        }
        return component;
      }).filter((component) => !component.isRemoved);

      if (items.length === 0) {
        // Save initial state to SharePoint list
        this.saveInitialState();
      } else {
        this.setState({ components: components.sort((a, b) => a.order - b.order) });
      }
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }

  saveInitialState = async () => {
    try {
      const { components, userEmail } = this.state;
      const web = new Web(this.props.tenantUrl);
      const list = web.lists.getByTitle('PinnedComponents');

      for (const component of components) {
        await list.items.add({
          Title: component.name,
          UserEmail: userEmail,
          Pinned: component.pinned,
          IsRemoved: component.isRemoved,
          Order0: component.order,
        });
      }

      console.log('Initial state saved successfully');
    } catch (error) {
      console.error('Error saving initial state:', error);
    }
  }

  saveComponent = async (name: string, updates: Partial<ComponentConfig>) => {
    try {
      const web = new Web(this.props.tenantUrl);
      const list = web.lists.getByTitle('PinnedComponents');
      const items = await list.items.filter(`Title eq '${name}' and UserEmail eq '${this.state.userEmail}'`).get();

      if (items.length > 0) {
        await list.items.getById(items[0].Id).update({
          Pinned: updates.pinned,
          IsRemoved: updates.isRemoved,
          Order0: updates.order,
        });
      } else {
        await list.items.add({
          Title: name,
          UserEmail: this.state.userEmail,
          Pinned: updates.pinned,
          IsRemoved: updates.isRemoved,
          Order0: updates.order,
        });
      }
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  handlePinComponent = (name: string): void => {
    this.setState((prevState) => {
      const updatedComponents = prevState.components.map((component) => {
        if (component.name === name) {
          const newPinnedState = !component.pinned;
          this.saveComponent(component.name, { pinned: newPinnedState });
          return { ...component, pinned: newPinnedState };
        }
        return component;
      });
      return { components: updatedComponents };
    });
  }

  handleRemoveComponent = (name: string): void => {
    this.setState((prevState) => {
      const updatedComponents = prevState.components.map((component) => {
        if (component.name === name) {
          this.saveComponent(component.name, { isRemoved: true });
          return { ...component, isRemoved: true };
        }
        return component;
      });

      const componentsAfterRemoval = updatedComponents.filter(component => !component.isRemoved);

      return { components: componentsAfterRemoval };
    });
  }

  checkComponentStatus = async (componentName: string) => {
    try {
      const web = new Web(this.props.tenantUrl);
      const list = web.lists.getByTitle('PinnedComponents');
      const items = await list.items.filter(`Title eq '${componentName}' and UserEmail eq '${this.state.userEmail}'`).get();

      if (items.length > 0) {
        return items[0].IsRemoved;
      }
      return true;
    } catch (error) {
      console.error('Error checking component status:', error);
      return true;
    }
  };

  handleComponentAdd = async (componentName: string) => {
    try {
      const isRemoved = await this.checkComponentStatus(componentName);

      if (isRemoved) {
        const newComponent: ComponentConfig = {
          name: componentName,
          component: this.getComponentByName(componentName),
          width: 'col-md-4',
          pinned: false,
          order: this.state.components.length,
          isRemoved: false,
        };

        this.setState((prevState) => {
          const updatedComponents = [...prevState.components, newComponent];
          return {
            ...prevState,
            components: updatedComponents.sort((a, b) => a.order - b.order)
          };
        }, async () => {
          try {
            await this.saveComponent(componentName, { isRemoved: false, order: newComponent.order });
            console.log(`Component ${componentName} added successfully`); // Debug log
            toast.success(`${componentName} has been added successfully.`);
          } catch (error) {
            console.error('Error saving component:', error);
            toast.error('There was an error adding the component.');
          }
        });
      } else {
        toast.info(`${componentName} already exists and cannot be added again.`);
      }
    } catch (error) {
      console.error('Error in handleComponentAdd:', error); // Debug log
      toast.error('There was an error adding the component.');
    }
  };
  
  getComponentByName = (name: string): React.ComponentType<any> => {
    switch (name) {
      case 'MicrosoftApps':
        return MicrosoftApps;
      case 'BusinessApps':
        return BusinessApps;
      case 'GallerySlider':
        return GallerySlider;
      case 'UserProfile':
        return UserProfile;
      case 'Inbox':
        return Inbox;
      case 'MicrosoftTeams':
        return MicrosoftTeams;
      case 'CompanyEvents':
        return CompanyEvents;
      case 'Calendar':
        return Calendar;
      case 'Task':
        return Task;
      case 'Announcement':
        return Announcement;
      case 'Birthday':
        return Birthday;
      case 'Anniversary':
        return Anniversary;
      case 'StaffDirectory':
        return StaffDirectory;
      
      default:
        return () => <div>Unknown component</div>; // Return a default component
    }
  };
  
  onDragEnd = (result: DropResult): void => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const sourceComponent = this.state.components[source.index];
    const destinationComponent = this.state.components[destination.index];

    if (sourceComponent.pinned || destinationComponent.pinned) {
      toast.info("Pinned components cannot be moved.");
      return;
    }

    const reorderedComponents = Array.from(this.state.components);
    const [removed] = reorderedComponents.splice(source.index, 1);
    reorderedComponents.splice(destination.index, 0, removed);

    reorderedComponents.forEach((component, index) => {
      component.order = index;
      this.saveComponent(component.name, { order: component.order });
    });

    this.setState({ components: reorderedComponents });
  }

  renderComponents = () => {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="row">
              {this.state.components.filter(component =>!component.isRemoved).map((component, index) => {
                let Component = component.component;
                let columnWidth = component.width;
                return (
                  <Draggable key={component.name} draggableId={component.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`my-2 ${columnWidth}`}
                      >
                        {Component && <Component // Render an instance of the component
                          key={component.name}
                          pinned={component.pinned}
                          graphClient={this.props.graphClient}
                          onPinClick={() => this.handlePinComponent(component.name)}
                          onRemoveClick={() => this.handleRemoveComponent(component.name)}
                          tenantUrl={this.props.tenantUrl}
                        />}
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

  render() {
    console.log('Rendering components:', this.state.components);
    return (
      <div className="row mx-0" style={{ paddingLeft: '45px' }}>
        <ToastContainer />
        {this.renderComponents()}
      </div>
    );
  }
}
