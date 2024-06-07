import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar/Sidebar';

// Import components
import GallerySlider from './components/Slider/Galleryslider';
import Inbox from './components/Inbox/Inbox';
import MicrosoftTeams from './components/Teams/MicrosoftTeams';
import Task from './components/Task/Task';
import Calendar from './components/Calendar/Calendar';
import CompanyEvents from './components/CompanyEvents/CompanyEvents';
import MicrosoftApps from './components/MicrosoftApps/MicrosoftApps';
import BusinessApps from './components/BusinessApps/BusinessApps';
import StaffDirectory from './components/StaffDirectory/StaffDirectory';
import Announcement from './components/Announcement/Announcement';
import DailyPerformanceAnalytics from './components/DailyPerformanceAnalytics/DailyPerformanceAnalytics';
import WeeklyAnalytics from './components/WeeklyAnalytics/WeeklyAnalytics';
import OpenAI from './components/OpenAI/OpenAI';
import OrganisationalCharts from './components/OrganisationalCharts/OrganisationalCharts';
import UserProfile from './components/UserProfile/UserProfile';

export interface ComponentConfig {
  name: string;
  component: React.ComponentType<any>; // Specify the correct type for component props if known
  width: string;
  pinned: boolean;
}

interface ComponentsGridProps {
  graphClient: any;
}

interface ComponentsGridState {
  components: ComponentConfig[];
}

export default class ComponentsGrid extends React.Component<ComponentsGridProps, ComponentsGridState> {
  constructor(props: ComponentsGridProps) {
    super(props);
    this.state = {
      components: [
        { name: 'GallerySlider', component: GallerySlider, width: 'col-md-12', pinned: false },
        { name: 'UserProfile', component: UserProfile, width: 'col-md-4', pinned: false },
        { name: 'OpenAI', component: OpenAI, width: 'col-md-4', pinned: false },
        { name: 'OrganisationalCharts', component: OrganisationalCharts, width: 'col-md-4', pinned: false },
        { name: 'Inbox', component: Inbox, width: 'col-md-4', pinned: false },
        { name: 'MicrosoftTeams', component: MicrosoftTeams, width: 'col-md-4', pinned: false },
        { name: 'Task', component: Task, width: 'col-md-4', pinned: false },
        { name: 'Calendar', component: Calendar, width: 'col-md-4', pinned: false },
        { name: 'CompanyEvents', component: CompanyEvents, width: 'col-md-4', pinned: false },
        { name: 'MicrosoftApps', component: MicrosoftApps, width: 'col-md-4', pinned: false },
        { name: 'BusinessApps', component: BusinessApps, width: 'col-md-4', pinned: false },
        { name: 'StaffDirectory', component: StaffDirectory, width: 'col-md-4', pinned: false },
        { name: 'Announcement', component: Announcement, width: 'col-md-4', pinned: false },
        { name: 'DailyPerformanceAnalytics', component: DailyPerformanceAnalytics, width: 'col-md-8', pinned: false },
        { name: 'WeeklyAnalytics', component: WeeklyAnalytics, width: 'col-md-4', pinned: false },
      ],
    };
  }

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
                          graphClient={this.props.graphClient} 
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

  render() {
    return (
      <section>
        <div className='d-flex'>
          <Sidebar onAddComponent={this.handleAddComponent} addedComponents={[]} />
          <div className='container-fluid'>
            {this.renderComponents()}
          </div>
        </div>
        <ToastContainer />
      </section>
    );
  }
}
