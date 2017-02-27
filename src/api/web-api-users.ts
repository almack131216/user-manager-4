import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import 'jquery';
import toastr = require('toastr');

//import {HttpClient} from '../httpClient';

let latency = 200;
let id = 0;
let users = null;
let usersArr = [];
let results = null;
let myProfile = null;
let hw_useJson = true;
let path_api = '../../MRT.Api.Web';
//let path_api = '../api';
let path_local = 'src/api';

const apiUrlsArr = [];
apiUrlsArr['global'] = { method: 'GET', url: '/views/global', urlLocal: '/api-global.json', data: null }
apiUrlsArr['welcome'] = { method: 'GET', url: '/views/welcome', urlLocal: '/api-welcome.json', data: null }
apiUrlsArr['user-selected'] = { method: 'GET', url: '/views/profileform/', urlAppendWithId: true, urlAppendEnd: '?includeLookups=true', urlLocal: '/api-user-with-lookups-', urlLocalAppendEnd: '.json', data: null }
apiUrlsArr['user-role'] = { method: 'GET', url: '/data/users/', urlAppendWithId: true, urlLocal: '/api-user.json', data: null }
//apiUrlsArr['lookups'] = { method: 'GET', url: '/views/profileform/', urlAppend: '?includeLookups=true', urlLocal: '/api-user-with-lookups.json', data: null }
apiUrlsArr['user-list-to-add'] = { method: 'SEARCH', url: '/ldap/query?limit=5', urlLocal: '/api-list-add-users.json', data: {} }
apiUrlsArr['user-list'] = { method: 'SEARCH', url: '/data/users/query', urlLocal: '/api-all-users.json', data: null }


apiUrlsArr['delete-user'] = { method: 'DELETE', url: '/data/users/', urlAppendWithId: true, urlLocal: '', data: null, toastrMsg: 'User Archived' }
apiUrlsArr['delete-multiple-users'] = { method: 'DELETE', url: '/data/users', urlLocal: '', data: null, toastrMsg: 'Users Archived' }
apiUrlsArr['user-list-to-add-add'] = { method: 'POST', url: '/data/users', urlLocal: '', data: null, toastrMsg: 'User Successfully Added' }

apiUrlsArr['save-user'] = { method: 'POST', url: '/data/users/', urlAppendWithId: true, urlAppendEnd: '/profile', urlLocal: '', toastrMsg: 'Successfully Saved' }
apiUrlsArr['save-user-role'] = { method: 'PUT', url: '/data/users/', urlAppendWithId: true, urlLocal: '', data: null, toastrMsg: 'User Role Updated' }
apiUrlsArr['review-user'] = { method: 'PUT', url: '/data/users/', urlAppendWithId: true, urlAppendEnd: '/review', urlLocal: '', data: null, toastrMsg: 'User Approved' }




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


  apiCall(getId, getUserId, getData) {
    this.isRequesting = true;
    var apiMethod = hw_useJson ? "GET" : apiUrlsArr[getId].method;
    let apiUrl = !hw_useJson && apiUrlsArr[getId].url ? path_api + apiUrlsArr[getId].url : path_local + apiUrlsArr[getId].urlLocal;

    if (getUserId && apiUrlsArr[getId].urlAppendWithId) {
      apiUrl += getUserId;// + apiUrlsArr[getId].getData;
      //if (hw_useJson) getData = null;
    }
    if (apiUrlsArr[getId].urlAppendEnd) apiUrl += !hw_useJson ? apiUrlsArr[getId].urlAppendEnd : apiUrlsArr[getId].urlLocalAppendEnd;

    console.log('apiCall: ' + getId + ' > getUserId: ' + getUserId + ' > getData: ' + JSON.stringify(getData));

    let apiData = getData ? JSON.stringify(getData) : apiUrlsArr[getId].data;

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
        //console.log('API CALL SUCCESS: ' + result + ' / ' + apiUrlsArr[getId].toastrMsg);
        // let returnData = result;
        if(apiUrlsArr[getId].toastrMsg) {
          toastr['success'](apiUrlsArr[getId].toastrMsg);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        //console.log("Error: " + thrownError);        
        console.log("Error: " + xhr.responseJSON.exceptionMessage);
        toastr.error("Error: " + xhr.responseJSON.exceptionMessage);
      }
    });

  }


  deleteMultipleUsersXXX(data) {
    this.isRequesting = true;
    let tmpUrl = path_api + '/data/users';
    //if (hw_useJson) tmpUrl = 'src/api/api-all-users.json';
    //alert('getUserList');

    //alert(JSON.stringify(data));

    return $.ajax({
      type: 'DELETE',
      url: tmpUrl,
      data: data ? JSON.stringify(data) : null,
      contentType: 'application/json',
      beforeSend: function (request) { request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString()); }
    });
  }




  getUserToAdd_addUserXXX(data) {
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

  saveUserProfileXXX(id, data) {
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

  deleteUserXXX(id) {
    console.log('saveUserProfile... (' + id + ')');
    this.isRequesting = true;
    let tmpUrl = path_api + '/data/users/' + id;

    alert('DELETE > ' + tmpUrl + ' ? ' + 'null');

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

}
