import { EventAggregator } from 'aurelia-event-aggregator';
import { inject,bindable,autoinject } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 
import * as Constants from '../../../resources/constants';
const CV = Constants

@autoinject
@inject(MyGlobals)
export class UserPanelTraining {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;

    public CV = CV;
    message = CV.MSG_TRAINING;

    myTrainingArr;
    myTrainingArrDynamic = [];

     myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }

    onReady(datePicker,getValue) {
        datePicker.value(new Date(getValue));
    }

    inputChanged(newValue, oldValue) {
      // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
      console.log('inputChanged: ' + newValue + ' | ' + oldValue);
    }

    onChange(newValue, oldValue){
        //datePicker.value(new Date(1994, 4, 2));
        console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
    }

    attached(){

         $('.k_datepicker').click(function(e){
          console.log('attached k_datepicker: ???');
          e.stopPropagation();
        });
        //alert(JSON.stringify(this.profile.trainings));

        let tmp_rolesArrValues = [];
        for (let next of this.profile.trainings) {
            let nextRole = next.trainingId;
            this.myTrainingArrDynamic.push(nextRole);
        }

        this.myTrainingArr = this.profile.trainings.map(x =>  { return {
          trainingId:x.trainingId,
          expiresOn:x.expiresOn
        }});

        //this.populateXXXFilterFromList()

        //alert(JSON.stringify(this.myTrainingArr));
    }

    returnTrainingData(getId,getField){
        //alert('returnTrainingData: ' + getId + ' > ' + this.myTrainingArr.filter(x => x.trainingId == getId)[0].id + ' > ' + this.myTrainingArr.filter(x => x.trainingId == getId).id);
        console.log('returnTrainingData: ' + getId + ' > ' + this.myTrainingArr[getId]);
        //if(getId && this.myTrainingArr[getId] && this.myTrainingArr[getId].expiresOn) return 'Attended';// this.myTrainingArr.filter(x => x.trainingId == getId)[0].trainingId;
        if(getId && getField=='trainingId' && this.myTrainingArrDynamic.indexOf(getId) != -1) return this.myTrainingArr.filter(x => x.trainingId == getId)[0].trainingId ? 'Attended' : '';
        if(getId && getField=='expiresOn' && this.myTrainingArrDynamic.indexOf(getId) != -1) return this.myTrainingArr.filter(x => x.trainingId == getId)[0].expiresOn ? this.myTrainingArr.filter(x => x.trainingId == getId)[0].expiresOn : '';
        return '';
    }

/*
    populateXXXFilterFromList(){

        let tmp_rolesArrValues = [];
        //this.rolesArrLabels=[];
        this.myTrainingArrDynamic = [];

        for (let next of this.lkp_trainings) {
            let nextRole = next.trainingId;

            if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                tmp_rolesArrValues.push(nextRole);
                let nextLabel = this.myTrainingArr.filter(x => x.trainingId == nextRole).expiresOn;
                //console.log('???' + nextRole + ' | ' + nextLabel);
                //this.rolesArrLabels.push(nextLabel);
                this.myTrainingArrDynamic.push({ "trainingId": nextRole, "expiresOn": nextLabel });
            }
        }

    }
    */

}