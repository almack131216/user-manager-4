/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/

export class Lookups {
  lkp_role;
  lkp_region
  lkp_hub
  lkp_segment
  lkp_entity
  lkp_bp_office_address
  lkp_member_status
  lkp_vest_colour
  lkp_languages
  lkp_languageLevel
  lkp_mrt_1_ics;
  lkp_mrt_2_ics;
  lkp_passport_type;
  lkp_passport_nationality;
  lkp_visa_country;
  lkp_visa_type;  

  constructor() {
    this.lkp_role = [
      { "value": 1, "name": "Viewer" },
      { "value": 3, "name": "Admin" }      
    ]

    /* User Details */
    this.lkp_region = [
      { "id": 1, "name": "Region 1" },
      { "id": 2, "name": "Region 2" },
      { "id": 3, "name": "Region 3" }
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
      { "value": 1, "label": "Address 1" },
      { "value": 2, "label": "Address 2" },
      { "value": 3, "label": "Address 3" }
    ]

    /* MRT Details */
    this.lkp_member_status = [
      { "value": 1, "label": "Status 1" },
      { "value": 2, "label": "Status 2" },
      { "value": 3, "label": "Status 3" }
    ]

    this.lkp_vest_colour = [
      { "value": 1, "label": "Redd 1" },
      { "value": 2, "label": "Yellow 2" },
      { "value": 3, "label": "Green 3" },
      { "value": 4, "label": "Blue 4" },
      { "value": 5, "label": "Pink 5" },
      { "value": 6, "label": "Purple 6" }
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
    this.lkp_mrt_1_ics = [
      { "value": 1, "label": "Primary 1" },
      { "value": 2, "label": "Primary 2" },
      { "value": 3, "label": "Primary 3" }
    ]

    this.lkp_mrt_2_ics = [
      { "value": 1, "label": "Secondary 1" },
      { "value": 2, "label": "Secondary 2" },
      { "value": 3, "label": "Secondary 3" }
    ]

    /* Passport and Visa */
    this.lkp_passport_type = [
      { "value": 1, "label": "Regular 1" },
      { "value": 2, "label": "Diplomatic 2" },
      { "value": 3, "label": "Special 3" },
      { "value": 4, "label": "Temporary 4" }
    ]

    this.lkp_passport_nationality = [
      { "value": 1, "label": "European 1" },
      { "value": 2, "label": "British 2" },
      { "value": 3, "label": "American 3" },
      { "value": 4, "label": "Canadian 4" }
    ]

    this.lkp_visa_country = [
      { "value": 1, "label": "Country 1" },
      { "value": 2, "label": "Country 2" },
      { "value": 3, "label": "Country 3" },
      { "value": 4, "label": "Country 4" }
    ]

    this.lkp_visa_type = [
      { "value": 1, "label": "Visa Type 1" },
      { "value": 2, "label": "Visa Type 2" },
      { "value": 3, "label": "Visa Type 3" },
      { "value": 4, "label": "Visa Type 4" }
    ]

  }
}