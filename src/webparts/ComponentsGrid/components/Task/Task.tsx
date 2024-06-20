import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import styles from './Task.module.scss';

const TaskIcon = require('./assets/TaskIcon.png');

interface TaskProps {
  graphClient: MSGraphClientV3;
}

interface Task {
  id: string;
  title: string;
  dueDateTime: { dateTime: string; timeZone: string } | null;
  percentComplete: number;
  status?: string; // Make status optional
}

const Task: React.FC<TaskProps> = ({ graphClient }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await graphClient.api('/me/planner/tasks').top(5).get();
      const tasksData: Task[] = response.value;
      setTasks(tasksData.filter(task => task.dueDateTime !== null && task.dueDateTime.dateTime !== null));
    } catch (error) {
      console.error('Error fetching tasks', error);
      setError('Failed to load tasks.');
    }
  };

  const getStatusClass = (status?: string) => {
    if (!status) {
      return '';
    }
    switch (status.toLowerCase()) {
      case 'notstarted':
        return styles.notStarted;
      case 'inprogress':
        return styles.inProgress;
      case 'completed':
        return styles.completed;
      default:
        return '';
    }
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

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={TaskIcon} style={{ display: 'flex' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Tasks</p>
        <div></div>
      </div>
      <div className={styles['Task-content']}>
        <div className={styles['card-body']}>
        {/* {tasks.length == 0 && <p style={{alignSelf: 'center', fontWeight: 'bold', justifySelf: 'center'}}>No pending tasks</p>} */}

          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]} ${getStatusClass(task.status)}`}
            >
              <div className={styles.date}>
                <span className={styles.day}>
                  {task.dueDateTime ? new Date(task.dueDateTime.dateTime).toLocaleDateString('en-US', {
                    day: 'numeric',
                  }) : ''}
                </span>
                <span className={styles.month}>
                  {task.dueDateTime ? new Date(task.dueDateTime.dateTime).toLocaleDateString('en-US', {
                    month: 'short',
                  }) : ''}
                </span>
              </div>
              <div className={styles.details}>
                <p className={styles.title}>{task.title}</p>
                <ProgressCircle percentComplete={task.percentComplete} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Task;