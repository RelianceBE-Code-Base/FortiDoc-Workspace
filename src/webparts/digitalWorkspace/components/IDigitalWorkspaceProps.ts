import {PageContext} from '@microsoft/sp-page-context'


export interface IDigitalWorkspaceProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pageContext: PageContext;
}