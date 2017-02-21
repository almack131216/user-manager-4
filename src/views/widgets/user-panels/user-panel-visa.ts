
import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelVisa {
    public CV = CV;
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
    @bindable myLookups;

    attached(){
        $('.k_datepicker').click(function(e){
          console.log('attached k_datepicker: ???');
          e.stopPropagation();
        });
    }

    onReady(datePicker,getValue) {
        datePicker.value(getValue ? new Date(getValue) : '');
    }

    inputChanged(newValue, oldValue) {
      // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
      console.log('inputChanged: ' + newValue + ' | ' + oldValue);
    }

    onChange(newValue, oldValue){
        //datePicker.value(new Date(1994, 4, 2));
        console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
    }
}