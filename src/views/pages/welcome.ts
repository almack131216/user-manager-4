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
  title = '';
  //myProfile;
  isMember;
  //appState;
  //appState: ApplicationState;

  constructor(private api: WebAPIUsers, private ea: EventAggregator, private appState: ApplicationState) {
    this.appState = appState;
    alert('welcome.ts | const ' + JSON.stringify(appState) );
  }


  created(appState){
    alert('welcome.ts | created: ' + JSON.stringify(this.appState) );
    this.isMember = this.appState.myProfile.currentUser.isMember;
    //alert('isMember: ' + this.isMember );
  }

//   activate() {
//     return this.api.getGlobal().then(myProfile => {
//       this.myProfile = myProfile;
//       this.isMember = myProfile['currentUser'].isMember;

//       if(this.isMember){
//             alert('yup!');
//         }else{
//             alert('naaaaaaah!');
//         }
//     });
//   }

    // title = 'Welcome'

    // @bindable user;
    // public CV = CV;

    // lkp_coatSizes;
    // memberPreview;
    // lookups;
    // appState;

    // constructor(lookups:Lookups,appState:ApplicationState) {
    //     this.lkp_coatSizes = lookups.lkp_coatSizes
    //     this.memberPreview = lookups.memberPreview;
    //     alert('lkp_coatSizes:' + this.lkp_coatSizes);
    //     alert(this.appState.myProfile);
    // }


}