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
    listUsersToAdd;
    selectedId = null;
    selectUserToAdd;
    selectedUserArr
    rolesArr;
    rolesArrDynamic = [];
    systemRoles;
    filter_memberType;
    filter_active;
    router;
    searchFor_ntId;
    searchFor_name;
    select_isMember;
    select_systemRole;
    isLoadingApi;
    //selectedId = null;

    constructor(private controller: DialogController, private api: WebAPIUsers, private ea: EventAggregator, private lookups: Lookups) {

        this.selectUserToAdd = (getUser) => {
            this.selectedId = getUser.uniqueId;
            this.userRole = getUser;
            console.log('add-user-dialog: select: ' + this.selectedId);

            // this.api.getUserRole(this.selectedId).then(user => {
            //     this.userRole = <User>user;
            //     //this.selectedId = this.userRole.id;
            //     console.log('selectUserToAdd -> getUserRole (success) - ' + this.selectedId + ' = ' + JSON.stringify(this.userRole));
            // });
        }

        this.filter_memberType = [
          { "value": true, "name": "Members" },
          { "value": false, "name": "Non-members" }
        ]

        this.filter_active = [
          { "value": true, "name": "Active" },
          { "value": false, "name": "Archived" }
        ]

        this.systemRoles = lookups.systemRoles;

    }

    addUserSearch(getType,getUserId){
        //alert('addUserSearch: ' + getUserId);
        var tmpData = {}

        if(getType=='ntId'){
            this.searchFor_name = '';
            tmpData = { ntId: getUserId }
        }
        if(getType=='name'){
            this.searchFor_ntId = '';
            tmpData = { name: getUserId }
        }

        this.api.apiCall('user-list-to-add', tmpData)
            .then(selectedUserArr => this.selectedUserArr = selectedUserArr)
            .then(() => {         
                this.selectedId = null;      
                console.log('addUserSearch(): Selected > ' + this.selectedUserArr.length + ' > ' + this.selectedUserArr)
             });
    }

    deselectUser() {
        this.selectedId = null;
    }


    created() {
        this.isLoadingApi = true;
        //<li><a href="javascript:queryApi('SEARCH', {}, 'ldap/query?limit=5')">SEARCH ldap/query?limit=5</a> {}</li>
        this.api.apiCall('user-list-to-add',null)
            .then(listUsersToAdd => this.listUsersToAdd = listUsersToAdd)
            .then(() => this.populateRoleFilterFromList())
            .then(() => {
                this.isLoadingApi = false;
                this.selectedId = null;
                console.log('xxxxxxxxx' + JSON.stringify(this.listUsersToAdd))
             });
        //alert(this.users);
    }

    //All of the parameters that we passed to the dialog are available through the model
    activate() {

    }

    //When the user clicks on the 'Yes' button the controller closes the dialog 
    //and returns a promise that when resolved, it wil give us a response with a .wasCancelled property set to false and
    //an .output property set to this.info    
    addUser(getUser,getSelected_isMember,getSelected_systemRole): void {
        //alert(JSON.stringify(getUser));

        let tmpData = { uniqueId: getUser.uniqueId, isMember: getSelected_isMember, systemRolesValue: getSelected_systemRole }
        console.log('addUser() -> tmpData: ' + JSON.stringify(tmpData) );
        this.api.getUserToAdd_addUser(tmpData)
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
        { value: '', keys: ['fullName', 'email', 'ntId', 'uniqueId'] }
    ];

    returnLabelFromValue(getId) {
        if (getId) return this.rolesArr.filter(x => x.value == getId)[0].name;
        return '';
    }

    populateRoleFilterFromList() {
        let tmp_rolesArrValues = [];
        //this.rolesArrLabels=[];
        this.rolesArrDynamic = [];

        for (let next of this.listUsersToAdd) {
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