import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

inject(Element)
export class FormInput {
    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpValue = null;
    @bindable inpValueTwoWay = null;
    @bindable isMandatory = null;

    @bindable name = null;
    @bindable value = null;
    @bindable valTwoWay = null;

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