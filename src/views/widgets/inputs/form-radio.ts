import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormRadio {  

    @bindable inpType = "radio";
    @bindable name = null;
    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpName = null;
    @bindable inpValue = null;
    @bindable isMandatory = null;
    @bindable inpSelected = 1;

    public constructor(model) {

    }

    @bindable
    public initSelected: null;

    @bindable expiryDate = null;

    // @bindable
    // public changed: number;

    // @bindable
    // public checked: number;

    @bindable model;
    activate(model) {
        // model is the passed through object
    }

    changeCallback(evt: Event): void {
        //this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
    }

    tmpCreateLabel(getStr) {
        return getStr.replace(/_/g, " ").toLowerCase();
    }

    created() {
        if (CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.model);
        if (!this.inpLabel && this.name) this.inpLabel = this.tmpCreateLabel(this.name);
        if (!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
    }

}