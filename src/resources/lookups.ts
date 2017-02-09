/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/

export class Lookups {
  lkp_role;
  lkp_regions
  lkp_hub
  lkp_segment
  lkp_entity
  lkp_bp_office_address
  lkp_member_status
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

  constructor() {
    this.lkp_role = [
      { "value": 1, "name": "Viewer" },
      { "value": 3, "name": "Admin" }
    ]

    /* User Details */
    this.lkp_regions = [
      {
        "id": 1,
        "name": "Northern Hemispere"
      },
      {
        "id": 2,
        "name": "Southern Hemisphere"
      }
    ]

    this.lkp_hub = [
      { "id": 1, "name": "Hub 1.1", "regionId": 1 },
      { "id": 2, "name": "Hub 1.2", "regionId": 1 },
      { "id": 3, "name": "Hub 1.3", "regionId": 1 },
      { "id": 4, "name": "Hub 1.4", "regionId": 1 },
      { "id": 5, "name": "Hub 2.5", "regionId": 2 },
      { "id": 6, "name": "Hub 2.6", "regionId": 2 },
      { "id": 7, "name": "Hub 2.7", "regionId": 2 },
      { "id": 8, "name": "Hub 3.8", "regionId": 3 },
      { "id": 9, "name": "Hub 3.9", "regionId": 3 }
    ]

    this.lkp_segment = [
      { "id": 1, "name": "Segment 1" },
      { "id": 2, "name": "Segment 2" },
      { "id": 3, "name": "Segment 3" },
      { "id": 4, "name": "Segment 4" },
      { "id": 5, "name": "Segment 5" },
      { "id": 6, "name": "Segment 6" },
      { "id": 7, "name": "Segment 7" },
      { "id": 8, "name": "Segment 8" },
      { "id": 9, "name": "Segment 9" }
    ]

    this.lkp_entity = [
      { "id": 1, "name": "Entity 1", "segmentId": 1 },
      { "id": 2, "name": "Entity 2", "segmentId": 1 },
      { "id": 3, "name": "Entity 3", "segmentId": 1 },
      { "id": 4, "name": "Entity 4", "segmentId": 1 },
      { "id": 5, "name": "Entity 5", "segmentId": 2 },
      { "id": 6, "name": "Entity 6", "segmentId": 2 },
      { "id": 7, "name": "Entity 7", "segmentId": 2 },
      { "id": 8, "name": "Entity 8", "segmentId": 8 },
      { "id": 9, "name": "Entity 9", "segmentId": 8 }
    ]

    this.lkp_bp_office_address = [
      {
        "id": 1,
        "name": "Office 1"
      },
      {
        "id": 2,
        "name": "Office 2"
      }
    ]

    /* MRT Details */
    this.lkp_member_status = [
      { "value": 1, "label": "Status 1" },
      { "value": 2, "label": "Status 2" },
      { "value": 3, "label": "Status 3" }
    ]

    this.lkp_coatSizes = [
      { "id": 1, "name": "XXXS" },
      { "id": 2, "name": "XS" },
      { "id": 3, "name": "S" },
      { "id": 4, "name": "M" },
      { "id": 5, "name": "L" },
      { "id": 6, "name": "XL" }
    ]

    this.lkp_languages = [
      {
        "id": 1,
        "name": "English"
      },
      {
        "id": 2,
        "name": "Czech"
      },
      {
        "id": 3,
        "name": "Spanish"
      }
    ];

    this.lkp_languageLevel = [
      {
        "value": 1,
        "name": "Basic"
      },
      {
        "value": 2,
        "name": "Proficient"
      },
      {
        "value": 3,
        "name": "Fluent"
      }
    ];

    /* MRT Role Information */
    this.lkp_primaryPositions = [
      {
        "id": 1,
        "name": "Command Staff"
      },
      {
        "id": 2,
        "name": "Operations Section"
      },
      {
        "id": 3,
        "name": "Planning Section"
      }
    ]

    this.lkp_secondaryPositions = [
      {
        "id": 1,
        "name": "Deputy Incident Commanders",
        "primaryPositionId": 1
      },
      {
        "id": 2,
        "name": "Safety OfficerHealth Specialist",
        "primaryPositionId": 1
      },
      {
        "id": 3,
        "name": "Safety Officer Industrial Hygienist Specialists",
        "primaryPositionId": 1
      },
      {
        "id": 4,
        "name": "Section Chief",
        "primaryPositionId": 2
      }
    ]

    /* Passport and Visa */
    this.lkp_passportTypes = [
      {
        "value": 1,
        "name": "Regular"
      },
      {
        "value": 2,
        "name": "Diplomatic"
      },
      {
        "value": 3,
        "name": "Special"
      },
      {
        "value": 4,
        "name": "Temporary"
      }
    ]

    this.lkp_passportNationality = [
      {
        "id": 1,
        "name": "Afghanistan"
      },
      {
        "id": 2,
        "name": "Albania"
      },
      {
        "id": 3,
        "name": "Algeria"
      }
    ]

    this.lkp_visaTypes = [
      {
        "value": 1,
        "name": "Business visitor"
      },
      {
        "value": 2,
        "name": "Foreign national"
      },
      {
        "value": 3,
        "name": "Medical"
      }
    ]

    this.lkp_visaCountry = [
      {
        "id": 1,
        "name": "Afghanistan"
      },
      {
        "id": 2,
        "name": "Albania"
      },
      {
        "id": 3,
        "name": "Algeria"
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

    this.lkp_credentialLevels = [
      {
        "value": 1,
        "name": "1"
      },
      {
        "value": 2,
        "name": "2"
      },
      {
        "value": 3,
        "name": "3"
      }
    ]

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

  }
}