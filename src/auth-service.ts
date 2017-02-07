import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import config from './auth-config';

@inject(Aurelia, HttpClient)
export default class AuthService {
http;
app;
session;

  // As soon as the AuthService is created, we query local storage to
  // see if the login information has been stored. If so, we immediately
  // load it into the session object on the AuthService.
  constructor(app:Aurelia, http: HttpClient) {

    http.configure(http => {
      http.withBaseUrl(config.baseUrl);
    });

    this.session = JSON.parse(localStorage[config.tokenName] || null);
  }

  // The login function needs to abstract away all of the details about
  // how we track and expose login information. A more advanced app might
  // want the login function to pass back a promise so it can perform
  // additional tasks on login, but we keep things simple here.
  login(username, password) {
    this.http
      .post(config.loginUrl, { username, password })
      .then((response) => response.content)
      .then((session) => {
        localStorage[config.tokenName] = JSON.stringify(session);
        this.session = session;
        this.app.setRoot('app');
    });
  }

  // The logout function reverses the actions of the login function. 
  // It is less common for logout to be async, but logout could also
  // return a promise if there were a need.
  logout() {
    localStorage[config.tokenName] = null;
    this.session = null;
    this.app.setRoot('login')
  }

  // A basic method for exposing information to other modules.  
  isAuthenticated() {
    return this.session !== null;
  }
}