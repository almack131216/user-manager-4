import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelDetails {
    @bindable user;
    public CV = CV;

    public lkp_region;
    public lkp_hub;
    public lkp_segment;
    public lkp_entity;
    public lkp_bp_office_address;

    constructor() {
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
    }
}