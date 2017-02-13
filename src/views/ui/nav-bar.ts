import {bindable,inject,computedFrom} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

//import { Router } from 'aurelia-router';

//@inject(Router)
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

  attached() {
     //  this.message = this.router.currentInstruction.config.title;
    }
    
    @computedFrom('router.currentInstruction')
    get routeName() {
      if (this.router.currentInstruction !== null)
        return this.router.currentInstruction.config.name;
    }

  getRoute() {
     return this.router.currentInstruction.config.name; //name of the route
     //return this.router.currentInstruction.config.moduleId; //moduleId of the route
   }

}
