
import { inject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../../my-globals'
import * as Constants from '../../../resources/constants';
const CV = Constants

import toastr = require('toastr');

@inject(MyGlobals)
export class UserPanelVisa {
    public CV = CV;

    @bindable isReadOnly = null;

    myGlobals
    myLookups

    constructor(myGlobals: MyGlobals) {
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }

    attached() {
        $('.k_datepicker').click(function (e) {
            console.log('attached k_datepicker: ???');
            e.stopPropagation();
        });
    }

    onReady(datePicker, getValue) {
        datePicker.value(getValue ? new Date(getValue) : '');
    }

    inputChanged(newValue, oldValue) {
        // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
        console.log('inputChanged: ' + newValue + ' | ' + oldValue);
    }

    onChange(newValue, oldValue) {
        //datePicker.value(new Date(1994, 4, 2));
        console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
    }

    add() {
        this.myGlobals.profileSelected.visas.push({ countryId: null, typeValue: null, multipleEntry: null, expiresOn: null });
    }

    remove(getPos) {
        this.myGlobals.profileSelected.visas.splice(getPos, 1);
        toastr.success(CV.myApiMsg.VisaRemoved);
    }
}