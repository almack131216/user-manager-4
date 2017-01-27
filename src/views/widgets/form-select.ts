import {bindable,inject,autoinject,bindingMode} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

inject(Element)
export class FormSelect {
    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpValue = null;

    @bindable name = null;
    @bindable value = null;
    @bindable valTwoWay = null;

    @bindable inpArr = null;

    public constructor(model) {
        console.log('constructor: ' + this.inpArr);
    }

    tmpCreateLabel(getStr){
        return getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.name );
        if(!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
        if(!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name).substring(3);
        if(this.inpArr) alert(this.inpArr);
    //     this.inpArr = [
    //   {"value":"1","label":"Address 1"},
    //   {"value":"2","label":"Address 2"},
    //   {"value":"3","label":"Address 3"}
    //   ];
    }
}