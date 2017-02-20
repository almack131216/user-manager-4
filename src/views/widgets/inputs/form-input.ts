import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

import { BindingEngine } from "aurelia-binding";

import * as $ from 'jquery';
import 'kendo-ui-core/js/kendo.datepicker';

inject(BindingEngine, Element)
export class FormInput {
    /* telephone formatting */
    @bindable maskPattern = null;
    maskPatternTelephone = '+ 999 / 999999';
    maskPatternTelephoneCc = '+ 999 / 999999';

    @bindable custType = "text";
    @bindable formatDate = null;
    @bindable custLabel = null;//xxx
    @bindable custPlaceholder = null;
    @bindable inpValue = null;
    @bindable inpValueTwoWay = null;
    @bindable custMandatory = null;
    @bindable isMemberOnly = null;

    @bindable isEnabled = true;//xxx
    @bindable custReadonly = false;//xxx

    @bindable name = null;//xxx
    @bindable value = null;

    @bindable inputOnly = false;//xxx

    @bindable custName;

    element;

    public constructor(model,element:Element) {
        this.element = element;
    }

    attached(){
        $('.k_datepicker').click(function(e){
          //alert('???');
          e.stopPropagation();
        });
    }

    onReady(datePicker) {
        datePicker.value(this.model);
    }

    inputChanged(newValue, oldValue) {
      // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
      console.log('inputChanged: ' + this.value + ' | ' + this.model);
    }

    onChange(newValue, oldValue){
        //datePicker.value(new Date(1994, 4, 2));
        console.log('onChange() : model: ' + this.model + ' / ' +  + ', ' + oldValue);
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
        //this.name = this.custName;
        //console.log('[form-inputs] created: ' + this.name + ' > ' + CV.myLabels[this.custName]);
        if (!this.custLabel) this.custLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : this.custName;// this.tmpCreateLabel(this.name);
        if (!this.custPlaceholder) this.custPlaceholder = "Enter " + this.custLabel;
        if (this.custReadonly) this.custMandatory = false;
    }

}

// function _findSecondInput(elt) {
//     return elt.getElementsByTagName('input')[1];
// }