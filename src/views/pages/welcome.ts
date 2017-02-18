import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as Constants from '../../resources/constants';
const CV = Constants
import { WebAPIUsers } from '../../api/web-api-users';

<<<<<<< HEAD
@inject(WebAPIUsers,Router)
=======
@inject(WebAPIUsers,Lookups,Router)
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
export class Welcome {
  public CV = CV;
  title = 'Welcome to MRT';
  message = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  title_isMember = 'Welcome to MRT';
  message_isMember = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  router;
  pageData;
<<<<<<< HEAD
  imgSrc_splash;

  constructor(private api: WebAPIUsers, router: Router) {
=======
  
  constructor(private api: WebAPIUsers, lookups:Lookups, router: Router) {
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
    this.router = router;
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