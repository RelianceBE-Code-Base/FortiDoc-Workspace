import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUserProfileProps {
  context: WebPartContext;
  isDarkTheme: boolean;
  userDisplayName: string;
}
