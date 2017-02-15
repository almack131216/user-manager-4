import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable,autoinject } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import { Lookups } from '../../../resources/lookups';
@autoinject

export class UserPanelTraining {
    @bindable user;
    @bindable profile;

    public CV = CV;
    message = CV.MSG_TRAINING;

    lkp_trainings;
    myTrainingArr;
    myTrainingArrDynamic = [];

    constructor(private lookups: Lookups) {

        this.lkp_trainings = lookups.lkp_trainings

    }

    attached(){
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
        if(getId && getField=='trainingId' && this.myTrainingArrDynamic.indexOf(getId) != -1) return this.myTrainingArr.filter(x => x.trainingId == getId)[0].expiresOn ? 'Attended' : '';
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