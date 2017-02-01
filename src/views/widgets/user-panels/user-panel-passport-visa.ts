
import { bindable } from 'aurelia-framework';

export class UserPanelPassportVisa {
    @bindable user;
    public sel_passport_types;
    public sel_passport_nationalities;
    public sel_visa_countries;
    public sel_visa_types;

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

        this.sel_visa_countries = [
            { "value": 1, "label": "Country 1" },
            { "value": 2, "label": "Country 2" },
            { "value": 3, "label": "Country 3" },
            { "value": 4, "label": "Country 4" }
        ]

        this.sel_visa_types = [
            { "value": 1, "label": "Visa Type 1" },
            { "value": 2, "label": "Visa Type 2" },
            { "value": 3, "label": "Visa Type 3" },
            { "value": 4, "label": "Visa Type 4" }
        ]
    }

}