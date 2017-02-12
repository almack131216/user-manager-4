import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
import {ApplicationState} from '../../application-state';
import { WebAPIUsers } from '../../api/web-api-users';

//@autoinject
@inject(WebAPIUsers,EventAggregator,ApplicationState)

export class Welcome {

routeConfig;
public CV = CV;
  title = '';
  isMember;

  constructor(private api: WebAPIUsers, private ea: EventAggregator, private appState: ApplicationState) {
    this.appState = appState;
    if (CV.debugConsoleLog) console.log('welcome.ts | const ' + JSON.stringify(appState) );
  }

  created(appState){
    if (CV.debugConsoleLog) console.log('welcome.ts | created: ' + JSON.stringify(this.appState) );
    if(this.appState.myProfile) this.isMember = this.appState.myProfile.currentUser.isMember;
  }

}