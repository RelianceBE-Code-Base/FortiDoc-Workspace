import { MSGraphClientV3 } from '@microsoft/sp-http';
import {PageContext} from '@microsoft/sp-page-context'


export interface IDigitalWorkspaceProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  graphClient: MSGraphClientV3; 
  pageContext: PageContext;
}
