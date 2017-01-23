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

  public constructor(model) {

  }

    tmpCreateLabel(getStr){
        return getStr.replace('-',' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.name );
        if(!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
        if(!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name).substring(3);
    }
}