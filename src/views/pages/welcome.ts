import { autoinject, inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';

export class Welcome {
  public CV = CV;
  title = '';
}