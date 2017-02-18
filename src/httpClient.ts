import {HttpClient as AureliaClient, json, RequestInit} from 'aurelia-fetch-client';

//// WARNING: fails when response doesnt have a body, such as when 201 created is returned. Consider this when doing final implementation
export class HttpClient {
  fetch(route: string, method: string, body?: any, params?: any, silent = false): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let client = new AureliaClient();
      client.configure(config => {
        config.withDefaults({
          headers: {
            TimeZone: new Date().getTimezoneOffset().toString(),
            IsDesktop: this.getRequestParameters().offline == 'true'
          },
          credentials: "same-origin"
        })
          .withInterceptor({
            response(response, request) {
              if (response.ok || (<any>request).silent)
                return response;
              else
                throw response;
            },
            request(request) {
              if (silent)
                (<any>request).silent = silent;
              return request;
            }
          });
      });

      let requestInit: RequestInit = { method: method };
      let parameters = params ? "?" + $.param(params) : "";
      if (body) requestInit.body = json(body);

      client.fetch(route + parameters, requestInit)
        .then(response => {
          return response.status == 204 ? new Promise((resolve) => resolve({})) : response.json()
        })
        .then(obj => {
          return resolve(obj)
        })
        .catch(response => {
          if (response.status == 409 || response.status == 403) {
            response.json().then(exception => {
              let message = exception.validationErrors ? exception.validationErrors.join('\n') : JSON.stringify(exception);
              alert(message);
              reject(message);
            });
          }
          else {
            let message = response.status + " - " + response.statusText;
            alert("System error: " + message);
            reject(message);
          }
        });
    });
  }

  getRequestParameters(): any {
    var params = {};
    window.location.search.replace(/\\?([^?=&]+)(=([^&#]*))?/g, ($0, $1, $2, $3) => {
      if (typeof $3 == 'string')
        params[decodeURIComponent($1)] = decodeURIComponent($3);
      return $0;
    });
    return params;
  }
}