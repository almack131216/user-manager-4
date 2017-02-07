import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';



let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;

@autoinject
export class WebAPIUsers {
  isRequesting = false;
  usersArr = [];

  http:HttpClient

    constructor(http:HttpClient) {
        this.http = http;          
    }

  
  getUserList(){
    this.isRequesting = true;

    return new Promise(resolve => {
      setTimeout(() => {
        let users = this.http.fetch('src/views/widgets/user-panels/dummy-data.json')
            .then(users => users.json());   

        resolve(users);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserDetails(id){
    console.log('getUserDetails: ' + id);
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('usersArr:' + usersArr);
        //let found = usersArr.filter(x => x.id == id);
        let found = this.http.fetch('src/views/widgets/user-panels/dummy-user-all.json')
            .then(found => found.json())
            .then(found => found);
            

        console.log('getUserDetails ARR: ' + JSON.stringify(found) );
        resolve(found);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserRole(id){
    console.log('getUserRole: ' + id);
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        //console.log('usersArr:' + usersArr);
        //let found = usersArr.filter(x => x.id == id);
        let found = this.http.fetch('src/views/widgets/user-panels/dummy-user-role.json')
            .then(found => found.json())
            .then(found => found);            

        console.log('getUserRole ARR: ' + JSON.stringify(found) );
        resolve(found);
        this.isRequesting = false;
      }, latency);
    });
  }


  saveUser(user){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(user));
        let found = users.filter(x => x.id == user.id)[0];

        if(found){
          let index = users.indexOf(found);
          users[index] = instance;
        }else{
          //instance.id = getId();
          users.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
