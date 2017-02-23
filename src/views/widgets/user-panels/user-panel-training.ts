import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, bindable, autoinject } from 'aurelia-framework';
import { MyGlobals } from '../../../my-globals'
import * as Constants from '../../../resources/constants';
const CV = Constants

@autoinject
@inject(MyGlobals)
export class UserPanelTraining {

    profile;
    @bindable isReadOnly = null;

    public CV = CV;
    message = CV.MSG_TRAINING;

    myTrainingArr_init;
    myTrainingArrDynamic = [];

    tmpTrainingsMule

    myGlobals
    myLookups

    constructor(myGlobals: MyGlobals) {
        this.myGlobals = MyGlobals
        this.profile = this.myGlobals.profileSelected
        this.myLookups = this.myGlobals.myLookups
    }

    onReady(datePicker, getValue) {
        datePicker.value(new Date(getValue));
    }

    inputChanged(newValue, oldValue) {
        // aurelia will call this automatically- a convention looks for methods on the vm that match bindable property names.
        console.log('inputChanged: ' + newValue + ' | ' + oldValue);
    }

    onChange(newValue, oldValue) {
        //datePicker.value(new Date(1994, 4, 2));
        console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
    }

    onTrainingChecked(getId){        
        let rowPos:number

        this.myGlobals.profileSelected.trainings = []

        for(var i=0;i<this.tmpTrainingsMule.length;i++){
            console.log('loop....' + i)
            if(this.tmpTrainingsMule[i].attended) this.myGlobals.profileSelected.trainings.push({trainingId: this.tmpTrainingsMule[i].trainingId,expiresOn:this.tmpTrainingsMule[i].expiresOn})
            //if(this.tmpTrainingsMule[i].trainingId==getId){

                //rowPos = i
                //i = this.tmpTrainingsMule.length
            //}
        }
        // var index = this.myGlobals.profileSelected.trainings.filter(x => x.trainingId == getId)
        // var index = this.myGlobals.profileSelected.trainings.filter(function(obj) { return obj.trainingId == getId })[0]
        // alert('index: ' + JSON.stringify(index) );
        // if(rowPos >= 0){
        //     this.myGlobals.profileSelected.trainings.splice(rowPos, 1);
        // }else{
        //     this.myGlobals.profileSelected.trainings.push({trainingId:getId,expiresOn:getExpiryDate})
        // }
        
    }

    attached() {

        $('.k_datepicker').click(function (e) {
            console.log('attached k_datepicker: ???');
            e.stopPropagation();
        });
        //alert(JSON.stringify(this.profile.trainings));

        let tmp_rolesArrValues = [];
        for (let next of this.myGlobals.profileSelected.trainings) {
            let nextRole = next.trainingId;
            this.myTrainingArrDynamic.push(nextRole);
        }

        this.myTrainingArr_init = this.myGlobals.profileSelected.trainings.map(x => {
            return {
                trainingId: x.trainingId,
                expiresOn: x.expiresOn
            }
        });

        //alert(JSON.stringify(this.myGlobals.profileSelected.trainings));

        this.tmpTrainingsMule = this.myGlobals.myLookups.trainings.map(x => {

            var tmpArr = {}
            if(this.myTrainingArrDynamic.indexOf(x.id) != -1){
                tmpArr = this.myTrainingArr_init[this.myTrainingArrDynamic.indexOf(x.id)];
                tmpArr['attended'] = x.expires;
            }else{
                tmpArr['attended'] = null;
                tmpArr['expiresOn'] = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            }

            tmpArr['name'] = x.name;
            tmpArr['trainingId'] = x.id;
            tmpArr['expires'] = x.expires;

            return tmpArr;

            // return {
            //     name: x.name,
            //     trainingId: x.id,
            //     expires: x.expires,
            //     attended: null,
            //     expiresOn: x.expires ? new Date() : null
            // }
        });

        //this.populateXXXFilterFromList()

        //alert(JSON.stringify(this.myTrainingArr_init));
    }

    returnTrainingLabel(getId) {//maybeExcess
        var tmpIndex = this.myGlobals.myLookups.trainings.filter(x => x.id == getId)[0];
        console.log('returnTrainingData: ' + getId + ' > ' + JSON.stringify(tmpIndex) + ' | ' + JSON.stringify(this.myTrainingArrDynamic) );
        if (tmpIndex) return tmpIndex['name'];//this.myTrainingArr_init.filter(x => x.trainingId == getId)[0].trainingId ? 'Attended' : '';
        return 'xxx';
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
                    let nextLabel = this.myTrainingArr_init.filter(x => x.trainingId == nextRole).expiresOn;
                    //console.log('???' + nextRole + ' | ' + nextLabel);
                    //this.rolesArrLabels.push(nextLabel);
                    this.myTrainingArrDynamic.push({ "trainingId": nextRole, "expiresOn": nextLabel });
                }
            }
    
        }
        */

}