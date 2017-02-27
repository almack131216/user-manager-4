import { inject, autoinject, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
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
    isLoadingApi;
    
    listUsersToAdd;
    selectedUserArr;

    systemRoles;

    searchFor_ntId;
    searchFor_name;
    select_isMember;
    select_systemRole;    

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private lookups: Lookups) {
        this.systemRoles = lookups.systemRoles;
    }

    created() {
        this.listUsersToAdd = null;
    this.selectedUserArr = null;  
    }


    //All of the parameters that we passed to the dialog are available through the model
    activate() {

    }

    selectUserToAdd(getUser) {
        this.selectedUserArr = getUser;        
        console.log('add-user-dialog: select: ' + this.selectedUserArr.id);
    }

    addUserSearch(getType, getUserId) {
        //alert('addUserSearch: ' + getUserId);
        var tmpData = {}

        if (getType == 'ntId') {
            this.searchFor_name = '';
            tmpData = { ntId: getUserId }
        }
        if (getType == 'name') {
            this.searchFor_ntId = '';
            tmpData = { name: getUserId }
        }

        this.isLoadingApi = true;
        this.api.apiCall('user-list-to-add', null, tmpData)
            .then(listUsersToAdd => this.listUsersToAdd = listUsersToAdd)
            .then(() => {
                this.selectedUserArr = null;
                this.isLoadingApi = false;
                console.log('addUserSearch(): Selected > ' + this.listUsersToAdd.length + ' > ' + this.listUsersToAdd)
            });
    }

    deselectUser() {
        this.selectedUserArr = null;
    }


    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    
    addUser(getUser, getSelected_isMember, getSelected_systemRole): void {
        //alert(JSON.stringify(getUser));

        let tmpData = { uniqueId: getUser.uniqueId, isMember: getSelected_isMember, systemRolesValue: getSelected_systemRole }
        console.log('addUser() -> tmpData: ' + JSON.stringify(tmpData));
        this.api.apiCall('user-list-to-add-add', null, tmpData)
            .then(() => {
                this.controller.ok();
                console.log('ADD USER: ' + JSON.stringify(this.listUsersToAdd))
            });

    }

    //When the user clicks on the 'No' button the controller closes the dialog box
    //and sets the response's .wasCancelled property to true
    cancel(): void {
        this.controller.cancel();
    }

}