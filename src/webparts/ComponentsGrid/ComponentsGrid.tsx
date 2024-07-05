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

export interface ComponentConfig {
  name: string;
  component: React.ComponentType<any>;
  width: string;
  pinned: boolean;
  msGraphClient?: any;
  order: number;
  isRemoved: boolean;
}

interface ComponentsGridProps {
  graphClient: any;
  tenantUrl: string;
  listName: string;
  context: any;
}

interface ComponentsGridState {
  components: ComponentConfig[];
  userEmail: string | null;
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
      });
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

      this.setState({ components: components.sort((a, b) => a.order - b.order) });
    } catch (error) {
      console.error('Error loading components:', error);
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
          Order0: updates.order // Ensure that you are updating the correct column name
        });
      } else {
        await list.items.add({
          Title: name,
          UserEmail: this.state.userEmail,
          Pinned: updates.pinned,
          IsRemoved: updates.isRemoved,
          Order0: updates.order // Ensure that you are adding the correct column name
        });
      }
    } catch (error) {
      console.error('Error saving component:', error);
    }
  }
  
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
      }).filter(component => !component.isRemoved);
      return { components: updatedComponents };
    });
  }

  handleComponentAdd = (componentName: string) => {
    const updatedComponents = this.state.components.map(component => {
      if (component.name === componentName) {
        return { ...component, isRemoved: false };
      }
      return component;
    });

    this.setState({ components: updatedComponents });
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
              {this.state.components.map((component, index) => {
                const Component = component.component; // Use a capital letter for the component tag
                let columnWidth = component.width;
                return (
                  <Draggable key={component.name} draggableId={component.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...(component.pinned ? {} : provided.dragHandleProps)}
                        className={`mb-3 ${columnWidth}`}
                      >
                        <Component
                          pinned={component.pinned}
                          graphClient={this.props.graphClient}
                          onPinClick={() => this.handlePinComponent(component.name)}
                          onRemoveClick={() => this.handleRemoveComponent(component.name)}
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

  // handleAddComponent = (component: ComponentConfig): void => {
  //   this.setState((prevState) => {
  //     const newComponent = { ...component, order: prevState.components.length };
  //     this.saveComponent(component.name, newComponent);
  //     return {
  //       components: [...prevState.components, newComponent]
  //     };
  //   });
  // }

  render() {
    return (
      <div className={`row mx-0`}>
        <ToastContainer />
        {this.renderComponents()}
      </div>
    );
  }
}
