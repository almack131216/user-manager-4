import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {UserPanelDetails} from './user-panel-details';

//@inject (UserPanelDetails)
//@autoinject

export class UserPanelMrt {
    @bindable user;

    // sel_languages: [
    //   {"value":1,"label":"Red 1"},
    //   {"value":2,"label":"Yellow 2"},
    //   {"value":3,"label":"Green 3"},
    //   {"value":4,"label":"Blue 4"},
    //   {"value":5,"label":"Pink 5"},
    //   {"value":6,"label":"Purple 6"}
    // ]

}