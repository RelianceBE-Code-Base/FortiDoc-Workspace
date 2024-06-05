<<<<<<< HEAD
import { MSGraphClientV3 } from '@microsoft/sp-http';
=======
import {PageContext} from '@microsoft/sp-page-context'

>>>>>>> 80bd38a159d636811db8d53902e6b8339ffb836f

export interface IDigitalWorkspaceProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
<<<<<<< HEAD
  graphClient: MSGraphClientV3; 
=======
  pageContext: PageContext;
>>>>>>> 80bd38a159d636811db8d53902e6b8339ffb836f
}
