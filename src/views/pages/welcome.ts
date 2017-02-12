import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
import { ProfileState } from '../../profile-state';
import { WebAPIUsers } from '../../api/web-api-users';

//@autoinject
@inject(WebAPIUsers,EventAggregator,ProfileState)

export class Welcome {

routeConfig;
public CV = CV;
  title = '';
  myState;
  currentUser;

  constructor(myState:ProfileState) {
    this.myState = myState;
    //this.myProfile = myState
    alert('welcome.ts | const | ' + JSON.stringify(myState) + ' / ');
    // if (CV.debugConsoleLog) console.log('welcome.ts | const ' + JSON.stringify(myState) );
  }

  async created(){
    // alert('welcome.ts | created' + JSON.stringify(this.myState) + ' / ' + this.isMember2);
    // if (CV.debugConsoleLog) console.log('welcome.ts | created: ' + JSON.stringify(this.myState) );
    // if(this.myState.myProfile) this.isMember2 = this.myState.myProfile.currentUser.isMember;
  }

}