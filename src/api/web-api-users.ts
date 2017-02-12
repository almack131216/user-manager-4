import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';



let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;
let myProfile = null;

@autoinject
export class WebAPIUsers {
  isRequesting = false;
  usersArr = [];

  http: HttpClient

  constructor(http: HttpClient) {
    this.http = http;
  }


  getGlobal() {
    this.isRequesting = true;

    return new Promise(resolve => {
      setTimeout(() => {
        let myProfile = this.http.fetch('src/api/api-global.json')
          .then(myProfile => myProfile.json());

        resolve(myProfile);
        this.isRequesting = false;
      }, latency);
    });
    // this.isRequesting = true;

    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     let myProfile = this.http.fetch('src/api/api-global.json')
    //       .then(myProfile => myProfile.json());
    //     alert('api myProfile: ' + JSON.stringify(myProfile) );
    //     resolve(myProfile);
    //     this.isRequesting = false;
    //   }, latency);
    // });
  }

  getUserList() {
    this.isRequesting = true;

    return new Promise(resolve => {
      setTimeout(() => {
        let users = this.http.fetch('src/api/api-all-users.json')
          .then(users => users.json());

        resolve(users);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserDetails(id) {
    console.log('getUserDetails: ' + id);
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('usersArr:' + usersArr);
        //let found = usersArr.filter(x => x.id == id);
        let found = this.http.fetch('src/api/dummy-user-all.json')
          .then(found => found.json())
          .then(found => found);


        console.log('getUserDetails ARR: ' + JSON.stringify(found));
        resolve(found);
        this.isRequesting = false;
      }, latency);
    });
  }

  getUserRole(id) {
    console.log('getUserRole: ' + id);
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        //console.log('usersArr:' + usersArr);
        //let found = usersArr.filter(x => x.id == id);
        let found = this.http.fetch('src/api/dummy-user-role.json')
          .then(found => found.json())
          .then(found => found);

        console.log('getUserRole ARR: ' + JSON.stringify(found));
        resolve(found);
        this.isRequesting = false;
      }, latency);
    });
  }


  saveUser(user) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(user));
        let found = users.filter(x => x.id == user.id)[0];

        if (found) {
          let index = users.indexOf(found);
          users[index] = instance;
        } else {
          //instance.id = getId();
          users.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
