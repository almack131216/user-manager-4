import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormRadio {  

    @bindable model;
    @bindable custType = "radio";
    @bindable name = null;
    @bindable custLabel = null;
    @bindable custPlaceholder = null;
    @bindable inpValue = null;
    @bindable custMandatory = null;

    public initSelected: null;

    @bindable inputOnly = false;

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
        if (!this.custLabel && this.name) this.custLabel = this.tmpCreateLabel(this.name);
        if (!this.custPlaceholder) this.custPlaceholder = "Enter " + this.custLabel;
    }

}