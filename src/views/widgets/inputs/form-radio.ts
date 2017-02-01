import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormRadio {  

    @bindable inpType = "radio";
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

    @bindable
    public changed: number;

    @bindable
    public checked: number;

    @bindable model;
    activate(model) {
        // model is the passed through object
    }

    changeCallback(evt: Event): void {
        //this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
    }

}