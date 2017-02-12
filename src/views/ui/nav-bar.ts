import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants


export class NavBar {
  @bindable router = null;
  @bindable currentUser = null;

  public CV = CV

  constructor() {
}

  get isLoggedIn(){
    //userInfo is an object that is updated on authentication
    return true;// this.myState.isLoggedIn;
  }

}
