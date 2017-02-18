import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import 'jquery';

//import {HttpClient} from '../httpClient';

let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;
let myProfile = null;
<<<<<<< HEAD
let hw_useJson = true;
//let path_api = '../../MRT.Api.Web';
//let path_api = '../api';
let path_api = 'src/api';

const apiUrlsArr = [];
apiUrlsArr['global'] = { method: 'GET', url: '/views/global', urlLocal: '/api-global.json', data: null }
apiUrlsArr['welcome'] = { method: 'GET', url: '/views/welcome', urlLocal: '/api-welcome.json', data: null }
apiUrlsArr['user-selected'] = { method: 'GET', url: '/views/profileform/', urlAppendWithId:true, urlAppendEnd: '?includeLookups=true', urlLocal: '/api-user-with-lookups.json', data: null }
apiUrlsArr['lookups'] = { method: 'GET', url: '/views/profileform/', urlAppend: '?includeLookups=true', urlLocal: '/api-user-with-lookups.json', data: null }
apiUrlsArr['user-list-to-add'] = { method: 'GET', url: '/ldap/query?limit=5', urlLocal: '/api-list-add-users.json', data: {} }
apiUrlsArr['user-list'] = { method: 'SEARCH', url: '/data/users/query', urlLocal: '/api-all-users.json', data: null }
apiUrlsArr['user-role'] = { method: 'GET', url: '/data/users/', urlAppendWithId:true, urlLocal: '/api-user.json', data: null }
=======
let hw_useJson = null;
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a


const data_users_X = path_api + '/data/users/';
const ldap_query_ntId = path_api + '/ldap/query';
const delete_users_X = path_api + '/data/users/';
const delete_multiple = path_api + '/data/users';

@autoinject
export class WebAPIUsers {
  isRequesting = false;
  usersArr = [];

  http: HttpClient
  router: Router;

  currentUser;


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

  apiCall(getId, getData) {
    this.isRequesting = true;
    var apiMethod = !hw_useJson ? apiUrlsArr[getId].method : "GET";
    let apiUrl = !hw_useJson ? path_api + apiUrlsArr[getId].url : path_api + apiUrlsArr[getId].urlLocal;

    if(!hw_useJson && getData && apiUrlsArr[getId].urlAppendWithId) {
      apiUrl += getData + apiUrlsArr[getId].getData;
      getData = null;
    }
    if(!hw_useJson && getData && apiUrlsArr[getId].urlApurlAppendEndpend) apiUrl += apiUrlsArr[getId].urlAppendEnd;

    let apiData = getData ? JSON.stringify(getData) : apiUrlsArr[getId].data;

    alert(apiMethod + ' > ' + apiUrl + ' > ' + apiData);

    return $.ajax({
      type: apiMethod,
      url: apiUrl,
      data: apiData,
      dataType: "json",
      contentType: 'application/json',
      beforeSend: function (request) {
        request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
      },
      success: function (result) {
        // console.log('API CALL SUCCESS: ' + result);
        // let returnData = result;
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("Error: " + thrownError);
      }
    });
  }


  deleteMultipleUsers(data) {
    this.isRequesting = true;
    let tmpUrl = delete_multiple;
    //if (hw_useJson) tmpUrl = 'src/api/api-all-users.json';
    //alert('getUserList');

    alert(JSON.stringify(data));

    return $.ajax({
      type: 'DELETE',
      url: tmpUrl,
      data: data ? JSON.stringify(data) : null,
      contentType: 'application/json',
      beforeSend: function (request) { request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString()); }
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

  getUserToAdd_addUser(data) {
    this.isRequesting = true;
    let tmpUrl = path_api + '/data/users';// { loginName: 'AGILY\\JBohm', isMember: true, systemRolesValue: 3 }
    //alert('getUserToAdd_addUser: ' + tmpUrl + ' > ' + data);
    return $.ajax({
      type: 'POST',
      url: tmpUrl,
      data: data ? JSON.stringify(data) : null,
      contentType: 'application/json',
      beforeSend: function (request) {
        request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
      },
      success: function (data, textStatus, jqXHR) {
        //alert('>>>' + JSON.stringify(data) );
        //let currentUser = data;
        //showResponse(data ? JSON.stringify(data, null, 2) : textStatus, 'lightgreen');
      }
    });

  }

  saveUserProfile(id, data) {
    console.log('saveUserProfile... (' + id + ')');
    this.isRequesting = true;
    let tmpUrl = path_api + '/data/users/' + id + '/profile';

    //let data = null;

    // return this.api.fetch('/api/views/profileform/5', 'GET', null, { includeLookups: true }).then((data) => {
    //  alert(data.user.id);
    // });
    //alert(tmpUrl);
    return $.ajax({
      type: 'POST',
      url: tmpUrl,
      data: data ? JSON.stringify(data) : null,
      contentType: 'application/json',
      beforeSend: function (request) {
        request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
      },
      success: function (data, textStatus, jqXHR) {
        //alert('>>>' + JSON.stringify(data) );
        let currentUser = data;
        //showResponse(data ? JSON.stringify(data, null, 2) : textStatus, 'lightgreen');
      }
    });

    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     let savedData = this.http.fetch(tmpUrl, { method: "POST", body: json(data) })
    //       .then(() => {
    //         console.log('saveUserProfile... saved successfully')
    //       });

    //     this.isRequesting = false;
    //     resolve(savedData);
    //   }, latency);
    // });
  }


  deleteUser(id) {
    console.log('saveUserProfile... (' + id + ')');
    this.isRequesting = true;
    let tmpUrl = delete_users_X + id;

    //alert(tmpUrl);

    return $.ajax({
      type: 'DELETE',
      url: tmpUrl,
      data: null,
      contentType: 'application/json',
      beforeSend: function (request) {
        request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
      },
      success: function (data, textStatus, jqXHR) {
        //alert('>>>' + JSON.stringify(data) );
        let currentUser = data;
        //showResponse(data ? JSON.stringify(data, null, 2) : textStatus, 'lightgreen');
      }
    });
  }


  emailUser(getEmailAddress) {
    console.log('mailto:' + getEmailAddress);
  }

}
