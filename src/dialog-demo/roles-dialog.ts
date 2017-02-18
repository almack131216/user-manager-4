import { inject, autoinject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';
import { Lookups } from '../resources/lookups';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    systemRoles: number;
    isMember: boolean;
}

@autoinject
@inject(DialogController, WebAPIUsers, EventAggregator, Lookups)
export class RolesDialog {
    //@bindable user;
    title = 'Change User Roles';
    userRole = null;
    originalUser = null;
    userSelectedId = null;
    systemRoles;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private model, lookups:Lookups) {
        //REF: output_controller_settings_roles-dialog.json
        this.userSelectedId = controller.settings.userId;

<<<<<<< HEAD
        this.api.apiCall('user-role',this.userSelectedId).then(user => {
            //this.userRole = <User>user;
            this.userRole = user;
            this.systemRoles = lookups.systemRoles;
=======
        this.api.getUserRole(this.userSelectedId).then(user => {
            //this.userRole = <User>user;
            this.userRole = user;
            this.lkp_role = lookups.lkp_role;
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
        });

        
    }

    //All of the parameters that we passed to the dialog are available through the model
    activate() {
        //alert('activate: ' + JSON.stringify(this.userRole.info.id) );

<<<<<<< HEAD
        //console.log('model: ' + JSON.stringify(model) + ' > ' + this.systemRoles);
=======
        //console.log('model: ' + JSON.stringify(model) + ' > ' + this.lkp_role);
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
    }

    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    
    yes(): void {
        this.controller.ok(this.userRole);
    }

    //When the user clicks on the 'No' button the controller closes the dialog box
    //and sets the response's .wasCancelled property to true
    cancel(): void {
        this.controller.cancel();
    }

    //info: UserInfoRole;
}