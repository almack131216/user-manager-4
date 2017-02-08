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
export class DeleteDialog {
    //@bindable user;
    title = 'Delete User?';
    userRole = null;
    originalUser = null;
    userSelectedId = null;
    lkp_role;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private model, private lookups: Lookups) {
        //REF: output_controller_settings_roles-dialog.json
        this.userSelectedId = controller.settings.userId;

        this.api.getUserRole(this.userSelectedId).then(user => {
            this.userRole = <User>user;
        });

        this.lkp_role = lookups.lkp_role;
    }

    //All of the parameters that we passed to the dialog are available through the model
    activate(model) {

        this.userRole = model;
        //alert('activate: ' + JSON.stringify(this.userRole.info.id) );

        console.log('model: ' + JSON.stringify(model) + ' > ' + this.lkp_role);
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