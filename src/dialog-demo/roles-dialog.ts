import { inject, autoinject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { Lookups } from '../resources/lookups';

@autoinject
@inject(DialogController, WebAPIUsers, EventAggregator, Lookups)
export class RolesDialog {
    //@bindable user;
    title = 'Change User Roles';
    userRole = {};
    userSelectedId = null;
    systemRoles;

    userId;
    uniqueId;
    select_isMemberInit;
    select_systemRoleInit;
    select_isMember;
    select_systemRole;
    lookups
    //hasChanged

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private model, lookups:Lookups) {
        //REF: output_controller_settings_roles-dialog.json
        this.userSelectedId = controller.settings.userId;
        this.lookups = lookups;        
    }

    //All of the parameters that we passed to the dialog are available through the model
    activate() {
        //alert('activate: ' + JSON.stringify(this.userRole.info.id) );
        //console.log('model: ' + JSON.stringify(model) + ' > ' + this.systemRoles);
        return this.api.apiCall('user-role',this.userSelectedId,null)
        .then(user => {
            this.userRole = user;
            this.systemRoles = this.lookups.systemRoles;
            
            this.userId = this.userRole['id'];
            this.uniqueId = this.userRole['loginName'];
            this.select_isMemberInit = this.userRole['isMember'];
            this.select_systemRoleInit = this.userRole['systemRoles'] ? this.userRole['systemRoles'].value : null;
            this.select_isMember = this.select_isMemberInit;
            this.select_systemRole = this.select_systemRoleInit;

            console.log('RolesDialog > userRole: ' + JSON.stringify(this.userRole));
        });
    }

    hasChanged(){
        //alert('checkHasChanged');
        //console.log('checkHasChanged? : select_isMember: ' + this.select_isMember + ' | isMember: ' + this.userRole['isMember'] + ' | select_systemRole: ' + this.select_systemRole + ' | ' + this.userRole['systemRoles'].value);
        return ((this.select_isMember != this.select_isMemberInit) || (this.select_systemRole != this.select_systemRoleInit)) ? true : false;
    }

    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    

    updateUserRole(getSelected_isMember,getSelected_systemRole): void {
        //alert(JSON.stringify(getUser));

        let tmpData = { isMember: getSelected_isMember, systemRolesValue: getSelected_systemRole }
        console.log('addUser() -> save-user-role: (' + this.userId + ') -> ' + JSON.stringify(tmpData) );

        this.api.apiCall('save-user-role',this.userId,tmpData)
            .then(() => {
                this.controller.ok(tmpData);
                console.log('UPDATE USER ROLE: ' + JSON.stringify(tmpData))
             });
        
    }

    //When the user clicks on the 'No' button the controller closes the dialog box
    //and sets the response's .wasCancelled property to true
    cancel(): void {
        this.controller.cancel();
    }

    //info: UserInfoRole;
}