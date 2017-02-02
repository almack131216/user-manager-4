import {autoinject} from 'aurelia-framework';
import {UserInfo} from './user-info';

@autoinject
export class ViewInfo{
    
    constructor(private userInfo: UserInfo){
        
    }
    
}