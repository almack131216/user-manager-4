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
      if (params.editType) this.editType = params.editType;
      this.user = <User>user;
      //alert(JSON.stringify(this.user));
      //console.log(JSON.stringify(this.user));
      //this.user.regionId = this.user['region'].id;
      this.profile = {
        regionId: this.user['region'] ? this.user['region'].id : null,
        hubId: this.user['hub'] ? this.user['hub'].id : null,
        segmentId: this.user['segment'] ? this.user['segment'].id : null,
        entityId: this.user['entity'] ? this.user['entity'].id : null,
        languages: this.user['languages'] ? [] : null,
        passports: this.user['passports'] ? [] : null,
        visas: this.user['visas'] ? [] : null,
        trainings: this.user['trainings'] ? [] : null
      }

      /* for loops for object arrays */
      let i = 0;
      /* loop languages */
      if (this.user['languages'].length) {
        for (i = 0; i < this.user['languages'].length; i++) {
          let tmpLevel = !this.user['languages'][i].proficiency ? null : this.user['languages'][i].proficiency.value;
          this.profile['languages'].push({ languageId: this.user['languages'][i].language.id, proficiencyValue: tmpLevel });
        }
      }
      /* loop passports */
      if (this.user['passports'].length) {
        for (i = 0; i < this.user['passports'].length; i++) {
          let tmpCountry = !this.user['passports'][i].country ? null : this.user['passports'][i].country.id;
          let tmpType = !this.user['passports'][i].type ? null : this.user['passports'][i].type.value;
          this.profile['passports'].push({
            countryId: tmpCountry,
            number: this.user['passports'][i].number,
            typeValue: tmpType,
            expiresOn: this.user['passports'][i].expiresOn
          });
        }
      }
      /* loop visas */
      if (this.user['visas'].length) {
        for (i = 0; i < this.user['visas'].length; i++) {
          let tmpCountry = !this.user['visas'][i].country ? null : this.user['visas'][i].country.id;
          let tmpType = !this.user['visas'][i].type ? null : this.user['visas'][i].type.value;
          this.profile['visas'].push({
            countryId: tmpCountry,
            typeValue: tmpType,
            multipleEntry: this.user['visas'][i].multipleEntry,
            expiresOn: this.user['visas'][i].expiresOn
          });
        }
      }
      /* loop trainings */
      if (this.user['trainings'].length) {
        for (i = 0; i < this.user['trainings'].length; i++) {
          let tmpTraining = !this.user['trainings'][i].training ? null : this.user['trainings'][i].training.id;
          this.profile['trainings'].push({
            trainingId: tmpTraining,
            expiresOn: this.user['trainings'][i].expiresOn
          });
        }
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