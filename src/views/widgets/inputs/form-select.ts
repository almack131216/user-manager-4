import {bindable,inject,autoinject,bindingMode,customElement} from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

//inject(UserPanelDetails)
inject(Element)
@customElement('FormSelect')
export class FormSelect {
    @bindable autocomplete = null;
    @bindable optionFilter = null;

    @bindable isEnabled = true;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;

    @bindable isMandatory = null;
    @bindable name = null;
    @bindable inpClass;
    @bindable isReadonly = null;

    @bindable
    public initSelected: null;
    public changed: number;
    public selected: number;
    @bindable propArr = ['id','name'];//send custom props (prop-arr="['value','name']")

    @bindable
    public options: {value: number, label: string}[] = [];

    @bindable model;

    @bindable inputOnly = false;

    @bindable custName;

    public constructor(model) {
    }

    
    activate(model) {
        // model is the passed through object
    }

    public attached(): void {
        if(CV.debugConsoleLog) console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
        this.selected = this.initSelected ? this.initSelected : null;
        if(CV.debugConsoleLog) console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
    }

    //following method works as expected
    public selectedChanged(newValue: number): void {
        if(CV.debugConsoleLog) console.log('[form-select] selectedChanged: ' + newValue + ' / ' + this.initSelected);
        this.changed = newValue ? newValue : null;//(<HTMLInputElement>event.currentTarget).value;
        this.selected = this.changed;
        
    }

    tmpCreateLabel(getStr){
        return getStr;// getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-select] created: ' + this.name );
        this.name = this.custName;
        if (!this.inpLabel) this.inpLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : '______________' + this.custName;//.substring(3)
        if(!this.inpPlaceholder) this.inpPlaceholder = "> Select " + this.inpLabel + " <";// "Enter " + this.inpLabel;
    }

    selectOptions = { allowClear: true, placeholder: 'Select...' };
    selectedValues: number[] = [];
    multipleSelectValues: string[] = ['z', 'y', 'x'];

    /* Justification: this is a recommended fix for an issue with Select2 and Aurelia integration as documented here
                 http://stackoverflow.com/questions/33452623/aurelia-trying-to-load-html-from-select2#answer-34121891 */
    /* tslint:disable-next-line no-empty */
    changeCallback(evt: Event){
        this.initSelected = this.initSelected<=0 ? null : this.initSelected;//set to null if no option selected
        console.log('[form-select] changeCallback: ' + this.initSelected );
        //this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
    }

}