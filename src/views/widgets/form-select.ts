import {bindable,inject,autoinject,bindingMode,customElement} from 'aurelia-framework';
//import {UserPanelDetails} from './user-panels/user-panel-details';
import * as Constants from '../../resources/constants';
const CV = Constants

//inject(UserPanelDetails)
inject(Element)
@customElement('FormSelect')
export class FormSelect {

    @bindable
    public initSelected: any;

    @bindable changed = null;

    @bindable optionFilter = null;

    @bindable isEnabled = true;

    @bindable popNext = null;
    @bindable popNextArr = [];

    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;

    @bindable name = null;

    @bindable public selectedValue = 2;

    @bindable
    public selected: any;

    @bindable
    public options: {value: string, label: string}[] = [];


    // constructor(public userpaneldetails){
    //   //this.userpaneldetails = 999;
    // }

    public attached(): void {
        //this.selected = 2;
        console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
        if(this.initSelected) this.selected = this.initSelected ? this.initSelected : 0; 
        console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
        // $("#select").select2().on("change", event => {
        //     this.selected = (<HTMLInputElement>event.currentTarget).value;
        // });
    }

    public detached(): void {
        // $("#select").select2('destroy');
    }

    //following method works as expected
    public selectedChanged(newValue: string): void {
        console.log('selectedChanged: ' + newValue + ' / ' + this.initSelected);
        this.changed = newValue ? newValue : this.initSelected;//(<HTMLInputElement>event.currentTarget).value;
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
}