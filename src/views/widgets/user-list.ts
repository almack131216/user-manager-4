import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { inject, autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

import { DialogService } from 'aurelia-dialog';
import { UserInfo } from '../../user-info/user-info';
import { InfoDialog } from '../../dialog-demo/info-dialog';
import { RolesDialog } from '../../dialog-demo/roles-dialog';
import { AddUserDialog } from '../../dialog-demo/add-user-dialog';
import { DeleteDialog } from '../../dialog-demo/delete-user-dialog';
import { Lookups } from '../../resources/lookups';


@autoinject
@inject(WebAPIUsers, EventAggregator, DialogService, Lookups, Router)
export class UserList {
    @bindable custTitle;
    @bindable custDisableCells;
    @bindable custHideTitleBar = false;
    @bindable custTablePagination = false;
    @bindable custTablePageSize = 100;

    @bindable custXc = false;
    @bindable custXcId = '';//userList
    @bindable custXcExpanded = true;

    public CV = CV
    users;
    selectedId = 0;
    title = 'Users';
    rolesArr;
    rolesArrDynamic = [];

    router;
    lkp_all;

    searchFor_active;
    searchFor_name;
    searchFor_userTypeValue;

    isAllChecked;
    checkedItemsArr = [];

    isNotDisabled(getField) {
        if (CV.debugConsoleLog) console.log('isNotDisabled? ' + getField);
        if (!this.custDisableCells) return true;
        if (this.custDisableCells.indexOf(getField) == -1) return true;
        return false;
    }

    constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService, private lookups: Lookups, router: Router) {
        // ea.subscribe(UserViewed, msg => this.select(msg.user));
        // ea.subscribe(UserUpdated, msg => {
        //     let id = msg.user.id;
        //     let found = this.users.data.find(x => x.id == id);
        //     Object.assign(found, msg.user);
        // });
        this.lookups = lookups;

<<<<<<< HEAD
        this.isAllChecked = false;

        this.loadUserList({});
=======
        ///tmp
        this.filter_memberType = [
          { "value": true, "name": "Members" },
          { "value": false, "name": "Non-members" }
        ]

        this.filter_active = [
          { "value": true, "name": "Active" },
          { "value": false, "name": "Archived" }
        ]

        this.lkp_role = [
          { "value": 1, "name": "Viewer" },
          { "value": 3, "name": "Admin" }
        ]

        if(!this.lookups.filter_memberType){
            //alert('? user-list.ts | get Lookups...');
            this.api.getLookups()
                .then(lkp_all => this.lkp_all = lkp_all['lookups'])
                .then(() =>{
                    //alert('lkp_all: ' + JSON.stringify(this.lkp_all) );
                });
        }

        this.api.getUserList()
            .then(users => this.users = users)
            .then(() => this.populateRoleFilterFromList());
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a

        this.router = router;

    }

    deleteMultiple(){
        alert('deleteMultiple()' + this.checkedItemsArr);
        this.api.deleteMultipleUsers(this.checkedItemsArr)
        // .then(result => {
        //         console.log('Deleted ' + this.checkedItemsArr + ' users')
        //     })
    }


    checkMe(getId){
        if(this.checkedItemsArr.indexOf(getId) == -1){
            this.checkedItemsArr.push(getId)
        }else{
            var index = this.checkedItemsArr.indexOf(getId);
            this.checkedItemsArr.splice(index,1);
            if(this.checkedItemsArr.length==0) this.isAllChecked = false;
        }
    }

    checkAll() {
        //alert('checkAll(): ' + this.isAllChecked);
        // for(var i=0;i<this.users.length;i++){
        //     this.users['data'][i].checked = this.isAllChecked;
        // }
        this.users['data'].forEach(i => {
            i.checked = this.isAllChecked,
            this.checkedItemsArr.push(i.id)
        });

        if(!this.isAllChecked) this.checkedItemsArr = [];
        
    }


    loadUserList_prep() {
        //this.searchFor_userTypeValue = this.searchFor_userTypeValue!=null ? this.searchFor_userTypeValue : null;
        //var data = {active: this.searchFor_active, name: this.searchFor_name, userTypeValue: this.searchFor_userTypeValue};
        var data = {};
        if (this.searchFor_active) data['active'] = this.searchFor_active;
        if (this.searchFor_name) data['name'] = this.searchFor_name;
        if (this.searchFor_userTypeValue) data['userTypeValue'] = this.searchFor_userTypeValue;
        //alert('data: ' + JSON.stringify(data));
        this.loadUserList(data);
    }

    loadUserList(data) {
        // 'SEARCH', {}, 'data/users/query'
        // 'SEARCH', { active: true }, 'data/users/query'
        // 'SEARCH', { active: true, name: 'ds alex' }, 'data/users/query'
        // 'SEARCH', { active: true, userTypeValue: 2 }, 'data/users/query'
        // 'SEARCH', { active: true, userTypeValue: 3 }, 'data/users/query'
        // 'SEARCH', { userTypeValue: 1 }, 'data/users/query'
        this.api.apiCall('user-list',data)
            .then(users => this.users = users)            
            .then(() => this.populateRoleFilterFromList());
            
    }

    created(lookups) {
        if (CV.debugConsoleLog) console.log('created: ' + this.title + ' / ' + this.custTitle);
        if (this.custTitle) this.title = this.custTitle;
    }

    select(user) {
        this.selectedId = user.id;
        //alert('select: ' + this.selectedId);
        return true;
    }

    // filterSearch(getType,getUserId){
    //     //alert('addUserSearch: ' + getUserId);
    //     if(getType=='ntId') this.searchFor_name = '';
    //     if(getType=='name') this.searchFor_ntId = '';

    //     this.api.getUserToAddList_search(getType,getUserId)
    //         .then(selectedUserArr => this.selectedUserArr = selectedUserArr)
    //         .then(() => {         
    //             this.selectedId = null;      
    //             console.log('addUserSearch(): Selected > ' + this.selectedUserArr.length + ' > ' + this.selectedUserArr)
    //          });
    // }

    addUser(): void {
        this.dialogService.open({
            viewModel: AddUserDialog,
            model: this.userInfo
        }).then(response => {
            if (response.wasCancelled) {
                console.log("The information is invalid");
            } else {
                console.log("The information is valid");
            }
        });
    }

    changeUserRoles(id): void {
        //alert('changeUserRoles: ' + id);
        this.dialogService.open({
            userId: id,
            viewModel: RolesDialog,
            model: this.userInfo
        }).then(response => {
            if (response.wasCancelled) {
                console.log("The information is invalid");
            } else {
                console.log("The information is valid");
            }
        });
    }

    deleteUser(id): void {
        //alert('changeUserRoles: ' + id);
        this.dialogService.open({
            userId: id,
            viewModel: DeleteDialog,
            model: this.userInfo
        }).then(response => {
            if (response.wasCancelled) {
                console.log("The information is invalid");
            } else {
                console.log("The information is valid");
            }
        });
    }

    filters = [
        { value: '', keys: ['loginName', 'firstName', 'lastName', 'emailAddress', 'personalNumber'] },
        { value: '1', keys: ['isMember'] },
        { value: '2', keys: ['isActive'] }
    ];

    returnLabelFromValue(getId) {
        if (getId) return this.rolesArr.filter(x => x.value == getId)[0].name;
        return '';
    }

    populateRoleFilterFromList() {
        let tmp_rolesArrValues = [];
        //this.rolesArrLabels=[];
        this.rolesArrDynamic = [];

        for (let next of this.users.data) {
            let nextRole = next.systemRoles;

            if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                tmp_rolesArrValues.push(nextRole);
                let nextLabel = nextRole;// this.rolesArr.filter(x => x.value == nextRole)[0].name;
                //console.log('???' + nextRole + ' | ' + nextLabel);
                //this.rolesArrLabels.push(nextLabel);
                this.rolesArrDynamic.push({ "value": nextRole, "name": nextLabel });
            }
        }
    }



    // submit(){
    //   this.dialogService.open({ viewModel: Prompt, model: 'Good or Bad?'}).then(response => {
    //     if (!response.wasCancelled) {
    //       console.log('good');
    //     } else {
    //       console.log('bad');
    //     }
    //     console.log(response.output);
    //   });
    // }
}