import {bindable,inject,autoinject,bindingMode,customElement} from 'aurelia-framework';
//import {UserPanelDetails} from './user-panels/user-panel-details';
import * as Constants from '../../resources/constants';
const CV = Constants

//inject(UserPanelDetails)
inject(Element)
@customElement('FormSelect')
export class FormSelect {

    @bindable
    public initSelected: null;

    @bindable changed = null;

    @bindable optionFilter = null;

    @bindable isEnabled = true;

    @bindable popNext = null;
    @bindable popNextArr = [];

    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;

    @bindable name = null;

    @bindable
    public selected: number;

    @bindable
    public options: {value: string, label: string}[] = [];


    // constructor(public userpaneldetails){
    //   //this.userpaneldetails = 999;
    // }

    public attached(): void {
        //this.selected = 2;
        console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
        this.selected = this.initSelected!=null ? this.initSelected : 0; 
        console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
        // $("#select").select2().on("change", event => {
        //     this.selected = (<HTMLInputElement>event.currentTarget).value;
        // });
    }

    public detached(): void {
        // $("#select").select2('destroy');
    }

    //following method works as expected
    public selectedChanged(newValue: number): void {
        console.log('selectedChanged: ' + newValue + ' / ' + this.initSelected);
        this.changed = newValue!=null ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
        //this.selected = this.initSelected;
        //this.newValue = newValue;
        //if(newValue) this.populateNextSelect();
    }

    tmpCreateLabel(getStr){
        return getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.name );
        if(!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name).substring(3);
        if(!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;
    }

    selectOptions = { allowClear: true, placeholder: 'Select...' };
    //selectedValue: string = '';
    //singleSelectValues: string[] = ['a', 'b', 'c'];
    selectedValues: string[] = [];
    multipleSelectValues: string[] = ['z', 'y', 'x'];

    /* Justification: this is a recommended fix for an issue with Select2 and Aurelia integration as documented here
                 http://stackoverflow.com/questions/33452623/aurelia-trying-to-load-html-from-select2#answer-34121891 */
    /* tslint:disable-next-line no-empty */
    changeCallback(evt: Event): void {
    }

}