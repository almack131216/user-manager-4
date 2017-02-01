import { bindable } from 'aurelia-framework';

export class UserPanelMrtRole {
    @bindable user;
    public lkp_mrt_1_ics;
    public lkp_mrt_2_ics;

    constructor() {
        this.lkp_mrt_1_ics = [
            { "value": 1, "label": "Primary 1" },
            { "value": 2, "label": "Primary 2" },
            { "value": 3, "label": "Primary 3" }
        ];

        this.lkp_mrt_2_ics = [
            { "value": 1, "label": "Secondary 1" },
            { "value": 2, "label": "Secondary 2" },
            { "value": 3, "label": "Secondary 3" }
        ];
    }

}