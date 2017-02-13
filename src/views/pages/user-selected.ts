import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import * as Constants from '../../resources/constants';
const CV = Constants

interface User {
  firstName: string;
  lastName: string;
  regionId: number;
  emailAddress: string;
  personalNumber: string;
  lkp_regions_selected: number;
}

@inject(WebAPIUsers, EventAggregator)
export class UserSelected {
  public CV = CV
  routeConfig;
  user: User;
  profile = {};
  editType = null;
  originalUser: User;
  title = ''

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    console.log('activate: ' + params.id + ' (' + params.editType + ')');
    return this.api.getUserDetails(params.id).then(user => {
      if(params.editType) this.editType = params.editType;
      this.user = <User>user;
      //alert(JSON.stringify(this.user['user']));
      this.user.regionId = this.user['profile'].region.id;
      this.profile = {
        regionId: this.user['profile'].region.id,
        hubId: this.user['profile'].hub.id,
        segmentId: this.user['profile'].segment.id,
        entityId: this.user['profile'].entity.id,
        languages: []
      }
      let i = 0;
      let tmpLevel;
      for(i=0;i<this.user['profile'].languages.length;i++){
        console.log('index: ' + i);
        tmpLevel = !this.user['profile'].languages[i].proficiency ? null : this.user['profile'].languages[i].proficiency.value;
        this.profile['languages'].push({languageId:this.user['profile'].languages[i].language.id, proficiencyValue: tmpLevel});
        // this.profile['languages'].push({"languageId":this.user['profile'].languages[i].language.id, "proficiencyValue": this.user['profile'].languages[i].proficiency.value});
        //this.profile['languages'].push({languageId:this.user['profile'].languages[i].language.id, proficiencyValue: 2});
      }
      this.routeConfig.navModel.setTitle(this.user.firstName);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserViewed(this.user));
    });
  }

  canDeactivate() {
    // if (!areEqual(this.originalUser, this.user)) {
    //   let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

    //   if (!result) {
    //     this.ea.publish(new UserViewed(this.user));
    //   }

    //   return result;
    // }
    // return true;
  }

}