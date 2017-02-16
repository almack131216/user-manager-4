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
    lkp_role;
    filter_memberType;
    filter_active;
    router;

    isNotDisabled(getField) {
        if (CV.debugConsoleLog) console.log('isNotDisabled? ' + getField);
        if (!this.custDisableCells) return true;
        if (this.custDisableCells.indexOf(getField) == -1) return true;
        return false;
    }
    lookups: Lookups;
    constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService, lookups: Lookups, router: Router) {
        // ea.subscribe(UserViewed, msg => this.select(msg.user));
        // ea.subscribe(UserUpdated, msg => {
        //     let id = msg.user.id;
        //     let found = this.users.data.find(x => x.id == id);
        //     Object.assign(found, msg.user);
        // });



        this.api.getUserList()
            .then(users => this.users = users)
            .then(() => {
                this.lkp_role = lookups.lkp_role;
                this.filter_memberType = lookups.filter_memberType;
                this.filter_active = lookups.filter_active;
                //alert('activate: ' + this.rolesArr + ' / ' + lookups.filter_memberType);
                this.filter_memberType = lookups.filter_memberType;
                this.rolesArr = this.filter_memberType.map(x => {
                    return {
                        value: x.value,
                        name: x.name
                    }
                });
                //console.log('activate 2: ' + this.rolesArr + ' | ' + this.filter_memberType + ' | ' + this.filter_active);
            })
            .then(() => this.populateRoleFilterFromList());

        this.router = router;
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