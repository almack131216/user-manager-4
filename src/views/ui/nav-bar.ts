import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants


export class NavBar {
  @bindable router = null;
  @bindable currentUser = null;

  public CV = CV

  constructor(router){
    this.router = router;
  }

  hasAccess(getUser,getPage){
    //console.log('hasAccess: ' + JSON.stringify(getUser) + ' / ' + getPage + ' (' + getPage.settings.data.isMemberOnly + ')');
    if(!getUser) return false;
    if(!getPage.settings.data.isMemberOnly || (getUser.isMember && getPage.settings.data.isMemberOnly==true)) return true;
    return false;
  }

}
