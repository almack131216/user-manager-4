import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as Constants from '../../resources/constants';
const CV = Constants
import { WebAPIUsers } from '../../api/web-api-users';
import { MyGlobals } from '../../my-globals';
import { MyNav } from '../../my-nav';

@inject(WebAPIUsers,MyGlobals,MyNav)
export class Welcome {
  public CV = CV;
  title = 'Welcome to MRT';
  message = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  title_isMember = 'Welcome to MRT';
  message_isMember = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';

  pageData;
  imgSrc_splash;
  myGlobals
  myNav

  constructor(public api: WebAPIUsers, myGlobals: MyGlobals, myNav: MyNav) {
    this.myGlobals = MyGlobals;
    this.myNav = myNav;
  }

  activate() {
    return this.api.apiCall('welcome',null,null)
    .then(pageData => {
      this.imgSrc_splash = 'src/img/MRT_Letterhead.png';
      this.pageData = pageData;
      //alert(this.pageData);
      //alert('2' + this.pageData.data);
    });
  }
}