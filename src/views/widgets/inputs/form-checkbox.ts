import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormCheckbox {  
    @bindable model;
    
    //@bindable name = null;
    //@bindable inpPlacement = null;
    @bindable custLabel = null;
    //@bindable custPlaceholder = null;
    //@bindable inpValue = null;
    @bindable custMandatory = null;
    @bindable custReadonly = null;

    @bindable custName;

    public initSelected: null;

    public constructor(model) {

    }

    
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
        if (!this.custLabel) this.custLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : this.custName;
    }

}