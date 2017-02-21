import {bindable,inject,computedFrom} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants


export class NavBar {
  @bindable router = null;
  @bindable currentUser = null;

  myGlobals

  public CV = CV

  constructor(){

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
