import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPIUsers } from './api/web-api-users';


@inject(WebAPIUsers)
export class ApplicationState {

  public loggedInUser = null;
  myProfile;
  isMember;
  router;
  tmp;

  constructor(public api: WebAPIUsers, router: Router) {

    this.api.getGlobal().then(myProfile => {
      this.myProfile = myProfile;
      alert('application-status: ' + myProfile);
      //this.isMember = myProfile['currentUser'].isMember;

      if(this.isMember){
            alert('yup!');
        }else{
            alert('naaaaaaah!');
        }
    });
  }

  // constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService, lookups: Lookups, router: Router) {
  //       ea.subscribe(UserViewed, msg => this.select(msg.user));
  //       ea.subscribe(UserUpdated, msg => {
  //           let id = msg.user.id;
  //           let found = this.users.data.find(x => x.id == id);
  //           Object.assign(found, msg.user);
  //       });

  //       this.lkp_role = lookups.lkp_role;
  //       this.rolesArr = this.lkp_role.map(x =>  { return {
  //         value:x.value,
  //         name:x.name
  //       }});

  //       this.router = router;
  //   }
}