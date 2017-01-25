import { bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants
import * as $ from 'bootstrap';


export class BtnXcAll {
    public CV = CV;
    @bindable wrapperId = null;
    //this.btnXC_x = CV.BTN_XC_Collapse;

    xc_all(getState) {
        if (CV.debugConsoleLog) console.log('xc_all: ' + getState);
        if (getState == 'expand') {
            $('#' + this.wrapperId + ' .panel-body.collapse:not(".in")').collapse('show');
        }
        if (getState == 'collapse') {
            $('#' + this.wrapperId + ' .panel-body.collapse.in').collapse('hide');
        }
    }

}