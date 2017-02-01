
import { bindable } from 'aurelia-framework';

export class UserPanelPassportVisa {
    @bindable user;
    public sel_passport_types;
    public sel_passport_nationalities;

    constructor() {

        this.sel_passport_types = [
            { "value": 1, "label": "Regular 1" },
            { "value": 2, "label": "Diplomatic 2" },
            { "value": 3, "label": "Special 3" },
            { "value": 4, "label": "Temporary 4" }
        ]

        this.sel_passport_nationalities = [
            { "value": 1, "label": "European 1" },
            { "value": 2, "label": "British 2" },
            { "value": 3, "label": "American 3" },
            { "value": 4, "label": "Canadian 4" }
        ]
    }

}