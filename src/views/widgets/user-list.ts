import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
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
import { MyGlobals } from '../../my-globals';
import { MyNav } from '../../my-nav';


@autoinject
@inject(WebAPIUsers, EventAggregator, DialogService, Lookups, MyGlobals, MyNav)
export class UserList {
    @bindable custTitle;
    @bindable custDisableCells;
    @bindable custHideTitleBar = false;
    @bindable custTablePagination = false;
    @bindable custTablePageSize = 100;

    @bindable custXc = false;
    @bindable custXcId = '';//userList
    @bindable custXcExpanded = true;

    @bindable currentUser;//CR

    public CV = CV
    users;
    selectedId = 0;
    title = 'Users';
    rolesArr;
    rolesArrDynamic = [];

    myNav
    myGlobals

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

    constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService, private lookups: Lookups, myNav: MyNav, myGlobals: MyGlobals) {
        this.lookups = lookups;
        this.isAllChecked = false;
        this.myNav = myNav;
        this.myGlobals = myGlobals
    }

    activate() {
        alert('this.myGlobals 2.2: ' + JSON.stringify(this.myGlobals));
        if (CV.debugConsoleLog) console.log('created: ' + this.title + ' / ' + this.custTitle);
        if (this.custTitle) this.title = this.custTitle;
    }

    attached() {
        // alert('this.myGlobals 2: ' + JSON.stringify(this.myGlobals) );
        // alert('this.currentUser 2: ' + JSON.stringify(this.currentUser) );
        // if(this.currentUser.isReader) alert('this.myGlobals 2.3: ' + JSON.stringify(this.myGlobals) );
        if (this.currentUser) {
            this.loadUserList(null);
        }
    }

    deleteMultiple() {
        //alert('deleteMultiple()' + this.checkedItemsArr);
        this.api.apiCall('delete-multiple-users', null, this.checkedItemsArr)
    }


    checkMe(getId) {
        if (this.checkedItemsArr.indexOf(getId) == -1) {
            this.checkedItemsArr.push(getId)
        } else {
            var index = this.checkedItemsArr.indexOf(getId);
            this.checkedItemsArr.splice(index, 1);
            if (this.checkedItemsArr.length == 0) this.isAllChecked = false;
        }
    }

    checkAll() {
        this.users['data'].forEach(i => {
            i.checked = this.isAllChecked,
                this.checkedItemsArr.push(i.id)
        });

        if (!this.isAllChecked) this.checkedItemsArr = [];

    }


    loadUserList_prep() {
        //var data = {active: this.searchFor_active, name: this.searchFor_name, userTypeValue: this.searchFor_userTypeValue};
        var data = {};
        if (this.searchFor_active) data['active'] = this.searchFor_active;
        if (!this.currentUser.isEditor) data['active'] = true;
        if (this.searchFor_name) data['name'] = this.searchFor_name;
        if (this.searchFor_userTypeValue) data['userTypeValue'] = this.searchFor_userTypeValue;
        //alert('data: ' + JSON.stringify(data));
        this.loadUserList(data);
    }

    loadUserList(getData) {
        var data
        if (!getData) {
            data = this.currentUser.isEditor ? {} : { active: true };
        } else {
            data = getData
        }

        // 'SEARCH', {}, 'data/users/query'
        // 'SEARCH', { active: true }, 'data/users/query'
        // 'SEARCH', { active: true, name: 'ds alex' }, 'data/users/query'
        // 'SEARCH', { active: true, userTypeValue: 2 }, 'data/users/query'
        // 'SEARCH', { active: true, userTypeValue: 3 }, 'data/users/query'
        // 'SEARCH', { userTypeValue: 1 }, 'data/users/query'
        //alert('loadUserList: ' + JSON.stringify(data) );
        this.api.apiCall('user-list', null, data)
            .then(users => this.users = users);

    }

    select(user) {
        this.selectedId = user.id;
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
                this.loadUserList(null)
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
                this.loadUserList(null)
            }
        });
    }

    deleteUser(id): void {
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

    /* isEditor */
    filters = [
        { value: '', keys: ['loginName', 'firstName', 'lastName', 'emailAddress', 'personalNumber'] }
    ];

    /* isReader */
    filters_ro = [
        { value: '', keys: ['loginName', 'firstName', 'lastName', 'emailAddress', 'personalNumber'] },
        { value: '', keys: ['isMember'] },
        { value: 'true', keys: ['isActive'] }
    ];

}