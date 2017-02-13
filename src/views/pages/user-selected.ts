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
        languages: [],
        passports: [],
        visas: [],
        trainings: []
      }
      
      /* for loops for object arrays */
      let i = 0;
      /* loop languages */     
      for(i=0;i<this.user['profile'].languages.length;i++){
        let tmpLevel = !this.user['profile'].languages[i].proficiency ? null : this.user['profile'].languages[i].proficiency.value;
        this.profile['languages'].push({languageId:this.user['profile'].languages[i].language.id, proficiencyValue: tmpLevel});
      }
      /* loop passports */     
      for(i=0;i<this.user['profile'].passports.length;i++){
        let tmpCountry = !this.user['profile'].passports[i].country ? null : this.user['profile'].passports[i].country.id;
        let tmpType = !this.user['profile'].passports[i].type ? null : this.user['profile'].passports[i].type.value;
        this.profile['passports'].push({
          countryId:tmpCountry,
          number:this.user['profile'].passports[i].number,
          typeValue:tmpType,
          expiresOn:this.user['profile'].passports[i].expiresOn
        });
      }
      /* loop visas */     
      for(i=0;i<this.user['profile'].visas.length;i++){
        let tmpCountry = !this.user['profile'].visas[i].country ? null : this.user['profile'].visas[i].country.id;
        let tmpType = !this.user['profile'].visas[i].type ? null : this.user['profile'].visas[i].type.value;
        this.profile['visas'].push({
          countryId:tmpCountry,
          typeValue:tmpType,
          multipleEntry:this.user['profile'].visas[i].multipleEntry,
          expiresOn:this.user['profile'].visas[i].expiresOn
        });
      }
      /* loop trainings */     
      for(i=0;i<this.user['profile'].trainings.length;i++){
        let tmpTraining = !this.user['profile'].trainings[i].training ? null : this.user['profile'].trainings[i].training.id;
        this.profile['trainings'].push({
          trainingId:tmpTraining,
          expiresOn:this.user['profile'].trainings[i].expiresOn
        });
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