import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {UserInfo} from '../user-info/user-info';

@autoinject
export class InfoDialog{
    
    constructor(private controller: DialogController){
        
    }
    
    //All of the parameters that we passed to the dialog are available through the model
    activate(model){
        this.info = model;
    }
    
    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    
    yes(): void {
        this.controller.ok(this.info);
    }
    
    //When the user clicks on the 'No' button the controller closes the dialog box
    //and sets the response's .wasCancelled property to true
    no(): void{
        this.controller.cancel();
    }
    
    info: UserInfo;
}