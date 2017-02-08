import {bindable,inject,autoinject,bindingMode,customElement} from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

//changed.two-way="filters[1].value"
                //init-selected.two-way="filters[1].value"
//inject(UserPanelDetails)
inject(Element)
@customElement('FormFilterRole')
export class FormFilterRole {
    @bindable autocomplete = null;    

    @bindable optionFilter = null;

    @bindable isEnabled = true;

    inpPlaceholder = 'All roles';

    @bindable name = null;

    @bindable
    public initSelected: null;
    public changed: number;
    public selected: number;

    @bindable
    public options: {value: string, label: string}[] = [];

    @bindable model;
    public constructor(model) {
    }

    
    activate(model) {
        // model is the passed through object
    }

    public attached(): void {
        if(CV.debugConsoleLog) console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
        this.selected = this.initSelected!=null ? this.initSelected : 0;
        if(CV.debugConsoleLog) console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
    }

    //following method works as expected
    public selectedChanged(newValue: number): void {
        if(CV.debugConsoleLog) console.log('selectedChanged: ' + newValue + ' / ' + this.initSelected);
        this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
        this.selected = this.changed;
    }

    tmpCreateLabel(getStr){
        return getStr;// getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.name );        
    }

    selectOptions = { allowClear: true, placeholder: 'Select...' };
    selectedValues: string[] = [];
    multipleSelectValues: string[] = ['z', 'y', 'x'];

    changeCallback(evt: Event): void {
    }

}