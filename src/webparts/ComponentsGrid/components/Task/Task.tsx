import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import styles from './Task.module.scss';
import PinIcon from '../PinIcon/PinIcon';

import moment from 'moment';

const TaskIcon = require('./assets/TaskIcon.png');
const CloseIcon = require('./assets/close-square.png')

interface TaskProps {
  graphClient: MSGraphClientV3;
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
}

interface Task {
  id: string;
  title: string;
  startDateTime: { dateTime: string; timeZone: string } | null;
  dueDateTime: { dateTime: string; timeZone: string } | null;
  percentComplete: number;
  createdBy: { user: { id: string } };
  assignments: { [key: string]: { assignedBy: { user: { id: string } } } };
  createdDateTime: string;
}

const Task: React.FC<TaskProps> = ({ graphClient, pinned, onPinClick, onRemoveClick }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);
    const fetchTasks = async () => {
      try {
        const response = await graphClient.api('/me/planner/tasks')
          .select('id,title,startDateTime,dueDateTime,percentComplete,createdBy,assignments,createdDateTime')
          .get();
        console.log('Raw API response:', response);
        const tasksData: Task[] = response.value;
        console.log('All tasks:', tasksData);
      
        const sortedTasks = tasksData
          .sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime())
          .slice(0, 20); // Limit to 20 records
      
        setTasks(sortedTasks);
      } catch (error) {
        console.error('Error fetching tasks', error);
        setError('Failed to load tasks.');
      }
  };  const getStatusClass = (percentComplete: number) => {
    if (percentComplete === 0) return styles.notStarted;
    if (percentComplete > 0 && percentComplete < 100) return styles.inProgress;
    if (percentComplete === 100) return styles.completed;
    return '';
  };

  const ProgressCircle = ({ percentComplete }: { percentComplete: number }) => (
    <div className={styles.progressCircle}>
      <svg viewBox="0 0 36 36" className={styles.circularChart}>
        <path
          className={styles.circleBg}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={styles.circle}
          strokeDasharray={`${percentComplete}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" className={styles.percentage}>{`${percentComplete}%`}</text>
      </svg>
    </div>
  );

  const formatDate = (dateTime: string) => {
    return moment(dateTime).format('YYYY-MM-DD HH:mm');
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card} >
      <div className={styles['card-header']} >
        <img src={TaskIcon} alt="Task Icon" className={styles.taskIcon} />
        <p style={{display: 'flex', justifySelf: 'center'}}>Task</p>
        <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
            <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
        </div>
      </div>
     
      <div className={styles['task-content']}>
        <div className={styles['card-body']}>
          {tasks.length === 0 && <p className={styles.noTasks}>No pending tasks</p>}
          {tasks.map((task) => (
            <div key={task.id} className={`${styles.taskCard} ${getStatusClass(task.percentComplete)}`} onClick={() => window.open(`https://tasks.office.com/taskid=${task.id}`, '_blank')}>
              <div className={styles.taskDetails}>
                <div>
                  <p className={styles.taskTitle}>{task.title}</p>
                  <p className={styles.taskDate}><strong>Due Date:</strong> {task.dueDateTime ? formatDate(task.dueDateTime.dateTime) : 'No due date'}</p>
                </div>
                <div className={styles.taskStatus}>
                  <p>Status: {task.percentComplete === 0 ? 'Not started' : task.percentComplete === 100 ? 'Completed' : 'In progress'}</p>
                  <ProgressCircle percentComplete={task.percentComplete} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Task;