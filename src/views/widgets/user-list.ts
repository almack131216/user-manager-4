import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPIUsers} from '../../api/web-api-users';
import {UserUpdated, UserViewed} from '../../resources/messages';
import {inject, autoinject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

import { DialogService } from 'aurelia-dialog';
import { UserInfo } from '../../user-info/user-info';
import { InfoDialog } from '../../dialog-demo/info-dialog';
import { RolesDialog } from '../../dialog-demo/roles-dialog';

@autoinject

@inject(WebAPIUsers, EventAggregator, DialogService)
export class UserList {
  @bindable custTitle = null;
  @bindable custDisableCells = null;
  public CV = CV
  users;
  selectedId = 0;
  title = 'Users';  

  isNotDisabled(getField){
    if(CV.debugConsoleLog) console.log('isNotDisabled? ' + getField);
    if(!this.custDisableCells) return true;
    if(this.custDisableCells.indexOf(getField) == -1) return true;
    return false;
  }

  constructor(private api: WebAPIUsers, ea: EventAggregator, public userInfo: UserInfo, private dialogService: DialogService){
    ea.subscribe(UserViewed, msg => this.select(msg.user));
    ea.subscribe(UserUpdated, msg => {
      let id = msg.user.id;
      let found = this.users.find(x => x.id == id);
      Object.assign(found, msg.user);
    });
  }

  created(){
    if(CV.debugConsoleLog) console.log('created: ' + this.title + ' / ' + this.custTitle);
    if(this.custTitle) this.title = this.custTitle;
    this.api.getUserList().then(users => this.users = users);
  }

  select(user){
    this.selectedId = user.id;
    return true;
  }

  addUser(): void {
        this.dialogService.open({
            viewModel: InfoDialog,
            model: this.userInfo
        }).then(response => {
            if (response.wasCancelled) {
                console.log("The information is invalid");
            } else {
                console.log("The information is valid");
            }
        });
    }

    changeUserRoles(): void {
        this.dialogService.open({
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