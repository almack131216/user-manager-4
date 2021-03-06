import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { areEqual } from '../../api/utility';
import * as Constants from '../../resources/constants';
const CV = Constants

import * as $ from 'jquery';
import 'kendo-ui-core/js/kendo.datepicker';
import { MyGlobals } from '../../my-globals';


@inject(WebAPIUsers, EventAggregator)
export class UserSelected {
  public CV = CV
  routeConfig;
  user;
  profile = {};
  pageType = null;
  isReadOnly = null;
  title = '';
  myLookups;
  myGlobals;

  accessDenied = null;

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.myGlobals = MyGlobals;
  }

  attached(){
    $('#nav_li_Team').addClass('active');
  }

  detached(){
    $('#nav_li_Team').removeClass('active');
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    console.log('activate: ' + params.id + ' (' + params.pageType + '), readonly: ' + params.isReadOnly);

    //alert(this.myGlobals.currentUser + ' && (' + params.id + '==' + this.myGlobals.currentUser.id + '||' + this.myGlobals.currentUser.isReader + ')');

    if (this.myGlobals.currentUser && (
      (params.pageType == 'edit' && (this.myGlobals.currentUser.isMember && this.myGlobals.currentUser.id == params.id))
      || (params.pageType == 'edit' && (this.myGlobals.currentUser.isEditor && this.myGlobals.currentUser.id != params.id))
      || (params.pageType == 'read' && (this.myGlobals.currentUser.isMember && this.myGlobals.currentUser.id == params.id))
      || (params.pageType == 'read' && (this.myGlobals.currentUser.isReader))
    )) {

      //reset user selected data to avoid bugs on 'accessDenied' page
      this.user = null;
      this.myGlobals.userSelected = null;
      this.myGlobals.userSelectedHasProfile = null;
      this.myGlobals.myLookups = null;
      this.myGlobals.profileSelected = null;
      //(END) reset

      return this.api.apiCall('user-selected', params.id, null)
        .then(user => {
          this.accessDenied = false;
          this.pageType = params.pageType == 'edit' ? 'edit' : 'read';
          this.isReadOnly = this.pageType == 'read' ? true : false;
          this.user = user;

          this.myGlobals.userSelected = this.user['user'];

          if (this.myGlobals.currentUser.isReader && !this.myGlobals.currentUser.isEditor && !this.user['user'].archiveStatus.isActive) this.accessDenied = true;

          //alert(JSON.stringify(this.pageType + ' / ' + this.isReadOnly));
          //console.log(JSON.stringify(this.user));
          //this.user.regionId = this.user['region'].id;
          //this.myLookups = this.user['lookups'];

          if (!this.accessDenied && this.user['profile']) {//&& this.user['profile']
            this.myGlobals.userSelectedHasProfile = true;

            this.profile = {
              regionId: this.user['profile']['region'] ? this.user['profile']['region'].id : null,
              hubId: this.user['profile']['hub'] ? this.user['profile']['hub'].id : null,
              segmentId: this.user['profile']['segment'] ? this.user['profile']['segment'].id : null,
              entityId: this.user['profile']['entity'] ? this.user['profile']['entity'].id : null,
              primaryPositionId: this.user['profile']['primaryPosition'] ? this.user['profile']['primaryPosition'].id : null,
              secondaryPosition: this.user['profile']['secondaryPosition'] ? this.user['profile']['secondaryPosition'].id : null,
              officeId: this.user['profile']['office'] ? this.user['profile']['office'].id : null,
              function: this.user['profile']['function'] ? this.user['profile']['function'] : null,
              location: this.user['profile']['location'] ? this.user['profile']['location'] : null,
              businessNumber: this.user['profile']['businessNumber'] ? this.user['profile']['businessNumber'] : null,
              personalNumber: this.user['profile']['personalNumber'] ? this.user['profile']['personalNumber'] : null,
              officeNumber: this.user['profile']['officeNumber'] ? this.user['profile']['officeNumber'] : null,
              lyncNumber: this.user['profile']['lyncNumber'] ? this.user['profile']['lyncNumber'] : null,
              homeNumber: this.user['profile']['homeNumber'] ? this.user['profile']['homeNumber'] : null,
              emergencyContactName: this.user['profile']['emergencyContactName'] ? this.user['profile']['emergencyContactName'] : null,
              emergencyContactNumber: this.user['profile']['emergencyContactNumber'] ? this.user['profile']['emergencyContactNumber'] : null,
              coatSizeId: this.user['profile']['coatSize'] ? this.user['profile']['coatSize'].id : null,

              /* arrays */
              confidentialData: this.user['profile']['confidentialData'] ? {
                memberSince: this.user['profile']['confidentialData'].memberSince ? this.user['profile']['confidentialData'].memberSince : null,
                employmentStatusValue: this.user['profile']['confidentialData']['employmentStatus'] ? this.user['profile']['confidentialData']['employmentStatus'].value : null,
                credentialLevelValue: this.user['profile']['confidentialData']['credentialLevel'] ? this.user['profile']['confidentialData']['credentialLevel'].value : null,
                field1: this.user['profile']['confidentialData'].field1 ? this.user['profile']['confidentialData'].field1 : null,
                field2: this.user['profile']['confidentialData'].field2 ? this.user['profile']['confidentialData'].field2 : null
              } : null,
              languages: this.user['profile']['languages'] ? [] : null,
              passports: this.user['profile']['passports'] ? [] : null,
              visas: this.user['profile']['visas'] ? [] : null,
              trainings: this.user['profile']['trainings'] ? [] : null
            }

            /* for loops for object arrays */
            let i = 0;
            /* loop languages */
            if (this.user['profile']['languages'].length) {
              for (i = 0; i < this.user['profile']['languages'].length; i++) {
                let tmpLevel = !this.user['profile']['languages'][i].proficiency ? null : this.user['profile']['languages'][i].proficiency.value;
                this.profile['languages'].push({ languageId: this.user['profile']['languages'][i].language.id, proficiencyValue: tmpLevel });
              }
            }
            /* loop passports */
            if (this.user['profile']['passports'].length) {
              for (i = 0; i < this.user['profile']['passports'].length; i++) {
                let tmpCountry = !this.user['profile']['passports'][i].country ? null : this.user['profile']['passports'][i].country.id;
                let tmpType = !this.user['profile']['passports'][i].type ? null : this.user['profile']['passports'][i].type.value;
                this.profile['passports'].push({
                  countryId: tmpCountry,
                  number: this.user['profile']['passports'][i].number,
                  typeValue: tmpType,
                  expiresOn: this.user['profile']['passports'][i].expiresOn
                });
              }
            }
            /* loop visas */
            if (this.user['profile']['visas'].length) {
              for (i = 0; i < this.user['profile']['visas'].length; i++) {
                let tmpCountry = !this.user['profile']['visas'][i].country ? null : this.user['profile']['visas'][i].country.id;
                let tmpType = !this.user['profile']['visas'][i].type ? null : this.user['profile']['visas'][i].type.value;
                this.profile['visas'].push({
                  countryId: tmpCountry,
                  typeValue: tmpType,
                  multipleEntry: this.user['profile']['visas'][i].multipleEntry,
                  expiresOn: this.user['profile']['visas'][i].expiresOn
                });
              }
            }
            /* loop trainings */
            if (this.user['profile']['trainings'].length) {
              for (i = 0; i < this.user['profile']['trainings'].length; i++) {
                let tmpTraining = !this.user['profile']['trainings'][i].training ? null : this.user['profile']['trainings'][i].training.id;
                this.profile['trainings'].push({
                  trainingId: tmpTraining,
                  expiresOn: this.user['profile']['trainings'][i].expiresOn
                });
              }
            }

            //alert(JSON.stringify(this.user['lookups']))
            this.myGlobals.myLookups = this.user['lookups'];
            this.myGlobals.profileSelected = this.profile;

          }

          this.routeConfig.navModel.setTitle(this.user['user'].firstName);
        });

    } else {
      //alert(this.myGlobals.currentUser + ' && (' + params.id + '==' + this.myGlobals.currentUser.id + '||' + this.myGlobals.currentUser.isReader + ')');
      this.accessDenied = true;
    }

  }
  // (END) activate()

  canDeactivate() {

  }

  get canSave() {
    return this.profile['regionId'] && this.profile['hubId'] && !this.api.isRequesting;
  }

}