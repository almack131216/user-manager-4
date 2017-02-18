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
    console.log('hasAccess: ' + JSON.stringify(getUser) + ' / ' + getPage.settings );// + ' (' + getPage.settings.data.isMemberOnly + ' | ' + getPage.settings.data.isEditorOnly  + ')');
    //return true;
    if(!getUser) return false;
    //if(!getPage.settings) return true;
    if(getPage.settings && (!getUser.isEditor && getPage.settings.isEditorOnly)) return false;
    return true;
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
