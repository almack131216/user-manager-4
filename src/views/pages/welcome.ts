import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
import { WebAPIUsers } from '../../api/web-api-users';

@inject(WebAPIUsers,Lookups,Router)
export class Welcome {
  public CV = CV;
  title = 'Welcome to MRT';
  message = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  title_isMember = 'Welcome to MRT';
  message_isMember = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
  router;
  pageData;
  
  constructor(private api: WebAPIUsers, lookups:Lookups, router: Router) {
    this.router = router;
  }

  activate() {
    return this.api.getHomepageData().then(pageData => {
      this.pageData = pageData;
    });
  }
}