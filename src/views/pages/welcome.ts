import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as Constants from '../../resources/constants';
const CV = Constants
import { WebAPIUsers } from '../../api/web-api-users';
import { MyGlobals } from '../../my-globals';

@inject(WebAPIUsers,Router,MyGlobals)
export class Welcome {
  public CV = CV;
  title = 'Welcome to MRT';
  message = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  title_isMember = 'Welcome to MRT';
  message_isMember = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  router;
  pageData;
  imgSrc_splash;
  myGlobals

  constructor(public api: WebAPIUsers, router: Router, myGlobals: MyGlobals) {
    this.router = router;
    this.myGlobals = MyGlobals;
  }

  activate() {
    return this.api.apiCall('welcome',null)
    .then(pageData => {
      this.imgSrc_splash = 'src/img/MRT_Letterhead.png';
      this.pageData = pageData;
      //alert(this.pageData);
      //alert('2' + this.pageData.data);
    });
  }
}