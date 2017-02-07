import { inject, autoinject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';
import { Lookups } from '../resources/lookups';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    mrt_system_role: number;
    mrt_member: boolean;
}


@autoinject
@inject(DialogController, WebAPIUsers, EventAggregator)
export class AddUserDialog {
    //@bindable user;
    title = 'Add User';
    userRole = null;
    originalUser = null;
    lkp_role;
    users;
    private selectedId;
    selectUserToAdd;
    //selectedId = null;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private lookups: Lookups) {
        this.lkp_role = lookups.lkp_role;

        this.selectUserToAdd = (getUser) => {   
            this.selectedId = getUser.id;     
            console.log('add-user-dialog: select: ' + this.selectedId + ' / ' + getUser.id);
            this.api.getUserRole(6).then(user => {            
                this.userRole = <User>user;
                //this.selectedId = this.userRole.id;
                console.log('selectUserToAdd -> getUserRole (success) - ' + this.selectedId + ' = ' + JSON.stringify(this.userRole) );
            });
        }

    }

    created(){
        this.api.getUserList().then(users => this.users = users);
    }

    //All of the parameters that we passed to the dialog are available through the model
    activate() {

    }

    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    
    yes(): void {
        this.controller.ok();
    }

    //When the user clicks on the 'No' button the controller closes the dialog box
    //and sets the response's .wasCancelled property to true
    cancel(): void {
        this.controller.cancel();
    }

    // selectUserToAdd(getUser){   
    //     this.selectedId = getUser.id;     
    //     console.log('add-user-dialog: select: ' + this.selectedId + ' / ' + getUser.id);
    //     this.api.getUserRole(6).then(user => {            
    //         this.userRole = <User>user;
    //         //this.selectedId = this.userRole.id;
    //         console.log('selectUserToAdd -> getUserRole (success) - ' + this.selectedId + ' = ' + JSON.stringify(this.userRole) );
    //     });
    // }

}