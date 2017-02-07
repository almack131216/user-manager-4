import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormRadio {  

    @bindable model;
    @bindable inpType = "radio";
    @bindable name = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpName = null;
    @bindable inpValue = null;
    @bindable isMandatory = null;
    @bindable expiryDate = null;

    public initSelected: null;

    activate(model) {
        // model is the passed through object
    }

    changeCallback(evt: Event): void {
    }

    tmpCreateLabel(getStr) {
        return getStr.replace(/_/g, " ").toLowerCase();
    }

    created() {
        if (CV.debugConsoleLog) console.log('[form-radio] created: ' + this.model);
        if (!this.inpLabel && this.name) this.inpLabel = this.tmpCreateLabel(this.name);
        if (!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
    }

}