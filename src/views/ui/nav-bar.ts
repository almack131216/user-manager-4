import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

import {Router} from 'aurelia-router';
import {Parent} from 'aurelia-framework';


export class NavBar {
  static inject() {
    return [Parent.of(Router)];
  }

  @bindable router = null;
  @bindable currentUser = null;

  public CV = CV

  constructor(router){
    this.router = router;

  }

  attached(){
    console.log('nav-bar.ts | attached: ' + this.router.navigation[0].isMemberOnly );
  }

  hasAccess(getUser,getPage){
    console.log('hasAccess: ' + getUser + ' / ' + getPage.isMemberOnly + ' (' + getPage.isMemberOnly + ')');
  }
  
  get isLoggedIn(){
    //userInfo is an object that is updated on authentication
    return true;//this.currentUser.isMember;
  }

}
