/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/
import { noView } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import * as Constants from './constants';
const CV = Constants

import { FetchConfig } from 'aurelia-auth';
import { WebAPIUsers } from '../api/web-api-users';
import { EventAggregator } from 'aurelia-event-aggregator';

import { HttpClient } from 'aurelia-http-client';

@autoinject
@inject(HttpClient, Router, FetchConfig, WebAPIUsers)

@noView
export class Lookups {

  filter_role
  filter_active

  lkp_role
  lkp_regions
  lkp_hub
  lkp_segment
  lkp_entity
  lkp_bp_office_address
  lkp_coatSizes
  lkp_languages
  lkp_languageLevel
  lkp_primaryPositions;
  lkp_secondaryPositions;
  lkp_passportTypes;
  lkp_passportNationality;
  lkp_visaTypes;
  lkp_visaCountry;
  lkp_userProfiles;
  lkp_credentialLevels;
  lkp_memberStatus;
  /* XXX
  ??? do we need lookups for...
  trainings
  */

  /* welcome */
  memberPreview
  memberPreviewXXX
  recentSubmits
  recentSubmitsXXX
  recentReviews

  lookups_all;
  http;

  activate() {
    // return a Promise that will resolve when the repos have
    // been loaded and sorted by star count.
  }

  constructor(http, private api: WebAPIUsers) {
    this.http = http;

    this.api.getLookups()
      .then(lookups_all => this.lookups_all = lookups_all)
      .then(() => {
        this.lookups_all = this.lookups_all['lookups'];
        console.log('lookups_all: ' + JSON.stringify(this.lookups_all));


        /* ROLES */
        this.filter_role = [
          { "value": true, "name": "MembersX" },
          { "value": false, "name": "Non-membersXXX" }
        ]

        this.filter_active = [
          { "value": true, "name": "Active" },
          { "value": false, "name": "Archived" }
        ]

        this.lkp_role = [
          { "value": 1, "name": "Viewer" },
          { "value": 3, "name": "Admin" }
        ]

        /* User Details */
        this.lkp_regions = this.lookups_all['regions'];
        this.lkp_hub = this.lookups_all['hubs'];
        this.lkp_segment = this.lookups_all['segments'];
        this.lkp_entity = this.lookups_all['entities'];
        this.lkp_bp_office_address = this.lookups_all['offices'];

        /* MRT Details */
        this.lkp_coatSizes = this.lookups_all['coatSizes'];

        /* languages */
        this.lkp_languages = this.lookups_all['languages'];
        this.lkp_languageLevel = this.lookups_all['languageProficiencies'];

        /* MRT Role Information */
        this.lkp_primaryPositions = this.lookups_all['primaryPositions'];
        this.lkp_secondaryPositions = this.lookups_all['secondaryPositions'];

        /* Passport */
        this.lkp_passportTypes = this.lookups_all['passportTypes'];
        this.lkp_passportNationality = this.lookups_all['countries'];

        //visa    
        this.lkp_visaTypes = this.lookups_all['visaTypes'];
        this.lkp_visaCountry = this.lookups_all['countries'];

        this.lkp_credentialLevels = this.lookups_all['credentialLevels'];

        

        /* tmp / dummyData */
        this.lkp_memberStatus = [
          {
            "value": 1,
            "name": "Employed"
          },
          {
            "value": 2,
            "name": "Retired"
          }
        ]

        this.lkp_userProfiles = [
          {
            "value": 5,
            "name": "Alex Mackenzie",
            "loginName": "AGILY\\AMackenzie",
          },
          {
            "value": 2,
            "name": "David Sousek",
            "loginName": "AGILY\\DSousek",
          }
        ]
        /* (END) tmp / dummyData */

      });


  }
}