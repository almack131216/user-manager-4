import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {UserInfo} from '../user-info/user-info';
import {InfoDialog} from './info-dialog';

@autoinject
export class DialogDemo{
    constructor(public userInfo: UserInfo, private dialogService: DialogService){
    }
    
    open(): void{
        this.dialogService.open({
            viewModel: InfoDialog,
            model: this.userInfo
        }).then(response => { 
            if(response.wasCancelled){
                console.log("The information is invalid");
            }
            else{
                console.log("The information is valid");
            }
         });
    }
}