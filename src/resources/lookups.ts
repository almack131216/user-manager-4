/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/
import { noView } from 'aurelia-framework';

@noView
export class Lookups {
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
          { "value": true, "name": "Active" },
          { "value": false, "name": "Archived" }
        ]

  }
  // (END) constructor

}