/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/
import { noView } from 'aurelia-framework';

@noView
export class Lookups {
<<<<<<< HEAD
  systemRoles;
  userTypes;
  lkp_isActive;

  constructor() {

    this.systemRoles = [
      {
        "flags": [
          {
            "value": 1,
            "name": "Viewer"
          }
        ],
        "value": 1,
        "name": "Viewer"
      },
      {
        "flags": [
          {
            "value": 1,
            "name": "Viewer"
          },
          {
            "value": 3,
            "name": "Manager"
          }
        ],
        "value": 3,
        "name": "Manager"
      }
    ]

    this.userTypes = [
      {
        "value": 1,
        "name": "All members"
      },
      {
        "value": 2,
        "name": "Readers"
      },
      {
        "value": 3,
        "name": "All"
      }
    ]

    this.lkp_isActive = [
=======

  filter_memberType
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
  lkp_trainings;
  lkp_credentialLevels;
  lkp_employmentStatuses;
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
    this.loadLookUps();
  }
  // (END) constructor

  loadLookUps(){
    //alert('? lookups.ts | loadLookUps');
    this.api.getLookups()
      .then(lookups_all => this.lookups_all = lookups_all)
      .then(() => {
        this.lookups_all = this.lookups_all['lookups'];
        //console.log('lookups_all: ' + JSON.stringify(this.lookups_all));

        /* ROLES */
        this.filter_memberType = [
          { "value": true, "name": "Members" },
          { "value": false, "name": "Non-members" }
        ]

        this.filter_active = [
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
          { "value": true, "name": "Active" },
          { "value": false, "name": "Archived" }
        ]

<<<<<<< HEAD
=======
        this.lkp_role = [
          { "value": 1, "name": "Viewer" },
          { "value": 3, "name": "Admin" }
        ]

        /* User Details */
        this.lkp_regions = this.lookups_all['regions'];
        //alert(this.lkp_regions);
        this.lkp_hub = this.lookups_all['hubs'];
        this.lkp_segment = this.lookups_all['segments'];
        this.lkp_entity = this.lookups_all['entities'];
        this.lkp_bp_office_address = this.lookups_all['offices'];
        this.lkp_coatSizes = this.lookups_all['coatSizes'];
        this.lkp_primaryPositions = this.lookups_all['primaryPositions'];
        this.lkp_secondaryPositions = this.lookups_all['secondaryPositions'];

        /* languages */
        this.lkp_languages = this.lookups_all['languages'];
        this.lkp_languageLevel = this.lookups_all['languageProficiencies'];
        
        /* Passport */
        this.lkp_passportTypes = this.lookups_all['passportTypes'];
        this.lkp_passportNationality = this.lookups_all['countries'];

        /* visa */
        this.lkp_visaTypes = this.lookups_all['visaTypes'];
        this.lkp_visaCountry = this.lookups_all['countries'];

        /* Training */
        this.lkp_trainings = this.lookups_all['trainings'];

        /* Confidential Information*/
        this.lkp_credentialLevels = this.lookups_all['credentialLevels'];
        this.lkp_employmentStatuses = this.lookups_all['employmentStatuses'];

      });
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
  }

}