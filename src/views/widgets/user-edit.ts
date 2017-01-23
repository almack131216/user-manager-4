import {bindable,autoinject} from 'aurelia-framework';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export class UserEdit {
    @bindable user = null;
    title = 'Edit'
  editUser = [];
  editUserVals = [];

  constructor() {
    this.editUser.push({name:'firstName', model:'user.firstName', label: 'First Nameee'});
    this.editUser.push({name:'lastName', model:'user.lastName', label: 'Las Nameee'});
    this.editUser.push({name:'email', model:'email', label: 'Emaileee'});
    this.editUser.push({name:'phoneNumber', model:'phoneNumber', label: 'Phoneee'});
  }
}