import { bindable } from 'aurelia-framework';

export class UserPanelTraining {
    @bindable user;
    public sel_training_ics_types;
    public sel_training_ics_ss_types;

    constructor() {

        this.sel_training_ics_types = [
            { "label": "" },
            { "label": "BP IMS fundamentals" },
            { "label": "ICS 100" },
            { "label": "ICS 200" },
            { "label": "ICS 300" }
        ]

        this.sel_training_ics_ss_types = [
            { "label": "" },
            { "label": "Command" },
            { "label": "Planning" },
            { "label": "Operations" },
            { "label": "Logistics" },
            { "label": "Finance" }
        ]        

    }

}