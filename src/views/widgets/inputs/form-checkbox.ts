import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormCheckbox {  

    @bindable model;
    @bindable name = null;
    @bindable inpPlacement = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpName = null;
    @bindable inpValue = null;
    @bindable isMandatory = null;

    public initSelected: null;

    @bindable
    public inputOnly: boolean;

    activate(model) {
        // model is the passed through object
    }

    changeCallback(evt: Event): void {
    }

    tmpCreateLabel(getStr) {
        return getStr.replace(/_/g, " ").toLowerCase();
    }

    created() {
        if (CV.debugConsoleLog) console.log('[form-checkbox] created: ' + this.model);
        if (!this.inpLabel && this.name) this.inpLabel = this.tmpCreateLabel(this.name);
        if (!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
    }

}