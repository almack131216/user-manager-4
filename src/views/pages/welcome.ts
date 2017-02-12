import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
import {ProfileState} from '../../profile-state';
import { WebAPIUsers } from '../../api/web-api-users';

//@autoinject
@inject(WebAPIUsers,EventAggregator,ProfileState)

export class Welcome {

routeConfig;
public CV = CV;
  title = '';
  isMember;

  constructor(private api: WebAPIUsers, private ea: EventAggregator, private appState: ProfileState) {
    this.appState = appState;
    if (CV.debugConsoleLog) console.log('welcome.ts | const ' + JSON.stringify(appState) );
  }

  async created(){
    //alert('welcome.ts | created');
    // if (CV.debugConsoleLog) console.log('welcome.ts | created: ' + JSON.stringify(this.appState) );
    // if(this.appState.myProfile) this.isMember = this.appState.myProfile.currentUser.isMember;
  }

}