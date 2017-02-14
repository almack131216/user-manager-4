import { inject, autoinject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';
import { Lookups } from '../resources/lookups';
import * as Constants from '../resources/constants';
const CV = Constants

interface User {
    id: number;
    firstName: string;
    lastName: string;
    systemRoles: number;
    isMember: boolean;
}


@autoinject
@inject(DialogController, WebAPIUsers, EventAggregator, Lookups)
export class AddUserDialog {
    public CV = CV;
    //@bindable user;
    title = 'Add User';
    userRole = null;
    originalUser = null;
    users;
    private selectedId;
    selectUserToAdd;
    rolesArr;
    rolesArrDynamic = [];
    lkp_role;
    filter_role;
    filter_active;
    router;
    //selectedId = null;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private lookups: Lookups) {
        //this.lkp_role = lookups.lkp_role;

        this.selectUserToAdd = (getUser) => {
            this.selectedId = getUser.id;
            console.log('add-user-dialog: select: ' + this.selectedId + ' / ' + getUser.id);
            // this.api.getUserRole(6).then(user => {
            //     this.userRole = <User>user;
            //     //this.selectedId = this.userRole.id;
            //     console.log('selectUserToAdd -> getUserRole (success) - ' + this.selectedId + ' = ' + JSON.stringify(this.userRole));
            // });
        }

        this.lkp_role = lookups.lkp_role;
        this.filter_role = lookups.filter_role;
        this.filter_active = lookups.filter_active;
        this.rolesArr = this.filter_role.map(x =>  { return {
          value:x.value,
          name:x.name
        }});

    }

    deselectUser() {
        this.selectedId = null;
    }


    created() {
        this.api.getUserList()
            .then(users => this.users = users)
            .then(() => this.populateRoleFilterFromList())
            .then(() => console.log('xxxxxxxxx' + JSON.stringify(this.users)) )
            ;
        //alert(this.users);
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

    filters = [
        { value: '', keys: ['firstName', 'lastName'] },
        { value: '1', keys: ['isMember'] }
    ];

    returnLabelFromValue(getId) {
        if (getId) return this.rolesArr.filter(x => x.value == getId)[0].name;
        return '';
    }

    populateRoleFilterFromList() {
        let tmp_rolesArrValues = [];
        //this.rolesArrLabels=[];
        this.rolesArrDynamic = [];

        for (let next of this.users) {
            let nextRole = next.systemRoles;

            if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                tmp_rolesArrValues.push(nextRole);
                let nextLabel = this.rolesArr.filter(x => x.value == nextRole).name;
                //console.log('???' + nextRole + ' | ' + nextLabel);
                //this.rolesArrLabels.push(nextLabel);
                this.rolesArrDynamic.push({ "value": nextRole, "name": nextLabel });
            }
        }
    }

}