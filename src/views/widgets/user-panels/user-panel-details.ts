import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

@autoinject
export class UserPanelDetails {
    public CV = CV;
    @bindable user;    
}