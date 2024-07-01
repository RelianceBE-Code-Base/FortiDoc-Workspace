import * as React from 'react';
import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';
// import {
//   IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';

// import * as strings from 'DigitalWorkspaceWebPartStrings';
import DigitalWorkspace from './components/DigitalWorkspace';

import { IDigitalWorkspaceProps } from './components/IDigitalWorkspaceProps';
import { MSGraphClientV3 } from '@microsoft/sp-http';

export interface IDigitalWorkspaceWebPartProps {
  description: string;
}




export default class DigitalWorkspaceWebPart extends BaseClientSideWebPart<IDigitalWorkspaceWebPartProps> {





  public render(): void {
    this.context.msGraphClientFactory
      .getClient('3') // Specify the version argument
      .then((client: MSGraphClientV3): void => {
        const element: React.ReactElement<IDigitalWorkspaceProps> = React.createElement(
          DigitalWorkspace, 
          {
       
            pageContext: this.context.pageContext,
            graphClient: client,// Pass the graphClient to the DigitalWorkspace component
       
          }
        );
 

        ReactDom.render(element, this.domElement);
      });
  }
 


}
