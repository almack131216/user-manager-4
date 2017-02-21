import { bindable, inject, computedFrom } from 'aurelia-framework';
import { MyGlobals } from '../../my-globals'
import * as Constants from '../../resources/constants';
const CV = Constants

@inject(MyGlobals)
export class NavBar {
  @bindable router = null;

  public CV = CV

  myGlobals

  constructor(myGlobals: MyGlobals) {
    this.myGlobals = MyGlobals;
  }

  hasAccess(getUser, getPage) {
    console.log('hasAccess: ' + JSON.stringify(getUser) + ' / ' + JSON.stringify(getPage.settings) );// + ' (' + getPage.settings.data.isMemberOnly + ' | ' + getPage.settings.data.isEditorOnly  + ')');
    //return true;
    if (!getUser) return false;
    //if(!getPage.settings) return true;
    if (getPage.settings && (!getUser.isReader && getPage.settings.isReaderOnly)) return false;
    //if (getPage.settings && (!getUser.isEditor && getPage.settings.isEditorOnly)) return false;
    return true;
  }

  // hasAccess(getUser, getPage) {
  //   console.log('hasAccess: ' + JSON.stringify(getUser) + ' / ' + JSON.stringify(getPage.settings) );// + ' (' + getPage.settings.data.isMemberOnly + ' | ' + getPage.settings.data.isEditorOnly  + ')');
  //   //return true;
  //   if (!getUser) return false;
  //   if (!getPage.settings) return true;
  //   if (getPage.settings && (getUser.isReader && getPage.settings.isReaderOnly)) return true;
  //   if (getPage.settings && (getUser.isEditor && getPage.settings.isEditorOnly)) return true;
  //   return false;
  // }

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
