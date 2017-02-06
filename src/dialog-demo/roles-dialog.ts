import { inject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    mrt_system_role: number;
    mrt_member: boolean;
}

@inject(DialogController, WebAPIUsers, EventAggregator)
export class RolesDialog {
    //@bindable user;
    title = 'Change User Roles';
    userRole = null;
    originalUser = null;
    lkp_mrt_system_role;
    userSelectedId = null;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private model) {
        //REF: output_controller_settings_roles-dialog.json
        this.userSelectedId = controller.settings.userId;        

        this.api.getUserRole(this.userSelectedId).then(user => {
            this.userRole = <User>user;
        });

    }

    //All of the parameters that we passed to the dialog are available through the model
    activate(model) {

        this.userRole = model;
        //alert('activate: ' + JSON.stringify(this.userRole.info.id) );

        this.lkp_mrt_system_role = [
            { "value": 1, "label": "Role 1" },
            { "value": 2, "label": "Role 2" },
            { "value": 3, "label": "Role 3" }
        ];

        console.log('model: ' + JSON.stringify(model) + ' > ' + this.lkp_mrt_system_role);
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