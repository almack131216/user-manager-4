import { bindable } from 'aurelia-framework';

export class UserPanelMrt {
    @bindable user;
    public lkp_member_status;
    public lkp_vest_colour;
    public lkp_languages;
    public lkp_languageLevels;
    public lkp_languages_limitTo = 5;


    constructor() {
        this.lkp_member_status = [
            { "value": 1, "label": "Status 1" },
            { "value": 2, "label": "Status 2" },
            { "value": 3, "label": "Status 3" }
        ]

        this.lkp_vest_colour = [
            { "value": 1, "label": "Red 1" },
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

        this.lkp_languageLevels = [
            { "value": 1, "label": "No proficiency" },
            { "value": 2, "label": "Elementary" },
            { "value": 3, "label": "Good" },
            { "value": 4, "label": "Strong" },
            { "value": 5, "label": "Fluent / Native" }
        ];
    }

}