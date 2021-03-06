
import { inject,bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 

import * as Constants from '../../../resources/constants';
const CV = Constants

import toastr = require('toastr');

@inject(MyGlobals)
export class UserPanelPassport {
    public CV = CV;
    
    @bindable isReadOnly = null;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }

    onReady(datePicker,getValue) {
        datePicker.value(getValue ? new Date(getValue) : '');
    }

    inputChanged(newValue, oldValue) {
      // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
      console.log('inputChanged: ' + newValue + ' | ' + oldValue);
    }

    onChange(newValue, oldValue){
        console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
    }

    add() {
        this.myGlobals.profileSelected.passports.push({ countryId: null, number: null, typeValue: null, expiresOn: null });
    }

    remove(getPos) {
        this.myGlobals.profileSelected.passports.splice(getPos, 1);
        toastr.success(CV.myApiMsg.PassportRemoved);
    }
}