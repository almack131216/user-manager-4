define('resources/constants',["require", "exports"], function (require, exports) {
    "use strict";
    exports.debugConsoleLog = false;
    exports.debugShowOutput = false;
    exports.debugShowCodeOutput = false;
    exports.debugShowCurrentUser = false;
    exports.COPYRIGHT = '© 2017 BP p.l.c.';
    exports.SITE_OWNER_ABBR = 'BP';
    exports.SITE_OWNER = 'British Petroleum';
    exports.SITE_NAME_ABBR = 'MRT';
    exports.SITE_NAME = 'Mutual Response Team';
    exports.AYS = "Are you sure";
    exports.AYS_DELETE = "Are you sure you want to delete";
    exports.BTN_XC_Expand = "Expand All";
    exports.BTN_XC_Collapse = "Collapse All";
    exports.MSG_TRAINING = "<p>No training is mandatory or required. Roles that require specific training will be selected based on responses below.</p>";
    exports.FORMAT_DATE = "MMMM Do YYYY";
    exports.myLabels = {
        "firstName": "First Name",
        "lastName": "Last Name",
        "emailAddress": "Email Address",
        "loginName": "Username/NTID",
        "lkp_regions": "Region",
        "lkp_hubs": "Hub",
        "lkp_segments": "Segments",
        "lkp_entities": "Entity",
        "function": "Function",
        "location": "Location",
        "lkp_primaryPositions": "Primary ICS",
        "lkp_secondaryPositions": "Secondary ICS",
        "lkp_offices": "BP Office",
        "lkp_coatSizes": "Coat Size",
        "businessNumber": "Business Cell No.",
        "personalNumber": "Personal Cell No.",
        "officeNumber": "Office Number",
        "lyncNumber": "Lync Number",
        "homeNumber": "Home Number",
        "manager_displayName": "Line Manager",
        "manager_emailAddress": "Line Manager Email",
        "manager_loginName": "Line Manager NTID",
        "manager_emergencyContactName": "Emergency Contact Name",
        "manager_emergencyContactNumber": "Emergency Contact No.",
        "language": "Language",
        "languageProficiency": "Language Proficiency",
        "visaCountry": "Visa Country",
        "visaType": "Visa Type",
        "visaExpiryDate": "Visa Expiry Date",
        "visaMultiple": "Multiple Visa",
        "passportType": "Passport Type",
        "passportNumber": "Passport Number",
        "passportNationality": "Passport Nationality",
        "passportExpiryDate": "Passport Expiry Date",
        "trainingExpiryDate": "Training Expiry Date",
        "expiryDate": "Expiry Date",
        "training": "Training",
        "attended": "Attended",
        "MRTMember": "MRT Member",
        "lkp_systemRole": "System Role"
    };
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('api/web-api-users',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router", "toastr", "jquery"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1, toastr) {
    "use strict";
    var latency = 200;
    var id = 0;
    var users = null;
    var usersArr = [];
    var results = null;
    var myProfile = null;
    var hw_useJson = true;
    var path_api = '../../MRT.Api.Web';
    var path_local = 'src/api';
    var apiUrlsArr = [];
    apiUrlsArr['global'] = { method: 'GET', url: '/views/global', urlLocal: '/api-global.json', data: null };
    apiUrlsArr['welcome'] = { method: 'GET', url: '/views/welcome', urlLocal: '/api-welcome.json', data: null };
    apiUrlsArr['user-selected'] = { method: 'GET', url: '/views/profileform/', urlAppendWithId: true, urlAppendEnd: '?includeLookups=true', urlLocal: '/api-user-with-lookups-', urlLocalAppendEnd: '.json', data: null };
    apiUrlsArr['user-list-to-add'] = { method: 'SEARCH', url: '/ldap/query?limit=5', urlLocal: '/api-list-add-users.json', data: {} };
    apiUrlsArr['user-list'] = { method: 'SEARCH', url: '/data/users/query', urlLocal: '/api-all-users.json', data: null };
    apiUrlsArr['user-role'] = { method: 'GET', url: '/data/users/', urlAppendWithId: true, urlLocal: '/api-user.json', data: null };
    apiUrlsArr['delete-user'] = { method: 'DELETE', url: '/data/users/', urlAppendWithId: true, urlLocal: '', data: null };
    apiUrlsArr['delete-multiple-users'] = { method: 'DELETE', url: '/data/users', urlLocal: '', data: null };
    apiUrlsArr['user-list-to-add-add'] = { method: 'POST', url: '/data/users', urlLocal: '', data: null };
    apiUrlsArr['save-user'] = { method: 'POST', url: '/data/users/', urlAppendWithId: true, urlAppendEnd: '/profile', urlLocal: '' };
    apiUrlsArr['save-user-role'] = { method: 'PUT', url: '/data/users/', urlAppendWithId: true, urlLocal: '', data: null };
    var data_users_X = path_api + '/data/users/';
    var ldap_query_ntId = path_api + '/ldap/query';
    var delete_users_X = path_api + '/data/users/';
    var delete_multiple = path_api + '/data/users';
    var WebAPIUsers = (function () {
        function WebAPIUsers(http, router) {
            this.isRequesting = false;
            this.usersArr = [];
            http.configure(function (config) {
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
        WebAPIUsers.prototype.apiCall = function (getId, getUserId, getData) {
            this.isRequesting = true;
            var apiMethod = hw_useJson ? "GET" : apiUrlsArr[getId].method;
            var apiUrl = !hw_useJson && apiUrlsArr[getId].url ? path_api + apiUrlsArr[getId].url : path_local + apiUrlsArr[getId].urlLocal;
            if (getUserId && apiUrlsArr[getId].urlAppendWithId) {
                apiUrl += getUserId;
            }
            if (apiUrlsArr[getId].urlAppendEnd)
                apiUrl += !hw_useJson ? apiUrlsArr[getId].urlAppendEnd : apiUrlsArr[getId].urlLocalAppendEnd;
            console.log('apiCall: ' + getId + ' > getUserId: ' + getUserId + ' > getData: ' + JSON.stringify(getData));
            var apiData = getData ? JSON.stringify(getData) : apiUrlsArr[getId].data;
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
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error: " + thrownError);
                    toastr.error("Error: " + thrownError);
                }
            });
        };
        WebAPIUsers.prototype.deleteMultipleUsersXXX = function (data) {
            this.isRequesting = true;
            var tmpUrl = delete_multiple;
            return $.ajax({
                type: 'DELETE',
                url: tmpUrl,
                data: data ? JSON.stringify(data) : null,
                contentType: 'application/json',
                beforeSend: function (request) { request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString()); }
            });
        };
        WebAPIUsers.prototype.getUserToAdd_addUserXXX = function (data) {
            this.isRequesting = true;
            var tmpUrl = path_api + '/data/users';
            return $.ajax({
                type: 'POST',
                url: tmpUrl,
                data: data ? JSON.stringify(data) : null,
                contentType: 'application/json',
                beforeSend: function (request) {
                    request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
                },
                success: function (data, textStatus, jqXHR) {
                }
            });
        };
        WebAPIUsers.prototype.saveUserProfileXXX = function (id, data) {
            console.log('saveUserProfile... (' + id + ')');
            this.isRequesting = true;
            var tmpUrl = path_api + '/data/users/' + id + '/profile';
            return $.ajax({
                type: 'POST',
                url: tmpUrl,
                data: data ? JSON.stringify(data) : null,
                contentType: 'application/json',
                beforeSend: function (request) {
                    request.setRequestHeader("TimeZone", new Date().getTimezoneOffset().toString());
                },
                success: function (data, textStatus, jqXHR) {
                    var currentUser = data;
                }
            });
        };
        WebAPIUsers.prototype.deleteUserXXX = function (id) {
            console.log('saveUserProfile... (' + id + ')');
            this.isRequesting = true;
            var tmpUrl = delete_users_X + id;
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
                    var currentUser = data;
                }
            });
        };
        return WebAPIUsers;
    }());
    WebAPIUsers = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], WebAPIUsers);
    exports.WebAPIUsers = WebAPIUsers;
});

define('my-globals',["require", "exports"], function (require, exports) {
    "use strict";
    var MyGlobals = (function () {
        function MyGlobals() {
            this.foo = {};
            this.isReadOnly = null;
            this.currentUser = {};
            this.userSelected = {};
            this.profileSelected = {};
        }
        MyGlobals.prototype.getFoo = function () { return this.foo; };
        MyGlobals.prototype.setFoo = function (bar) {
        };
        return MyGlobals;
    }());
    exports.MyGlobals = MyGlobals;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-router", "aurelia-framework", "./resources/constants", "aurelia-auth", "aurelia-http-client", "./api/web-api-users", "./my-globals", "toastr"], function (require, exports, aurelia_router_1, aurelia_framework_1, Constants, aurelia_auth_1, aurelia_http_client_1, web_api_users_1, my_globals_1, toastr) {
    "use strict";
    var CV = Constants;
    var reposUrl = 'https://api.github.com/orgs/aurelia/repos';
    var profileUrl = 'src/api/api-global.json';
    var App = (function () {
        function App(http, api) {
            this.api = api;
            this.CV = CV;
            this.repos = null;
            this.http = http;
            this.myGlobals = my_globals_1.MyGlobals;
            toastr.options.preventDuplicates = true;
        }
        App.prototype.activate = function () {
            var _this = this;
            return this.api.apiCall('global', null, null)
                .then(function (apiResultData) { return _this.currentUser = apiResultData; })
                .then(function () {
                _this.currentUser = _this.currentUser.currentUser,
                    _this.myId = _this.currentUser.id,
                    _this.myDisplayName = _this.currentUser.displayName,
                    _this.isReader = _this.currentUser.isReader,
                    _this.isEditor = _this.currentUser.isEditor;
                _this.myGlobals.currentUser = _this.currentUser;
                console.log('this.myGlobals.currentUser: ' + _this.myGlobals.currentUser.id);
            });
        };
        App.prototype.configureRouter = function (config, router) {
            config.title = CV.SITE_NAME_ABBR;
            config.map([
                { route: ['', 'welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Home' },
                { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Team', settings: { isReaderOnly: true } },
                { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'Team' },
                { route: 'user/:id/:pageType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit' },
                { route: 'user/:id/:pageType', moduleId: './views/pages/user-selected', name: 'user-read', title: 'Read' }
            ]);
            this.router = router;
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(aurelia_http_client_1.HttpClient, aurelia_router_1.Router, aurelia_auth_1.FetchConfig, web_api_users_1.WebAPIUsers),
        __metadata("design:paramtypes", [Object, web_api_users_1.WebAPIUsers])
    ], App);
    exports.App = App;
});

define('auth-config',["require", "exports"], function (require, exports) {
    "use strict";
    var configForDevelopment = {
        providers: {
            baseUrl: 'http://localhost:9000/',
            loginUrl: '560122ef9635789e120aa366',
            tokenName: 'ah12h3',
            google: {
                clientId: '239531826023-ibk10mb9p7ull54j55a61og5lvnjrff6.apps.googleusercontent.com'
            },
            linkedin: {
                clientId: '778mif8zyqbei7'
            },
            facebook: {
                clientId: '1452782111708498'
            }
        }
    };
    var configForProduction = {
        providers: {
            google: {
                clientId: '239531826023-3ludu3934rmcra3oqscc1gid3l9o497i.apps.googleusercontent.com'
            },
            linkedin: {
                clientId: '7561959vdub4x1'
            },
            facebook: {
                clientId: '1653908914832509'
            }
        }
    };
    var config;
    if (window.location.hostname === 'localhost') {
        config = configForDevelopment;
    }
    else {
        config = configForProduction;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('auth-service',["require", "exports", "aurelia-framework", "aurelia-http-client", "./auth-config"], function (require, exports, aurelia_framework_1, aurelia_http_client_1, auth_config_1) {
    "use strict";
    var AuthService = (function () {
        function AuthService(app, http) {
            http.configure(function (http) {
                http.withBaseUrl(auth_config_1.default.baseUrl);
            });
            this.session = JSON.parse(localStorage[auth_config_1.default.tokenName] || null);
        }
        AuthService.prototype.login = function (username, password) {
            var _this = this;
            this.http
                .post(auth_config_1.default.loginUrl, { username: username, password: password })
                .then(function (response) { return response.content; })
                .then(function (session) {
                localStorage[auth_config_1.default.tokenName] = JSON.stringify(session);
                _this.session = session;
                _this.app.setRoot('app');
            });
        };
        AuthService.prototype.logout = function () {
            localStorage[auth_config_1.default.tokenName] = null;
            this.session = null;
            this.app.setRoot('login');
        };
        AuthService.prototype.isAuthenticated = function () {
            return this.session !== null;
        };
        return AuthService;
    }());
    AuthService = __decorate([
        aurelia_framework_1.inject(aurelia_framework_1.Aurelia, aurelia_http_client_1.HttpClient),
        __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_http_client_1.HttpClient])
    ], AuthService);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AuthService;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('httpClient',["require", "exports", "aurelia-fetch-client"], function (require, exports, aurelia_fetch_client_1) {
    "use strict";
    var HttpClient = (function () {
        function HttpClient() {
        }
        HttpClient.prototype.fetch = function (route, method, body, params, silent) {
            var _this = this;
            if (silent === void 0) { silent = false; }
            return new Promise(function (resolve, reject) {
                var client = new aurelia_fetch_client_1.HttpClient();
                client.configure(function (config) {
                    config.withDefaults({
                        headers: {
                            TimeZone: new Date().getTimezoneOffset().toString(),
                            IsDesktop: _this.getRequestParameters().offline == 'true'
                        },
                        credentials: "same-origin"
                    })
                        .withInterceptor({
                        response: function (response, request) {
                            if (response.ok || request.silent)
                                return response;
                            else
                                throw response;
                        },
                        request: function (request) {
                            if (silent)
                                request.silent = silent;
                            return request;
                        }
                    });
                });
                var requestInit = { method: method };
                var parameters = params ? "?" + $.param(params) : "";
                if (body)
                    requestInit.body = aurelia_fetch_client_1.json(body);
                client.fetch(route + parameters, requestInit)
                    .then(function (response) {
                    return response.status == 204 ? new Promise(function (resolve) { return resolve({}); }) : response.json();
                })
                    .then(function (obj) {
                    return resolve(obj);
                })
                    .catch(function (response) {
                    if (response.status == 409 || response.status == 403) {
                        response.json().then(function (exception) {
                            var message = exception.validationErrors ? exception.validationErrors.join('\n') : JSON.stringify(exception);
                            alert(message);
                            reject(message);
                        });
                    }
                    else {
                        var message = response.status + " - " + response.statusText;
                        alert("System error: " + message);
                        reject(message);
                    }
                });
            });
        };
        HttpClient.prototype.getRequestParameters = function () {
            var params = {};
            window.location.search.replace(/\\?([^?=&]+)(=([^&#]*))?/g, function ($0, $1, $2, $3) {
                if (typeof $3 == 'string')
                    params[decodeURIComponent($1)] = decodeURIComponent($3);
                return $0;
            });
            return params;
        };
        return HttpClient;
    }());
    exports.HttpClient = HttpClient;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('login',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Login = (function () {
        function Login(aurelia, login) {
            var _this = this;
            this.login = login;
            this.title = 'Login';
            this.username = '';
            this.password = '';
            this.error = '';
            this.login = function () {
                if (_this.username && _this.password) {
                    aurelia.setRoot('app');
                }
                else {
                    _this.error = 'Please enter a username and password.';
                }
            };
        }
        return Login;
    }());
    Login = __decorate([
        aurelia_framework_1.inject(aurelia_framework_1.Aurelia),
        __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, Object])
    ], Login);
    exports.Login = Login;
});

define('main',["require", "exports", "./environment", "./auth-config", "kendo-ui-core"], function (require, exports, environment_1, auth_config_1) {
    "use strict";
    Promise.config({
        longStackTraces: environment_1.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .feature('resources')
            .plugin('aurelia-table')
            .globalResources("aurelia-mask/masked-input")
            .plugin('aurelia-dialog', function (config) {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.centerVerticalOnly = false;
            config.settings.startingZIndex = 5;
            config.settings.enableEscClose = true;
        })
            .plugin('aurelia-auth', function (baseConfig) {
            baseConfig.configure(auth_config_1.default);
        })
            .plugin('aurelia-kendoui-bridge');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(''); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('my-nav',["require", "exports", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    var MyNav = (function () {
        function MyNav(router) {
            this.router = router;
        }
        MyNav.prototype.navigateTo = function (getUrl) {
            this.router.navigate(getUrl);
        };
        MyNav.prototype.navigateToUserPage = function (getName, getId) {
            console.log('navigateToUserPage: ' + getName + ', ' + getId);
            var tmpUrl = 'user/' + getId + '/' + getName;
            this.router.navigate(tmpUrl);
        };
        MyNav.prototype.emailUser = function (getEmailAddress) {
            console.log('mailto:' + getEmailAddress);
        };
        return MyNav;
    }());
    MyNav = __decorate([
        aurelia_framework_1.inject(aurelia_router_1.Router),
        __metadata("design:paramtypes", [aurelia_router_1.Router])
    ], MyNav);
    exports.MyNav = MyNav;
});

define('api/utility',["require", "exports"], function (require, exports) {
    "use strict";
    function areEqual(obj1, obj2) {
        return Object.keys(obj1).every(function (key) { return obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]); });
    }
    exports.areEqual = areEqual;
    ;
});

define('api/web-api',["require", "exports"], function (require, exports) {
    "use strict";
    var latency = 200;
    var id = 0;
    function getId() {
        return ++id;
    }
    var contacts = [
        {
            id: getId(),
            firstName: 'John',
            lastName: 'Tolkien',
            emailAddress: 'tolkien@inklings.com',
            personalNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Clive',
            lastName: 'Lewis',
            emailAddress: 'lewis@inklings.com',
            personalNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Owen',
            lastName: 'Barfield',
            emailAddress: 'barfield@inklings.com',
            personalNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Charles',
            lastName: 'Williams',
            emailAddress: 'williams@inklings.com',
            personalNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Roger',
            lastName: 'Green',
            emailAddress: 'green@inklings.com',
            personalNumber: '867-5309'
        }
    ];
    var WebAPI = (function () {
        function WebAPI() {
            this.isRequesting = false;
        }
        WebAPI.prototype.getContactList = function () {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var results = contacts.map(function (x) {
                        return {
                            id: x.id,
                            firstName: x.firstName,
                            lastName: x.lastName,
                            emailAddress: x.emailAddress,
                            personalNumber: x.personalNumber
                        };
                    });
                    resolve(results);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPI.prototype.getContactDetails = function (id) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var found = contacts.filter(function (x) { return x.id == id; })[0];
                    resolve(JSON.parse(JSON.stringify(found)));
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPI.prototype.saveContact = function (contact) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var instance = JSON.parse(JSON.stringify(contact));
                    var found = contacts.filter(function (x) { return x.id == contact.id; })[0];
                    if (found) {
                        var index = contacts.indexOf(found);
                        contacts[index] = instance;
                    }
                    else {
                        instance.id = getId();
                        contacts.push(instance);
                    }
                    _this.isRequesting = false;
                    resolve(instance);
                }, latency);
            });
        };
        return WebAPI;
    }());
    exports.WebAPI = WebAPI;
});

define('resources/messages',["require", "exports"], function (require, exports) {
    "use strict";
    var ContactUpdated = (function () {
        function ContactUpdated(contact) {
            this.contact = contact;
        }
        return ContactUpdated;
    }());
    exports.ContactUpdated = ContactUpdated;
    var ContactViewed = (function () {
        function ContactViewed(contact) {
            this.contact = contact;
        }
        return ContactViewed;
    }());
    exports.ContactViewed = ContactViewed;
    var UserUpdated = (function () {
        function UserUpdated(user) {
            this.user = user;
        }
        return UserUpdated;
    }());
    exports.UserUpdated = UserUpdated;
    var UserViewed = (function () {
        function UserViewed(user) {
            this.user = user;
        }
        return UserViewed;
    }());
    exports.UserViewed = UserViewed;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/lookups',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Lookups = (function () {
        function Lookups() {
            this.systemRoles = [
                {
                    "flags": [
                        {
                            "value": 1,
                            "name": "Viewer"
                        }
                    ],
                    "value": 1,
                    "name": "Viewer"
                },
                {
                    "flags": [
                        {
                            "value": 1,
                            "name": "Viewer"
                        },
                        {
                            "value": 3,
                            "name": "Manager"
                        }
                    ],
                    "value": 3,
                    "name": "Manager"
                }
            ];
            this.userTypes = [
                {
                    "value": 1,
                    "name": "All members"
                },
                {
                    "value": 2,
                    "name": "Readers"
                },
                {
                    "value": 3,
                    "name": "All"
                }
            ];
            this.lkp_isActive = [
                { "value": true, "name": "Active" },
                { "value": false, "name": "Archived" }
            ];
        }
        return Lookups;
    }());
    Lookups = __decorate([
        aurelia_framework_1.noView,
        __metadata("design:paramtypes", [])
    ], Lookups);
    exports.Lookups = Lookups;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dialog-demo/add-user-dialog',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../api/web-api-users", "../resources/lookups", "../resources/constants"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, web_api_users_1, lookups_1, Constants) {
    "use strict";
    var CV = Constants;
    var AddUserDialog = (function () {
        function AddUserDialog(controller, api, ea, lookups) {
            var _this = this;
            this.controller = controller;
            this.api = api;
            this.ea = ea;
            this.lookups = lookups;
            this.CV = CV;
            this.title = 'Add User';
            this.userRole = null;
            this.originalUser = null;
            this.selectedId = null;
            this.rolesArrDynamic = [];
            this.filters = [
                { value: '', keys: ['fullName', 'email', 'ntId', 'uniqueId'] }
            ];
            this.selectUserToAdd = function (getUser) {
                _this.selectedId = getUser.uniqueId;
                _this.userRole = getUser;
                console.log('add-user-dialog: select: ' + _this.selectedId);
            };
            this.filter_memberType = [
                { "value": true, "name": "Members" },
                { "value": false, "name": "Non-members" }
            ];
            this.filter_active = [
                { "value": true, "name": "Active" },
                { "value": false, "name": "Archived" }
            ];
            this.systemRoles = lookups.systemRoles;
        }
        AddUserDialog.prototype.addUserSearch = function (getType, getUserId) {
            var _this = this;
            var tmpData = {};
            if (getType == 'ntId') {
                this.searchFor_name = '';
                tmpData = { ntId: getUserId };
            }
            if (getType == 'name') {
                this.searchFor_ntId = '';
                tmpData = { name: getUserId };
            }
            this.api.apiCall('user-list-to-add', null, tmpData)
                .then(function (selectedUserArr) { return _this.selectedUserArr = selectedUserArr; })
                .then(function () {
                _this.selectedId = null;
                console.log('addUserSearch(): Selected > ' + _this.selectedUserArr.length + ' > ' + _this.selectedUserArr);
            });
        };
        AddUserDialog.prototype.deselectUser = function () {
            this.selectedId = null;
        };
        AddUserDialog.prototype.created = function () {
            var _this = this;
            this.isLoadingApi = true;
            this.api.apiCall('user-list-to-add', null, {})
                .then(function (listUsersToAdd) { return _this.listUsersToAdd = listUsersToAdd; })
                .then(function () { return _this.populateRoleFilterFromList(); })
                .then(function () {
                _this.isLoadingApi = false;
                _this.selectedId = null;
                console.log('xxxxxxxxx' + JSON.stringify(_this.listUsersToAdd));
            });
        };
        AddUserDialog.prototype.activate = function () {
        };
        AddUserDialog.prototype.addUser = function (getUser, getSelected_isMember, getSelected_systemRole) {
            var _this = this;
            var tmpData = { uniqueId: getUser.uniqueId, isMember: getSelected_isMember, systemRolesValue: getSelected_systemRole };
            console.log('addUser() -> tmpData: ' + JSON.stringify(tmpData));
            this.api.apiCall('user-list-to-add-add', null, tmpData)
                .then(function () {
                _this.controller.ok();
                console.log('ADD USER: ' + JSON.stringify(_this.listUsersToAdd));
            });
        };
        AddUserDialog.prototype.cancel = function () {
            this.controller.cancel();
        };
        AddUserDialog.prototype.returnLabelFromValue = function (getId) {
            if (getId)
                return this.rolesArr.filter(function (x) { return x.value == getId; })[0].name;
            return '';
        };
        AddUserDialog.prototype.populateRoleFilterFromList = function () {
            var tmp_rolesArrValues = [];
            this.rolesArrDynamic = [];
            var _loop_1 = function (next) {
                var nextRole = next.systemRoles;
                if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                    tmp_rolesArrValues.push(nextRole);
                    var nextLabel = this_1.rolesArr.filter(function (x) { return x.value == nextRole; }).name;
                    this_1.rolesArrDynamic.push({ "value": nextRole, "name": nextLabel });
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.listUsersToAdd; _i < _a.length; _i++) {
                var next = _a[_i];
                _loop_1(next);
            }
        };
        return AddUserDialog;
    }());
    AddUserDialog = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, lookups_1.Lookups),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, lookups_1.Lookups])
    ], AddUserDialog);
    exports.AddUserDialog = AddUserDialog;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dialog-demo/delete-user-dialog',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../api/web-api-users", "../resources/lookups"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, web_api_users_1, lookups_1) {
    "use strict";
    var DeleteDialog = (function () {
        function DeleteDialog(controller, api, ea, model, lookups) {
            var _this = this;
            this.controller = controller;
            this.api = api;
            this.ea = ea;
            this.model = model;
            this.lookups = lookups;
            this.title = 'Delete User?';
            this.userRole = null;
            this.originalUser = null;
            this.userSelectedId = null;
            this.userSelectedId = controller.settings.userId;
            this.api.apiCall('user-role', this.userSelectedId, null)
                .then(function (user) {
                _this.userRole = user;
            });
            this.systemRoles = lookups.systemRoles;
        }
        DeleteDialog.prototype.activate = function (model) {
            this.userRole = model;
        };
        DeleteDialog.prototype.triggerDelete = function () {
            var _this = this;
            this.api.apiCall('delete-user', this.userSelectedId, null)
                .then(function () {
                _this.controller.ok(_this.userRole);
            });
        };
        DeleteDialog.prototype.cancel = function () {
            this.controller.cancel();
        };
        return DeleteDialog;
    }());
    DeleteDialog = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, lookups_1.Lookups),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, Object, lookups_1.Lookups])
    ], DeleteDialog);
    exports.DeleteDialog = DeleteDialog;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user-info/user-info',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-event-aggregator", "../api/web-api-users"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_event_aggregator_1, web_api_users_1) {
    "use strict";
    var UserInfo = (function () {
        function UserInfo(api, ea) {
            this.api = api;
            this.ea = ea;
            this.firstName = "";
            this.lastName = "";
            this.emailAddress = "";
            this.city = "";
            this.country = "";
            this.user = null;
            this.info = null;
            this.editType = null;
            this.originalUser = null;
        }
        UserInfo.prototype.created = function (params, routeConfig) {
            console.log('activateeeeeeeeeee: ' + params.id + ' (' + params.editType + ')');
        };
        return UserInfo;
    }());
    UserInfo = __decorate([
        aurelia_framework_2.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator),
        aurelia_framework_1.noView,
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
    ], UserInfo);
    exports.UserInfo = UserInfo;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dialog-demo/info-dialog',["require", "exports", "aurelia-framework", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_dialog_1) {
    "use strict";
    var InfoDialog = (function () {
        function InfoDialog(controller) {
            this.controller = controller;
        }
        InfoDialog.prototype.yes = function () {
            this.controller.ok(this.info);
        };
        InfoDialog.prototype.no = function () {
            this.controller.cancel();
        };
        return InfoDialog;
    }());
    InfoDialog = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], InfoDialog);
    exports.InfoDialog = InfoDialog;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dialog-demo/dialog-demo',["require", "exports", "aurelia-framework", "aurelia-dialog", "../user-info/user-info", "./info-dialog"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, user_info_1, info_dialog_1) {
    "use strict";
    var DialogDemo = (function () {
        function DialogDemo(userInfo, dialogService) {
            this.userInfo = userInfo;
            this.dialogService = dialogService;
        }
        DialogDemo.prototype.open = function () {
            this.dialogService.open({
                viewModel: info_dialog_1.InfoDialog,
                model: this.userInfo
            }).then(function (response) {
                if (response.wasCancelled) {
                    console.log("The information is invalid");
                }
                else {
                    console.log("The information is valid");
                }
            });
        };
        return DialogDemo;
    }());
    DialogDemo = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [user_info_1.UserInfo, aurelia_dialog_1.DialogService])
    ], DialogDemo);
    exports.DialogDemo = DialogDemo;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dialog-demo/roles-dialog',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../api/web-api-users", "../resources/lookups"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, web_api_users_1, lookups_1) {
    "use strict";
    var RolesDialog = (function () {
        function RolesDialog(controller, api, ea, model, lookups) {
            var _this = this;
            this.controller = controller;
            this.api = api;
            this.ea = ea;
            this.model = model;
            this.title = 'Change User Roles';
            this.userRole = {};
            this.originalUser = null;
            this.userSelectedId = null;
            this.userSelectedId = controller.settings.userId;
            this.api.apiCall('user-role', this.userSelectedId, null)
                .then(function (user) {
                _this.userRole = user;
                _this.systemRoles = lookups.systemRoles;
                _this.userId = _this.userRole['id'];
                _this.uniqueId = _this.userRole['loginName'];
                _this.select_isMemberInit = _this.userRole['isMember'];
                _this.select_systemRoleInit = _this.userRole['systemRoles'] ? _this.userRole['systemRoles'].value : null;
                _this.select_isMember = _this.select_isMemberInit;
                _this.select_systemRole = _this.select_systemRoleInit;
                console.log('RolesDialog > userRole: ' + JSON.stringify(_this.userRole));
            });
        }
        RolesDialog.prototype.activate = function () {
        };
        Object.defineProperty(RolesDialog.prototype, "hasChanged", {
            get: function () {
                return (this.select_isMember != this.select_isMemberInit) || (this.select_systemRole != this.select_systemRoleInit);
            },
            enumerable: true,
            configurable: true
        });
        RolesDialog.prototype.updateUserRole = function (getSelected_isMember, getSelected_systemRole) {
            var _this = this;
            var tmpData = { isMember: getSelected_isMember, systemRolesValue: getSelected_systemRole };
            console.log('addUser() -> save-user-role: (' + this.userId + ') -> ' + JSON.stringify(tmpData));
            this.api.apiCall('save-user-role', this.userId, tmpData)
                .then(function () {
                _this.controller.ok(tmpData);
                console.log('UPDATE USER ROLE: ' + JSON.stringify(tmpData));
            });
        };
        RolesDialog.prototype.cancel = function () {
            this.controller.cancel();
        };
        return RolesDialog;
    }());
    RolesDialog = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, lookups_1.Lookups),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, Object, lookups_1.Lookups])
    ], RolesDialog);
    exports.RolesDialog = RolesDialog;
});

define('resources/functions',["require", "exports"], function (require, exports) {
    "use strict";
    function toUpperCase(str) { return str.toUpperCase(); }
    exports.toUpperCase = toUpperCase;
    function toLowerCase(str) { return str.toLowerCase(); }
    exports.toLowerCase = toLowerCase;
});

define('resources/globals',["require", "exports"], function (require, exports) {
    "use strict";
    var Configuration = (function () {
        function Configuration() {
            this.gDelay = 2000;
            this.gDelay2 = 1100;
            this.gCurrency = '£';
            this.gCurrencyFormat = '(0,0.00)';
            this.gDateFormat = 'MMMM Mo YYYY';
        }
        return Configuration;
    }());
    exports.Configuration = Configuration;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/select2',["require", "exports", "aurelia-framework", "jquery", "select2"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Select2CustomAttribute = (function () {
        function Select2CustomAttribute(element) {
            this.element = element;
        }
        Select2CustomAttribute.prototype.attached = function () {
            var _this = this;
            $(this.element).select2(this.value).on('change', function (evt) {
                if (evt.originalEvent) {
                    return;
                }
                _this.element.dispatchEvent(new Event('change'));
            });
        };
        Select2CustomAttribute.prototype.detached = function () {
            $(this.element).select2('destroy');
        };
        return Select2CustomAttribute;
    }());
    Select2CustomAttribute = __decorate([
        aurelia_framework_1.customAttribute('select2'),
        aurelia_framework_1.inject(aurelia_framework_1.DOM.Element),
        __metadata("design:paramtypes", [Object])
    ], Select2CustomAttribute);
    exports.Select2CustomAttribute = Select2CustomAttribute;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user-info/set-info',["require", "exports", "aurelia-framework", "./user-info"], function (require, exports, aurelia_framework_1, user_info_1) {
    "use strict";
    var SetInfo = (function () {
        function SetInfo(userInfo) {
            this.userInfo = userInfo;
            this.firstName = this.userInfo.firstName;
            this.lastName = this.userInfo.lastName;
            this.emailAddress = this.userInfo.emailAddress;
            this.country = this.userInfo.country;
            this.city = this.userInfo.city;
        }
        SetInfo.prototype.save = function () {
            this.userInfo.firstName = this.firstName;
            this.userInfo.lastName = this.lastName;
            this.userInfo.emailAddress = this.emailAddress;
            this.userInfo.city = this.city;
            this.userInfo.country = this.country;
        };
        return SetInfo;
    }());
    SetInfo = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [user_info_1.UserInfo])
    ], SetInfo);
    exports.SetInfo = SetInfo;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user-info/user-info-role',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../api/web-api-users"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_users_1) {
    "use strict";
    var UserInfoRole = (function () {
        function UserInfoRole(api, ea) {
            this.api = api;
            this.ea = ea;
            this.userArr = null;
            this.firstName = "";
            this.lastName = "";
            this.emailAddress = "";
            this.city = "";
            this.country = "";
            this.user = null;
            this.info = null;
            this.editType = null;
            this.originalUser = null;
        }
        return UserInfoRole;
    }());
    UserInfoRole = __decorate([
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator),
        aurelia_framework_1.noView,
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
    ], UserInfoRole);
    exports.UserInfoRole = UserInfoRole;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user-info/view-info',["require", "exports", "aurelia-framework", "./user-info"], function (require, exports, aurelia_framework_1, user_info_1) {
    "use strict";
    var ViewInfo = (function () {
        function ViewInfo(userInfo) {
            this.userInfo = userInfo;
        }
        return ViewInfo;
    }());
    ViewInfo = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [user_info_1.UserInfo])
    ], ViewInfo);
    exports.ViewInfo = ViewInfo;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('_excess-ref/user-panel-twic',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var UserPanelTwic = (function () {
        function UserPanelTwic() {
        }
        return UserPanelTwic;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelTwic.prototype, "user", void 0);
    exports.UserPanelTwic = UserPanelTwic;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/loading-indicator',["require", "exports", "nprogress", "aurelia-framework"], function (require, exports, nprogress, aurelia_framework_1) {
    "use strict";
    var LoadingIndicator = (function () {
        function LoadingIndicator() {
            this.loading = false;
        }
        LoadingIndicator.prototype.loadingChanged = function (newValue) {
            if (newValue) {
                nprogress.start();
            }
            else {
                nprogress.done();
            }
        };
        return LoadingIndicator;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], LoadingIndicator.prototype, "loading", void 0);
    LoadingIndicator = __decorate([
        aurelia_framework_1.noView(['nprogress/nprogress.css'])
    ], LoadingIndicator);
    exports.LoadingIndicator = LoadingIndicator;
});

define('resources/format/blob-to-url',["require", "exports"], function (require, exports) {
    "use strict";
    var BlobToUrlValueConverter = (function () {
        function BlobToUrlValueConverter() {
        }
        BlobToUrlValueConverter.prototype.toView = function (blob) {
            return URL.createObjectURL(blob);
        };
        return BlobToUrlValueConverter;
    }());
    exports.BlobToUrlValueConverter = BlobToUrlValueConverter;
});

define('resources/format/file-list-to-array',["require", "exports"], function (require, exports) {
    "use strict";
    var FileListToArrayValueConverter = (function () {
        function FileListToArrayValueConverter() {
        }
        FileListToArrayValueConverter.prototype.toView = function (fileList) {
            var files = [];
            if (!fileList) {
                return files;
            }
            for (var i = 0; i < fileList.length; i++) {
                files.push(fileList.item(i));
            }
            return files;
        };
        return FileListToArrayValueConverter;
    }());
    exports.FileListToArrayValueConverter = FileListToArrayValueConverter;
});

define('resources/format/format-date',["require", "exports", "moment", "../constants"], function (require, exports, moment, Constants) {
    "use strict";
    var CV = Constants;
    var FormatDateValueConverter = (function () {
        function FormatDateValueConverter() {
            this.CV = CV;
            this.gDateFormat = CV.FORMAT_DATE;
            console.log('moment: ' + this.message);
        }
        FormatDateValueConverter.prototype.toView = function (value, format) {
            if (format == 'db')
                format = 'yyyy/dd/mm';
            console.log('DateFormatValueConverter: ' + value + ' / ' + this.gDateFormat + ' / ' + format);
            return value ? moment(value, 'YYYY-MM-DD HH:mm').format(format ? format : this.gDateFormat) : '---';
        };
        return FormatDateValueConverter;
    }());
    exports.FormatDateValueConverter = FormatDateValueConverter;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/format/json',["require", "exports", "aurelia-framework", "aurelia-binding", "aurelia-templating-resources"], function (require, exports, aurelia_framework_1, aurelia_binding_1, aurelia_templating_resources_1) {
    "use strict";
    var JsonValueConverter = (function () {
        function JsonValueConverter() {
        }
        JsonValueConverter.prototype.toView = function (value) {
            return JSON.stringify(value, null, "  ");
        };
        return JsonValueConverter;
    }());
    exports.JsonValueConverter = JsonValueConverter;
    var JsonBindingBehavior = (function () {
        function JsonBindingBehavior(signaler, signalBindingBehavior) {
            this.signaler = signaler;
            this.signalBindingBehavior = signalBindingBehavior;
        }
        JsonBindingBehavior.prototype.bind = function (binding, scope) {
            var _this = this;
            this.signalBindingBehavior.bind(binding, scope, 'update-json');
            var sourceExpression = binding.sourceExpression;
            if (sourceExpression.rewritten) {
                return;
            }
            sourceExpression.rewritten = true;
            var expression = sourceExpression.expression;
            sourceExpression.expression = new aurelia_binding_1.ValueConverter(expression, 'json', sourceExpression.args, [expression].concat(sourceExpression.args));
            this.interval = window.setInterval(function () { return _this.signaler.signal('update-json'); }, 150);
        };
        JsonBindingBehavior.prototype.unbind = function (binding, scope) {
            window.clearInterval(this.interval);
            this.signalBindingBehavior.unbind(binding, scope);
        };
        return JsonBindingBehavior;
    }());
    JsonBindingBehavior = __decorate([
        aurelia_framework_1.inject(aurelia_templating_resources_1.BindingSignaler, aurelia_templating_resources_1.SignalBindingBehavior),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonBindingBehavior);
    exports.JsonBindingBehavior = JsonBindingBehavior;
});

define('views/pages/login',["require", "exports"], function (require, exports) {
    "use strict";
    var Login = (function () {
        function Login() {
            this.title = 'Login';
        }
        return Login;
    }());
    exports.Login = Login;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/pages/user-add',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "aurelia-event-aggregator", "../../api/web-api-users", "../../resources/constants", "../../my-globals", "../../my-nav"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, aurelia_event_aggregator_1, web_api_users_1, Constants, my_globals_1, my_nav_1) {
    "use strict";
    var CV = Constants;
    var UserAdd = (function () {
        function UserAdd(api, ea, http, myGlobals, myNav) {
            this.api = api;
            this.ea = ea;
            this.CV = CV;
            this.isReadOnly = null;
            this.title = 'Edit User';
            this.title_isReadOnly = 'View User';
            this.api = api;
            this.myGlobals = my_globals_1.MyGlobals;
            this.myNav = myNav;
            this.currentUser = this.myGlobals.currentUser;
        }
        UserAdd.prototype.attached = function () {
        };
        Object.defineProperty(UserAdd.prototype, "canSave", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        UserAdd.prototype.save = function () {
            var _this = this;
            console.log('SAVE... user (' + this.myGlobals.userSelected.id + ')...' + this.api + ' hubId  ' + this.myGlobals.profileSelected.hubId);
            this.isSavingData = true;
            return this.api.apiCall('save-user', this.myGlobals.userSelected.id, this.myGlobals.profileSelected)
                .then(function (savedData) { return _this.savedData = savedData; })
                .then(function (profile) {
                console.log('SUCCESSFULLY saved user: ' + JSON.stringify(_this.myGlobals.profileSelected));
                _this.isSavingData = false;
            });
        };
        return UserAdd;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserAdd.prototype, "isReadOnly", void 0);
    UserAdd = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, aurelia_fetch_client_1.HttpClient, my_globals_1.MyGlobals, my_nav_1.MyNav])
    ], UserAdd);
    exports.UserAdd = UserAdd;
});

define('views/pages/user-no-selection',["require", "exports"], function (require, exports) {
    "use strict";
    var UserNoSelection = (function () {
        function UserNoSelection() {
            this.title = "";
        }
        return UserNoSelection;
    }());
    exports.UserNoSelection = UserNoSelection;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/pages/user-selected',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../api/web-api-users", "../../resources/constants", "../../my-globals", "kendo-ui-core/js/kendo.datepicker"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_users_1, Constants, my_globals_1) {
    "use strict";
    var CV = Constants;
    var UserSelected = (function () {
        function UserSelected(api, ea) {
            this.api = api;
            this.ea = ea;
            this.CV = CV;
            this.profile = {};
            this.pageType = null;
            this.isReadOnly = null;
            this.title = '';
            this.accessDenied = null;
            this.myGlobals = my_globals_1.MyGlobals;
        }
        UserSelected.prototype.canActivate = function (params, routeConfig) {
            var _this = this;
            this.routeConfig = routeConfig;
            console.log('activate: ' + params.id + ' (' + params.pageType + '), readonly: ' + params.isReadOnly);
            if (this.myGlobals.currentUser && (params.id == this.myGlobals.currentUser.id || this.myGlobals.currentUser.isReader)) {
                this.user = null;
                this.myGlobals.userSelected = null;
                this.myGlobals.myLookups = null;
                this.myGlobals.profileSelected = null;
                return this.api.apiCall('user-selected', params.id, null)
                    .then(function (user) {
                    _this.accessDenied = false;
                    _this.pageType = params.pageType == 'edit' ? 'edit' : 'read';
                    _this.isReadOnly = _this.pageType == 'read' ? true : false;
                    _this.user = user;
                    _this.myGlobals.userSelected = _this.user['user'];
                    if (_this.user['profile']) {
                        _this.profile = {
                            regionId: _this.user['profile']['region'] ? _this.user['profile']['region'].id : null,
                            hubId: _this.user['profile']['hub'] ? _this.user['profile']['hub'].id : null,
                            segmentId: _this.user['profile']['segment'] ? _this.user['profile']['segment'].id : null,
                            entityId: _this.user['profile']['entity'] ? _this.user['profile']['entity'].id : null,
                            primaryPositionId: _this.user['profile']['primaryPosition'] ? _this.user['profile']['primaryPosition'].id : null,
                            secondaryPosition: _this.user['profile']['secondaryPosition'] ? _this.user['profile']['secondaryPosition'].id : null,
                            officeId: _this.user['profile']['office'] ? _this.user['profile']['office'].id : null,
                            function: _this.user['profile']['function'] ? _this.user['profile']['function'] : null,
                            location: _this.user['profile']['location'] ? _this.user['profile']['location'] : null,
                            businessNumber: _this.user['profile']['businessNumber'] ? _this.user['profile']['businessNumber'] : null,
                            personalNumber: _this.user['profile']['personalNumber'] ? _this.user['profile']['personalNumber'] : null,
                            officeNumber: _this.user['profile']['officeNumber'] ? _this.user['profile']['officeNumber'] : null,
                            lyncNumber: _this.user['profile']['lyncNumber'] ? _this.user['profile']['lyncNumber'] : null,
                            homeNumber: _this.user['profile']['homeNumber'] ? _this.user['profile']['homeNumber'] : null,
                            emergencyContactName: _this.user['profile']['emergencyContactName'] ? _this.user['profile']['emergencyContactName'] : null,
                            emergencyContactNumber: _this.user['profile']['emergencyContactNumber'] ? _this.user['profile']['emergencyContactNumber'] : null,
                            coatSizeId: _this.user['profile']['coatSize'] ? _this.user['profile']['coatSize'].id : null,
                            confidentialData: _this.user['profile']['confidentialData'] ? {
                                memberSince: _this.user['profile']['confidentialData'].memberSince ? _this.user['profile']['confidentialData'].memberSince : null,
                                employmentStatusValue: _this.user['profile']['confidentialData']['employmentStatus'] ? _this.user['profile']['confidentialData']['employmentStatus'].value : null,
                                credentialLevelValue: _this.user['profile']['confidentialData']['credentialLevel'] ? _this.user['profile']['confidentialData']['credentialLevel'].value : null,
                                field1: _this.user['profile']['confidentialData'].field1 ? _this.user['profile']['confidentialData'].field1 : null,
                                field2: _this.user['profile']['confidentialData'].field2 ? _this.user['profile']['confidentialData'].field2 : null
                            } : null,
                            languages: _this.user['profile']['languages'] ? [] : null,
                            passports: _this.user['profile']['passports'] ? [] : null,
                            visas: _this.user['profile']['visas'] ? [] : null,
                            trainings: _this.user['profile']['trainings'] ? [] : null
                        };
                        var i = 0;
                        if (_this.user['profile']['languages'].length) {
                            for (i = 0; i < _this.user['profile']['languages'].length; i++) {
                                var tmpLevel = !_this.user['profile']['languages'][i].proficiency ? null : _this.user['profile']['languages'][i].proficiency.value;
                                _this.profile['languages'].push({ languageId: _this.user['profile']['languages'][i].language.id, proficiencyValue: tmpLevel });
                            }
                        }
                        if (_this.user['profile']['passports'].length) {
                            for (i = 0; i < _this.user['profile']['passports'].length; i++) {
                                var tmpCountry = !_this.user['profile']['passports'][i].country ? null : _this.user['profile']['passports'][i].country.id;
                                var tmpType = !_this.user['profile']['passports'][i].type ? null : _this.user['profile']['passports'][i].type.value;
                                _this.profile['passports'].push({
                                    countryId: tmpCountry,
                                    number: _this.user['profile']['passports'][i].number,
                                    typeValue: tmpType,
                                    expiresOn: _this.user['profile']['passports'][i].expiresOn
                                });
                            }
                        }
                        if (_this.user['profile']['visas'].length) {
                            for (i = 0; i < _this.user['profile']['visas'].length; i++) {
                                var tmpCountry = !_this.user['profile']['visas'][i].country ? null : _this.user['profile']['visas'][i].country.id;
                                var tmpType = !_this.user['profile']['visas'][i].type ? null : _this.user['profile']['visas'][i].type.value;
                                _this.profile['visas'].push({
                                    countryId: tmpCountry,
                                    typeValue: tmpType,
                                    multipleEntry: _this.user['profile']['visas'][i].multipleEntry,
                                    expiresOn: _this.user['profile']['visas'][i].expiresOn
                                });
                            }
                        }
                        if (_this.user['profile']['trainings'].length) {
                            for (i = 0; i < _this.user['profile']['trainings'].length; i++) {
                                var tmpTraining = !_this.user['profile']['trainings'][i].training ? null : _this.user['profile']['trainings'][i].training.id;
                                _this.profile['trainings'].push({
                                    trainingId: tmpTraining,
                                    expiresOn: _this.user['profile']['trainings'][i].expiresOn
                                });
                            }
                        }
                        _this.myGlobals.myLookups = _this.user['lookups'];
                        _this.myGlobals.profileSelected = _this.profile;
                    }
                    _this.routeConfig.navModel.setTitle(_this.user['user'].firstName);
                });
            }
            else {
                this.accessDenied = true;
            }
        };
        UserSelected.prototype.canDeactivate = function () {
        };
        Object.defineProperty(UserSelected.prototype, "canSave", {
            get: function () {
                return this.profile['regionId'] && this.profile['hubId'] && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        return UserSelected;
    }());
    UserSelected = __decorate([
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
    ], UserSelected);
    exports.UserSelected = UserSelected;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/pages/welcome',["require", "exports", "aurelia-framework", "../../resources/constants", "../../api/web-api-users", "../../my-globals", "../../my-nav"], function (require, exports, aurelia_framework_1, Constants, web_api_users_1, my_globals_1, my_nav_1) {
    "use strict";
    var CV = Constants;
    var Welcome = (function () {
        function Welcome(api, myGlobals, myNav) {
            this.api = api;
            this.CV = CV;
            this.title = 'Welcome to MRT';
            this.message = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
            this.title_isMember = 'Welcome to MRT';
            this.message_isMember = '<p>Lorem ipsum dolor sit amet, utamur prodesset no nec. Duis nihil menandri nec ad, vim animal appareat ex.</p>';
            this.myGlobals = my_globals_1.MyGlobals;
            this.myNav = myNav;
        }
        Welcome.prototype.activate = function () {
            var _this = this;
            return this.api.apiCall('welcome', null, null)
                .then(function (pageData) {
                _this.imgSrc_splash = 'src/img/MRT_Letterhead.png';
                _this.pageData = pageData;
            });
        };
        return Welcome;
    }());
    Welcome = __decorate([
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, my_globals_1.MyGlobals, my_nav_1.MyNav),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, my_globals_1.MyGlobals, my_nav_1.MyNav])
    ], Welcome);
    exports.Welcome = Welcome;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/ui/nav-bar',["require", "exports", "aurelia-framework", "../../my-globals", "../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, Constants) {
    "use strict";
    var CV = Constants;
    var NavBar = (function () {
        function NavBar(myGlobals) {
            this.router = null;
            this.CV = CV;
            this.myGlobals = my_globals_1.MyGlobals;
        }
        NavBar.prototype.hasAccess = function (getUser, getPage) {
            console.log('hasAccess: ' + JSON.stringify(getUser) + ' / ' + JSON.stringify(getPage.settings));
            if (!getUser)
                return false;
            if (getPage.settings && (!getUser.isReader && getPage.settings.isReaderOnly))
                return false;
            return true;
        };
        NavBar.prototype.attached = function () {
        };
        Object.defineProperty(NavBar.prototype, "routeName", {
            get: function () {
                if (this.router.currentInstruction !== null)
                    return this.router.currentInstruction.config.name;
            },
            enumerable: true,
            configurable: true
        });
        NavBar.prototype.getRoute = function () {
            return this.router.currentInstruction.config.name;
        };
        return NavBar;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], NavBar.prototype, "router", void 0);
    __decorate([
        aurelia_framework_1.computedFrom('router.currentInstruction'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], NavBar.prototype, "routeName", null);
    NavBar = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], NavBar);
    exports.NavBar = NavBar;
});

define('views/ui/ui-footer',["require", "exports", "../../resources/constants"], function (require, exports, Constants) {
    "use strict";
    var CV = Constants;
    var UiFooter = (function () {
        function UiFooter() {
            this.CV = CV;
        }
        return UiFooter;
    }());
    exports.UiFooter = UiFooter;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/ui/ui-header',["require", "exports", "aurelia-framework", "../../my-globals", "../../my-nav", "../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, my_nav_1, Constants) {
    "use strict";
    var CV = Constants;
    var UiHeader = (function () {
        function UiHeader(myGlobals, myNav) {
            this.CV = CV;
            this.myGlobals = my_globals_1.MyGlobals;
            this.myNav = myNav;
        }
        UiHeader.prototype.created = function () {
            this.imgSrc_logo = 'src/css/bp-logo.jpg';
            this.imgSrc_strapline = 'src/img/MRT_Identifier_V1b.png';
        };
        return UiHeader;
    }());
    UiHeader = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals, my_nav_1.MyNav),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals, my_nav_1.MyNav])
    ], UiHeader);
    exports.UiHeader = UiHeader;
});

define('views/ui/ui-loading',["require", "exports"], function (require, exports) {
    "use strict";
    var UiLoading = (function () {
        function UiLoading() {
        }
        return UiLoading;
    }());
    exports.UiLoading = UiLoading;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/btn-xc-all',["require", "exports", "aurelia-framework", "../../resources/constants", "bootstrap"], function (require, exports, aurelia_framework_1, Constants, $) {
    "use strict";
    var CV = Constants;
    var BtnXcAll = (function () {
        function BtnXcAll() {
            this.CV = CV;
            this.wrapperId = null;
        }
        BtnXcAll.prototype.xc_all = function (getState) {
            if (CV.debugConsoleLog)
                console.log('xc_all: ' + getState);
            if (getState == 'expand') {
                $('#' + this.wrapperId + ' .panel-body.collapse:not(".in")').collapse('show');
            }
            if (getState == 'collapse') {
                $('#' + this.wrapperId + ' .panel-body.collapse.in').collapse('hide');
            }
        };
        return BtnXcAll;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], BtnXcAll.prototype, "wrapperId", void 0);
    exports.BtnXcAll = BtnXcAll;
});

define('views/widgets/filter',["require", "exports"], function (require, exports) {
    "use strict";
    var FilterValueConverter = (function () {
        function FilterValueConverter() {
        }
        FilterValueConverter.prototype.toView = function (array, propertyName, filter_on) {
            console.log('FilterValueConverter: ' + JSON.stringify(propertyName));
            return array.filter(function (i) { return i[propertyName] == filter_on; });
        };
        return FilterValueConverter;
    }());
    exports.FilterValueConverter = FilterValueConverter;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/form-user-full-body',["require", "exports", "aurelia-framework", "../../resources/constants", "../../my-globals"], function (require, exports, aurelia_framework_1, Constants, my_globals_1) {
    "use strict";
    var CV = Constants;
    var FormUserFullBody = (function () {
        function FormUserFullBody(myGlobals) {
            this.CV = CV;
            this.isReadOnly = null;
            this.custIcon = null;
            this.custBody = null;
            this.custClass = null;
            this.custTitle = null;
            this.custXc = null;
            this.custXcId = null;
            this.custXcExpanded = null;
            this.custXcResClass = null;
            this.myGlobals = my_globals_1.MyGlobals;
        }
        return FormUserFullBody;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "isReadOnly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custIcon", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custBody", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custClass", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custTitle", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custXc", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custXcId", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custXcExpanded", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "custXcResClass", void 0);
    FormUserFullBody = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], FormUserFullBody);
    exports.FormUserFullBody = FormUserFullBody;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/list-activity',["require", "exports", "aurelia-framework", "../../api/web-api-users", "../../my-nav"], function (require, exports, aurelia_framework_1, web_api_users_1, my_nav_1) {
    "use strict";
    var listActivity = (function () {
        function listActivity(api, myNav) {
            this.api = api;
            this.custXc = true;
            this.custXcId = 'activityList';
            this.custXcExpanded = false;
            this.filters = [
                { value: '', keys: ['displayName', 'emailAddress'] },
                { value: 'true', keys: ['isMember'] },
                { value: '', keys: ['isActive'] }
            ];
            this.myNav = myNav;
        }
        return listActivity;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "title", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "custXc", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "custXcId", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "custXcExpanded", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "currentUser", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], listActivity.prototype, "apiData", void 0);
    listActivity = __decorate([
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, my_nav_1.MyNav),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, my_nav_1.MyNav])
    ], listActivity);
    exports.listActivity = listActivity;
});

define('views/widgets/panel-denied-access',["require", "exports"], function (require, exports) {
    "use strict";
    var PanelDeniedAccess = (function () {
        function PanelDeniedAccess() {
        }
        return PanelDeniedAccess;
    }());
    exports.PanelDeniedAccess = PanelDeniedAccess;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/profile-brief',["require", "exports", "aurelia-framework", "../../my-globals", "../../my-nav"], function (require, exports, aurelia_framework_1, my_globals_1, my_nav_1) {
    "use strict";
    var ProfileBrief = (function () {
        function ProfileBrief(myGlobals, myNav) {
            this.title = 'My Profile';
            this.custXc = false;
            this.custXcId = 'profileBriefList';
            this.custXcExpanded = true;
            this.myGlobals = myGlobals;
            this.myNav = myNav;
        }
        ProfileBrief.prototype.created = function () {
        };
        return ProfileBrief;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ProfileBrief.prototype, "custXc", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ProfileBrief.prototype, "custXcId", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ProfileBrief.prototype, "custXcExpanded", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ProfileBrief.prototype, "currentUser", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ProfileBrief.prototype, "memberArr", void 0);
    ProfileBrief = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(my_globals_1.MyGlobals, my_nav_1.MyNav),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals, my_nav_1.MyNav])
    ], ProfileBrief);
    exports.ProfileBrief = ProfileBrief;
});

define('views/widgets/prompt',["require", "exports"], function (require, exports) {
    "use strict";
    var Prompt = (function () {
        function Prompt() {
        }
        return Prompt;
    }());
    exports.Prompt = Prompt;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-edit',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-event-aggregator", "../../api/web-api-users"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_event_aggregator_1, web_api_users_1) {
    "use strict";
    var UserEdit = (function () {
        function UserEdit(api, ea) {
            this.api = api;
            this.ea = ea;
            this.user = null;
            this.title = 'Edit';
            this.editUser = [];
            this.editUserVals = [];
        }
        UserEdit.prototype.created = function () {
            console.log('created: ' + this.user);
            this.originalUser = JSON.parse(JSON.stringify(this.user));
        };
        return UserEdit;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserEdit.prototype, "user", void 0);
    UserEdit = __decorate([
        aurelia_framework_2.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
    ], UserEdit);
    exports.UserEdit = UserEdit;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-list',["require", "exports", "aurelia-event-aggregator", "../../api/web-api-users", "aurelia-framework", "../../resources/constants", "aurelia-dialog", "../../user-info/user-info", "../../dialog-demo/roles-dialog", "../../dialog-demo/add-user-dialog", "../../dialog-demo/delete-user-dialog", "../../resources/lookups", "../../my-globals", "../../my-nav"], function (require, exports, aurelia_event_aggregator_1, web_api_users_1, aurelia_framework_1, Constants, aurelia_dialog_1, user_info_1, roles_dialog_1, add_user_dialog_1, delete_user_dialog_1, lookups_1, my_globals_1, my_nav_1) {
    "use strict";
    var CV = Constants;
    var UserList = (function () {
        function UserList(api, ea, userInfo, dialogService, lookups, myNav, myGlobals) {
            this.api = api;
            this.userInfo = userInfo;
            this.dialogService = dialogService;
            this.lookups = lookups;
            this.custHideTitleBar = false;
            this.custTablePagination = false;
            this.custTablePageSize = 100;
            this.custXc = false;
            this.custXcId = '';
            this.custXcExpanded = true;
            this.CV = CV;
            this.selectedId = 0;
            this.title = 'Users';
            this.rolesArrDynamic = [];
            this.checkedItemsArr = [];
            this.filters_ro = [
                { value: '', keys: ['loginName', 'firstName', 'lastName', 'emailAddress', 'personalNumber'] },
                { value: 'true', keys: ['isMember'] },
                { value: 'true', keys: ['isActive'] }
            ];
            this.lookups = lookups;
            this.isAllChecked = false;
            this.myNav = myNav;
            this.myGlobals = myGlobals;
        }
        UserList.prototype.isNotDisabled = function (getField) {
            if (CV.debugConsoleLog)
                console.log('isNotDisabled? ' + getField);
            if (!this.custDisableCells)
                return true;
            if (this.custDisableCells.indexOf(getField) == -1)
                return true;
            return false;
        };
        UserList.prototype.activate = function () {
            alert('this.myGlobals 2.2: ' + JSON.stringify(this.myGlobals));
            if (CV.debugConsoleLog)
                console.log('created: ' + this.title + ' / ' + this.custTitle);
            if (this.custTitle)
                this.title = this.custTitle;
        };
        UserList.prototype.attached = function () {
            if (this.currentUser) {
                var tmpData = this.currentUser.isEditor ? {} : { active: true };
                this.loadUserList(tmpData);
            }
        };
        UserList.prototype.deleteMultiple = function () {
            this.api.apiCall('delete-multiple-users', null, this.checkedItemsArr);
        };
        UserList.prototype.checkMe = function (getId) {
            if (this.checkedItemsArr.indexOf(getId) == -1) {
                this.checkedItemsArr.push(getId);
            }
            else {
                var index = this.checkedItemsArr.indexOf(getId);
                this.checkedItemsArr.splice(index, 1);
                if (this.checkedItemsArr.length == 0)
                    this.isAllChecked = false;
            }
        };
        UserList.prototype.checkAll = function () {
            var _this = this;
            this.users['data'].forEach(function (i) {
                i.checked = _this.isAllChecked,
                    _this.checkedItemsArr.push(i.id);
            });
            if (!this.isAllChecked)
                this.checkedItemsArr = [];
        };
        UserList.prototype.loadUserList_prep = function () {
            var data = {};
            if (this.searchFor_active)
                data['active'] = this.searchFor_active;
            if (this.searchFor_name)
                data['name'] = this.searchFor_name;
            if (this.searchFor_userTypeValue)
                data['userTypeValue'] = this.searchFor_userTypeValue;
            this.loadUserList(data);
        };
        UserList.prototype.loadUserList = function (data) {
            var _this = this;
            this.api.apiCall('user-list', null, data)
                .then(function (users) { return _this.users = users; })
                .then(function () { return _this.populateRoleFilterFromList(); });
        };
        UserList.prototype.select = function (user) {
            this.selectedId = user.id;
            return true;
        };
        UserList.prototype.addUser = function () {
            this.dialogService.open({
                viewModel: add_user_dialog_1.AddUserDialog,
                model: this.userInfo
            }).then(function (response) {
                if (response.wasCancelled) {
                    console.log("The information is invalid");
                }
                else {
                    console.log("The information is valid");
                }
            });
        };
        UserList.prototype.changeUserRoles = function (id) {
            this.dialogService.open({
                userId: id,
                viewModel: roles_dialog_1.RolesDialog,
                model: this.userInfo
            }).then(function (response) {
                if (response.wasCancelled) {
                    console.log("The information is invalid");
                }
                else {
                    console.log("The information is valid");
                }
            });
        };
        UserList.prototype.deleteUser = function (id) {
            this.dialogService.open({
                userId: id,
                viewModel: delete_user_dialog_1.DeleteDialog,
                model: this.userInfo
            }).then(function (response) {
                if (response.wasCancelled) {
                    console.log("The information is invalid");
                }
                else {
                    console.log("The information is valid");
                }
            });
        };
        UserList.prototype.returnLabelFromValue = function (getId) {
            if (getId)
                return this.rolesArr.filter(function (x) { return x.value == getId; })[0].name;
            return '';
        };
        UserList.prototype.populateRoleFilterFromList = function () {
            var tmp_rolesArrValues = [];
            this.rolesArrDynamic = [];
            for (var _i = 0, _a = this.users.data; _i < _a.length; _i++) {
                var next = _a[_i];
                var nextRole = next.systemRoles;
                if (nextRole && tmp_rolesArrValues.indexOf(nextRole) === -1) {
                    tmp_rolesArrValues.push(nextRole);
                    var nextLabel = nextRole;
                    this.rolesArrDynamic.push({ "value": nextRole, "name": nextLabel });
                }
            }
        };
        return UserList;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTitle", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custDisableCells", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custHideTitleBar", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTablePagination", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTablePageSize", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custXc", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custXcId", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custXcExpanded", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "currentUser", void 0);
    UserList = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, lookups_1.Lookups, my_globals_1.MyGlobals, my_nav_1.MyNav),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, user_info_1.UserInfo, aurelia_dialog_1.DialogService, lookups_1.Lookups, my_nav_1.MyNav, my_globals_1.MyGlobals])
    ], UserList);
    exports.UserList = UserList;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/cust-span/span-cust-active-status',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var SpanCustActiveStatus = (function () {
        function SpanCustActiveStatus() {
        }
        return SpanCustActiveStatus;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustActiveStatus.prototype, "isActive", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustActiveStatus.prototype, "reviewPending", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustActiveStatus.prototype, "reviewResult", void 0);
    exports.SpanCustActiveStatus = SpanCustActiveStatus;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/cust-span/span-cust-member-status',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var SpanCustMemberStatus = (function () {
        function SpanCustMemberStatus() {
        }
        return SpanCustMemberStatus;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustMemberStatus.prototype, "isMember", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustMemberStatus.prototype, "profileDate", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SpanCustMemberStatus.prototype, "updatePending", void 0);
    exports.SpanCustMemberStatus = SpanCustMemberStatus;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-checkbox',["require", "exports", "aurelia-framework", "../../../resources/constants", "aurelia-binding"], function (require, exports, aurelia_framework_1, Constants, aurelia_binding_1) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine);
    aurelia_framework_1.inject(Element);
    var FormCheckbox = (function () {
        function FormCheckbox(model) {
            this.custLabel = null;
            this.custMandatory = null;
            this.custReadonly = null;
            this.inputOnly = false;
        }
        FormCheckbox.prototype.activate = function (model) {
        };
        FormCheckbox.prototype.changeCallback = function (evt) {
        };
        FormCheckbox.prototype.tmpCreateLabel = function (getStr) {
            return getStr.replace(/_/g, " ").toLowerCase();
        };
        FormCheckbox.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-checkbox] created: ' + this.model);
            if (!this.custLabel)
                this.custLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : this.custName;
        };
        return FormCheckbox;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "model", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "custMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "custReadonly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "custName", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inputOnly", void 0);
    exports.FormCheckbox = FormCheckbox;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-filter-role',["require", "exports", "aurelia-framework", "../../../resources/constants"], function (require, exports, aurelia_framework_1, Constants) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(Element);
    var FormFilterRole = (function () {
        function FormFilterRole(model) {
            this.custLabel = '';
            this.autocomplete = null;
            this.optionFilter = null;
            this.isEnabled = true;
            this.custPlaceholder = '> No Filter <';
            this.name = null;
            this.options = [];
            this.selectOptions = { allowClear: true, placeholder: 'Select...' };
            this.selectedValues = [];
            this.multipleSelectValues = ['z', 'y', 'x'];
        }
        FormFilterRole.prototype.activate = function (model) {
        };
        FormFilterRole.prototype.attached = function () {
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
            this.selected = this.initSelected != null ? this.initSelected : 0;
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
        };
        FormFilterRole.prototype.selectedChanged = function (newValue) {
            if (CV.debugConsoleLog)
                console.log('selectedChanged: ' + newValue + ' / ' + this.initSelected);
            this.changed = newValue != null ? newValue : this.initSelected;
            this.selected = this.changed;
        };
        FormFilterRole.prototype.tmpCreateLabel = function (getStr) {
            return getStr;
        };
        FormFilterRole.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-inputs] created: ' + this.name);
        };
        FormFilterRole.prototype.changeCallback = function (evt) {
        };
        return FormFilterRole;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "autocomplete", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "optionFilter", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "isEnabled", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", void 0)
    ], FormFilterRole.prototype, "initSelected", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], FormFilterRole.prototype, "options", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterRole.prototype, "model", void 0);
    FormFilterRole = __decorate([
        aurelia_framework_1.customElement('FormFilterRole'),
        __metadata("design:paramtypes", [Object])
    ], FormFilterRole);
    exports.FormFilterRole = FormFilterRole;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-filter-text',["require", "exports", "aurelia-framework", "../../../resources/constants", "aurelia-binding"], function (require, exports, aurelia_framework_1, Constants, aurelia_binding_1) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine);
    aurelia_framework_1.inject(Element);
    var FormFilterText = (function () {
        function FormFilterText(model) {
            this.custMandatory = null;
            this.custLabel = 'Text';
            this.name = null;
            this.value = null;
        }
        FormFilterText.prototype.activate = function (model) {
        };
        return FormFilterText;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterText.prototype, "custMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterText.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterText.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterText.prototype, "value", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormFilterText.prototype, "model", void 0);
    exports.FormFilterText = FormFilterText;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-input',["require", "exports", "aurelia-framework", "../../../resources/constants", "aurelia-binding"], function (require, exports, aurelia_framework_1, Constants, aurelia_binding_1) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine, Element);
    var FormInput = (function () {
        function FormInput(model) {
            this.maskPattern = null;
            this.maskPatternTelephone = '+ 999 / 999999';
            this.maskPatternTelephoneCc = '+ 999 / 999999';
            this.custType = "text";
            this.formatDate = null;
            this.custLabel = null;
            this.custPlaceholder = null;
            this.inpValue = null;
            this.inpValueTwoWay = null;
            this.custMandatory = null;
            this.isMemberOnly = null;
            this.isEnabled = true;
            this.custReadonly = false;
            this.name = null;
            this.value = null;
            this.inputOnly = false;
        }
        FormInput.prototype.activate = function (model, datePicker) {
        };
        FormInput.prototype.tmpCreateLabel = function (getStr) {
            return getStr.replace(/_/g, " ").toLowerCase();
        };
        FormInput.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-inputs] created: ' + this.model);
            if (!this.custLabel)
                this.custLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : this.custName;
            this.custPlaceholder = '';
            if (this.custReadonly)
                this.custMandatory = false;
        };
        return FormInput;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "maskPattern", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custType", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "formatDate", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inpValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inpValueTwoWay", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "isMemberOnly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "isEnabled", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custReadonly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "value", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inputOnly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "custName", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "model", void 0);
    exports.FormInput = FormInput;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-radio',["require", "exports", "aurelia-framework", "../../../resources/constants", "aurelia-binding"], function (require, exports, aurelia_framework_1, Constants, aurelia_binding_1) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine);
    aurelia_framework_1.inject(Element);
    var FormRadio = (function () {
        function FormRadio() {
            this.custType = "radio";
            this.name = null;
            this.custLabel = null;
            this.custPlaceholder = null;
            this.inpValue = null;
            this.custMandatory = null;
            this.inputOnly = false;
        }
        FormRadio.prototype.activate = function (model) {
        };
        FormRadio.prototype.changeCallback = function (evt) {
        };
        FormRadio.prototype.tmpCreateLabel = function (getStr) {
            return getStr.replace(/_/g, " ").toLowerCase();
        };
        FormRadio.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-radio] created: ' + this.model);
            if (!this.custLabel && this.name)
                this.custLabel = this.tmpCreateLabel(this.name);
            if (!this.custPlaceholder)
                this.custPlaceholder = "Enter " + this.custLabel;
        };
        return FormRadio;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "model", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "custType", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "custPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inpValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "custMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inputOnly", void 0);
    exports.FormRadio = FormRadio;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/inputs/form-select',["require", "exports", "aurelia-framework", "../../../resources/constants"], function (require, exports, aurelia_framework_1, Constants) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(Element);
    var FormSelect = (function () {
        function FormSelect(model) {
            this.autocomplete = null;
            this.optionFilter = null;
            this.isEnabled = true;
            this.custLabel = null;
            this.custPlaceholder = null;
            this.custMandatory = null;
            this.custReadonly = null;
            this.propArr = ['id', 'name'];
            this.options = [];
            this.inputOnly = false;
            this.selectOptions = { allowClear: true, placeholder: 'Select...' };
            this.selectedValues = [];
            this.multipleSelectValues = ['z', 'y', 'x'];
        }
        FormSelect.prototype.activate = function (model) {
        };
        FormSelect.prototype.attached = function () {
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
            this.selected = this.initSelected ? this.initSelected : null;
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
        };
        FormSelect.prototype.selectedChanged = function (newValue) {
            if (CV.debugConsoleLog)
                console.log('[form-select] selectedChanged: ' + newValue + ' / ' + this.initSelected);
            this.changed = newValue ? newValue : null;
            this.selected = this.changed;
        };
        FormSelect.prototype.tmpCreateLabel = function (getStr) {
            return getStr;
        };
        FormSelect.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-select] created: ' + this.custName);
            if (!this.custLabel)
                this.custLabel = CV.myLabels[this.custName] ? CV.myLabels[this.custName] : '______________' + this.custName;
            if (!this.custPlaceholder)
                this.custPlaceholder = "> Select " + this.custLabel + " <";
        };
        FormSelect.prototype.changeCallback = function (evt) {
            this.initSelected = this.initSelected <= 0 ? null : this.initSelected;
            console.log('[form-select] changeCallback: ' + this.initSelected);
        };
        return FormSelect;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "autocomplete", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "optionFilter", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "isEnabled", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "custLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "custPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "custMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "custReadonly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", void 0)
    ], FormSelect.prototype, "initSelected", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "propArr", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], FormSelect.prototype, "options", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "model", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "inputOnly", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "custName", void 0);
    FormSelect = __decorate([
        aurelia_framework_1.customElement('FormSelect'),
        __metadata("design:paramtypes", [Object])
    ], FormSelect);
    exports.FormSelect = FormSelect;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-confidential',["require", "exports", "aurelia-framework", "../../../my-globals"], function (require, exports, aurelia_framework_1, my_globals_1) {
    "use strict";
    var UserPanelConfidential = (function () {
        function UserPanelConfidential(myGlobals) {
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        return UserPanelConfidential;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelConfidential.prototype, "isReadOnly", void 0);
    UserPanelConfidential = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelConfidential);
    exports.UserPanelConfidential = UserPanelConfidential;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-details',["require", "exports", "aurelia-framework", "../../../my-globals", "../../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, Constants) {
    "use strict";
    var CV = Constants;
    var UserPanelDetails = (function () {
        function UserPanelDetails(myGlobals) {
            this.CV = CV;
            this.tmpShowLookupsDebug = false;
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        return UserPanelDetails;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelDetails.prototype, "isReadOnly", void 0);
    UserPanelDetails = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelDetails);
    exports.UserPanelDetails = UserPanelDetails;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-languages',["require", "exports", "aurelia-framework", "../../../my-globals", "../../../resources/constants", "toastr"], function (require, exports, aurelia_framework_1, my_globals_1, Constants, toastr) {
    "use strict";
    var CV = Constants;
    var UserPanelLanguages = (function () {
        function UserPanelLanguages(myGlobals) {
            this.CV = CV;
            this.lkp_languages_limitTo = 5;
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        UserPanelLanguages.prototype.add = function () {
            this.myGlobals.profileSelected.languages.push({ languageId: null, proficiencyValue: null });
        };
        UserPanelLanguages.prototype.remove = function (getPos) {
            this.myGlobals.profileSelected.languages.splice(getPos, 1);
            toastr.success('Language Removed');
        };
        return UserPanelLanguages;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelLanguages.prototype, "isReadOnly", void 0);
    UserPanelLanguages = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelLanguages);
    exports.UserPanelLanguages = UserPanelLanguages;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-passport',["require", "exports", "aurelia-framework", "../../../my-globals", "../../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, Constants) {
    "use strict";
    var CV = Constants;
    var UserPanelPassport = (function () {
        function UserPanelPassport(myGlobals) {
            this.CV = CV;
            this.isReadOnly = null;
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        UserPanelPassport.prototype.onReady = function (datePicker, getValue) {
            datePicker.value(getValue ? new Date(getValue) : '');
        };
        UserPanelPassport.prototype.inputChanged = function (newValue, oldValue) {
            console.log('inputChanged: ' + newValue + ' | ' + oldValue);
        };
        UserPanelPassport.prototype.onChange = function (newValue, oldValue) {
            console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
        };
        UserPanelPassport.prototype.add = function () {
            this.myGlobals.profileSelected.passports.push({ countryId: null, number: null, typeValue: null, expiresOn: null });
        };
        UserPanelPassport.prototype.remove = function (getPos) {
            this.myGlobals.profileSelected.passports.splice(getPos, 1);
        };
        return UserPanelPassport;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelPassport.prototype, "isReadOnly", void 0);
    UserPanelPassport = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelPassport);
    exports.UserPanelPassport = UserPanelPassport;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-training',["require", "exports", "aurelia-framework", "../../../my-globals", "../../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, Constants) {
    "use strict";
    var CV = Constants;
    var UserPanelTraining = (function () {
        function UserPanelTraining(myGlobals) {
            this.isReadOnly = null;
            this.CV = CV;
            this.message = CV.MSG_TRAINING;
            this.myTrainingArrDynamic = [];
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        UserPanelTraining.prototype.onReady = function (datePicker, getValue) {
            datePicker.value(new Date(getValue));
        };
        UserPanelTraining.prototype.inputChanged = function (newValue, oldValue) {
            console.log('inputChanged: ' + newValue + ' | ' + oldValue);
        };
        UserPanelTraining.prototype.onChange = function (newValue, oldValue) {
            console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
        };
        UserPanelTraining.prototype.onTrainingChecked = function (getId) {
            var rowPos;
            this.myGlobals.profileSelected.trainings = [];
            for (var i = 0; i < this.tmpTrainingsMule.length; i++) {
                console.log('loop....' + i);
                if (this.tmpTrainingsMule[i].attended)
                    this.myGlobals.profileSelected.trainings.push({ trainingId: this.tmpTrainingsMule[i].trainingId, expiresOn: this.tmpTrainingsMule[i].expiresOn });
            }
        };
        UserPanelTraining.prototype.attached = function () {
            var _this = this;
            $('.k_datepicker').click(function (e) {
                console.log('attached k_datepicker: ???');
                e.stopPropagation();
            });
            var tmp_rolesArrValues = [];
            for (var _i = 0, _a = this.myGlobals.profileSelected.trainings; _i < _a.length; _i++) {
                var next = _a[_i];
                var nextRole = next.trainingId;
                this.myTrainingArrDynamic.push(nextRole);
            }
            this.myTrainingArr_init = this.myGlobals.profileSelected.trainings.map(function (x) {
                return {
                    trainingId: x.trainingId,
                    expiresOn: x.expiresOn
                };
            });
            this.tmpTrainingsMule = this.myGlobals.myLookups.trainings.map(function (x) {
                var tmpArr = {};
                if (_this.myTrainingArrDynamic.indexOf(x.id) != -1) {
                    tmpArr = _this.myTrainingArr_init[_this.myTrainingArrDynamic.indexOf(x.id)];
                    tmpArr['attended'] = x.expires;
                }
                else {
                    tmpArr['attended'] = null;
                    tmpArr['expiresOn'] = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                }
                tmpArr['name'] = x.name;
                tmpArr['trainingId'] = x.id;
                tmpArr['expires'] = x.expires;
                return tmpArr;
            });
        };
        UserPanelTraining.prototype.returnTrainingLabel = function (getId) {
            var tmpIndex = this.myGlobals.myLookups.trainings.filter(function (x) { return x.id == getId; })[0];
            console.log('returnTrainingData: ' + getId + ' > ' + JSON.stringify(tmpIndex) + ' | ' + JSON.stringify(this.myTrainingArrDynamic));
            if (tmpIndex)
                return tmpIndex['name'];
            return 'xxx';
        };
        return UserPanelTraining;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelTraining.prototype, "isReadOnly", void 0);
    UserPanelTraining = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelTraining);
    exports.UserPanelTraining = UserPanelTraining;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/widgets/user-panels/user-panel-visa',["require", "exports", "aurelia-framework", "../../../my-globals", "../../../resources/constants"], function (require, exports, aurelia_framework_1, my_globals_1, Constants) {
    "use strict";
    var CV = Constants;
    var UserPanelVisa = (function () {
        function UserPanelVisa(myGlobals) {
            this.CV = CV;
            this.isReadOnly = null;
            this.myGlobals = my_globals_1.MyGlobals;
            this.profile = this.myGlobals.profileSelected;
            this.myLookups = this.myGlobals.myLookups;
        }
        UserPanelVisa.prototype.attached = function () {
            $('.k_datepicker').click(function (e) {
                console.log('attached k_datepicker: ???');
                e.stopPropagation();
            });
        };
        UserPanelVisa.prototype.onReady = function (datePicker, getValue) {
            datePicker.value(getValue ? new Date(getValue) : '');
        };
        UserPanelVisa.prototype.inputChanged = function (newValue, oldValue) {
            console.log('inputChanged: ' + newValue + ' | ' + oldValue);
        };
        UserPanelVisa.prototype.onChange = function (newValue, oldValue) {
            console.log('onChange() : model: ' + newValue + ' | ' + oldValue);
        };
        UserPanelVisa.prototype.add = function () {
            this.myGlobals.profileSelected.visas.push({ countryId: null, typeValue: null, multipleEntry: null, expiresOn: null });
        };
        UserPanelVisa.prototype.remove = function (getPos) {
            this.myGlobals.profileSelected.visas.splice(getPos, 1);
        };
        return UserPanelVisa;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelVisa.prototype, "isReadOnly", void 0);
    UserPanelVisa = __decorate([
        aurelia_framework_1.inject(my_globals_1.MyGlobals),
        __metadata("design:paramtypes", [my_globals_1.MyGlobals])
    ], UserPanelVisa);
    exports.UserPanelVisa = UserPanelVisa;
});

define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.setToken = function setToken(token) {
      this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      var _this3 = this;

      return this.auth.logout(redirectUri).then(function () {
        _this3.eventAggregator.publish('auth:logout');
      });
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this4 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this4.auth.setToken(response, redirect);
        _this4.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this5 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) {
        return this._closePromise;
      }

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        _this2._closePromise = undefined;
      }, function (e) {
        _this2._closePromise = undefined;
        return Promise.reject(e);
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this._escapeKeyEventHandler = function (e) {
        if (e.keyCode === 27) {
          var top = _this._dialogControllers[_this._dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = settings.startingZIndex;
      this.modalContainer.style.zIndex = settings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
      }

      this._dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this._dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this._dialogControllers.splice(i, 1);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3._dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  DialogRenderer.prototype._dialogControllers = [];

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult, _dialogOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      return this.openAndYieldController(settings).then(function (controller) {
        return controller.result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this = this;

      var childContainer = this.container.createChild();
      var dialogController = void 0;
      var promise = new Promise(function (resolve, reject) {
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), _createSettings(settings), resolve, reject);
      });
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      dialogController.result = promise;
      dialogController.result.then(function () {
        _removeController(_this, dialogController);
      }, function () {
        _removeController(_this, dialogController);
      });
      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _createSettings(settings) {
    settings = Object.assign({}, _dialogOptions.dialogOptions, settings);
    settings.startingZIndex = _dialogOptions.dialogOptions.startingZIndex;
    return settings;
  }

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
    }
  }
});
define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Compose = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Compose = exports.Compose = (_dec = (0, _aureliaTemplating.customElement)('compose'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      

      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
    }

    Compose.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    Compose.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      processInstruction(this, createInstruction(this, {
        view: this.view,
        viewModel: this.viewModel,
        model: this.model
      }));
    };

    Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var _this = this;

      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      this.taskQueue.queueMicroTask(function () {
        if (_this.currentInstruction) {
          _this.currentInstruction.model = newValue;
          return;
        }

        var vm = _this.currentViewModel;

        if (vm && typeof vm.activate === 'function') {
          vm.activate(newValue);
        }
      });
    };

    Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      var _this2 = this;

      var instruction = createInstruction(this, {
        view: newValue,
        viewModel: this.currentViewModel || this.viewModel,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this2, _this2.currentInstruction);
      });
    };

    Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      var _this3 = this;

      var instruction = createInstruction(this, {
        viewModel: newValue,
        view: this.view,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this3, _this3.currentInstruction);
      });
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);


  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element
    });
  }

  function processInstruction(composer, instruction) {
    composer.currentInstruction = null;
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.If = undefined;

  

  var _dec, _dec2, _class;

  var If = exports.If = (_dec = (0, _aureliaTemplating.customAttribute)('if'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function If(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
    }

    If.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    If.prototype.valueChanged = function valueChanged(newValue) {
      var _this = this;

      if (this.__queuedChanges) {
        this.__queuedChanges.push(newValue);
        return;
      }

      var maybePromise = this._runValueChanged(newValue);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedChanges = _this.__queuedChanges = [];

          var runQueuedChanges = function runQueuedChanges() {
            if (!queuedChanges.length) {
              _this.__queuedChanges = undefined;
              return;
            }

            var nextPromise = _this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
            nextPromise.then(runQueuedChanges);
          };

          maybePromise.then(runQueuedChanges);
        })();
      }
    };

    If.prototype._runValueChanged = function _runValueChanged(newValue) {
      var _this2 = this;

      if (!newValue) {
        var viewOrPromise = void 0;
        if (this.view !== null && this.showing) {
          viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this2.view.unbind();
            });
          } else {
            this.view.unbind();
          }
        }

        this.showing = false;
        return viewOrPromise;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      if (!this.showing) {
        this.showing = true;
        return this.viewSlot.add(this.view);
      }

      return undefined;
    };

    If.prototype.unbind = function unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      }
      this.view.returnToCache();
      this.view = null;
    };

    return If;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.With = undefined;

  

  var _dec, _dec2, _class;

  var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function With(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    With.prototype.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    With.prototype.valueChanged = function valueChanged(newValue) {
      var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    With.prototype.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './repeat-strategy-locator', './repeat-utilities', './analyze-view-factory', './abstract-repeater'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _repeatStrategyLocator, _repeatUtilities, _analyzeViewFactory, _abstractRepeater) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repeat = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Repeat = exports.Repeat = (_dec = (0, _aureliaTemplating.customAttribute)('repeat'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _repeatStrategyLocator.RepeatStrategyLocator), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = (_class2 = function (_AbstractRepeater) {
    _inherits(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      

      var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory)
      }));

      _initDefineProp(_this, 'items', _descriptor, _this);

      _initDefineProp(_this, 'local', _descriptor2, _this);

      _initDefineProp(_this, 'key', _descriptor3, _this);

      _initDefineProp(_this, 'value', _descriptor4, _this);

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = (0, _repeatUtilities.getItemsSourceExpression)(_this.instruction, 'repeat.for');
      _this.isOneTime = (0, _repeatUtilities.isOneTime)(_this.sourceExpression);
      _this.viewsRequireLifecycle = (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory);
      return _this;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    Repeat.prototype.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true);
      this._unsubscribeCollection();
    };

    Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    Repeat.prototype.itemsChanged = function itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.strategy.instanceChanged(this, items);
    };

    Repeat.prototype._getInnerCollection = function _getInnerCollection() {
      var expression = (0, _repeatUtilities.unwrapExpression)(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    };

    Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this2 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();
      var strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);
        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    Repeat.prototype.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    Repeat.prototype.views = function views() {
      return this.viewSlot.children;
    };

    Repeat.prototype.view = function view(index) {
      return this.viewSlot.children[index];
    };

    Repeat.prototype.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    Repeat.prototype.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;
      while (j--) {
        (0, _repeatUtilities.updateOneTimeBinding)(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        var k = view.controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          (0, _repeatUtilities.updateOneTimeBinding)(binding);
        }
      }
    };

    return Repeat;
  }(_abstractRepeater.AbstractRepeater), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat-strategy-locator',['exports', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (exports, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RepeatStrategyLocator = undefined;

  

  var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
    function RepeatStrategyLocator() {
      

      this.matchers = [];
      this.strategies = [];

      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new _nullRepeatStrategy.NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new _arrayRepeatStrategy.ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new _mapRepeatStrategy.MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new _setRepeatStrategy.SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new _numberRepeatStrategy.NumberRepeatStrategy());
    }

    RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();
});
define('aurelia-templating-resources/null-repeat-strategy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
    function NullRepeatStrategy() {
      
    }

    NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();
});
define('aurelia-templating-resources/array-repeat-strategy',['exports', './repeat-utilities', 'aurelia-binding'], function (exports, _repeatUtilities, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ArrayRepeatStrategy = undefined;

  

  var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
    function ArrayRepeatStrategy() {
      
    }

    ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        (function () {
          var childrenSnapshot = children.slice(0);
          var itemNameInBindingContext = repeat.local;
          var matcher = repeat.matcher();

          var itemsPreviouslyInViews = [];
          var viewsToRemove = [];

          for (var index = 0; index < viewsLength; index++) {
            var view = childrenSnapshot[index];
            var oldItem = view.bindingContext[itemNameInBindingContext];

            if ((0, _repeatUtilities.indexOf)(items, oldItem, matcher) === -1) {
              viewsToRemove.push(view);
            } else {
              itemsPreviouslyInViews.push(oldItem);
            }
          }

          var updateViews = void 0;
          var removePromise = void 0;

          if (itemsPreviouslyInViews.length > 0) {
            removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              for (var _index = 0; _index < itemsLength; _index++) {
                var item = items[_index];
                var indexOfView = (0, _repeatUtilities.indexOf)(itemsPreviouslyInViews, item, matcher, _index);
                var _view = void 0;

                if (indexOfView === -1) {
                  var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_index], _index, itemsLength);
                  repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                } else if (indexOfView === _index) {
                  _view = children[indexOfView];
                  itemsPreviouslyInViews[indexOfView] = undefined;
                } else {
                  _view = children[indexOfView];
                  repeat.moveView(indexOfView, _index);
                  itemsPreviouslyInViews.splice(indexOfView, 1);
                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                }

                if (_view) {
                  (0, _repeatUtilities.updateOverrideContext)(_view.overrideContext, _index, itemsLength);
                }
              }

              _this._inPlaceProcessItems(repeat, items);
            };
          } else {
            removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              return _this._standardProcessInstanceChanged(repeat, items);
            };
          }

          if (removePromise instanceof Promise) {
            removePromise.then(updateViews);
          } else {
            updateViews();
          }
        })();
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i],
              index = _splices$i.index,
              removed = _splices$i.removed,
              addedCount = _splices$i.addedCount;

          (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedSplices = repeat.__queuedSplices = [];

          var runQueuedSplices = function runQueuedSplices() {
            if (!queuedSplices.length) {
              repeat.__queuedSplices = undefined;
              repeat.__array = undefined;
              return;
            }

            var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
            queuedSplices = repeat.__queuedSplices = [];
            nextPromise.then(runQueuedSplices);
          };

          maybePromise.then(runQueuedSplices);
        })();
      }
    };

    ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);

      return undefined;
    };

    ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex = void 0;
      var spliceIndexLow = void 0;
      var arrayLength = array.length;
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();
});
define('aurelia-templating-resources/repeat-utilities',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateOverrideContexts = updateOverrideContexts;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.updateOverrideContext = updateOverrideContext;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.unwrapExpression = unwrapExpression;
  exports.isOneTime = isOneTime;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.indexOf = indexOf;


  var oneTime = _aureliaBinding.bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(_aureliaBinding.sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }
});
define('aurelia-templating-resources/map-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MapRepeatStrategy = undefined;

  

  var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
    function MapRepeatStrategy() {
      
    }

    MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value, key) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
      var key = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), map.size - 1, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();
});
define('aurelia-templating-resources/set-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SetRepeatStrategy = undefined;

  

  var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
    function SetRepeatStrategy() {
      
    }

    SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
      var value = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, set.size - 1, set.size);
            repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();
});
define('aurelia-templating-resources/number-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberRepeatStrategy = undefined;

  

  var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
    function NumberRepeatStrategy() {
      
    }

    NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }
      this._standardProcessItems(repeat, value);
    };

    NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var viewsToRemove = void 0;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
    };

    return NumberRepeatStrategy;
  }();
});
define('aurelia-templating-resources/analyze-view-factory',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = viewsRequireLifecycle;
  var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      var i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }
});
define('aurelia-templating-resources/abstract-repeater',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var AbstractRepeater = exports.AbstractRepeater = function () {
    function AbstractRepeater(options) {
      

      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    AbstractRepeater.prototype.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    AbstractRepeater.prototype.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    AbstractRepeater.prototype.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    AbstractRepeater.prototype.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Show = undefined;

  

  var _dec, _dec2, _class;

  var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Show(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Show.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Show.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/aurelia-hide-style',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aureliaHideClassName = undefined;
  exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
  exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
  var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

  var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

  function injectAureliaHideStyleAtHead() {
    _aureliaPal.DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }
});
define('aurelia-templating-resources/hide',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Hide = undefined;

  

  var _dec, _dec2, _class;

  var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Hide(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Hide.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Hide.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Hide.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _htmlSanitizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SanitizeHTMLValueConverter = undefined;

  

  var _dec, _dec2, _class;

  var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      

      this.sanitizer = sanitizer;
    }

    SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/html-sanitizer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});
define('aurelia-templating-resources/replaceable',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Replaceable = undefined;

  

  var _dec, _dec2, _class;

  var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function Replaceable(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    Replaceable.prototype.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/focus',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Focus = undefined;

  

  var _dec, _dec2, _class;

  var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function Focus(element, taskQueue) {
      var _this = this;

      

      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;

      this.focusListener = function (e) {
        _this.value = true;
      };
      this.blurListener = function (e) {
        if (_aureliaPal.DOM.activeElement !== _this.element) {
          _this.value = false;
        }
      };
    }

    Focus.prototype.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    Focus.prototype._apply = function _apply() {
      var _this2 = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    Focus.prototype.attached = function attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.blurListener);
    };

    Focus.prototype.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.blurListener);
    };

    return Focus;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/css-resource',['exports', 'aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaLoader, _aureliaDependencyInjection, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createCSSResource = _createCSSResource;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
    });
  }

  var CSSResource = function () {
    function CSSResource(address) {
      

      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    CSSResource.prototype.initialize = function initialize(container, target) {
      this._scoped = new target(this);
    };

    CSSResource.prototype.register = function register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    };

    CSSResource.prototype.load = function load(container) {
      var _this = this;

      return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._scoped.css = text;
        if (_this._global) {
          _this._alreadyGloballyInjected = true;
          _aureliaPal.DOM.injectStyles(text);
        }
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks = function () {
    function CSSViewEngineHooks(owner) {
      

      this.owner = owner;
      this.css = null;
    }

    CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        _aureliaPal.DOM.injectStyles(this.css, content, true);
      } else if (_aureliaPal.FEATURE.scopedCSS) {
        var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this.owner._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
      _inherits(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        

        return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);

    return ViewCSS;
  }
});
define('aurelia-templating-resources/attr-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttrBindingBehavior = undefined;

  

  var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
    function AttrBindingBehavior() {
      
    }

    AttrBindingBehavior.prototype.bind = function bind(binding, source) {
      binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
    };

    AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

    return AttrBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-mode-behaviors',['exports', 'aurelia-binding', 'aurelia-metadata'], function (exports, _aureliaBinding, _aureliaMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

  

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneTime;
  }) || _class);
  var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec2 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneWay;
  }) || _class2);
  var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.twoWay;
  }) || _class3);
});
define('aurelia-templating-resources/throttle-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ThrottleBindingBehavior = undefined;

  

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
    function ThrottleBindingBehavior() {
      
    }

    ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToThrottle = 'updateSource';
      }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    };

    ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }();
});
define('aurelia-templating-resources/debounce-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DebounceBindingBehavior = undefined;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
    function DebounceBindingBehavior() {
      
    }

    DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToDebounce = 'updateTarget';
      if (binding.callSource) {
        methodToDebounce = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToDebounce = 'updateSource';
      }

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debounce;

      binding.debounceState = {
        delay: delay,
        timeoutId: null,
        immediate: methodToDebounce === 'updateTarget' };
    };

    DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }();
});
define('aurelia-templating-resources/signal-binding-behavior',['exports', './binding-signaler'], function (exports, _bindingSignaler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignalBindingBehavior = undefined;

  

  var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
    SignalBindingBehavior.inject = function inject() {
      return [_bindingSignaler.BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      

      this.signals = bindingSignaler.signals;
    }

    SignalBindingBehavior.prototype.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;
        while (i--) {
          var _name = names[i];
          var _bindings = this.signals[_name] || (this.signals[_name] = []);
          _bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;
        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];
        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-signaler',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BindingSignaler = undefined;

  

  var BindingSignaler = exports.BindingSignaler = function () {
    function BindingSignaler() {
      

      this.signals = {};
    }

    BindingSignaler.prototype.signal = function signal(name) {
      var bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      var i = bindings.length;
      while (i--) {
        bindings[i].call(_aureliaBinding.sourceContext);
      }
    };

    return BindingSignaler;
  }();
});
define('aurelia-templating-resources/update-trigger-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpdateTriggerBindingBehavior = undefined;

  

  var _class, _temp;

  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

  var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class = function () {
    function UpdateTriggerBindingBehavior(eventManager) {
      

      this.eventManager = eventManager;
    }

    UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      var handler = this.eventManager.createElementHandler(events);
      targetObserver.handler = handler;
    };

    UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }(), _class.inject = [_aureliaBinding.EventManager], _temp);
});
define('aurelia-templating-resources/html-resource-plugin',['exports', 'aurelia-templating', './dynamic-element'], function (exports, _aureliaTemplating, _dynamicElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getElementName = getElementName;
  exports.configure = configure;
  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure(config) {
    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = (0, _dynamicElement._createDynamicElement)(elementName, address, bindable), _ref;
        });
      }
    });
  }
});
define('aurelia-templating-resources/dynamic-element',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createDynamicElement = _createDynamicElement;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
      function DynamicElement() {
        
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }
});
define('kendo-ui-core/js/kendo.datepicker',['require','exports','module','./kendo.popup','./kendo.calendar'],function (require, exports, module) {module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(445);


/***/ },

/***/ 422:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 433:
/***/ function(module, exports) {

	module.exports = require("./kendo.popup");

/***/ },

/***/ 445:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(446), __webpack_require__(433) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "datepicker",
	    name: "DatePicker",
	    category: "web",
	    description: "The DatePicker widget allows the user to select a date from a calendar or by direct input.",
	    depends: [ "calendar", "popup" ]
	};

	(function($, undefined) {
	    var kendo = window.kendo,
	    ui = kendo.ui,
	    Widget = ui.Widget,
	    parse = kendo.parseDate,
	    keys = kendo.keys,
	    template = kendo.template,
	    activeElement = kendo._activeElement,
	    DIV = "<div />",
	    SPAN = "<span />",
	    ns = ".kendoDatePicker",
	    CLICK = "click" + ns,
	    OPEN = "open",
	    CLOSE = "close",
	    CHANGE = "change",
	    DISABLED = "disabled",
	    READONLY = "readonly",
	    DEFAULT = "k-state-default",
	    FOCUSED = "k-state-focused",
	    SELECTED = "k-state-selected",
	    STATEDISABLED = "k-state-disabled",
	    HOVER = "k-state-hover",
	    HOVEREVENTS = "mouseenter" + ns + " mouseleave" + ns,
	    MOUSEDOWN = "mousedown" + ns,
	    ID = "id",
	    MIN = "min",
	    MAX = "max",
	    MONTH = "month",
	    ARIA_DISABLED = "aria-disabled",
	    ARIA_EXPANDED = "aria-expanded",
	    ARIA_HIDDEN = "aria-hidden",
	    calendar = kendo.calendar,
	    isInRange = calendar.isInRange,
	    restrictValue = calendar.restrictValue,
	    isEqualDatePart = calendar.isEqualDatePart,
	    extend = $.extend,
	    proxy = $.proxy,
	    DATE = Date;

	    function normalize(options) {
	        var parseFormats = options.parseFormats,
	            format = options.format;

	        calendar.normalize(options);


	        parseFormats = $.isArray(parseFormats) ? parseFormats : [parseFormats];

	        if (!parseFormats.length) {
	            parseFormats.push("yyyy-MM-dd");
	        }

	        if ($.inArray(format, parseFormats) === -1) {
	            parseFormats.splice(0, 0, options.format);
	        }

	        options.parseFormats = parseFormats;
	    }

	    function preventDefault(e) {
	        e.preventDefault();
	    }

	    var DateView = function(options) {
	        var that = this, id,
	            body = document.body,
	            div = $(DIV).attr(ARIA_HIDDEN, "true")
	                        .addClass("k-calendar-container")
	                        .appendTo(body);

	        that.options = options = options || {};
	        id = options.id;

	        if (id) {
	            id += "_dateview";

	            div.attr(ID, id);
	            that._dateViewID = id;
	        }

	        that.popup = new ui.Popup(div, extend(options.popup, options, { name: "Popup", isRtl: kendo.support.isRtl(options.anchor) }));
	        that.div = div;

	        that.value(options.value);
	    };

	    DateView.prototype = {
	        _calendar: function() {
	            var that = this;
	            var calendar = that.calendar;
	            var options = that.options;
	            var div;

	            if (!calendar) {
	                div = $(DIV).attr(ID, kendo.guid())
	                            .appendTo(that.popup.element)
	                            .on(MOUSEDOWN, preventDefault)
	                            .on(CLICK, "td:has(.k-link)", proxy(that._click, that));

	                that.calendar = calendar = new ui.Calendar(div);
	                that._setOptions(options);

	                kendo.calendar.makeUnselectable(calendar.element);

	                calendar.navigate(that._value || that._current, options.start);

	                that.value(that._value);
	            }
	        },

	        _setOptions: function(options) {
	            this.calendar.setOptions({
	                focusOnNav: false,
	                change: options.change,
	                culture: options.culture,
	                dates: options.dates,
	                depth: options.depth,
	                footer: options.footer,
	                format: options.format,
	                max: options.max,
	                min: options.min,
	                month: options.month,
	                weekNumber: options.weekNumber,
	                start: options.start,
	                disableDates: options.disableDates
	            });
	        },

	        setOptions: function(options) {
	            var old = this.options;
	            var disableDates = options.disableDates;

	            if (disableDates) {
	                options.disableDates = calendar.disabled(disableDates);
	            }

	            this.options = extend(old, options, {
	                change: old.change,
	                close: old.close,
	                open: old.open
	            });

	            if (this.calendar) {
	                this._setOptions(this.options);
	            }
	        },

	        destroy: function() {
	            this.popup.destroy();
	        },

	        open: function() {
	            var that = this;

	            that._calendar();
	            that.popup.open();
	        },

	        close: function() {
	            this.popup.close();
	        },

	        min: function(value) {
	            this._option(MIN, value);
	        },

	        max: function(value) {
	            this._option(MAX, value);
	        },

	        toggle: function() {
	            var that = this;

	            that[that.popup.visible() ? CLOSE : OPEN]();
	        },

	        move: function(e) {
	            var that = this,
	                key = e.keyCode,
	                calendar = that.calendar,
	                selectIsClicked = e.ctrlKey && key == keys.DOWN || key == keys.ENTER,
	                handled = false;

	            if (e.altKey) {
	                if (key == keys.DOWN) {
	                    that.open();
	                    e.preventDefault();
	                    handled = true;
	                } else if (key == keys.UP) {
	                    that.close();
	                    e.preventDefault();
	                    handled = true;
	                }

	            } else if (that.popup.visible()) {

	                if (key == keys.ESC || (selectIsClicked && calendar._cell.hasClass(SELECTED))) {
	                    that.close();
	                    e.preventDefault();
	                    return true;
	                }

	                that._current = calendar._move(e);
	                handled = true;
	            }

	            return handled;
	        },

	        current: function(date) {
	            this._current = date;
	            this.calendar._focus(date);
	        },

	        value: function(value) {
	            var that = this,
	                calendar = that.calendar,
	                options = that.options,
	                disabledDate = options.disableDates;

	            if (disabledDate && disabledDate(value)) {
	                value = null;
	            }

	            that._value = value;
	            that._current = new DATE(+restrictValue(value, options.min, options.max));

	            if (calendar) {
	                calendar.value(value);
	            }
	        },

	        _click: function(e) {

	            if (e.currentTarget.className.indexOf(SELECTED) !== -1) {
	                this.close();
	            }
	        },

	        _option: function(option, value) {
	            var that = this;
	            var calendar = that.calendar;

	            that.options[option] = value;

	            if (calendar) {
	                calendar[option](value);
	            }
	        }
	    };

	    DateView.normalize = normalize;

	    kendo.DateView = DateView;

	    var DatePicker = Widget.extend({
	        init: function(element, options) {
	            var that = this,
	                disabled,
	                div;

	            Widget.fn.init.call(that, element, options);
	            element = that.element;
	            options = that.options;

	            options.disableDates = kendo.calendar.disabled(options.disableDates);

	            options.min = parse(element.attr("min")) || parse(options.min);
	            options.max = parse(element.attr("max")) || parse(options.max);

	            normalize(options);

	            that._initialOptions = extend({}, options);

	            that._wrapper();

	            that.dateView = new DateView(extend({}, options, {
	                id: element.attr(ID),
	                anchor: that.wrapper,
	                change: function() {
	                    // calendar is the current scope
	                    that._change(this.value());
	                    that.close();
	                },
	                close: function(e) {
	                    if (that.trigger(CLOSE)) {
	                        e.preventDefault();
	                    } else {
	                        element.attr(ARIA_EXPANDED, false);
	                        div.attr(ARIA_HIDDEN, true);
	                    }
	                },
	                open: function(e) {
	                    var options = that.options,
	                        date;

	                    if (that.trigger(OPEN)) {
	                        e.preventDefault();
	                    } else {
	                        if (that.element.val() !== that._oldText) {
	                            date = parse(element.val(), options.parseFormats, options.culture);

	                            that.dateView[date ? "current" : "value"](date);
	                        }

	                        element.attr(ARIA_EXPANDED, true);
	                        div.attr(ARIA_HIDDEN, false);

	                        that._updateARIA(date);

	                    }
	                }
	            }));
	            div = that.dateView.div;

	            that._icon();

	            try {
	                element[0].setAttribute("type", "text");
	            } catch(e) {
	                element[0].type = "text";
	            }

	            element
	                .addClass("k-input")
	                .attr({
	                    role: "combobox",
	                    "aria-expanded": false,
	                    "aria-owns": that.dateView._dateViewID
	                });

	            that._reset();
	            that._template();

	            disabled = element.is("[disabled]") || $(that.element).parents("fieldset").is(':disabled');
	            if (disabled) {
	                that.enable(false);
	            } else {
	                that.readonly(element.is("[readonly]"));
	            }

	            that._old = that._update(options.value || that.element.val());
	            that._oldText = element.val();

	            kendo.notify(that);
	        },
	        events: [
	        OPEN,
	        CLOSE,
	        CHANGE],
	        options: {
	            name: "DatePicker",
	            value: null,
	            footer: "",
	            format: "",
	            culture: "",
	            parseFormats: [],
	            min: new Date(1900, 0, 1),
	            max: new Date(2099, 11, 31),
	            start: MONTH,
	            depth: MONTH,
	            animation: {},
	            month : {},
	            dates: [],
	            ARIATemplate: 'Current focused date is #=kendo.toString(data.current, "D")#'
	        },

	        setOptions: function(options) {
	            var that = this;
	            var value = that._value;

	            Widget.fn.setOptions.call(that, options);

	            options = that.options;

	            options.min = parse(options.min);
	            options.max = parse(options.max);

	            normalize(options);

	            that.dateView.setOptions(options);

	            if (value) {
	                that.element.val(kendo.toString(value, options.format, options.culture));
	                that._updateARIA(value);
	            }
	        },

	        _editable: function(options) {
	            var that = this,
	                icon = that._dateIcon.off(ns),
	                element = that.element.off(ns),
	                wrapper = that._inputWrapper.off(ns),
	                readonly = options.readonly,
	                disable = options.disable;

	            if (!readonly && !disable) {
	                wrapper
	                    .addClass(DEFAULT)
	                    .removeClass(STATEDISABLED)
	                    .on(HOVEREVENTS, that._toggleHover);

	                element.removeAttr(DISABLED)
	                       .removeAttr(READONLY)
	                       .attr(ARIA_DISABLED, false)
	                       .on("keydown" + ns, proxy(that._keydown, that))
	                       .on("focusout" + ns, proxy(that._blur, that))
	                       .on("focus" + ns, function() {
	                           that._inputWrapper.addClass(FOCUSED);
	                       });

	               icon.on(CLICK, proxy(that._click, that))
	                   .on(MOUSEDOWN, preventDefault);
	            } else {
	                wrapper
	                    .addClass(disable ? STATEDISABLED : DEFAULT)
	                    .removeClass(disable ? DEFAULT : STATEDISABLED);

	                element.attr(DISABLED, disable)
	                       .attr(READONLY, readonly)
	                       .attr(ARIA_DISABLED, disable);
	            }
	        },

	        readonly: function(readonly) {
	            this._editable({
	                readonly: readonly === undefined ? true : readonly,
	                disable: false
	            });
	        },

	        enable: function(enable) {
	            this._editable({
	                readonly: false,
	                disable: !(enable = enable === undefined ? true : enable)
	            });
	        },

	        destroy: function() {
	            var that = this;

	            Widget.fn.destroy.call(that);

	            that.dateView.destroy();

	            that.element.off(ns);
	            that._dateIcon.off(ns);
	            that._inputWrapper.off(ns);

	            if (that._form) {
	                that._form.off("reset", that._resetHandler);
	            }
	        },

	        open: function() {
	            this.dateView.open();
	        },

	        close: function() {
	            this.dateView.close();
	        },

	        min: function(value) {
	            return this._option(MIN, value);
	        },

	        max: function(value) {
	            return this._option(MAX, value);
	        },

	        value: function(value) {
	            var that = this;

	            if (value === undefined) {
	                return that._value;
	            }

	            that._old = that._update(value);

	            if (that._old === null) {
	                that.element.val("");
	            }

	            that._oldText = that.element.val();
	        },

	        _toggleHover: function(e) {
	            $(e.currentTarget).toggleClass(HOVER, e.type === "mouseenter");
	        },

	        _blur: function() {
	            var that = this,
	                value = that.element.val();

	            that.close();
	            if (value !== that._oldText) {
	                that._change(value);
	            }

	            that._inputWrapper.removeClass(FOCUSED);
	        },

	        _click: function() {
	            var that = this,
	                element = that.element;

	            that.dateView.toggle();

	            if (!kendo.support.touch && element[0] !== activeElement()) {
	                element.focus();
	            }
	        },

	        _change: function(value) {
	            var that = this,
	            oldValue = that.element.val(),
	            dateChanged;

	            value = that._update(value);
	            dateChanged = !kendo.calendar.isEqualDate(that._old, value);

	            var valueUpdated = dateChanged && !that._typing;
	            var textFormatted = oldValue !== that.element.val();

	            if (valueUpdated || textFormatted) {
	                that.element.trigger(CHANGE);
	            }

	            if (dateChanged) {
	                that._old = value;
	                that._oldText = that.element.val();

	                that.trigger(CHANGE);
	            }

	            that._typing = false;
	        },

	        _keydown: function(e) {
	            var that = this,
	                dateView = that.dateView,
	                value = that.element.val(),
	                handled = false;

	            if (!dateView.popup.visible() && e.keyCode == keys.ENTER && value !== that._oldText) {
	                that._change(value);
	            } else {
	                handled = dateView.move(e);
	                that._updateARIA(dateView._current);

	                if (!handled) {
	                    that._typing = true;
	                }
	            }
	        },

	        _icon: function() {
	            var that = this,
	                element = that.element,
	                icon;

	            icon = element.next("span.k-select");

	            if (!icon[0]) {
	                icon = $('<span unselectable="on" class="k-select" aria-label="select"><span class="k-icon k-i-calendar"></span></span>').insertAfter(element);
	            }

	            that._dateIcon = icon.attr({
	                "role": "button",
	                "aria-controls": that.dateView._dateViewID
	            });
	        },

	        _option: function(option, value) {
	            var that = this,
	                options = that.options;

	            if (value === undefined) {
	                return options[option];
	            }

	            value = parse(value, options.parseFormats, options.culture);

	            if (!value) {
	                return;
	            }

	            options[option] = new DATE(+value);
	            that.dateView[option](value);
	        },

	        _update: function(value) {
	            var that = this,
	                options = that.options,
	                min = options.min,
	                max = options.max,
	                current = that._value,
	                date = parse(value, options.parseFormats, options.culture),
	                isSameType = (date === null && current === null) || (date instanceof Date && current instanceof Date),
	                formattedValue;

	            if (options.disableDates(date)) {
	                date = null;
	                if (!that._old && !that.element.val()) {
	                    value = null;
	                }
	            }

	            if (+date === +current && isSameType) {
	                formattedValue = kendo.toString(date, options.format, options.culture);

	                if (formattedValue !== value) {
	                    that.element.val(date === null ? value : formattedValue);
	                }

	                return date;
	            }

	            if (date !== null && isEqualDatePart(date, min)) {
	                date = restrictValue(date, min, max);
	            } else if (!isInRange(date, min, max)) {
	                date = null;
	            }

	            that._value = date;
	            that.dateView.value(date);
	            that.element.val(kendo.toString(date || value, options.format, options.culture));
	            that._updateARIA(date);

	            return date;
	        },

	        _wrapper: function() {
	            var that = this,
	                element = that.element,
	                wrapper;

	            wrapper = element.parents(".k-datepicker");

	            if (!wrapper[0]) {
	                wrapper = element.wrap(SPAN).parent().addClass("k-picker-wrap k-state-default");
	                wrapper = wrapper.wrap(SPAN).parent();
	            }

	            wrapper[0].style.cssText = element[0].style.cssText;
	            element.css({
	                width: "100%",
	                height: element[0].style.height
	            });

	            that.wrapper = wrapper.addClass("k-widget k-datepicker k-header")
	                                  .addClass(element[0].className);

	            that._inputWrapper = $(wrapper[0].firstChild);
	        },

	        _reset: function() {
	            var that = this,
	                element = that.element,
	                formId = element.attr("form"),
	                form = formId ? $("#" + formId) : element.closest("form");

	            if (form[0]) {
	                that._resetHandler = function() {
	                    that.value(element[0].defaultValue);
	                    that.max(that._initialOptions.max);
	                    that.min(that._initialOptions.min);
	                };

	                that._form = form.on("reset", that._resetHandler);
	            }
	        },

	        _template: function() {
	            this._ariaTemplate = template(this.options.ARIATemplate);
	        },

	        _updateARIA: function(date) {
	            var cell;
	            var that = this;
	            var calendar = that.dateView.calendar;

	            that.element.removeAttr("aria-activedescendant");

	            if (calendar) {
	                cell = calendar._cell;
	                cell.attr("aria-label", that._ariaTemplate({ current: date || calendar.current() }));

	                that.element.attr("aria-activedescendant", cell.attr("id"));
	            }
	        }
	    });

	    ui.plugin(DatePicker);

	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(422));


/***/ },

/***/ 446:
/***/ function(module, exports) {

	module.exports = require("./kendo.calendar");

/***/ }

/******/ });
});

define('kendo-ui-core/js/kendo.popup',['require','exports','module','./kendo.core'],function (require, exports, module) {module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(498);


/***/ },

/***/ 421:
/***/ function(module, exports) {

	module.exports = require("./kendo.core");

/***/ },

/***/ 422:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 498:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(421) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "popup",
	    name: "Pop-up",
	    category: "framework",
	    depends: [ "core" ],
	    advanced: true
	};

	(function($, undefined) {
	    var kendo = window.kendo,
	        ui = kendo.ui,
	        Widget = ui.Widget,
	        support = kendo.support,
	        getOffset = kendo.getOffset,
	        outerWidth = kendo._outerWidth,
	        outerHeight = kendo._outerHeight,
	        OPEN = "open",
	        CLOSE = "close",
	        DEACTIVATE = "deactivate",
	        ACTIVATE = "activate",
	        CENTER = "center",
	        LEFT = "left",
	        RIGHT = "right",
	        TOP = "top",
	        BOTTOM = "bottom",
	        ABSOLUTE = "absolute",
	        HIDDEN = "hidden",
	        BODY = "body",
	        LOCATION = "location",
	        POSITION = "position",
	        VISIBLE = "visible",
	        EFFECTS = "effects",
	        ACTIVE = "k-state-active",
	        ACTIVEBORDER = "k-state-border",
	        ACTIVEBORDERREGEXP = /k-state-border-(\w+)/,
	        ACTIVECHILDREN = ".k-picker-wrap, .k-dropdown-wrap, .k-link",
	        MOUSEDOWN = "down",
	        DOCUMENT_ELEMENT = $(document.documentElement),
	        WINDOW = $(window),
	        SCROLL = "scroll",
	        cssPrefix = support.transitions.css,
	        TRANSFORM = cssPrefix + "transform",
	        extend = $.extend,
	        NS = ".kendoPopup",
	        styles = ["font-size",
	                  "font-family",
	                  "font-stretch",
	                  "font-style",
	                  "font-weight",
	                  "line-height"];

	    function contains(container, target) {
	        if (!container || !target) {
	            return false;
	        }
	        return container === target || $.contains(container, target);
	    }

	    var Popup = Widget.extend({
	        init: function(element, options) {
	            var that = this, parentPopup;

	            options = options || {};

	            if (options.isRtl) {
	                options.origin = options.origin || BOTTOM + " " + RIGHT;
	                options.position = options.position || TOP + " " + RIGHT;
	            }

	            Widget.fn.init.call(that, element, options);

	            element = that.element;
	            options = that.options;

	            that.collisions = options.collision ? options.collision.split(" ") : [];
	            that.downEvent = kendo.applyEventMap(MOUSEDOWN, kendo.guid());

	            if (that.collisions.length === 1) {
	                that.collisions.push(that.collisions[0]);
	            }

	            parentPopup = $(that.options.anchor).closest(".k-popup,.k-group").filter(":not([class^=km-])"); // When popup is in another popup, make it relative.

	            options.appendTo = $($(options.appendTo)[0] || parentPopup[0] || document.body);

	            that.element.hide()
	                .addClass("k-popup k-group k-reset")
	                .toggleClass("k-rtl", !!options.isRtl)
	                .css({ position : ABSOLUTE })
	                .appendTo(options.appendTo)
	                .on("mouseenter" + NS, function() {
	                    that._hovered = true;
	                })
	                .on("mouseleave" + NS, function() {
	                    that._hovered = false;
	                });

	            that.wrapper = $();

	            if (options.animation === false) {
	                options.animation = { open: { effects: {} }, close: { hide: true, effects: {} } };
	            }

	            extend(options.animation.open, {
	                complete: function() {
	                    that.wrapper.css({ overflow: VISIBLE }); // Forcing refresh causes flickering in mobile.
	                    that._activated = true;
	                    that._trigger(ACTIVATE);
	                }
	            });

	            extend(options.animation.close, {
	                complete: function() {
	                    that._animationClose();
	                }
	            });

	            that._mousedownProxy = function(e) {
	                that._mousedown(e);
	            };

	            if (support.mobileOS.android) {
	                that._resizeProxy = function(e) {
	                    setTimeout(function() {
	                        that._resize(e);
	                    }, 600); //Logic from kendo.onResize
	                };
	            } else {
	                that._resizeProxy = function(e) {
	                    that._resize(e);
	                };
	            }

	            if (options.toggleTarget) {
	                $(options.toggleTarget).on(options.toggleEvent + NS, $.proxy(that.toggle, that));
	            }
	        },

	        events: [
	            OPEN,
	            ACTIVATE,
	            CLOSE,
	            DEACTIVATE
	        ],

	        options: {
	            name: "Popup",
	            toggleEvent: "click",
	            origin: BOTTOM + " " + LEFT,
	            position: TOP + " " + LEFT,
	            anchor: BODY,
	            appendTo: null,
	            collision: "flip fit",
	            viewport: window,
	            copyAnchorStyles: true,
	            autosize: false,
	            modal: false,
	            adjustSize: {
	                width: 0,
	                height: 0
	            },
	            animation: {
	                open: {
	                    effects: "slideIn:down",
	                    transition: true,
	                    duration: 200
	                },
	                close: { // if close animation effects are defined, they will be used instead of open.reverse
	                    duration: 100,
	                    hide: true
	                }
	            }
	        },

	        _animationClose: function() {
	            var that = this;
	            var location = that.wrapper.data(LOCATION);

	            that.wrapper.hide();

	            if (location) {
	                that.wrapper.css(location);
	            }

	            if (that.options.anchor != BODY) {
	                that._hideDirClass();
	            }

	            that._closing = false;
	            that._trigger(DEACTIVATE);
	        },

	        destroy: function() {
	            var that = this,
	                options = that.options,
	                element = that.element.off(NS),
	                parent;

	            Widget.fn.destroy.call(that);

	            if (options.toggleTarget) {
	                $(options.toggleTarget).off(NS);
	            }

	            if (!options.modal) {
	                DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy);
	                that._toggleResize(false);
	            }

	            kendo.destroy(that.element.children());
	            element.removeData();

	            if (options.appendTo[0] === document.body) {
	                parent = element.parent(".k-animation-container");

	                if (parent[0]) {
	                    parent.remove();
	                } else {
	                    element.remove();
	                }
	            }
	        },

	        open: function(x, y) {
	            var that = this,
	                fixed = { isFixed: !isNaN(parseInt(y,10)), x: x, y: y },
	                element = that.element,
	                options = that.options,
	                animation, wrapper,
	                anchor = $(options.anchor),
	                mobile = element[0] && element.hasClass("km-widget");

	            if (!that.visible()) {
	                if (options.copyAnchorStyles) {
	                    if (mobile && styles[0] == "font-size") {
	                        styles.shift();
	                    }
	                    element.css(kendo.getComputedStyles(anchor[0], styles));
	                }

	                if (element.data("animating") || that._trigger(OPEN)) {
	                    return;
	                }

	                that._activated = false;

	                if (!options.modal) {
	                    DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy)
	                                .bind(that.downEvent, that._mousedownProxy);

	                    // this binding hangs iOS in editor
	                    // all elements in IE7/8 fire resize event, causing mayhem
	                    that._toggleResize(false);
	                    that._toggleResize(true);
	                }

	                that.wrapper = wrapper = kendo.wrap(element, options.autosize)
	                                        .css({
	                                            overflow: HIDDEN,
	                                            display: "block",
	                                            position: ABSOLUTE
	                                        });

	                if (support.mobileOS.android) {
	                    wrapper.css(TRANSFORM, "translatez(0)"); // Android is VERY slow otherwise. Should be tested in other droids as well since it may cause blur.
	                }

	                wrapper.css(POSITION);

	                if ($(options.appendTo)[0] == document.body) {
	                    wrapper.css(TOP, "-10000px");
	                }

	                that.flipped = that._position(fixed);
	                animation = that._openAnimation();

	                if (options.anchor != BODY) {
	                    that._showDirClass(animation);
	                }

	                element.data(EFFECTS, animation.effects)
	                       .kendoStop(true)
	                       .kendoAnimate(animation);
	            }
	        },

	        _openAnimation: function() {
	            var animation = extend(true, {}, this.options.animation.open);
	            animation.effects = kendo.parseEffects(animation.effects, this.flipped);

	            return animation;
	        },

	        _hideDirClass: function() {
	            var anchor = $(this.options.anchor);
	            var direction = ((anchor.attr("class") || "").match(ACTIVEBORDERREGEXP) || ["", "down"])[1];
	            var dirClass = ACTIVEBORDER + "-" + direction;

	            anchor
	                .removeClass(dirClass)
	                .children(ACTIVECHILDREN)
	                .removeClass(ACTIVE)
	                .removeClass(dirClass);

	            this.element.removeClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);
	        },

	        _showDirClass: function(animation) {
	            var direction = animation.effects.slideIn ? animation.effects.slideIn.direction : "down";
	            var dirClass = ACTIVEBORDER + "-" + direction;

	            $(this.options.anchor)
	                .addClass(dirClass)
	                .children(ACTIVECHILDREN)
	                .addClass(ACTIVE)
	                .addClass(dirClass);

	            this.element.addClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);
	        },

	        position: function() {
	            if (this.visible()) {
	                this.flipped = this._position();
	                //this._hideDirClass();
	                //this._showDirClass(this._openAnimation());
	            }
	        },

	        toggle: function() {
	            var that = this;

	            that[that.visible() ? CLOSE : OPEN]();
	        },

	        visible: function() {
	            return this.element.is(":" + VISIBLE);
	        },

	        close: function(skipEffects) {
	            var that = this,
	                options = that.options, wrap,
	                animation, openEffects, closeEffects;

	            if (that.visible()) {
	                wrap = (that.wrapper[0] ? that.wrapper : kendo.wrap(that.element).hide());

	                that._toggleResize(false);

	                if (that._closing || that._trigger(CLOSE)) {
	                    that._toggleResize(true);
	                    return;
	                }

	                // Close all inclusive popups.
	                that.element.find(".k-popup").each(function () {
	                    var that = $(this),
	                        popup = that.data("kendoPopup");

	                    if (popup) {
	                        popup.close(skipEffects);
	                    }
	                });

	                DOCUMENT_ELEMENT.unbind(that.downEvent, that._mousedownProxy);

	                if (skipEffects) {
	                    animation = { hide: true, effects: {} };
	                } else {
	                    animation = extend(true, {}, options.animation.close);
	                    openEffects = that.element.data(EFFECTS);
	                    closeEffects = animation.effects;

	                    if (!closeEffects && !kendo.size(closeEffects) && openEffects && kendo.size(openEffects)) {
	                        animation.effects = openEffects;
	                        animation.reverse = true;
	                    }

	                    that._closing = true;
	                }

	                that.element.kendoStop(true);
	                wrap.css({ overflow: HIDDEN }); // stop callback will remove hidden overflow
	                that.element.kendoAnimate(animation);

	                if (skipEffects) {
	                    that._animationClose();
	                }
	            }
	        },

	        _trigger: function(ev) {
	            return this.trigger(ev, { type: ev });
	        },

	        _resize: function(e) {
	            var that = this;

	            if (support.resize.indexOf(e.type) !== -1) {
	                clearTimeout(that._resizeTimeout);
	                that._resizeTimeout = setTimeout(function() {
	                    that._position();
	                    that._resizeTimeout = null;
	                }, 50);
	            } else {
	                if (!that._hovered || (that._activated && that.element.hasClass("k-list-container"))) {
	                    that.close();
	                }
	            }
	        },

	        _toggleResize: function(toggle) {
	            var method = toggle ? "on" : "off";
	            var eventNames = support.resize;

	            if (!(support.mobileOS.ios || support.mobileOS.android)) {
	                eventNames += " " + SCROLL;
	            }

	            this._scrollableParents()[method](SCROLL, this._resizeProxy);
	            WINDOW[method](eventNames, this._resizeProxy);
	        },

	        _mousedown: function(e) {
	            var that = this,
	                container = that.element[0],
	                options = that.options,
	                anchor = $(options.anchor)[0],
	                toggleTarget = options.toggleTarget,
	                target = kendo.eventTarget(e),
	                popup = $(target).closest(".k-popup"),
	                mobile = popup.parent().parent(".km-shim").length;

	            popup = popup[0];
	            if (!mobile && popup && popup !== that.element[0]){
	                return;
	            }

	            // This MAY result in popup not closing in certain cases.
	            if ($(e.target).closest("a").data("rel") === "popover") {
	                return;
	            }

	            if (!contains(container, target) && !contains(anchor, target) && !(toggleTarget && contains($(toggleTarget)[0], target))) {
	                that.close();
	            }
	        },

	        _fit: function(position, size, viewPortSize) {
	            var output = 0;

	            if (position + size > viewPortSize) {
	                output = viewPortSize - (position + size);
	            }

	            if (position < 0) {
	                output = -position;
	            }

	            return output;
	        },

	        _flip: function(offset, size, anchorSize, viewPortSize, origin, position, boxSize) {
	            var output = 0;
	                boxSize = boxSize || size;

	            if (position !== origin && position !== CENTER && origin !== CENTER) {
	                if (offset + boxSize > viewPortSize) {
	                    output += -(anchorSize + size);
	                }

	                if (offset + output < 0) {
	                    output += anchorSize + size;
	                }
	            }
	            return output;
	        },

	        _scrollableParents: function() {
	            return $(this.options.anchor)
	                       .parentsUntil("body")
	                       .filter(function(index, element) {
	                           return kendo.isScrollable(element);
	                       });
	        },

	        _position: function(fixed) {
	            var that = this,
	                //element = that.element.css(POSITION, ""), /* fixes telerik/kendo-ui-core#790, comes from telerik/kendo#615 */
	                element = that.element,
	                wrapper = that.wrapper,
	                options = that.options,
	                viewport = $(options.viewport),
	                zoomLevel = support.zoomLevel(),
	                isWindow = !!((viewport[0] == window) && window.innerWidth && (zoomLevel <= 1.02)),
	                anchor = $(options.anchor),
	                origins = options.origin.toLowerCase().split(" "),
	                positions = options.position.toLowerCase().split(" "),
	                collisions = that.collisions,
	                siblingContainer, parents,
	                parentZIndex, zIndex = 10002,
	                idx = 0,
	                docEl = document.documentElement,
	                length, viewportOffset, viewportWidth, viewportHeight;

	            if (options.viewport === window) {
	                viewportOffset = {
	                    top: (window.pageYOffset || document.documentElement.scrollTop || 0),
	                    left: (window.pageXOffset || document.documentElement.scrollLeft || 0)
	                };
	            } else {
	                viewportOffset = viewport.offset();
	            }

	            if (isWindow) {
	                viewportWidth = window.innerWidth;
	                viewportHeight = window.innerHeight;
	            } else {
	                viewportWidth = viewport.width();
	                viewportHeight = viewport.height();
	            }

	            if (isWindow && docEl.scrollHeight - docEl.clientHeight > 0) {
	                viewportWidth -= kendo.support.scrollbar();
	            }

	            siblingContainer = anchor.parents().filter(wrapper.siblings());

	            if (siblingContainer[0]) {
	                parentZIndex = Math.max(Number(siblingContainer.css("zIndex")), 0);

	                // set z-index to be more than that of the container/sibling
	                // compensate with more units for window z-stack
	                if (parentZIndex) {
	                    zIndex = parentZIndex + 10;
	                } else {
	                    parents = anchor.parentsUntil(siblingContainer);
	                    for (length = parents.length; idx < length; idx++) {
	                        parentZIndex = Number($(parents[idx]).css("zIndex"));
	                        if (parentZIndex && zIndex < parentZIndex) {
	                            zIndex = parentZIndex + 10;
	                        }
	                    }
	                }
	            }

	            wrapper.css("zIndex", zIndex);

	            if (fixed && fixed.isFixed) {
	                wrapper.css({ left: fixed.x, top: fixed.y });
	            } else {
	                wrapper.css(that._align(origins, positions));
	            }

	            var pos = getOffset(wrapper, POSITION, anchor[0] === wrapper.offsetParent()[0]),
	                offset = getOffset(wrapper),
	                anchorParent = anchor.offsetParent().parent(".k-animation-container,.k-popup,.k-group"); // If the parent is positioned, get the current positions

	            if (anchorParent.length) {
	                pos = getOffset(wrapper, POSITION, true);
	                offset = getOffset(wrapper);
	            }

	            offset.top -= viewportOffset.top;
	            offset.left -= viewportOffset.left;

	            if (!that.wrapper.data(LOCATION)) { // Needed to reset the popup location after every closure - fixes the resize bugs.
	                wrapper.data(LOCATION, extend({}, pos));
	            }

	            var offsets = extend({}, offset),
	                location = extend({}, pos),
	                adjustSize = options.adjustSize;

	            if (collisions[0] === "fit") {
	                location.top += that._fit(offsets.top, outerHeight(wrapper) + adjustSize.height, viewportHeight / zoomLevel);
	            }

	            if (collisions[1] === "fit") {
	                location.left += that._fit(offsets.left, outerWidth(wrapper) + adjustSize.width, viewportWidth / zoomLevel);
	            }

	            var flipPos = extend({}, location);
	            var elementHeight = outerHeight(element);
	            var wrapperHeight =  outerHeight(wrapper);

	            if (!wrapper.height() && elementHeight) {
	                wrapperHeight = wrapperHeight + elementHeight;
	            }

	            if (collisions[0] === "flip") {
	                location.top += that._flip(offsets.top, elementHeight, outerHeight(anchor), viewportHeight / zoomLevel, origins[0], positions[0], wrapperHeight);
	            }

	            if (collisions[1] === "flip") {
	                location.left += that._flip(offsets.left, outerWidth(element), outerWidth(anchor), viewportWidth / zoomLevel, origins[1], positions[1], outerWidth(wrapper));
	            }

	            element.css(POSITION, ABSOLUTE);
	            wrapper.css(location);

	            return (location.left != flipPos.left || location.top != flipPos.top);
	        },

	        _align: function(origin, position) {
	            var that = this,
	                element = that.wrapper,
	                anchor = $(that.options.anchor),
	                verticalOrigin = origin[0],
	                horizontalOrigin = origin[1],
	                verticalPosition = position[0],
	                horizontalPosition = position[1],
	                anchorOffset = getOffset(anchor),
	                appendTo = $(that.options.appendTo),
	                appendToOffset,
	                width = outerWidth(element),
	                height = outerHeight(element),
	                anchorWidth = outerWidth(anchor),
	                anchorHeight = outerHeight(anchor),
	                top = anchorOffset.top,
	                left = anchorOffset.left,
	                round = Math.round;

	            if (appendTo[0] != document.body) {
	                appendToOffset = getOffset(appendTo);
	                top -= appendToOffset.top;
	                left -= appendToOffset.left;
	            }


	            if (verticalOrigin === BOTTOM) {
	                top += anchorHeight;
	            }

	            if (verticalOrigin === CENTER) {
	                top += round(anchorHeight / 2);
	            }

	            if (verticalPosition === BOTTOM) {
	                top -= height;
	            }

	            if (verticalPosition === CENTER) {
	                top -= round(height / 2);
	            }

	            if (horizontalOrigin === RIGHT) {
	                left += anchorWidth;
	            }

	            if (horizontalOrigin === CENTER) {
	                left += round(anchorWidth / 2);
	            }

	            if (horizontalPosition === RIGHT) {
	                left -= width;
	            }

	            if (horizontalPosition === CENTER) {
	                left -= round(width / 2);
	            }

	            return {
	                top: top,
	                left: left
	            };
	        }
	    });

	    ui.plugin(Popup);
	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(422));


/***/ }

/******/ });
});

define('kendo-ui-core/js/kendo.core',['require','exports','module','jquery'],function (require, exports, module) {module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(438);


/***/ },

/***/ 420:
/***/ function(module, exports) {

	module.exports = require("jquery");

/***/ },

/***/ 422:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 438:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(jQuery) {(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(420)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "core",
	    name: "Core",
	    category: "framework",
	    description: "The core of the Kendo framework."
	};

	/*jshint eqnull: true, loopfunc: true, evil: true, boss: true, freeze: false*/
	(function($, window, undefined) {
	    var kendo = window.kendo = window.kendo || { cultures: {} },
	        extend = $.extend,
	        each = $.each,
	        isArray = $.isArray,
	        proxy = $.proxy,
	        noop = $.noop,
	        math = Math,
	        Template,
	        JSON = window.JSON || {},
	        support = {},
	        percentRegExp = /%/,
	        formatRegExp = /\{(\d+)(:[^\}]+)?\}/g,
	        boxShadowRegExp = /(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+)?/i,
	        numberRegExp = /^(\+|-?)\d+(\.?)\d*$/,
	        FUNCTION = "function",
	        STRING = "string",
	        NUMBER = "number",
	        OBJECT = "object",
	        NULL = "null",
	        BOOLEAN = "boolean",
	        UNDEFINED = "undefined",
	        getterCache = {},
	        setterCache = {},
	        slice = [].slice;

	    kendo.version = "$KENDO_VERSION".replace(/^\s+|\s+$/g, '');

	    function Class() {}

	    Class.extend = function(proto) {
	        var base = function() {},
	            member,
	            that = this,
	            subclass = proto && proto.init ? proto.init : function () {
	                that.apply(this, arguments);
	            },
	            fn;

	        base.prototype = that.prototype;
	        fn = subclass.fn = subclass.prototype = new base();

	        for (member in proto) {
	            if (proto[member] != null && proto[member].constructor === Object) {
	                // Merge object members
	                fn[member] = extend(true, {}, base.prototype[member], proto[member]);
	            } else {
	                fn[member] = proto[member];
	            }
	        }

	        fn.constructor = subclass;
	        subclass.extend = that.extend;

	        return subclass;
	    };

	    Class.prototype._initOptions = function(options) {
	        this.options = deepExtend({}, this.options, options);
	    };

	    var isFunction = kendo.isFunction = function(fn) {
	        return typeof fn === "function";
	    };

	    var preventDefault = function() {
	        this._defaultPrevented = true;
	    };

	    var isDefaultPrevented = function() {
	        return this._defaultPrevented === true;
	    };

	    var Observable = Class.extend({
	        init: function() {
	            this._events = {};
	        },

	        bind: function(eventName, handlers, one) {
	            var that = this,
	                idx,
	                eventNames = typeof eventName === STRING ? [eventName] : eventName,
	                length,
	                original,
	                handler,
	                handlersIsFunction = typeof handlers === FUNCTION,
	                events;

	            if (handlers === undefined) {
	                for (idx in eventName) {
	                    that.bind(idx, eventName[idx]);
	                }
	                return that;
	            }

	            for (idx = 0, length = eventNames.length; idx < length; idx++) {
	                eventName = eventNames[idx];

	                handler = handlersIsFunction ? handlers : handlers[eventName];

	                if (handler) {
	                    if (one) {
	                        original = handler;
	                        handler = function() {
	                            that.unbind(eventName, handler);
	                            original.apply(that, arguments);
	                        };
	                        handler.original = original;
	                    }
	                    events = that._events[eventName] = that._events[eventName] || [];
	                    events.push(handler);
	                }
	            }

	            return that;
	        },

	        one: function(eventNames, handlers) {
	            return this.bind(eventNames, handlers, true);
	        },

	        first: function(eventName, handlers) {
	            var that = this,
	                idx,
	                eventNames = typeof eventName === STRING ? [eventName] : eventName,
	                length,
	                handler,
	                handlersIsFunction = typeof handlers === FUNCTION,
	                events;

	            for (idx = 0, length = eventNames.length; idx < length; idx++) {
	                eventName = eventNames[idx];

	                handler = handlersIsFunction ? handlers : handlers[eventName];

	                if (handler) {
	                    events = that._events[eventName] = that._events[eventName] || [];
	                    events.unshift(handler);
	                }
	            }

	            return that;
	        },

	        trigger: function(eventName, e) {
	            var that = this,
	                events = that._events[eventName],
	                idx,
	                length;

	            if (events) {
	                e = e || {};

	                e.sender = that;

	                e._defaultPrevented = false;

	                e.preventDefault = preventDefault;

	                e.isDefaultPrevented = isDefaultPrevented;

	                events = events.slice();

	                for (idx = 0, length = events.length; idx < length; idx++) {
	                    events[idx].call(that, e);
	                }

	                return e._defaultPrevented === true;
	            }

	            return false;
	        },

	        unbind: function(eventName, handler) {
	            var that = this,
	                events = that._events[eventName],
	                idx;

	            if (eventName === undefined) {
	                that._events = {};
	            } else if (events) {
	                if (handler) {
	                    for (idx = events.length - 1; idx >= 0; idx--) {
	                        if (events[idx] === handler || events[idx].original === handler) {
	                            events.splice(idx, 1);
	                        }
	                    }
	                } else {
	                    that._events[eventName] = [];
	                }
	            }

	            return that;
	        }
	    });


	     function compilePart(part, stringPart) {
	         if (stringPart) {
	             return "'" +
	                 part.split("'").join("\\'")
	                     .split('\\"').join('\\\\\\"')
	                     .replace(/\n/g, "\\n")
	                     .replace(/\r/g, "\\r")
	                     .replace(/\t/g, "\\t") + "'";
	         } else {
	             var first = part.charAt(0),
	                 rest = part.substring(1);

	             if (first === "=") {
	                 return "+(" + rest + ")+";
	             } else if (first === ":") {
	                 return "+$kendoHtmlEncode(" + rest + ")+";
	             } else {
	                 return ";" + part + ";$kendoOutput+=";
	             }
	         }
	     }

	    var argumentNameRegExp = /^\w+/,
	        encodeRegExp = /\$\{([^}]*)\}/g,
	        escapedCurlyRegExp = /\\\}/g,
	        curlyRegExp = /__CURLY__/g,
	        escapedSharpRegExp = /\\#/g,
	        sharpRegExp = /__SHARP__/g,
	        zeros = ["", "0", "00", "000", "0000"];

	    Template = {
	        paramName: "data", // name of the parameter of the generated template
	        useWithBlock: true, // whether to wrap the template in a with() block
	        render: function(template, data) {
	            var idx,
	                length,
	                html = "";

	            for (idx = 0, length = data.length; idx < length; idx++) {
	                html += template(data[idx]);
	            }

	            return html;
	        },
	        compile: function(template, options) {
	            var settings = extend({}, this, options),
	                paramName = settings.paramName,
	                argumentName = paramName.match(argumentNameRegExp)[0],
	                useWithBlock = settings.useWithBlock,
	                functionBody = "var $kendoOutput, $kendoHtmlEncode = kendo.htmlEncode;",
	                fn,
	                parts,
	                idx;

	            if (isFunction(template)) {
	                return template;
	            }

	            functionBody += useWithBlock ? "with(" + paramName + "){" : "";

	            functionBody += "$kendoOutput=";

	            parts = template
	                .replace(escapedCurlyRegExp, "__CURLY__")
	                .replace(encodeRegExp, "#=$kendoHtmlEncode($1)#")
	                .replace(curlyRegExp, "}")
	                .replace(escapedSharpRegExp, "__SHARP__")
	                .split("#");

	            for (idx = 0; idx < parts.length; idx ++) {
	                functionBody += compilePart(parts[idx], idx % 2 === 0);
	            }

	            functionBody += useWithBlock ? ";}" : ";";

	            functionBody += "return $kendoOutput;";

	            functionBody = functionBody.replace(sharpRegExp, "#");

	            try {
	                fn = new Function(argumentName, functionBody);
	                fn._slotCount = Math.floor(parts.length / 2);
	                return fn;
	            } catch(e) {
	                throw new Error(kendo.format("Invalid template:'{0}' Generated code:'{1}'", template, functionBody));
	            }
	        }
	    };

	function pad(number, digits, end) {
	    number = number + "";
	    digits = digits || 2;
	    end = digits - number.length;

	    if (end) {
	        return zeros[digits].substring(0, end) + number;
	    }

	    return number;
	}

	    //JSON stringify
	(function() {
	    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {
	            "\b": "\\b",
	            "\t": "\\t",
	            "\n": "\\n",
	            "\f": "\\f",
	            "\r": "\\r",
	            "\"" : '\\"',
	            "\\": "\\\\"
	        },
	        rep,
	        toString = {}.toString;


	    if (typeof Date.prototype.toJSON !== FUNCTION) {

	        Date.prototype.toJSON = function () {
	            var that = this;

	            return isFinite(that.valueOf()) ?
	                pad(that.getUTCFullYear(), 4) + "-" +
	                pad(that.getUTCMonth() + 1)   + "-" +
	                pad(that.getUTCDate())        + "T" +
	                pad(that.getUTCHours())       + ":" +
	                pad(that.getUTCMinutes())     + ":" +
	                pad(that.getUTCSeconds())     + "Z" : null;
	        };

	        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
	            return this.valueOf();
	        };
	    }

	    function quote(string) {
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === STRING ? c :
	                "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + "\"" : "\"" + string + "\"";
	    }

	    function str(key, holder) {
	        var i,
	            k,
	            v,
	            length,
	            mind = gap,
	            partial,
	            value = holder[key],
	            type;

	        if (value && typeof value === OBJECT && typeof value.toJSON === FUNCTION) {
	            value = value.toJSON(key);
	        }

	        if (typeof rep === FUNCTION) {
	            value = rep.call(holder, key, value);
	        }

	        type = typeof value;
	        if (type === STRING) {
	            return quote(value);
	        } else if (type === NUMBER) {
	            return isFinite(value) ? String(value) : NULL;
	        } else if (type === BOOLEAN || type === NULL) {
	            return String(value);
	        } else if (type === OBJECT) {
	            if (!value) {
	                return NULL;
	            }
	            gap += indent;
	            partial = [];
	            if (toString.apply(value) === "[object Array]") {
	                length = value.length;
	                for (i = 0; i < length; i++) {
	                    partial[i] = str(i, value) || NULL;
	                }
	                v = partial.length === 0 ? "[]" : gap ?
	                    "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" :
	                    "[" + partial.join(",") + "]";
	                gap = mind;
	                return v;
	            }
	            if (rep && typeof rep === OBJECT) {
	                length = rep.length;
	                for (i = 0; i < length; i++) {
	                    if (typeof rep[i] === STRING) {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ": " : ":") + v);
	                        }
	                    }
	                }
	            } else {
	                for (k in value) {
	                    if (Object.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ": " : ":") + v);
	                        }
	                    }
	                }
	            }

	            v = partial.length === 0 ? "{}" : gap ?
	                "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
	                "{" + partial.join(",") + "}";
	            gap = mind;
	            return v;
	        }
	    }

	    if (typeof JSON.stringify !== FUNCTION) {
	        JSON.stringify = function (value, replacer, space) {
	            var i;
	            gap = "";
	            indent = "";

	            if (typeof space === NUMBER) {
	                for (i = 0; i < space; i += 1) {
	                    indent += " ";
	                }

	            } else if (typeof space === STRING) {
	                indent = space;
	            }

	            rep = replacer;
	            if (replacer && typeof replacer !== FUNCTION && (typeof replacer !== OBJECT || typeof replacer.length !== NUMBER)) {
	                throw new Error("JSON.stringify");
	            }

	            return str("", {"": value});
	        };
	    }
	})();

	// Date and Number formatting
	(function() {
	    var dateFormatRegExp = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|"[^"]*"|'[^']*'/g,
	        standardFormatRegExp =  /^(n|c|p|e)(\d*)$/i,
	        literalRegExp = /(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g,
	        commaRegExp = /\,/g,
	        EMPTY = "",
	        POINT = ".",
	        COMMA = ",",
	        SHARP = "#",
	        ZERO = "0",
	        PLACEHOLDER = "??",
	        EN = "en-US",
	        objectToString = {}.toString;

	    //cultures
	    kendo.cultures["en-US"] = {
	        name: EN,
	        numberFormat: {
	            pattern: ["-n"],
	            decimals: 2,
	            ",": ",",
	            ".": ".",
	            groupSize: [3],
	            percent: {
	                pattern: ["-n %", "n %"],
	                decimals: 2,
	                ",": ",",
	                ".": ".",
	                groupSize: [3],
	                symbol: "%"
	            },
	            currency: {
	                name: "US Dollar",
	                abbr: "USD",
	                pattern: ["($n)", "$n"],
	                decimals: 2,
	                ",": ",",
	                ".": ".",
	                groupSize: [3],
	                symbol: "$"
	            }
	        },
	        calendars: {
	            standard: {
	                days: {
	                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	                    namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
	                },
	                months: {
	                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	                },
	                AM: [ "AM", "am", "AM" ],
	                PM: [ "PM", "pm", "PM" ],
	                patterns: {
	                    d: "M/d/yyyy",
	                    D: "dddd, MMMM dd, yyyy",
	                    F: "dddd, MMMM dd, yyyy h:mm:ss tt",
	                    g: "M/d/yyyy h:mm tt",
	                    G: "M/d/yyyy h:mm:ss tt",
	                    m: "MMMM dd",
	                    M: "MMMM dd",
	                    s: "yyyy'-'MM'-'ddTHH':'mm':'ss",
	                    t: "h:mm tt",
	                    T: "h:mm:ss tt",
	                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
	                    y: "MMMM, yyyy",
	                    Y: "MMMM, yyyy"
	                },
	                "/": "/",
	                ":": ":",
	                firstDay: 0,
	                twoDigitYearMax: 2029
	            }
	        }
	    };


	     function findCulture(culture) {
	        if (culture) {
	            if (culture.numberFormat) {
	                return culture;
	            }

	            if (typeof culture === STRING) {
	                var cultures = kendo.cultures;
	                return cultures[culture] || cultures[culture.split("-")[0]] || null;
	            }

	            return null;
	        }

	        return null;
	    }

	    function getCulture(culture) {
	        if (culture) {
	            culture = findCulture(culture);
	        }

	        return culture || kendo.cultures.current;
	    }

	    kendo.culture = function(cultureName) {
	        var cultures = kendo.cultures, culture;

	        if (cultureName !== undefined) {
	            culture = findCulture(cultureName) || cultures[EN];
	            culture.calendar = culture.calendars.standard;
	            cultures.current = culture;
	        } else {
	            return cultures.current;
	        }
	    };

	    kendo.findCulture = findCulture;
	    kendo.getCulture = getCulture;

	    //set current culture to en-US.
	    kendo.culture(EN);

	    function formatDate(date, format, culture) {
	        culture = getCulture(culture);

	        var calendar = culture.calendars.standard,
	            days = calendar.days,
	            months = calendar.months;

	        format = calendar.patterns[format] || format;

	        return format.replace(dateFormatRegExp, function (match) {
	            var minutes;
	            var result;
	            var sign;

	            if (match === "d") {
	                result = date.getDate();
	            } else if (match === "dd") {
	                result = pad(date.getDate());
	            } else if (match === "ddd") {
	                result = days.namesAbbr[date.getDay()];
	            } else if (match === "dddd") {
	                result = days.names[date.getDay()];
	            } else if (match === "M") {
	                result = date.getMonth() + 1;
	            } else if (match === "MM") {
	                result = pad(date.getMonth() + 1);
	            } else if (match === "MMM") {
	                result = months.namesAbbr[date.getMonth()];
	            } else if (match === "MMMM") {
	                result = months.names[date.getMonth()];
	            } else if (match === "yy") {
	                result = pad(date.getFullYear() % 100);
	            } else if (match === "yyyy") {
	                result = pad(date.getFullYear(), 4);
	            } else if (match === "h" ) {
	                result = date.getHours() % 12 || 12;
	            } else if (match === "hh") {
	                result = pad(date.getHours() % 12 || 12);
	            } else if (match === "H") {
	                result = date.getHours();
	            } else if (match === "HH") {
	                result = pad(date.getHours());
	            } else if (match === "m") {
	                result = date.getMinutes();
	            } else if (match === "mm") {
	                result = pad(date.getMinutes());
	            } else if (match === "s") {
	                result = date.getSeconds();
	            } else if (match === "ss") {
	                result = pad(date.getSeconds());
	            } else if (match === "f") {
	                result = math.floor(date.getMilliseconds() / 100);
	            } else if (match === "ff") {
	                result = date.getMilliseconds();
	                if (result > 99) {
	                    result = math.floor(result / 10);
	                }
	                result = pad(result);
	            } else if (match === "fff") {
	                result = pad(date.getMilliseconds(), 3);
	            } else if (match === "tt") {
	                result = date.getHours() < 12 ? calendar.AM[0] : calendar.PM[0];
	            } else if (match === "zzz") {
	                minutes = date.getTimezoneOffset();
	                sign = minutes < 0;

	                result = math.abs(minutes / 60).toString().split(".")[0];
	                minutes = math.abs(minutes) - (result * 60);

	                result = (sign ? "+" : "-") + pad(result);
	                result += ":" + pad(minutes);
	            } else if (match === "zz" || match === "z") {
	                result = date.getTimezoneOffset() / 60;
	                sign = result < 0;

	                result = math.abs(result).toString().split(".")[0];
	                result = (sign ? "+" : "-") + (match === "zz" ? pad(result) : result);
	            }

	            return result !== undefined ? result : match.slice(1, match.length - 1);
	        });
	    }

	    //number formatting
	    function formatNumber(number, format, culture) {
	        culture = getCulture(culture);

	        var numberFormat = culture.numberFormat,
	            decimal = numberFormat[POINT],
	            precision = numberFormat.decimals,
	            pattern = numberFormat.pattern[0],
	            literals = [],
	            symbol,
	            isCurrency, isPercent,
	            customPrecision,
	            formatAndPrecision,
	            negative = number < 0,
	            integer,
	            fraction,
	            integerLength,
	            fractionLength,
	            replacement = EMPTY,
	            value = EMPTY,
	            idx,
	            length,
	            ch,
	            hasGroup,
	            hasNegativeFormat,
	            decimalIndex,
	            sharpIndex,
	            zeroIndex,
	            hasZero, hasSharp,
	            percentIndex,
	            currencyIndex,
	            startZeroIndex,
	            start = -1,
	            end;

	        //return empty string if no number
	        if (number === undefined) {
	            return EMPTY;
	        }

	        if (!isFinite(number)) {
	            return number;
	        }

	        //if no format then return number.toString() or number.toLocaleString() if culture.name is not defined
	        if (!format) {
	            return culture.name.length ? number.toLocaleString() : number.toString();
	        }

	        formatAndPrecision = standardFormatRegExp.exec(format);

	        // standard formatting
	        if (formatAndPrecision) {
	            format = formatAndPrecision[1].toLowerCase();

	            isCurrency = format === "c";
	            isPercent = format === "p";

	            if (isCurrency || isPercent) {
	                //get specific number format information if format is currency or percent
	                numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
	                decimal = numberFormat[POINT];
	                precision = numberFormat.decimals;
	                symbol = numberFormat.symbol;
	                pattern = numberFormat.pattern[negative ? 0 : 1];
	            }

	            customPrecision = formatAndPrecision[2];

	            if (customPrecision) {
	                precision = +customPrecision;
	            }

	            //return number in exponential format
	            if (format === "e") {
	                return customPrecision ? number.toExponential(precision) : number.toExponential(); // toExponential() and toExponential(undefined) differ in FF #653438.
	            }

	            // multiply if format is percent
	            if (isPercent) {
	                number *= 100;
	            }

	            number = round(number, precision);
	            negative = number < 0;
	            number = number.split(POINT);

	            integer = number[0];
	            fraction = number[1];

	            //exclude "-" if number is negative.
	            if (negative) {
	                integer = integer.substring(1);
	            }

	            value = groupInteger(integer, 0, integer.length, numberFormat);

	            if (fraction) {
	                value += decimal + fraction;
	            }

	            if (format === "n" && !negative) {
	                return value;
	            }

	            number = EMPTY;

	            for (idx = 0, length = pattern.length; idx < length; idx++) {
	                ch = pattern.charAt(idx);

	                if (ch === "n") {
	                    number += value;
	                } else if (ch === "$" || ch === "%") {
	                    number += symbol;
	                } else {
	                    number += ch;
	                }
	            }

	            return number;
	        }

	        //custom formatting
	        //
	        //separate format by sections.

	        //make number positive
	        if (negative) {
	            number = -number;
	        }

	        if (format.indexOf("'") > -1 || format.indexOf("\"") > -1 || format.indexOf("\\") > -1) {
	            format = format.replace(literalRegExp, function (match) {
	                var quoteChar = match.charAt(0).replace("\\", ""),
	                    literal = match.slice(1).replace(quoteChar, "");

	                literals.push(literal);

	                return PLACEHOLDER;
	            });
	        }

	        format = format.split(";");
	        if (negative && format[1]) {
	            //get negative format
	            format = format[1];
	            hasNegativeFormat = true;
	        } else if (number === 0) {
	            //format for zeros
	            format = format[2] || format[0];
	            if (format.indexOf(SHARP) == -1 && format.indexOf(ZERO) == -1) {
	                //return format if it is string constant.
	                return format;
	            }
	        } else {
	            format = format[0];
	        }

	        percentIndex = format.indexOf("%");
	        currencyIndex = format.indexOf("$");

	        isPercent = percentIndex != -1;
	        isCurrency = currencyIndex != -1;

	        //multiply number if the format has percent
	        if (isPercent) {
	            number *= 100;
	        }

	        if (isCurrency && format[currencyIndex - 1] === "\\") {
	            format = format.split("\\").join("");
	            isCurrency = false;
	        }

	        if (isCurrency || isPercent) {
	            //get specific number format information if format is currency or percent
	            numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
	            decimal = numberFormat[POINT];
	            precision = numberFormat.decimals;
	            symbol = numberFormat.symbol;
	        }

	        hasGroup = format.indexOf(COMMA) > -1;
	        if (hasGroup) {
	            format = format.replace(commaRegExp, EMPTY);
	        }

	        decimalIndex = format.indexOf(POINT);
	        length = format.length;

	        if (decimalIndex != -1) {
	            fraction = number.toString().split("e");
	            if (fraction[1]) {
	                fraction = round(number, Math.abs(fraction[1]));
	            } else {
	                fraction = fraction[0];
	            }
	            fraction = fraction.split(POINT)[1] || EMPTY;
	            zeroIndex = format.lastIndexOf(ZERO) - decimalIndex;
	            sharpIndex = format.lastIndexOf(SHARP) - decimalIndex;
	            hasZero = zeroIndex > -1;
	            hasSharp = sharpIndex > -1;
	            idx = fraction.length;

	            if (!hasZero && !hasSharp) {
	                format = format.substring(0, decimalIndex) + format.substring(decimalIndex + 1);
	                length = format.length;
	                decimalIndex = -1;
	                idx = 0;
	            } if (hasZero && zeroIndex > sharpIndex) {
	                idx = zeroIndex;
	            } else if (sharpIndex > zeroIndex) {
	                if (hasSharp && idx > sharpIndex) {
	                    idx = sharpIndex;
	                } else if (hasZero && idx < zeroIndex) {
	                    idx = zeroIndex;
	                }
	            }

	            if (idx > -1) {
	                number = round(number, idx);
	            }
	        } else {
	            number = round(number);
	        }

	        sharpIndex = format.indexOf(SHARP);
	        startZeroIndex = zeroIndex = format.indexOf(ZERO);

	        //define the index of the first digit placeholder
	        if (sharpIndex == -1 && zeroIndex != -1) {
	            start = zeroIndex;
	        } else if (sharpIndex != -1 && zeroIndex == -1) {
	            start = sharpIndex;
	        } else {
	            start = sharpIndex > zeroIndex ? zeroIndex : sharpIndex;
	        }

	        sharpIndex = format.lastIndexOf(SHARP);
	        zeroIndex = format.lastIndexOf(ZERO);

	        //define the index of the last digit placeholder
	        if (sharpIndex == -1 && zeroIndex != -1) {
	            end = zeroIndex;
	        } else if (sharpIndex != -1 && zeroIndex == -1) {
	            end = sharpIndex;
	        } else {
	            end = sharpIndex > zeroIndex ? sharpIndex : zeroIndex;
	        }

	        if (start == length) {
	            end = start;
	        }

	        if (start != -1) {
	            value = number.toString().split(POINT);
	            integer = value[0];
	            fraction = value[1] || EMPTY;

	            integerLength = integer.length;
	            fractionLength = fraction.length;

	            if (negative && (number * -1) >= 0) {
	                negative = false;
	            }

	            number = format.substring(0, start);

	            if (negative && !hasNegativeFormat) {
	                number += "-";
	            }

	            for (idx = start; idx < length; idx++) {
	                ch = format.charAt(idx);

	                if (decimalIndex == -1) {
	                    if (end - idx < integerLength) {
	                        number += integer;
	                        break;
	                    }
	                } else {
	                    if (zeroIndex != -1 && zeroIndex < idx) {
	                        replacement = EMPTY;
	                    }

	                    if ((decimalIndex - idx) <= integerLength && decimalIndex - idx > -1) {
	                        number += integer;
	                        idx = decimalIndex;
	                    }

	                    if (decimalIndex === idx) {
	                        number += (fraction ? decimal : EMPTY) + fraction;
	                        idx += end - decimalIndex + 1;
	                        continue;
	                    }
	                }

	                if (ch === ZERO) {
	                    number += ch;
	                    replacement = ch;
	                } else if (ch === SHARP) {
	                    number += replacement;
	                }
	            }

	            if (hasGroup) {
	                number = groupInteger(number, start + (negative && !hasNegativeFormat ? 1 : 0), Math.max(end, (integerLength + start)), numberFormat);
	            }

	            if (end >= start) {
	                number += format.substring(end + 1);
	            }

	            //replace symbol placeholders
	            if (isCurrency || isPercent) {
	                value = EMPTY;
	                for (idx = 0, length = number.length; idx < length; idx++) {
	                    ch = number.charAt(idx);
	                    value += (ch === "$" || ch === "%") ? symbol : ch;
	                }
	                number = value;
	            }

	            length = literals.length;

	            if (length) {
	                for (idx = 0; idx < length; idx++) {
	                    number = number.replace(PLACEHOLDER, literals[idx]);
	                }
	            }
	        }

	        return number;
	    }

	    var groupInteger = function(number, start, end, numberFormat) {
	        var decimalIndex = number.indexOf(numberFormat[POINT]);
	        var groupSizes = numberFormat.groupSize.slice();
	        var groupSize = groupSizes.shift();
	        var integer, integerLength;
	        var idx, parts, value;
	        var newGroupSize;

	        end = decimalIndex !== -1 ? decimalIndex : end + 1;

	        integer = number.substring(start, end);
	        integerLength = integer.length;

	        if (integerLength >= groupSize) {
	            idx = integerLength;
	            parts = [];

	            while (idx > -1) {
	                value = integer.substring(idx - groupSize, idx);
	                if (value) {
	                    parts.push(value);
	                }
	                idx -= groupSize;
	                newGroupSize = groupSizes.shift();
	                groupSize = newGroupSize !== undefined ? newGroupSize : groupSize;

	                if (groupSize === 0) {
	                    parts.push(integer.substring(0, idx));
	                    break;
	                }
	            }

	            integer = parts.reverse().join(numberFormat[COMMA]);
	            number = number.substring(0, start) + integer + number.substring(end);
	        }

	        return number;
	    };

	    var round = function(value, precision) {
	        precision = precision || 0;

	        value = value.toString().split('e');
	        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision)));

	        value = value.toString().split('e');
	        value = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));

	        return value.toFixed(Math.min(precision, 20));
	    };

	    var toString = function(value, fmt, culture) {
	        if (fmt) {
	            if (objectToString.call(value) === "[object Date]") {
	                return formatDate(value, fmt, culture);
	            } else if (typeof value === NUMBER) {
	                return formatNumber(value, fmt, culture);
	            }
	        }

	        return value !== undefined ? value : "";
	    };

	    kendo.format = function(fmt) {
	        var values = arguments;

	        return fmt.replace(formatRegExp, function(match, index, placeholderFormat) {
	            var value = values[parseInt(index, 10) + 1];

	            return toString(value, placeholderFormat ? placeholderFormat.substring(1) : "");
	        });
	    };

	    kendo._extractFormat = function (format) {
	        if (format.slice(0,3) === "{0:") {
	            format = format.slice(3, format.length - 1);
	        }

	        return format;
	    };

	    kendo._activeElement = function() {
	        try {
	            return document.activeElement;
	        } catch(e) {
	            return document.documentElement.activeElement;
	        }
	    };

	    kendo._round = round;
	    kendo._outerWidth = function (element, includeMargin) { return $(element).outerWidth(includeMargin || false) || 0; };
	    kendo._outerHeight = function (element, includeMargin) { return $(element).outerHeight(includeMargin || false) || 0; };
	    kendo.toString = toString;
	})();


	(function() {
	    var nonBreakingSpaceRegExp = /\u00A0/g,
	        exponentRegExp = /[eE][\-+]?[0-9]+/,
	        shortTimeZoneRegExp = /[+|\-]\d{1,2}/,
	        longTimeZoneRegExp = /[+|\-]\d{1,2}:?\d{2}/,
	        dateRegExp = /^\/Date\((.*?)\)\/$/,
	        offsetRegExp = /[+-]\d*/,
	        FORMATS_SEQUENCE = [ [], [ "G", "g", "F" ], [ "D", "d", "y", "m", "T", "t" ] ],
	        STANDARD_FORMATS = [
	            [
	            "yyyy-MM-ddTHH:mm:ss.fffffffzzz",
	            "yyyy-MM-ddTHH:mm:ss.fffffff",
	            "yyyy-MM-ddTHH:mm:ss.fffzzz",
	            "yyyy-MM-ddTHH:mm:ss.fff",
	            "ddd MMM dd yyyy HH:mm:ss",
	            "yyyy-MM-ddTHH:mm:sszzz",
	            "yyyy-MM-ddTHH:mmzzz",
	            "yyyy-MM-ddTHH:mmzz",
	            "yyyy-MM-ddTHH:mm:ss",
	            "yyyy-MM-dd HH:mm:ss",
	            "yyyy/MM/dd HH:mm:ss"
	            ], [
	            "yyyy-MM-ddTHH:mm",
	            "yyyy-MM-dd HH:mm",
	            "yyyy/MM/dd HH:mm"
	            ], [
	            "yyyy/MM/dd",
	            "yyyy-MM-dd",
	            "HH:mm:ss",
	            "HH:mm"
	            ]
	        ],
	        numberRegExp = {
	            2: /^\d{1,2}/,
	            3: /^\d{1,3}/,
	            4: /^\d{4}/
	        },
	        objectToString = {}.toString;

	    function outOfRange(value, start, end) {
	        return !(value >= start && value <= end);
	    }

	    function designatorPredicate(designator) {
	        return designator.charAt(0);
	    }

	    function mapDesignators(designators) {
	        return $.map(designators, designatorPredicate);
	    }

	    //if date's day is different than the typed one - adjust
	    function adjustDST(date, hours) {
	        if (!hours && date.getHours() === 23) {
	            date.setHours(date.getHours() + 2);
	        }
	    }

	    function lowerArray(data) {
	        var idx = 0,
	            length = data.length,
	            array = [];

	        for (; idx < length; idx++) {
	            array[idx] = (data[idx] + "").toLowerCase();
	        }

	        return array;
	    }

	    function lowerLocalInfo(localInfo) {
	        var newLocalInfo = {}, property;

	        for (property in localInfo) {
	            newLocalInfo[property] = lowerArray(localInfo[property]);
	        }

	        return newLocalInfo;
	    }

	    function parseExact(value, format, culture) {
	        if (!value) {
	            return null;
	        }

	        var lookAhead = function (match) {
	                var i = 0;
	                while (format[idx] === match) {
	                    i++;
	                    idx++;
	                }
	                if (i > 0) {
	                    idx -= 1;
	                }
	                return i;
	            },
	            getNumber = function(size) {
	                var rg = numberRegExp[size] || new RegExp('^\\d{1,' + size + '}'),
	                    match = value.substr(valueIdx, size).match(rg);

	                if (match) {
	                    match = match[0];
	                    valueIdx += match.length;
	                    return parseInt(match, 10);
	                }
	                return null;
	            },
	            getIndexByName = function (names, lower) {
	                var i = 0,
	                    length = names.length,
	                    name, nameLength,
	                    matchLength = 0,
	                    matchIdx = 0,
	                    subValue;

	                for (; i < length; i++) {
	                    name = names[i];
	                    nameLength = name.length;
	                    subValue = value.substr(valueIdx, nameLength);

	                    if (lower) {
	                        subValue = subValue.toLowerCase();
	                    }

	                    if (subValue == name && nameLength > matchLength) {
	                        matchLength = nameLength;
	                        matchIdx = i;
	                    }
	                }

	                if (matchLength) {
	                    valueIdx += matchLength;
	                    return matchIdx + 1;
	                }

	                return null;
	            },
	            checkLiteral = function() {
	                var result = false;
	                if (value.charAt(valueIdx) === format[idx]) {
	                    valueIdx++;
	                    result = true;
	                }
	                return result;
	            },
	            calendar = culture.calendars.standard,
	            year = null,
	            month = null,
	            day = null,
	            hours = null,
	            minutes = null,
	            seconds = null,
	            milliseconds = null,
	            idx = 0,
	            valueIdx = 0,
	            literal = false,
	            date = new Date(),
	            twoDigitYearMax = calendar.twoDigitYearMax || 2029,
	            defaultYear = date.getFullYear(),
	            ch, count, length, pattern,
	            pmHour, UTC, matches,
	            amDesignators, pmDesignators,
	            hoursOffset, minutesOffset,
	            hasTime, match;

	        if (!format) {
	            format = "d"; //shord date format
	        }

	        //if format is part of the patterns get real format
	        pattern = calendar.patterns[format];
	        if (pattern) {
	            format = pattern;
	        }

	        format = format.split("");
	        length = format.length;

	        for (; idx < length; idx++) {
	            ch = format[idx];

	            if (literal) {
	                if (ch === "'") {
	                    literal = false;
	                } else {
	                    checkLiteral();
	                }
	            } else {
	                if (ch === "d") {
	                    count = lookAhead("d");
	                    if (!calendar._lowerDays) {
	                        calendar._lowerDays = lowerLocalInfo(calendar.days);
	                    }

	                    if (day !== null && count > 2) {
	                        continue;
	                    }

	                    day = count < 3 ? getNumber(2) : getIndexByName(calendar._lowerDays[count == 3 ? "namesAbbr" : "names"], true);

	                    if (day === null || outOfRange(day, 1, 31)) {
	                        return null;
	                    }
	                } else if (ch === "M") {
	                    count = lookAhead("M");
	                    if (!calendar._lowerMonths) {
	                        calendar._lowerMonths = lowerLocalInfo(calendar.months);
	                    }
	                    month = count < 3 ? getNumber(2) : getIndexByName(calendar._lowerMonths[count == 3 ? 'namesAbbr' : 'names'], true);

	                    if (month === null || outOfRange(month, 1, 12)) {
	                        return null;
	                    }
	                    month -= 1; //because month is zero based
	                } else if (ch === "y") {
	                    count = lookAhead("y");
	                    year = getNumber(count);

	                    if (year === null) {
	                        return null;
	                    }

	                    if (count == 2) {
	                        if (typeof twoDigitYearMax === "string") {
	                            twoDigitYearMax = defaultYear + parseInt(twoDigitYearMax, 10);
	                        }

	                        year = (defaultYear - defaultYear % 100) + year;
	                        if (year > twoDigitYearMax) {
	                            year -= 100;
	                        }
	                    }
	                } else if (ch === "h" ) {
	                    lookAhead("h");
	                    hours = getNumber(2);
	                    if (hours == 12) {
	                        hours = 0;
	                    }
	                    if (hours === null || outOfRange(hours, 0, 11)) {
	                        return null;
	                    }
	                } else if (ch === "H") {
	                    lookAhead("H");
	                    hours = getNumber(2);
	                    if (hours === null || outOfRange(hours, 0, 23)) {
	                        return null;
	                    }
	                } else if (ch === "m") {
	                    lookAhead("m");
	                    minutes = getNumber(2);
	                    if (minutes === null || outOfRange(minutes, 0, 59)) {
	                        return null;
	                    }
	                } else if (ch === "s") {
	                    lookAhead("s");
	                    seconds = getNumber(2);
	                    if (seconds === null || outOfRange(seconds, 0, 59)) {
	                        return null;
	                    }
	                } else if (ch === "f") {
	                    count = lookAhead("f");

	                    match = value.substr(valueIdx, count).match(numberRegExp[3]);
	                    milliseconds = getNumber(count); //move value index position

	                    if (milliseconds !== null) {
	                        milliseconds = parseFloat("0." + match[0], 10);
	                        milliseconds = kendo._round(milliseconds, 3);
	                        milliseconds *= 1000;
	                    }

	                    if (milliseconds === null || outOfRange(milliseconds, 0, 999)) {
	                        return null;
	                    }

	                } else if (ch === "t") {
	                    count = lookAhead("t");
	                    amDesignators = calendar.AM;
	                    pmDesignators = calendar.PM;

	                    if (count === 1) {
	                        amDesignators = mapDesignators(amDesignators);
	                        pmDesignators = mapDesignators(pmDesignators);
	                    }

	                    pmHour = getIndexByName(pmDesignators);
	                    if (!pmHour && !getIndexByName(amDesignators)) {
	                        return null;
	                    }
	                }
	                else if (ch === "z") {
	                    UTC = true;
	                    count = lookAhead("z");

	                    if (value.substr(valueIdx, 1) === "Z") {
	                        checkLiteral();
	                        continue;
	                    }

	                    matches = value.substr(valueIdx, 6)
	                                   .match(count > 2 ? longTimeZoneRegExp : shortTimeZoneRegExp);

	                    if (!matches) {
	                        return null;
	                    }

	                    matches = matches[0].split(":");

	                    hoursOffset = matches[0];
	                    minutesOffset = matches[1];

	                    if (!minutesOffset && hoursOffset.length > 3) { //(+|-)[hh][mm] format is used
	                        valueIdx = hoursOffset.length - 2;
	                        minutesOffset = hoursOffset.substring(valueIdx);
	                        hoursOffset = hoursOffset.substring(0, valueIdx);
	                    }

	                    hoursOffset = parseInt(hoursOffset, 10);
	                    if (outOfRange(hoursOffset, -12, 13)) {
	                        return null;
	                    }

	                    if (count > 2) {
	                        minutesOffset = parseInt(minutesOffset, 10);
	                        if (isNaN(minutesOffset) || outOfRange(minutesOffset, 0, 59)) {
	                            return null;
	                        }
	                    }
	                } else if (ch === "'") {
	                    literal = true;
	                    checkLiteral();
	                } else if (!checkLiteral()) {
	                    return null;
	                }
	            }
	        }

	        hasTime = hours !== null || minutes !== null || seconds || null;

	        if (year === null && month === null && day === null && hasTime) {
	            year = defaultYear;
	            month = date.getMonth();
	            day = date.getDate();
	        } else {
	            if (year === null) {
	                year = defaultYear;
	            }

	            if (day === null) {
	                day = 1;
	            }
	        }

	        if (pmHour && hours < 12) {
	            hours += 12;
	        }

	        if (UTC) {
	            if (hoursOffset) {
	                hours += -hoursOffset;
	            }

	            if (minutesOffset) {
	                minutes += -minutesOffset;
	            }

	            value = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
	        } else {
	            value = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	            adjustDST(value, hours);
	        }

	        if (year < 100) {
	            value.setFullYear(year);
	        }

	        if (value.getDate() !== day && UTC === undefined) {
	            return null;
	        }

	        return value;
	    }

	    function parseMicrosoftFormatOffset(offset) {
	        var sign = offset.substr(0, 1) === "-" ? -1 : 1;

	        offset = offset.substring(1);
	        offset = (parseInt(offset.substr(0, 2), 10) * 60) + parseInt(offset.substring(2), 10);

	        return sign * offset;
	    }

	    function getDefaultFormats(culture) {
	        var length = math.max(FORMATS_SEQUENCE.length, STANDARD_FORMATS.length);
	        var patterns = culture.calendar.patterns;
	        var cultureFormats, formatIdx, idx;
	        var formats = [];

	        for (idx = 0; idx < length; idx++) {
	            cultureFormats = FORMATS_SEQUENCE[idx];
	            for (formatIdx = 0; formatIdx < cultureFormats.length; formatIdx++) {
	                formats.push(patterns[cultureFormats[formatIdx]]);
	            }
	            formats = formats.concat(STANDARD_FORMATS[idx]);
	        }

	        return formats;
	    }

	    kendo.parseDate = function(value, formats, culture) {
	        if (objectToString.call(value) === "[object Date]") {
	            return value;
	        }

	        var idx = 0;
	        var date = null;
	        var length;
	        var tzoffset;

	        if (value && value.indexOf("/D") === 0) {
	            date = dateRegExp.exec(value);
	            if (date) {
	                date = date[1];
	                tzoffset = offsetRegExp.exec(date.substring(1));

	                date = new Date(parseInt(date, 10));

	                if (tzoffset) {
	                    tzoffset = parseMicrosoftFormatOffset(tzoffset[0]);
	                    date = kendo.timezone.apply(date, 0);
	                    date = kendo.timezone.convert(date, 0, -1 * tzoffset);
	                }

	                return date;
	            }
	        }

	        culture = kendo.getCulture(culture);

	        if (!formats) {
	            formats = getDefaultFormats(culture);
	        }

	        formats = isArray(formats) ? formats: [formats];
	        length = formats.length;

	        for (; idx < length; idx++) {
	            date = parseExact(value, formats[idx], culture);
	            if (date) {
	                return date;
	            }
	        }

	        return date;
	    };

	    kendo.parseInt = function(value, culture) {
	        var result = kendo.parseFloat(value, culture);
	        if (result) {
	            result = result | 0;
	        }
	        return result;
	    };

	    kendo.parseFloat = function(value, culture, format) {
	        if (!value && value !== 0) {
	           return null;
	        }

	        if (typeof value === NUMBER) {
	           return value;
	        }

	        value = value.toString();
	        culture = kendo.getCulture(culture);

	        var number = culture.numberFormat,
	            percent = number.percent,
	            currency = number.currency,
	            symbol = currency.symbol,
	            percentSymbol = percent.symbol,
	            negative = value.indexOf("-"),
	            parts, isPercent;

	        //handle exponential number
	        if (exponentRegExp.test(value)) {
	            value = parseFloat(value.replace(number["."], "."));
	            if (isNaN(value)) {
	                value = null;
	            }
	            return value;
	        }

	        if (negative > 0) {
	            return null;
	        } else {
	            negative = negative > -1;
	        }

	        if (value.indexOf(symbol) > -1 || (format && format.toLowerCase().indexOf("c") > -1)) {
	            number = currency;
	            parts = number.pattern[0].replace("$", symbol).split("n");
	            if (value.indexOf(parts[0]) > -1 && value.indexOf(parts[1]) > -1) {
	                value = value.replace(parts[0], "").replace(parts[1], "");
	                negative = true;
	            }
	        } else if (value.indexOf(percentSymbol) > -1) {
	            isPercent = true;
	            number = percent;
	            symbol = percentSymbol;
	        }

	        value = value.replace("-", "")
	                     .replace(symbol, "")
	                     .replace(nonBreakingSpaceRegExp, " ")
	                     .split(number[","].replace(nonBreakingSpaceRegExp, " ")).join("")
	                     .replace(number["."], ".");

	        value = parseFloat(value);

	        if (isNaN(value)) {
	            value = null;
	        } else if (negative) {
	            value *= -1;
	        }

	        if (value && isPercent) {
	            value /= 100;
	        }

	        return value;
	    };
	})();

	    function getShadows(element) {
	        var shadow = element.css(kendo.support.transitions.css + "box-shadow") || element.css("box-shadow"),
	            radius = shadow ? shadow.match(boxShadowRegExp) || [ 0, 0, 0, 0, 0 ] : [ 0, 0, 0, 0, 0 ],
	            blur = math.max((+radius[3]), +(radius[4] || 0));

	        return {
	            left: (-radius[1]) + blur,
	            right: (+radius[1]) + blur,
	            bottom: (+radius[2]) + blur
	        };
	    }

	    function wrap(element, autosize) {
	        var browser = support.browser,
	            percentage,
	            outerWidth = kendo._outerWidth,
	            outerHeight = kendo._outerHeight;

	        if (!element.parent().hasClass("k-animation-container")) {
	            var width = element[0].style.width,
	                height = element[0].style.height,
	                percentWidth = percentRegExp.test(width),
	                percentHeight = percentRegExp.test(height);

	            percentage = percentWidth || percentHeight;

	            if (!percentWidth && (!autosize || (autosize && width))) { width = outerWidth(element); }
	            if (!percentHeight && (!autosize || (autosize && height))) { height = outerHeight(element); }

	            element.wrap(
	                         $("<div/>")
	                         .addClass("k-animation-container")
	                         .css({
	                             width: width,
	                             height: height
	                         }));

	            if (percentage) {
	                element.css({
	                    width: "100%",
	                    height: "100%",
	                    boxSizing: "border-box",
	                    mozBoxSizing: "border-box",
	                    webkitBoxSizing: "border-box"
	                });
	            }
	        } else {
	            var wrapper = element.parent(".k-animation-container"),
	                wrapperStyle = wrapper[0].style;

	            if (wrapper.is(":hidden")) {
	                wrapper.show();
	            }

	            percentage = percentRegExp.test(wrapperStyle.width) || percentRegExp.test(wrapperStyle.height);

	            if (!percentage) {
	                wrapper.css({
	                    width: outerWidth(element),
	                    height: outerHeight(element),
	                    boxSizing: "content-box",
	                    mozBoxSizing: "content-box",
	                    webkitBoxSizing: "content-box"
	                });
	            }
	        }

	        if (browser.msie && math.floor(browser.version) <= 7) {
	            element.css({ zoom: 1 });
	            element.children(".k-menu").width(element.width());
	        }

	        return element.parent();
	    }

	    function deepExtend(destination) {
	        var i = 1,
	            length = arguments.length;

	        for (i = 1; i < length; i++) {
	            deepExtendOne(destination, arguments[i]);
	        }

	        return destination;
	    }

	    function deepExtendOne(destination, source) {
	        var ObservableArray = kendo.data.ObservableArray,
	            LazyObservableArray = kendo.data.LazyObservableArray,
	            DataSource = kendo.data.DataSource,
	            HierarchicalDataSource = kendo.data.HierarchicalDataSource,
	            property,
	            propValue,
	            propType,
	            propInit,
	            destProp;

	        for (property in source) {
	            propValue = source[property];
	            propType = typeof propValue;

	            if (propType === OBJECT && propValue !== null) {
	                propInit = propValue.constructor;
	            } else {
	                propInit = null;
	            }

	            if (propInit &&
	                propInit !== Array && propInit !== ObservableArray && propInit !== LazyObservableArray &&
	                propInit !== DataSource && propInit !== HierarchicalDataSource && propInit !== RegExp) {

	                if (propValue instanceof Date) {
	                    destination[property] = new Date(propValue.getTime());
	                } else if (isFunction(propValue.clone)) {
	                    destination[property] = propValue.clone();
	                } else {
	                    destProp = destination[property];
	                    if (typeof (destProp) === OBJECT) {
	                        destination[property] = destProp || {};
	                    } else {
	                        destination[property] = {};
	                    }
	                    deepExtendOne(destination[property], propValue);
	                }
	            } else if (propType !== UNDEFINED) {
	                destination[property] = propValue;
	            }
	        }

	        return destination;
	    }

	    function testRx(agent, rxs, dflt) {
	        for (var rx in rxs) {
	            if (rxs.hasOwnProperty(rx) && rxs[rx].test(agent)) {
	                return rx;
	            }
	        }
	        return dflt !== undefined ? dflt : agent;
	    }

	    function toHyphens(str) {
	        return str.replace(/([a-z][A-Z])/g, function (g) {
	            return g.charAt(0) + '-' + g.charAt(1).toLowerCase();
	        });
	    }

	    function toCamelCase(str) {
	        return str.replace(/\-(\w)/g, function (strMatch, g1) {
	            return g1.toUpperCase();
	        });
	    }

	    function getComputedStyles(element, properties) {
	        var styles = {}, computedStyle;

	        if (document.defaultView && document.defaultView.getComputedStyle) {
	            computedStyle = document.defaultView.getComputedStyle(element, "");

	            if (properties) {
	                $.each(properties, function(idx, value) {
	                    styles[value] = computedStyle.getPropertyValue(value);
	                });
	            }
	        } else {
	            computedStyle = element.currentStyle;

	            if (properties) {
	                $.each(properties, function(idx, value) {
	                    styles[value] = computedStyle[toCamelCase(value)];
	                });
	            }
	        }

	        if (!kendo.size(styles)) {
	            styles = computedStyle;
	        }

	        return styles;
	    }

	    function isScrollable(element) {
	        if (element && element.className && typeof(element.className) === "string" && element.className.indexOf("k-auto-scrollable") > -1) {
	            return true;
	        }

	        var overflow = getComputedStyles(element, ["overflow"]).overflow;
	        return overflow == "auto" || overflow == "scroll";
	    }

	    function scrollLeft(element, value) {
	        var webkit = support.browser.webkit;
	        var mozila = support.browser.mozilla;
	        var el = element instanceof $ ? element[0] : element;
	        var isRtl;

	        if (!element) {
	            return;
	        }

	        isRtl = support.isRtl(element);

	        if (value !== undefined) {
	            if (isRtl && webkit) {
	                el.scrollLeft = el.scrollWidth - el.clientWidth - value;
	            } else if (isRtl && mozila) {
	                el.scrollLeft = -value;
	            } else {
	                el.scrollLeft = value;
	            }
	        } else {
	            if (isRtl && webkit) {
	                return el.scrollWidth - el.clientWidth - el.scrollLeft;
	            } else {
	                return Math.abs(el.scrollLeft);
	            }
	        }
	    }

	    (function () {
	        support._scrollbar = undefined;

	        support.scrollbar = function (refresh) {
	            if (!isNaN(support._scrollbar) && !refresh) {
	                return support._scrollbar;
	            } else {
	                var div = document.createElement("div"),
	                    result;

	                div.style.cssText = "overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block";
	                div.innerHTML = "&nbsp;";
	                document.body.appendChild(div);

	                support._scrollbar = result = div.offsetWidth - div.scrollWidth;

	                document.body.removeChild(div);

	                return result;
	            }
	        };

	        support.isRtl = function(element) {
	            return $(element).closest(".k-rtl").length > 0;
	        };

	        var table = document.createElement("table");

	        // Internet Explorer does not support setting the innerHTML of TBODY and TABLE elements
	        try {
	            table.innerHTML = "<tr><td></td></tr>";

	            support.tbodyInnerHtml = true;
	        } catch (e) {
	            support.tbodyInnerHtml = false;
	        }

	        support.touch = "ontouchstart" in window;

	        var docStyle = document.documentElement.style;
	        var transitions = support.transitions = false,
	            transforms = support.transforms = false,
	            elementProto = "HTMLElement" in window ? HTMLElement.prototype : [];

	        support.hasHW3D = ("WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix()) || "MozPerspective" in docStyle || "msPerspective" in docStyle;
	        support.cssFlexbox = ("flexWrap" in docStyle) || ("WebkitFlexWrap" in docStyle) || ("msFlexWrap" in docStyle);

	        each([ "Moz", "webkit", "O", "ms" ], function () {
	            var prefix = this.toString(),
	                hasTransitions = typeof table.style[prefix + "Transition"] === STRING;

	            if (hasTransitions || typeof table.style[prefix + "Transform"] === STRING) {
	                var lowPrefix = prefix.toLowerCase();

	                transforms = {
	                    css: (lowPrefix != "ms") ? "-" + lowPrefix + "-" : "",
	                    prefix: prefix,
	                    event: (lowPrefix === "o" || lowPrefix === "webkit") ? lowPrefix : ""
	                };

	                if (hasTransitions) {
	                    transitions = transforms;
	                    transitions.event = transitions.event ? transitions.event + "TransitionEnd" : "transitionend";
	                }

	                return false;
	            }
	        });

	        table = null;

	        support.transforms = transforms;
	        support.transitions = transitions;

	        support.devicePixelRatio = window.devicePixelRatio === undefined ? 1 : window.devicePixelRatio;

	        try {
	            support.screenWidth = window.outerWidth || window.screen ? window.screen.availWidth : window.innerWidth;
	            support.screenHeight = window.outerHeight || window.screen ? window.screen.availHeight : window.innerHeight;
	        } catch(e) {
	            //window.outerWidth throws error when in IE showModalDialog.
	            support.screenWidth = window.screen.availWidth;
	            support.screenHeight = window.screen.availHeight;
	        }

	        support.detectOS = function (ua) {
	            var os = false, minorVersion, match = [],
	                notAndroidPhone = !/mobile safari/i.test(ua),
	                agentRxs = {
	                    wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
	                    fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
	                    android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.(\d+(\.\d+)?)/,
	                    iphone: /(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,
	                    ipad: /(iPad).*OS\s+(\d+)[\._]([\d_]+)/,
	                    meego: /(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,
	                    webos: /(webOS)\/(\d+)\.(\d+(\.\d+)?)/,
	                    blackberry: /(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,
	                    playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
	                    windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
	                    tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
	                    sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,
	                    ffos: /(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/
	                },
	                osRxs = {
	                    ios: /^i(phone|pad|pod)$/i,
	                    android: /^android|fire$/i,
	                    blackberry: /^blackberry|playbook/i,
	                    windows: /windows/,
	                    wp: /wp/,
	                    flat: /sailfish|ffos|tizen/i,
	                    meego: /meego/
	                },
	                formFactorRxs = {
	                    tablet: /playbook|ipad|fire/i
	                },
	                browserRxs = {
	                    omini: /Opera\sMini/i,
	                    omobile: /Opera\sMobi/i,
	                    firefox: /Firefox|Fennec/i,
	                    mobilesafari: /version\/.*safari/i,
	                    ie: /MSIE|Windows\sPhone/i,
	                    chrome: /chrome|crios/i,
	                    webkit: /webkit/i
	                };

	            for (var agent in agentRxs) {
	                if (agentRxs.hasOwnProperty(agent)) {
	                    match = ua.match(agentRxs[agent]);
	                    if (match) {
	                        if (agent == "windows" && "plugins" in navigator) { return false; } // Break if not Metro/Mobile Windows

	                        os = {};
	                        os.device = agent;
	                        os.tablet = testRx(agent, formFactorRxs, false);
	                        os.browser = testRx(ua, browserRxs, "default");
	                        os.name = testRx(agent, osRxs);
	                        os[os.name] = true;
	                        os.majorVersion = match[2];
	                        os.minorVersion = match[3].replace("_", ".");
	                        minorVersion = os.minorVersion.replace(".", "").substr(0, 2);
	                        os.flatVersion = os.majorVersion + minorVersion + (new Array(3 - (minorVersion.length < 3 ? minorVersion.length : 2)).join("0"));
	                        os.cordova = typeof window.PhoneGap !== UNDEFINED || typeof window.cordova !== UNDEFINED; // Use file protocol to detect appModes.
	                        os.appMode = window.navigator.standalone || (/file|local|wmapp/).test(window.location.protocol) || os.cordova; // Use file protocol to detect appModes.

	                        if (os.android && (support.devicePixelRatio < 1.5 && os.flatVersion < 400 || notAndroidPhone) && (support.screenWidth > 800 || support.screenHeight > 800)) {
	                            os.tablet = agent;
	                        }

	                        break;
	                    }
	                }
	            }
	            return os;
	        };

	        var mobileOS = support.mobileOS = support.detectOS(navigator.userAgent);

	        support.wpDevicePixelRatio = mobileOS.wp ? screen.width / 320 : 0;

	        support.hasNativeScrolling = false;

	        if (mobileOS.ios || (mobileOS.android && mobileOS.majorVersion > 2) || mobileOS.wp) {
	            support.hasNativeScrolling = mobileOS;
	        }

	        support.delayedClick = function() {

	            // only the mobile devices with touch events do this.
	            if (support.touch) {
	                // All iOS devices so far (by the time I am writing this, iOS 9.0.2 is the latest),
	                // delay their click events.
	                if (mobileOS.ios) {
	                    return true;
	                }

	                if (mobileOS.android) {

	                    if (!support.browser.chrome) { // older webkits and webviews delay the click
	                        return true;
	                    }

	                    // from here on, we deal with Chrome on Android.
	                    if (support.browser.version < 32) {
	                        return false;
	                    }

	                    // Chrome 32+ does conditional fast clicks if the view port is not user scalable.
	                    return !($("meta[name=viewport]").attr("content") || "").match(/user-scalable=no/i);
	                }
	            }

	            return false;
	        };

	        support.mouseAndTouchPresent = support.touch && !(support.mobileOS.ios || support.mobileOS.android);

	        support.detectBrowser = function(ua) {
	            var browser = false, match = [],
	                browserRxs = {
	                    edge: /(edge)[ \/]([\w.]+)/i,
	                    webkit: /(chrome)[ \/]([\w.]+)/i,
	                    safari: /(webkit)[ \/]([\w.]+)/i,
	                    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
	                    msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
	                    mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
	                };

	            for (var agent in browserRxs) {
	                if (browserRxs.hasOwnProperty(agent)) {
	                    match = ua.match(browserRxs[agent]);
	                    if (match) {
	                        browser = {};
	                        browser[agent] = true;
	                        browser[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
	                        browser.version = parseInt(document.documentMode || match[2], 10);

	                        break;
	                    }
	                }
	            }

	            return browser;
	        };

	        support.browser = support.detectBrowser(navigator.userAgent);

	        support.detectClipboardAccess = function() {
	            var commands = {
	                copy: document.queryCommandSupported ? document.queryCommandSupported("copy") : false,
	                cut: document.queryCommandSupported ? document.queryCommandSupported("cut") : false,
	                paste : document.queryCommandSupported ? document.queryCommandSupported("paste") : false
	            };

	            if (support.browser.chrome) {
	                //not using queryCommandSupported due to chromium issues 476508 and 542948
	                commands.paste = false;
	                if(support.browser.version >= 43) {
	                    commands.copy = true;
	                    commands.cut = true;
	                }
	            }

	            return commands;
	        };

	        support.clipboard = support.detectClipboardAccess();

	        support.zoomLevel = function() {
	            try {
	                var browser = support.browser;
	                var ie11WidthCorrection = 0;
	                var docEl = document.documentElement;

	                if (browser.msie && browser.version == 11 && docEl.scrollHeight > docEl.clientHeight && !support.touch) {
	                    ie11WidthCorrection = support.scrollbar();
	                }

	                return support.touch ? (docEl.clientWidth / window.innerWidth) :
	                       browser.msie && browser.version >= 10 ? (((top || window).document.documentElement.offsetWidth + ie11WidthCorrection) / (top || window).innerWidth) : 1;
	            } catch(e) {
	                return 1;
	            }
	        };

	        support.cssBorderSpacing = typeof docStyle.borderSpacing != "undefined" && !(support.browser.msie && support.browser.version < 8);

	        (function(browser) {
	            // add browser-specific CSS class
	            var cssClass = "",
	                docElement = $(document.documentElement),
	                majorVersion = parseInt(browser.version, 10);

	            if (browser.msie) {
	                cssClass = "ie";
	            } else if (browser.mozilla) {
	                cssClass = "ff";
	            } else if (browser.safari) {
	                cssClass = "safari";
	            } else if (browser.webkit) {
	                cssClass = "webkit";
	            } else if (browser.opera) {
	                cssClass = "opera";
	            } else if (browser.edge) {
	                cssClass = "edge";
	            }

	            if (cssClass) {
	                cssClass = "k-" + cssClass + " k-" + cssClass + majorVersion;
	            }
	            if (support.mobileOS) {
	                cssClass += " k-mobile";
	            }

	            if (!support.cssFlexbox) {
	                cssClass += " k-no-flexbox";
	            }

	            docElement.addClass(cssClass);
	        })(support.browser);

	        support.eventCapture = document.documentElement.addEventListener;

	        var input = document.createElement("input");

	        support.placeholder = "placeholder" in input;
	        support.propertyChangeEvent = "onpropertychange" in input;

	        support.input = (function() {
	            var types = ["number", "date", "time", "month", "week", "datetime", "datetime-local"];
	            var length = types.length;
	            var value = "test";
	            var result = {};
	            var idx = 0;
	            var type;

	            for (;idx < length; idx++) {
	                type = types[idx];
	                input.setAttribute("type", type);
	                input.value = value;

	                result[type.replace("-", "")] = input.type !== "text" && input.value !== value;
	            }

	            return result;
	        })();

	        input.style.cssText = "float:left;";

	        support.cssFloat = !!input.style.cssFloat;

	        input = null;

	        support.stableSort = (function() {
	            // Chrome sort is not stable for more than *10* items
	            // IE9+ sort is not stable for than *512* items
	            var threshold = 513;

	            var sorted = [{
	                index: 0,
	                field: "b"
	            }];

	            for (var i = 1; i < threshold; i++) {
	                sorted.push({
	                    index: i,
	                    field: "a"
	                });
	            }

	            sorted.sort(function(a, b) {
	                return a.field > b.field ? 1 : (a.field < b.field ? -1 : 0);
	            });

	            return sorted[0].index === 1;
	        })();

	        support.matchesSelector = elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector ||
	                                  elementProto.msMatchesSelector || elementProto.oMatchesSelector ||
	                                  elementProto.matchesSelector || elementProto.matches ||
	          function( selector ) {
	              var nodeList = document.querySelectorAll ? ( this.parentNode || document ).querySelectorAll( selector ) || [] : $(selector),
	                  i = nodeList.length;

	              while (i--) {
	                  if (nodeList[i] == this) {
	                      return true;
	                  }
	              }

	              return false;
	          };

	        support.pushState = window.history && window.history.pushState;

	        var documentMode = document.documentMode;

	        support.hashChange = ("onhashchange" in window) && !(support.browser.msie && (!documentMode || documentMode <= 8)); // old IE detection

	        support.customElements = ("registerElement" in window.document);

	        var chrome = support.browser.chrome;
	        support.msPointers = !chrome && window.MSPointerEvent;
	        support.pointers = !chrome && window.PointerEvent;
	        support.kineticScrollNeeded = mobileOS && (support.touch || support.msPointers || support.pointers);
	    })();


	    function size(obj) {
	        var result = 0, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key) && key != "toJSON") { // Ignore fake IE7 toJSON.
	                result++;
	            }
	        }

	        return result;
	    }

	    function getOffset(element, type, positioned) {
	        if (!type) {
	            type = "offset";
	        }

	        var offset = element[type]();
	        // clone ClientRect object to JS object (jQuery3)
	        var result = {
	            top: offset.top,
	            right: offset.right,
	            bottom: offset.bottom,
	            left: offset.left
	        };

	        // IE10 touch zoom is living in a separate viewport
	        if (support.browser.msie && (support.pointers || support.msPointers) && !positioned) {
	            var sign = support.isRtl(element) ? 1 : -1;
	            result.top -= (window.pageYOffset + (sign * document.documentElement.scrollTop));
	            result.left -= (window.pageXOffset + (sign * document.documentElement.scrollLeft));
	        }

	        return result;
	    }

	    var directions = {
	        left: { reverse: "right" },
	        right: { reverse: "left" },
	        down: { reverse: "up" },
	        up: { reverse: "down" },
	        top: { reverse: "bottom" },
	        bottom: { reverse: "top" },
	        "in": { reverse: "out" },
	        out: { reverse: "in" }
	    };

	    function parseEffects(input) {
	        var effects = {};

	        each((typeof input === "string" ? input.split(" ") : input), function(idx) {
	            effects[idx] = this;
	        });

	        return effects;
	    }

	    function fx(element) {
	        return new kendo.effects.Element(element);
	    }

	    var effects = {};

	    $.extend(effects, {
	        enabled: true,
	        Element: function(element) {
	            this.element = $(element);
	        },

	        promise: function(element, options) {
	            if (!element.is(":visible")) {
	                element.css({ display: element.data("olddisplay") || "block" }).css("display");
	            }

	            if (options.hide) {
	                element.data("olddisplay", element.css("display")).hide();
	            }

	            if (options.init) {
	                options.init();
	            }

	            if (options.completeCallback) {
	                options.completeCallback(element); // call the external complete callback with the element
	            }

	            element.dequeue();
	        },

	        disable: function() {
	            this.enabled = false;
	            this.promise = this.promiseShim;
	        },

	        enable: function() {
	            this.enabled = true;
	            this.promise = this.animatedPromise;
	        }
	    });

	    effects.promiseShim = effects.promise;

	    function prepareAnimationOptions(options, duration, reverse, complete) {
	        if (typeof options === STRING) {
	            // options is the list of effect names separated by space e.g. animate(element, "fadeIn slideDown")

	            // only callback is provided e.g. animate(element, options, function() {});
	            if (isFunction(duration)) {
	                complete = duration;
	                duration = 400;
	                reverse = false;
	            }

	            if (isFunction(reverse)) {
	                complete = reverse;
	                reverse = false;
	            }

	            if (typeof duration === BOOLEAN){
	                reverse = duration;
	                duration = 400;
	            }

	            options = {
	                effects: options,
	                duration: duration,
	                reverse: reverse,
	                complete: complete
	            };
	        }

	        return extend({
	            //default options
	            effects: {},
	            duration: 400, //jQuery default duration
	            reverse: false,
	            init: noop,
	            teardown: noop,
	            hide: false
	        }, options, { completeCallback: options.complete, complete: noop }); // Move external complete callback, so deferred.resolve can be always executed.

	    }

	    function animate(element, options, duration, reverse, complete) {
	        var idx = 0,
	            length = element.length,
	            instance;

	        for (; idx < length; idx ++) {
	            instance = $(element[idx]);
	            instance.queue(function() {
	                effects.promise(instance, prepareAnimationOptions(options, duration, reverse, complete));
	            });
	        }

	        return element;
	    }

	    function toggleClass(element, classes, options, add) {
	        if (classes) {
	            classes = classes.split(" ");

	            each(classes, function(idx, value) {
	                element.toggleClass(value, add);
	            });
	        }

	        return element;
	    }

	    if (!("kendoAnimate" in $.fn)) {
	        extend($.fn, {
	            kendoStop: function(clearQueue, gotoEnd) {
	                return this.stop(clearQueue, gotoEnd);
	            },

	            kendoAnimate: function(options, duration, reverse, complete) {
	                return animate(this, options, duration, reverse, complete);
	            },

	            kendoAddClass: function(classes, options){
	                return kendo.toggleClass(this, classes, options, true);
	            },

	            kendoRemoveClass: function(classes, options){
	                return kendo.toggleClass(this, classes, options, false);
	            },
	            kendoToggleClass: function(classes, options, toggle){
	                return kendo.toggleClass(this, classes, options, toggle);
	            }
	        });
	    }

	    var ampRegExp = /&/g,
	        ltRegExp = /</g,
	        quoteRegExp = /"/g,
	        aposRegExp = /'/g,
	        gtRegExp = />/g;
	    function htmlEncode(value) {
	        return ("" + value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
	    }

	    var eventTarget = function (e) {
	        return e.target;
	    };

	    if (support.touch) {

	        eventTarget = function(e) {
	            var touches = "originalEvent" in e ? e.originalEvent.changedTouches : "changedTouches" in e ? e.changedTouches : null;

	            return touches ? document.elementFromPoint(touches[0].clientX, touches[0].clientY) : e.target;
	        };

	        each(["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap"], function(m, value) {
	            $.fn[value] = function(callback) {
	                return this.bind(value, callback);
	            };
	        });
	    }

	    if (support.touch) {
	        if (!support.mobileOS) {
	            support.mousedown = "mousedown touchstart";
	            support.mouseup = "mouseup touchend";
	            support.mousemove = "mousemove touchmove";
	            support.mousecancel = "mouseleave touchcancel";
	            support.click = "click";
	            support.resize = "resize";
	        } else {
	            support.mousedown = "touchstart";
	            support.mouseup = "touchend";
	            support.mousemove = "touchmove";
	            support.mousecancel = "touchcancel";
	            support.click = "touchend";
	            support.resize = "orientationchange";
	        }
	    } else if (support.pointers) {
	        support.mousemove = "pointermove";
	        support.mousedown = "pointerdown";
	        support.mouseup = "pointerup";
	        support.mousecancel = "pointercancel";
	        support.click = "pointerup";
	        support.resize = "orientationchange resize";
	    } else if (support.msPointers) {
	        support.mousemove = "MSPointerMove";
	        support.mousedown = "MSPointerDown";
	        support.mouseup = "MSPointerUp";
	        support.mousecancel = "MSPointerCancel";
	        support.click = "MSPointerUp";
	        support.resize = "orientationchange resize";
	    } else {
	        support.mousemove = "mousemove";
	        support.mousedown = "mousedown";
	        support.mouseup = "mouseup";
	        support.mousecancel = "mouseleave";
	        support.click = "click";
	        support.resize = "resize";
	    }

	    var wrapExpression = function(members, paramName) {
	        var result = paramName || "d",
	            index,
	            idx,
	            length,
	            member,
	            count = 1;

	        for (idx = 0, length = members.length; idx < length; idx++) {
	            member = members[idx];
	            if (member !== "") {
	                index = member.indexOf("[");

	                if (index !== 0) {
	                    if (index == -1) {
	                        member = "." + member;
	                    } else {
	                        count++;
	                        member = "." + member.substring(0, index) + " || {})" + member.substring(index);
	                    }
	                }

	                count++;
	                result += member + ((idx < length - 1) ? " || {})" : ")");
	            }
	        }
	        return new Array(count).join("(") + result;
	    },
	    localUrlRe = /^([a-z]+:)?\/\//i;

	    extend(kendo, {
	        widgets: [],
	        _widgetRegisteredCallbacks: [],
	        ui: kendo.ui || {},
	        fx: kendo.fx || fx,
	        effects: kendo.effects || effects,
	        mobile: kendo.mobile || { },
	        data: kendo.data || {},
	        dataviz: kendo.dataviz || {},
	        drawing: kendo.drawing || {},
	        spreadsheet: { messages: {} },
	        keys: {
	            INSERT: 45,
	            DELETE: 46,
	            BACKSPACE: 8,
	            TAB: 9,
	            ENTER: 13,
	            ESC: 27,
	            LEFT: 37,
	            UP: 38,
	            RIGHT: 39,
	            DOWN: 40,
	            END: 35,
	            HOME: 36,
	            SPACEBAR: 32,
	            PAGEUP: 33,
	            PAGEDOWN: 34,
	            F2: 113,
	            F10: 121,
	            F12: 123,
	            NUMPAD_PLUS: 107,
	            NUMPAD_MINUS: 109,
	            NUMPAD_DOT: 110
	        },
	        support: kendo.support || support,
	        animate: kendo.animate || animate,
	        ns: "",
	        attr: function(value) {
	            return "data-" + kendo.ns + value;
	        },
	        getShadows: getShadows,
	        wrap: wrap,
	        deepExtend: deepExtend,
	        getComputedStyles: getComputedStyles,
	        webComponents: kendo.webComponents || [],
	        isScrollable: isScrollable,
	        scrollLeft: scrollLeft,
	        size: size,
	        toCamelCase: toCamelCase,
	        toHyphens: toHyphens,
	        getOffset: kendo.getOffset || getOffset,
	        parseEffects: kendo.parseEffects || parseEffects,
	        toggleClass: kendo.toggleClass || toggleClass,
	        directions: kendo.directions || directions,
	        Observable: Observable,
	        Class: Class,
	        Template: Template,
	        template: proxy(Template.compile, Template),
	        render: proxy(Template.render, Template),
	        stringify: proxy(JSON.stringify, JSON),
	        eventTarget: eventTarget,
	        htmlEncode: htmlEncode,
	        isLocalUrl: function(url) {
	            return url && !localUrlRe.test(url);
	        },

	        expr: function(expression, safe, paramName) {
	            expression = expression || "";

	            if (typeof safe == STRING) {
	                paramName = safe;
	                safe = false;
	            }

	            paramName = paramName || "d";

	            if (expression && expression.charAt(0) !== "[") {
	                expression = "." + expression;
	            }

	            if (safe) {
	                expression = expression.replace(/"([^.]*)\.([^"]*)"/g,'"$1_$DOT$_$2"');
	                expression = expression.replace(/'([^.]*)\.([^']*)'/g,"'$1_$DOT$_$2'");
	                expression = wrapExpression(expression.split("."), paramName);
	                expression = expression.replace(/_\$DOT\$_/g, ".");
	            } else {
	                expression = paramName + expression;
	            }

	            return expression;
	        },

	        getter: function(expression, safe) {
	            var key = expression + safe;
	            return getterCache[key] = getterCache[key] || new Function("d", "return " + kendo.expr(expression, safe));
	        },

	        setter: function(expression) {
	            return setterCache[expression] = setterCache[expression] || new Function("d,value", kendo.expr(expression) + "=value");
	        },

	        accessor: function(expression) {
	            return {
	                get: kendo.getter(expression),
	                set: kendo.setter(expression)
	            };
	        },

	        guid: function() {
	            var id = "", i, random;

	            for (i = 0; i < 32; i++) {
	                random = math.random() * 16 | 0;

	                if (i == 8 || i == 12 || i == 16 || i == 20) {
	                    id += "-";
	                }
	                id += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
	            }

	            return id;
	        },

	        roleSelector: function(role) {
	            return role.replace(/(\S+)/g, "[" + kendo.attr("role") + "=$1],").slice(0, -1);
	        },

	        directiveSelector: function(directives) {
	            var selectors = directives.split(" ");

	            if (selectors) {
	                for (var i = 0; i < selectors.length; i++) {
	                    if (selectors[i] != "view") {
	                        selectors[i] = selectors[i].replace(/(\w*)(view|bar|strip|over)$/, "$1-$2");
	                    }
	                }
	            }

	            return selectors.join(" ").replace(/(\S+)/g, "kendo-mobile-$1,").slice(0, -1);
	        },

	        triggeredByInput: function(e) {
	            return (/^(label|input|textarea|select)$/i).test(e.target.tagName);
	        },

	        onWidgetRegistered: function(callback) {
	            for (var i = 0, len = kendo.widgets.length; i < len; i++) {
	                callback(kendo.widgets[i]);
	            }

	            kendo._widgetRegisteredCallbacks.push(callback);
	        },

	        logToConsole: function(message, type) {
	            var console = window.console;

	            if (!kendo.suppressLog && typeof(console) != "undefined" && console.log) {
	                console[type || "log"](message);
	            }
	        }
	    });

	    var Widget = Observable.extend( {
	        init: function(element, options) {
	            var that = this;

	            that.element = kendo.jQuery(element).handler(that);

	            that.angular("init", options);

	            Observable.fn.init.call(that);

	            var dataSource = options ? options.dataSource : null;

	            if (dataSource) {
	                // avoid deep cloning the data source
	                options = extend({}, options, { dataSource: {} });
	            }

	            options = that.options = extend(true, {}, that.options, options);

	            if (dataSource) {
	                options.dataSource = dataSource;
	            }

	            if (!that.element.attr(kendo.attr("role"))) {
	                that.element.attr(kendo.attr("role"), (options.name || "").toLowerCase());
	            }

	            that.element.data("kendo" + options.prefix + options.name, that);

	            that.bind(that.events, options);
	        },

	        events: [],

	        options: {
	            prefix: ""
	        },

	        _hasBindingTarget: function() {
	            return !!this.element[0].kendoBindingTarget;
	        },

	        _tabindex: function(target) {
	            target = target || this.wrapper;

	            var element = this.element,
	                TABINDEX = "tabindex",
	                tabindex = target.attr(TABINDEX) || element.attr(TABINDEX);

	            element.removeAttr(TABINDEX);

	            target.attr(TABINDEX, !isNaN(tabindex) ? tabindex : 0);
	        },

	        setOptions: function(options) {
	            this._setEvents(options);
	            $.extend(this.options, options);
	        },

	        _setEvents: function(options) {
	            var that = this,
	                idx = 0,
	                length = that.events.length,
	                e;

	            for (; idx < length; idx ++) {
	                e = that.events[idx];
	                if (that.options[e] && options[e]) {
	                    that.unbind(e, that.options[e]);
	                }
	            }

	            that.bind(that.events, options);
	        },

	        resize: function(force) {
	            var size = this.getSize(),
	                currentSize = this._size;

	            if (force || (size.width > 0 || size.height > 0) && (!currentSize || size.width !== currentSize.width || size.height !== currentSize.height)) {
	                this._size = size;
	                this._resize(size, force);
	                this.trigger("resize", size);
	            }
	        },

	        getSize: function() {
	            return kendo.dimensions(this.element);
	        },

	        size: function(size) {
	            if (!size) {
	                return this.getSize();
	            } else {
	                this.setSize(size);
	            }
	        },

	        setSize: $.noop,
	        _resize: $.noop,

	        destroy: function() {
	            var that = this;

	            that.element.removeData("kendo" + that.options.prefix + that.options.name);
	            that.element.removeData("handler");
	            that.unbind();
	        },
	        _destroy: function() {
	            this.destroy();
	        },
	        angular: function(){},

	        _muteAngularRebind: function(callback) {
	            this._muteRebind = true;

	            callback.call(this);

	            this._muteRebind = false;
	        }
	    });

	    var DataBoundWidget = Widget.extend({
	        // Angular consumes these.
	        dataItems: function() {
	            return this.dataSource.flatView();
	        },

	        _angularItems: function(cmd) {
	            var that = this;
	            that.angular(cmd, function(){
	                return {
	                    elements: that.items(),
	                    data: $.map(that.dataItems(), function(dataItem){
	                        return { dataItem: dataItem };
	                    })
	                };
	            });
	        }
	    });

	    kendo.dimensions = function(element, dimensions) {
	        var domElement = element[0];

	        if (dimensions) {
	            element.css(dimensions);
	        }

	        return { width: domElement.offsetWidth, height: domElement.offsetHeight };
	    };

	    kendo.notify = noop;

	    var templateRegExp = /template$/i,
	        jsonRegExp = /^\s*(?:\{(?:.|\r\n|\n)*\}|\[(?:.|\r\n|\n)*\])\s*$/,
	        jsonFormatRegExp = /^\{(\d+)(:[^\}]+)?\}|^\[[A-Za-z_]*\]$/,
	        dashRegExp = /([A-Z])/g;

	    function parseOption(element, option) {
	        var value;

	        if (option.indexOf("data") === 0) {
	            option = option.substring(4);
	            option = option.charAt(0).toLowerCase() + option.substring(1);
	        }

	        option = option.replace(dashRegExp, "-$1");
	        value = element.getAttribute("data-" + kendo.ns + option);

	        if (value === null) {
	            value = undefined;
	        } else if (value === "null") {
	            value = null;
	        } else if (value === "true") {
	            value = true;
	        } else if (value === "false") {
	            value = false;
	        } else if (numberRegExp.test(value)) {
	            value = parseFloat(value);
	        } else if (jsonRegExp.test(value) && !jsonFormatRegExp.test(value)) {
	            value = new Function("return (" + value + ")")();
	        }

	        return value;
	    }

	    function parseOptions(element, options) {
	        var result = {},
	            option,
	            value;

	        for (option in options) {
	            value = parseOption(element, option);

	            if (value !== undefined) {

	                if (templateRegExp.test(option)) {
	                    if(typeof value === "string") {
	                        value = kendo.template($("#" + value).html());
	                    } else {
	                        value = element.getAttribute(option);
	                    }
	                }

	                result[option] = value;
	            }
	        }

	        return result;
	    }

	    kendo.initWidget = function(element, options, roles) {
	        var result,
	            option,
	            widget,
	            idx,
	            length,
	            role,
	            value,
	            dataSource,
	            fullPath,
	            widgetKeyRegExp;

	        // Preserve backwards compatibility with (element, options, namespace) signature, where namespace was kendo.ui
	        if (!roles) {
	            roles = kendo.ui.roles;
	        } else if (roles.roles) {
	            roles = roles.roles;
	        }

	        element = element.nodeType ? element : element[0];

	        role = element.getAttribute("data-" + kendo.ns + "role");

	        if (!role) {
	            return;
	        }

	        fullPath = role.indexOf(".") === -1;

	        // look for any widget that may be already instantiated based on this role.
	        // The prefix used is unknown, hence the regexp
	        //

	        if (fullPath) {
	            widget = roles[role];
	        } else { // full namespace path - like kendo.ui.Widget
	            widget = kendo.getter(role)(window);
	        }

	        var data = $(element).data(),
	            widgetKey = widget ? "kendo" + widget.fn.options.prefix + widget.fn.options.name : "";

	        if (fullPath) {
	            widgetKeyRegExp = new RegExp("^kendo.*" + role + "$", "i");
	        } else { // full namespace path - like kendo.ui.Widget
	            widgetKeyRegExp = new RegExp("^" + widgetKey + "$", "i");
	        }

	        for(var key in data) {
	            if (key.match(widgetKeyRegExp)) {
	                // we have detected a widget of the same kind - save its reference, we will set its options
	                if (key === widgetKey) {
	                    result = data[key];
	                } else {
	                    return data[key];
	                }
	            }
	        }

	        if (!widget) {
	            return;
	        }

	        dataSource = parseOption(element, "dataSource");

	        options = $.extend({}, parseOptions(element, widget.fn.options), options);

	        if (dataSource) {
	            if (typeof dataSource === STRING) {
	                options.dataSource = kendo.getter(dataSource)(window);
	            } else {
	                options.dataSource = dataSource;
	            }
	        }

	        for (idx = 0, length = widget.fn.events.length; idx < length; idx++) {
	            option = widget.fn.events[idx];

	            value = parseOption(element, option);

	            if (value !== undefined) {
	                options[option] = kendo.getter(value)(window);
	            }
	        }

	        if (!result) {
	            result = new widget(element, options);
	        } else if (!$.isEmptyObject(options)) {
	            result.setOptions(options);
	        }

	        return result;
	    };

	    kendo.rolesFromNamespaces = function(namespaces) {
	        var roles = [],
	            idx,
	            length;

	        if (!namespaces[0]) {
	            namespaces = [kendo.ui, kendo.dataviz.ui];
	        }

	        for (idx = 0, length = namespaces.length; idx < length; idx ++) {
	            roles[idx] = namespaces[idx].roles;
	        }

	        return extend.apply(null, [{}].concat(roles.reverse()));
	    };

	    kendo.init = function(element) {
	        var roles = kendo.rolesFromNamespaces(slice.call(arguments, 1));

	        $(element).find("[data-" + kendo.ns + "role]").addBack().each(function(){
	            kendo.initWidget(this, {}, roles);
	        });
	    };

	    kendo.destroy = function(element) {
	        $(element).find("[data-" + kendo.ns + "role]").addBack().each(function(){
	            var data = $(this).data();

	            for (var key in data) {
	                if (key.indexOf("kendo") === 0 && typeof data[key].destroy === FUNCTION) {
	                    data[key].destroy();
	                }
	            }
	        });
	    };

	    function containmentComparer(a, b) {
	        return $.contains(a, b) ? -1 : 1;
	    }

	    function resizableWidget() {
	        var widget = $(this);
	        return ($.inArray(widget.attr("data-" + kendo.ns + "role"), ["slider", "rangeslider"]) > -1) || widget.is(":visible");
	    }

	    kendo.resize = function(element, force) {
	        var widgets = $(element).find("[data-" + kendo.ns + "role]").addBack().filter(resizableWidget);

	        if (!widgets.length) {
	            return;
	        }

	        // sort widgets based on their parent-child relation
	        var widgetsArray = $.makeArray(widgets);
	        widgetsArray.sort(containmentComparer);

	        // resize widgets
	        $.each(widgetsArray, function () {
	            var widget = kendo.widgetInstance($(this));
	            if (widget) {
	                widget.resize(force);
	            }
	        });
	    };

	    kendo.parseOptions = parseOptions;

	    extend(kendo.ui, {
	        Widget: Widget,
	        DataBoundWidget: DataBoundWidget,
	        roles: {},
	        progress: function(container, toggle) {
	            var mask = container.find(".k-loading-mask"),
	                support = kendo.support,
	                browser = support.browser,
	                isRtl, leftRight, webkitCorrection, containerScrollLeft;

	            if (toggle) {
	                if (!mask.length) {
	                    isRtl = support.isRtl(container);
	                    leftRight = isRtl ? "right" : "left";
	                    containerScrollLeft = container.scrollLeft();
	                    webkitCorrection = browser.webkit ? (!isRtl ? 0 : container[0].scrollWidth - container.width() - 2 * containerScrollLeft) : 0;

	                    mask = $("<div class='k-loading-mask'><span class='k-loading-text'>" + kendo.ui.progress.messages.loading + "</span><div class='k-loading-image'/><div class='k-loading-color'/></div>")
	                        .width("100%").height("100%")
	                        .css("top", container.scrollTop())
	                        .css(leftRight, Math.abs(containerScrollLeft) + webkitCorrection)
	                        .prependTo(container);
	                }
	            } else if (mask) {
	                mask.remove();
	            }
	        },
	        plugin: function(widget, register, prefix) {
	            var name = widget.fn.options.name,
	                getter;

	            register = register || kendo.ui;
	            prefix = prefix || "";

	            register[name] = widget;

	            register.roles[name.toLowerCase()] = widget;

	            getter = "getKendo" + prefix + name;
	            name = "kendo" + prefix + name;

	            var widgetEntry = { name: name, widget: widget, prefix: prefix || "" };
	            kendo.widgets.push(widgetEntry);

	            for (var i = 0, len = kendo._widgetRegisteredCallbacks.length; i < len; i++) {
	                kendo._widgetRegisteredCallbacks[i](widgetEntry);
	            }

	            $.fn[name] = function(options) {
	                var value = this,
	                    args;

	                if (typeof options === STRING) {
	                    args = slice.call(arguments, 1);

	                    this.each(function(){
	                        var widget = $.data(this, name),
	                            method,
	                            result;

	                        if (!widget) {
	                            throw new Error(kendo.format("Cannot call method '{0}' of {1} before it is initialized", options, name));
	                        }

	                        method = widget[options];

	                        if (typeof method !== FUNCTION) {
	                            throw new Error(kendo.format("Cannot find method '{0}' of {1}", options, name));
	                        }

	                        result = method.apply(widget, args);

	                        if (result !== undefined) {
	                            value = result;
	                            return false;
	                        }
	                    });
	                } else {
	                    this.each(function() {
	                        return new widget(this, options);
	                    });
	                }

	                return value;
	            };

	            $.fn[name].widget = widget;

	            $.fn[getter] = function() {
	                return this.data(name);
	            };
	        }
	    });

	    kendo.ui.progress.messages = {
	        loading: "Loading..."
	    };

	    var ContainerNullObject = { bind: function () { return this; }, nullObject: true, options: {} };

	    var MobileWidget = Widget.extend({
	        init: function(element, options) {
	            Widget.fn.init.call(this, element, options);
	            this.element.autoApplyNS();
	            this.wrapper = this.element;
	            this.element.addClass("km-widget");
	        },

	        destroy: function() {
	            Widget.fn.destroy.call(this);
	            this.element.kendoDestroy();
	        },

	        options: {
	            prefix: "Mobile"
	        },

	        events: [],

	        view: function() {
	            var viewElement = this.element.closest(kendo.roleSelector("view splitview modalview drawer"));
	            return kendo.widgetInstance(viewElement, kendo.mobile.ui) || ContainerNullObject;
	        },

	        viewHasNativeScrolling: function() {
	            var view = this.view();
	            return view && view.options.useNativeScrolling;
	        },

	        container: function() {
	            var element = this.element.closest(kendo.roleSelector("view layout modalview drawer splitview"));
	            return kendo.widgetInstance(element.eq(0), kendo.mobile.ui) || ContainerNullObject;
	        }
	    });

	    extend(kendo.mobile, {
	        init: function(element) {
	            kendo.init(element, kendo.mobile.ui, kendo.ui, kendo.dataviz.ui);
	        },

	        appLevelNativeScrolling: function() {
	            return kendo.mobile.application && kendo.mobile.application.options && kendo.mobile.application.options.useNativeScrolling;
	        },

	        roles: {},

	        ui: {
	            Widget: MobileWidget,
	            DataBoundWidget: DataBoundWidget.extend(MobileWidget.prototype),
	            roles: {},
	            plugin: function(widget) {
	                kendo.ui.plugin(widget, kendo.mobile.ui, "Mobile");
	            }
	        }
	    });

	    deepExtend(kendo.dataviz, {
	        init: function(element) {
	            kendo.init(element, kendo.dataviz.ui);
	        },
	        ui: {
	            roles: {},
	            themes: {},
	            views: [],
	            plugin: function(widget) {
	                kendo.ui.plugin(widget, kendo.dataviz.ui);
	            }
	        },
	        roles: {}
	    });

	    kendo.touchScroller = function(elements, options) {
	        // return the first touch scroller
	        if (!options){ options = {}; }

	        options.useNative = true;

	        return $(elements).map(function(idx, element) {
	            element = $(element);
	            if (support.kineticScrollNeeded && kendo.mobile.ui.Scroller && !element.data("kendoMobileScroller")) {
	                element.kendoMobileScroller(options);
	                return element.data("kendoMobileScroller");
	            } else {
	                return false;
	            }
	        })[0];
	    };

	    kendo.preventDefault = function(e) {
	        e.preventDefault();
	    };

	    kendo.widgetInstance = function(element, suites) {
	        var role = element.data(kendo.ns + "role"),
	            widgets = [], i, length;

	        if (role) {
	            // HACK!!! mobile view scroller widgets are instantiated on data-role="content" elements. We need to discover them when resizing.
	            if (role === "content") {
	                role = "scroller";
	            }

	            if (suites) {
	                if (suites[0]) {
	                    for (i = 0, length = suites.length; i < length; i ++) {
	                        widgets.push(suites[i].roles[role]);
	                    }
	                } else {
	                    widgets.push(suites.roles[role]);
	                }
	            }
	            else {
	                widgets = [ kendo.ui.roles[role], kendo.dataviz.ui.roles[role],  kendo.mobile.ui.roles[role] ];
	            }

	            if (role.indexOf(".") >= 0) {
	                widgets = [ kendo.getter(role)(window) ];
	            }

	            for (i = 0, length = widgets.length; i < length; i ++) {
	                var widget = widgets[i];
	                if (widget) {
	                    var instance = element.data("kendo" + widget.fn.options.prefix + widget.fn.options.name);
	                    if (instance) {
	                        return instance;
	                    }
	                }
	            }
	        }
	    };

	    kendo.onResize = function(callback) {
	        var handler = callback;
	        if (support.mobileOS.android) {
	            handler = function() { setTimeout(callback, 600); };
	        }

	        $(window).on(support.resize, handler);
	        return handler;
	    };

	    kendo.unbindResize = function(callback) {
	        $(window).off(support.resize, callback);
	    };

	    kendo.attrValue = function(element, key) {
	        return element.data(kendo.ns + key);
	    };

	    kendo.days = {
	        Sunday: 0,
	        Monday: 1,
	        Tuesday: 2,
	        Wednesday: 3,
	        Thursday: 4,
	        Friday: 5,
	        Saturday: 6
	    };

	    function focusable(element, isTabIndexNotNaN) {
	        var nodeName = element.nodeName.toLowerCase();

	        return (/input|select|textarea|button|object/.test(nodeName) ?
	                !element.disabled :
	                "a" === nodeName ?
	                element.href || isTabIndexNotNaN :
	                isTabIndexNotNaN
	               ) &&
	            visible(element);
	    }

	    function visible(element) {
	        return $.expr.filters.visible(element) &&
	            !$(element).parents().addBack().filter(function() {
	                return $.css(this,"visibility") === "hidden";
	            }).length;
	    }

	    $.extend($.expr[ ":" ], {
	        kendoFocusable: function(element) {
	            var idx = $.attr(element, "tabindex");
	            return focusable(element, !isNaN(idx) && idx > -1);
	        }
	    });

	    var MOUSE_EVENTS = ["mousedown", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "mouseup", "click"];
	    var EXCLUDE_BUST_CLICK_SELECTOR = "label, input, [data-rel=external]";

	    var MouseEventNormalizer = {
	        setupMouseMute: function() {
	            var idx = 0,
	                length = MOUSE_EVENTS.length,
	                element = document.documentElement;

	            if (MouseEventNormalizer.mouseTrap || !support.eventCapture) {
	                return;
	            }

	            MouseEventNormalizer.mouseTrap = true;

	            MouseEventNormalizer.bustClick = false;
	            MouseEventNormalizer.captureMouse = false;

	            var handler = function(e) {
	                if (MouseEventNormalizer.captureMouse) {
	                    if (e.type === "click") {
	                        if (MouseEventNormalizer.bustClick && !$(e.target).is(EXCLUDE_BUST_CLICK_SELECTOR)) {
	                            e.preventDefault();
	                            e.stopPropagation();
	                        }
	                    } else {
	                        e.stopPropagation();
	                    }
	                }
	            };

	            for (; idx < length; idx++) {
	                element.addEventListener(MOUSE_EVENTS[idx], handler, true);
	            }
	        },

	        muteMouse: function(e) {
	            MouseEventNormalizer.captureMouse = true;
	            if (e.data.bustClick) {
	                MouseEventNormalizer.bustClick = true;
	            }
	            clearTimeout(MouseEventNormalizer.mouseTrapTimeoutID);
	        },

	        unMuteMouse: function() {
	            clearTimeout(MouseEventNormalizer.mouseTrapTimeoutID);
	            MouseEventNormalizer.mouseTrapTimeoutID = setTimeout(function() {
	                MouseEventNormalizer.captureMouse = false;
	                MouseEventNormalizer.bustClick = false;
	            }, 400);
	        }
	    };

	    var eventMap = {
	        down: "touchstart mousedown",
	        move: "mousemove touchmove",
	        up: "mouseup touchend touchcancel",
	        cancel: "mouseleave touchcancel"
	    };

	    if (support.touch && (support.mobileOS.ios || support.mobileOS.android)) {
	        eventMap = {
	            down: "touchstart",
	            move: "touchmove",
	            up: "touchend touchcancel",
	            cancel: "touchcancel"
	        };
	    } else if (support.pointers) {
	        eventMap = {
	            down: "pointerdown",
	            move: "pointermove",
	            up: "pointerup",
	            cancel: "pointercancel pointerleave"
	        };
	    } else if (support.msPointers) {
	        eventMap = {
	            down: "MSPointerDown",
	            move: "MSPointerMove",
	            up: "MSPointerUp",
	            cancel: "MSPointerCancel MSPointerLeave"
	        };
	    }

	    if (support.msPointers && !("onmspointerenter" in window)) { // IE10
	        // Create MSPointerEnter/MSPointerLeave events using mouseover/out and event-time checks
	        $.each({
	            MSPointerEnter: "MSPointerOver",
	            MSPointerLeave: "MSPointerOut"
	        }, function( orig, fix ) {
	            $.event.special[ orig ] = {
	                delegateType: fix,
	                bindType: fix,

	                handle: function( event ) {
	                    var ret,
	                        target = this,
	                        related = event.relatedTarget,
	                        handleObj = event.handleObj;

	                    // For mousenter/leave call the handler if related is outside the target.
	                    // NB: No relatedTarget if the mouse left/entered the browser window
	                    if ( !related || (related !== target && !$.contains( target, related )) ) {
	                        event.type = handleObj.origType;
	                        ret = handleObj.handler.apply( this, arguments );
	                        event.type = fix;
	                    }
	                    return ret;
	                }
	            };
	        });
	    }


	    var getEventMap = function(e) { return (eventMap[e] || e); },
	        eventRegEx = /([^ ]+)/g;

	    kendo.applyEventMap = function(events, ns) {
	        events = events.replace(eventRegEx, getEventMap);

	        if (ns) {
	            events = events.replace(eventRegEx, "$1." + ns);
	        }

	        return events;
	    };

	    var on = $.fn.on;

	    function kendoJQuery(selector, context) {
	        return new kendoJQuery.fn.init(selector, context);
	    }

	    extend(true, kendoJQuery, $);

	    kendoJQuery.fn = kendoJQuery.prototype = new $();

	    kendoJQuery.fn.constructor = kendoJQuery;

	    kendoJQuery.fn.init = function(selector, context) {
	        if (context && context instanceof $ && !(context instanceof kendoJQuery)) {
	            context = kendoJQuery(context);
	        }

	        return $.fn.init.call(this, selector, context, rootjQuery);
	    };

	    kendoJQuery.fn.init.prototype = kendoJQuery.fn;

	    var rootjQuery = kendoJQuery(document);

	    extend(kendoJQuery.fn, {
	        handler: function(handler) {
	            this.data("handler", handler);
	            return this;
	        },

	        autoApplyNS: function(ns) {
	            this.data("kendoNS", ns || kendo.guid());
	            return this;
	        },

	        on: function() {
	            var that = this,
	                ns = that.data("kendoNS");

	            // support for event map signature
	            if (arguments.length === 1) {
	                return on.call(that, arguments[0]);
	            }

	            var context = that,
	                args = slice.call(arguments);

	            if (typeof args[args.length -1] === UNDEFINED) {
	                args.pop();
	            }

	            var callback =  args[args.length - 1],
	                events = kendo.applyEventMap(args[0], ns);

	            // setup mouse trap
	            if (support.mouseAndTouchPresent && events.search(/mouse|click/) > -1 && this[0] !== document.documentElement) {
	                MouseEventNormalizer.setupMouseMute();

	                var selector = args.length === 2 ? null : args[1],
	                    bustClick = events.indexOf("click") > -1 && events.indexOf("touchend") > -1;

	                on.call(this,
	                    {
	                        touchstart: MouseEventNormalizer.muteMouse,
	                        touchend: MouseEventNormalizer.unMuteMouse
	                    },
	                    selector,
	                    {
	                        bustClick: bustClick
	                    });
	            }

	            if (typeof callback === STRING) {
	                context = that.data("handler");
	                callback = context[callback];

	                args[args.length - 1] = function(e) {
	                    callback.call(context, e);
	                };
	            }

	            args[0] = events;

	            on.apply(that, args);

	            return that;
	        },

	        kendoDestroy: function(ns) {
	            ns = ns || this.data("kendoNS");

	            if (ns) {
	                this.off("." + ns);
	            }

	            return this;
	        }
	    });

	    kendo.jQuery = kendoJQuery;
	    kendo.eventMap = eventMap;

	    kendo.timezone = (function(){
	        var months =  { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
	        var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

	        function ruleToDate(year, rule) {
	            var date;
	            var targetDay;
	            var ourDay;
	            var month = rule[3];
	            var on = rule[4];
	            var time = rule[5];
	            var cache = rule[8];

	            if (!cache) {
	                rule[8] = cache = {};
	            }

	            if (cache[year]) {
	                return cache[year];
	            }

	            if (!isNaN(on)) {
	                date = new Date(Date.UTC(year, months[month], on, time[0], time[1], time[2], 0));
	            } else if (on.indexOf("last") === 0) {
	                date = new Date(Date.UTC(year, months[month] + 1, 1, time[0] - 24, time[1], time[2], 0));

	                targetDay = days[on.substr(4, 3)];
	                ourDay = date.getUTCDay();

	                date.setUTCDate(date.getUTCDate() + targetDay - ourDay - (targetDay > ourDay ? 7 : 0));
	            } else if (on.indexOf(">=") >= 0) {
	                date = new Date(Date.UTC(year, months[month], on.substr(5), time[0], time[1], time[2], 0));

	                targetDay = days[on.substr(0, 3)];
	                ourDay = date.getUTCDay();

	                date.setUTCDate(date.getUTCDate() + targetDay - ourDay + (targetDay < ourDay ? 7 : 0));
	            }

	            return cache[year] = date;
	        }

	        function findRule(utcTime, rules, zone) {
	            rules = rules[zone];

	            if (!rules) {
	                var time = zone.split(":");
	                var offset = 0;

	                if (time.length > 1) {
	                    offset = time[0] * 60 + Number(time[1]);
	                }

	                return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], offset, '-'];
	            }

	            var year = new Date(utcTime).getUTCFullYear();

	            rules = jQuery.grep(rules, function(rule) {
	                var from = rule[0];
	                var to = rule[1];

	                return from <= year && (to >= year || (from == year && to == "only") || to == "max");
	            });

	            rules.push(utcTime);

	            rules.sort(function(a, b) {
	                if (typeof a != "number") {
	                    a = Number(ruleToDate(year, a));
	                }

	                if (typeof b != "number") {
	                    b = Number(ruleToDate(year, b));
	                }

	                return a - b;
	            });

	            var rule = rules[jQuery.inArray(utcTime, rules) - 1] || rules[rules.length - 1];

	            return isNaN(rule) ? rule : null;
	        }

	        function findZone(utcTime, zones, timezone) {
	            var zoneRules = zones[timezone];

	            if (typeof zoneRules === "string") {
	                zoneRules = zones[zoneRules];
	            }

	            if (!zoneRules) {
	                throw new Error('Timezone "' + timezone + '" is either incorrect, or kendo.timezones.min.js is not included.');
	            }

	            for (var idx = zoneRules.length - 1; idx >= 0; idx--) {
	                var until = zoneRules[idx][3];

	                if (until && utcTime > until) {
	                    break;
	                }
	            }

	            var zone = zoneRules[idx + 1];

	            if (!zone) {
	                throw new Error('Timezone "' + timezone + '" not found on ' + utcTime + ".");
	            }

	            return zone;
	        }

	        function zoneAndRule(utcTime, zones, rules, timezone) {
	            if (typeof utcTime != NUMBER) {
	                utcTime = Date.UTC(utcTime.getFullYear(), utcTime.getMonth(),
	                    utcTime.getDate(), utcTime.getHours(), utcTime.getMinutes(),
	                    utcTime.getSeconds(), utcTime.getMilliseconds());
	            }

	            var zone = findZone(utcTime, zones, timezone);

	            return {
	                zone: zone,
	                rule: findRule(utcTime, rules, zone[1])
	            };
	        }

	        function offset(utcTime, timezone) {
	            if (timezone == "Etc/UTC" || timezone == "Etc/GMT") {
	                return 0;
	            }

	            var info = zoneAndRule(utcTime, this.zones, this.rules, timezone);
	            var zone = info.zone;
	            var rule = info.rule;

	            return kendo.parseFloat(rule? zone[0] - rule[6] : zone[0]);
	        }

	        function abbr(utcTime, timezone) {
	            var info = zoneAndRule(utcTime, this.zones, this.rules, timezone);
	            var zone = info.zone;
	            var rule = info.rule;

	            var base = zone[2];

	            if (base.indexOf("/") >= 0) {
	                return base.split("/")[rule && +rule[6] ? 1 : 0];
	            } else if (base.indexOf("%s") >= 0) {
	                return base.replace("%s", (!rule || rule[7] == "-") ? '' : rule[7]);
	            }

	            return base;
	        }

	        function convert(date, fromOffset, toOffset) {
	            if (typeof fromOffset == STRING) {
	                fromOffset = this.offset(date, fromOffset);
	            }

	            if (typeof toOffset == STRING) {
	                toOffset = this.offset(date, toOffset);
	            }

	            var fromLocalOffset = date.getTimezoneOffset();

	            date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);

	            var toLocalOffset = date.getTimezoneOffset();

	            return new Date(date.getTime() + (toLocalOffset - fromLocalOffset) * 60000);
	        }

	        function apply(date, timezone) {
	           return this.convert(date, date.getTimezoneOffset(), timezone);
	        }

	        function remove(date, timezone) {
	           return this.convert(date, timezone, date.getTimezoneOffset());
	        }

	        function toLocalDate(time) {
	            return this.apply(new Date(time), "Etc/UTC");
	        }

	        return {
	           zones: {},
	           rules: {},
	           offset: offset,
	           convert: convert,
	           apply: apply,
	           remove: remove,
	           abbr: abbr,
	           toLocalDate: toLocalDate
	        };
	    })();

	    kendo.date = (function(){
	        var MS_PER_MINUTE = 60000,
	            MS_PER_DAY = 86400000;

	        function adjustDST(date, hours) {
	            if (hours === 0 && date.getHours() === 23) {
	                date.setHours(date.getHours() + 2);
	                return true;
	            }

	            return false;
	        }

	        function setDayOfWeek(date, day, dir) {
	            var hours = date.getHours();

	            dir = dir || 1;
	            day = ((day - date.getDay()) + (7 * dir)) % 7;

	            date.setDate(date.getDate() + day);
	            adjustDST(date, hours);
	        }

	        function dayOfWeek(date, day, dir) {
	            date = new Date(date);
	            setDayOfWeek(date, day, dir);
	            return date;
	        }

	        function firstDayOfMonth(date) {
	            return new Date(
	                date.getFullYear(),
	                date.getMonth(),
	                1
	            );
	        }

	        function lastDayOfMonth(date) {
	            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0),
	                first = firstDayOfMonth(date),
	                timeOffset = Math.abs(last.getTimezoneOffset() - first.getTimezoneOffset());

	            if (timeOffset) {
	                last.setHours(first.getHours() + (timeOffset / 60));
	            }

	            return last;
	        }
	        //returns 0 for first week
	        function weekInYear(date, weekStart){
	            var year, days;

	            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	            adjustDST(date, 0);

	            year = date.getFullYear();

	            if (weekStart !== undefined) {
	                setDayOfWeek(date, weekStart, -1);
	                date.setDate(date.getDate() + 4);
	            } else {
	                date.setDate(date.getDate() + (4 - (date.getDay() || 7)));
	            }

	            adjustDST(date, 0);
	            days = Math.floor((date.getTime() - new Date(year, 0, 1, -6)) / 86400000);

	            return 1 + Math.floor(days / 7);
	        }

	        function getDate(date) {
	            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	            adjustDST(date, 0);
	            return date;
	        }

	        function toUtcTime(date) {
	            return Date.UTC(date.getFullYear(), date.getMonth(),
	                        date.getDate(), date.getHours(), date.getMinutes(),
	                        date.getSeconds(), date.getMilliseconds());
	        }

	        function getMilliseconds(date) {
	            return date.getTime() - getDate(date);
	        }

	        function isInTimeRange(value, min, max) {
	            var msMin = getMilliseconds(min),
	                msMax = getMilliseconds(max),
	                msValue;

	            if (!value || msMin == msMax) {
	                return true;
	            }

	            if (min >= max) {
	                max += MS_PER_DAY;
	            }

	            msValue = getMilliseconds(value);

	            if (msMin > msValue) {
	                msValue += MS_PER_DAY;
	            }

	            if (msMax < msMin) {
	                msMax += MS_PER_DAY;
	            }

	            return msValue >= msMin && msValue <= msMax;
	        }

	        function isInDateRange(value, min, max) {
	            var msMin = min.getTime(),
	                msMax = max.getTime(),
	                msValue;

	            if (msMin >= msMax) {
	                msMax += MS_PER_DAY;
	            }

	            msValue = value.getTime();

	            return msValue >= msMin && msValue <= msMax;
	        }

	        function addDays(date, offset) {
	            var hours = date.getHours();
	                date = new Date(date);

	            setTime(date, offset * MS_PER_DAY);
	            adjustDST(date, hours);
	            return date;
	        }

	        function setTime(date, milliseconds, ignoreDST) {
	            var offset = date.getTimezoneOffset();
	            var difference;

	            date.setTime(date.getTime() + milliseconds);

	            if (!ignoreDST) {
	                difference = date.getTimezoneOffset() - offset;
	                date.setTime(date.getTime() + difference * MS_PER_MINUTE);
	            }
	        }

	        function setHours(date, time) {
	            date = new Date(kendo.date.getDate(date).getTime() + kendo.date.getMilliseconds(time));
	            adjustDST(date, time.getHours());
	            return date;
	        }

	        function today() {
	            return getDate(new Date());
	        }

	        function isToday(date) {
	           return getDate(date).getTime() == today().getTime();
	        }

	        function toInvariantTime(date) {
	            var staticDate = new Date(1980, 1, 1, 0, 0, 0);

	            if (date) {
	                staticDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
	            }

	            return staticDate;
	        }

	        return {
	            adjustDST: adjustDST,
	            dayOfWeek: dayOfWeek,
	            setDayOfWeek: setDayOfWeek,
	            getDate: getDate,
	            isInDateRange: isInDateRange,
	            isInTimeRange: isInTimeRange,
	            isToday: isToday,
	            nextDay: function(date) {
	                return addDays(date, 1);
	            },
	            previousDay: function(date) {
	                return addDays(date, -1);
	            },
	            toUtcTime: toUtcTime,
	            MS_PER_DAY: MS_PER_DAY,
	            MS_PER_HOUR: 60 * MS_PER_MINUTE,
	            MS_PER_MINUTE: MS_PER_MINUTE,
	            setTime: setTime,
	            setHours: setHours,
	            addDays: addDays,
	            today: today,
	            toInvariantTime: toInvariantTime,
	            firstDayOfMonth: firstDayOfMonth,
	            lastDayOfMonth: lastDayOfMonth,
	            weekInYear: weekInYear,
	            getMilliseconds: getMilliseconds
	        };
	    })();


	    kendo.stripWhitespace = function(element) {
	        if (document.createNodeIterator) {
	            var iterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, function(node) {
	                    return node.parentNode == element ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	                }, false);

	            while (iterator.nextNode()) {
	                if (iterator.referenceNode && !iterator.referenceNode.textContent.trim()) {
	                    iterator.referenceNode.parentNode.removeChild(iterator.referenceNode);
	                }
	            }
	        } else { // IE7/8 support
	            for (var i = 0; i < element.childNodes.length; i++) {
	                var child = element.childNodes[i];

	                if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
	                    element.removeChild(child);
	                    i--;
	                }

	                if (child.nodeType == 1) {
	                    kendo.stripWhitespace(child);
	                }
	            }
	        }
	    };

	    var animationFrame  = window.requestAnimationFrame       ||
	                          window.webkitRequestAnimationFrame ||
	                          window.mozRequestAnimationFrame    ||
	                          window.oRequestAnimationFrame      ||
	                          window.msRequestAnimationFrame     ||
	                          function(callback){ setTimeout(callback, 1000 / 60); };

	    kendo.animationFrame = function(callback) {
	        animationFrame.call(window, callback);
	    };

	    var animationQueue = [];

	    kendo.queueAnimation = function(callback) {
	        animationQueue[animationQueue.length] = callback;
	        if (animationQueue.length === 1) {
	            kendo.runNextAnimation();
	        }
	    };

	    kendo.runNextAnimation = function() {
	        kendo.animationFrame(function() {
	            if (animationQueue[0]) {
	                animationQueue.shift()();
	                if (animationQueue[0]) {
	                    kendo.runNextAnimation();
	                }
	            }
	        });
	    };

	    kendo.parseQueryStringParams = function(url) {
	        var queryString = url.split('?')[1] || "",
	            params = {},
	            paramParts = queryString.split(/&|=/),
	            length = paramParts.length,
	            idx = 0;

	        for (; idx < length; idx += 2) {
	            if(paramParts[idx] !== "") {
	                params[decodeURIComponent(paramParts[idx])] = decodeURIComponent(paramParts[idx + 1]);
	            }
	        }

	        return params;
	    };

	    kendo.elementUnderCursor = function(e) {
	        if (typeof e.x.client != "undefined") {
	            return document.elementFromPoint(e.x.client, e.y.client);
	        }
	    };

	    kendo.wheelDeltaY = function(jQueryEvent) {
	        var e = jQueryEvent.originalEvent,
	            deltaY = e.wheelDeltaY,
	            delta;

	            if (e.wheelDelta) { // Webkit and IE
	                if (deltaY === undefined || deltaY) { // IE does not have deltaY, thus always scroll (horizontal scrolling is treated as vertical)
	                    delta = e.wheelDelta;
	                }
	            } else if (e.detail && e.axis === e.VERTICAL_AXIS) { // Firefox and Opera
	                delta = (-e.detail) * 10;
	            }

	        return delta;
	    };

	    kendo.throttle = function(fn, delay) {
	        var timeout;
	        var lastExecTime = 0;

	        if (!delay || delay <= 0) {
	            return fn;
	        }

	        var throttled = function() {
	            var that = this;
	            var elapsed = +new Date() - lastExecTime;
	            var args = arguments;

	            function exec() {
	                fn.apply(that, args);
	                lastExecTime = +new Date();
	            }

	            // first execution
	            if (!lastExecTime) {
	                return exec();
	            }

	            if (timeout) {
	                clearTimeout(timeout);
	            }

	            if (elapsed > delay) {
	                exec();
	            } else {
	                timeout = setTimeout(exec, delay - elapsed);
	            }
	        };

	        throttled.cancel = function() {
	            clearTimeout(timeout);
	        };

	        return throttled;
	    };


	    kendo.caret = function (element, start, end) {
	        var rangeElement;
	        var isPosition = start !== undefined;

	        if (end === undefined) {
	            end = start;
	        }

	        if (element[0]) {
	            element = element[0];
	        }

	        if (isPosition && element.disabled) {
	            return;
	        }

	        try {
	            if (element.selectionStart !== undefined) {
	                if (isPosition) {
	                    element.focus();
	                    element.setSelectionRange(start, end);
	                } else {
	                    start = [element.selectionStart, element.selectionEnd];
	                }
	            } else if (document.selection) {
	                if ($(element).is(":visible")) {
	                    element.focus();
	                }

	                rangeElement = element.createTextRange();

	                if (isPosition) {
	                    rangeElement.collapse(true);
	                    rangeElement.moveStart("character", start);
	                    rangeElement.moveEnd("character", end - start);
	                    rangeElement.select();
	                } else {
	                    var rangeDuplicated = rangeElement.duplicate(),
	                        selectionStart, selectionEnd;

	                        rangeElement.moveToBookmark(document.selection.createRange().getBookmark());
	                        rangeDuplicated.setEndPoint('EndToStart', rangeElement);
	                        selectionStart = rangeDuplicated.text.length;
	                        selectionEnd = selectionStart + rangeElement.text.length;

	                    start = [selectionStart, selectionEnd];
	                }
	            }
	        } catch(e) {
	            /* element is not focused or it is not in the DOM */
	            start = [];
	        }

	        return start;
	    };

	    kendo.compileMobileDirective = function(element, scope) {
	        var angular = window.angular;

	        element.attr("data-" + kendo.ns + "role", element[0].tagName.toLowerCase().replace('kendo-mobile-', '').replace('-', ''));

	        angular.element(element).injector().invoke(["$compile", function($compile) {
	            $compile(element)(scope);

	            if (!/^\$(digest|apply)$/.test(scope.$$phase)) {
	                scope.$digest();
	            }
	        }]);

	        return kendo.widgetInstance(element, kendo.mobile.ui);
	    };

	    kendo.antiForgeryTokens = function() {
	        var tokens = { },
	            csrf_token = $("meta[name=csrf-token],meta[name=_csrf]").attr("content"),
	            csrf_param = $("meta[name=csrf-param],meta[name=_csrf_header]").attr("content");

	        $("input[name^='__RequestVerificationToken']").each(function() {
	            tokens[this.name] = this.value;
	        });

	        if (csrf_param !== undefined && csrf_token !== undefined) {
	          tokens[csrf_param] = csrf_token;
	        }

	        return tokens;
	    };

	    kendo.cycleForm = function(form) {
	        var firstElement = form.find("input, .k-widget").first();
	        var lastElement = form.find("button, .k-button").last();

	        function focus(el) {
	            var widget = kendo.widgetInstance(el);

	            if (widget && widget.focus) {
	              widget.focus();
	            } else {
	              el.focus();
	            }
	        }

	        lastElement.on("keydown", function(e) {
	          if (e.keyCode == kendo.keys.TAB && !e.shiftKey) {
	            e.preventDefault();
	            focus(firstElement);
	          }
	        });

	        firstElement.on("keydown", function(e) {
	          if (e.keyCode == kendo.keys.TAB && e.shiftKey) {
	            e.preventDefault();
	            focus(lastElement);
	          }
	        });
	    };

	    // kendo.saveAs -----------------------------------------------
	    (function() {
	        function postToProxy(dataURI, fileName, proxyURL, proxyTarget) {
	            var form = $("<form>").attr({
	                action: proxyURL,
	                method: "POST",
	                target: proxyTarget
	            });

	            var data = kendo.antiForgeryTokens();
	            data.fileName = fileName;

	            var parts = dataURI.split(";base64,");
	            data.contentType = parts[0].replace("data:", "");
	            data.base64 = parts[1];

	            for (var name in data) {
	                if (data.hasOwnProperty(name)) {
	                    $('<input>').attr({
	                        value: data[name],
	                        name: name,
	                        type: "hidden"
	                    }).appendTo(form);
	                }
	            }

	            form.appendTo("body").submit().remove();
	        }

	        var fileSaver = document.createElement("a");
	        var downloadAttribute = "download" in fileSaver && !kendo.support.browser.edge;

	        function saveAsBlob(dataURI, fileName) {
	            var blob = dataURI; // could be a Blob object

	            if (typeof dataURI == "string") {
	                var parts = dataURI.split(";base64,");
	                var contentType = parts[0];
	                var base64 = atob(parts[1]);
	                var array = new Uint8Array(base64.length);

	                for (var idx = 0; idx < base64.length; idx++) {
	                    array[idx] = base64.charCodeAt(idx);
	                }
	                blob = new Blob([array.buffer], { type: contentType });
	            }

	            navigator.msSaveBlob(blob, fileName);
	        }

	        function saveAsDataURI(dataURI, fileName) {
	            if (window.Blob && dataURI instanceof Blob) {
	                dataURI = URL.createObjectURL(dataURI);
	            }

	            fileSaver.download = fileName;
	            fileSaver.href = dataURI;

	            var e = document.createEvent("MouseEvents");
	            e.initMouseEvent("click", true, false, window,
	                0, 0, 0, 0, 0, false, false, false, false, 0, null);

	            fileSaver.dispatchEvent(e);
	            setTimeout(function(){
	                URL.revokeObjectURL(dataURI);
	            });
	        }

	        kendo.saveAs = function(options) {
	            var save = postToProxy;

	            if (!options.forceProxy) {
	                if (downloadAttribute) {
	                    save = saveAsDataURI;
	                } else if (navigator.msSaveBlob) {
	                    save = saveAsBlob;
	                }
	            }

	            save(options.dataURI, options.fileName, options.proxyURL, options.proxyTarget);
	        };
	    })();

	    // kendo proxySetters
	    kendo.proxyModelSetters = function proxyModelSetters(data) {
	        var observable = {};

	        Object.keys(data || {}).forEach(function(property) {
	          Object.defineProperty(observable, property, {
	            get: function() {
	              return data[property];
	            },
	            set: function(value) {
	              data[property] = value;
	              data.dirty = true;
	            }
	          });
	        });

	        return observable;
	    };

	})(jQuery, window);

	return window.kendo;

	}, __webpack_require__(422));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(420)))

/***/ }

/******/ });
});

define('kendo-ui-core/js/kendo.calendar',['require','exports','module','./kendo.core'],function (require, exports, module) {module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(429);


/***/ },

/***/ 421:
/***/ function(module, exports) {

	module.exports = require("./kendo.core");

/***/ },

/***/ 422:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 429:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(421) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "calendar",
	    name: "Calendar",
	    category: "web",
	    description: "The Calendar widget renders a graphical calendar that supports navigation and selection.",
	    depends: [ "core" ]
	};

	(function($, undefined) {
	    var kendo = window.kendo,
	        support = kendo.support,
	        ui = kendo.ui,
	        Widget = ui.Widget,
	        keys = kendo.keys,
	        parse = kendo.parseDate,
	        adjustDST = kendo.date.adjustDST,
	        weekInYear = kendo.date.weekInYear,
	        extractFormat = kendo._extractFormat,
	        template = kendo.template,
	        getCulture = kendo.getCulture,
	        transitions = kendo.support.transitions,
	        transitionOrigin = transitions ? transitions.css + "transform-origin" : "",
	        cellTemplate = template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>', { useWithBlock: false }),
	        emptyCellTemplate = template('<td role="gridcell">&nbsp;</td>', { useWithBlock: false }),
	        weekNumberTemplate = template('<td class="k-alt">#= data.weekNumber #</td>', { useWithBlock: false }),
	        browser = kendo.support.browser,
	        isIE8 = browser.msie && browser.version < 9,
	        outerHeight = kendo._outerHeight,
	        outerWidth = kendo._outerWidth,
	        ns = ".kendoCalendar",
	        CLICK = "click" + ns,
	        KEYDOWN_NS = "keydown" + ns,
	        ID = "id",
	        MIN = "min",
	        LEFT = "left",
	        SLIDE = "slideIn",
	        MONTH = "month",
	        CENTURY = "century",
	        CHANGE = "change",
	        NAVIGATE = "navigate",
	        VALUE = "value",
	        HOVER = "k-state-hover",
	        DISABLED = "k-state-disabled",
	        FOCUSED = "k-state-focused",
	        OTHERMONTH = "k-other-month",
	        OTHERMONTHCLASS = ' class="' + OTHERMONTH + '"',
	        TODAY = "k-nav-today",
	        CELLSELECTOR = "td:has(.k-link)",
	        BLUR = "blur" + ns,
	        FOCUS = "focus",
	        FOCUS_WITH_NS = FOCUS + ns,
	        MOUSEENTER = support.touch ? "touchstart" : "mouseenter",
	        MOUSEENTER_WITH_NS = support.touch ? "touchstart" + ns : "mouseenter" + ns,
	        MOUSELEAVE = support.touch ? "touchend" + ns + " touchmove" + ns : "mouseleave" + ns,
	        MS_PER_MINUTE = 60000,
	        MS_PER_DAY = 86400000,
	        PREVARROW = "_prevArrow",
	        NEXTARROW = "_nextArrow",
	        ARIA_DISABLED = "aria-disabled",
	        ARIA_SELECTED = "aria-selected",
	        proxy = $.proxy,
	        extend = $.extend,
	        DATE = Date,
	        views = {
	            month: 0,
	            year: 1,
	            decade: 2,
	            century: 3
	        };

	    var Calendar = Widget.extend({      
	        init: function(element, options) {
	            var that = this, value, id;

	            Widget.fn.init.call(that, element, options);

	            element = that.wrapper = that.element;
	            options = that.options;

	            options.url = window.unescape(options.url);

	            that.options.disableDates = getDisabledExpr(that.options.disableDates);

	            that._templates();

	            that._header();

	            that._footer(that.footer);
	            
	            id = element
	                    .addClass("k-widget k-calendar " + (options.weekNumber ? " k-week-number" : ""))
	                    .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE, CELLSELECTOR, mousetoggle)
	                    .on(KEYDOWN_NS, "table.k-content", proxy(that._move, that))
	                    .on(CLICK, CELLSELECTOR, function(e) {
	                        var link = e.currentTarget.firstChild,
	                            value = that._toDateObject(link);

	                        if (link.href.indexOf("#") != -1) {
	                            e.preventDefault();
	                        }

	                        if (that._view.name == "month" && that.options.disableDates(value)) {
	                            return;
	                        }

	                        that._click($(link));
	                    })
	                    .on("mouseup" + ns, "table.k-content, .k-footer", function() {
	                        that._focusView(that.options.focusOnNav !== false);
	                    })
	                    .attr(ID);

	            if (id) {
	                that._cellID = id + "_cell_selected";
	            }

	            normalize(options);
	            value = parse(options.value, options.format, options.culture);

	            that._index = views[options.start];

	            that._current = new DATE(+restrictValue(value, options.min, options.max));

	            that._addClassProxy = function() {
	                that._active = true;

	                if (that._cell.hasClass(DISABLED)) {
	                    var todayString = that._view.toDateString(getToday());
	                    that._cell = that._cellByDate(todayString);
	                }

	                that._cell.addClass(FOCUSED);
	            };

	            that._removeClassProxy = function() {
	                that._active = false;
	                that._cell.removeClass(FOCUSED);
	            };

	            that.value(value);

	            kendo.notify(that);
	        },

	        options: {
	            name: "Calendar",
	            value: null,
	            min: new DATE(1900, 0, 1),
	            max: new DATE(2099, 11, 31),
	            dates: [],
	            url: "",
	            culture: "",
	            footer : "",
	            format : "",
	            month : {},
	            weekNumber: false,
	            start: MONTH,
	            depth: MONTH,
	            animation: {
	                horizontal: {
	                    effects: SLIDE,
	                    reverse: true,
	                    duration: 500,
	                    divisor: 2
	                },
	                vertical: {
	                    effects: "zoomIn",
	                    duration: 400
	                }
	            }
	        },

	        events: [
	            CHANGE,
	            NAVIGATE
	        ],

	        setOptions: function(options) {
	            var that = this;

	            normalize(options);

	            options.disableDates = getDisabledExpr(options.disableDates);

	            Widget.fn.setOptions.call(that, options);

	            that._templates();

	            that._footer(that.footer);
	            that._index = views[that.options.start];

	            that.navigate();
	        },

	        destroy: function() {
	            var that = this,
	            today = that._today;

	            that.element.off(ns);
	            that._title.off(ns);
	            that[PREVARROW].off(ns);
	            that[NEXTARROW].off(ns);

	            kendo.destroy(that._table);

	            if (today) {
	                kendo.destroy(today.off(ns));
	            }

	            Widget.fn.destroy.call(that);
	        },

	        current: function() {
	            return this._current;
	        },

	        view: function() {
	            return this._view;
	        },

	        focus: function(table) {
	            table = table || this._table;
	            this._bindTable(table);
	            table.focus();
	        },

	        min: function(value) {
	            return this._option(MIN, value);
	        },

	        max: function(value) {
	            return this._option("max", value);
	        },

	        navigateToPast: function() {
	            this._navigate(PREVARROW, -1);
	        },

	        navigateToFuture: function() {
	            this._navigate(NEXTARROW, 1);
	        },

	        navigateUp: function() {
	            var that = this,
	            index = that._index;

	            if (that._title.hasClass(DISABLED)) {
	                return;
	            }

	            that.navigate(that._current, ++index);
	        },

	        navigateDown: function(value) {
	            var that = this,
	            index = that._index,
	            depth = that.options.depth;

	            if (!value) {
	                return;
	            }

	            if (index === views[depth]) {
	                if (!isEqualDate(that._value, that._current) || !isEqualDate(that._value, value)) {
	                    that.value(value);
	                    that.trigger(CHANGE);
	                }
	                return;
	            }

	            that.navigate(value, --index);
	        },

	        navigate: function(value, view) {
	            view = isNaN(view) ? views[view] : view;

	            var that = this,
	                options = that.options,
	                culture = options.culture,
	                min = options.min,
	                max = options.max,
	                title = that._title,
	                from = that._table,
	                old = that._oldTable,
	                selectedValue = that._value,
	                currentValue = that._current,
	                future = value && +value > +currentValue,
	                vertical = view !== undefined && view !== that._index,
	                to, currentView, compare,
	                disabled;
	            if (!value) {
	                value = currentValue;
	            }

	            that._current = value = new DATE(+restrictValue(value, min, max));

	            if (view === undefined) {
	                view = that._index;
	            } else {
	                that._index = view;
	            }

	            that._view = currentView = calendar.views[view];
	            compare = currentView.compare;

	            disabled = view === views[CENTURY];
	            title.toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

	            disabled = compare(value, min) < 1;
	            that[PREVARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

	            disabled = compare(value, max) > -1;
	            that[NEXTARROW].toggleClass(DISABLED, disabled).attr(ARIA_DISABLED, disabled);

	            if (from && old && old.data("animating")) {
	                old.kendoStop(true, true);
	                from.kendoStop(true, true);
	            }

	            that._oldTable = from;

	            if (!from || that._changeView) {
	                title.html(currentView.title(value, min, max, culture));

	                that._table = to = $(currentView.content(extend({
	                    min: min,
	                    max: max,
	                    date: value,
	                    url: options.url,
	                    dates: options.dates,
	                    format: options.format,
	                    culture: culture,
	                    disableDates: options.disableDates,
	                    isWeekColumnVisible: options.weekNumber
	                }, that[currentView.name])));
	                
	                addClassToViewContainer(to, currentView.name);
	                makeUnselectable(to);
	                var replace = from && from.data("start") === to.data("start");
	                that._animate({
	                    from: from,
	                    to: to,
	                    vertical: vertical,
	                    future: future,
	                    replace: replace
	                });

	                that.trigger(NAVIGATE);

	                that._focus(value);
	            }

	            if (view === views[options.depth] && selectedValue && !that.options.disableDates(selectedValue)) {
	                that._class("k-state-selected", selectedValue);
	            }

	            that._class(FOCUSED, value);

	            if (!from && that._cell) {
	                that._cell.removeClass(FOCUSED);
	            }

	            that._changeView = true;
	        },

	        value: function(value) {
	            var that = this,
	                view = that._view,
	                options = that.options,
	                old = that._view,
	                min = options.min,
	                max = options.max;

	            if (value === undefined) {
	                return that._value;
	            }

	            if (value === null) {
	                that._current = new Date(that._current.getFullYear(), that._current.getMonth(), that._current.getDate());
	            }

	            value = parse(value, options.format, options.culture);

	            if (value !== null) {
	                value = new DATE(+value);

	                if (!isInRange(value, min, max)) {
	                    value = null;
	                }
	            }

	            if (value === null || !that.options.disableDates(value)) {
	                that._value = value;
	            } else if (that._value === undefined) {
	                that._value = null;
	            }

	            if (old && value === null && that._cell) {
	                that._cell.removeClass("k-state-selected");
	            } else {
	                that._changeView = !value || view && view.compare(value, that._current) !== 0;
	                that.navigate(value);
	            }
	        },

	        _move: function(e) {
	            var that = this,
	                options = that.options,
	                key = e.keyCode,
	                view = that._view,
	                index = that._index,
	                min = that.options.min,
	                max = that.options.max,
	                currentValue = new DATE(+that._current),
	                isRtl = kendo.support.isRtl(that.wrapper),
	                isDisabled = that.options.disableDates,
	                value, prevent, method, temp;

	            if (e.target === that._table[0]) {
	                that._active = true;
	            }

	            if (e.ctrlKey) {
	                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
	                    that.navigateToFuture();
	                    prevent = true;
	                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
	                    that.navigateToPast();
	                    prevent = true;
	                } else if (key == keys.UP) {
	                    that.navigateUp();
	                    prevent = true;
	                } else if (key == keys.DOWN) {
	                    that._click($(that._cell[0].firstChild));
	                    prevent = true;
	                }
	            } else {
	                if (key == keys.RIGHT && !isRtl || key == keys.LEFT && isRtl) {
	                    value = 1;
	                    prevent = true;
	                } else if (key == keys.LEFT && !isRtl || key == keys.RIGHT && isRtl) {
	                    value = -1;
	                    prevent = true;
	                } else if (key == keys.UP) {
	                    value = index === 0 ? -7 : -4;
	                    prevent = true;
	                } else if (key == keys.DOWN) {
	                    value = index === 0 ? 7 : 4;
	                    prevent = true;
	                } else if (key == keys.ENTER) {
	                    that._click($(that._cell[0].firstChild));
	                    prevent = true;
	                } else if (key == keys.HOME || key == keys.END) {
	                    method = key == keys.HOME ? "first" : "last";
	                    temp = view[method](currentValue);
	                    currentValue = new DATE(temp.getFullYear(), temp.getMonth(), temp.getDate(), currentValue.getHours(), currentValue.getMinutes(), currentValue.getSeconds(), currentValue.getMilliseconds());
	                    prevent = true;
	                } else if (key == keys.PAGEUP) {
	                    prevent = true;
	                    that.navigateToPast();
	                } else if (key == keys.PAGEDOWN) {
	                    prevent = true;
	                    that.navigateToFuture();
	                }

	                if (value || method) {
	                    if (!method) {
	                        view.setDate(currentValue, value);
	                    }

	                    if (isDisabled(currentValue)) {
	                        currentValue = that._nextNavigatable(currentValue, value);
	                    }
	                    if (isInRange(currentValue, min, max)) {
	                        that._focus(restrictValue(currentValue, options.min, options.max));
	                    }
	                }
	            }

	            if (prevent) {
	                e.preventDefault();
	            }

	            return that._current;
	        },

	        _nextNavigatable: function(currentValue, value) {
	            var that = this,
	            disabled = true,
	            view = that._view,
	            min = that.options.min,
	            max = that.options.max,
	            isDisabled = that.options.disableDates,
	            navigatableDate = new Date(currentValue.getTime());

	            view.setDate(navigatableDate, -value);

	            while (disabled) {
	                view.setDate(currentValue, value);

	                if (!isInRange(currentValue, min, max)) {
	                    currentValue = navigatableDate;
	                    break;
	                }
	                disabled = isDisabled(currentValue);
	            }
	            return currentValue;
	        },

	        _animate: function(options) {
	            var that = this,
	            from = options.from,
	            to = options.to,
	            active = that._active;

	            if (!from) {
	                to.insertAfter(that.element[0].firstChild);
	                that._bindTable(to);
	            } else if (from.parent().data("animating")) {
	                from.off(ns);
	                from.parent().kendoStop(true, true).remove();
	                from.remove();

	                to.insertAfter(that.element[0].firstChild);
	                that._focusView(active);
	            } else if (!from.is(":visible") || that.options.animation === false || options.replace) {
	                to.insertAfter(from);
	                from.off(ns).remove();

	                that._focusView(active);
	            } else {
	                that[options.vertical ? "_vertical" : "_horizontal"](from, to, options.future);
	            }
	        },

	        _horizontal: function(from, to, future) {
	            var that = this,
	                active = that._active,
	                horizontal = that.options.animation.horizontal,
	                effects = horizontal.effects,
	                viewWidth = outerWidth(from);

	            if (effects && effects.indexOf(SLIDE) != -1) {
	                from.add(to).css({ width: viewWidth });

	                from.wrap("<div/>");

	                that._focusView(active, from);

	                from.parent()
	                .css({
	                    position: "relative",
	                    width: viewWidth * 2,
	                    "float": LEFT,
	                    "margin-left": future ? 0 : -viewWidth
	                });

	                to[future ? "insertAfter" : "insertBefore"](from);

	                extend(horizontal, {
	                    effects: SLIDE + ":" + (future ? "right" : LEFT),
	                    complete: function() {
	                        from.off(ns).remove();
	                        that._oldTable = null;

	                        to.unwrap();

	                        that._focusView(active);

	                    }
	                });

	                from.parent().kendoStop(true, true).kendoAnimate(horizontal);
	            }
	        },

	        _vertical: function(from, to) {
	            var that = this,
	                vertical = that.options.animation.vertical,
	                effects = vertical.effects,
	                active = that._active, //active state before from's blur
	                cell, position;

	            if (effects && effects.indexOf("zoom") != -1) {
	                to.css({
	                    position: "absolute",
	                    top: outerHeight(from.prev()),
	                    left: 0
	                }).insertBefore(from);

	                if (transitionOrigin) {
	                    cell = that._cellByDate(that._view.toDateString(that._current));
	                    position = cell.position();
	                    position = (position.left + parseInt(cell.width() / 2, 10)) + "px" + " " + (position.top + parseInt(cell.height() / 2, 10) + "px");
	                    to.css(transitionOrigin, position);
	                }

	                from.kendoStop(true, true).kendoAnimate({
	                    effects: "fadeOut",
	                    duration: 600,
	                    complete: function() {
	                        from.off(ns).remove();
	                        that._oldTable = null;

	                        to.css({
	                            position: "static",
	                            top: 0,
	                            left: 0
	                        });

	                        that._focusView(active);
	                    }
	                });

	                to.kendoStop(true, true).kendoAnimate(vertical);
	            }
	        },

	        _cellByDate: function(value) {
	            return this._table.find("td:not(." + OTHERMONTH + ")")
	            .filter(function() {
	                return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
	            });
	        },

	        _class: function(className, date) {
	            var that = this,
	                id = that._cellID,
	                cell = that._cell,
	                value = that._view.toDateString(date),
	                disabledDate;

	            if (cell) {
	                cell.removeAttr(ARIA_SELECTED)
	                .removeAttr("aria-label")
	                .removeAttr(ID);
	            }

	            if (date && that._view.name == "month") {
	                disabledDate = that.options.disableDates(date);
	            }

	            cell = that._table
	            .find("td:not(." + OTHERMONTH + ")")
	            .removeClass(className)
	            .filter(function() {
	                return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
	            })
	            .attr(ARIA_SELECTED, true);

	            if (className === FOCUSED && !that._active && that.options.focusOnNav !== false || disabledDate) {
	                className = "";
	            }

	            cell.addClass(className);

	            if (cell[0]) {
	                that._cell = cell;
	            }

	            if (id) {
	                cell.attr(ID, id);
	                that._table.removeAttr("aria-activedescendant").attr("aria-activedescendant", id);
	            }
	        },

	        _bindTable: function (table) {
	            table
	            .on(FOCUS_WITH_NS, this._addClassProxy)
	            .on(BLUR, this._removeClassProxy);
	        },

	        _click: function(link) {
	            var that = this,
	            options = that.options,
	            currentValue = new Date(+that._current),
	            value = that._toDateObject(link);

	            adjustDST(value, 0);

	            if (that._view.name == "month" && that.options.disableDates(value)) {
	                value = that._value;
	            }

	            that._view.setDate(currentValue, value);

	            that.navigateDown(restrictValue(currentValue, options.min, options.max));
	        },

	        _focus: function(value) {
	            var that = this,
	            view = that._view;

	            if (view.compare(value, that._current) !== 0) {
	                that.navigate(value);
	            } else {
	                that._current = value;
	                that._class(FOCUSED, value);
	            }
	        },

	        _focusView: function(active, table) {
	            if (active) {
	                this.focus(table);
	            }
	        },

	        _footer: function(template) {
	            var that = this,
	            today = getToday(),
	            element = that.element,
	            footer = element.find(".k-footer");

	            if (!template) {
	                that._toggle(false);
	                footer.hide();
	                return;
	            }

	            if (!footer[0]) {
	                footer = $('<div class="k-footer"><a href="#" class="k-link k-nav-today"></a></div>').appendTo(element);
	            }

	            that._today = footer.show()
	            .find(".k-link")
	            .html(template(today))
	            .attr("title", kendo.toString(today, "D", that.options.culture));

	            that._toggle();
	        },

	        _header: function() {
	            var that = this,
	            element = that.element,
	            links;

	            if (!element.find(".k-header")[0]) {
	                element.html('<div class="k-header">' +
	                    '<a href="#" role="button" class="k-link k-nav-prev"><span class="k-icon k-i-arrow-60-left"></span></a>' +
	                    '<a href="#" role="button" aria-live="assertive" aria-atomic="true" class="k-link k-nav-fast"></a>' +
	                    '<a href="#" role="button" class="k-link k-nav-next"><span class="k-icon k-i-arrow-60-right"></span></a>' +
	                '</div>');
	            }

	            links = element.find(".k-link")
	            .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE + " " + FOCUS_WITH_NS + " " + BLUR, mousetoggle)
	            .click(false);

	            that._title = links.eq(1).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateUp(); });
	            that[PREVARROW] = links.eq(0).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateToPast(); });
	            that[NEXTARROW] = links.eq(2).on(CLICK, function() { that._active = that.options.focusOnNav !== false; that.navigateToFuture(); });
	        },

	        _navigate: function(arrow, modifier) {
	            var that = this,
	            index = that._index + 1,
	            currentValue = new DATE(+that._current);

	            arrow = that[arrow];

	            if (!arrow.hasClass(DISABLED)) {
	                if (index > 3) {
	                    currentValue.setFullYear(currentValue.getFullYear() + 100 * modifier);
	                } else {
	                    calendar.views[index].setDate(currentValue, modifier);
	                }

	                that.navigate(currentValue);
	            }
	        },

	        _option: function(option, value) {
	            var that = this,
	                options = that.options,
	                currentValue = that._value || that._current,
	                isBigger;

	            if (value === undefined) {
	                return options[option];
	            }

	            value = parse(value, options.format, options.culture);

	            if (!value) {
	                return;
	            }

	            options[option] = new DATE(+value);

	            if (option === MIN) {
	                isBigger = value > currentValue;
	            } else {
	                isBigger = currentValue > value;
	            }

	            if (isBigger || isEqualMonth(currentValue, value)) {
	                if (isBigger) {
	                    that._value = null;
	                }
	                that._changeView = true;
	            }

	            if (!that._changeView) {
	                that._changeView = !!(options.month.content || options.month.empty);
	            }

	            that.navigate(that._value);

	            that._toggle();
	        },

	        _toggle: function(toggle) {
	            var that = this,
	                options = that.options,
	                isTodayDisabled = that.options.disableDates(getToday()),
	                link = that._today;

	            if (toggle === undefined) {
	                toggle = isInRange(getToday(), options.min, options.max);
	            }

	            if (link) {
	                link.off(CLICK);

	                if (toggle && !isTodayDisabled) {
	                    link.addClass(TODAY)
	                    .removeClass(DISABLED)
	                    .on(CLICK, proxy(that._todayClick, that));
	                } else {
	                    link.removeClass(TODAY)
	                    .addClass(DISABLED)
	                    .on(CLICK, prevent);
	                }
	            }
	        },

	        _todayClick: function(e) {
	            var that = this,
	            depth = views[that.options.depth],
	            disabled = that.options.disableDates,
	            today = getToday();

	            e.preventDefault();

	            if (disabled(today)) {
	                return;
	            }

	            if (that._view.compare(that._current, today) === 0 && that._index == depth) {
	                that._changeView = false;
	            }

	            that._value = today;
	            that.navigate(today, depth);

	            that.trigger(CHANGE);
	        },

	        _toDateObject: function(link) {
	            var value = $(link).attr(kendo.attr(VALUE)).split("/");
	            //Safari cannot create correctly date from "1/1/2090"
	            value = new DATE(value[0], value[1], value[2]);

	            return value;
	        },

	        _templates: function() {
	            var that = this,
	                options = that.options,
	                footer = options.footer,
	                month = options.month,
	                content = month.content,
	                weekNumber = month.weekNumber,
	                empty = month.empty;

	            that.month = {
	                content: template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link#=data.linkClass#" href="#=data.url#" ' + kendo.attr("value") + '="#=data.dateString#" title="#=data.title#">' + (content || "#=data.value#") + '</a></td>', { useWithBlock: !!content }),
	                empty: template('<td role="gridcell">' + (empty || "&nbsp;") + "</td>", { useWithBlock: !!empty }),
	                weekNumber: template('<td class="k-alt">' + (weekNumber || "#= data.weekNumber #") + "</td>", { useWithBlock: !!weekNumber })
	            };

	            that.footer = footer !== false ? template(footer || '#= kendo.toString(data,"D","' + options.culture +'") #', { useWithBlock: false }) : null;
	        }
	    });

	    ui.plugin(Calendar);

	    var calendar = {
	        firstDayOfMonth: function (date) {
	            return new DATE(
	                date.getFullYear(),
	                date.getMonth(),
	                1
	            );
	        },

	        firstVisibleDay: function (date, calendarInfo) {
	            calendarInfo = calendarInfo || kendo.culture().calendar;

	            var firstDay = calendarInfo.firstDay,
	            firstVisibleDay = new DATE(date.getFullYear(), date.getMonth(), 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

	            while (firstVisibleDay.getDay() != firstDay) {
	                calendar.setTime(firstVisibleDay, -1 * MS_PER_DAY);
	            }

	            return firstVisibleDay;
	        },

	        setTime: function (date, time) {
	            var tzOffsetBefore = date.getTimezoneOffset(),
	            resultDATE = new DATE(date.getTime() + time),
	            tzOffsetDiff = resultDATE.getTimezoneOffset() - tzOffsetBefore;

	            date.setTime(resultDATE.getTime() + tzOffsetDiff * MS_PER_MINUTE);
	        },
	        views: [{
	            name: MONTH,
	            title: function(date, min, max, culture) {
	                return getCalendarInfo(culture).months.names[date.getMonth()] + " " + date.getFullYear();
	            },
	            content: function(options) {
	                var that = this,
	                idx = 0,
	                min = options.min,
	                max = options.max,
	                date = options.date,
	                dates = options.dates,
	                format = options.format,
	                culture = options.culture,
	                navigateUrl = options.url,
	                isWeekColumnVisible = options.isWeekColumnVisible,
	                hasUrl = navigateUrl && dates[0],
	                currentCalendar = getCalendarInfo(culture),
	                firstDayIdx = currentCalendar.firstDay,
	                days = currentCalendar.days,
	                names = shiftArray(days.names, firstDayIdx),
	                shortNames = shiftArray(days.namesShort, firstDayIdx),
	                start = calendar.firstVisibleDay(date, currentCalendar),
	                firstDayOfMonth = that.first(date),
	                lastDayOfMonth = that.last(date),
	                toDateString = that.toDateString,
	                today = new DATE(),
	                html = '<table tabindex="0" role="grid" class="k-content" cellspacing="0" data-start="' + toDateString(start) + '"><thead><tr role="row">';
	                if (isWeekColumnVisible) {
	                    html += '<th scope="col" class="k-alt"></th>';
	                }
	                
	                for (; idx < 7; idx++) {
	                    html += '<th scope="col" title="' + names[idx] + '">' + shortNames[idx] + '</th>';
	                }

	                today = new DATE(today.getFullYear(), today.getMonth(), today.getDate());
	                adjustDST(today, 0);
	                today = +today;

	                return view({
	                    cells: 42,
	                    perRow: 7,
	                    html: html += '</tr></thead><tbody><tr role="row">',
	                    start: start,
	                    isWeekColumnVisible: isWeekColumnVisible,
	                    weekNumber: options.weekNumber,
	                    min: new DATE(min.getFullYear(), min.getMonth(), min.getDate()),
	                    max: new DATE(max.getFullYear(), max.getMonth(), max.getDate()),
	                    content: options.content,
	                    empty: options.empty,
	                    setter: that.setDate,
	                    disableDates: options.disableDates,
	                    build: function(date, idx, disableDates) {
	                        var cssClass = [],
	                        day = date.getDay(),
	                        linkClass = "",
	                        url = "#";

	                        if (date < firstDayOfMonth || date > lastDayOfMonth) {
	                            cssClass.push(OTHERMONTH);
	                        }

	                        if (disableDates(date)) {
	                            cssClass.push(DISABLED);
	                        }

	                        if (+date === today) {
	                            cssClass.push("k-today");
	                        }

	                        if (day === 0 || day === 6) {
	                            cssClass.push("k-weekend");
	                        }

	                        if (hasUrl && inArray(+date, dates)) {
	                            url = navigateUrl.replace("{0}", kendo.toString(date, format, culture));
	                            linkClass = " k-action-link";
	                        }

	                        return {
	                            date: date,
	                            dates: dates,
	                            ns: kendo.ns,
	                            title: kendo.toString(date, "D", culture),
	                            value: date.getDate(),
	                            dateString: toDateString(date),
	                            cssClass: cssClass[0] ? ' class="' + cssClass.join(" ") + '"' : "",
	                            linkClass: linkClass,
	                            url: url
	                        };
	                    },
	                    weekNumberBuild: function(date) {
	                        return {
	                            weekNumber: weekInYear(date, date),
	                            currentDate: date
	                        };          
	                    }
	                });
	            },
	            first: function(date) {
	                return calendar.firstDayOfMonth(date);
	            },
	            last: function(date) {
	                var last = new DATE(date.getFullYear(), date.getMonth() + 1, 0),
	                first = calendar.firstDayOfMonth(date),
	                timeOffset = Math.abs(last.getTimezoneOffset() - first.getTimezoneOffset());

	                if (timeOffset) {
	                    last.setHours(first.getHours() + (timeOffset / 60));
	                }

	                return last;
	            },
	            compare: function(date1, date2) {
	                var result,
	                month1 = date1.getMonth(),
	                year1 = date1.getFullYear(),
	                month2 = date2.getMonth(),
	                year2 = date2.getFullYear();

	                if (year1 > year2) {
	                    result = 1;
	                } else if (year1 < year2) {
	                    result = -1;
	                } else {
	                    result = month1 == month2 ? 0 : month1 > month2 ? 1 : -1;
	                }

	                return result;
	            },
	            setDate: function(date, value) {
	                var hours = date.getHours();
	                if (value instanceof DATE) {
	                    date.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
	                } else {
	                    calendar.setTime(date, value * MS_PER_DAY);
	                }
	                adjustDST(date, hours);
	            },
	            toDateString: function(date) {
	                return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
	            }
	        },
	        {
	            name: "year",
	            title: function(date) {
	                return date.getFullYear();
	            },
	            content: function(options) {
	                var namesAbbr = getCalendarInfo(options.culture).months.namesAbbr,
	                toDateString = this.toDateString,
	                min = options.min,
	                max = options.max;

	                return view({
	                    min: new DATE(min.getFullYear(), min.getMonth(), 1),
	                    max: new DATE(max.getFullYear(), max.getMonth(), 1),
	                    start: new DATE(options.date.getFullYear(), 0, 1),
	                    setter: this.setDate,
	                    build: function(date) {
	                        return {
	                            value: namesAbbr[date.getMonth()],
	                            ns: kendo.ns,
	                            dateString: toDateString(date),
	                            cssClass: ""
	                        };
	                    }
	                });
	            },
	            first: function(date) {
	                return new DATE(date.getFullYear(), 0, date.getDate());
	            },
	            last: function(date) {
	                return new DATE(date.getFullYear(), 11, date.getDate());
	            },
	            compare: function(date1, date2){
	                return compare(date1, date2);
	            },
	            setDate: function(date, value) {
	                var month,
	                hours = date.getHours();

	                if (value instanceof DATE) {
	                    month = value.getMonth();

	                    date.setFullYear(value.getFullYear(), month, date.getDate());

	                    if (month !== date.getMonth()) {
	                        date.setDate(0);
	                    }
	                } else {
	                    month = date.getMonth() + value;

	                    date.setMonth(month);

	                    if (month > 11) {
	                        month -= 12;
	                    }

	                    if (month > 0 && date.getMonth() != month) {
	                        date.setDate(0);
	                    }
	                }

	                adjustDST(date, hours);
	            },
	            toDateString: function(date) {
	                return date.getFullYear() + "/" + date.getMonth() + "/1";
	            }
	        },
	        {
	            name: "decade",
	            title: function(date, min, max) {
	                return title(date, min, max, 10);
	            },
	            content: function(options) {
	                var year = options.date.getFullYear(),
	                toDateString = this.toDateString;

	                return view({
	                    start: new DATE(year - year % 10 - 1, 0, 1),
	                    min: new DATE(options.min.getFullYear(), 0, 1),
	                    max: new DATE(options.max.getFullYear(), 0, 1),
	                    setter: this.setDate,
	                    build: function(date, idx) {
	                        return {
	                            value: date.getFullYear(),
	                            ns: kendo.ns,
	                            dateString: toDateString(date),
	                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
	                        };
	                    }
	                });
	            },
	            first: function(date) {
	                var year = date.getFullYear();
	                return new DATE(year - year % 10, date.getMonth(), date.getDate());
	            },
	            last: function(date) {
	                var year = date.getFullYear();
	                return new DATE(year - year % 10 + 9, date.getMonth(), date.getDate());
	            },
	            compare: function(date1, date2) {
	                return compare(date1, date2, 10);
	            },
	            setDate: function(date, value) {
	                setDate(date, value, 1);
	            },
	            toDateString: function(date) {
	                return date.getFullYear() + "/0/1";
	            }
	        },
	        {
	            name: CENTURY,
	            title: function(date, min, max) {
	                return title(date, min, max, 100);
	            },
	            content: function(options) {
	                var year = options.date.getFullYear(),
	                min = options.min.getFullYear(),
	                max = options.max.getFullYear(),
	                toDateString = this.toDateString,
	                minYear = min,
	                maxYear = max;

	                minYear = minYear - minYear % 10;
	                maxYear = maxYear - maxYear % 10;

	                if (maxYear - minYear < 10) {
	                    maxYear = minYear + 9;
	                }

	                return view({
	                    start: new DATE(year - year % 100 - 10, 0, 1),
	                    min: new DATE(minYear, 0, 1),
	                    max: new DATE(maxYear, 0, 1),
	                    setter: this.setDate,
	                    build: function(date, idx) {
	                        var start = date.getFullYear(),
	                        end = start + 9;

	                        if (start < min) {
	                            start = min;
	                        }

	                        if (end > max) {
	                            end = max;
	                        }

	                        return {
	                            ns: kendo.ns,
	                            value: start + " - " + end,
	                            dateString: toDateString(date),
	                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
	                        };
	                    }
	                });
	            },
	            first: function(date) {
	                var year = date.getFullYear();
	                return new DATE(year - year % 100, date.getMonth(), date.getDate());
	            },
	            last: function(date) {
	                var year = date.getFullYear();
	                return new DATE(year - year % 100 + 99, date.getMonth(), date.getDate());
	            },
	            compare: function(date1, date2) {
	                return compare(date1, date2, 100);
	            },
	            setDate: function(date, value) {
	                setDate(date, value, 10);
	            },
	            toDateString: function(date) {
	                var year = date.getFullYear();
	                return (year - year % 10) + "/0/1";
	            }
	        }]
	    };

	    function title(date, min, max, modular) {
	        var start = date.getFullYear(),
	            minYear = min.getFullYear(),
	            maxYear = max.getFullYear(),
	            end;

	        start = start - start % modular;
	        end = start + (modular - 1);

	        if (start < minYear) {
	            start = minYear;
	        }
	        if (end > maxYear) {
	            end = maxYear;
	        }

	        return start + "-" + end;
	    }

	    function view(options) {
	        var idx = 0,
	            data,
	            min = options.min,
	            max = options.max,
	            start = options.start,
	            setter = options.setter,
	            build = options.build,
	            weekNumberBuild = options.weekNumberBuild,
	            length = options.cells || 12,
	            isWeekColumnVisible = options.isWeekColumnVisible,
	            cellsPerRow = options.perRow || 4,
	            weekNumber = options.weekNumber || weekNumberTemplate,
	            content = options.content || cellTemplate,
	            empty = options.empty || emptyCellTemplate,      
	            html = options.html || '<table tabindex="0" role="grid" class="k-content k-meta-view" cellspacing="0"><tbody><tr role="row">';
	            if(isWeekColumnVisible) {
	                html += weekNumber(weekNumberBuild(start));
	            }
	            

	        for(; idx < length; idx++) {
	            if (idx > 0 && idx % cellsPerRow === 0) {
	                html += '</tr><tr role="row">';
	                if(isWeekColumnVisible) {
	                    html += weekNumber(weekNumberBuild(start));
	                }
	            }

	            start = new DATE(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
	            adjustDST(start, 0);

	            data = build(start, idx, options.disableDates);

	            html += isInRange(start, min, max) ? content(data) : empty(data);

	            setter(start, 1);
	        }

	        return html + "</tr></tbody></table>";
	    }

	    function compare(date1, date2, modifier) {
	        var year1 = date1.getFullYear(),
	            start  = date2.getFullYear(),
	            end = start,
	            result = 0;

	        if (modifier) {
	            start = start - start % modifier;
	            end = start - start % modifier + modifier - 1;
	        }

	        if (year1 > end) {
	            result = 1;
	        } else if (year1 < start) {
	            result = -1;
	        }

	        return result;
	    }

	    function getToday() {
	        var today = new DATE();
	        return new DATE(today.getFullYear(), today.getMonth(), today.getDate());
	    }

	    function restrictValue (value, min, max) {
	        var today = getToday();

	        if (value) {
	            today = new DATE(+value);
	        }

	        if (min > today) {
	            today = new DATE(+min);
	        } else if (max < today) {
	            today = new DATE(+max);
	        }
	        return today;
	    }

	    function isInRange(date, min, max) {
	        return +date >= +min && +date <= +max;
	    }

	    function shiftArray(array, idx) {
	        return array.slice(idx).concat(array.slice(0, idx));
	    }

	    function setDate(date, value, multiplier) {
	        value = value instanceof DATE ? value.getFullYear() : date.getFullYear() + multiplier * value;
	        date.setFullYear(value);
	    }

	    function mousetoggle(e) {
	        var disabled = $(this).hasClass("k-state-disabled");

	        if (!disabled) {
	            $(this).toggleClass(HOVER, MOUSEENTER.indexOf(e.type) > -1 || e.type == FOCUS);
	        }
	    }

	    function prevent (e) {
	        e.preventDefault();
	    }

	    function getCalendarInfo(culture) {
	        return getCulture(culture).calendars.standard;
	    }

	    function normalize(options) {
	        var start = views[options.start],
	            depth = views[options.depth],
	            culture = getCulture(options.culture);

	        options.format = extractFormat(options.format || culture.calendars.standard.patterns.d);

	        if (isNaN(start)) {
	            start = 0;
	            options.start = MONTH;
	        }

	        if (depth === undefined || depth > start) {
	            options.depth = MONTH;
	        }

	        if (options.dates === null) {
	            options.dates = [];
	        }
	    }

	    function makeUnselectable(element) {
	        if (isIE8) {
	            element.find("*").attr("unselectable", "on");
	        }
	    }

	    function addClassToViewContainer(element, currentView) {
	        element.addClass("k-" + currentView);
	    }

	    function inArray(date, dates) {
	        for(var i = 0, length = dates.length; i < length; i++) {
	            if (date === +dates[i]) {
	                return true;
	            }
	        }
	        return false;
	    }

	    function isEqualDatePart(value1, value2) {
	        if (value1) {
	            return value1.getFullYear() === value2.getFullYear() &&
	                value1.getMonth() === value2.getMonth() &&
	                value1.getDate() === value2.getDate();
	        }

	        return false;
	    }

	    function isEqualMonth(value1, value2) {
	        if (value1) {
	            return value1.getFullYear() === value2.getFullYear() &&
	                value1.getMonth() === value2.getMonth();
	        }

	        return false;
	    }


	    function getDisabledExpr(option) {
	        if (kendo.isFunction(option)) {
	            return option;
	        }

	        if ($.isArray(option)) {
	            return createDisabledExpr(option);
	        }
	        return $.noop;
	    }

	    function convertDatesArray(dates) {
	        var result = [];
	        for (var i = 0; i < dates.length; i++) {
	            result.push(dates[i].setHours(0, 0, 0, 0));
	        }
	        return result;
	    }

	    function createDisabledExpr(dates) {
	        var body, callback,
	            disabledDates = [],
	            days = ["su", "mo", "tu", "we", "th", "fr", "sa"],
	            searchExpression = "if (found) {"+
	                    " return true " +
	                "} else {" +
	                    "return false" +
	                "}";

	        if (dates[0] instanceof DATE) {
	            disabledDates = convertDatesArray(dates);
	            body = "var found = date && $.inArray(date.setHours(0, 0, 0, 0),["+ disabledDates +"]) > -1;" + searchExpression;
	        } else {
	            for (var i = 0; i < dates.length; i++) {
	                var day = dates[i].slice(0,2).toLowerCase();
	                var index = $.inArray(day, days);
	                if (index > -1) {
	                    disabledDates.push(index);
	                }
	            }
	            body = "var found = date && $.inArray(date.getDay(),["+ disabledDates +"]) > -1;" + searchExpression;
	        }

	        callback = new Function("date", body); //jshint ignore:line

	        return callback;
	    }

	    function isEqualDate(oldValue, newValue) {
	       if (oldValue instanceof Date && newValue instanceof Date) {
	           oldValue = oldValue.getTime();
	           newValue = newValue.getTime();
	       }

	       return oldValue === newValue;
	    }

	    calendar.isEqualDatePart = isEqualDatePart;
	    calendar.isEqualDate = isEqualDate;
	    calendar.makeUnselectable =  makeUnselectable;
	    calendar.restrictValue = restrictValue;
	    calendar.isInRange = isInRange;
	    calendar.addClassToViewContainer = addClassToViewContainer;
	    calendar.normalize = normalize;
	    calendar.viewsEnum = views;
	    calendar.disabled = getDisabledExpr;

	    kendo.calendar = calendar;
	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(422));


/***/ }

/******/ });
});

define('text!styles.css', ['module'], function(module) { module.exports = "body { }\r\n\r\n/* forms */\r\n.form-group label {background:yellow;}\r\n\r\n/* offsets */\r\n.padding-x-0 {padding-left:0px !important;padding-right:0px !important;}\r\n.margin-x-0 {margin-left:0px !important;margin-right:0px !important;}\r\n\r\n.html-file-name {margin-left:10px;color:red;font-size:0.5em;}\r\n\r\n.display-none {display:none !important}\r\n.display-block {display:block !important}\r\n.display-inline-block {display:inline-block !important}\r\n\r\n.btn-i i.fa {margin-right:10px;}\r\n\r\nsection {\r\n  margin: 0 20px;\r\n}\r\n\r\na:focus {\r\n  outline: none;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.no-selection {\r\n  margin: 20px;\r\n}\r\n\r\n.contact-list {\r\n  overflow-y: auto;\r\n  border: 1px solid #ddd;\r\n  padding: 10px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\nli.list-group-item {\r\n  list-style: none;\r\n}\r\n\r\nli.list-group-item > a {\r\n  text-decoration: none;\r\n}\r\n\r\nli.list-group-item.active > a {\r\n  color: white;\r\n}\r\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./views/ui/nav-bar\"></require>\r\n  <require from=\"./views/ui/ui-footer\"></require>\r\n  <require from=\"./views/widgets/inputs/form-input\"></require>\r\n  <require from=\"./font-awesome.css\"></require>\r\n  <require from=\"./resources/format/json\"></require>\r\n  <require from=\"toastr/build/toastr.min.css\"></require>\r\n  \r\n  <link href=\"src/css/main.css\" rel=\"stylesheet\" />\r\n  <link href=\"src/css/bootstrap.min.css\" rel=\"stylesheet\" />\r\n\r\n  <!--<pre>? myGlobals: ${myGlobals.foo} | ${myGlobals.currentUser & json} | ${myGlobals.profileSelected & json} !</pre>-->\r\n\r\n\r\n  <div id=\"container-fixed-footer\">\r\n    <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\r\n    <nav-bar router.bind=\"router\" id=\"header\"></nav-bar>\r\n    <!--<div class=\"container\">\r\n      <div class=\"row\">\r\n      <nav class=\"breadcrumb\">\r\n        <a class=\"breadcrumb-item\" href=\"#\">Home</a>\r\n        <a class=\"breadcrumb-item\" href=\"#\">Library</a>\r\n        <a class=\"breadcrumb-item\" href=\"#\">Data</a>\r\n        <span class=\"breadcrumb-item active\">Bootstrap</span>\r\n      </nav>\r\n      </div>\r\n    </div>-->\r\n    \r\n\r\n    <pre if.bind=\"CV.debugShowCurrentUser\">? app.html | myGlobals.currentUser.isMember: ${myGlobals.currentUser.isMember} | myGlobals.currentUser.isEditor: ${myGlobals.currentUser.isEditor} !</pre>\r\n    <div class=\"container\" id=\"body\">\r\n      <div class=\"row\">\r\n        <router-view></router-view>\r\n      </div>\r\n    </div>\r\n\r\n    <ui-footer id=\"footer\"></ui-footer>\r\n  </div>\r\n\r\n\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\r\n  <require from=\"font-awesome.css\"></require>\r\n\r\n    <div class=\"container\">\r\n    <div class=\"row\">      \r\n      <div class=\"col-md-12\" style=\"padding-top:100px;\">\r\n          <h1>${title}</h1>\r\n        <form class=\"login-form\" submit.delegate=\"login()\">\r\n            <input type=\"text\" placeholder=\"username\" value.bind=\"username\" />\r\n            <input type=\"password\" placeholder=\"password\" value.bind=\"password\" />\r\n            <button type=\"submit\">Login</button>\r\n            <span class=\"error\">${error}</span>\r\n        </form>\r\n    </div>\r\n    </div>\r\n  </div>\r\n    \r\n</template>"; });
define('text!css/bootstrap.min.css', ['module'], function(module) { module.exports = "/*!\r\n * Bootstrap v3.3.7 (http://getbootstrap.com)\r\n * Copyright 2011-2017 Twitter, Inc.\r\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\r\n */\r\n\r\n/*!\r\n * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=fd54e94e7e281c29b96c627c331727c3)\r\n * Config saved to config.json and https://gist.github.com/fd54e94e7e281c29b96c627c331727c3\r\n *//*!\r\n * Bootstrap v3.3.7 (http://getbootstrap.com)\r\n * Copyright 2011-2016 Twitter, Inc.\r\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\r\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:bold}dfn{font-style:italic}h1{font-size:2em;margin:0.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-0.5em}sub{bottom:-0.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace, monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=\"checkbox\"],input[type=\"radio\"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto}input[type=\"search\"]{-webkit-appearance:textfield;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}input[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:bold}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,*:before,*:after{background:transparent !important;color:#000 !important;-webkit-box-shadow:none !important;box-shadow:none !important;text-shadow:none !important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"#\"]:after,a[href^=\"javascript:\"]:after{content:\"\"}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100% !important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000 !important}.label{border:1px solid #000}.table{border-collapse:collapse !important}.table td,.table th{background-color:#fff !important}.table-bordered th,.table-bordered td{border:1px solid #ddd !important}}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*:before,*:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}input,button,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#97cc00;text-decoration:none}a:hover,a:focus{color:#5e8000;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.img-responsive,.thumbnail>img,.thumbnail a>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:0;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;display:inline-block;max-width:100%;height:auto}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=\"button\"]{cursor:pointer}h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small,.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 .small,h2 .small,h3 .small,h4 .small,h5 .small,h6 .small,.h1 .small,.h2 .small,.h3 .small,.h4 .small,.h5 .small,.h6 .small{font-weight:normal;line-height:1;color:#777}h1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px}h1 small,.h1 small,h2 small,.h2 small,h3 small,.h3 small,h1 .small,.h1 .small,h2 .small,.h2 .small,h3 .small,.h3 .small{font-size:65%}h4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px}h4 small,.h4 small,h5 small,.h5 small,h6 small,.h6 small,h4 .small,.h4 .small,h5 .small,.h5 .small,h6 .small,.h6 .small{font-size:75%}h1,.h1{font-size:36px}h2,.h2{font-size:30px}h3,.h3{font-size:24px}h4,.h4{font-size:18px}h5,.h5{font-size:14px}h6,.h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}small,.small{font-size:85%}mark,.mark{background-color:#fcf8e3;padding:.2em}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#090}a.text-primary:hover,a.text-primary:focus{color:#060}.text-success{color:#3c763d}a.text-success:hover,a.text-success:focus{color:#2b542c}.text-info{color:#31708f}a.text-info:hover,a.text-info:focus{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:hover,a.text-warning:focus{color:#66512c}.text-danger{color:#a94442}a.text-danger:hover,a.text-danger:focus{color:#843534}.bg-primary{color:#fff;background-color:#090}a.bg-primary:hover,a.bg-primary:focus{background-color:#060}.bg-success{background-color:#dff0d8}a.bg-success:hover,a.bg-success:focus{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:hover,a.bg-info:focus{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:hover,a.bg-warning:focus{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:hover,a.bg-danger:focus{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ul,ol{margin-top:0;margin-bottom:10px}ul ul,ol ul,ul ol,ol ol{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none;margin-left:-5px}.list-inline>li{display:inline-block;padding-left:5px;padding-right:5px}dl{margin-top:0;margin-bottom:20px}dt,dd{line-height:1.42857143}dt{font-weight:bold}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;clear:left;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[title],abbr[data-original-title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote p:last-child,blockquote ul:last-child,blockquote ol:last-child{margin-bottom:0}blockquote footer,blockquote small,blockquote .small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote footer:before,blockquote small:before,blockquote .small:before{content:'\\2014 \\00A0'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;border-right:5px solid #eee;border-left:0;text-align:right}.blockquote-reverse footer:before,blockquote.pull-right footer:before,.blockquote-reverse small:before,blockquote.pull-right small:before,.blockquote-reverse .small:before,blockquote.pull-right .small:before{content:''}.blockquote-reverse footer:after,blockquote.pull-right footer:after,.blockquote-reverse small:after,blockquote.pull-right small:after,.blockquote-reverse .small:after,blockquote.pull-right .small:after{content:'\\00A0 \\2014'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:0}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25)}kbd kbd{padding:0;font-size:100%;font-weight:bold;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:0}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}.row{margin-left:-15px;margin-right:-15px}.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position:relative;min-height:1px;padding-left:15px;padding-right:15px}.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>thead>tr>td{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=\"col-\"]{position:static;float:none;display:table-column}table td[class*=\"col-\"],table th[class*=\"col-\"]{position:static;float:none;display:table-cell}.table>thead>tr>td.active,.table>tbody>tr>td.active,.table>tfoot>tr>td.active,.table>thead>tr>th.active,.table>tbody>tr>th.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>tbody>tr.active>td,.table>tfoot>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr.active>th,.table>tfoot>tr.active>th{background-color:#f5f5f5}.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover,.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr.active:hover>th{background-color:#e8e8e8}.table>thead>tr>td.success,.table>tbody>tr>td.success,.table>tfoot>tr>td.success,.table>thead>tr>th.success,.table>tbody>tr>th.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>tbody>tr.success>td,.table>tfoot>tr.success>td,.table>thead>tr.success>th,.table>tbody>tr.success>th,.table>tfoot>tr.success>th{background-color:#dff0d8}.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover,.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr.success:hover>th{background-color:#d0e9c6}.table>thead>tr>td.info,.table>tbody>tr>td.info,.table>tfoot>tr>td.info,.table>thead>tr>th.info,.table>tbody>tr>th.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>tbody>tr.info>td,.table>tfoot>tr.info>td,.table>thead>tr.info>th,.table>tbody>tr.info>th,.table>tfoot>tr.info>th{background-color:#d9edf7}.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover,.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr.info:hover>th{background-color:#c4e3f3}.table>thead>tr>td.warning,.table>tbody>tr>td.warning,.table>tfoot>tr>td.warning,.table>thead>tr>th.warning,.table>tbody>tr>th.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>tbody>tr.warning>td,.table>tfoot>tr.warning>td,.table>thead>tr.warning>th,.table>tbody>tr.warning>th,.table>tfoot>tr.warning>th{background-color:#fcf8e3}.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr.warning:hover>th{background-color:#faf2cc}.table>thead>tr>td.danger,.table>tbody>tr>td.danger,.table>tfoot>tr>td.danger,.table>thead>tr>th.danger,.table>tbody>tr>th.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>tbody>tr.danger>td,.table>tfoot>tr.danger>td,.table>thead>tr.danger>th,.table>tbody>tr.danger>th,.table>tfoot>tr.danger>th{background-color:#f2dede}.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover,.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr.danger:hover>th{background-color:#ebcccc}.table-responsive{overflow-x:auto;min-height:0.01%}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>thead>tr>th,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tfoot>tr>td{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>thead>tr>th:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.table-responsive>.table-bordered>thead>tr>th:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>th,.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>td{border-bottom:0}}fieldset{padding:0;margin:0;border:0;min-width:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:bold}input[type=\"search\"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=\"radio\"],input[type=\"checkbox\"]{margin:4px 0 0;margin-top:1px \\9;line-height:normal}input[type=\"file\"]{display:block}input[type=\"range\"]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=\"file\"]:focus,input[type=\"radio\"]:focus,input[type=\"checkbox\"]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{border:0;background-color:transparent}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=\"search\"]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=\"date\"].form-control,input[type=\"time\"].form-control,input[type=\"datetime-local\"].form-control,input[type=\"month\"].form-control{line-height:34px}input[type=\"date\"].input-sm,input[type=\"time\"].input-sm,input[type=\"datetime-local\"].input-sm,input[type=\"month\"].input-sm,.input-group-sm input[type=\"date\"],.input-group-sm input[type=\"time\"],.input-group-sm input[type=\"datetime-local\"],.input-group-sm input[type=\"month\"]{line-height:30px}input[type=\"date\"].input-lg,input[type=\"time\"].input-lg,input[type=\"datetime-local\"].input-lg,input[type=\"month\"].input-lg,.input-group-lg input[type=\"date\"],.input-group-lg input[type=\"time\"],.input-group-lg input[type=\"datetime-local\"],.input-group-lg input[type=\"month\"]{line-height:46px}}.form-group{margin-bottom:15px}.radio,.checkbox{position:relative;display:block;margin-top:10px;margin-bottom:10px}.radio label,.checkbox label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:normal;cursor:pointer}.radio input[type=\"radio\"],.radio-inline input[type=\"radio\"],.checkbox input[type=\"checkbox\"],.checkbox-inline input[type=\"checkbox\"]{position:absolute;margin-left:-20px;margin-top:4px \\9}.radio+.radio,.checkbox+.checkbox{margin-top:-5px}.radio-inline,.checkbox-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;vertical-align:middle;font-weight:normal;cursor:pointer}.radio-inline+.radio-inline,.checkbox-inline+.checkbox-inline{margin-top:0;margin-left:10px}input[type=\"radio\"][disabled],input[type=\"checkbox\"][disabled],input[type=\"radio\"].disabled,input[type=\"checkbox\"].disabled,fieldset[disabled] input[type=\"radio\"],fieldset[disabled] input[type=\"checkbox\"]{cursor:not-allowed}.radio-inline.disabled,.checkbox-inline.disabled,fieldset[disabled] .radio-inline,fieldset[disabled] .checkbox-inline{cursor:not-allowed}.radio.disabled label,.checkbox.disabled label,fieldset[disabled] .radio label,fieldset[disabled] .checkbox label{cursor:not-allowed}.form-control-static{padding-top:7px;padding-bottom:7px;margin-bottom:0;min-height:34px}.form-control-static.input-lg,.form-control-static.input-sm{padding-left:0;padding-right:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}textarea.input-sm,select[multiple].input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm textarea.form-control,.form-group-sm select[multiple].form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}textarea.input-lg,select[multiple].input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg textarea.form-control,.form-group-lg select[multiple].form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.input-lg+.form-control-feedback,.input-group-lg+.form-control-feedback,.form-group-lg .form-control+.form-control-feedback{width:46px;height:46px;line-height:46px}.input-sm+.form-control-feedback,.input-group-sm+.form-control-feedback,.form-group-sm .form-control+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .help-block,.has-success .control-label,.has-success .radio,.has-success .checkbox,.has-success .radio-inline,.has-success .checkbox-inline,.has-success.radio label,.has-success.checkbox label,.has-success.radio-inline label,.has-success.checkbox-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;border-color:#3c763d;background-color:#dff0d8}.has-success .form-control-feedback{color:#3c763d}.has-warning .help-block,.has-warning .control-label,.has-warning .radio,.has-warning .checkbox,.has-warning .radio-inline,.has-warning .checkbox-inline,.has-warning.radio label,.has-warning.checkbox label,.has-warning.radio-inline label,.has-warning.checkbox-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;border-color:#8a6d3b;background-color:#fcf8e3}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .help-block,.has-error .control-label,.has-error .radio,.has-error .checkbox,.has-error .radio-inline,.has-error .checkbox-inline,.has-error.radio label,.has-error.checkbox label,.has-error.radio-inline label,.has-error.checkbox-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;border-color:#a94442;background-color:#f2dede}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn,.form-inline .input-group .form-control{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .radio,.form-inline .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .radio label,.form-inline .checkbox label{padding-left:0}.form-inline .radio input[type=\"radio\"],.form-inline .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .radio,.form-horizontal .checkbox,.form-horizontal .radio-inline,.form-horizontal .checkbox-inline{margin-top:0;margin-bottom:0;padding-top:7px}.form-horizontal .radio,.form-horizontal .checkbox{min-height:27px}.form-horizontal .form-group{margin-left:-15px;margin-right:-15px}@media (min-width:768px){.form-horizontal .control-label{text-align:right;margin-bottom:0;padding-top:7px}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn:focus,.btn:active:focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn.active.focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn:hover,.btn:focus,.btn.focus{color:#97cc00;text-decoration:none}.btn:active,.btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#97cc00;background-color:#fff;border-color:#ccc}.btn-default:focus,.btn-default.focus{color:#97cc00;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#97cc00;background-color:#e6e6e6;border-color:#adadad}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{color:#97cc00;background-color:#e6e6e6;border-color:#adadad}.btn-default:active:hover,.btn-default.active:hover,.open>.dropdown-toggle.btn-default:hover,.btn-default:active:focus,.btn-default.active:focus,.open>.dropdown-toggle.btn-default:focus,.btn-default:active.focus,.btn-default.active.focus,.open>.dropdown-toggle.btn-default.focus{color:#97cc00;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled:hover,.btn-default[disabled]:hover,fieldset[disabled] .btn-default:hover,.btn-default.disabled:focus,.btn-default[disabled]:focus,fieldset[disabled] .btn-default:focus,.btn-default.disabled.focus,.btn-default[disabled].focus,fieldset[disabled] .btn-default.focus{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#97cc00}.btn-primary{color:#fff;background-color:#090;border-color:#008000}.btn-primary:focus,.btn-primary.focus{color:#fff;background-color:#060;border-color:#000}.btn-primary:hover{color:#fff;background-color:#060;border-color:#004200}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#060;border-color:#004200}.btn-primary:active:hover,.btn-primary.active:hover,.open>.dropdown-toggle.btn-primary:hover,.btn-primary:active:focus,.btn-primary.active:focus,.open>.dropdown-toggle.btn-primary:focus,.btn-primary:active.focus,.btn-primary.active.focus,.open>.dropdown-toggle.btn-primary.focus{color:#fff;background-color:#004200;border-color:#000}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled:hover,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary:hover,.btn-primary.disabled:focus,.btn-primary[disabled]:focus,fieldset[disabled] .btn-primary:focus,.btn-primary.disabled.focus,.btn-primary[disabled].focus,fieldset[disabled] .btn-primary.focus{background-color:#090;border-color:#008000}.btn-primary .badge{color:#090;background-color:#fff}.btn-success{color:#fff;background-color:#090;border-color:#008000}.btn-success:focus,.btn-success.focus{color:#fff;background-color:#060;border-color:#000}.btn-success:hover{color:#fff;background-color:#060;border-color:#004200}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#060;border-color:#004200}.btn-success:active:hover,.btn-success.active:hover,.open>.dropdown-toggle.btn-success:hover,.btn-success:active:focus,.btn-success.active:focus,.open>.dropdown-toggle.btn-success:focus,.btn-success:active.focus,.btn-success.active.focus,.open>.dropdown-toggle.btn-success.focus{color:#fff;background-color:#004200;border-color:#000}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled:hover,.btn-success[disabled]:hover,fieldset[disabled] .btn-success:hover,.btn-success.disabled:focus,.btn-success[disabled]:focus,fieldset[disabled] .btn-success:focus,.btn-success.disabled.focus,.btn-success[disabled].focus,fieldset[disabled] .btn-success.focus{background-color:#090;border-color:#008000}.btn-success .badge{color:#090;background-color:#fff}.btn-info{color:#fff;background-color:#090;border-color:#008000}.btn-info:focus,.btn-info.focus{color:#fff;background-color:#060;border-color:#000}.btn-info:hover{color:#fff;background-color:#060;border-color:#004200}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#060;border-color:#004200}.btn-info:active:hover,.btn-info.active:hover,.open>.dropdown-toggle.btn-info:hover,.btn-info:active:focus,.btn-info.active:focus,.open>.dropdown-toggle.btn-info:focus,.btn-info:active.focus,.btn-info.active.focus,.open>.dropdown-toggle.btn-info.focus{color:#fff;background-color:#004200;border-color:#000}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled:hover,.btn-info[disabled]:hover,fieldset[disabled] .btn-info:hover,.btn-info.disabled:focus,.btn-info[disabled]:focus,fieldset[disabled] .btn-info:focus,.btn-info.disabled.focus,.btn-info[disabled].focus,fieldset[disabled] .btn-info.focus{background-color:#090;border-color:#008000}.btn-info .badge{color:#090;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning:focus,.btn-warning.focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active:hover,.btn-warning.active:hover,.open>.dropdown-toggle.btn-warning:hover,.btn-warning:active:focus,.btn-warning.active:focus,.open>.dropdown-toggle.btn-warning:focus,.btn-warning:active.focus,.btn-warning.active.focus,.open>.dropdown-toggle.btn-warning.focus{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled:hover,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning:hover,.btn-warning.disabled:focus,.btn-warning[disabled]:focus,fieldset[disabled] .btn-warning:focus,.btn-warning.disabled.focus,.btn-warning[disabled].focus,fieldset[disabled] .btn-warning.focus{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger:focus,.btn-danger.focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active:hover,.btn-danger.active:hover,.open>.dropdown-toggle.btn-danger:hover,.btn-danger:active:focus,.btn-danger.active:focus,.open>.dropdown-toggle.btn-danger:focus,.btn-danger:active.focus,.btn-danger.active.focus,.open>.dropdown-toggle.btn-danger.focus{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled:hover,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger:hover,.btn-danger.disabled:focus,.btn-danger[disabled]:focus,fieldset[disabled] .btn-danger:focus,.btn-danger.disabled.focus,.btn-danger[disabled].focus,fieldset[disabled] .btn-danger.focus{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{color:#97cc00;font-weight:normal;border-radius:0}.btn-link,.btn-link:active,.btn-link.active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:hover,.btn-link:focus,.btn-link:active{border-color:transparent}.btn-link:hover,.btn-link:focus{color:#5e8000;text-decoration:underline;background-color:transparent}.btn-link[disabled]:hover,fieldset[disabled] .btn-link:hover,.btn-link[disabled]:focus,fieldset[disabled] .btn-link:focus{color:#777;text-decoration:none}.btn-lg,.btn-group-lg>.btn{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-sm,.btn-group-sm>.btn{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-xs,.btn-group-xs>.btn{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=\"submit\"].btn-block,input[type=\"reset\"].btn-block,input[type=\"button\"].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-property:height, visibility;-o-transition-property:height, visibility;transition-property:height, visibility;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid \\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropup,.dropdown{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;font-size:14px;text-align:left;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.15);border-radius:0;-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.175);box-shadow:0 6px 12px rgba(0,0,0,0.175);-webkit-background-clip:padding-box;background-clip:padding-box}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:hover,.dropdown-menu>li>a:focus{text-decoration:none;color:#262626;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:hover,.dropdown-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#090}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{color:#777}.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:not-allowed}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{left:auto;right:0}.dropdown-menu-left{left:0;right:auto}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;left:0;right:0;bottom:0;top:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{border-top:0;border-bottom:4px dashed;border-bottom:4px solid \\9;content:\"\"}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{left:auto;right:0}.navbar-right .dropdown-menu-left{left:0;right:auto}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group>.btn,.btn-group-vertical>.btn{position:relative;float:left}.btn-group>.btn:hover,.btn-group-vertical>.btn:hover,.btn-group>.btn:focus,.btn-group-vertical>.btn:focus,.btn-group>.btn:active,.btn-group-vertical>.btn:active,.btn-group>.btn.active,.btn-group-vertical>.btn.active{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-bottom-left-radius:0;border-top-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-left:8px;padding-right:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-left:12px;padding-right:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-right-radius:0;border-top-left-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{float:none;display:table-cell;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=\"buttons\"]>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn input[type=\"checkbox\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"checkbox\"]{position:absolute;clip:rect(0, 0, 0, 0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=\"col-\"]{float:none;padding-left:0;padding-right:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn,select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn,select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn{height:auto}.input-group-addon,.input-group-btn,.input-group .form-control{display:table-cell}.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child),.input-group .form-control:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:normal;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:0}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=\"radio\"],.input-group-addon input[type=\"checkbox\"]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group-btn:last-child>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-top-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:first-child>.btn-group:not(:first-child)>.btn{border-bottom-left-radius:0;border-top-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:hover,.input-group-btn>.btn:focus,.input-group-btn>.btn:active{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{margin-bottom:0;padding-left:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:hover,.nav>li>a:focus{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#777;text-decoration:none;background-color:transparent;cursor:not-allowed}.nav .open>a,.nav .open>a:hover,.nav .open>a:focus{background-color:#eee;border-color:#97cc00}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:0 0 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#555;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent;cursor:default}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:0 0 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:0}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:hover,.nav-pills>li.active>a:focus{color:#fff;background-color:#090}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:0 0 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-right-radius:0;border-top-left-radius:0}.navbar{position:relative;min-height:45px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:0}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{overflow-x:visible;padding-right:15px;padding-left:15px;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);-webkit-overflow-scrolling:touch}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block !important;height:auto !important;padding-bottom:0;overflow:visible !important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{padding-left:0;padding-right:0}}.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:200px}}.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-top,.navbar-fixed-bottom{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-top,.navbar-fixed-bottom{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;padding:12.5px 15px;font-size:18px;line-height:20px;height:45px}.navbar-brand:hover,.navbar-brand:focus{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;margin-right:15px;padding:9px 10px;margin-top:5.5px;margin-bottom:5.5px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:0}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:6.25px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu>li>a,.navbar-nav .open .dropdown-menu .dropdown-header{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:hover,.navbar-nav .open .dropdown-menu>li>a:focus{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:12.5px;padding-bottom:12.5px}}.navbar-form{margin-left:-15px;margin-right:-15px;padding:10px 15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);margin-top:5.5px;margin-bottom:5.5px}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn,.navbar-form .input-group .form-control{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .radio,.navbar-form .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .radio label,.navbar-form .checkbox label{padding-left:0}.navbar-form .radio input[type=\"radio\"],.navbar-form .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;border:0;margin-left:0;margin-right:0;padding-top:0;padding-bottom:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-right-radius:0;border-top-left-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:5.5px;margin-bottom:5.5px}.navbar-btn.btn-sm{margin-top:7.5px;margin-bottom:7.5px}.navbar-btn.btn-xs{margin-top:11.5px;margin-bottom:11.5px}.navbar-text{margin-top:12.5px;margin-bottom:12.5px}@media (min-width:768px){.navbar-text{float:left;margin-left:15px;margin-right:15px}}@media (min-width:768px){.navbar-left{float:left !important}.navbar-right{float:right !important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#fff;border-color:#eee}.navbar-default .navbar-brand{color:#090}.navbar-default .navbar-brand:hover,.navbar-default .navbar-brand:focus{color:#060;background-color:transparent}.navbar-default .navbar-text{color:#090}.navbar-default .navbar-nav>li>a{color:#090}.navbar-default .navbar-nav>li>a:hover,.navbar-default .navbar-nav>li>a:focus{color:#090;background-color:#eee}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:hover,.navbar-default .navbar-nav>.active>a:focus{color:#090;background-color:#fff}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:hover,.navbar-default .navbar-nav>.disabled>a:focus{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#eee}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:hover,.navbar-default .navbar-nav>.open>a:focus{background-color:#fff;color:#090}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#090}.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus{color:#090;background-color:#eee}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus{color:#090;background-color:#fff}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#090}.navbar-default .navbar-link:hover{color:#090}.navbar-default .btn-link{color:#090}.navbar-default .btn-link:hover,.navbar-default .btn-link:focus{color:#090}.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:hover,.navbar-default .btn-link[disabled]:focus,fieldset[disabled] .navbar-default .btn-link:focus{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-brand:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:hover,.navbar-inverse .navbar-nav>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:hover,.navbar-inverse .navbar-nav>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:hover,.navbar-inverse .navbar-nav>.disabled>a:focus{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:hover,.navbar-inverse .navbar-toggle:focus{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:hover,.navbar-inverse .navbar-nav>.open>a:focus{background-color:#080808;color:#fff}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:hover,.navbar-inverse .btn-link:focus{color:#fff}.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:hover,.navbar-inverse .btn-link[disabled]:focus,fieldset[disabled] .navbar-inverse .btn-link:focus{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:0}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{content:\"/\\00a0\";padding:0 5px;color:#ccc}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:0}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;line-height:1.42857143;text-decoration:none;color:#97cc00;background-color:#fff;border:1px solid #ddd;margin-left:-1px}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-bottom-left-radius:0;border-top-left-radius:0}.pagination>li:last-child>a,.pagination>li:last-child>span{border-bottom-right-radius:0;border-top-right-radius:0}.pagination>li>a:hover,.pagination>li>span:hover,.pagination>li>a:focus,.pagination>li>span:focus{z-index:2;color:#5e8000;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{z-index:3;color:#fff;background-color:#090;border-color:#090;cursor:default}.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus{color:#777;background-color:#fff;border-color:#ddd;cursor:not-allowed}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-bottom-left-radius:6px;border-top-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-bottom-right-radius:6px;border-top-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-bottom-left-radius:3px;border-top-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-bottom-right-radius:3px;border-top-right-radius:3px}.pager{padding-left:0;margin:20px 0;list-style:none;text-align:center}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:hover,.pager li>a:focus{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:hover,.pager .disabled>a:focus,.pager .disabled>span{color:#777;background-color:#fff;cursor:not-allowed}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:bold;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:hover,a.label:focus{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:hover,.label-default[href]:focus{background-color:#5e5e5e}.label-primary{background-color:#090}.label-primary[href]:hover,.label-primary[href]:focus{background-color:#060}.label-success{background-color:#090}.label-success[href]:hover,.label-success[href]:focus{background-color:#060}.label-info{background-color:#090}.label-info[href]:hover,.label-info[href]:focus{background-color:#060}.label-warning{background-color:#f0ad4e}.label-warning[href]:hover,.label-warning[href]:focus{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:hover,.label-danger[href]:focus{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:bold;color:#fff;line-height:1;vertical-align:middle;white-space:nowrap;text-align:center;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-xs .badge,.btn-group-xs>.btn .badge{top:0;padding:1px 5px}a.badge:hover,a.badge:focus{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#97cc00;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron h1,.jumbotron .h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{border-radius:6px;padding-left:15px;padding-right:15px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-left:60px;padding-right:60px}.jumbotron h1,.jumbotron .h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:0;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail>img,.thumbnail a>img{margin-left:auto;margin-right:auto}a.thumbnail:hover,a.thumbnail:focus,a.thumbnail.active{border-color:#97cc00}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:0}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:bold}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{background-color:#dff0d8;border-color:#d6e9c6;color:#3c763d}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{background-color:#d9edf7;border-color:#bce8f1;color:#31708f}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{background-color:#fcf8e3;border-color:#faebcc;color:#8a6d3b}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{background-color:#f2dede;border-color:#ebccd1;color:#a94442}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{overflow:hidden;height:20px;margin-bottom:20px;background-color:#f5f5f5;border-radius:0;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.progress-bar{float:left;width:0%;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#090;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-striped .progress-bar,.progress-bar-striped{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#090}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-info{background-color:#090}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{zoom:1;overflow:hidden}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-left,.media-right,.media-body{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{margin-bottom:20px;padding-left:0}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-right-radius:0;border-top-left-radius:0}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:hover,button.list-group-item:hover,a.list-group-item:focus,button.list-group-item:focus{text-decoration:none;color:#555;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:hover,.list-group-item.disabled:focus{background-color:#eee;color:#777;cursor:not-allowed}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:hover,.list-group-item.active:focus{z-index:2;color:#fff;background-color:#090;border-color:#090}.list-group-item.active .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>.small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:hover .list-group-item-text,.list-group-item.active:focus .list-group-item-text{color:#6f6}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:hover,button.list-group-item-success:hover,a.list-group-item-success:focus,button.list-group-item-success:focus{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,button.list-group-item-success.active,a.list-group-item-success.active:hover,button.list-group-item-success.active:hover,a.list-group-item-success.active:focus,button.list-group-item-success.active:focus{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:hover,button.list-group-item-info:hover,a.list-group-item-info:focus,button.list-group-item-info:focus{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,button.list-group-item-info.active,a.list-group-item-info.active:hover,button.list-group-item-info.active:hover,a.list-group-item-info.active:focus,button.list-group-item-info.active:focus{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:hover,button.list-group-item-warning:hover,a.list-group-item-warning:focus,button.list-group-item-warning:focus{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,button.list-group-item-warning.active,a.list-group-item-warning.active:hover,button.list-group-item-warning.active:hover,a.list-group-item-warning.active:focus,button.list-group-item-warning.active:focus{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:hover,button.list-group-item-danger:hover,a.list-group-item-danger:focus,button.list-group-item-danger:focus{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,button.list-group-item-danger.active,a.list-group-item-danger.active:hover,button.list-group-item-danger.active:hover,a.list-group-item-danger.active:focus,button.list-group-item-danger.active:focus{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:0;-webkit-box-shadow:0 1px 1px rgba(0,0,0,0.05);box-shadow:0 1px 1px rgba(0,0,0,0.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-right-radius:-1px;border-top-left-radius:-1px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>a,.panel-title>small,.panel-title>.small,.panel-title>small>a,.panel-title>.small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-right-radius:-1px;border-top-left-radius:-1px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-right-radius:0;border-top-left-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.table,.panel>.table-responsive>.table,.panel>.panel-collapse>.table{margin-bottom:0}.panel>.table caption,.panel>.table-responsive>.table caption,.panel>.panel-collapse>.table caption{padding-left:15px;padding-right:15px}.panel>.table:first-child,.panel>.table-responsive:first-child>.table:first-child{border-top-right-radius:-1px;border-top-left-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child{border-top-left-radius:-1px;border-top-right-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child{border-top-left-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child{border-top-right-radius:-1px}.panel>.table:last-child,.panel>.table-responsive:last-child>.table:last-child{border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-left-radius:-1px;border-bottom-right-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:-1px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child th,.panel>.table>tbody:first-child>tr:first-child td{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{border:0;margin-bottom:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:0}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.panel-body,.panel-group .panel-heading+.panel-collapse>.list-group{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#ddd}.panel-primary>.panel-heading{color:#fff;background-color:#090;border-color:#ddd}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-primary>.panel-heading .badge{color:#090;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive iframe,.embed-responsive embed,.embed-responsive object,.embed-responsive video{position:absolute;top:0;left:0;bottom:0;height:100%;width:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.05);box-shadow:inset 0 1px 1px rgba(0,0,0,0.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,0.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:bold;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;filter:alpha(opacity=20)}.close:hover,.close:focus{color:#000;text-decoration:none;cursor:pointer;opacity:.5;filter:alpha(opacity=50)}button.close{padding:0;cursor:pointer;background:transparent;border:0;-webkit-appearance:none}.modal-open{overflow:hidden}.modal{display:none;overflow:hidden;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transform:translate(0, -25%);-ms-transform:translate(0, -25%);-o-transform:translate(0, -25%);transform:translate(0, -25%);-webkit-transition:-webkit-transform 0.3s ease-out;-o-transition:-o-transform 0.3s ease-out;transition:transform 0.3s ease-out}.modal.in .modal-dialog{-webkit-transform:translate(0, 0);-ms-transform:translate(0, 0);-o-transform:translate(0, 0);transform:translate(0, 0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,0.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,0.5);box-shadow:0 3px 9px rgba(0,0,0,0.5);-webkit-background-clip:padding-box;background-clip:padding-box;outline:0}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{opacity:0;filter:alpha(opacity=0)}.modal-backdrop.in{opacity:.5;filter:alpha(opacity=50)}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-left:5px;margin-bottom:0}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,0.5);box-shadow:0 5px 15px rgba(0,0,0,0.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:Arial,Helvetica,sans-serif;font-style:normal;font-weight:normal;letter-spacing:normal;line-break:auto;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;white-space:normal;word-break:normal;word-spacing:normal;word-wrap:normal;font-size:12px;opacity:0;filter:alpha(opacity=0)}.tooltip.in{opacity:.9;filter:alpha(opacity=90)}.tooltip.top{margin-top:-3px;padding:5px 0}.tooltip.right{margin-left:3px;padding:0 5px}.tooltip.bottom{margin-top:3px;padding:5px 0}.tooltip.left{margin-left:-3px;padding:0 5px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:0}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{bottom:0;right:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.clearfix:before,.clearfix:after,.dl-horizontal dd:before,.dl-horizontal dd:after,.container:before,.container:after,.container-fluid:before,.container-fluid:after,.row:before,.row:after,.form-horizontal .form-group:before,.form-horizontal .form-group:after,.btn-toolbar:before,.btn-toolbar:after,.btn-group-vertical>.btn-group:before,.btn-group-vertical>.btn-group:after,.nav:before,.nav:after,.navbar:before,.navbar:after,.navbar-header:before,.navbar-header:after,.navbar-collapse:before,.navbar-collapse:after,.pager:before,.pager:after,.panel-body:before,.panel-body:after,.modal-header:before,.modal-header:after,.modal-footer:before,.modal-footer:after{content:\" \";display:table}.clearfix:after,.dl-horizontal dd:after,.container:after,.container-fluid:after,.row:after,.form-horizontal .form-group:after,.btn-toolbar:after,.btn-group-vertical>.btn-group:after,.nav:after,.navbar:after,.navbar-header:after,.navbar-collapse:after,.pager:after,.panel-body:after,.modal-header:after,.modal-footer:after{clear:both}.center-block{display:block;margin-left:auto;margin-right:auto}.pull-right{float:right !important}.pull-left{float:left !important}.hide{display:none !important}.show{display:block !important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none !important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-xs,.visible-sm,.visible-md,.visible-lg{display:none !important}.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block{display:none !important}@media (max-width:767px){.visible-xs{display:block !important}table.visible-xs{display:table !important}tr.visible-xs{display:table-row !important}th.visible-xs,td.visible-xs{display:table-cell !important}}@media (max-width:767px){.visible-xs-block{display:block !important}}@media (max-width:767px){.visible-xs-inline{display:inline !important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block !important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block !important}table.visible-sm{display:table !important}tr.visible-sm{display:table-row !important}th.visible-sm,td.visible-sm{display:table-cell !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block !important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block !important}table.visible-md{display:table !important}tr.visible-md{display:table-row !important}th.visible-md,td.visible-md{display:table-cell !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block !important}}@media (min-width:1200px){.visible-lg{display:block !important}table.visible-lg{display:table !important}tr.visible-lg{display:table-row !important}th.visible-lg,td.visible-lg{display:table-cell !important}}@media (min-width:1200px){.visible-lg-block{display:block !important}}@media (min-width:1200px){.visible-lg-inline{display:inline !important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block !important}}@media (max-width:767px){.hidden-xs{display:none !important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none !important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none !important}}@media (min-width:1200px){.hidden-lg{display:none !important}}.visible-print{display:none !important}@media print{.visible-print{display:block !important}table.visible-print{display:table !important}tr.visible-print{display:table-row !important}th.visible-print,td.visible-print{display:table-cell !important}}.visible-print-block{display:none !important}@media print{.visible-print-block{display:block !important}}.visible-print-inline{display:none !important}@media print{.visible-print-inline{display:inline !important}}.visible-print-inline-block{display:none !important}@media print{.visible-print-inline-block{display:inline-block !important}}@media print{.hidden-print{display:none !important}}"; });
define('text!my-globals.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n</template>"; });
define('text!css/main.css', ['module'], function(module) { module.exports = "@import url(bootstrap.min.css);html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}table{border-collapse:collapse;border-spacing:0}h1,h2,h3,h4,h5{margin-top:0}html,body{margin:0;padding:0;height:100%;background:white}header .logo-wrap{padding:10px}header .logo-wrap img{float:left;display:inline-block}header .logo-wrap span{display:inline-block;color:#090;font-weight:bold;font-size:20px;line-height:52px}.loading-message{display:block;width:100%;color:#090}.loading-message.sm{text-align:left;padding:10px}.loading-message.sm span{display:inline-block;margin-left:5px}.loading-message.lg{text-align:center;padding:50px 0}.loading-message.lg span{display:block;margin:10px auto}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4em;background:#fff;color:#303030;padding:0;margin:0}body>div.canvas{min-height:100%;position:relative}body>div.canvas main{padding-bottom:100px}body>div.canvas footer{position:absolute;bottom:0;width:100%;height:80px}.print-only{display:none}.breadcrumb{background:#fff;margin-bottom:0}a{color:#090;outline:0}a:hover{color:#067d00;text-decoration:underline;cursor:pointer}a:focus,a:active{color:#999;outline:none}*[ng-click],*[onclick],.cursor-pointer{outline:0;cursor:pointer}ul,li{margin:0;padding:0;list-style:none}input,textarea,button{-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.span-no-data-available{font-weight:bold}.span-info{color:#239F40}.span-good{color:#239F40}.span-date{color:#999;font-style:italic}.color-green-dark{color:#067d00}.color-green-1{color:#090}.color-green-2{color:#97CC00}.color-danger,.span-error{color:red}.span-warning{color:#f90}.color-obsolete{color:#999}.breadcrumbWrap{display:block}.breadcrumbWrap ul{display:block;list-style:none}.breadcrumbWrap ul li{display:inline;list-style:none}.breadcrumbWrap ul li.home a,.breadcrumbWrap ul li .ng-binding{padding:10px;display:inline-block}.breadcrumbWrap ul li:before{content:'/'}.breadcrumbWrap ul li:first-child:before{content:''}.breadcrumbWrap ul li:first-child a,.breadcrumbWrap ul li:first-child span{padding-left:0}.breadcrumbWrap ul li:last-child a,.breadcrumbWrap ul li:last-child span{color:#2d2d2d}.faintOpacity{filter:alpha(opacity=30);opacity:0.30}.semiOpacity{filter:alpha(opacity=50);opacity:0.5}.fullOpacity{filter:alpha(opacity=100);opacity:1.0}.display-block{display:block !important}.display-inline-block{display:inline-block !important}.display-none{display:none !important}.display-block-clear{display:block !important;clear:both}.color-good{color:#a6cf41}.color-good-bg{background:#a6cf41}.color-priority{color:#eb9316}.color-pending{color:#f90}.color-warning{color:#f90}.color-archive{color:red}.flagMe{padding:0px 10px;letter-spacing:2px;font-weight:bold}.emptyString{border:2px solid red;background:#ff9;color:red}.bg-danger{background:red;color:white}.warningBG{background:#f90;color:white}.lightwarningBG{background:#FFC926}.bg-white{background:white}.bg-white-xxx{background:white}.goodBG,.bg-good{background:#a6cf41}.errorBG,.bg-error{background:red}.bg-good-light{background:#dff0d8}.bg-info{background:#d9edf7}.bg-info-strong{background:#5bc0de}.bg-take-action{background:#FFCD04}.bg-lightgray{background:#f9f9f9}.labelBG{background:blue;color:white}.stringGood{background:#5cb85c;color:white}.bg-changed,.bg-provisional{background:#FDF3E4}.bg-warning{background:#f2dede}.bg-priority{background:#eb9316}.bg-loading{display:table;width:100%;height:100%;min-height:100px;text-align:center;color:#C40F11}.bg-loading .wrap-message{display:table-cell;vertical-align:middle;width:inherit;height:100%}.bg-loading .wrap-message span{font-weight:bold;line-height:20px}.bg-secondary-color{background:#C40F11;color:white}.container-page-error{text-align:center;padding-top:50px}.vertical-align-center{display:flex;align-items:center}.k-widget.k-datepicker{width:100%;height:32px}.k-picker-wrap{background:white !important;border-radius:0px;border-color:#ddd !important;height:100%}.k-autocomplete .k-input,.k-dropdown-wrap .k-input,.k-numeric-wrap .k-input,.k-picker-wrap .k-input,.k-selectbox .k-input,.k-textbox>input{height:22px;padding:5px 10px;text-indent:0px;border:0;margin:0}.k-state-default>.k-select{border-color:#fff}.k-state-default>.k-select>.k-icon{color:#090}.main-title-bar{margin-bottom:15px}.main-title-bar h1{float:left;margin:0 15px 0 0;line-height:1.0em}.main-title-bar .btn-group.profile-avater{height:32px}.main-title-bar .btn-group.profile-avater .input-group-addon{padding:0px;width:auto}.main-title-bar .btn-group.profile-avater .input-group-addon img{float:right;height:32px;width:auto;padding:0px}.form-cust-wrap{width:100%;margin:0;padding:0;display:block}.form-cust-wrap .form-cust-label{float:left;display:inline-block;width:50%;padding:0 15px}.form-cust-wrap .form-cust-label.label-with-checkbox,.form-cust-wrap .col-checkboxes label.form-cust-label,.col-checkboxes .form-cust-wrap label.form-cust-label,.form-cust-wrap .row-checkboxes label.form-cust-label,.row-checkboxes .form-cust-wrap label.form-cust-label{text-align:left !important;width:100%}.form-cust-wrap .form-cust-input{float:left;display:inline-block;width:50%;padding:0 15px}tr.tr-row-selected td{background-color:#fcf8e3}select.form-control[disabled],select.form-control[readonly]{background-color:transparent !important;padding:5px 10px !important;border:0px !important;-webkit-appearance:none;-moz-appearance:none;text-indent:1px;text-overflow:''}select.form-control[disabled]::-ms-expand{display:none !important}img.fit-col{width:100%;height:auto}.cursor-hover{cursor:pointer}.strapline{float:left;height:35px;margin:40px 0 0 50px}.form-control[readonly]{background-color:transparent !important;border-color:transparent !important;outline:none !important;opacity:1}.xxx_wrap-role .input-group .input-group-addon{background:transparent;padding-left:0px;font-weight:bold;border:0px}.xxx_wrap-role .input-group .input-group-addon i.fa{display:none}ai-dialog-overlay{background:white;filter:alpha(opacity=50) !important;opacity:0.5 !important}ai-dialog>ai-dialog-footer{padding:15px}table.table-hover tr:hover{cursor:pointer}div.wrap_table-add-user-from-list{display:block;min-height:100px;max-height:250px;overflow-y:scroll;overflow-x:hidden}ai-dialog{width:600px}ai-dialog.wide{width:800px}ai-dialog ai-dialog-header h2{margin:0}.btn-row{clear:both;display:block;width:100%;padding:15px;text-align:center}.btn-row .btn,.btn-row .str-inline-with-btns,.btn-row .pagination-controls .page-number,.pagination-controls .btn-row .page-number{display:inline-block}.select2{width:100% !important}.select2-container .select2-selection--single .select2-selection__rendered{padding-left:15px;padding-right:25px}.select2-container--default .select2-selection--single .select2-selection__clear{padding:0 5px}.select2-container--default .select2-selection--single{background-color:#fff;border:1px solid #ddd;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px}.select2-container .select2-selection--single{box-sizing:border-box;cursor:pointer;display:block;height:28px;user-select:none;-webkit-user-select:none}.panel .panel-heading.strong-heading,.panel.panel-xc .panel-heading{border-bottom:0px;background:#090;color:white;font-weight:bold}.panel .panel-heading.strong-heading .btn-text,.panel.panel-xc .panel-heading .btn-text{color:#ff0}.panel.panel-xc{margin-bottom:15px;border:1px solid #090;-webkit-box-shadow:none;box-shadow:none}.panel.panel-xc .panel-heading .btn.btn-xc_chevron,.panel.panel-xc .panel-heading .btn-xc_chevron.str-inline-with-btns,.panel.panel-xc .panel-heading .pagination-controls .btn-xc_chevron.page-number,.pagination-controls .panel.panel-xc .panel-heading .btn-xc_chevron.page-number{float:right;background:transparent}.panel.panel-xc .panel-heading .btn.btn-xc_chevron:before,.panel.panel-xc .panel-heading .btn-xc_chevron.str-inline-with-btns:before,.panel.panel-xc .panel-heading .pagination-controls .btn-xc_chevron.page-number:before,.pagination-controls .panel.panel-xc .panel-heading .btn-xc_chevron.page-number:before{color:#ff0;font-size:14px;line-height:14px;content:\"\\f077\"}.panel.panel-xc .panel-heading.collapsed .btn.btn-xc_chevron:before,.panel.panel-xc .panel-heading.collapsed .btn-xc_chevron.str-inline-with-btns:before,.panel.panel-xc .panel-heading.collapsed .pagination-controls .btn-xc_chevron.page-number:before,.pagination-controls .panel.panel-xc .panel-heading.collapsed .btn-xc_chevron.page-number:before{content:\"\\f078\"}.panel.panel-xc .panel-body{padding-top:0px;padding-bottom:0px}.panel.panel-xc .panel-body .wrap-fields{background:#f9f9f9;padding:15px 0 0 0;display:block;float:left;width:100%;height:auto}.panel.panel-xc .panel-body .wrap-fields .form-group label{text-align:right;font-size:13px;line-height:1.4em;padding-top:5px}.border-none{border:0px}.panel-heading{background:#f9f9f9;border:0px}.repeaters{clear:both;display:block;width:100%;height:auto}.panel-body .divider{clear:both;float:left;display:block;width:100%;height:1px;border-top:none;margin:0px}.panel-body .divider.dotted{border-top:1px dotted #ddd;margin-bottom:15px}[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak{display:none !important}.highlighted{background:yellow}.hide-border-top{border-top:none}.hide-border-top label{display:none}.color-amber{color:#FFA500}.color-good{color:#1fbb1f}.color-danger{color:#FF0000}.form-group label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize}.padding-x-0{padding-left:0px !important;padding-right:0px !important}.margin-x-0{margin-left:0px !important;margin-right:0px !important}.html-file-name{margin-left:10px;font-size:0.5em;color:#aaa}.display-none{display:none !important}.display-block{display:block !important}.display-inline-block{display:inline-block !important}section{margin:0 20px}.panel.panel-prompt-cust{border:none;background:#f9f9f9;border-left:5px solid #239F40}.panel.panel-prompt-cust.panel-page-error{display:inline-block;margin:30px auto;text-align:center;border:none;background:transparent;padding:10px 20px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px}.panel.panel-prompt-cust.panel-page-error .page-error-code{display:block;font-size:80px;margin:0 0 10px 0}.panel.panel-prompt-cust.panel-border{background:transparent;border:5px solid #f9f9f9}.panel.panel-prompt-cust.panel-warning{background:#fcf8e3;border-color:#FFCD04}.panel.panel-prompt-cust.panel-info{background:#d9edf7;border-color:#5bc0de}.panel.panel-prompt-cust.panel-success{background:#dff0d8;border-color:#a6cf41}.panel.panel-prompt-cust.panel-error,.panel.panel-prompt-cust.panel-danger{background:#F7C6BE;border-color:red}.panel.panel-prompt-cust>p,.panel.panel-prompt-cust>.panel-heading{padding:20px;border:none;height:auto;line-height:normal;background-image:none;background-repeat:unset;background:transparent;color:black}@media all and (min-width: 641px){html,body{margin:0;padding:0;height:100%}#container-fixed-footer{min-height:100%;position:relative}#body{padding-bottom:70px}#footer{position:absolute;bottom:0;width:100%;min-height:40px}}#exTab1 .tab-content{color:white;background-color:#428bca;padding:5px 15px}#exTab2 h3{color:white;background-color:#428bca;padding:5px 15px}#exTab1 .nav-pills>li>a{border-radius:0}#exTab3 .nav-pills>li>a{border-radius:4px 4px 0 0}#exTab3 .tab-content{color:white;background-color:#428bca;padding:5px 15px}h1>i,h2>i,h3>i,h4>i{margin-right:10px}h1{font-size:36px;margin:30px 0 15px 0;color:#007f00}h4{font-weight:bold}div.hdr-wrap{margin-bottom:10px}.hdr-inline{margin:0;display:inline-block}strong,.strong{font-weight:bold}.faint-small{color:#ccc;font-size:0.8em}.fa.text-after{margin-right:5px}.no-wrap{white-space:nowrap}.old-value{filter:alpha(opacity=50);opacity:0.5}.no-wrap{white-space:nowrap}.text-align-left{text-align:left}.text-align-center{text-align:center}.text-align-right{text-align:right}.text-line-through{text-decoration:line-through}.strong-title-accent{font-size:20px;color:#C40F11;font-weight:bold}.trim-string,span.trim-string-with-tooltip,span.trim-string-with-tooltip>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ngbindPlacholder:before{background:transparent url(../images/ajax-loader.gif) no-repeat 0 0;content:\"\";display:inline-block;width:16px;height:16px}.fa-dummy,.panel.panel-xc .panel-heading .btn.btn-xc_chevron:before,.panel.panel-xc .panel-heading .btn-xc_chevron.str-inline-with-btns:before,.panel.panel-xc .panel-heading .pagination-controls .btn-xc_chevron.page-number:before,.pagination-controls .panel.panel-xc .panel-heading .btn-xc_chevron.page-number:before,ul.help-list li:before,ul.error-list li:before,.fa-dummy-tooltip,span.trim-string-with-tooltip:after{vertical-align:top;font-family:FontAwesome}.wrap_xc_btns_allXXX{display:inline-block}.wrap_xc_btns_allXXX a{margin:0 10px}.wrap_xc_btns_allXXX .divider{display:inline-block;width:1px;height:10px;border-right:2px solid #ddd}.btn-group.btn-edit-avatar>.btn-group button.btn,.btn-group.btn-edit-avatar>.btn-group button.str-inline-with-btns,.btn-group.btn-edit-avatar>.btn-group .pagination-controls button.page-number,.pagination-controls .btn-group.btn-edit-avatar>.btn-group button.page-number{line-height:50px;padding:0 10px}.btn-group.btn-edit-avatar a.btn.avatar,.btn-group.btn-edit-avatar a.avatar.str-inline-with-btns,.btn-group.btn-edit-avatar .pagination-controls a.avatar.page-number,.pagination-controls .btn-group.btn-edit-avatar a.avatar.page-number{padding:0;border:1px solid #f1f1f1}.btn-group.btn-edit-avatar a.btn.avatar img,.btn-group.btn-edit-avatar a.avatar.str-inline-with-btns img,.btn-group.btn-edit-avatar .pagination-controls a.avatar.page-number img,.pagination-controls .btn-group.btn-edit-avatar a.avatar.page-number img{width:auto;max-height:50px}.btn.btn-debrief,.btn-debrief.str-inline-with-btns,.pagination-controls .btn-debrief.page-number{display:block;text-align:center;height:20px;line-height:20px;padding:0 10px;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px}.btn.btn-debrief.cross,.btn-debrief.cross.str-inline-with-btns,.pagination-controls .btn-debrief.cross.page-number{color:red}.btn.btn-debrief.cross.selected,.btn-debrief.cross.selected.str-inline-with-btns,.pagination-controls .btn-debrief.cross.selected.page-number{border-color:red;background:red;color:white}.btn.btn-debrief.tick,.btn-debrief.tick.str-inline-with-btns,.pagination-controls .btn-debrief.tick.page-number{color:#090}.btn.btn-debrief.tick.selected,.btn-debrief.tick.selected.str-inline-with-btns,.pagination-controls .btn-debrief.tick.selected.page-number{border-color:#090;background:#090;color:white}.btn.disabled,.disabled.str-inline-with-btns,.pagination-controls .disabled.page-number,.btn[disabled],[disabled].str-inline-with-btns,.pagination-controls [disabled].page-number,fieldset[disabled] .btn,fieldset[disabled] .str-inline-with-btns,fieldset[disabled] .pagination-controls .page-number,.pagination-controls fieldset[disabled] .page-number{color:#c8c8c8}.btn-gradient{background-image:-webkit-linear-gradient(top, #fff 0, #e0e0e0 100%);background-image:-o-linear-gradient(top, #fff 0, #e0e0e0 100%);background-image:-webkit-gradient(linear, left top, left bottom, color-stop(0, #fff), to(#e0e0e0));background-image:linear-gradient(to bottom, #fff 0, #e0e0e0 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe0e0e0', GradientType=0);filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);background-repeat:repeat-x}.btn-gradient-hover{background:#e0e0e0 !important}.btn,.str-inline-with-btns,.pagination-controls .page-number{text-align:left;font-size:13px;line-height:15px;padding:5px 10px}.str-inline-with-btns{display:inline-block;padding-left:0;padding-right:0}.btn.btn-lg,.btn-lg.str-inline-with-btns,.pagination-controls .btn-lg.page-number{font-size:18px;line-height:1.333;padding:10px 15px;height:28px;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;height:auto}label.label-with-radio,label.label-with-checkbox,.col-checkboxes label,.row-checkboxes label{cursor:pointer;color:#090;font-weight:normal}label.label-with-radio.strong,label.label-with-checkbox.strong,.col-checkboxes label.strong,.row-checkboxes label.strong{font-weight:bold}label.label-with-radio input[type=\"radio\"],label.label-with-radio input[type=\"checkbox\"],label.label-with-checkbox input[type=\"radio\"],.col-checkboxes label input[type=\"radio\"],.row-checkboxes label input[type=\"radio\"],label.label-with-checkbox input[type=\"checkbox\"],.col-checkboxes label input[type=\"checkbox\"],.row-checkboxes label input[type=\"checkbox\"]{width:15px;height:15px;margin-right:5px;margin-top:0px;float:left}label.label-with-radio.checkbox-right input[type=\"radio\"],label.label-with-radio.checkbox-right input[type=\"checkbox\"],label.label-with-checkbox.checkbox-right input[type=\"radio\"],.col-checkboxes label.checkbox-right input[type=\"radio\"],.row-checkboxes label.checkbox-right input[type=\"radio\"],label.label-with-checkbox.checkbox-right input[type=\"checkbox\"],.col-checkboxes label.checkbox-right input[type=\"checkbox\"],.row-checkboxes label.checkbox-right input[type=\"checkbox\"]{margin-right:0;margin-left:5px;float:right}label.label-with-radio input[type=\"radio\"]:checked.ng-dirty ~ *,label.label-with-checkbox input[type=\"radio\"]:checked.ng-dirty ~ *,.col-checkboxes label input[type=\"radio\"]:checked.ng-dirty ~ *,.row-checkboxes label input[type=\"radio\"]:checked.ng-dirty ~ *{font-weight:bold;color:#a6cf41 !important}label.label-with-radio input[type=\"radio\"]:checked.ng-untouched ~ *,label.label-with-checkbox input[type=\"radio\"]:checked.ng-untouched ~ *,.col-checkboxes label input[type=\"radio\"]:checked.ng-untouched ~ *,.row-checkboxes label input[type=\"radio\"]:checked.ng-untouched ~ *{font-weight:bold;color:black}.md-icon-button{background:transparent;color:white !important}.md-icon-button:hover{background:rgba(0,0,0,0.25)}.split-with-search-btn{display:inline-block;width:auto;width:calc(100% - 60px)}.form-control-fill>.multi-select-filter>.btn,.form-control-fill>.multi-select-filter>.str-inline-with-btns,.pagination-controls .form-control-fill>.multi-select-filter>.page-number{width:100%}.btn-a{box-shadow:none !important;padding-left:0;padding-right:0}.btn-add{background:white}.btn.btn-i .fa,.btn-i.str-inline-with-btns .fa,.pagination-controls .btn-i.page-number .fa{margin-right:5px;width:1.28571429em;text-align:center}.btn.btn-i.btn-a .fa,.btn-i.btn-a.str-inline-with-btns .fa,.pagination-controls .btn-i.btn-a.page-number .fa{margin-right:3px}.btn-disc-i{-webkit-border-radius:100%;-moz-border-radius:100%;border-radius:100%;width:auto;position:relative;overflow:hidden;padding:0;font-size:14px;width:28px;height:28px}.btn-disc-i.lg{width:40px;height:40px}.btn-disc-i:before{display:block;padding-top:100%;content:''}.btn-disc-i i.fa{position:absolute;top:50%;left:50%;margin:-7px 0 0 -7px}.btn-disc-i i.fa.fa-user{margin-left:-5px}.btn-disc-i i.fa.fa-download,.btn-disc-i i.fa.fa-pencil,.btn-disc-i i.fa.fa-search,.btn-disc-i i.fa.fa-cog{margin-left:-6px}.btn-disc-i i.fa.fa-chevron-left,.btn-disc-i i.fa.fa-chevron-right{margin-left:-5px}.nav-tabs{border-bottom:none}.nav-tabs>li{margin-bottom:0}.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#fff;font-weight:bold;border:none;cursor:default;text-decoration:none}.nav-tabs>li>a{color:#090;background:transparent !important;margin-right:0;border:none;padding:10px 15px;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px}.nav-tabs>li>a:hover{text-decoration:underline;border:none}.nav-tabs>li>a>i{margin-left:10px;position:absolute;top:12px;right:12px}.btn-add{border-color:#a6cf41;background:white;box-shadow:none}.btn-add:hover,.btn-add:focus{background:#dff0d8}.btn-priority{background-image:-webkit-linear-gradient(top, #f0ad4e 0, #eb9316 100%);background-image:-o-linear-gradient(top, #f0ad4e 0, #eb9316 100%);background-image:-webkit-gradient(linear, left top, left bottom, color-stop(0, #f0ad4e), to(#eb9316));background-image:linear-gradient(to bottom, #f0ad4e 0, #eb9316 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff0ad4e', endColorstr='#ffeb9316', GradientType=0);filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);background-repeat:repeat-x;border-color:#e38d13;color:#fff;text-shadow:none;background-color:#f0ad4e;border-color:#eea236}.btn-priority:hover,.btn-priority:focus{background-color:#eb9316;background-position:0 -15px;color:#fff}.btn-priority:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.pagination-status{font-weight:bold;color:#C40F11}.pagination-controls{width:110px}.pagination-controls .page-number{text-align:center !important;box-shadow:none}.pagination-controls>a{cursor:pointer}.btn-group ul.dropdown-menu{z-index:49;padding:0px}.btn-group ul.dropdown-menu li a,.btn-group ul.dropdown-menu li button{padding:10px;background:transparent;border:none;outline:none;display:block;width:100%;text-align:left;font-size:13px;line-height:15px}.btn-group ul.dropdown-menu li a:hover,.btn-group ul.dropdown-menu li button:hover{background:#f9f9f9}.btn-group ul.dropdown-menu li a i.fa,.btn-group ul.dropdown-menu li button i.fa{margin-right:5px}.fa.fa-ban,.fa.fa-user-times{color:red}btn.active,.btn:active,.str-inline-with-btns:active,.pagination-controls .page-number:active{background-image:none;outline:0;-webkit-box-shadow:none;box-shadow:none}.btn-default.active.focus,.btn-default.active:focus,.btn-default.active:hover,.btn-default:active.focus,.btn-default:active:focus,.btn-default:active:hover,.open>.dropdown-toggle.btn-default.focus,.open>.dropdown-toggle.btn-default:focus,.open>.dropdown-toggle.btn-default:hover,.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{color:white;background-color:#090;border-color:#090}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{background-image:none}.form-group.cust-mandatoryXXX label:after,.form-group-input-only.cust-mandatoryXXX label:after{content:\"*\";color:red;font-size:1.2em;margin-left:5px}input[type=text]::-ms-clear,input.searchStr::-ms-clear{display:none;width:0;height:0}.changed-field:not(.ng-invalid){border-color:yellow !important;background:yellow !important}ul.help-list,ul.error-list{list-style:none;margin-left:0;padding-left:1em;text-indent:-1em}ul.help-list li,ul.error-list li{list-style-image:none;list-style-type:none;margin:0 0 10px 0}ul.help-list li:last-child,ul.error-list li:last-child{margin-bottom:0px}ul.help-list li:before,ul.error-list li:before{content:\"\\f054\";font-size:10px;margin-right:5px}ul.help-list.error-list li,ul.error-list.error-list li{color:red}ul.help-list.error-list li:before,ul.error-list.error-list li:before{content:\"\\f069\"}input[type=\"checkbox\"],input[type=\"radio\"]{width:15px;height:15px}input[readonly],input.dummy-disabled{background:#eee}textarea{width:100%;min-height:150px;resize:vertical}.inpUpperCase{text-transform:uppercase}.inpFeedback{font-weight:normal}.inpFeedback>div{display:inline-block;padding:0 10px}.inpFeedback.isError div{color:red}.inpFeedback.isGood div{color:#a6cf41}form .form-control{border:1px solid #ddd;background:white;-webkit-box-shadow:none;box-shadow:none;transition:all linear 0.5s;width:100%;font-size:13px;line-height:1.4em;padding:5px 10px}form .form-control[type=\"text\"]{padding-left:10px;font-size:13px}form .form-control.form-control-auto-width{width:auto}form:not(.ignore-validation-styles) .form-control[required].ng-pristine:not(.ng-touched):not(.ignore-style-ng-pristine){background-color:#fcf8e3;border-color:#FFCD04}form:not(.ignore-validation-styles) .form-control.ng-invalid.ng-touched,form:not(.ignore-validation-styles) .form-control.ng-invalid-required.ng-touched{border-color:red;background:#F7C6BE}form:not(.ignore-validation-styles) .form-control.ng-valid.ng-dirty{border-color:#239F40;background:#dff0d8;-webkit-box-shadow:none;box-shadow:none}form[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-valid{border-color:#ddd;background:white}form[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-invalid-important{border-color:red;background:#F7C6BE}form[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-valid-important{border-color:#239F40;background:#dff0d8;-webkit-box-shadow:none;box-shadow:none}input[type=\"number\"].inpHideSpinner::-webkit-outer-spin-button,input[type=\"number\"].inpHideSpinner::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}input[type=\"number\"].inpHideSpinner{-moz-appearance:textfield}.col-checkboxes label{display:block}.row-checkboxes label,.row-radios label{margin-right:20px}.col-checkboxes label,.row-checkboxes label{font-weight:normal;cursor:pointer;margin-bottom:10px}.col-checkboxes label input,.row-checkboxes label input{margin-right:5px}label.submit-label-dummy{display:block;visibility:hidden}.fa-dummy-tooltip,span.trim-string-with-tooltip:after{content:\" \\f059\";color:#090}span.trim-string-with-tooltip{display:block}span.trim-string-with-tooltip.is-FreeTextDescription{max-width:250px}span.trim-string-with-tooltip>span{display:inline-block;max-width:calc(100% - 20px)}.tooltip .tooltip-inner{max-width:400px;white-space:pre-wrap;display:inline-block;word-wrap:break-word}.hasTooltips{position:relative;transition:all linear 0.5s;min-height:28px}.hasTooltips .tooltip_cust{position:absolute;z-index:2;top:0px;left:0px;width:100%;height:1px;text-align:center;padding:0;transition:all linear 0.5s}.hasTooltips .tooltip_cust span.detail{cursor:pointer;background:red;position:absolute;top:0px;right:0px;width:40px;height:28px;line-height:28px;font-weight:bold;text-align:center;color:white;font-size:14px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;opacity:1;transition:all linear 0.5s}.hasTooltips .tooltip_cust div.message-wrap{position:absolute;bottom:0px;left:0px;padding:8px 0;width:100%;text-align:center;background:transparent}.hasTooltips .tooltip_cust div.message-wrap span{background:red;color:white;font-size:12px;line-height:12px;font-weight:bold;padding:6px 10px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;display:inline-block}.hasTooltips .tooltip_cust span.tooltip-arrow{top:-8px;left:50%;margin-left:-6px;border-width:6px 6px 0;border-top-color:red;background:transparent}.hasTooltips.isSelectList .tooltip_cust{display:none}.hasTooltips.tooltip-below .tooltip_cust{top:auto;bottom:0px}.hasTooltips.tooltip-below .tooltip_cust span.detail{top:auto;bottom:0px}.hasTooltips.tooltip-below .tooltip_cust div.message-wrap{top:0px}.hasTooltips.tooltip-below .tooltip_cust span.tooltip-arrow{top:auto;bottom:-10px;border-width:0 6px 6px;border-bottom-color:red}.table-legend-cell{clear:both;display:block;width:auto;float:right;margin:20px 0}.table-legend-cell tr>td{border:1px solid #ddd;padding:5px}.table-legend-cell tr>td:first-child{padding-right:30px}.table-legend-cell tr>td:last-child{padding-left:30px}.cd-bg-color-tender{background:#EAEAEA;color:#999}.cd-bg-color-tender-border{background:#ddd}.cd-bg-color-pending{background:#FFFDD9}.cd-bg-color-pending-border{background:#faebcc}.cd-bg-color-declined{background:#f2dede;color:#a94442}.cd-bg-color-obsolete{background:#f2dede;color:#a94442}.cd-bg-color-approved{background:#dff0d8;color:#090}.cd-bg-color-approved{background:#dff0d8}.cd-bg-color-realised{color:#090}.cd-bg-color-lost{color:red}.cell-txt{display:block;width:100%;height:18px;line-height:18px;padding:0 5px;font-size:11px}.table-row-border{border:none;border-bottom:1px dotted #ddd}.table>tbody+tbody{border-top:1px solid #ddd}.table.border-none>tr th,.table.border-none>tr td,.table.border-none>*>tr th,.table.border-none>*>tr td{border:0px !important}.table tr th{font-weight:bold}.table tr.event-details-open td{background:#c4e3f3 !important;border-bottom:none}.table tr th,.table tr td{padding:5px;vertical-align:middle}.table tr th>label,.table tr td>label{margin-bottom:0px}.table tr th.col-hidden,.table tr td.col-hidden{display:none}.table tr th.col-actions,.table tr th.col-actions-printable,.table tr td.col-actions,.table tr td.col-actions-printable{text-align:right;min-width:100px}.table tr th.col-actions .row-checkboxes label:last-child,.table tr th.col-actions .row-radios label:last-child,.table tr th.col-actions-printable .row-checkboxes label:last-child,.table tr th.col-actions-printable .row-radios label:last-child,.table tr td.col-actions .row-checkboxes label:last-child,.table tr td.col-actions .row-radios label:last-child,.table tr td.col-actions-printable .row-checkboxes label:last-child,.table tr td.col-actions-printable .row-radios label:last-child{margin-right:0px}.table tr th.col-hidden-header,.table tr td.col-hidden-header{color:#239F40;font-size:0px;padding:0px;border-bottom:none !important;height:0px}.table tr:last-child th{border-bottom:1px solid #ddd}.table tr:last-child td{border-bottom:none}table.half-n-half tr>th,table.half-n-half tr>td{width:50%}table.fixed-layout{table-layout:fixed}table.fixed-layout .squeeze-into-cell{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;display:block}.wrap-longtext{white-space:pre}.aut-sort:before{font-family:FontAwesome;padding-right:0.5em;width:1.28571429em;display:inline-block;text-align:center}.aut-asc:before{content:\"\\f160\"}.aut-desc:before{content:\"\\f161\"}table.table.user-panel-table{margin:0 0 15px 0;border:1px solid #ddd}table.table.user-panel-table tr th{padding:10px 15px;background:#D8EB9A;border:0px;border-bottom:1px solid #ddd}table.table.user-panel-table tr td{background:#f1f1f1;border-bottom:1px dotted #ddd;padding:0px;padding-top:15px}table.table.user-panel-table tr td.padded-cell{padding:15px}table.table.user-panel-table tr:last-child td{padding-bottom:15px;border-bottom:0px}table.table.user-panel-table.cols-2 tr td{width:50%}table.table.user-panel-table.cols-3 tr td{width:33.333333%}table.table.user-panel-table.cols-4 tr td{width:25%}table.table.user-panel-table.padded-cells tr td{padding:15px}#toast-container>div{opacity:1 !important}#toast-container.toast-top-center,#toast-container.toast-bottom-center{left:50%;right:auto;margin-left:-250px;width:500px}#toast-container.toast-top-center>div,#toast-container.toast-bottom-center>div{width:100%}#toast-container.toast-top-center>div button.toast-close-button,#toast-container.toast-bottom-center>div button.toast-close-button{margin-right:5px}#toast-container.toast-top-center{top:20px}#toast-container.toast-bottom-center{bottom:50px}.angular-hovercard{display:inline-block;position:relative}.angular-hovercard-label{position:relative}.angular-hovercard-label.angular-hovercard-active{z-index:99}.angular-hovercard-detail{-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.175);-moz-box-shadow:0px 6px 12px 0px rgba(0,0,0,0.175);box-shadow:0 6px 12px rgba(0,0,0,0.175);background:white;border:1px solid #ddd;opacity:0;padding:0;position:absolute;visibility:hidden;width:auto;min-width:500px;z-index:98}.angular-hovercard-detail.angular-hovercard-active{min-height:200px;opacity:1;visibility:visible}.hoverCardDetailsWrap{font-size:11px}.hoverCardDetailsWrap .content-row{display:block;padding:5px;border-bottom:1px solid #ddd}.hoverCardDetailsWrap .content-row.wrap-overview{padding:10px;font-size:0.9em;color:#303030}.hoverCardDetailsWrap .content-row.wrap-overview table{width:100%}.hoverCardDetailsWrap .content-row.wrap-overview table tr td{border:none;padding:3px}.hoverCardDetailsWrap .content-row.wrap-overview table tr td.border-bottom{border-bottom:1px solid #ddd}.hoverCardDetailsWrap .content-row.wrap-overview table tr td:last-child{text-align:right}.hoverCardDetailsWrap .content-row label{font-weight:bold}.hoverCardDetailsWrap .content-row.wrap-actions{padding:0px;max-height:200px;overflow-y:scroll}.hoverCardDetailsWrap .content-row.wrap-actions table{width:100%}.hoverCardDetailsWrap .content-row.wrap-actions table tr th{color:white}.hoverCardDetailsWrap .content-row.wrap-actions table tr td{border-bottom:1px solid #ddd;font-weight:normal}.hoverCardDetailsWrap .content-row.wrap-actions table tr:last-child td{border-bottom:none}.hoverCardDetailsWrap .content-row:last-child{border-bottom:none}.navbar-default .navbar-toggle{border-color:transparent !important}.navbar-default .navbar-toggle .icon-bar{background-color:#fff !important}.btn-default:hover,.btn-default:active,.btn-default:focus{color:#067d00 !important}.dropdown-menu>li.divider{margin:0}.dropdown-menu>li>a{padding:3px 10px}.wrap-pagination>ul.pagination{margin-top:0px !important;margin-bottom:0px !important}.pagination>li>a,.pagination>li>span{padding:4px 10px;color:#090;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#c8c8c8;background-color:#fff;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{color:#000;background-color:#f9f9f9;border-color:#ddd}.input-group-addon{padding:4px 10px;color:#555;background-color:#f9f9f9;border:1px solid #ddd}.btn-default{color:#090;background-color:#fff;border-color:#ddd}header{padding:15px;padding-bottom:0px}header a img{float:left;display:inline-block;max-height:90px}header a h3{float:left;display:inline-block;margin:0;padding:30px 20px;padding-bottom:0px;color:#090 !important;text-decoration:none}header div.user{text-align:right;padding-top:40px}header div.user .btn-group.btn-edit-avatar>.btn-group button.btn,header div.user .btn-group.btn-edit-avatar>.btn-group button.str-inline-with-btns,header div.user .btn-group.btn-edit-avatar>.btn-group .pagination-controls button.page-number,.pagination-controls header div.user .btn-group.btn-edit-avatar>.btn-group button.page-number{border:0px}nav.navbar.navbar-default{background:#fff;border-width:0 0 1px 0;border-color:#ccc;margin-bottom:45px}nav ul.nav.navbar-nav li.active a{background:white !important;color:#067d00}nav ul.nav.navbar-nav li a{color:#067d00}nav ul.nav.navbar-nav li a:hover{background:#eee !important}.navbar-inverse{border-bottom:1px solid #ccc}.navbar-nav li.active:after,.navbar-nav li.active:before{bottom:0%;margin-bottom:-1px;left:50%;border:solid transparent;content:\" \";height:0;width:0;position:absolute;pointer-events:none}.navbar-nav li.active:after{border-bottom-color:#fff;border-width:6px;margin-left:-6px;z-index:1}.navbar-nav li.active:before{border-bottom-color:#ccc;border-width:8px;margin-left:-8px;z-index:1}footer{overflow:hidden;background:#eee;border-top:1px solid #999;padding-top:10px}footer ul.ul-inline-piped{display:inline-block;list-style:none;text-align:center}footer ul.ul-inline-piped li{display:inline-block}footer ul.ul-inline-piped li:after{content:\"|\";margin:0 10px}footer ul.ul-inline-piped li:last-child:after{display:none}.panel{-webkit-box-shadow:none;box-shadow:none}.panel.panel-bp{background:#eee;border:0px;border-bottom:3px solid #090}.panel.has-button-bar{margin-bottom:0px}.float-none{float:none !important}.ltr .float-left{float:left !important}.ltr .float-right{float:right !important}.padding-0{padding:0 !important}.padding-1{padding:10px !important}.padding-g1{padding:15px !important}.padding-1-5{padding:15px !important}.padding-2{padding:20px !important}.padding-x-0{padding-left:0 !important;padding-right:0 !important}.padding-y-0{padding-top:0 !important;padding-bottom:0 !important}.padding-x-1{padding-left:10px !important;padding-right:10px !important}.padding-x-1-5{padding-left:15px !important;padding-right:15px !important}.padding-y-1{padding-top:10px !important;padding-bottom:10px !important}.padding-y-1-5,.tab-content{padding-top:15px !important;padding-bottom:15px !important}.padding-y-g1{padding-top:15px !important;padding-bottom:15px !important}.padding-top-0{padding-top:0 !important}.padding-top-0-5{padding-top:5px !important}.padding-top-1{padding-top:10px !important}.padding-top-1-5{padding-top:15px !important}.padding-top-g1{padding-top:15px !important}.padding-top-2{padding-top:20px !important}.padding-bottom-0{padding-bottom:0 !important}.padding-bottom-1{padding-bottom:10px !important}.padding-bottom-g1{padding-bottom:15px !important}.padding-bottom-1-5{padding-bottom:15px !important}.padding-bottom-2{padding-bottom:20px !important}.padding-left-0{padding-left:0 !important}.padding-left-1{padding-left:10px !important}.padding-left-2{padding-left:20px !important}.padding-left-3{padding-left:30px !important}.padding-right-0{padding-right:0 !important}.padding-right-1{padding-right:10px !important}.padding-right-2{padding-right:20px !important}.margin-0{margin:0 !important}.margin-x-0{margin-left:0 !important;margin-right:0 !important}.margin-x-1{margin-left:10px !important;margin-right:10px !important}.margin-x-g1{margin-left:15px !important;margin-right:15px !important}.margin-y-0{margin-top:0 !important;margin-bottom:0 !important}.margin-y-1{margin-top:10px !important;margin-bottom:10px !important}.margin-y-g1{margin-top:15px !important;margin-bottom:15px !important}.margin-y-g2{margin-top:30px !important;margin-bottom:30px !important}.margin-top-0{margin-top:0 !important}.margin-top-1{margin-top:10px !important}.margin-top-g1{margin-top:15px !important}.margin-top-1-5{margin-top:15px !important}.margin-top-2{margin-top:20px !important}.margin-top-3{margin-top:30px !important}.margin-top-4{margin-top:40px !important}.margin-top-massive{margin-top:100px !important}.margin-bottom-0{margin-bottom:0 !important}.margin-bottom-1{margin-bottom:10px !important}.margin-bottom-g1{margin-bottom:15px !important}.margin-bottom-2{margin-bottom:20px !important}.margin-left-1{margin-left:10px !important}.margin-right-1{margin-right:10px !important}.margin-0-auto{margin:0 auto}.border-0{border:0px !important}.border-top-0{border-top:0px !important}.border-bottom-0{border-bottom:0px !important}.border-left-0{border-left:0px !important}.border-right-0{border-right:0px !important}.min-width-100{min-width:100px !important}.min-width-150{min-width:150px !important}.panel-heading .panel-btn-wrap.ie-hide{display:none\\9}@media all and (-ms-high-contrast: none), (-ms-high-contrast: active){.ie-hide{display:none !important}}@media (max-width: 1199px){.fa-textAfter-md:after{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;content:attr(fa-textAfter) !important;margin-left:5px}.rtl .fa-textAfter-md:after{margin-left:0;margin-right:5px}}@media (max-width: 992px){.md-dialog-container md-dialog{min-width:auto;max-width:auto;width:90% !important}.wrap-subsections{padding:20px 5%}.rwd_sm_clear-both{clear:both}}.row-no-padding [class*=\"col-\"]{padding-left:0 !important;padding-right:0 !important}@media all and (min-width: 481px) and (max-width: 640px){.col-xxs-1,.col-xxs-10,.col-xxs-11,.col-xxs-12,.col-xxs-2,.col-xxs-3,.col-xxs-4,.col-xxs-5,.col-xxs-6,.col-xxs-7,.col-xxs-8,.col-xxs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xxs-1,.col-xxs-10,.col-xxs-11,.col-xxs-12,.col-xxs-2,.col-xxs-3,.col-xxs-4,.col-xxs-5,.col-xxs-6,.col-xxs-7,.col-xxs-8,.col-xxs-9{float:left}}@media all and (min-width: 321px) and (max-width: 480px){.col-xxxs-1,.col-xxxs-10,.col-xxxs-11,.col-xxxs-12,.col-xxxs-2,.col-xxxs-3,.col-xxxs-4,.col-xxxs-5,.col-xxxs-6,.col-xxxs-7,.col-xxxs-8,.col-xxxs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xxxs-1,.col-xxxs-10,.col-xxxs-11,.col-xxxs-12,.col-xxxs-2,.col-xxxs-3,.col-xxxs-4,.col-xxxs-5,.col-xxxs-6,.col-xxxs-7,.col-xxxs-8,.col-xxxs-9{float:left}}@media all and (min-width: 481px) and (max-width: 640px){.hidden-xxs{display:none !important}.visible-xxs{display:block !important}.col-xxs-pull-12{right:100%}.col-xxs-pull-11{right:91.66666667%}.col-xxs-pull-10{right:83.33333333%}.col-xxs-pull-9{right:75%}.col-xxs-pull-8{right:66.66666667%}.col-xxs-pull-7{right:58.33333333%}.col-xxs-pull-6{right:50%}.col-xxs-pull-5{right:41.66666667%}.col-xxs-pull-4{right:33.33333333%}.col-xxs-pull-3{right:25%}.col-xxs-pull-2{right:16.66666667%}.col-xxs-pull-1{right:8.33333333%}.col-xxs-pull-0{right:auto}.col-xxs-push-12{left:100%}.col-xxs-push-11{left:91.66666667%}.col-xxs-push-10{left:83.33333333%}.col-xxs-push-9{left:75%}.col-xxs-push-8{left:66.66666667%}.col-xxs-push-7{left:58.33333333%}.col-xxs-push-6{left:50%}.col-xxs-push-5{left:41.66666667%}.col-xxs-push-4{left:33.33333333%}.col-xxs-push-3{left:25%}.col-xxs-push-2{left:16.66666667%}.col-xxs-push-1{left:8.33333333%}.col-xxs-push-0{left:auto}.col-xxs-offset-12{margin-left:100%}.col-xxs-offset-11{margin-left:91.66666667%}.col-xxs-offset-10{margin-left:83.33333333%}.col-xxs-offset-9{margin-left:75%}.col-xxs-offset-8{margin-left:66.66666667%}.col-xxs-offset-7{margin-left:58.33333333%}.col-xxs-offset-6{margin-left:50%}.col-xxs-offset-5{margin-left:41.66666667%}.col-xxs-offset-4{margin-left:33.33333333%}.col-xxs-offset-3{margin-left:25%}.col-xxs-offset-2{margin-left:16.66666667%}.col-xxs-offset-1{margin-left:8.33333333%}.col-xxs-offset-0{margin-left:0}.col-xxs-1{width:8.33333333%}.col-xxs-2{width:16.66666667%}.col-xxs-3{width:25%}.col-xxs-4{width:33.33333333%}.col-xxs-5{width:41.66666667%}.col-xxs-6{width:50%}.col-xxs-7{width:58.33333333%}.col-xxs-8{width:66.66666667%}.col-xxs-9{width:75%}.col-xxs-10{width:83.33333333%}.col-xxs-11{width:91.66666667%}.col-xxs-12{width:100%}.col-xxs-padding-2{background:red;padding:20px !important}}@media all and (min-width: 321px) and (max-width: 480px){.hidden-xxxs{display:none !important}.visible-xxxs{display:block !important}.col-xxxs-pull-12{right:100%}.col-xxxs-pull-11{right:91.66666667%}.col-xxxs-pull-10{right:83.33333333%}.col-xxxs-pull-9{right:75%}.col-xxxs-pull-8{right:66.66666667%}.col-xxxs-pull-7{right:58.33333333%}.col-xxxs-pull-6{right:50%}.col-xxxs-pull-5{right:41.66666667%}.col-xxxs-pull-4{right:33.33333333%}.col-xxxs-pull-3{right:25%}.col-xxxs-pull-2{right:16.66666667%}.col-xxxs-pull-1{right:8.33333333%}.col-xxxs-pull-0{right:auto}.col-xxxs-push-12{left:100%}.col-xxxs-push-11{left:91.66666667%}.col-xxxs-push-10{left:83.33333333%}.col-xxxs-push-9{left:75%}.col-xxxs-push-8{left:66.66666667%}.col-xxxs-push-7{left:58.33333333%}.col-xxxs-push-6{left:50%}.col-xxxs-push-5{left:41.66666667%}.col-xxxs-push-4{left:33.33333333%}.col-xxxs-push-3{left:25%}.col-xxxs-push-2{left:16.66666667%}.col-xxxs-push-1{left:8.33333333%}.col-xxxs-push-0{left:auto}.col-xxxs-offset-12{margin-left:100%}.col-xxxs-offset-11{margin-left:91.66666667%}.col-xxxs-offset-10{margin-left:83.33333333%}.col-xxxs-offset-9{margin-left:75%}.col-xxxs-offset-8{margin-left:66.66666667%}.col-xxxs-offset-7{margin-left:58.33333333%}.col-xxxs-offset-6{margin-left:50%}.col-xxxs-offset-5{margin-left:41.66666667%}.col-xxxs-offset-4{margin-left:33.33333333%}.col-xxxs-offset-3{margin-left:25%}.col-xxxs-offset-2{margin-left:16.66666667%}.col-xxxs-offset-1{margin-left:8.33333333%}.col-xxxs-offset-0{margin-left:0}.col-xxxs-1{width:8.33333333%}.col-xxxs-2{width:16.66666667%}.col-xxxs-3{width:25%}.col-xxxs-4{width:33.33333333%}.col-xxxs-5{width:41.66666667%}.col-xxxs-6{width:50%}.col-xxxs-7{width:58.33333333%}.col-xxxs-8{width:66.66666667%}.col-xxxs-9{width:75%}.col-xxxs-10{width:83.33333333%}.col-xxxs-11{width:91.66666667%}.col-xxxs-12{width:100%}.col-xxxs-text-align-left{text-align:left}.col-xxxs-text-align-right{text-align:left}.col-xxxs-padding-left-0{padding-left:0}.col-xxxs-padding-left-1{padding-left:10px !important}.col-xxxs-padding-right-0{padding-right:0}.col-xxxs-padding-2{background:yellow;padding:20px !important}}\n"; });
define('text!my-nav.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n\r\n</template>"; });
define('text!css/print.css', ['module'], function(module) { module.exports = ".panel.panel-prompt-cust{border:none;background:#f9f9f9;border-left:5px solid #239F40}.panel.panel-prompt-cust.panel-page-error{display:inline-block;margin:30px auto;text-align:center;border:none;background:transparent;padding:10px 20px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px}.panel.panel-prompt-cust.panel-page-error .page-error-code{display:block;font-size:80px;margin:0 0 10px 0}.panel.panel-prompt-cust.panel-border{background:transparent;border:5px solid #f9f9f9}.panel.panel-prompt-cust.panel-warning{background:#fcf8e3;border-color:#FFCD04}.panel.panel-prompt-cust.panel-info{background:#d9edf7;border-color:#5bc0de}.panel.panel-prompt-cust.panel-success{background:#dff0d8;border-color:#a6cf41}.panel.panel-prompt-cust.panel-error,.panel.panel-prompt-cust.panel-danger{background:#F7C6BE;border-color:red}.panel.panel-prompt-cust>p,.panel.panel-prompt-cust>.panel-heading{padding:20px;border:none;height:auto;line-height:normal;background-image:none;background-repeat:unset;background:transparent;color:black}html,body{height:auto;margin:0;padding:0}body{color:#000;background:#fff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:10pt;line-height:1.5;font-weight:normal;width:100%;margin:0;padding:0;text-align:left}main{min-height:auto !important}.position-relative#printableArea{position:unset}.print-none,header,table tr .col-actions,table tr .col-hidden,table tr .col-checkbox,button,.panel-btn-wrap,.tab-content>.inactive,.tab-pane:not(.active){display:none}[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important}.text-align-center{text-align:center}.tab-content>.active{display:block}.breadcrumbWrap{display:block;width:100%}.breadcrumbWrap ul{display:block;width:100%;list-style:none;margin:0 0 40px 0;padding:0}.breadcrumbWrap ul li{display:inline;list-style:none;margin:0}.breadcrumbWrap ul li:before{content:' > ';margin:0 10px}.breadcrumbWrap ul li:first-child:before{content:'' !important;margin:0}.panel-heading-strong{display:block;width:100%}.panel-heading-strong h3{font-size:16pt;color:#c40f11}.panel-heading{font-weight:bold;border-bottom:1px solid #000}.panel-heading[aria-hidden=\"true\"],.panel-heading.panel-collapse-trigger>.panel-collapse>.panel-heading{display:none}.panel-heading .panel-title{display:inline-block;font-size:12pt}.panel-heading .panel-title-date{display:inline-block;font-weight:normal;font-style:italic;margin:0 10px}.panel-collapse{display:block !important;height:auto !important}.panel-collapse .wrap-subsections{padding:40px 10%}.panel-collapse .wrap-subsections .is-subsection .panel-collapse-wrap>.panel-heading{border-bottom:none}.panel-collapse .wrap-subsections .is-subsection .panel-collapse-wrap>.panel-collapse{border:2px solid #ccc;padding:20px;margin-bottom:20px}table{border-collapse:collapse;border-spacing:0;width:100%;margin-bottom:40px}table.half-n-half tr th,table.half-n-half tr td{width:50%}table tr th,table tr td{padding:0 10px 0 0;border:none;text-align:auto;border-bottom:1px dotted #ccc}table tr th{border-bottom:1px solid #000}table tr th.col-hidden-header{display:none}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}img{page-break-inside:avoid;page-break-after:avoid}blockquote,pre,panel{page-break-inside:avoid}ul,ol,dl{page-break-before:avoid}ul{page-break-inside:avoid}article{page-break-before:always}.span-no-data-available{font-weight:bold}.span-info{color:#239f40}.span-good{color:#239f40}.span-error{color:red}.span-warning{color:#ff9900}footer{clear:both;display:inline-block;margin-top:40px;font-weight:bold;text-align:right;border:1px solid #000;padding:20px;float:right}@page{margin:2cm}\n"; });
define('text!dialog-demo/add-user-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/ui/ui-loading\"></require>\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n    <require from=\"../views/widgets/inputs/form-filter-text\"></require>\r\n    <require from=\"../views/widgets/inputs/form-filter-role\"></require>\r\n    <require from=\"../views/widgets/cust-span/span-cust-member-status\"></require>\r\n    <require from=\"../views/widgets/cust-span/span-cust-active-status\"></require>\r\n    <require from=\"../resources/format/format-date\"></require>\r\n    <require from=\"../resources/format/json\"></require>\r\n    <!--<require from=\"../views/widgets/user-list\"></require>-->\r\n\r\n    <ai-dialog class=\"wide\">\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            <ui-loading if.bind=\"isLoadingApi\"></ui-loading>\r\n\r\n            <div>\r\n            <!-- Filters -->\r\n            <div class=\"row margin-bottom-g1\">\r\n                <form class=\"col-xs-6\">\r\n                    <!--<form>-->\r\n                    <!--<form-filter-text model.two-way=\"filters[0].value\"></form-filter-text>-->\r\n                    <!--? ${searchFor_ntId} !\r\n                    filter: <input type=\"text\" name=\"searchFor_ntId\" value.bind=\"searchFor_ntId\" placeholder=\"Search Unique Id\">\r\n                    <button click.delegate=\"addUserSearch(searchFor_ntId)\" disabled.bind=\"!searchFor_ntId\">SEARCH</button>-->\r\n\r\n                    <div class=\"input-group\">\r\n                        <input type=\"text\" class=\"form-control\" value.bind=\"searchFor_ntId\" placeholder=\"Search Unique Id\">\r\n                        <span class=\"input-group-btn\">\r\n                            <button class=\"btn btn-default\" type=\"submit\" click.delegate=\"addUserSearch('ntId',searchFor_ntId)\" disabled.bind=\"!searchFor_ntId\">\r\n                                <i class=\"fa fa-search\"></i>\r\n                            </button>\r\n                        </span>\r\n                    </div>\r\n                    <!-- /input-group -->\r\n                </form>\r\n                <form class=\"col-xs-6\">\r\n                    <div class=\"input-group\">\r\n                        <input type=\"text\" class=\"form-control\" value.bind=\"searchFor_name\" placeholder=\"Search name\">\r\n                        <span class=\"input-group-btn\">\r\n                            <button class=\"btn btn-default\" type=\"submit\" click.delegate=\"addUserSearch('name',searchFor_name)\" disabled.bind=\"!searchFor_name\">\r\n                                <i class=\"fa fa-search\"></i>\r\n                            </button>\r\n                        </span>\r\n                    </div>\r\n                    <!-- /input-group -->\r\n                </form>\r\n                <!--<div class=\"col-xs-4\">\r\n                    <form-filter-role if.bind=\"filter_memberType\" cust-label=\"Role\" model.two-way=\"filters[1].value\" options.bind=\"filter_memberType\" changed.two-way=\"filters[1].value\"\r\n                        init-selected.two-way=\"filters[1].value\"></form-filter-role>\r\n                </div>\r\n                <div class=\"col-xs-4\">\r\n\r\n                    <form-filter-role if.bind=\"filter_active\" cust-label=\"Status\" model.two-way=\"filters[2].value\" options.bind=\"filter_active\" changed.two-way=\"filters[2].value\"\r\n                        init-selected.two-way=\"filters[2].value\"></form-filter-role>\r\n                </div>-->\r\n            </div>\r\n            <!-- (END) Filters -->\r\n\r\n            <!--if.bind=\"CV.debugShowCodeOutput\"-->\r\n            <!--? ${filters & json}-->\r\n            <pre if.bind=\"CV.debugShowCodeOutput\">${listUsersToAdd & json}</pre>\r\n            <!--<ul>    \r\n                <li repeat.for=\"row of listUsersToAdd\">\r\n                    ${row.ntId}\r\n                </li>\r\n            </ul>-->\r\n\r\n            <div if.bind=\"!isLoadingApi\" class=\"wrap_table-add-user-from-list\">\r\n                \r\n                <!--filters.bind: filters;-->\r\n                <table if.bind=\"listUsersToAdd\" class=\"table table-striped table-hover\" aurelia-table=\"data.bind: selectedUserArr && (searchFor_ntId || searchFor_name) ? selectedUserArr : listUsersToAdd; display-data.bind: $displayData;\">\r\n                    <thead>\r\n                        <tr>\r\n                            <th aut-sort=\"key: ntId\">ntId</th>\r\n                            <th aut-sort=\"key: firstName\">First Name</th>\r\n                            <th aut-sort=\"key: lastName; default: desc\">Last Name</th>\r\n                            <th aut-sort=\"key: email;\">Email</th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <!--click.delegate=\"selectUserToAdd(user)\"-->\r\n                        <tr if.bind=\"selectedUserArr.length==0 && (searchFor_ntId || searchFor_name)\">\r\n                            <td colspan=\"4\">\r\n                                No results forund for your search criteria\r\n                            </td>\r\n                        </tr>\r\n\r\n                        <tr repeat.for=\"user of $displayData\" click.delegate=\"selectUserToAdd(user)\" class=\"${user.uniqueId == userRole.uniqueId ? 'tr-row-selected' : ''}\">\r\n                            <td>${user.ntId}</td>\r\n                            <td>${user.firstName}</td>\r\n                            <td>${user.lastName}</td>\r\n                            <td>${user.email}</td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n\r\n            <div if.bind=\"selectedId\" class=\"panel panel-info\">\r\n                <pre if.bind=\"CV.debugShowCodeOutput\">${userRole & json}</pre>\r\n\r\n                <div class=\"panel-heading\">\r\n                    <button type=\"button\" class=\"close\" aria-label=\"Close\" click.delegate=\"deselectUser()\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                    <strong>Selected:</strong> ${userRole.firstName} ${userRole.lastName} ( ${userRole.uniqueId} )\r\n                </div>\r\n                <div class=\"panel-body\">\r\n                    <table class=\"table border-none half-n-half margin-bottom-0\">\r\n                        <tbody>\r\n                            <tr>\r\n                                <td>\r\n                                        <form-checkbox cust-name=\"MRTMember\"\r\n                            model.two-way=\"select_isMember\"\r\n                            init-selected.two-way=\"select_isMember\"\r\n                            input-only=\"true\"></form-checkbox>\r\n                                </td>\r\n                                <td class=\"xxx_wrap-role\">\r\n                                    <form-select cust-label=\"System Role\"\r\n                                    inp-class=\"padding-x-0\"                            \r\n                            model.two-way=\"select_systemRole\"\r\n                            options.bind=\"systemRoles\"  \r\n                            prop-arr.bind=\"['value','name']\"                          \r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"select_systemRole\"\r\n                            input-only=\"true\"></form-select>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n\r\n            </div>\r\n\r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>\r\n            <button disabled.bind=\"!select_systemRole\" class=\"btn ${selectedId ? 'btn-primary' : 'btn-default'}\" click.trigger=\"addUser(userRole,select_isMember,select_systemRole)\">Add</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!scss/bootstrap.min.css', ['module'], function(module) { module.exports = "/*!\r\n * Bootstrap v3.3.7 (http://getbootstrap.com)\r\n * Copyright 2011-2016 Twitter, Inc.\r\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\r\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{margin:.67em 0;font-size:2em}mark{color:#000;background:#ff0}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{height:0;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{margin:0;font:inherit;color:inherit}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}input{line-height:normal}input[type=checkbox],input[type=radio]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-appearance:textfield}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{padding:.35em .625em .75em;margin:0 2px;border:1px solid silver}legend{padding:0;border:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-spacing:0;border-collapse:collapse}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"javascript:\"]:after,a[href^=\"#\"]:after{content:\"\"}blockquote,pre{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}img{max-width:100%!important}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000!important}.label{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #ddd!important}}@font-face{font-family:'Glyphicons Halflings';src:url(../fonts/glyphicons-halflings-regular.eot);src:url(../fonts/glyphicons-halflings-regular.eot?#iefix) format('embedded-opentype'),url(../fonts/glyphicons-halflings-regular.woff2) format('woff2'),url(../fonts/glyphicons-halflings-regular.woff) format('woff'),url(../fonts/glyphicons-halflings-regular.ttf) format('truetype'),url(../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format('svg')}.glyphicon{position:relative;top:1px;display:inline-block;font-family:'Glyphicons Halflings';font-style:normal;font-weight:400;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.glyphicon-asterisk:before{content:\"\\002a\"}.glyphicon-plus:before{content:\"\\002b\"}.glyphicon-eur:before,.glyphicon-euro:before{content:\"\\20ac\"}.glyphicon-minus:before{content:\"\\2212\"}.glyphicon-cloud:before{content:\"\\2601\"}.glyphicon-envelope:before{content:\"\\2709\"}.glyphicon-pencil:before{content:\"\\270f\"}.glyphicon-glass:before{content:\"\\e001\"}.glyphicon-music:before{content:\"\\e002\"}.glyphicon-search:before{content:\"\\e003\"}.glyphicon-heart:before{content:\"\\e005\"}.glyphicon-star:before{content:\"\\e006\"}.glyphicon-star-empty:before{content:\"\\e007\"}.glyphicon-user:before{content:\"\\e008\"}.glyphicon-film:before{content:\"\\e009\"}.glyphicon-th-large:before{content:\"\\e010\"}.glyphicon-th:before{content:\"\\e011\"}.glyphicon-th-list:before{content:\"\\e012\"}.glyphicon-ok:before{content:\"\\e013\"}.glyphicon-remove:before{content:\"\\e014\"}.glyphicon-zoom-in:before{content:\"\\e015\"}.glyphicon-zoom-out:before{content:\"\\e016\"}.glyphicon-off:before{content:\"\\e017\"}.glyphicon-signal:before{content:\"\\e018\"}.glyphicon-cog:before{content:\"\\e019\"}.glyphicon-trash:before{content:\"\\e020\"}.glyphicon-home:before{content:\"\\e021\"}.glyphicon-file:before{content:\"\\e022\"}.glyphicon-time:before{content:\"\\e023\"}.glyphicon-road:before{content:\"\\e024\"}.glyphicon-download-alt:before{content:\"\\e025\"}.glyphicon-download:before{content:\"\\e026\"}.glyphicon-upload:before{content:\"\\e027\"}.glyphicon-inbox:before{content:\"\\e028\"}.glyphicon-play-circle:before{content:\"\\e029\"}.glyphicon-repeat:before{content:\"\\e030\"}.glyphicon-refresh:before{content:\"\\e031\"}.glyphicon-list-alt:before{content:\"\\e032\"}.glyphicon-lock:before{content:\"\\e033\"}.glyphicon-flag:before{content:\"\\e034\"}.glyphicon-headphones:before{content:\"\\e035\"}.glyphicon-volume-off:before{content:\"\\e036\"}.glyphicon-volume-down:before{content:\"\\e037\"}.glyphicon-volume-up:before{content:\"\\e038\"}.glyphicon-qrcode:before{content:\"\\e039\"}.glyphicon-barcode:before{content:\"\\e040\"}.glyphicon-tag:before{content:\"\\e041\"}.glyphicon-tags:before{content:\"\\e042\"}.glyphicon-book:before{content:\"\\e043\"}.glyphicon-bookmark:before{content:\"\\e044\"}.glyphicon-print:before{content:\"\\e045\"}.glyphicon-camera:before{content:\"\\e046\"}.glyphicon-font:before{content:\"\\e047\"}.glyphicon-bold:before{content:\"\\e048\"}.glyphicon-italic:before{content:\"\\e049\"}.glyphicon-text-height:before{content:\"\\e050\"}.glyphicon-text-width:before{content:\"\\e051\"}.glyphicon-align-left:before{content:\"\\e052\"}.glyphicon-align-center:before{content:\"\\e053\"}.glyphicon-align-right:before{content:\"\\e054\"}.glyphicon-align-justify:before{content:\"\\e055\"}.glyphicon-list:before{content:\"\\e056\"}.glyphicon-indent-left:before{content:\"\\e057\"}.glyphicon-indent-right:before{content:\"\\e058\"}.glyphicon-facetime-video:before{content:\"\\e059\"}.glyphicon-picture:before{content:\"\\e060\"}.glyphicon-map-marker:before{content:\"\\e062\"}.glyphicon-adjust:before{content:\"\\e063\"}.glyphicon-tint:before{content:\"\\e064\"}.glyphicon-edit:before{content:\"\\e065\"}.glyphicon-share:before{content:\"\\e066\"}.glyphicon-check:before{content:\"\\e067\"}.glyphicon-move:before{content:\"\\e068\"}.glyphicon-step-backward:before{content:\"\\e069\"}.glyphicon-fast-backward:before{content:\"\\e070\"}.glyphicon-backward:before{content:\"\\e071\"}.glyphicon-play:before{content:\"\\e072\"}.glyphicon-pause:before{content:\"\\e073\"}.glyphicon-stop:before{content:\"\\e074\"}.glyphicon-forward:before{content:\"\\e075\"}.glyphicon-fast-forward:before{content:\"\\e076\"}.glyphicon-step-forward:before{content:\"\\e077\"}.glyphicon-eject:before{content:\"\\e078\"}.glyphicon-chevron-left:before{content:\"\\e079\"}.glyphicon-chevron-right:before{content:\"\\e080\"}.glyphicon-plus-sign:before{content:\"\\e081\"}.glyphicon-minus-sign:before{content:\"\\e082\"}.glyphicon-remove-sign:before{content:\"\\e083\"}.glyphicon-ok-sign:before{content:\"\\e084\"}.glyphicon-question-sign:before{content:\"\\e085\"}.glyphicon-info-sign:before{content:\"\\e086\"}.glyphicon-screenshot:before{content:\"\\e087\"}.glyphicon-remove-circle:before{content:\"\\e088\"}.glyphicon-ok-circle:before{content:\"\\e089\"}.glyphicon-ban-circle:before{content:\"\\e090\"}.glyphicon-arrow-left:before{content:\"\\e091\"}.glyphicon-arrow-right:before{content:\"\\e092\"}.glyphicon-arrow-up:before{content:\"\\e093\"}.glyphicon-arrow-down:before{content:\"\\e094\"}.glyphicon-share-alt:before{content:\"\\e095\"}.glyphicon-resize-full:before{content:\"\\e096\"}.glyphicon-resize-small:before{content:\"\\e097\"}.glyphicon-exclamation-sign:before{content:\"\\e101\"}.glyphicon-gift:before{content:\"\\e102\"}.glyphicon-leaf:before{content:\"\\e103\"}.glyphicon-fire:before{content:\"\\e104\"}.glyphicon-eye-open:before{content:\"\\e105\"}.glyphicon-eye-close:before{content:\"\\e106\"}.glyphicon-warning-sign:before{content:\"\\e107\"}.glyphicon-plane:before{content:\"\\e108\"}.glyphicon-calendar:before{content:\"\\e109\"}.glyphicon-random:before{content:\"\\e110\"}.glyphicon-comment:before{content:\"\\e111\"}.glyphicon-magnet:before{content:\"\\e112\"}.glyphicon-chevron-up:before{content:\"\\e113\"}.glyphicon-chevron-down:before{content:\"\\e114\"}.glyphicon-retweet:before{content:\"\\e115\"}.glyphicon-shopping-cart:before{content:\"\\e116\"}.glyphicon-folder-close:before{content:\"\\e117\"}.glyphicon-folder-open:before{content:\"\\e118\"}.glyphicon-resize-vertical:before{content:\"\\e119\"}.glyphicon-resize-horizontal:before{content:\"\\e120\"}.glyphicon-hdd:before{content:\"\\e121\"}.glyphicon-bullhorn:before{content:\"\\e122\"}.glyphicon-bell:before{content:\"\\e123\"}.glyphicon-certificate:before{content:\"\\e124\"}.glyphicon-thumbs-up:before{content:\"\\e125\"}.glyphicon-thumbs-down:before{content:\"\\e126\"}.glyphicon-hand-right:before{content:\"\\e127\"}.glyphicon-hand-left:before{content:\"\\e128\"}.glyphicon-hand-up:before{content:\"\\e129\"}.glyphicon-hand-down:before{content:\"\\e130\"}.glyphicon-circle-arrow-right:before{content:\"\\e131\"}.glyphicon-circle-arrow-left:before{content:\"\\e132\"}.glyphicon-circle-arrow-up:before{content:\"\\e133\"}.glyphicon-circle-arrow-down:before{content:\"\\e134\"}.glyphicon-globe:before{content:\"\\e135\"}.glyphicon-wrench:before{content:\"\\e136\"}.glyphicon-tasks:before{content:\"\\e137\"}.glyphicon-filter:before{content:\"\\e138\"}.glyphicon-briefcase:before{content:\"\\e139\"}.glyphicon-fullscreen:before{content:\"\\e140\"}.glyphicon-dashboard:before{content:\"\\e141\"}.glyphicon-paperclip:before{content:\"\\e142\"}.glyphicon-heart-empty:before{content:\"\\e143\"}.glyphicon-link:before{content:\"\\e144\"}.glyphicon-phone:before{content:\"\\e145\"}.glyphicon-pushpin:before{content:\"\\e146\"}.glyphicon-usd:before{content:\"\\e148\"}.glyphicon-gbp:before{content:\"\\e149\"}.glyphicon-sort:before{content:\"\\e150\"}.glyphicon-sort-by-alphabet:before{content:\"\\e151\"}.glyphicon-sort-by-alphabet-alt:before{content:\"\\e152\"}.glyphicon-sort-by-order:before{content:\"\\e153\"}.glyphicon-sort-by-order-alt:before{content:\"\\e154\"}.glyphicon-sort-by-attributes:before{content:\"\\e155\"}.glyphicon-sort-by-attributes-alt:before{content:\"\\e156\"}.glyphicon-unchecked:before{content:\"\\e157\"}.glyphicon-expand:before{content:\"\\e158\"}.glyphicon-collapse-down:before{content:\"\\e159\"}.glyphicon-collapse-up:before{content:\"\\e160\"}.glyphicon-log-in:before{content:\"\\e161\"}.glyphicon-flash:before{content:\"\\e162\"}.glyphicon-log-out:before{content:\"\\e163\"}.glyphicon-new-window:before{content:\"\\e164\"}.glyphicon-record:before{content:\"\\e165\"}.glyphicon-save:before{content:\"\\e166\"}.glyphicon-open:before{content:\"\\e167\"}.glyphicon-saved:before{content:\"\\e168\"}.glyphicon-import:before{content:\"\\e169\"}.glyphicon-export:before{content:\"\\e170\"}.glyphicon-send:before{content:\"\\e171\"}.glyphicon-floppy-disk:before{content:\"\\e172\"}.glyphicon-floppy-saved:before{content:\"\\e173\"}.glyphicon-floppy-remove:before{content:\"\\e174\"}.glyphicon-floppy-save:before{content:\"\\e175\"}.glyphicon-floppy-open:before{content:\"\\e176\"}.glyphicon-credit-card:before{content:\"\\e177\"}.glyphicon-transfer:before{content:\"\\e178\"}.glyphicon-cutlery:before{content:\"\\e179\"}.glyphicon-header:before{content:\"\\e180\"}.glyphicon-compressed:before{content:\"\\e181\"}.glyphicon-earphone:before{content:\"\\e182\"}.glyphicon-phone-alt:before{content:\"\\e183\"}.glyphicon-tower:before{content:\"\\e184\"}.glyphicon-stats:before{content:\"\\e185\"}.glyphicon-sd-video:before{content:\"\\e186\"}.glyphicon-hd-video:before{content:\"\\e187\"}.glyphicon-subtitles:before{content:\"\\e188\"}.glyphicon-sound-stereo:before{content:\"\\e189\"}.glyphicon-sound-dolby:before{content:\"\\e190\"}.glyphicon-sound-5-1:before{content:\"\\e191\"}.glyphicon-sound-6-1:before{content:\"\\e192\"}.glyphicon-sound-7-1:before{content:\"\\e193\"}.glyphicon-copyright-mark:before{content:\"\\e194\"}.glyphicon-registration-mark:before{content:\"\\e195\"}.glyphicon-cloud-download:before{content:\"\\e197\"}.glyphicon-cloud-upload:before{content:\"\\e198\"}.glyphicon-tree-conifer:before{content:\"\\e199\"}.glyphicon-tree-deciduous:before{content:\"\\e200\"}.glyphicon-cd:before{content:\"\\e201\"}.glyphicon-save-file:before{content:\"\\e202\"}.glyphicon-open-file:before{content:\"\\e203\"}.glyphicon-level-up:before{content:\"\\e204\"}.glyphicon-copy:before{content:\"\\e205\"}.glyphicon-paste:before{content:\"\\e206\"}.glyphicon-alert:before{content:\"\\e209\"}.glyphicon-equalizer:before{content:\"\\e210\"}.glyphicon-king:before{content:\"\\e211\"}.glyphicon-queen:before{content:\"\\e212\"}.glyphicon-pawn:before{content:\"\\e213\"}.glyphicon-bishop:before{content:\"\\e214\"}.glyphicon-knight:before{content:\"\\e215\"}.glyphicon-baby-formula:before{content:\"\\e216\"}.glyphicon-tent:before{content:\"\\26fa\"}.glyphicon-blackboard:before{content:\"\\e218\"}.glyphicon-bed:before{content:\"\\e219\"}.glyphicon-apple:before{content:\"\\f8ff\"}.glyphicon-erase:before{content:\"\\e221\"}.glyphicon-hourglass:before{content:\"\\231b\"}.glyphicon-lamp:before{content:\"\\e223\"}.glyphicon-duplicate:before{content:\"\\e224\"}.glyphicon-piggy-bank:before{content:\"\\e225\"}.glyphicon-scissors:before{content:\"\\e226\"}.glyphicon-bitcoin:before{content:\"\\e227\"}.glyphicon-btc:before{content:\"\\e227\"}.glyphicon-xbt:before{content:\"\\e227\"}.glyphicon-yen:before{content:\"\\00a5\"}.glyphicon-jpy:before{content:\"\\00a5\"}.glyphicon-ruble:before{content:\"\\20bd\"}.glyphicon-rub:before{content:\"\\20bd\"}.glyphicon-scale:before{content:\"\\e230\"}.glyphicon-ice-lolly:before{content:\"\\e231\"}.glyphicon-ice-lolly-tasted:before{content:\"\\e232\"}.glyphicon-education:before{content:\"\\e233\"}.glyphicon-option-horizontal:before{content:\"\\e234\"}.glyphicon-option-vertical:before{content:\"\\e235\"}.glyphicon-menu-hamburger:before{content:\"\\e236\"}.glyphicon-modal-window:before{content:\"\\e237\"}.glyphicon-oil:before{content:\"\\e238\"}.glyphicon-grain:before{content:\"\\e239\"}.glyphicon-sunglasses:before{content:\"\\e240\"}.glyphicon-text-size:before{content:\"\\e241\"}.glyphicon-text-color:before{content:\"\\e242\"}.glyphicon-text-background:before{content:\"\\e243\"}.glyphicon-object-align-top:before{content:\"\\e244\"}.glyphicon-object-align-bottom:before{content:\"\\e245\"}.glyphicon-object-align-horizontal:before{content:\"\\e246\"}.glyphicon-object-align-left:before{content:\"\\e247\"}.glyphicon-object-align-vertical:before{content:\"\\e248\"}.glyphicon-object-align-right:before{content:\"\\e249\"}.glyphicon-triangle-right:before{content:\"\\e250\"}.glyphicon-triangle-left:before{content:\"\\e251\"}.glyphicon-triangle-bottom:before{content:\"\\e252\"}.glyphicon-triangle-top:before{content:\"\\e253\"}.glyphicon-console:before{content:\"\\e254\"}.glyphicon-superscript:before{content:\"\\e255\"}.glyphicon-subscript:before{content:\"\\e256\"}.glyphicon-menu-left:before{content:\"\\e257\"}.glyphicon-menu-right:before{content:\"\\e258\"}.glyphicon-menu-down:before{content:\"\\e259\"}.glyphicon-menu-up:before{content:\"\\e260\"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#337ab7;text-decoration:none}a:focus,a:hover{color:#23527c;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.carousel-inner>.item>a>img,.carousel-inner>.item>img,.img-responsive,.thumbnail a>img,.thumbnail>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{display:inline-block;max-width:100%;height:auto;padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=button]{cursor:pointer}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-weight:400;line-height:1;color:#777}.h1,.h2,.h3,h1,h2,h3{margin-top:20px;margin-bottom:10px}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small{font-size:65%}.h4,.h5,.h6,h4,h5,h6{margin-top:10px;margin-bottom:10px}.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-size:75%}.h1,h1{font-size:36px}.h2,h2{font-size:30px}.h3,h3{font-size:24px}.h4,h4{font-size:18px}.h5,h5{font-size:14px}.h6,h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}.small,small{font-size:85%}.mark,mark{padding:.2em;background-color:#fcf8e3}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#337ab7}a.text-primary:focus,a.text-primary:hover{color:#286090}.text-success{color:#3c763d}a.text-success:focus,a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:focus,a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:focus,a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:focus,a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#337ab7}a.bg-primary:focus,a.bg-primary:hover{background-color:#286090}.bg-success{background-color:#dff0d8}a.bg-success:focus,a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:focus,a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:focus,a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:focus,a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ol,ul{margin-top:0;margin-bottom:10px}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;margin-left:-5px;list-style:none}.list-inline>li{display:inline-block;padding-right:5px;padding-left:5px}dl{margin-top:0;margin-bottom:20px}dd,dt{line-height:1.42857143}dt{font-weight:700}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[data-original-title],abbr[title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote ol:last-child,blockquote p:last-child,blockquote ul:last-child{margin-bottom:0}blockquote .small,blockquote footer,blockquote small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote .small:before,blockquote footer:before,blockquote small:before{content:'\\2014 \\00A0'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;text-align:right;border-right:5px solid #eee;border-left:0}.blockquote-reverse .small:before,.blockquote-reverse footer:before,.blockquote-reverse small:before,blockquote.pull-right .small:before,blockquote.pull-right footer:before,blockquote.pull-right small:before{content:''}.blockquote-reverse .small:after,.blockquote-reverse footer:after,.blockquote-reverse small:after,blockquote.pull-right .small:after,blockquote.pull-right footer:after,blockquote.pull-right small:after{content:'\\00A0 \\2014'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,.25)}kbd kbd{padding:0;font-size:100%;font-weight:700;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;color:#333;word-break:break-all;word-wrap:break-word;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.row{margin-right:-15px;margin-left:-15px}.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border:1px solid #ddd}.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=col-]{position:static;display:table-column;float:none}table td[class*=col-],table th[class*=col-]{position:static;display:table-cell;float:none}.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active{background-color:#f5f5f5}.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover{background-color:#e8e8e8}.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success{background-color:#dff0d8}.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover{background-color:#d0e9c6}.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info{background-color:#d9edf7}.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover{background-color:#c4e3f3}.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning{background-color:#fcf8e3}.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover{background-color:#faf2cc}.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger{background-color:#f2dede}.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover{background-color:#ebcccc}.table-responsive{min-height:.01%;overflow-x:auto}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>td,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>thead>tr>th{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:700}input[type=search]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{margin:4px 0 0;margin-top:1px\\9;line-height:normal}input[type=file]{display:block}input[type=range]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=file]:focus,input[type=checkbox]:focus,input[type=radio]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{background-color:transparent;border:0}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=search]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=date].form-control,input[type=time].form-control,input[type=datetime-local].form-control,input[type=month].form-control{line-height:34px}.input-group-sm input[type=date],.input-group-sm input[type=time],.input-group-sm input[type=datetime-local],.input-group-sm input[type=month],input[type=date].input-sm,input[type=time].input-sm,input[type=datetime-local].input-sm,input[type=month].input-sm{line-height:30px}.input-group-lg input[type=date],.input-group-lg input[type=time],.input-group-lg input[type=datetime-local],.input-group-lg input[type=month],input[type=date].input-lg,input[type=time].input-lg,input[type=datetime-local].input-lg,input[type=month].input-lg{line-height:46px}}.form-group{margin-bottom:15px}.checkbox,.radio{position:relative;display:block;margin-top:10px;margin-bottom:10px}.checkbox label,.radio label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:400;cursor:pointer}.checkbox input[type=checkbox],.checkbox-inline input[type=checkbox],.radio input[type=radio],.radio-inline input[type=radio]{position:absolute;margin-top:4px\\9;margin-left:-20px}.checkbox+.checkbox,.radio+.radio{margin-top:-5px}.checkbox-inline,.radio-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;font-weight:400;vertical-align:middle;cursor:pointer}.checkbox-inline+.checkbox-inline,.radio-inline+.radio-inline{margin-top:0;margin-left:10px}fieldset[disabled] input[type=checkbox],fieldset[disabled] input[type=radio],input[type=checkbox].disabled,input[type=checkbox][disabled],input[type=radio].disabled,input[type=radio][disabled]{cursor:not-allowed}.checkbox-inline.disabled,.radio-inline.disabled,fieldset[disabled] .checkbox-inline,fieldset[disabled] .radio-inline{cursor:not-allowed}.checkbox.disabled label,.radio.disabled label,fieldset[disabled] .checkbox label,fieldset[disabled] .radio label{cursor:not-allowed}.form-control-static{min-height:34px;padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-right:0;padding-left:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}select[multiple].input-sm,textarea.input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm select[multiple].form-control,.form-group-sm textarea.form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}select[multiple].input-lg,textarea.input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg select[multiple].form-control,.form-group-lg textarea.form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.form-group-lg .form-control+.form-control-feedback,.input-group-lg+.form-control-feedback,.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.form-group-sm .form-control+.form-control-feedback,.input-group-sm+.form-control-feedback,.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .checkbox,.has-success .checkbox-inline,.has-success .control-label,.has-success .help-block,.has-success .radio,.has-success .radio-inline,.has-success.checkbox label,.has-success.checkbox-inline label,.has-success.radio label,.has-success.radio-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;background-color:#dff0d8;border-color:#3c763d}.has-success .form-control-feedback{color:#3c763d}.has-warning .checkbox,.has-warning .checkbox-inline,.has-warning .control-label,.has-warning .help-block,.has-warning .radio,.has-warning .radio-inline,.has-warning.checkbox label,.has-warning.checkbox-inline label,.has-warning.radio label,.has-warning.radio-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;background-color:#fcf8e3;border-color:#8a6d3b}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .checkbox,.has-error .checkbox-inline,.has-error .control-label,.has-error .help-block,.has-error .radio,.has-error .radio-inline,.has-error.checkbox label,.has-error.checkbox-inline label,.has-error.radio label,.has-error.radio-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;background-color:#f2dede;border-color:#a94442}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .form-control,.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .checkbox,.form-inline .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .checkbox label,.form-inline .radio label{padding-left:0}.form-inline .checkbox input[type=checkbox],.form-inline .radio input[type=radio]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .checkbox,.form-horizontal .checkbox-inline,.form-horizontal .radio,.form-horizontal .radio-inline{padding-top:7px;margin-top:0;margin-bottom:0}.form-horizontal .checkbox,.form-horizontal .radio{min-height:27px}.form-horizontal .form-group{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.form-horizontal .control-label{padding-top:7px;margin-bottom:0;text-align:right}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.btn.active.focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn:active:focus,.btn:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn.focus,.btn:focus,.btn:hover{color:#333;text-decoration:none}.btn.active,.btn:active{background-image:none;outline:0;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none;opacity:.65}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default.focus,.btn-default:focus{color:#333;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active.focus,.btn-default.active:focus,.btn-default.active:hover,.btn-default:active.focus,.btn-default:active:focus,.btn-default:active:hover,.open>.dropdown-toggle.btn-default.focus,.open>.dropdown-toggle.btn-default:focus,.open>.dropdown-toggle.btn-default:hover{color:#333;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled.focus,.btn-default.disabled:focus,.btn-default.disabled:hover,.btn-default[disabled].focus,.btn-default[disabled]:focus,.btn-default[disabled]:hover,fieldset[disabled] .btn-default.focus,fieldset[disabled] .btn-default:focus,fieldset[disabled] .btn-default:hover{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#286090;border-color:#122b40}.btn-primary:hover{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active.focus,.btn-primary.active:focus,.btn-primary.active:hover,.btn-primary:active.focus,.btn-primary:active:focus,.btn-primary:active:hover,.open>.dropdown-toggle.btn-primary.focus,.open>.dropdown-toggle.btn-primary:focus,.open>.dropdown-toggle.btn-primary:hover{color:#fff;background-color:#204d74;border-color:#122b40}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled.focus,.btn-primary.disabled:focus,.btn-primary.disabled:hover,.btn-primary[disabled].focus,.btn-primary[disabled]:focus,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary.focus,fieldset[disabled] .btn-primary:focus,fieldset[disabled] .btn-primary:hover{background-color:#337ab7;border-color:#2e6da4}.btn-primary .badge{color:#337ab7;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#449d44;border-color:#255625}.btn-success:hover{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active.focus,.btn-success.active:focus,.btn-success.active:hover,.btn-success:active.focus,.btn-success:active:focus,.btn-success:active:hover,.open>.dropdown-toggle.btn-success.focus,.open>.dropdown-toggle.btn-success:focus,.open>.dropdown-toggle.btn-success:hover{color:#fff;background-color:#398439;border-color:#255625}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled.focus,.btn-success.disabled:focus,.btn-success.disabled:hover,.btn-success[disabled].focus,.btn-success[disabled]:focus,.btn-success[disabled]:hover,fieldset[disabled] .btn-success.focus,fieldset[disabled] .btn-success:focus,fieldset[disabled] .btn-success:hover{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#31b0d5;border-color:#1b6d85}.btn-info:hover{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active.focus,.btn-info.active:focus,.btn-info.active:hover,.btn-info:active.focus,.btn-info:active:focus,.btn-info:active:hover,.open>.dropdown-toggle.btn-info.focus,.open>.dropdown-toggle.btn-info:focus,.open>.dropdown-toggle.btn-info:hover{color:#fff;background-color:#269abc;border-color:#1b6d85}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled.focus,.btn-info.disabled:focus,.btn-info.disabled:hover,.btn-info[disabled].focus,.btn-info[disabled]:focus,.btn-info[disabled]:hover,fieldset[disabled] .btn-info.focus,fieldset[disabled] .btn-info:focus,fieldset[disabled] .btn-info:hover{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning.focus,.btn-warning:focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active.focus,.btn-warning.active:focus,.btn-warning.active:hover,.btn-warning:active.focus,.btn-warning:active:focus,.btn-warning:active:hover,.open>.dropdown-toggle.btn-warning.focus,.open>.dropdown-toggle.btn-warning:focus,.open>.dropdown-toggle.btn-warning:hover{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled.focus,.btn-warning.disabled:focus,.btn-warning.disabled:hover,.btn-warning[disabled].focus,.btn-warning[disabled]:focus,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning.focus,fieldset[disabled] .btn-warning:focus,fieldset[disabled] .btn-warning:hover{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active.focus,.btn-danger.active:focus,.btn-danger.active:hover,.btn-danger:active.focus,.btn-danger:active:focus,.btn-danger:active:hover,.open>.dropdown-toggle.btn-danger.focus,.open>.dropdown-toggle.btn-danger:focus,.open>.dropdown-toggle.btn-danger:hover{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled.focus,.btn-danger.disabled:focus,.btn-danger.disabled:hover,.btn-danger[disabled].focus,.btn-danger[disabled]:focus,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger.focus,fieldset[disabled] .btn-danger:focus,fieldset[disabled] .btn-danger:hover{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{font-weight:400;color:#337ab7;border-radius:0}.btn-link,.btn-link.active,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:active,.btn-link:focus,.btn-link:hover{border-color:transparent}.btn-link:focus,.btn-link:hover{color:#23527c;text-decoration:underline;background-color:transparent}.btn-link[disabled]:focus,.btn-link[disabled]:hover,fieldset[disabled] .btn-link:focus,fieldset[disabled] .btn-link:hover{color:#777;text-decoration:none}.btn-group-lg>.btn,.btn-lg{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-group-sm>.btn,.btn-sm{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-property:height,visibility;-o-transition-property:height,visibility;transition-property:height,visibility}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid\\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown,.dropup{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{color:#262626;text-decoration:none;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:focus,.dropdown-menu>.active>a:hover{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{color:#777}.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{text-decoration:none;cursor:not-allowed;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false)}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{right:0;left:auto}.dropdown-menu-left{right:auto;left:0}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{content:\"\";border-top:0;border-bottom:4px dashed;border-bottom:4px solid\\9}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{right:0;left:auto}.navbar-right .dropdown-menu-left{right:auto;left:0}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;float:left}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group-vertical>.btn:hover,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus,.btn-group>.btn:hover{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-bottom-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-right:8px;padding-left:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-right:12px;padding-left:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-top-right-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{display:table-cell;float:none;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=buttons]>.btn input[type=checkbox],[data-toggle=buttons]>.btn input[type=radio],[data-toggle=buttons]>.btn-group>.btn input[type=checkbox],[data-toggle=buttons]>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=col-]{float:none;padding-right:0;padding-left:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn,textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn,textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn{height:auto}.input-group .form-control,.input-group-addon,.input-group-btn{display:table-cell}.input-group .form-control:not(:first-child):not(:last-child),.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:400;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=checkbox],.input-group-addon input[type=radio]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn-group:not(:last-child)>.btn,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:first-child>.btn-group:not(:first-child)>.btn,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:active,.input-group-btn>.btn:focus,.input-group-btn>.btn:hover{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{padding-left:0;margin-bottom:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:focus,.nav>li>a:hover{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:focus,.nav>li.disabled>a:hover{color:#777;text-decoration:none;cursor:not-allowed;background-color:transparent}.nav .open>a,.nav .open>a:focus,.nav .open>a:hover{background-color:#eee;border-color:#337ab7}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus,.nav-tabs>li.active>a:hover{color:#555;cursor:default;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:focus,.nav-pills>li.active>a:hover{color:#fff;background-color:#337ab7}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{padding-right:15px;padding-left:15px;overflow-x:visible;-webkit-overflow-scrolling:touch;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block!important;height:auto!important;padding-bottom:0;overflow:visible!important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse{padding-right:0;padding-left:0}}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:200px}}.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-bottom,.navbar-fixed-top{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-bottom,.navbar-fixed-top{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;height:50px;padding:15px 15px;font-size:18px;line-height:20px}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;padding:9px 10px;margin-top:8px;margin-right:15px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu .dropdown-header,.navbar-nav .open .dropdown-menu>li>a{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:focus,.navbar-nav .open .dropdown-menu>li>a:hover{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}}.navbar-form{padding:10px 15px;margin-top:8px;margin-right:-15px;margin-bottom:8px;margin-left:-15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1)}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .form-control,.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .checkbox,.navbar-form .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .checkbox label,.navbar-form .radio label{padding-left:0}.navbar-form .checkbox input[type=checkbox],.navbar-form .radio input[type=radio]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;padding-top:0;padding-bottom:0;margin-right:0;margin-left:0;border:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-left-radius:0;border-top-right-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-right:15px;margin-left:15px}}@media (min-width:768px){.navbar-left{float:left!important}.navbar-right{float:right!important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:focus,.navbar-default .navbar-brand:hover{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:focus,.navbar-default .navbar-nav>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:focus,.navbar-default .navbar-nav>.disabled>a:hover{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:focus,.navbar-default .navbar-toggle:hover{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#555;background-color:#e7e7e7}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:focus,.navbar-default .btn-link:hover{color:#333}.navbar-default .btn-link[disabled]:focus,.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:focus,fieldset[disabled] .navbar-default .btn-link:hover{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:focus,.navbar-inverse .navbar-brand:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:focus,.navbar-inverse .navbar-nav>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:focus,.navbar-inverse .navbar-nav>.disabled>a:hover{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:focus,.navbar-inverse .navbar-toggle:hover{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:focus,.navbar-inverse .navbar-nav>.open>a:hover{color:#fff;background-color:#080808}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:focus,.navbar-inverse .btn-link:hover{color:#fff}.navbar-inverse .btn-link[disabled]:focus,.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:focus,fieldset[disabled] .navbar-inverse .btn-link:hover{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{padding:0 5px;color:#ccc;content:\"/\\00a0\"}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:3;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:focus,.pager li>a:hover{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:focus,.pager .disabled>a:hover,.pager .disabled>span{color:#777;cursor:not-allowed;background-color:#fff}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:focus,a.label:hover{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:focus,.label-default[href]:hover{background-color:#5e5e5e}.label-primary{background-color:#337ab7}.label-primary[href]:focus,.label-primary[href]:hover{background-color:#286090}.label-success{background-color:#5cb85c}.label-success[href]:focus,.label-success[href]:hover{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:focus,.label-info[href]:hover{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:focus,.label-warning[href]:hover{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:focus,.label-danger[href]:hover{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}a.badge:focus,a.badge:hover{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#337ab7;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron .h1,.jumbotron h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{padding-right:15px;padding-left:15px;border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-right:60px;padding-left:60px}.jumbotron .h1,.jumbotron h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail a>img,.thumbnail>img{margin-right:auto;margin-left:auto}a.thumbnail.active,a.thumbnail:focus,a.thumbnail:hover{border-color:#337ab7}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:700}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{height:20px;margin-bottom:20px;overflow:hidden;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-bar-striped,.progress-striped .progress-bar{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress-bar.active,.progress.active .progress-bar{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-info{background-color:#5bc0de}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{overflow:hidden;zoom:1}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-body,.media-left,.media-right{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{padding-left:0;margin-bottom:20px}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:focus,a.list-group-item:hover,button.list-group-item:focus,button.list-group-item:hover{color:#555;text-decoration:none;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:focus,.list-group-item.disabled:hover{color:#777;cursor:not-allowed;background-color:#eee}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:focus,.list-group-item.active:hover{z-index:2;color:#fff;background-color:#337ab7;border-color:#337ab7}.list-group-item.active .list-group-item-heading,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:focus .list-group-item-text,.list-group-item.active:hover .list-group-item-text{color:#c7ddef}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:focus,a.list-group-item-success:hover,button.list-group-item-success:focus,button.list-group-item-success:hover{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,a.list-group-item-success.active:focus,a.list-group-item-success.active:hover,button.list-group-item-success.active,button.list-group-item-success.active:focus,button.list-group-item-success.active:hover{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:focus,a.list-group-item-info:hover,button.list-group-item-info:focus,button.list-group-item-info:hover{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,a.list-group-item-info.active:focus,a.list-group-item-info.active:hover,button.list-group-item-info.active,button.list-group-item-info.active:focus,button.list-group-item-info.active:hover{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:focus,a.list-group-item-warning:hover,button.list-group-item-warning:focus,button.list-group-item-warning:hover{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,a.list-group-item-warning.active:focus,a.list-group-item-warning.active:hover,button.list-group-item-warning.active,button.list-group-item-warning.active:focus,button.list-group-item-warning.active:hover{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:focus,a.list-group-item-danger:hover,button.list-group-item-danger:focus,button.list-group-item-danger:hover{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,a.list-group-item-danger.active:focus,a.list-group-item-danger.active:hover,button.list-group-item-danger.active,button.list-group-item-danger.active:focus,button.list-group-item-danger.active:hover{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-left-radius:3px;border-top-right-radius:3px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>.small,.panel-title>.small>a,.panel-title>a,.panel-title>small,.panel-title>small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-left-radius:3px;border-top-right-radius:3px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-left-radius:0;border-top-right-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.panel-collapse>.table,.panel>.table,.panel>.table-responsive>.table{margin-bottom:0}.panel>.panel-collapse>.table caption,.panel>.table caption,.panel>.table-responsive>.table caption{padding-right:15px;padding-left:15px}.panel>.table-responsive:first-child>.table:first-child,.panel>.table:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table:first-child>thead:first-child>tr:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child{border-top-left-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child{border-top-right-radius:3px}.panel>.table-responsive:last-child>.table:last-child,.panel>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:3px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child td,.panel>.table>tbody:first-child>tr:first-child th{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{margin-bottom:0;border:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:4px}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.list-group,.panel-group .panel-heading+.panel-collapse>.panel-body{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#337ab7}.panel-primary>.panel-heading{color:#fff;background-color:#337ab7;border-color:#337ab7}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#337ab7}.panel-primary>.panel-heading .badge{color:#337ab7;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#337ab7}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);box-shadow:inset 0 1px 1px rgba(0,0,0,.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);opacity:.2}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}button.close{-webkit-appearance:none;padding:0;cursor:pointer;background:0 0;border:0}.modal-open{overflow:hidden}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.modal.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{filter:alpha(opacity=0);opacity:0}.modal-backdrop.in{filter:alpha(opacity=50);opacity:.5}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-bottom:0;margin-left:5px}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:12px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;filter:alpha(opacity=0);opacity:0;line-break:auto}.tooltip.in{filter:alpha(opacity=90);opacity:.9}.tooltip.top{padding:5px 0;margin-top:-3px}.tooltip.right{padding:0 5px;margin-left:3px}.tooltip.bottom{padding:5px 0;margin-top:3px}.tooltip.left{padding:0 5px;margin-left:-3px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{right:5px;bottom:0;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.popover{position:absolute;top:0;left:0;z-index:1060;display:none;max-width:276px;padding:1px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);line-break:auto}.popover.top{margin-top:-10px}.popover.right{margin-left:10px}.popover.bottom{margin-top:10px}.popover.left{margin-left:-10px}.popover-title{padding:8px 14px;margin:0;font-size:14px;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0}.popover-content{padding:9px 14px}.popover>.arrow,.popover>.arrow:after{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid}.popover>.arrow{border-width:11px}.popover>.arrow:after{content:\"\";border-width:10px}.popover.top>.arrow{bottom:-11px;left:50%;margin-left:-11px;border-top-color:#999;border-top-color:rgba(0,0,0,.25);border-bottom-width:0}.popover.top>.arrow:after{bottom:1px;margin-left:-10px;content:\" \";border-top-color:#fff;border-bottom-width:0}.popover.right>.arrow{top:50%;left:-11px;margin-top:-11px;border-right-color:#999;border-right-color:rgba(0,0,0,.25);border-left-width:0}.popover.right>.arrow:after{bottom:-10px;left:1px;content:\" \";border-right-color:#fff;border-left-width:0}.popover.bottom>.arrow{top:-11px;left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:#999;border-bottom-color:rgba(0,0,0,.25)}.popover.bottom>.arrow:after{top:1px;margin-left:-10px;content:\" \";border-top-width:0;border-bottom-color:#fff}.popover.left>.arrow{top:50%;right:-11px;margin-top:-11px;border-right-width:0;border-left-color:#999;border-left-color:rgba(0,0,0,.25)}.popover.left>.arrow:after{right:1px;bottom:-10px;content:\" \";border-right-width:0;border-left-color:#fff}.carousel{position:relative}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner>.item{position:relative;display:none;-webkit-transition:.6s ease-in-out left;-o-transition:.6s ease-in-out left;transition:.6s ease-in-out left}.carousel-inner>.item>a>img,.carousel-inner>.item>img{line-height:1}@media all and (transform-3d),(-webkit-transform-3d){.carousel-inner>.item{-webkit-transition:-webkit-transform .6s ease-in-out;-o-transition:-o-transform .6s ease-in-out;transition:transform .6s ease-in-out;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-perspective:1000px;perspective:1000px}.carousel-inner>.item.active.right,.carousel-inner>.item.next{left:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.carousel-inner>.item.active.left,.carousel-inner>.item.prev{left:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.carousel-inner>.item.active,.carousel-inner>.item.next.left,.carousel-inner>.item.prev.right{left:0;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.carousel-inner>.active,.carousel-inner>.next,.carousel-inner>.prev{display:block}.carousel-inner>.active{left:0}.carousel-inner>.next,.carousel-inner>.prev{position:absolute;top:0;width:100%}.carousel-inner>.next{left:100%}.carousel-inner>.prev{left:-100%}.carousel-inner>.next.left,.carousel-inner>.prev.right{left:0}.carousel-inner>.active.left{left:-100%}.carousel-inner>.active.right{left:100%}.carousel-control{position:absolute;top:0;bottom:0;left:0;width:15%;font-size:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6);background-color:rgba(0,0,0,0);filter:alpha(opacity=50);opacity:.5}.carousel-control.left{background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,.0001)));background-image:linear-gradient(to right,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);background-repeat:repeat-x}.carousel-control.right{right:0;left:auto;background-image:-webkit-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.0001)),to(rgba(0,0,0,.5)));background-image:linear-gradient(to right,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);background-repeat:repeat-x}.carousel-control:focus,.carousel-control:hover{color:#fff;text-decoration:none;filter:alpha(opacity=90);outline:0;opacity:.9}.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{position:absolute;top:50%;z-index:5;display:inline-block;margin-top:-10px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{left:50%;margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{right:50%;margin-right:-10px}.carousel-control .icon-next,.carousel-control .icon-prev{width:20px;height:20px;font-family:serif;line-height:1}.carousel-control .icon-prev:before{content:'\\2039'}.carousel-control .icon-next:before{content:'\\203a'}.carousel-indicators{position:absolute;bottom:10px;left:50%;z-index:15;width:60%;padding-left:0;margin-left:-30%;text-align:center;list-style:none}.carousel-indicators li{display:inline-block;width:10px;height:10px;margin:1px;text-indent:-999px;cursor:pointer;background-color:#000\\9;background-color:rgba(0,0,0,0);border:1px solid #fff;border-radius:10px}.carousel-indicators .active{width:12px;height:12px;margin:0;background-color:#fff}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6)}.carousel-caption .btn{text-shadow:none}@media screen and (min-width:768px){.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{width:30px;height:30px;margin-top:-10px;font-size:30px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{margin-right:-10px}.carousel-caption{right:20%;left:20%;padding-bottom:30px}.carousel-indicators{bottom:20px}}.btn-group-vertical>.btn-group:after,.btn-group-vertical>.btn-group:before,.btn-toolbar:after,.btn-toolbar:before,.clearfix:after,.clearfix:before,.container-fluid:after,.container-fluid:before,.container:after,.container:before,.dl-horizontal dd:after,.dl-horizontal dd:before,.form-horizontal .form-group:after,.form-horizontal .form-group:before,.modal-footer:after,.modal-footer:before,.modal-header:after,.modal-header:before,.nav:after,.nav:before,.navbar-collapse:after,.navbar-collapse:before,.navbar-header:after,.navbar-header:before,.navbar:after,.navbar:before,.pager:after,.pager:before,.panel-body:after,.panel-body:before,.row:after,.row:before{display:table;content:\" \"}.btn-group-vertical>.btn-group:after,.btn-toolbar:after,.clearfix:after,.container-fluid:after,.container:after,.dl-horizontal dd:after,.form-horizontal .form-group:after,.modal-footer:after,.modal-header:after,.nav:after,.navbar-collapse:after,.navbar-header:after,.navbar:after,.pager:after,.panel-body:after,.row:after{clear:both}.center-block{display:block;margin-right:auto;margin-left:auto}.pull-right{float:right!important}.pull-left{float:left!important}.hide{display:none!important}.show{display:block!important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none!important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-lg,.visible-md,.visible-sm,.visible-xs{display:none!important}.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block{display:none!important}@media (max-width:767px){.visible-xs{display:block!important}table.visible-xs{display:table!important}tr.visible-xs{display:table-row!important}td.visible-xs,th.visible-xs{display:table-cell!important}}@media (max-width:767px){.visible-xs-block{display:block!important}}@media (max-width:767px){.visible-xs-inline{display:inline!important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block!important}table.visible-sm{display:table!important}tr.visible-sm{display:table-row!important}td.visible-sm,th.visible-sm{display:table-cell!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block!important}table.visible-md{display:table!important}tr.visible-md{display:table-row!important}td.visible-md,th.visible-md{display:table-cell!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block!important}}@media (min-width:1200px){.visible-lg{display:block!important}table.visible-lg{display:table!important}tr.visible-lg{display:table-row!important}td.visible-lg,th.visible-lg{display:table-cell!important}}@media (min-width:1200px){.visible-lg-block{display:block!important}}@media (min-width:1200px){.visible-lg-inline{display:inline!important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block!important}}@media (max-width:767px){.hidden-xs{display:none!important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none!important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none!important}}@media (min-width:1200px){.hidden-lg{display:none!important}}.visible-print{display:none!important}@media print{.visible-print{display:block!important}table.visible-print{display:table!important}tr.visible-print{display:table-row!important}td.visible-print,th.visible-print{display:table-cell!important}}.visible-print-block{display:none!important}@media print{.visible-print-block{display:block!important}}.visible-print-inline{display:none!important}@media print{.visible-print-inline{display:inline!important}}.visible-print-inline-block{display:none!important}@media print{.visible-print-inline-block{display:inline-block!important}}@media print{.hidden-print{display:none!important}}\r\n/*# sourceMappingURL=bootstrap.min.css.map */"; });
define('text!dialog-demo/delete-user-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            \r\n            <table class=\"table border-none half-n-half\">\r\n                <tbody>\r\n                <tr>\r\n                    <td><label>Name:</label> ${userRole.firstName} ${userRole.lastName}</td>\r\n                    <td><label>ntId:</label> ${userRole.loginName}</td>\r\n                </tr>                \r\n                </tbody>\r\n            </table>\r\n\r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>\r\n            <button class=\"btn btn-danger\" click.trigger=\"triggerDelete(userRole.id)\">Delete</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!dialog-demo/dialog-demo.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"col-md-12\">\r\n        <button class=\"btn btn-primary btn-block\" click.trigger=\"open()\">Show Information</button>\r\n    </div>\r\n</template>"; });
define('text!dialog-demo/info-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n                <h2>Edit User</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            <div class=\"text-center\">\r\n                <div class=\"row\">\r\n                    <strong>First Name: </strong> ${info.firstName} / ${userArr.firstName}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>Last Name: </strong> ${info.lastName}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>emailAddress: </strong> ${info.emailAddress}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>City: </strong> ${info.city}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>Country: </strong> ${info.country}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <h4>Is this information correct?</h4>\r\n                </div>\r\n            </div>        \r\n        </ai-dialog-body>\r\n        \r\n        <ai-dialog-footer>\r\n            <button class=\"btn btn-primary\" click.trigger=\"yes()\">Yes</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"no()\">No</button>\r\n        </ai-dialog-footer>  \r\n    </ai-dialog>\r\n</template>"; });
define('text!dialog-demo/roles-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n    <require from=\"../resources/format/json\"></require>\r\n\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            <table class=\"table border-none half-n-half\" if.bind=\"userRole && systemRoles\">\r\n                <tbody>\r\n                <tr>\r\n                    <td><label>Name:</label> ${userId} ${userRole.firstName} ${userRole.lastName}</td>\r\n                    <td><label>ntId:</label> ${userRole.loginName}</td>\r\n                </tr>\r\n                <tr>\r\n                    <td>\r\n                        <!--? select_isMember: ${select_isMember}-->\r\n                        <form-checkbox cust-name=\"MRTMember\"                          \r\n                            model.two-way=\"select_isMember\"\r\n                            init-selected.two-way=\"select_isMember\"\r\n                            input-only=\"true\"></form-checkbox>\r\n                    </td>\r\n                    <td class=\"xxx_wrap-role\">\r\n                        <!--? select_systemRole: ${select_systemRole} | userRole.systemRoles.value: ${userRole.systemRoles & json}-->\r\n                        <form-select cust-name=\"lkp_systemRole\"\r\n                            prop-arr.bind=\"['value','name']\"\r\n                            model.two-way=\"select_systemRole\"\r\n                            options.bind=\"systemRoles\"\r\n                            init-selected.two-way=\"select_systemRole\"\r\n                            input-only=\"true\"></form-select>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>\r\n            <!--? hasChanged: ${hasChanged}-->\r\n            <button disabled.bind=\"!hasChanged\" class=\"btn ${hasChanged ? 'btn-primary' : 'btn-default'}\" click.trigger=\"updateUserRole(select_isMember,select_systemRole)\">Update</button>\r\n            <!--<button class=\"btn btn-primary\" click.trigger=\"yes()\">Update</button>-->\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!resources/select2.html', ['module'], function(module) { module.exports = "<template>select2\r\n    <select name.bind=\"name\" value.bind=\"selected\" id.bind=\"name\">\r\n        <option repeat.for=\"option of options\" value.bind=\"option.value\">${option.label}</option>\r\n    </select>\r\n</template>"; });
define('text!user-info/set-info.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <div class=\"col-md-2\"></div>\r\n    <div class=\"col-md-8\">\r\n        <form action=\"\" submit.trigger=\"save()\">\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"firstName\" placeholder=\"First Name\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"lastName\" placeholder=\"Last Name\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"emailAddress\" placeholder=\"emailAddress\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"city\" placeholder=\"City\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"country\" placeholder=\"Country\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <button class=\"btn btn-primary\" type=\"submit\">Save</button>\r\n            </div>\r\n        </form>\r\n    </div>\r\n    \r\n</template>"; });
define('text!user-info/view-info.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <div class=\"col-md-2\"></div>\r\n    <div class=\"col-md-8\">\r\n        <div class=\"text-center\">\r\n            <div class=\"row\">\r\n                <strong>First Name: </strong> ${userInfo.first_ame}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>Last Name: </strong> ${userInfo.lastName}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>emailAddress: </strong> ${userInfo.emailAddress}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>City: </strong> ${userInfo.city}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>Country: </strong> ${userInfo.country}\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n</template>"; });
define('text!_excess-ref/tab-dev.html', ['module'], function(module) { module.exports = "<!--<div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <h1>${title}<span class=\"html-file-name\">(welcome.html)</span></h1>\r\n        </div>\r\n    </div>\r\n\r\n    <hr>-->\r\n\r\n    <!--<div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <div id=\"exTab2\" class=\"containerXXX\">\r\n                <ul class=\"nav nav-pills\">\r\n                    <li class=\"active\">\r\n                        <a href=\"#home\" data-toggle=\"tab\">Home</a>\r\n                    </li>\r\n                    <li><a href=\"#team\" data-toggle=\"tab\">Team</a>\r\n                    </li>\r\n                </ul>\r\n\r\n                <div class=\"tab-content clearfix\">\r\n                    <div class=\"tab-pane active\" id=\"home\">\r\n                        <h3>Home</h3>\r\n                    </div>\r\n                    <div class=\"tab-pane\" id=\"team\">\r\n                        <h3>Team</h3>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>-->"; });
define('text!_excess-ref/user-panel-mrt-role.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n\r\n    <form-select name=\"coatSize\" inp-label=\"Coat Size\"\r\n        model.two-way=\"user.profile.coatSize.id\"\r\n        options.bind=\"lkp_coatSizes\"\r\n        changed.two-way=\"user.profile.coatSize.id\"\r\n        init-selected.two-way=\"user.profile.coatSize.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <form-select name=\"Primary ICS\"\r\n        model.two-way=\"user.profile.primaryPosition.id\"\r\n        options.bind=\"lkp_primaryPositions\"\r\n        changed.two-way=\"user.profile.primaryPosition.id\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.profile.primaryPosition.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <form-select inp-label=\"Secondary ICS\"\r\n        model.two-way=\"user.profile.secondaryPosition.id\"\r\n        options.bind=\"lkp_secondaryPositions\"\r\n        changed.two-way=\"user.profile.secondaryPosition.id\"        \r\n        init-selected.two-way=\"user.profile.secondaryPosition.id\"\r\n        option-filter.bind=\"['primaryPositionId',user.profile.primaryPosition.id]\"\r\n        is-enabled.bind=\"user.profile.primaryPosition.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n</template>"; });
define('text!_excess-ref/user-panel-twic.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-radio\"></require>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <form-radio inp-name.bind=\"twic_card\"\r\n            inp-label=\"Hold a TWIC Card\"\r\n            model.two-way=\"user.twic_card.value\"\r\n            expiry-date.two-way=\"user.twic_card.expiryDate\"\r\n            init-selected.two-way=\"user.twic_card.value\"></form-radio>\r\n    </div>\r\n\r\n</template>"; });
define('text!_excess-ref/xxx_dev-inputs.html', ['module'], function(module) { module.exports = "<!--<form-checkbox\r\n            class=\"margin-x-g1\"\r\n            inp-label=\"Multiple Visas\"                            \r\n            model.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n            init-selected.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n            input-only=\"true\"\r\n            is-mandatory.bind=\"true\"></form-checkbox>-->\r\n\r\n                    <!--<span class=\"form-group col-xs-6 col-debug is-mandatory\">            \r\n            <label class=\"label-with-checkbox\">\r\n                <input type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">\r\n                Multiple Visas\r\n            </label>        -->\r\n\r\n            <!--<div class=\"col-xs-12\">\r\n            <form-radio inp-name.bind.bind=\"'training_ics\" inp-label.bind=\"user.profile.trainings[0].training.name\" model.two-way=\"user.profile.trainings[0].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[0].expiresOn ? user.profile.trainings[0].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[0].training.id\"></form-radio>\r\n        </div>\r\n\r\n        <div class=\"divider dotted\"></div>\r\n\r\n        <div class=\"col-xs-12\">\r\n            <form-radio inp-name.bind=\"'training_haz'\" inp-label.bind=\"user.profile.trainings[1].training.name\" model.two-way=\"user.profile.trainings[1].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[1].expiresOn ? user.profile.trainings[1].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[1].training.id\"></form-radio>\r\n        </div>\r\n\r\n        <div class=\"divider dotted\"></div>\r\n\r\n        <div class=\"col-xs-12 margin-bottom-2\">\r\n            <form-radio inp-name.bind=\"'training_offs'\" inp-label.bind=\"user.profile.trainings[2].training.name\" model.two-way=\"user.profile.trainings[2].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[2].expiresOn ? user.profile.trainings[2].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[2].training.id\"></form-radio>\r\n        </div>-->\r\n\r\n    <!--</div>-->\r\n\r\n\r\n    <!-- details -->\r\n    <form-select name=\"region\"\r\n        model.two-way=\"profile.regionId\"\r\n        options.bind=\"lkp_regions\"        \r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"profile.regionId\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n        <!--changed.two-way=\"profile.regionId\"-->\r\n    \r\n    <form-select inp-label=\"hub\"\r\n        model.two-way=\"profile.hubId\"\r\n        options.bind=\"lkp_hub\"        \r\n        init-selected.two-way=\"profile.hubId\"\r\n        option-filter.bind=\"['regionId',profile.regionId]\"\r\n        is-enabled.bind=\"profile.regionId\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n        <!-- XXX CR - 170213: changed.two-way=\"profile.hubId\" may be excess -->\r\n\r\n    <!--<div class=\"form-group col-xs-12\">\r\n        <label class=\"col-sm-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n            Hub\r\n        </label>\r\n        <div class=\"col-sm-6\">\r\n            <select class=\"form-control\"\r\n                model.bind=\"user.profile.hub.id\"\r\n                disabled.bind=\"!user.profile.region.id\"        \r\n                >        \r\n                <option value=\"\">Select...</option>\r\n                <option repeat.for=\"option of lkp_hub | filter:'regionId':user.profile.region.id\" value=\"option.id\" selected.bind=\"option.id==user.profile.hub.id\">\r\n                    ${option.name}\r\n                </option>\r\n            </select>\r\n        </div>\r\n    </div>-->\r\n\r\n\r\n    \r\n    <!--<div class=\"form-group col-xs-12\">\r\n        <label class=\"col-sm-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n            Entity\r\n        </label>\r\n        <div class=\"col-sm-6\">\r\n            <select class=\"form-control\"\r\n                model.bind=\"user.profile.entity.id\"\r\n                disabled.bind=\"!user.profile.segment.id\"        \r\n                >        \r\n                <option value=\"\">Select...</option>\r\n                <option repeat.for=\"option of lkp_entity | filter:'segmentId':user.profile.segment.id\" value=\"option.id\" selected.bind=\"option.id==user.profile.entity.id\">\r\n                    ${option.name}\r\n                </option>\r\n            </select>\r\n        </div>\r\n    </div>-->\r\n\r\n    <!--<form-select name=\"lkp_entity\"\r\n        model.two-way=\"user.lkp_entity_selected\"\r\n        options.bind=\"lkp_entity\"\r\n        changed.two-way=\"user.lkp_entity_selected\"        \r\n        init-selected.two-way=\"user.lkp_entity_selected\"\r\n        option-filter.bind=\"user.lkp_segment_selected\"\r\n        autocomplete.bind=\"true\"\r\n        is-enabled.bind=\"user.lkp_regions_selected && user.lkp_hub_selected && user.lkp_segment_selected\"></form-select>-->"; });
define('text!views/pages/login.html', ['module'], function(module) { module.exports = "<template>\r\n    ${title}\r\n</template>"; });
define('text!views/pages/user-add.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/inputs/form-input\"></require>\r\n  <require from=\"../widgets/inputs/form-select\"></require>\r\n  <require from=\"../widgets/inputs/form-radio\"></require>\r\n  <require from=\"../widgets/inputs/form-checkbox\"></require>\r\n  <require from=\"../widgets/form-user-full-body\"></require>\r\n  <require from=\"../../resources/format/json\"></require>\r\n  <require from=\"../widgets/btn-xc-all\"></require>\r\n  <require from=\"aurelia-kendoui-bridge/datepicker/datepicker\"></require>\r\n\r\n  <pre if.bind=\"CV.debugShowCurrentUser\">? user-add.html | myGlobals.isMember: ${myGlobals.currentUser.isMember} | myGlobals.currentUser.isReader: ${myGlobals.currentUser.isReader} !</pre>\r\n  <pre if.bind=\"CV.debugShowCurrentUser\">? user-add.html | isReadOnly: ${isReadOnly} | currentUser.id: ${currentUser.id} | myGlobals.userSelected.id: ${myGlobals.userSelected.id} !</pre>\r\n\r\n  <div class=\"main-title-bar row\">\r\n<!--<button click.delegate=\"testToastr()\">??? test</button>-->\r\n    <div class=\"col-xs-8\">\r\n      <h1 if.bind=\"!isReadOnly\" class=\"display-inline-block\">${title}</h1>\r\n      <h1 if.bind=\"isReadOnly\" class=\"display-inline-block\">${title_isReadOnly}</h1>\r\n        <btn-xc-all if.bind=\"myGlobals.profileSelected\" wrapper-id=\"user-panels\"></btn-xc-all>\r\n    </div>\r\n\r\n    <div class=\"col-xs-4 text-align-right\">\r\n\r\n      <div class=\"btn-group profile-avater\" role=\"group\">\r\n        <button if.bind=\"!isReadOnly\" class=\"btn btn-default btn-i\"><i class=\"fa fa-pencil\"></i>Change Avatar</button>\r\n\r\n      <button if.bind=\"isReadOnly && (currentUser.id == myGlobals.userSelected.id || myGlobals.currentUser.isEditor)\" \r\n      click.delegate=\"myNav.navigateToUserPage('edit',myGlobals.userSelected.id)\"\r\n        class=\"margin-x-1 btn btn-default btn-i\">\r\n        <i class=\"fa fa-pencil\"></i> Edit this profile\r\n        </button>\r\n\r\n        <span class=\"input-group-addon\">\r\n          <img src=\"src/img/low.jpg\" alt=\"tmp me\">\r\n        </span>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n\r\n<!--<pre>? user-add.html | myGlobals.userSelected: ${myGlobals.userSelected & json}</pre>-->\r\n<!--<pre>??? user-add.html | myGlobals.profileSelected: ${myGlobals.profileSelected & json}</pre>-->\r\n\r\n  <form role=\"form\" class=\"form-horizontal\" id=\"user-panels\" if.bind=\"myGlobals.userSelected\">\r\n    <!--cust-xc-expanded=\"true\"-->\r\n\r\n    <form-user-full-body is-read-only.bind=\"isReadOnly\" cust-title=\"User\"\r\n      cust-body=\"user-details\" cust-xc=\"true\" cust-xc-id=\"xc_user\" cust-xc-expanded=\"true\"></form-user-full-body>\r\n\r\n      <form-user-full-body if.bind=\"myGlobals.myLookups\" is-read-only.bind=\"isReadOnly\" cust-title=\"Languages\"\r\n        cust-body=\"user-languages\" cust-xc=\"true\" cust-xc-id=\"xc_languages\"></form-user-full-body>\r\n\r\n        <form-user-full-body if.bind=\"myGlobals.myLookups\" is-read-only.bind=\"isReadOnly\" cust-title=\"Passport Information\"\r\n          cust-body=\"user-passport\" cust-xc=\"true\" cust-xc-id=\"xc_passport\"></form-user-full-body>\r\n\r\n          <form-user-full-body if.bind=\"myGlobals.myLookups\" is-read-only.bind=\"isReadOnly\" cust-title=\"Visa Information\"\r\n            cust-body=\"user-visa\" cust-xc=\"true\" cust-xc-id=\"xc_visa\"></form-user-full-body>\r\n\r\n            <form-user-full-body if.bind=\"myGlobals.myLookups\" is-read-only.bind=\"isReadOnly\" cust-title=\"Training\"\r\n              cust-body=\"user-training\" cust-xc=\"true\" cust-xc-id=\"xc_training\"></form-user-full-body>\r\n\r\n<!--? profile.confidentialData: ${myGlobals.profileSelected}\r\n<pre>${myGlobals.currentUser.isEditor}</pre>-->\r\n              <form-user-full-body if.bind=\"myGlobals.myLookups\" if.bind=\"myGlobals.currentUser.isEditor\" cust-icon=\"fa-exclamation-triangle\" \r\n                is-read-only.bind=\"isReadOnly\" cust-title=\"Confidential Information\" cust-body=\"user-confidential\"\r\n                cust-xc=\"true\" cust-xc-id=\"xc_confidential\"></form-user-full-body>\r\n\r\n  </form>\r\n\r\n  <div if.bind=\"!isReadOnly\" class=\"button-bar col-md-12 padding-x-0 text-align-right\">\r\n    <!--?? hubId: ${user.profile.hub.id} > ${profile.hubId} !-->\r\n    <button class=\"btn btn-default\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n  </div>\r\n\r\n</template>"; });
define('text!views/pages/user-no-selection.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/user-list\"></require>\r\n  <require from=\"../widgets/panel-denied-access\"></require>\r\n\r\n  <pre if.bind=\"CV.debugShowCurrentUser\">? user-no-selection.html | myGlobals.currentUser.isMember: ${myGlobals.currentUser.isMember} | myGlobals.currentUser.isReader: ${myGlobals.currentUser.isReader} !</pre>\r\n\r\n  <div class=\"col-md-12\" if.bind=\"title\">\r\n    <h1>${title}<span class=\"html-file-name\">(user-no-selection.html)</span></h1>\r\n  </div>\r\n\r\n  <!--<pre>? user-no-selection.html | isMember: ${currentUser.isMember} | users: ${users} !</pre>-->\r\n  <user-list if.bind=\"currentUser.isReader\" current-user.bind=\"myGlobals.currentUser\" class=\"col-md-12\"></user-list>\r\n\r\n  <panel-denied-access if.bind=\"!currentUser.isReader\"></panel-denied-access>\r\n\r\n</template>"; });
define('text!views/pages/user-selected.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/user-list\"></require>\r\n  <require from=\"../widgets/user-edit\"></require>\r\n  <require from=\"./user-add\"></require>\r\n  <require from=\"../../resources/format/json\"></require>\r\n  <require from=\"../widgets/panel-denied-access\"></require>\r\n\r\n  <!--<div class=\"col-md-12\">\r\n    <h1>${title}<span class=\"html-file-name\">(user-selected.html)</span></h1>\r\n    <hr>\r\n  </div>-->\r\n  <!--<pre>? user-selected.html | myGlobals.isEditor: ${myGlobals.isEditor} | myGlobals.currentUser.id: ${myGlobals.currentUser.id}</pre>-->\r\n  <pre if.bind=\"CV.debugShowCurrentUser\">? user-selected.html | user.id: ${user.id} | myGlobals.currentUser: ${myGlobals.currentUser & json} !</pre>\r\n  <pre if.bind=\"CV.debugShowCurrentUser\">? user-selected.html | myGlobals.currentUser.isMember: ${myGlobals.currentUser.isMember} !</pre>\r\n  <pre if.bind=\"CV.debugShowCodeOutput\">profile:<br>${profile & json}</pre>\r\n  <!--<pre>${CV.myLabels & json}</pre>-->\r\n\r\n<!--\r\n  <div if.bind=\"!pageType\">\r\n    <user-list class=\"col-xs-12 col-md-8\"></user-list>\r\n\r\n    <div class=\"col-xs-12 col-md-4\">\r\n      <user-edit user.bind=\"user\"></user-edit>\r\n    </div>\r\n  </div>-->\r\n\r\n  <panel-denied-access if.bind=\"accessDenied\"></panel-denied-access>\r\n\r\n  <div if.bind=\"user\" class=\"col-xs-12\">\r\n    <!--? user-selected.html | isReadOnly: ${isReadOnly} | ${currentUser.id} ! -->\r\n    <!--<pre>? user-selected.html | myLookups: ${myGlobals.myLookups} | myGlobals.userSelected: ${myGlobals.userSelected & json} !</pre>-->\r\n    <user-add is-read-only.bind=\"isReadOnly\" if.bind=\"myGlobals.userSelected\"></user-add>\r\n  </div>\r\n\r\n  <pre if.bind=\"debugShowCodeOutput\">${user & json}</pre>\r\n\r\n</template>"; });
define('text!views/pages/welcome.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../widgets/list-activity\"></require>\r\n    <require from=\"../widgets/user-list\"></require>\r\n    <require from=\"../widgets/profile-brief\"></require>\r\n    <require from=\"../../resources/format/json\"></require>\r\n\r\n    <div if.bind=\"pageData\" class=\"row margin-bottom-g1\">\r\n        <pre if.bind=\"CV.debugShowCurrentUser\">? welcome.html | myGlobals.isMember: ${myGlobals.currentUser.isMember} | myGlobals.isEditor: ${myGlobals.currentUser.isEditor} !</pre>\r\n        <div class=\"col-md-12\">\r\n            <img src=\"${imgSrc_splash}\" class=\"fit-col\">\r\n        </div>\r\n    </div>\r\n\r\n    <pre if.bind=\"CV.debugShowCurrentUser\">? welcome.html | myGlobals.currentUser: ${myGlobals.currentUser & json}</pre>\r\n\r\n    <div if.bind=\"myGlobals.currentUser.id && (myGlobals.currentUser.isReader || myGlobals.currentUser.isEditor)\" class=\"row-fluid\">\r\n        <div class=\"col-md-6\">\r\n            <!--<img src=\"src/img/MRT_Letterhead.png\" class=\"fit-col\">-->\r\n            <div class=\"margin-bottom-2\">\r\n                <h1 class=\"margin-top-0\">${title_isMember}</h1>\r\n                <p innerhtml.bind=\"message_isMember\"></p>\r\n            </div>\r\n\r\n            <div class=\"row\">\r\n                <div class=\"col-md-3\">\r\n                    <a click.delegate=\"myNav.navigateTo('users')\"><img src=\"src/img/MRT_Org.png\" class=\"fit-col\"></a>\r\n                </div>                \r\n                <div class=\"col-md-3\">\r\n                    <a click.delegate=\"myNav.navigateToUserPage('read',myGlobals.currentUser.id)\"><img src=\"src/img/MRT_Ident.png\" class=\"fit-col\"></a>\r\n                </div>\r\n                <div class=\"col-md-3\" if.bind=\"myGlobals.currentUser.isEditor\">\r\n                    <a click.delegate=\"myNav.navigateToUserPage('edit',myGlobals.currentUser.id)\"><img src=\"src/img/MRT_Admin.png\" class=\"fit-col\"></a>\r\n                </div>\r\n                <!--<div class=\"col-md-2\" if.bind=\"myGlobals.currentUser.isEditor\">\r\n                    <a href=\"#\"> <img src=\"src/img/MRT_Valid.png\" class=\"fit-col\"></a>\r\n                </div>\r\n                <div class=\"col-md-2\" if.bind=\"myGlobals.currentUser.isEditor\">\r\n                    <a href=\"#\"><img src=\"src/img/MRT_Toolbox.png\" class=\"fit-col\"></a>\r\n                </div>-->\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-md-6\" if.bind=\"pageData\">\r\n            <!--<user-list cust-title=\"Users-lite\" cust-disable-cells=\"['firstName','personalNumber','systemRoles']\" cust-table-pagination.bind=\"true\"\r\n                cust-table-page-size.bind=\"10\"></user-list>-->\r\n            <list-activity title=\"Recent Changes\" cust-xc-id=\"xs_recentSubmits\" current-user.bind=\"myGlobals.currentUser\" cust-xc-expanded=\"true\" api-data.bind=\"pageData.recentSubmits\"></list-activity>\r\n            <list-activity title=\"Recent Reviews\" cust-xc-id=\"xs_recentReviews\" current-user.bind=\"myGlobals.currentUser\" api-data.bind=\"pageData.recentReviews\"></list-activity>\r\n        </div>\r\n    </div>\r\n\r\n    <!--<pre>? welcome.html | myGlobals.currentUser.id: ${myGlobals.currentUser.id} !</pre>-->\r\n\r\n    <div if.bind=\"myGlobals.currentUser.id && (!myGlobals.currentUser.isReader && !myGlobals.currentUser.isEditor)\" class=\"row-fluid\">\r\n        <div class=\"col-md-6\">\r\n            <div class=\"margin-bottom-2\">\r\n                <h1 class=\"margin-top-0\">${title}</h1>\r\n                <p innerhtml.bind=\"message\"></p>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-md-6\">\r\n            <profile-brief current-user.bind=\"myGlobals.currentUser\" member-arr.bind=\"pageData.memberPreview\"></profile-brief>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/ui/nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./ui-header\"></require>\r\n\r\n    <ui-header current-user.bind=\"currentUser\"></ui-header>\r\n    <pre if.bind=\"CV.debugShowCurrentUser\">? nav-bar.html | myGlobals.currentUser.isMember: ${myGlobals.currentUser.isMember} | myGlobals.currentUser.isEditor: ${myGlobals.currentUser.isEditor} !</pre>\r\n\r\n    <nav id=\"header\" class=\"navbar navbar-default ${routeName=='welcome' ? 'margin-bottom-0' : ''}\" role=\"navigation\">\r\n\r\n        <div class=\"container padding-x-0\">\r\n            <div class=\"navbar-header\">\r\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\r\n                    <span class=\"sr-only\">Toggle Navigation</span>\r\n                    <span class=\"icon-bar\"></span>\r\n                    <span class=\"icon-bar\"></span>\r\n                    <span class=\"icon-bar\"></span>\r\n                </button>\r\n                <!--<a class=\"navbar-brand\" href=\"/#/\">\r\n                    <i class=\"fa fa-home\"></i>\r\n                    <span>${router.title}</span>\r\n                </a>-->\r\n            </div>\r\n\r\n            <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\r\n                <ul class=\"nav navbar-nav\">\r\n                    <li repeat.for=\"row of router.navigation\" if.bind=\"hasAccess(myGlobals.currentUser, row)\" class=\"${row.isActive ? 'active' : ''}\">\r\n                        <a href.bind=\"row.href\">\r\n                            ${row.title}\r\n                            <span if.bind=\"CV.debugShowCurrentUser\">? [${myGlobals.currentUser.isMember}, ${row.settings.isMemberOnly}] | [${myGlobals.currentUser.isEditor}, ${row.settings.isEditorOnly}]</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n\r\n                <ul class=\"nav navbar-nav navbar-right margin-right-1\">\r\n                    <li class=\"loader\" if.bind=\"router.isNavigating\">\r\n                        <i class=\"fa fa-spinner fa-spin fa-2x color-green-dark\"></i>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n    </nav>\r\n\r\n</template>"; });
define('text!views/ui/ui-footer.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <footer>        \r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-6\">\r\n                    <ul class=\"ul-inline-piped\">\r\n                        <li>${CV.SITE_OWNER_ABBR} ${CV.SITE_NAME}</li>\r\n                    </ul>\r\n                </div>\r\n                 <div class=\"col-xs-6 text-align-right\">\r\n                    <span>${CV.COPYRIGHT}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </header>\r\n\r\n</template>"; });
define('text!views/ui/ui-header.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <header class=\"container\">\r\n        <pre if.bind=\"CV.debugShowCurrentUser\">? ui-header.html | myGlobals.currentUser.isMember: ${myGlobals.currentUser.isMember} | myGlobals.currentUser.isEditor: ${myGlobals.currentUser.isEditor} !</pre>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8 logo-wrap\">\r\n                <a class=\"logo\" click.delegate=\"myNav.navigateTo('welcome')\" title=\"${CV.SITE_NAME}\">\r\n                    <img src=\"${imgSrc_logo}\" alt=\"${CV.SITE_NAME_ABBR}\">\r\n                    \r\n                    <!--<h3>${CV.SITE_NAME}</h3>-->\r\n                </a>\r\n                <img class=\"strapline\" src=\"${imgSrc_strapline}\">\r\n            </div>\r\n            <div class=\"col-xs-4 user\">\r\n                <div class=\"btn-group btn-edit-avatar\" role=\"group\" aria-label=\"user options\">\r\n\r\n                    <div class=\"btn-group\" role=\"group\">\r\n                        <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" \r\n                            data-toggle=\"dropdown\"\r\n                            aria-haspopup=\"true\"\r\n                            aria-expanded=\"true\">\r\n                            ${myGlobals.currentUser.displayName}\r\n                            <span class=\"caret\"></span>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\">\r\n                            <li><a click.delegate=\"myNav.navigateToUserPage('read',myGlobals.currentUser.id)\"><i class=\"fa fa-fw fa-search\"></i>View Profile</a></li>\r\n                            <li><a click.delegate=\"myNav.navigateToUserPage('edit',myGlobals.currentUser.id)\"><i class=\"fa fa-fw fa-pencil\"></i>Edit Profile</a></li>\r\n                            <!--<li if.bind=\"myGlobals.currentUser.isEditor\"><a href=\"#\"><i class=\"fa fa-fw fa-bell\"></i>Notifications</a></li>\r\n                            <li if.bind=\"myGlobals.currentUser.isEditor\"><a href=\"#\"><i class=\"fa fa-fw fa-check-square-o\"></i>Validate</a></li>\r\n                            <li if.bind=\"myGlobals.currentUser.isEditor\"><a href=\"#\"><i class=\"fa fa-fw fa-archive\"></i>Toolbox</a></li>-->\r\n                            <li if.bind=\"myGlobals.currentUser.isEditor\" class=\"divider\"></li>\r\n                            <li if.bind=\"myGlobals.currentUser.isEditor\"><a click.delegate=\"myNav.navigateTo('users')\"><i class=\"fa fa-fw fa-users\"></i>Team</a></li>\r\n                        </ul>\r\n                    </div>\r\n\r\n                    <a class=\"btn btn-default avatar\">\r\n                        <img src=\"src/img/tmp-avatar-me.jpg\" alt=\"tmp me\">\r\n                    </a>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </header>\r\n\r\n</template>"; });
define('text!views/ui/ui-loading.html', ['module'], function(module) { module.exports = "<template>\r\n    <i class=\"fa fa-spinner fa-spin fa-2x color-green-dark\"></i>\r\n</template>"; });
define('text!views/widgets/btn-xc-all.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"btn-group\" role=\"group\">\r\n    <button class=\"btn btn-default btn-i\" click.trigger=\"xc_all('expand')\"><i class=\"fa fa-chevron-down\"></i>${CV.BTN_XC_Expand}</button>\r\n    <button class=\"btn btn-default btn-i\" click.trigger=\"xc_all('collapse')\"><i class=\"fa fa-chevron-up\"></i>${CV.BTN_XC_Collapse}</button>\r\n  </div>\r\n</template>"; });
define('text!views/widgets/form-user-full-body.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"./user-panels/user-panel-details\"></require>\r\n    <require from=\"./user-panels/user-panel-languages\"></require>    \r\n    <require from=\"./user-panels/user-panel-passport\"></require>\r\n    <require from=\"./user-panels/user-panel-visa\"></require>\r\n    <require from=\"./user-panels/user-panel-training\"></require>\r\n    <require from=\"./user-panels/user-panel-confidential\"></require>\r\n    <require from=\"../../resources/format/json\"></require>\r\n    \r\n    <!--<pre>? myGlobals: ${myGlobals.foo} | ${myGlobals.currentUser & json} | ${myGlobals.profileSelected & json} !</pre>-->\r\n\r\n    <div class=\"panel panel-default panel-xc\" if.bind=\"myGlobals.userSelected\">\r\n        <div class=\"panel-heading cursor-hover ${custXcExpanded ? '' : 'collapsed'}\" data-toggle=\"collapse\"\r\n                data-target=\"#${custXcId}\">\r\n            <i if.bind=\"custIcon\" class=\"fa ${custIcon} text-after\"></i>\r\n\r\n            ${custTitle}\r\n             <!--| ${user.firstName} | ${user.lkp_regions_selected} > ${user.lkp_hub_selected} > ${user.lkp_segment_selected} > ${user.lkp_entity_selected}-->\r\n            <button if.bind=\"custXc\" class=\"btn btn-xc_chevron btn-xs\" type=\"button\"                \r\n                aria-expanded=\"${custXcExpanded}\"\r\n                aria-controls=\"collapseExample\">\r\n            </button>\r\n        </div>\r\n\r\n        <div id=\"${custXcId}\" class=\"panel-body row ${custXc ? 'collapse' : ''} ${custXcExpanded ? 'in' : ''}\">\r\n            <div class=\"wrap-fields\">\r\n                <!--? ${myLookups.languages}-->\r\n                <user-panel-details if.bind=\"custBody=='user-details'\" is-read-only.bind=\"isReadOnly\"></user-panel-details>\r\n                <user-panel-languages if.bind=\"custBody=='user-languages'\" is-read-only.bind=\"isReadOnly\"></user-panel-languages>\r\n                <user-panel-passport if.bind=\"custBody=='user-passport'\" is-read-only.bind=\"isReadOnly\"></user-panel-passport>\r\n                <user-panel-visa if.bind=\"custBody=='user-visa'\" is-read-only.bind=\"isReadOnly\"></user-panel-visa>\r\n                <user-panel-training if.bind=\"custBody=='user-training'\" is-read-only.bind=\"isReadOnly\"></user-panel-training>\r\n                <user-panel-confidential if.bind=\"custBody=='user-confidential'\" is-read-only.bind=\"isReadOnly\"></user-panel-confidential>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/list-activity.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../../resources/format/format-date\"></require>\r\n\r\n    <div class=\"panel panel-default panel-xc\">\r\n        <div class=\"panel-heading cursor-hover ${custXcExpanded ? '' : 'collapsed'}\" data-toggle=\"collapse\" data-target=\"#${custXcId}\">\r\n            <i class=\"fa fa-bell text-after\"></i> ${title}\r\n            <button if.bind=\"custXc\" class=\"btn btn-xc_chevron btn-xs\" type=\"button\" aria-expanded=\"${custXcExpanded}\" aria-controls=\"collapseExample\">\r\n            </button>\r\n        </div>\r\n\r\n        <div id=\"${custXcId}\" class=\"panel-body bg-white ${custXc ? 'collapse' : ''} ${custXcExpanded ? 'in' : ''}\">\r\n\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-12\">\r\n                    <!--<input type=\"text\" value.bind=\"filters[1].value\">-->\r\n                    <table if.bind=\"apiData\" class=\"table table-striped margin-top-1\" aurelia-table=\"data.bind: apiData; display-data.bind: $displayData; filters.bind: !currentUser.isEditor ? filters : ''\">\r\n                        <thead>\r\n                            <tr>\r\n                                <th if.bind=\"custXcId=='xs_recentSubmits'\">Submitted</th>\r\n                                <th if.bind=\"custXcId=='xs_recentReviews'\">Reviewed</th>\r\n                                <th>Team Member</th>\r\n                                <th>Action</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <!--if.bind=\"currentUser.isEditor || (!currentUser.isEditor && row.isMember)\"-->\r\n                            <tr repeat.for=\"row of $displayData\">\r\n                                <td if.bind=\"custXcId=='xs_recentSubmits'\">${row.submittedOn | formatDate}</td>\r\n                                <td if.bind=\"custXcId=='xs_recentReviews'\">${row.reviewedOn | formatDate}</td>\r\n                                <td><a click.delegate=\"myNav.navigateToUserPage('read',row.id)\">${row.displayName}</a></td>\r\n                                <td>\r\n                                    <div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"User actions\">\r\n                                        <button class=\"btn btn-default\" click.delegate=\"myNav.navigateToUserPage('edit',row.id)\" title=\"Edit User\">\r\n                                            <i class=\"fa fa-pencil\"></i>\r\n                                        </button>\r\n                                        <button disabled.bind=\"row.emailAddress==null\" class=\"btn btn-default\" click.delegate=\"myNav.emailUser(row.emailAddress)\" title=\"Email User\">\r\n                                            <i class=\"fa fa-envelope-o\"></i>\r\n                                        </button>\r\n                                        <!--<a class=\"btn btn-default\" href=\"#\"><i class=\"fa fa-search\"></i></a>-->\r\n                                    </div>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/panel-denied-access.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"panel panel-warning\">\r\n        <div class=\"panel-heading\">You do not have access to this page</div>\r\n    </div>\r\n</template>"; });
define('text!views/widgets/profile-brief.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"./inputs/form-input\"></require>\r\n    <require from=\"../../resources/format/json\"></require>\r\n    <require from=\"../../resources/format/format-date\"></require>\r\n    <require from=\"./cust-span/span-cust-member-status\"></require>\r\n\r\n    <!--<pre>? profile-brief.html | isReadOnly: ${myGlobals.isReadOnly} | currentUser: ${currentUser & json} | memberArr: ${memberArr & json} !</pre>-->\r\n\r\n    <form role=\"form\" class=\"form-horizontal\" id=\"user-panel-brief\">\r\n        <div class=\"panel\">\r\n            <div class=\"panel-heading strong-heading\">\r\n                <a if.bind=\"custXc\" class=\"collapsable-toggle ${custXcExpanded ? '' : 'collapsed'}\" data-toggle=\"collapse\" data-target=\"#${custXcId}\">\r\n                    <span class=\"panel-title\">${title}</span>\r\n                    <button if.bind=\"custXc\" class=\"btn btn-xc_chevron btn-xs\" type=\"button\" aria-expanded=\"${custXcExpanded}\" aria-controls=\"collapseExample\">\r\n                    </button>\r\n                </a>\r\n\r\n                <span if.bind=\"!custXc\" class=\"panel-title\">${title}</span>\r\n\r\n                <a if.bind=\"currentUser.isEditor\" click.delegate=\"myNav.navigateToUserPage('edit',currentUser.id)\" class=\"btn btn-xs btn-i btn-text pull-right\" title=\"Edit profile\">\r\n                    <i class=\"fa fa-pencil\"></i>Update\r\n                </a>\r\n\r\n                <a click.delegate=\"myNav.navigateToUserPage('read',currentUser.id)\" class=\"btn btn-xs btn-i btn-text pull-right\" title=\"View profile\">\r\n                    <i class=\"fa fa-search\"></i>View\r\n                </a>\r\n            </div>\r\n\r\n            <div id=\"${custXcId}\" class=\"panel-body bg-lightgray ${custXc ? 'collapse' : ''} ${custXcExpanded ? 'in' : ''}\">\r\n\r\n                <div class=\"padding-top-1\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-xs-6\">\r\n                            <label>Manager</label>\r\n                        </div>\r\n                        <div class=\"col-xs-6\">\r\n                            <a if.bind=\"memberArr.manager.emailAddress\" click.delegate=\"myNav.emailUser(memberArr.manager.emailAddress)\">\r\n                                <i class=\"fa fa-envelope-o text-after\"></i> ${memberArr.manager.displayName}\r\n                            </a>\r\n                            <span if.bind=\"!memberArr.manager.emailAddress\">${memberArr.manager.displayName}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-xs-6\">\r\n                            <label>Function</label>\r\n                        </div>\r\n                        <div class=\"col-xs-6\">\r\n                            <span>${memberArr.profile.function}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-xs-6\">\r\n                            <label>Location</label>\r\n                        </div>\r\n                        <div class=\"col-xs-6\">\r\n                            <span>${memberArr.profile.location}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-xs-6\">\r\n                            <label>Modified</label>\r\n                        </div>\r\n                        <div class=\"col-xs-6\">\r\n                            ${memberArr.profile.submittedOn | formatDate}\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!--<div class=\"row\">\r\n                        <div class=\"button-bar col-md-12 text-align-right\">\r\n                            <button class=\"btn btn-success\" click.delegate=\"save()\">Update</button>\r\n                        </div>\r\n                    </div>-->\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n\r\n\r\n    </form>\r\n\r\n</template>"; });
define('text!views/widgets/prompt.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog>\r\n    <ai-dialog-body>\r\n      <h2>Dialog</h2>\r\n    </ai-dialog-body>\r\n  </ai-dialog>\r\n</template>"; });
define('text!views/widgets/user-edit.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/inputs/form-input\"></require>\r\n\r\n  <div class=\"hdr-wrap\">\r\n    <h1 class=\"hdr-inline\">${title}<span class=\"html-file-name\">(user-edit.html)</span></h1>\r\n  </div>\r\n\r\n  <!--<p>id: ${user.id}</p>\r\n  <p>originalUser.firstName: ${originalUser.firstName}</p>\r\n  <p>user.firstName: ${user.firstName}</p>-->\r\n\r\n  <div class=\"panel panel-bp margin-x-0 has-button-bar\">\r\n    <div class=\"panel-body row\">\r\n      \r\n      <form role=\"form\" class=\"form-horizontal\">\r\n\r\n        <form-input name=\"firstName\" model.two-way=\"user.firstName\"></form-input>\r\n        <form-input name=\"lastName\" model.two-way=\"user.lastName\" cust-label=\"Last Name\"></form-input>\r\n        <form-input name=\"emailAddress\" model.two-way=\"user.emailAddress\" cust-label=\"emailAddress\"></form-input>\r\n        <form-input name=\"personalNumber\" model.two-way=\"user.personalNumber\" cust-label=\"Telephone\"></form-input>\r\n\r\n      </form>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div bind.if=\"user\">\r\n    <div class=\"button-bar col-md-12 padding-x-0 text-align-right\">\r\n      <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n    </div>\r\n  </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-list.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../widgets/inputs/form-select\"></require>\r\n    <require from=\"../../resources/format/format-date\"></require>\r\n    <require from=\"../../resources/format/json\"></require>\r\n    <require from=\"../widgets/cust-span/span-cust-member-status\"></require>\r\n    <require from=\"../widgets/cust-span/span-cust-active-status\"></require>\r\n\r\n    <!--<div class=\"hdr-wrap\" if.bind=\"!custHideTitleBar\">\r\n        <h1 class=\"hdr-inline\">${title}<span class=\"html-file-name\">(user-list.html)</span></h1>\r\n        <a class=\"btn btn-default btn-i pull-right\" click.delegate=\"addUser()\">\r\n            <i class=\"fa fa-plus\"></i>Add User\r\n        </a>\r\n    </div>-->\r\n\r\n    <p if.bind=\"debugShowOutput\">found: ${found} / ${selectedId} / filter: ${filters}</p>\r\n    <p if.bind=\"debugShowOutput\">rolesArrDynamic: ${rolesArrDynamic}</p>\r\n    <p if.bind=\"debugShowOutput\">filters[1].value: ${filters[1].value} / ${rolesArrDynamic}</p>\r\n\r\n    <!--<pre>? user-list.html | currentUser.isEditor: ${currentUser.isEditor}</pre>-->\r\n\r\n    <div if.bind=\"currentUser\" class=\"panel panel-default\">\r\n        <div class=\"panel-heading strong-heading ${custXc ? 'cursor-hover' : ''} ${custXcExpanded ? '' : 'collapsed'}\" data-toggle=\"collapse\"\r\n            data-target=\"#${custXcId}\">\r\n            ${title}\r\n            <button if.bind=\"custXc\" class=\"btn btn-xc_chevron btn-xs\" type=\"button\" aria-expanded=\"${custXcExpanded}\" aria-controls=\"collapseExample\">\r\n            </button>\r\n\r\n            <a if.bind=\"currentUser.isEditor\" class=\"btn btn-xs btn-i btn-text pull-right\" click.delegate=\"addUser()\">\r\n                <i class=\"fa fa-plus\"></i>Add User\r\n            </a>\r\n        </div>\r\n\r\n        <div id=\"${custXcId}\" class=\"panel-body bg-white ${custXc ? 'collapse' : ''} ${custXcExpanded ? 'in' : ''}\">\r\n            <!-- Filters -->\r\n            <form class=\"row margin-y-g1\" if.bind=\"filters\">\r\n\r\n                <div class=\"col-xs-3\">\r\n                    <input type=\"text\" class=\"form-control\" value.bind=\"searchFor_name\" placeholder=\"Search Name\">\r\n                </div>\r\n                <div class=\"col-xs-3\">\r\n                    <form-select cust-label=\"System Role\" model.two-way=\"searchFor_userTypeValue\" options.bind=\"lookups.userTypes\" prop-arr.bind=\"['value','name']\"\r\n                        autocomplete.bind=\"true\" init-selected.two-way=\"searchFor_userTypeValue\" input-only=\"true\"></form-select>\r\n                </div>\r\n                <div if.bind=\"currentUser.isEditor\" class=\"col-xs-3\">\r\n                    <form-select cust-label=\"Status\" model.two-way=\"searchFor_active\" options.bind=\"lookups.lkp_isActive\" prop-arr.bind=\"['value','name']\"\r\n                        autocomplete.bind=\"true\" init-selected.two-way=\"searchFor_active\" input-only=\"true\"></form-select>\r\n                </div>\r\n                <div class=\"col-xs-3\">\r\n                    <button class=\"btn btn-default\" type=\"submit\" click.delegate=\"loadUserList_prep()\">\r\n                                <i class=\"fa fa-filter text-after\"></i>\r\n                                Filter\r\n                            </button>\r\n                </div>\r\n            </form>\r\n            <!-- (END) Filters -->\r\n\r\n            <!-- Table -->\r\n            <!--? filter_memberType: ${filter_memberType}-->\r\n            <!--filters.bind: filters;-->\r\n            <pre if.bind=\"debugShowOutput\">? user-list.html | ${users & json}</pre>\r\n\r\n            <div class=\"panel panel-warning\" if.bind=\"checkedItemsArr.length>=1\">\r\n                <div class=\"panel-heading panel-heading-custom\">\r\n                    <span class=\"display-inline-block\"><strong>${checkedItemsArr.length}</strong> users selected.</span>\r\n                    <button class=\"btn btn-danger btn-xs pull-right\" click.delegate=\"deleteMultiple()\">\r\n                    Delete ${checkedItemsArr.length} users\r\n                </button>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-12\">\r\n                    <table class=\"table table-striped\" if.bind=\"users\" aurelia-table=\"data.bind: users.data;\r\n                            display-data.bind: $displayData;\r\n                            current-page.bind: currentPage;\r\n                            page-size.bind: custTablePageSize;\r\n                            total-items.bind: totalItems;\r\n                            filters.bind: !currentUser.isEditor ? filters_ro : ''\">\r\n                        <thead>\r\n                            <tr>\r\n                                <th if.bind=\"currentUser.isEditor\"><input type=\"checkbox\" value=\"true\" checked.bind=\"isAllChecked\" change.delegate=\"checkAll()\"></th>\r\n                                <th aut-sort=\"key: loginName\" if.bind=\"isNotDisabled('loginName')\">Login</th>\r\n                                <th aut-sort=\"key: firstName\" if.bind=\"isNotDisabled('firstName')\">First Name</th>\r\n                                <th aut-sort=\"key: lastName; default: asc\" if.bind=\"isNotDisabled('lastName')\">Surname</th>\r\n                                <th aut-sort=\"key: emailAddress\" if.bind=\"isNotDisabled('emailAddress')\">Email</th>\r\n                                <th aut-sort=\"key: isMember\" if.bind=\"isNotDisabled('isMember')\">Profile</th>\r\n                                <th aut-sort=\"key: isActive\" if.bind=\"isNotDisabled('isActive')\">Status</th>\r\n                                <th if.bind=\"isNotDisabled('edit')\">Actions</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr repeat.for=\"user of $displayData\" class=\"${user.id === $parent.selectedId ? 'active' : ''}\">\r\n                                <td if.bind=\"currentUser.isEditor\">\r\n                                    <input type=\"checkbox\" value=\"true\" checked.bind=\"user.checked\" change.delegate=\"checkMe(user.id)\" />\r\n                                </td>\r\n                                <td if.bind=\"isNotDisabled('loginName')\">\r\n                                    <a if.bind=\"user.isMember\" click.delegate=\"myNav.navigateToUserPage('read',user.id)\" title=\"View member\">${user.loginName}</a>\r\n                                    <span if.bind=\"!user.isMember\">${user.loginName}</span>\r\n                                </td>\r\n                                <td if.bind=\"isNotDisabled('firstName')\">${user.firstName}</td>\r\n                                <td if.bind=\"isNotDisabled('lastName')\">${user.lastName}</td>\r\n                                <td if.bind=\"isNotDisabled('emailAddress')\">${user.emailAddress}</td>\r\n                                <td if.bind=\"isNotDisabled('isMember')\">\r\n                                    <!--?? ${user.isMember}-->\r\n                                    <span-cust-member-status is-member.bind=\"user.isMember\" update-pending.bind=\"user.updatePending\" profile-date.bind=\"user.profileDate\"></span-cust-member-status>\r\n                                </td>\r\n                                <td if.bind=\"isNotDisabled('isActive')\">\r\n                                    <span-cust-active-status is-active.bind=\"user.isActive\" review-pending.bind=\"user.reviewPending\" review-result.bind=\"user.reviewResult\"></span-cust-active-status>\r\n                                </td>\r\n                                <td if.bind=\"isNotDisabled('edit')\">\r\n                                    <div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"User actions\">\r\n                                        <button if.bind=\"currentUser.isEditor\" disabled.bind=\"!user.isMember\" class=\"btn btn-default\" click.delegate=\"myNav.navigateToUserPage('edit',user.id)\"\r\n                                            title=\"Edit Profile\">\r\n                                            <i class=\"fa fa-pencil\"></i>\r\n                                        </button>\r\n                                        <!--<a class=\"btn btn-default\" route-href=\"route: user-edit; params.bind: {id:user.id, pageType:'edit'}\" title=\"Full edit\">\r\n                                            <i class=\"fa fa-list\"></i>\r\n                                        </a>-->\r\n                                        <button disabled.bind=\"user.emailAddress==null\" class=\"btn btn-default\" click.delegate=\"myNav.emailUser(user.emailAddress)\"\r\n                                            title=\"Email User\">\r\n                                                <i class=\"fa fa-envelope-o\"></i>\r\n                                            </button>\r\n                                        <button if.bind=\"currentUser.isEditor\" disabled.bind=\"currentUser.id==user.id\" class=\"btn btn-default\" click.delegate=\"changeUserRoles(user.id)\" title.bind=\"currentUser.id==user.id ? 'Cannot change own role' : 'Change User Permissions'\">\r\n                                            <i class=\"fa fa-cog\"></i>\r\n                                        </button>\r\n                                        <button if.bind=\"currentUser.isEditor\" class=\"btn btn-default\" click.delegate=\"deleteUser(user.id)\" title=\"Delete User\">\r\n                                            <i class=\"fa fa-trash\"></i>\r\n                                        </button>\r\n                                    </div>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n            <!-- (END) Table -->\r\n\r\n            <!-- Pagination -->\r\n            <div class=\"row margin-bottom-g1 display-none\" if.bind=\"custTablePagination\">\r\n\r\n                <div class=\"col-md-7\">\r\n                    <aut-pagination current-page.bind=\"currentPage\" page-size.bind=\"custTablePageSize\" total-items.bind=\"totalItems\" pagination-size.bind=\"5\"\r\n                        boundary-links.bind=\"true\"> </aut-pagination>\r\n                </div>\r\n\r\n                <div class=\"col-md-5\">\r\n                    <div class=\"form-inline\">\r\n                        <div class=\"form-group pull-right\">\r\n                            <label for=\"custTablePageSize\">Page Size: </label>\r\n                            <select value.bind=\"custTablePageSize\" id=\"custTablePageSize\" class=\"form-control\">\r\n                                <option model.bind=\"5\">5</option>\r\n                                <option model.bind=\"10\">10</option>\r\n                                <option model.bind=\"20\">20</option>\r\n                                <option model.bind=\"50\">50</option>\r\n                                <option model.bind=\"100\">100</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- (END) Pagination -->\r\n\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/cust-span/span-cust-active-status.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <span class=\"color-archive\" if.bind=\"!isActive\"><i class=\"fa fa-archive text-after\"></i>Archived</span>\r\n    <span class=\"color-pending\" if.bind=\"isActive && reviewPending\"><i class=\"fa fa-clock-o text-after\"></i>Pending</span>\r\n    <span class=\"color-good\" if.bind=\"isActive && !reviewPending && reviewResult\"><i class=\"fa fa-check text-after\"></i>Approved</span>\r\n    <span class=\"color-danger\" if.bind=\"isActive && !reviewPending && !reviewResult\"><i class=\"fa fa-ban text-after\"></i>Rejected</span>\r\n</template>"; });
define('text!views/widgets/cust-span/span-cust-member-status.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <span if.bind=\"isMember\" class=\"${updatePending ? 'color-pending' : ''}\">${profileDate | formatDate}</span>\r\n    <span if.bind=\"!isMember\">Viewer</span>\r\n</template>"; });
define('text!views/widgets/inputs/form-checkbox.html', ['module'], function(module) { module.exports = "<template class=\"${inputOnly ? 'form-group-input-only' : 'form-group form-cust-wrap'} ${custMandatory && !custReadonly ? 'cust-mandatory' : ''}\">\r\n\r\n    <input if.bind=\"(custReadonly || isReadOnly) && model==null\" type=\"text\" class=\"form-control\" value=\"---\" readonly>\r\n    <input if.bind=\"(custReadonly || isReadOnly) && model==true\" type=\"text\" class=\"form-control\" value=\"Yes\" readonly>\r\n    <input if.bind=\"(custReadonly || isReadOnly) && model==false\" type=\"text\" class=\"form-control\" value=\"No\" readonly>\r\n\r\n    <label if.bind=\"!custReadonly\" class=\"form-cust-label label-with-checkbox ${inpPlacement ? 'checkbox-' + inpPlacement : ''}\">\r\n        <input type=\"checkbox\" name.bind=\"custName\" model.bind=\"true\" checked.bind=\"model\" disabled.bind=\"custReadonly\">\r\n        ${custLabel}\r\n    </label>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-filter-role.html', ['module'], function(module) { module.exports = "<template class=\"input-group\">\r\n    \r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n    <require from=\"select2/css/select2.min.css\"></require>\r\n\r\n    <span class=\"input-group-addon\" id=\"basic-addon3\">\r\n        <i class=\"fa fa-filter text-after\"></i>\r\n        ${custLabel}\r\n    </span>\r\n\r\n    <select if.bind=\"!autocomplete\" class=\"form-control\" value.bind=\"initSelected\" disabled.bind=\"!isEnabled\" selected.two-way=\"selected\"\r\n        change.delegate=\"changeCallback($event)\">\r\n        <option value=\"\">${custPlaceholder}</option>                 \r\n        <option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option.value\">\r\n            ${option.name}\r\n        </option>\r\n    </select>\r\n\r\n    <select if.bind=\"autocomplete\" class=\"form-control\" id.bind=\"name\" select2.bind=\"selectOptions\" value.bind=\"initSelected\"\r\n        disabled.bind=\"!isEnabled\" change.delegate=\"changeCallback($event)\">\r\n        \r\n        <option value=\"\">${custPlaceholder}</option>\r\n        <option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option.value\">\r\n            ${option.name}\r\n        </option>\r\n    </select>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-filter-text.html', ['module'], function(module) { module.exports = "<template class=\"input-group\">\r\n    <span class=\"input-group-addon\" id=\"basic-addon3\">\r\n        <i class=\"fa fa-filter text-after\"></i>\r\n        ${custLabel}\r\n    </span>\r\n    <input type=\"text\" value.bind=\"model\" placeholder=\"Enter filter text\" class=\"form-control\" />\r\n</template>"; });
define('text!views/widgets/inputs/form-input.html', ['module'], function(module) { module.exports = "<template class=\"${!inputOnly ? 'form-group form-cust-wrap' : ''} ${custMandatory && !custReadonly ? 'cust-mandatory' : ''}\">\r\n    \r\n    <require from=\"aurelia-mask/masked-input\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <label if.bind=\"!inputOnly\" class=\"form-cust-label\" for.bind=\"custName\" title.bind=\"custLabel\">\r\n        ${custLabel}\r\n    </label>\r\n    <!--<span>\r\n        ? ${custName}\r\n    </span>-->\r\n    <!--<div if.bind=\"model==null\" class=\"${!inputOnly ? 'form-cust-input' : ''}\">\r\n        <input type=\"text\" value=\"---\" class=\"form-control\" name.one-way=\"custName\" placeholder.bind=\"custPlaceholder\" readonly.bind=\"custReadonly || isReadOnly\">\r\n    </div>-->\r\n    <!--http://aurelia-ui-toolkits.github.io/demo-kendo/#/samples/generic-two-way-binding-support-->\r\n    <!--https://github.com/aurelia-ui-toolkits/aurelia-kendoui-bridge/issues/435-->\r\n<!--${model} | ${model | formatDate} | ${model | formatDate: 'YYYY-MM-DD hh:mm:ss' } | ${value.toISOString}-->\r\n<!--if.bind=\"model!=null\"-->\r\n    <!--? form-input: ${custName} | ${model} !-->\r\n\r\n    <div class=\"${!inputOnly ? 'form-cust-input' : ''}\">\r\n        <input if.bind=\"maskPattern=='telephone'\" type=\"custType\" masked=\"value.bind: model; mask.bind: maskPatternTelephone\" class=\"form-control\" name.one-way=\"custName\" placeholder.bind=\"custPlaceholder\" readonly.bind=\"custReadonly || isReadOnly\">\r\n        <input if.bind=\"maskPattern=='telephone-cc'\" type=\"custType\" masked=\"value.bind: model; mask.bind: maskPatternTelephoneCc\" class=\"form-control\" name.one-way=\"custName\" placeholder.bind=\"custPlaceholder\" readonly.bind=\"custReadonly || isReadOnly\">\r\n        <input if.bind=\"!maskPattern && custType=='text'\" type=\"custType\" value.bind=\"model\" class=\"form-control\" name.one-way=\"custName\" placeholder.bind=\"custPlaceholder\" readonly.bind=\"custReadonly || isReadOnly\">\r\n    </div>\r\n\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-radio.html', ['module'], function(module) { module.exports = "<template class=\"${!inputOnly ? 'form-group form-cust-wrap' : ''} ${custMandatory && !custReadonly ? 'cust-mandatory' : ''}\">\r\n\r\n    <!--<require from=\"../../../resources/format/format-date\"></require>-->\r\n    <require from=\"./form-input\"></require>\r\n\r\n    <label if.bind=\"!inputOnly\" class=\"col-xs-8 col-debug\" for.bind=\"custName\" title.bind=\"custLabel\">\r\n            ${custLabel}\r\n    </label>\r\n    <span class=\"${!inputOnly ? 'col-xs-2' : 'col-xs-6'} col-debug\">\r\n        <input type=\"radio\" name.bind=\"custName\" model.bind=\"1\" checked.bind=\"model\"> Yes\r\n    </span>\r\n    <span class=\"${!inputOnly ? 'col-xs-2' : 'col-xs-6'} col-debug\">\r\n        <input type=\"radio\" name.bind=\"custName\" model.bind=\"0\" checked.bind=\"model\"> No\r\n    </span>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-select.html', ['module'], function(module) { module.exports = "<template class=\"${!inputOnly ? 'form-group form-cust-wrap' : ''} ${custMandatory && !custReadonly ? 'cust-mandatory' : ''}\">\r\n\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n    <require from=\"select2/css/select2.min.css\"></require>\r\n\r\n    <label if.bind=\"!inputOnly\" class=\"form-cust-label\" for.bind=\"name\" title.bind=\"custLabel\">\r\n        ${custLabel}\r\n         <!--| ${model}-->\r\n        <!--${optionFilter ? ' > [' + optionFilter + ']' : ''}-->\r\n    </label>\r\n    <!--<span>\r\n        ? ${custName}\r\n    </span>-->\r\n    <div class=\"${!inputOnly ? 'form-cust-input' : ''}\">\r\n        <!--/ ${changed} / ${initSelected} / ${selected}-->\r\n        <!--selected.two-way=\"selected\" -->\r\n        <!--| ${model} | ${selected} | ${changed} | ${initSelected}-->\r\n        <!--propArr: ${propArr[0]} | ${propArr[1]}-->\r\n\r\n        <!--<input if.bind=\"custReadonly\" type=\"text\" value.bind=\"model\" class=\"form-control\" placeholder.bind=\"custPlaceholder\" readonly>-->\r\n<!--if.bind=\"!custReadonly\"-->\r\n\r\n        <input if.bind=\"custReadonly && !initSelected\" type=\"text\" class=\"form-control\" value=\"---\" readonly>\r\n\r\n        <select if.bind=\"!custReadonly || (custReadonly && initSelected)\"\r\n            reaonly.bind=\"custReadonly\"\r\n            class=\"form-control\"\r\n            value.bind=\"initSelected\"\r\n            disabled.bind=\"!isEnabled || custReadonly\"\r\n            selected.two-way=\"selected\"\r\n            change.delegate=\"changeCallback($event)\"\r\n            >\r\n\r\n            <option model.bind=\"null\">${custPlaceholder}</option>\r\n            <!--<option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option[propArr[0]]\">-->\r\n            <option repeat.for=\"option of options | filter:optionFilter[0]:optionFilter[1]\"\r\n                model.bind=\"option[propArr[0]]\"\r\n                css=\"background-color:red\"\r\n                >\r\n                ${option[propArr[1]]}\r\n            </option>\r\n        </select>\r\n\r\n        <!--<select if.bind=\"autocomplete\" class=\"form-control\"\r\n            id.bind=\"name\"\r\n            select2.bind=\"selectOptions\"\r\n            value.bind=\"initSelected\"\r\n            disabled.bind=\"!isEnabled\"\r\n            change.delegate=\"changeCallback($event)\">\r\n\r\n            <option value=\"\">${custPlaceholder}</option>\r\n            <option repeat.for=\"option of options | filter:optionFilter[0]:optionFilter[1]\" model.bind=\"option[propArr[0]]\">\r\n                ${option[propArr[1]]}\r\n            </option>\r\n        </select>-->\r\n\r\n    </div>\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-confidential.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/constants\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n\r\n    <form-select cust-label=\"Employment Status\"\r\n        model.two-way=\"myGlobals.profileSelected.confidentialData.employmentStatusValue\"\r\n        options.bind=\"myLookups.employmentStatuses\"\r\n        prop-arr.bind=\"['value','name']\"        \r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"myGlobals.profileSelected.confidentialData.employmentStatusValue\"\r\n        cust-mandatory.bind=\"true\"\r\n        cust-readonly.bind=\"isReadOnly\"></form-select>\r\n\r\n    <form-input cust-type=\"date\" model.two-way=\"myGlobals.profileSelected.confidentialData.memberSince\" cust-label=\"Member Since\" cust-mandatory.bind=\"true\"\r\n        cust-readonly.bind=\"isReadOnly\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <form-select cust-label=\"Credentials Level\"\r\n        prop-arr.bind=\"['value','name']\"\r\n        model.two-way=\"myGlobals.profileSelected.confidentialData.credentialLevelValue\"\r\n        options.bind=\"myLookups.credentialLevels\"        \r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"myGlobals.profileSelected.confidentialData.credentialLevelValue\"\r\n        cust-mandatory.bind=\"true\"\r\n        cust-readonly.bind=\"isReadOnly\"></form-select>\r\n\r\n    <div class=\"divider\"></div>\r\n    <form-input model.two-way=\"myGlobals.profileSelected.confidentialData.field1\" cust-label=\"Confidential Field 1\"\r\n        cust-readonly.bind=\"isReadOnly\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n    <form-input model.two-way=\"myGlobals.profileSelected.confidentialData.field2\" cust-label=\"Confidential Field 2\"\r\n        cust-readonly.bind=\"isReadOnly\"></form-input>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-details.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/constants\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n    <require from=\"../../../resources/format/json\"></require>\r\n\r\n    <require from=\"../../../resources/format/blob-to-url\"></require>\r\n  <require from=\"../../../resources/format/file-list-to-array\"></require>\r\n\r\n    <!--? user-panel-details.html | isReadOnly: ${isReadOnly} !-->\r\n\r\n    <!--<pre>${myLookups.hubs & json}</pre>-->\r\n\r\n\r\n\r\n<!--<input type=\"file\" accept=\"image/*\" files.bind=\"selectedFiles\">\r\n? files: ${selectedFiles & json}\r\n  <div>\r\n    <ul>\r\n      <li repeat.for=\"file of selectedFiles | fileListToArray\">\r\n        <img src.bind=\"file | blobToUrl\" />\r\n        <h3>${file.name}: ${file.type} ${file.size / 1000} kb</h3>\r\n        <p>Last Modified: ${file.lastModifiedDate}</p>\r\n      </li>\r\n    </ul>\r\n  </div>-->\r\n\r\n\r\n\r\n<!--<pre>${myGlobals.userSelected & json}</pre>-->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"firstName\" model.one-way=\"myGlobals.userSelected.firstName\" cust-readonly.bind=\"true\"></form-input>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"lastName\" model.one-way=\"myGlobals.userSelected.lastName\" cust-readonly.bind=\"true\"></form-input>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"loginName\" model.one-way=\"myGlobals.userSelected.loginName\" cust-readonly.bind=\"true\"></form-input>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"emailAddress\" model.one-way=\"myGlobals.userSelected.emailAddress\" cust-readonly.bind=\"true\"></form-input>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n    <pre class=\"col-xs-12\" if.bind=\"CV.debugShowOutput\">? DEV NOTE: SELECT [1,3,8,9] ... SELECTED: ${user.firstName}: ${user.lkp_regions_selected} > ${user.lkp_hub_selected} > ${user.lkp_segment_selected} > ${user.lkp_entity_selected} ?</pre>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.regions\" cust-name=\"lkp_regions\" model.two-way=\"myGlobals.profileSelected.regionId\" options.bind=\"myLookups.regions\"\r\n                autocomplete.bind=\"true\" init-selected.two-way=\"myGlobals.profileSelected.regionId\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.hubs\" cust-name=\"lkp_hubs\" model.two-way=\"myGlobals.profileSelected.hubId\" options.bind=\"myLookups.hubs\" init-selected.two-way=\"myGlobals.profileSelected.hubId\"\r\n                option-filter.bind=\"['regionId',myGlobals.profileSelected.regionId]\" is-enabled.bind=\"myGlobals.profileSelected.regionId\" cust-mandatory.bind=\"true\"\r\n                cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.segments\" cust-name=\"lkp_segments\" model.two-way=\"myGlobals.profileSelected.segmentId\" options.bind=\"myLookups.segments\"\r\n                init-selected.two-way=\"myGlobals.profileSelected.segmentId\" autocomplete.bind=\"true\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.entities\" cust-name=\"lkp_entities\" model.two-way=\"myGlobals.profileSelected.entityId\" options.bind=\"myLookups.entities\"\r\n                init-selected.two-way=\"myGlobals.profileSelected.entityId\" option-filter.bind=\"['segmentId',myGlobals.profileSelected.segmentId]\" is-enabled.bind=\"myGlobals.profileSelected.segmentId\"\r\n                cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"function\" model.two-way=\"myGlobals.profileSelected.function\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-input cust-name=\"location\" model.two-way=\"myGlobals.profileSelected.location\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.primaryPositions\" cust-name=\"lkp_primaryPositions\" model.two-way=\"myGlobals.profileSelected.primaryPositionId\"\r\n                options.bind=\"myLookups.primaryPositions\" autocomplete.bind=\"true\" init-selected.two-way=\"myGlobals.profileSelected.primaryPositionId\"\r\n                cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.secondaryPositions\" cust-name=\"lkp_secondaryPositions\" model.two-way=\"myGlobals.profileSelected.secondaryPosition\"\r\n                options.bind=\"myLookups.secondaryPositions\" init-selected.two-way=\"myGlobals.profileSelected.secondaryPosition\" option-filter.bind=\"['primaryPositionId',myGlobals.profileSelected.primaryPositionId]\"\r\n                is-enabled.bind=\"myGlobals.profileSelected.primaryPositionId\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.offices\" cust-name=\"lkp_offices\" model.two-way=\"myGlobals.profileSelected.officeId\" options.bind=\"myLookups.offices\"\r\n                autocomplete.bind=\"true\" init-selected.two-way=\"myGlobals.profileSelected.officeId\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n        <div class=\"col-xs-6\">\r\n            <form-select if.bind=\"myLookups.coatSizes\" cust-name=\"lkp_coatSizes\" model.two-way=\"myGlobals.profileSelected.coatSizeId\" options.bind=\"myLookups.coatSizes\"\r\n                init-selected.two-way=\"myGlobals.profileSelected.coatSizeId\" cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-select>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <table class=\"table cols-2 user-panel-table\">\r\n            <thead>\r\n                <tr>\r\n                    <th>Contact</th>\r\n                    <th>&nbsp;</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr>\r\n                    <td class=\"padding-bottom-0\">\r\n                        <form-input cust-name=\"businessNumber\" model.two-way=\"myGlobals.profileSelected.businessNumber\" mask-pattern=\"telephone\" cust-mandatory.bind=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                            <form-input cust-name=\"personalNumber\" model.two-way=\"myGlobals.profileSelected.personalNumber\" mask-pattern=\"telephone\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                            <form-input cust-name=\"officeNumber\" model.two-way=\"myGlobals.profileSelected.officeNumber\" mask-pattern=\"telephone\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                            <form-input cust-name=\"lyncNumber\" model.two-way=\"myGlobals.profileSelected.lyncNumber\" mask-pattern=\"telephone\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                            <form-input cust-name=\"homeNumber\" model.two-way=\"myGlobals.profileSelected.homeNumber\" mask-pattern=\"telephone\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                    </td>\r\n                    <td class=\"padding-bottom-0\">\r\n                        <form-input cust-name=\"manager_displayName\" model.one-way=\"myGlobals.userSelected.manager.displayName\" cust-readonly.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                        <form-input cust-name=\"manager_emailAddress\" model.one-way=\"myGlobals.userSelected.manager.emailAddress\" cust-readonly.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                        <form-input cust-name=\"manager_loginName\" model.one-way=\"myGlobals.userSelected.manager.loginName\" cust-readonly.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                        <form-input cust-name=\"manager_emergencyContactName\" model.two-way=\"myGlobals.profileSelected.emergencyContactName\" cust-mandatory.bind=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                            <form-input cust-name=\"manager_emergencyContactNumber\" model.two-way=\"myGlobals.profileSelected.emergencyContactNumber\" mask-pattern=\"telephone\"\r\n                                cust-mandatory.bind=\"true\" cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-languages.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <!--? languages:  ${myGlobals.profileSelected.languages} !\r\n\r\n<h1>1</h1>\r\n    <ul>\r\n        <li repeat.for=\"row of myLookups.languages\">\r\n            ${row.name}\r\n        </li>\r\n    </ul>\r\n    <h1>1.2 ${myGlobals.profileSelected.languages.length}</h1>\r\n    <ul>\r\n        <li repeat.for=\"row of myGlobals.profileSelected.languages\">\r\n            ${row.name}\r\n        </li>\r\n    </ul>\r\nlkp_languages: ${lkp_languages} / ${myLookups.languages}-->\r\n\r\n    <div class=\"col-xs-12\">\r\n        <table class=\"table cols-2 user-panel-table\">\r\n            <thead>\r\n                <tr>\r\n                    <th>${CV.myLabels.language}</th>\r\n                    <th>${CV.myLabels.languageProficiency}</th>\r\n                    <th if.bind=\"!isReadOnly\">Remove</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr repeat.for=\"row of myGlobals.profileSelected.languages\">\r\n                    <td class=\"padded-cell\">\r\n                        <form-select cust-name.bind=\"['language_' + $index]\"\r\n                            cust-label=\"Language\"\r\n                            input-only=\"true\"\r\n                            model.two-way=\"myGlobals.profileSelected.languages[$index].languageId\"\r\n                            options.bind=\"myLookups.languages\"                           \r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.languages[$index].languageId\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td class=\"padded-cell\">\r\n                        <form-select cust-name.bind=\"['languageProficiency_' + $index]\"\r\n                            cust-label=\"Proficiency\"\r\n                            input-only=\"true\"\r\n                            prop-arr.bind=\"['value','name']\"\r\n                            model.two-way=\"myGlobals.profileSelected.languages[$index].proficiencyValue\"\r\n                            options.bind=\"myLookups.languageProficiencies\"                            \r\n                            init-selected.two-way=\"myGlobals.profileSelected.languages[$index].proficiencyValue\"\r\n                            is-enabled.bind=\"myGlobals.profileSelected.languages[$index].languageId\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td if.bind=\"!isReadOnly\" class=\"padded-cell\">\r\n                        <button class=\"btn btn-xs btn-danger\" click.trigger=\"remove($index)\">\r\n                            <i class=\"fa fa-times\"></i>\r\n                        </button>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n\r\n   <div if.bind=\"!isReadOnly && myGlobals.profileSelected.languages.length < myLookups.languages.length\" class=\"col-xs-12 margin-bottom-g1\">\r\n       <!--if.bind=\"$index+1 == user.myGlobals.profileSelected.languages.length && $index+1<lkp_languages_limitTo\"-->\r\n        <button class=\"btn btn-default btn-sm\" click.trigger=\"add()\">\r\n            <i class=\"fa fa-plus\"></i>\r\n            Add Language\r\n        </button>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-passport.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../inputs/form-checkbox\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n    <require from=\"aurelia-kendoui-bridge/datepicker/datepicker\"></require>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <table class=\"table user-panel-table cols-4 padded-cells\">\r\n            <thead>\r\n                <tr>\r\n                    <th>${CV.myLabels.passportType}</th>\r\n                    <th>${CV.myLabels.passportNumber}</th>\r\n                    <th>${CV.myLabels.passportNationality}</th>\r\n                    <th>${CV.myLabels.passportExpiryDate}</th>\r\n                    <th if.bind=\"!isReadOnly\">Remove</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr repeat.for=\"row of myGlobals.profileSelected.passports\">\r\n                    <td>\r\n                        <form-select cust-name.bind=\"['passportType_' + $index]\"\r\n                            cust-label=\"Passport Type\"\r\n                            prop-arr.bind=\"['value','name']\"\r\n                            model.two-way=\"myGlobals.profileSelected.passports[$index].typeValue\"\r\n                            options.bind=\"myLookups.passportTypes\"\r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.passports[$index].typeValue\"\r\n                            cust-mandatory.bind=\"true\"\r\n                            input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td>\r\n                        <form-input cust-name.bind=\"['passportNumber_' + $index]\"\r\n                            cust-label=\"Passport Number\"\r\n                            model.two-way=\"myGlobals.profileSelected.passports[$index].number\"\r\n                            cust-mandatory.bind=\"true\" input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-input>\r\n                    </td>\r\n                    <td>\r\n                        <form-select cust-name.bind=\"['passportNationality_' + $index]\"\r\n                            cust-label=\"Passport Nationality\"\r\n                            model.two-way=\"myGlobals.profileSelected.passports[$index].countryId\"\r\n                            options.bind=\"myLookups.countries\"                            \r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.passports[$index].countryId\"\r\n                            cust-mandatory.bind=\"true\"\r\n                            input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td>\r\n                        <!--<form-input cust-name.bind=\"['passportExpiryDate_' + $index]\"\r\n                            cust-label=\"Passport Expiry Date\"\r\n                            cust-type=\"date\"\r\n                            model.two-way=\"myGlobals.profileSelected.passports[$index].expiresOn\"\r\n                            cust-mandatory.bind=\"true\"\r\n                            input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-input>-->\r\n                        <input if.bind=\"isReadOnly\"\r\n                            type=\"text\"\r\n                            class=\"form-control\"\r\n                            value.bind=\"profileSelected.passports[$index].expiresOn | formatDate:'L'\"\r\n                            readonly>\r\n\r\n                        <span if.bind=\"!isReadOnly\">\r\n                            <input class=\"k_datepicker\"\r\n                                id.bind=\"['passportExpiryDate_' + $index]\"\r\n                                name.one-way=\"['passportExpiryDate_' + $index]\"\r\n                                ak-datepicker=\"k-value.two-way: myGlobals.profileSelected.passports[$index].expiresOn;k-format:{0:dd/MM/yyyy}\"\r\n                                k-on-ready.delegate=\"onReady($event.detail,myGlobals.profileSelected.passports[$index].expiresOn)\"\r\n                                k-on-change.delegate=\"onChange($event.detail,myGlobals.profileSelected.visas[$index].expiresOn)\">\r\n                        </span>\r\n                    </td>\r\n                    <td if.bind=\"!isReadOnly\" class=\"padded-cell\">\r\n                        <button class=\"btn btn-xs btn-danger\" click.trigger=\"remove($index)\">\r\n                            <i class=\"fa fa-times\"></i>\r\n                        </button>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n\r\n    <div if.bind=\"!isReadOnly\" class=\"col-xs-12 margin-bottom-g1\">\r\n       <!--if.bind=\"$index+1 == user.myGlobals.profileSelected.languages.length && $index+1<lkp_languages_limitTo\"-->\r\n        <button class=\"btn btn-default btn-sm\" click.trigger=\"add()\">\r\n            <i class=\"fa fa-plus\"></i>\r\n            Add Passport\r\n        </button>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-training.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-radio\"></require>\r\n    <require from=\"../inputs/form-checkbox\"></require>\r\n    <require from=\"../../../resources/format/json\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n    <require from=\"aurelia-kendoui-bridge/datepicker/datepicker\"></require>\r\n\r\n    <div class=\"row-fluid\">\r\n        <div class=\"col-xs-12\" innerhtml.bind=\"message\"></div>\r\n    </div>\r\n\r\n    <!--<pre class=\"col-xs-4\">??? tmpTrainingsMule: <br>${tmpTrainingsMule & json} !!!</pre>\r\n    <div class=\"col-xs-4\">\r\n        <pre>??? myTrainingArrDynamic: <br>${myTrainingArrDynamic & json} !!! </pre>\r\n        <pre>??? myTrainingArr_init: <br>${myTrainingArr_init & json} !!!</pre>\r\n    </div>\r\n    <pre class=\"col-xs-4\">??? myGlobals.profileSelected.trainings: <br>${myGlobals.profileSelected.trainings & json} !!!</pre>-->\r\n    <pre if.bind=\"CV.debugShowCodeOutput\">${myLookups.trainings & json}</pre>\r\n    <pre if.bind=\"CV.debugShowCodeOutput\">${myTrainingArr_init & json}</pre>\r\n    <pre if.bind=\"CV.debugShowCodeOutput\">${myTrainingArrDynamic & json}</pre>\r\n    <pre if.bind=\"CV.debugShowCodeOutput\">\r\n        <ul>\r\n            <li repeat.for=\"row of myLookups.trainings\">\r\n                ${row & json}\r\n            </li>\r\n        </ul>\r\n    </pre>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <span class=\"display-block padding-bottom-2\" if.bind=\"isReadOnly && !myGlobals.profileSelected.trainings.length\"><strong>No Training Attended</strong></span>\r\n\r\n        <table class=\"table cols-3 user-panel-table padded-cells\" if.bind=\"(tmpTrainingsMule && !isReadOnly) || (isReadOnly && myGlobals.profileSelected.trainings.length>0)\">\r\n            <thead>\r\n                <tr>\r\n                    <th>${CV.myLabels.training}</th>\r\n                    <th>${CV.myLabels.attended}</th>\r\n                    <th>${CV.myLabels.expiryDate}</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr repeat.for=\"row of myGlobals.profileSelected.trainings\" if.bind=\"isReadOnly\">\r\n                    <td>\r\n                        <label>${returnTrainingLabel(row.trainingId)}</label>\r\n                    </td>\r\n                    <td>\r\n                        <i class=\"fa fa-check text-after\"></i>Attended\r\n                    </td>\r\n                    <td>\r\n                        <input type=\"text\"\r\n                            class=\"form-control\"\r\n                            value.bind=\"row.expiresOn | formatDate:'L'\"\r\n                            readonly>\r\n                    </td>\r\n                </tr>\r\n                <tr repeat.for=\"row of tmpTrainingsMule\" if.bind=\"!isReadOnly\">\r\n                    <td>\r\n                        <label>${tmpTrainingsMule[$index].name}</label>\r\n                    </td>\r\n                    <td>\r\n                        <label class=\"form-cust-label label-with-checkbox\">\r\n                            <input type=\"checkbox\"\r\n                                model.two-way=\"tmpTrainingsMule[$index].attended\"\r\n                                checked.bind=\"tmpTrainingsMule[$index].attended\"\r\n                                change.delegate=\"onTrainingChecked(row.id)\"\r\n                                value=\"true\">Attended</label>\r\n\r\n                    </td>\r\n                    <td>                        \r\n                        <span if.bind=\"!isReadOnly && tmpTrainingsMule[$index].expires && tmpTrainingsMule[$index].attended\">\r\n                            <input class=\"k_datepicker\"\r\n                                id.bind=\"['trainingExpiryDate_' + $index]\"  name.one-way=\"['trainingExpiryDate_' + $index]\"\r\n                                ak-datepicker=\"k-value.two-way: tmpTrainingsMule[$index].expiresOn;k-format:{0:dd/MM/yyyy}\"\r\n                                k-on-ready.delegate=\"onReady($event.detail,tmpTrainingsMule[$index].expiresOn)\"\r\n                                k-on-change.delegate=\"onTrainingChecked(row.id)\">\r\n                        </span>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-visa.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../inputs/form-checkbox\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n    <require from=\"aurelia-kendoui-bridge/datepicker/datepicker\"></require>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <table class=\"table user-panel-table padded-cells cols-4\">\r\n            <thead>\r\n                <tr>\r\n                    <th>${CV.myLabels.visaCountry}</th>\r\n                    <th>${CV.myLabels.visaType}</th>\r\n                    <th>${CV.myLabels.expiryDate}</th>\r\n                    <th>${CV.myLabels.visaMultiple}</th>\r\n                    <th if.bind=\"!isReadOnly\">Remove</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr repeat.for=\"row of myGlobals.profileSelected.visas\">\r\n                    <td>\r\n                        <form-select cust-name.bind=\"['visaCountry_' + $index]\"\r\n                            cust-label=\"Visa Country\"                            \r\n                            model.two-way=\"myGlobals.profileSelected.visas[$index].countryId\"\r\n                            options.bind=\"myLookups.countries\"                            \r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.visas[$index].countryId\"\r\n                            cust-mandatory.bind=\"true\"\r\n                            input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td>\r\n                        <form-select cust-name.bind=\"['visaType_' + $index]\"\r\n                            cust-label=\"Visa Type\"                                                    \r\n                            model.two-way=\"myGlobals.profileSelected.visas[$index].typeValue\"\r\n                            options.bind=\"myLookups.visaTypes\"  \r\n                            prop-arr.bind=\"['value','name']\"                          \r\n                            autocomplete.bind=\"true\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.visas[$index].typeValue\"\r\n                            cust-mandatory.bind=\"true\"\r\n                            input-only=\"true\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-select>\r\n                    </td>\r\n                    <td>\r\n                        <input if.bind=\"isReadOnly\"\r\n                            type=\"text\"\r\n                            class=\"form-control\"\r\n                            value.bind=\"myGlobals.profileSelected.visas[$index].expiresOn | formatDate:'L'\"\r\n                            readonly>\r\n\r\n                        <span if.bind=\"!isReadOnly\">\r\n                            <input class=\"k_datepicker\" id.bind=\"['visaExpiryDate_' + $index]\"  name.one-way=\"['visaExpiryDate_' + $index]\"\r\n                                ak-datepicker=\"k-value.two-way: myGlobals.profileSelected.visas[$index].expiresOn;k-format:{0:dd/MM/yyyy}\"\r\n                                k-on-ready.delegate=\"onReady($event.detail,myGlobals.profileSelected.visas[$index].expiresOn)\"\r\n                                k-on-change.delegate=\"onChange($event.detail,myGlobals.profileSelected.visas[$index].expiresOn)\">\r\n                        </span>\r\n                    </td>\r\n                    <td>\r\n                        <form-checkbox cust-name.bind=\"['visaMultiple_' + $index]\"\r\n                            cust-label=\"Multiple Visas\"\r\n                            model.two-way=\"myGlobals.profileSelected.visas[$index].multipleEntry\"\r\n                            init-selected.two-way=\"myGlobals.profileSelected.visas[$index].multipleEntry\"\r\n                            cust-readonly.bind=\"isReadOnly\"></form-checkbox>\r\n                    </td>\r\n                    <td if.bind=\"!isReadOnly\" class=\"padded-cell\">\r\n                        <button class=\"btn btn-xs btn-danger\" click.trigger=\"remove($index)\">\r\n                            <i class=\"fa fa-times\"></i>\r\n                        </button>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n\r\n    <div if.bind=\"!isReadOnly\" class=\"col-xs-12 margin-bottom-g1\">\r\n       <!--if.bind=\"$index+1 == user.myGlobals.profileSelected.languages.length && $index+1<lkp_languages_limitTo\"-->\r\n        <button class=\"btn btn-default btn-sm\" click.trigger=\"add()\">\r\n            <i class=\"fa fa-plus\"></i>\r\n            Add Visa\r\n        </button>\r\n    </div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map