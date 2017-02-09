import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormInput {    
    /* telephone formatting */
    @bindable maskPattern = null;
    maskPatternTelephone = '+ 999 / 999999';
    maskPatternTelephoneCc = '+ 999 / 999999';    

    @bindable inpType = "text";
    @bindable formatDate = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpName = null;
    @bindable inpValue = null;
    @bindable inpValueTwoWay = null;
    @bindable isMandatory = null;
    @bindable isMemberOnly = null;

    @bindable isEnabled = true;
    @bindable isReadonly = false;

    @bindable name = null;
    @bindable value = null;

    public constructor(model) {
    }

    @bindable model;
    activate(model) {
        // model is the passed through object
    }

    tmpCreateLabel(getStr) {
        return getStr.replace(/_/g, " ").toLowerCase();
    }

    created() {
        if (CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.model);
        if (!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name);
        if (!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
    }
}

// function _findSecondInput(elt) {
//     return elt.getElementsByTagName('input')[1];
// }