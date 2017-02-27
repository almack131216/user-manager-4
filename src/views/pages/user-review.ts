import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import * as Constants from '../../resources/constants';
const CV = Constants

import { MyGlobals } from '../../my-globals';


@inject(WebAPIUsers, EventAggregator)
export class UserReview {
  public CV = CV
  routeConfig;

  title = '';
  myLookups;
  myGlobals;

  accessDenied
  isSavingData
  saveResult

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.myGlobals = MyGlobals;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    console.log('activate: ' + params.id + ' (' + params.pageType + '), readonly: ' + params.isReadOnly);
    this.myGlobals.userSelected = null;
    this.accessDenied = true;

    if (this.myGlobals.currentUser) {

      if(params.id == this.myGlobals.currentUser.id){
        //alert('cannot review own account');
        return false
      }      

      //reset user selected data to avoid bugs on 'accessDenied' page
      this.myGlobals.userSelected = null;
      this.myGlobals.myLookups = null;
      //(END) reset

      return this.api.apiCall('user-selected', params.id, null)
        .then(user => {
          this.myGlobals.userSelected = user['user'];
          this.routeConfig.navModel.setTitle('Review User | ' + user['user'].firstName);

          if(this.myGlobals.currentUser.id != this.myGlobals.userSelected.manager.id){
            //alert('cannot review because you are not this user\'s manager');
            return false
          }

          this.accessDenied = false;

        });

    } else {
      //alert(this.myGlobals.currentUser + ' && (' + params.id + '==' + this.myGlobals.currentUser.id + '||' + this.myGlobals.currentUser.isReader + ')');      
      this.accessDenied = true;
    }

  }
  // (END) activate()


  reviewUser(getState) {
    //alert('reviewUser: ' + getState);
    this.isSavingData = true;
    this.saveResult = false;
    return this.api.apiCall('review-user', this.myGlobals.userSelected.id, getState)
      .then(result => {
        this.saveResult = true;        
        this.isSavingData = false;
      })
      .then( () => {
        if(this.saveResult){
          console.log('SUCCESSFULLY updated user: ' + JSON.stringify(this.myGlobals.userSelected));
        }else{
          console.log('Error with review: ' + JSON.stringify(this.myGlobals.userSelected));
        }
        this.isSavingData = false;
      });      
  }

}