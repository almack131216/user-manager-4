import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelTraining {
    @bindable user;
    public CV = CV;
    message = CV.MSG_TRAINING;

    constructor() {
    }

}