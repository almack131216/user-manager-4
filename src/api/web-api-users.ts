import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;
let myProfile = null;
let hw_useJson = true;

const api_lookups = '../../MRT.Api.Web/views/profileform/5?includeLookups=true';
const profileUrl = '../../MRT.Api.Web/views/global';
const views_welcome = '../../MRT.Api.Web/views/welcome';
const data_users_all = '../../MRT.Api.Web/data/users/query';
const views_profileform_X = '../../MRT.Api.Web/views/profileform/';
const data_users_X = '../../MRT.Api.Web/data/users/';


@autoinject
export class WebAPIUsers {
  isRequesting = false;
  usersArr = [];

  http: HttpClient
  router: Router;

  constructor(http: HttpClient, router: Router) {
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          mode: 'cors',
          cache: 'default',
          body: {},
          headers: {
            'TimeZone': new Date().getTimezoneOffset(),
            'Content-type': 'application/json',
            'Accept': 'application/json'
          }
        });

    });
    this.http = http;
    this.router = router;
  }


  getGlobal() {
    this.isRequesting = true;
    let tmpUrl = api_lookups;
    if (tmpUrl) tmpUrl = 'src/api/api-global.json';

    return new Promise(resolve => {
      setTimeout(() => {
        let currentUser = this.http.fetch(tmpUrl)
          .then(currentUser => currentUser.json());

        resolve(currentUser);
        this.isRequesting = false;
      }, latency);
    });

  }

  getLookups() {
    this.isRequesting = true;
    let tmpUrl = api_lookups;
    if (hw_useJson) tmpUrl = 'src/api/api-lookups.json';

    return new Promise(resolve => {
      setTimeout(() => {
        let data = this.http.fetch(tmpUrl)
          .then(data => data.json());

        resolve(data);
        this.isRequesting = false;
      }, latency);
    });

  }

  getUserList() {
    this.isRequesting = true;
    let tmpUrl = data_users_all;
    if (tmpUrl) tmpUrl = 'src/api/api-all-users.json';
    //alert('getUserList');
    return new Promise(resolve => {
      setTimeout(() => {
        // let users = this.http.fetch(tmpUrl, {method: 'SEARCH', body: json({}) })
        // .then(users => users.json());
        let users = this.http.fetch(tmpUrl)
          .then(users => users.json());

        resolve(users);

        this.isRequesting = false;
      }, latency);
    });
  }

  getHomepageData() {
    this.isRequesting = true;
    let tmpUrl = views_welcome;
    if (hw_useJson) tmpUrl = 'src/api/api-welcome.json';

    return new Promise(resolve => {
      setTimeout(() => {
        let data = this.http.fetch(tmpUrl, { method: "GET" })
          .then(data => data.json());
        resolve(data);
        this.isRequesting = false;
      }, latency);
    });
  }



  getUserDetails(id) {
    console.log('getUserDetails: ' + id);
    this.isRequesting = true;
    let tmpUrl = views_profileform_X + id;
    if (hw_useJson) tmpUrl = 'src/api/api-user.json';

    return new Promise(resolve => {
      setTimeout(() => {
        //let found = usersArr.filter(x => x.id == id);

        let found = this.http.fetch(tmpUrl)
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
    let tmpUrl = data_users_X + id;
    if (hw_useJson) tmpUrl = 'src/api/api-user.json';

    return new Promise(resolve => {
      setTimeout(() => {

        let found = this.http.fetch(tmpUrl)
          .then(found => found.json())
          .then(found => found);

        //console.log('getUserRole ARR: ' + JSON.stringify(found));
        resolve(found);
        this.isRequesting = false;
      }, latency);
    });
  }

  // updateUserProfile(user) {
  //   this.http.fetch('users', {
  //     method: 'post',
  //     body: json(user)
  //   })
  // }

  navigateTo(getUrl) {
    //route: user-edit; params.bind: {id:user.id, editType:'edit'}
    this.router.navigate(getUrl);//"users/5/edit"
  }

  saveUserProfile(id, data) {
    console.log('saveUserProfile... (' + id + ')');
    this.isRequesting = true;
    let tmpUrl = '../../MRT.Api.Web/data/users/' + id + '/profile';

    return new Promise(resolve => {
      setTimeout(() => {
        let savedData = this.http.fetch(tmpUrl, { method: "POST", body: json(data) })
          .then(() => {
            console.log('saveUserProfile... saved successfully')
          });

        this.isRequesting = false;
        resolve(savedData);
      }, latency);
    });
  }
}
