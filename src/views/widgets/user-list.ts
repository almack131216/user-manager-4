import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPIUsers} from '../../api/web-api-users';
import {UserUpdated, UserViewed} from '../../resources/messages';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

@inject(WebAPIUsers, EventAggregator)
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

  constructor(private api: WebAPIUsers, ea: EventAggregator){
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
}