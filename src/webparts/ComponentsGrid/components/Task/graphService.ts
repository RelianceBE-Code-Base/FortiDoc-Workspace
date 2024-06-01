import { Client } from '@microsoft/microsoft-graph-client';
import * as microsoftTeams from '@microsoft/teams-js';

// Initialize the Teams SDK
microsoftTeams.app.initialize().then(() => {
  console.log('Teams SDK initialized');
}).catch((error) => {
  console.error('Could not initialize Teams SDK', error);
});

// Define the shape of your task data
export interface Task {
  id: string;
  title: string;
  date: string;
  progress: number;
  status: string;
}

let token: string = '';

// Get the token from Teams
microsoftTeams.authentication.getAuthToken({
  successCallback: (result: string) => {
    token = result;
  },
  failureCallback: (error: string) => console.error('Could not get Teams token', error),
});

// Initialize the Graph client
const client = Client.init({
  authProvider: (done) => {
    done(null, token); // Pass the token to the Graph client
  },
});

export const getTasksFromGraph = async (): Promise<Task[]> => {
  try {
    // Make the request to the Microsoft Graph API
    const res = await client.api('/me/planner/tasks').get();
    return res.value;
  } catch (error) {
    console.error('Could not get tasks from Microsoft Graph', error);
    return [];
  }
};
