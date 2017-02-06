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
      { "value": 0, "label": "Select" },
      { "value": 3, "label": "a Role 3" },
      { "value": 1, "label": "b Role 1" },
      { "value": 2, "label": "c Role 2" }
    ]

    /* User Details */
    this.lkp_region = [
      { "value": 1, "label": "Region 1" },
      { "value": 2, "label": "Region 2" },
      { "value": 3, "label": "Region 3" }
    ]

    this.lkp_hub = [
      { "value": 1, "label": "Hub 1", "parentValue": 1 },
      { "value": 2, "label": "Hub 2", "parentValue": 1 },
      { "value": 3, "label": "Hub 3", "parentValue": 1 },
      { "value": 4, "label": "Hub 4", "parentValue": 1 },
      { "value": 5, "label": "Hub 5", "parentValue": 2 },
      { "value": 6, "label": "Hub 6", "parentValue": 2 },
      { "value": 7, "label": "Hub 7", "parentValue": 2 },
      { "value": 8, "label": "Hub 8", "parentValue": 3 },
      { "value": 9, "label": "Hub 9", "parentValue": 3 }
    ]

    this.lkp_segment = [
      { "value": 1, "label": "Segment 1", "parentValue": 1 },
      { "value": 2, "label": "Segment 2", "parentValue": 1 },
      { "value": 3, "label": "Segment 3", "parentValue": 1 },
      { "value": 4, "label": "Segment 4", "parentValue": 1 },
      { "value": 5, "label": "Segment 5", "parentValue": 2 },
      { "value": 6, "label": "Segment 6", "parentValue": 2 },
      { "value": 7, "label": "Segment 7", "parentValue": 2 },
      { "value": 8, "label": "Segment 8", "parentValue": 3 },
      { "value": 9, "label": "Segment 9", "parentValue": 3 }
    ]

    this.lkp_entity = [
      { "value": 1, "label": "Entity 1", "parentValue": 1 },
      { "value": 2, "label": "Entity 2", "parentValue": 1 },
      { "value": 3, "label": "Entity 3", "parentValue": 1 },
      { "value": 4, "label": "Entity 4", "parentValue": 1 },
      { "value": 5, "label": "Entity 5", "parentValue": 2 },
      { "value": 6, "label": "Entity 6", "parentValue": 2 },
      { "value": 7, "label": "Entity 7", "parentValue": 2 },
      { "value": 8, "label": "Entity 8", "parentValue": 8 },
      { "value": 9, "label": "Entity 9", "parentValue": 8 }
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
      { "value": 1, "label": "Czech" },
      { "value": 2, "label": "German" },
      { "value": 3, "label": "English" },
      { "value": 4, "label": "French" }
    ];

    this.lkp_languageLevel = [
      { "value": 1, "label": "No proficiency" },
      { "value": 2, "label": "Elementary" },
      { "value": 3, "label": "Good" },
      { "value": 4, "label": "Strong" },
      { "value": 5, "label": "Fluent / Native" }
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