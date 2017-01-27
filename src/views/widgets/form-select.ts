import {bindable,inject,autoinject,bindingMode,customElement} from 'aurelia-framework';
//import {UserPanelDetails} from './user-panels/user-panel-details';
import * as Constants from '../../resources/constants';
const CV = Constants

//inject(UserPanelDetails)
inject(Element)
@customElement('FormSelect')
export class FormSelect {

    @bindable changed = null;

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
        // $("#select").select2().on("change", event => {
        //     this.selected = (<HTMLInputElement>event.currentTarget).value;
        // });
    }

    public detached(): void {
        // $("#select").select2('destroy');
    }

    //following method works as expected
    public selectedChanged(newValue: string): void {
        console.log('selectedChanged: ' + newValue);
        this.changed = newValue;//(<HTMLInputElement>event.currentTarget).value;
        //this.newValue = newValue;
        if(newValue) this.populateNextSelect();
    }

    populateNextSelect(){
        alert('populateNextSelect? ' + this.popNext);

        if(this.popNext=='sel_hub'){
            alert('populateNextSelect? > populate...' );
            this.popNextArr = [
                {"value":1,"label":"Hub 1"},
                {"value":2,"label":"Hub 2"},
                {"value":3,"label":"Hub 3"}
            ];
        }
        
    }

    // toView(newValue){
    //     console.log('newValue: ' + newValue);
    //     return newValue;
    // }

    tmpCreateLabel(getStr){
        return getStr.replace(/_/g,' ').toLowerCase();
    }

    created(){
        if(CV.debugConsoleLog) console.log('[form-inputs] created: ' + this.name );
        if(!this.inpLabel) this.inpLabel = this.tmpCreateLabel(this.name).substring(3);
        if(!this.inpPlaceholder) this.inpPlaceholder = "Enter " + this.inpLabel;        
    }
}