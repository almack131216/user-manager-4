import { bindable } from 'aurelia-framework';

export class UserPanelMrt {
    @bindable user;
    public sel_member_status;
    public sel_vest_colour;
    public sel_languages;
    public sel_languageLevels;
    public sel_languages_limitTo = 5;


    constructor() {
        this.sel_member_status = [
            { "value": 1, "label": "Status 1" },
            { "value": 2, "label": "Status 2" },
            { "value": 3, "label": "Status 3" }
        ]

        this.sel_vest_colour = [
            { "value": 1, "label": "Red 1" },
            { "value": 2, "label": "Yellow 2" },
            { "value": 3, "label": "Green 3" },
            { "value": 4, "label": "Blue 4" },
            { "value": 5, "label": "Pink 5" },
            { "value": 6, "label": "Purple 6" }
        ]

        this.sel_languages = [
            { "value": 1, "label": "Czech" },
            { "value": 2, "label": "German" },
            { "value": 3, "label": "English" },
            { "value": 4, "label": "French" }
        ];

        this.sel_languageLevels = [
            { "value": 1, "label": "No proficiency" },
            { "value": 2, "label": "Elementary" },
            { "value": 3, "label": "Good" },
            { "value": 4, "label": "Strong" },
            { "value": 5, "label": "Fluent / Native" }
        ];
    }

}