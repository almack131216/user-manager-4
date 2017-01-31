import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import { UserPanelDetails } from './user-panel-details';

export class UserPanelMrt {
    @bindable user;
    sel_languages;
    sel_languageLevels;

    constructor() {
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