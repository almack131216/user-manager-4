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

    @bindable
    public initSelected: null;
    public changed: number;
    public selected: number;
    @bindable propArr = ['id','name'];//send custom props (prop-arr="['value','name']")

    @bindable
    public options: {value: number, label: string}[] = [];

    @bindable model;

    @bindable inputOnly = false;

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

    modelChanged(newVal, oldVal){
        console.log('xxx: ' + this.inpLabel + ': ' + this.initSelected + ' | ' + newVal + ' | ' + oldVal);
        this.initSelected = newVal==0 ? null : newVal;
        newVal = this.initSelected;
        this.selected = this.initSelected;
        this.changed = this.initSelected;
        console.log('xxxxxx: ' + this.selected + ': ' + this.changed + ' | ' + newVal + ' | ' + oldVal);
    }

    tmpCreateLabel(getStr){
        return getStr;// getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-select] created: ' + this.name );
        if(!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name);//.substring(3)
        if(!this.inpPlaceholder) this.inpPlaceholder = "Please Select";// "Enter " + this.inpLabel;
    }

    selectOptions = { allowClear: true, placeholder: 'Select...' };
    selectedValues: number[] = [];
    multipleSelectValues: string[] = ['z', 'y', 'x'];

    /* Justification: this is a recommended fix for an issue with Select2 and Aurelia integration as documented here
                 http://stackoverflow.com/questions/33452623/aurelia-trying-to-load-html-from-select2#answer-34121891 */
    /* tslint:disable-next-line no-empty */
    changeCallback(evt: Event){
        this.initSelected = this.initSelected==0 ? null : this.initSelected;
        console.log('[form-select] changeCallback: ' + this.initSelected );
        //this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
    }

}