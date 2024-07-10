import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUserProfileProps {
  context: WebPartContext;
  isDarkTheme: boolean;
  userDisplayName: string;
  graphClient: MSGraphClientV3;
    pinned: boolean;
    onPinClick: () => void;
    onRemoveClick: () => void; // Correct prop name 
}
