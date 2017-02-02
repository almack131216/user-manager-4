import {autoinject} from 'aurelia-framework';
import {UserInfo} from './user-info';

@autoinject
export class SetInfo{
    
    constructor(private userInfo: UserInfo){
        this.first_name = this.userInfo.first_name;
        this.last_name = this.userInfo.last_name;
        this.email = this.userInfo.email;
        this.country = this.userInfo.country;
        this.city = this.userInfo.city;
    }    
    
    save(): void{
        this.userInfo.first_name = this.first_name;
        this.userInfo.last_name = this.last_name;
        this.userInfo.email = this.email;
        this.userInfo.city = this.city;
        this.userInfo.country = this.country;
    }
    
    first_name: string;
    last_name: string;
    email: string;
    city: string;
    country: string;
        
}