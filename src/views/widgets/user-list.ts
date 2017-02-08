import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { inject, autoinject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

import { DialogService } from 'aurelia-dialog';
import { UserInfo } from '../../user-info/user-info';
import { InfoDialog } from '../../dialog-demo/info-dialog';
import { RolesDialog } from '../../dialog-demo/roles-dialog';
import { AddUserDialog } from '../../dialog-demo/add-user-dialog';
import { DeleteDialog } from '../../dialog-demo/delete-user-dialog';
import {Lookups} from '../../resources/lookups';


@autoinject
@inject(WebAPIUsers, EventAggregator, DialogService, Lookups, Router)
export class UserList {
    @bindable custTitle;
    @bindable custDisableCells;
    @bindable custHideTitleBar = false;    
    @bindable custTablePagination = false;
    @bindable custTablePageSize = 100;

    public CV = CV
    users;
    selectedId = 0;
    title = 'Users';
    rolesArr;
    rolesArrDynamic = [];
    lkp_role;
    router;
    

    isNotDisabled(getField) {
        if (CV.debugConsoleLog) console.log('isNotDisabled? ' + getField);
        if (!this.custDisableCells) return true;
        if (this.custDisableCells.indexOf(getField) == -1) return true;
        return false;
    }

    constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService, lookups: Lookups, router: Router) {
        ea.subscribe(UserViewed, msg => this.select(msg.user));
        ea.subscribe(UserUpdated, msg => {
            let id = msg.user.id;
            let found = this.users.find(x => x.id == id);
            Object.assign(found, msg.user);
        });

        this.lkp_role = lookups.lkp_role;
        this.rolesArr = this.lkp_role.map(x =>  { return {
          value:x.value,
          name:x.name
        }});

        this.router = router;
    }

    created() {
        if (CV.debugConsoleLog) console.log('created: ' + this.title + ' / ' + this.custTitle);
        if (this.custTitle) this.title = this.custTitle;
        this.api.getUserList().then(users => this.users = users)
            .then(() => this.populateRoleFilterFromList());
    }

    select(user) {
        this.selectedId = user.id;        
        //alert('select: ' + this.selectedId);
        return true;
    }

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
        { value: '', keys: ['firstName', 'lastName', 'emailAddress', 'personalNumber'] },
        { value: '1', keys: ['systemRoles.value'] }
    ];

    returnLabelFromValue(getId){
        if(getId) return this.rolesArr.filter(x => x.value == getId)[0].name;
        return '';
    }

    populateRoleFilterFromList() {        
        let tmp_rolesArrValues=[];
        //this.rolesArrLabels=[];
        this.rolesArrDynamic=[];

        for (let next of this.users) {
            let nextRole = next.systemRoles;

            if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                tmp_rolesArrValues.push(nextRole);
                let nextLabel = nextRole;// this.rolesArr.filter(x => x.value == nextRole)[0].name;
                //console.log('???' + nextRole + ' | ' + nextLabel);
                //this.rolesArrLabels.push(nextLabel);
                this.rolesArrDynamic.push({"value":nextRole, "name":nextLabel});
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