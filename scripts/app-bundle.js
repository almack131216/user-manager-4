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

define('resources/constants',["require", "exports"], function (require, exports) {
    "use strict";
    exports.debugConsoleLog = false;
    exports.debugShowOutput = false;
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
define('app',["require", "exports", "aurelia-router", "aurelia-framework", "./api/web-api", "./resources/constants", "aurelia-auth"], function (require, exports, aurelia_router_1, aurelia_framework_1, web_api_1, Constants, aurelia_auth_1) {
    "use strict";
    var CV = Constants;
    var App = (function () {
        function App() {
            this.CV = CV;
        }
        App.prototype.activate = function () {
        };
        App.prototype.configureRouter = function (config, router) {
            config.title = CV.SITE_NAME_ABBR;
            config.map([
                { route: ['', 'welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Welcome' },
                { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Users' },
                { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'User' },
                { route: 'users/:id/:editType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit User' }
            ]);
            this.router = router;
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.inject(web_api_1.WebAPI, aurelia_router_1.Router, aurelia_auth_1.FetchConfig),
        __metadata("design:paramtypes", [])
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

define('main',["require", "exports", "./environment", "./auth-config"], function (require, exports, environment_1, auth_config_1) {
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
        });
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

define('api/utility',["require", "exports"], function (require, exports) {
    "use strict";
    function areEqual(obj1, obj2) {
        return Object.keys(obj1).every(function (key) { return obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]); });
    }
    exports.areEqual = areEqual;
    ;
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
define('api/web-api-users',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    var latency = 200;
    var id = 0;
    var users = null;
    var usersArr = [];
    var results = null;
    var WebAPIUsers = (function () {
        function WebAPIUsers(http) {
            this.isRequesting = false;
            this.usersArr = [];
            this.http = http;
        }
        WebAPIUsers.prototype.getUserList = function () {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var users = _this.http.fetch('src/views/widgets/user-panels/dummy-data.json')
                        .then(function (users) { return users.json(); });
                    resolve(users);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPIUsers.prototype.getUserDetails = function (id) {
            var _this = this;
            console.log('getUserDetails: ' + id);
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    console.log('usersArr:' + usersArr);
                    var found = _this.http.fetch('src/views/widgets/user-panels/dummy-user-all.json')
                        .then(function (found) { return found.json(); })
                        .then(function (found) { return found; });
                    console.log('getUserDetails ARR: ' + JSON.stringify(found));
                    resolve(found);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPIUsers.prototype.getUserRole = function (id) {
            var _this = this;
            console.log('getUserRole: ' + id);
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var found = _this.http.fetch('src/views/widgets/user-panels/dummy-user-role.json')
                        .then(function (found) { return found.json(); })
                        .then(function (found) { return found; });
                    console.log('getUserRole ARR: ' + JSON.stringify(found));
                    resolve(found);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPIUsers.prototype.saveUser = function (user) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var instance = JSON.parse(JSON.stringify(user));
                    var found = users.filter(function (x) { return x.id == user.id; })[0];
                    if (found) {
                        var index = users.indexOf(found);
                        users[index] = instance;
                    }
                    else {
                        users.push(instance);
                    }
                    _this.isRequesting = false;
                    resolve(instance);
                }, latency);
            });
        };
        return WebAPIUsers;
    }());
    WebAPIUsers = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], WebAPIUsers);
    exports.WebAPIUsers = WebAPIUsers;
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

define('resources/lookups',["require", "exports"], function (require, exports) {
    "use strict";
    var Lookups = (function () {
        function Lookups() {
            this.lkp_role = [
                { "value": 1, "name": "Viewer" },
                { "value": 3, "name": "Admin" }
            ];
            this.lkp_regions = [
                {
                    "id": 1,
                    "name": "Northern Hemispere"
                },
                {
                    "id": 2,
                    "name": "Southern Hemisphere"
                }
            ];
            this.lkp_hub = [
                { "id": 1, "name": "Hub 1.1", "regionId": 1 },
                { "id": 2, "name": "Hub 1.2", "regionId": 1 },
                { "id": 3, "name": "Hub 1.3", "regionId": 1 },
                { "id": 4, "name": "Hub 1.4", "regionId": 1 },
                { "id": 5, "name": "Hub 2.5", "regionId": 2 },
                { "id": 6, "name": "Hub 2.6", "regionId": 2 },
                { "id": 7, "name": "Hub 2.7", "regionId": 2 },
                { "id": 8, "name": "Hub 3.8", "regionId": 3 },
                { "id": 9, "name": "Hub 3.9", "regionId": 3 }
            ];
            this.lkp_segment = [
                { "id": 1, "name": "Segment 1" },
                { "id": 2, "name": "Segment 2" },
                { "id": 3, "name": "Segment 3" },
                { "id": 4, "name": "Segment 4" },
                { "id": 5, "name": "Segment 5" },
                { "id": 6, "name": "Segment 6" },
                { "id": 7, "name": "Segment 7" },
                { "id": 8, "name": "Segment 8" },
                { "id": 9, "name": "Segment 9" }
            ];
            this.lkp_entity = [
                { "id": 1, "name": "Entity 1", "segmentId": 1 },
                { "id": 2, "name": "Entity 2", "segmentId": 1 },
                { "id": 3, "name": "Entity 3", "segmentId": 1 },
                { "id": 4, "name": "Entity 4", "segmentId": 1 },
                { "id": 5, "name": "Entity 5", "segmentId": 2 },
                { "id": 6, "name": "Entity 6", "segmentId": 2 },
                { "id": 7, "name": "Entity 7", "segmentId": 2 },
                { "id": 8, "name": "Entity 8", "segmentId": 8 },
                { "id": 9, "name": "Entity 9", "segmentId": 8 }
            ];
            this.lkp_bp_office_address = [
                {
                    "id": 1,
                    "name": "Office 1"
                },
                {
                    "id": 2,
                    "name": "Office 2"
                }
            ];
            this.lkp_member_status = [
                { "value": 1, "label": "Status 1" },
                { "value": 2, "label": "Status 2" },
                { "value": 3, "label": "Status 3" }
            ];
            this.lkp_coatSizes = [
                { "id": 1, "name": "XXXS" },
                { "id": 2, "name": "XS" },
                { "id": 3, "name": "S" },
                { "id": 4, "name": "M" },
                { "id": 5, "name": "L" },
                { "id": 6, "name": "XL" }
            ];
            this.lkp_languages = [
                {
                    "id": 1,
                    "name": "English"
                },
                {
                    "id": 2,
                    "name": "Czech"
                },
                {
                    "id": 3,
                    "name": "Spanish"
                }
            ];
            this.lkp_languageLevel = [
                {
                    "value": 1,
                    "name": "Basic"
                },
                {
                    "value": 2,
                    "name": "Proficient"
                },
                {
                    "value": 3,
                    "name": "Fluent"
                }
            ];
            this.lkp_primaryPositions = [
                {
                    "id": 1,
                    "name": "Command Staff"
                },
                {
                    "id": 2,
                    "name": "Operations Section"
                },
                {
                    "id": 3,
                    "name": "Planning Section"
                }
            ];
            this.lkp_secondaryPositions = [
                {
                    "id": 1,
                    "name": "Deputy Incident Commanders",
                    "primaryPositionId": 1
                },
                {
                    "id": 2,
                    "name": "Safety OfficerHealth Specialist",
                    "primaryPositionId": 1
                },
                {
                    "id": 3,
                    "name": "Safety Officer Industrial Hygienist Specialists",
                    "primaryPositionId": 1
                },
                {
                    "id": 4,
                    "name": "Section Chief",
                    "primaryPositionId": 2
                }
            ];
            this.lkp_passportTypes = [
                {
                    "value": 1,
                    "name": "Regular"
                },
                {
                    "value": 2,
                    "name": "Diplomatic"
                },
                {
                    "value": 3,
                    "name": "Special"
                },
                {
                    "value": 4,
                    "name": "Temporary"
                }
            ];
            this.lkp_passportNationality = [
                {
                    "id": 1,
                    "name": "Afghanistan"
                },
                {
                    "id": 2,
                    "name": "Albania"
                },
                {
                    "id": 3,
                    "name": "Algeria"
                }
            ];
            this.lkp_visaTypes = [
                {
                    "value": 1,
                    "name": "Business visitor"
                },
                {
                    "value": 2,
                    "name": "Foreign national"
                },
                {
                    "value": 3,
                    "name": "Medical"
                }
            ];
            this.lkp_visaCountry = [
                {
                    "id": 1,
                    "name": "Afghanistan"
                },
                {
                    "id": 2,
                    "name": "Albania"
                },
                {
                    "id": 3,
                    "name": "Algeria"
                }
            ];
            this.lkp_userProfiles = [
                {
                    "value": 5,
                    "name": "Alex Mackenzie",
                    "loginName": "AGILY\\AMackenzie",
                },
                {
                    "value": 2,
                    "name": "David Sousek",
                    "loginName": "AGILY\\DSousek",
                }
            ];
            this.lkp_credentialLevels = [
                {
                    "value": 1,
                    "name": "1"
                },
                {
                    "value": 2,
                    "name": "2"
                },
                {
                    "value": 3,
                    "name": "3"
                }
            ];
            this.lkp_memberStatus = [
                {
                    "value": 1,
                    "name": "Employed"
                },
                {
                    "value": 2,
                    "name": "Retired"
                }
            ];
        }
        return Lookups;
    }());
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
define('dialog-demo/add-user-dialog',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../api/web-api-users", "../resources/lookups"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, web_api_users_1, lookups_1) {
    "use strict";
    var AddUserDialog = (function () {
        function AddUserDialog(controller, api, ea, lookups) {
            var _this = this;
            this.controller = controller;
            this.api = api;
            this.ea = ea;
            this.lookups = lookups;
            this.title = 'Add User';
            this.userRole = null;
            this.originalUser = null;
            this.rolesArrDynamic = [];
            this.filters = [
                { value: '', keys: ['firstName', 'lastName', 'emailAddress', 'personalNumber'] },
                { value: '1', keys: ['systemRoles.value'] }
            ];
            this.selectUserToAdd = function (getUser) {
                _this.selectedId = getUser.id;
                console.log('add-user-dialog: select: ' + _this.selectedId + ' / ' + getUser.id);
                _this.api.getUserRole(6).then(function (user) {
                    _this.userRole = user;
                    console.log('selectUserToAdd -> getUserRole (success) - ' + _this.selectedId + ' = ' + JSON.stringify(_this.userRole));
                });
            };
            this.lkp_role = lookups.lkp_role;
            this.rolesArr = this.lkp_role.map(function (x) {
                return {
                    value: x.value,
                    name: x.name
                };
            });
        }
        AddUserDialog.prototype.deselectUser = function () {
            this.selectedId = null;
        };
        AddUserDialog.prototype.created = function () {
            var _this = this;
            this.api.getUserList().then(function (users) { return _this.users = users; })
                .then(function () { return _this.populateRoleFilterFromList(); });
        };
        AddUserDialog.prototype.activate = function () {
        };
        AddUserDialog.prototype.yes = function () {
            this.controller.ok();
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
            for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
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
            this.api.getUserRole(this.userSelectedId).then(function (user) {
                _this.userRole = user;
            });
            this.lkp_role = lookups.lkp_role;
        }
        DeleteDialog.prototype.activate = function (model) {
            this.userRole = model;
            console.log('model: ' + JSON.stringify(model) + ' > ' + this.lkp_role);
        };
        DeleteDialog.prototype.yes = function () {
            this.controller.ok(this.userRole);
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
            var _this = this;
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
            this.api.getUserRole(6).then(function (user) {
                _this.info = user;
                _this.firstName = _this.info.firstName;
            });
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
            this.lookups = lookups;
            this.title = 'Change User Roles';
            this.userRole = null;
            this.originalUser = null;
            this.userSelectedId = null;
            this.userSelectedId = controller.settings.userId;
            this.api.getUserRole(this.userSelectedId).then(function (user) {
                _this.userRole = user;
            });
            this.lkp_role = lookups.lkp_role;
        }
        RolesDialog.prototype.activate = function (model) {
            this.userRole = model;
            console.log('model: ' + JSON.stringify(model) + ' > ' + this.lkp_role);
        };
        RolesDialog.prototype.yes = function () {
            this.controller.ok(this.userRole);
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
            var _this = this;
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
            this.api.getUserRole(6).then(function (user) {
                _this.info = user;
                _this.userArr = user;
                _this.firstName = _this.info.firstName;
            });
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
            console.log('DateFormatValueConverter: ' + value + ' / ' + this.gDateFormat + ' / ' + format);
            return moment(value, 'YYYY-MM-DD HH:mm').format(format ? format : this.gDateFormat);
        };
        return FormatDateValueConverter;
    }());
    exports.FormatDateValueConverter = FormatDateValueConverter;
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
define('views/pages/user-add',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../api/web-api-users", "../../resources/messages", "aurelia-framework"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_users_1, messages_1, aurelia_framework_2) {
    "use strict";
    var UserAdd = (function () {
        function UserAdd(api, ea) {
            this.api = api;
            this.ea = ea;
            this.user = null;
            this.title = 'Edit User';
        }
        Object.defineProperty(UserAdd.prototype, "canSave", {
            get: function () {
                return this.user.firstName && this.user.lastName && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        UserAdd.prototype.save = function () {
            var _this = this;
            this.api.saveUser(this.user).then(function (user) {
                console.log('save this.user: ' + JSON.stringify(_this.originalUser));
                console.log('save user: ' + JSON.stringify(user));
                _this.user = user;
                _this.originalUser = JSON.parse(JSON.stringify(_this.user));
                _this.ea.publish(new messages_1.UserUpdated(_this.user));
            });
        };
        return UserAdd;
    }());
    __decorate([
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserAdd.prototype, "user", void 0);
    UserAdd = __decorate([
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
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
define('views/pages/user-selected',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../api/web-api-users", "../../resources/messages"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_users_1, messages_1) {
    "use strict";
    var UserSelected = (function () {
        function UserSelected(api, ea) {
            this.api = api;
            this.ea = ea;
            this.editType = null;
            this.title = '';
        }
        UserSelected.prototype.activate = function (params, routeConfig) {
            var _this = this;
            this.routeConfig = routeConfig;
            console.log('activate: ' + params.id + ' (' + params.editType + ')');
            return this.api.getUserDetails(params.id).then(function (user) {
                if (params.editType)
                    _this.editType = params.editType;
                _this.user = user;
                _this.routeConfig.navModel.setTitle(_this.user.firstName);
                _this.originalUser = JSON.parse(JSON.stringify(_this.user));
                _this.ea.publish(new messages_1.UserViewed(_this.user));
            });
        };
        UserSelected.prototype.canDeactivate = function () {
        };
        return UserSelected;
    }());
    UserSelected = __decorate([
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator])
    ], UserSelected);
    exports.UserSelected = UserSelected;
});

define('views/pages/welcome',["require", "exports"], function (require, exports) {
    "use strict";
    var Welcome = (function () {
        function Welcome() {
            this.title = 'Welcome';
        }
        return Welcome;
    }());
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
define('views/ui/nav-bar',["require", "exports", "aurelia-framework", "../../resources/constants"], function (require, exports, aurelia_framework_1, Constants) {
    "use strict";
    var CV = Constants;
    var NavBar = (function () {
        function NavBar() {
            this.router = null;
            this.CV = CV;
        }
        return NavBar;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], NavBar.prototype, "router", void 0);
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

define('views/ui/ui-header',["require", "exports", "../../resources/constants"], function (require, exports, Constants) {
    "use strict";
    var CV = Constants;
    var UiHeader = (function () {
        function UiHeader() {
            this.CV = CV;
        }
        return UiHeader;
    }());
    exports.UiHeader = UiHeader;
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
define('views/widgets/form-user-full-body',["require", "exports", "aurelia-framework", "../../resources/constants"], function (require, exports, aurelia_framework_1, Constants) {
    "use strict";
    var CV = Constants;
    var FormUserFullBody = (function () {
        function FormUserFullBody() {
            this.user = null;
            this.custIcon = null;
            this.custBody = null;
            this.custClass = null;
            this.custTitle = null;
            this.custXc = null;
            this.custXcId = null;
            this.custXcExpanded = null;
            this.custXcResClass = null;
        }
        return FormUserFullBody;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormUserFullBody.prototype, "user", void 0);
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
    exports.FormUserFullBody = FormUserFullBody;
});

define('views/widgets/list-activity',["require", "exports"], function (require, exports) {
    "use strict";
    var listActivity = (function () {
        function listActivity() {
            this.title = 'Events';
            this.title2 = 'History';
        }
        return listActivity;
    }());
    exports.listActivity = listActivity;
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
define('views/widgets/user-edit',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-event-aggregator", "../../api/web-api-users", "../../resources/messages"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_event_aggregator_1, web_api_users_1, messages_1) {
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
        Object.defineProperty(UserEdit.prototype, "canSave", {
            get: function () {
                return this.user.firstName && this.user.lastName && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        UserEdit.prototype.save = function () {
            var _this = this;
            this.api.saveUser(this.user).then(function (user) {
                console.log('save this.user: ' + JSON.stringify(_this.originalUser));
                console.log('save user: ' + JSON.stringify(user));
                _this.user = user;
                _this.originalUser = JSON.parse(JSON.stringify(_this.user));
                _this.ea.publish(new messages_1.UserUpdated(_this.user));
            });
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
define('views/widgets/user-list',["require", "exports", "aurelia-event-aggregator", "aurelia-router", "../../api/web-api-users", "../../resources/messages", "aurelia-framework", "aurelia-framework", "../../resources/constants", "aurelia-dialog", "../../user-info/user-info", "../../dialog-demo/roles-dialog", "../../dialog-demo/add-user-dialog", "../../dialog-demo/delete-user-dialog", "../../resources/lookups"], function (require, exports, aurelia_event_aggregator_1, aurelia_router_1, web_api_users_1, messages_1, aurelia_framework_1, aurelia_framework_2, Constants, aurelia_dialog_1, user_info_1, roles_dialog_1, add_user_dialog_1, delete_user_dialog_1, lookups_1) {
    "use strict";
    var CV = Constants;
    var UserList = (function () {
        function UserList(api, ea, userInfo, dialogService, lookups, router) {
            var _this = this;
            this.api = api;
            this.userInfo = userInfo;
            this.dialogService = dialogService;
            this.custHideTitleBar = false;
            this.custTablePagination = false;
            this.custTablePageSize = 100;
            this.CV = CV;
            this.selectedId = 0;
            this.title = 'Users';
            this.rolesArrDynamic = [];
            this.filters = [
                { value: '', keys: ['firstName', 'lastName', 'emailAddress', 'personalNumber'] },
                { value: '1', keys: ['systemRoles.value'] }
            ];
            ea.subscribe(messages_1.UserViewed, function (msg) { return _this.select(msg.user); });
            ea.subscribe(messages_1.UserUpdated, function (msg) {
                var id = msg.user.id;
                var found = _this.users.find(function (x) { return x.id == id; });
                Object.assign(found, msg.user);
            });
            this.lkp_role = lookups.lkp_role;
            this.rolesArr = this.lkp_role.map(function (x) {
                return {
                    value: x.value,
                    name: x.name
                };
            });
            this.router = router;
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
        UserList.prototype.created = function () {
            var _this = this;
            if (CV.debugConsoleLog)
                console.log('created: ' + this.title + ' / ' + this.custTitle);
            if (this.custTitle)
                this.title = this.custTitle;
            this.api.getUserList().then(function (users) { return _this.users = users; })
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
            for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
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
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTitle", void 0);
    __decorate([
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custDisableCells", void 0);
    __decorate([
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custHideTitleBar", void 0);
    __decorate([
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTablePagination", void 0);
    __decorate([
        aurelia_framework_2.bindable,
        __metadata("design:type", Object)
    ], UserList.prototype, "custTablePageSize", void 0);
    UserList = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.inject(web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, lookups_1.Lookups, aurelia_router_1.Router),
        __metadata("design:paramtypes", [web_api_users_1.WebAPIUsers, aurelia_event_aggregator_1.EventAggregator, user_info_1.UserInfo, aurelia_dialog_1.DialogService, lookups_1.Lookups, aurelia_router_1.Router])
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
define('views/widgets/inputs/form-checkbox',["require", "exports", "aurelia-framework", "../../../resources/constants", "aurelia-binding"], function (require, exports, aurelia_framework_1, Constants, aurelia_binding_1) {
    "use strict";
    var CV = Constants;
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine);
    aurelia_framework_1.inject(Element);
    var FormCheckbox = (function () {
        function FormCheckbox() {
            this.name = null;
            this.inpPlacement = null;
            this.inpLabel = null;
            this.inpPlaceholder = null;
            this.inpName = null;
            this.inpValue = null;
            this.isMandatory = null;
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
            if (!this.inpLabel && this.name)
                this.inpLabel = this.tmpCreateLabel(this.name);
            if (!this.inpPlaceholder)
                this.inpPlaceholder = "Enter " + this.inpLabel;
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
    ], FormCheckbox.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inpPlacement", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inpLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inpPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inpName", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "inpValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormCheckbox.prototype, "isMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
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
            this.autocomplete = null;
            this.optionFilter = null;
            this.isEnabled = true;
            this.inpPlaceholder = 'All roles';
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
            this.isMandatory = null;
            this.inpLabel = 'Filter';
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
    ], FormFilterText.prototype, "isMandatory", void 0);
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
    aurelia_framework_1.inject(aurelia_binding_1.BindingEngine);
    aurelia_framework_1.inject(Element);
    var FormInput = (function () {
        function FormInput(model) {
            this.maskPattern = null;
            this.maskPatternTelephone = '+ 999 / 999999';
            this.maskPatternTelephoneCc = '+ 999 / 999999';
            this.inpType = "text";
            this.formatDate = null;
            this.inpLabel = null;
            this.inpPlaceholder = null;
            this.inpName = null;
            this.inpValue = null;
            this.inpValueTwoWay = null;
            this.isMandatory = null;
            this.isMemberOnly = null;
            this.isEnabled = true;
            this.isReadonly = false;
            this.name = null;
            this.value = null;
        }
        FormInput.prototype.activate = function (model) {
        };
        FormInput.prototype.tmpCreateLabel = function (getStr) {
            return getStr.replace(/_/g, " ").toLowerCase();
        };
        FormInput.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-inputs] created: ' + this.model);
            if (!this.inpLabel)
                this.inpLabel = this.tmpCreateLabel(this.name);
            if (!this.inpPlaceholder)
                this.inpPlaceholder = "Enter " + this.inpLabel;
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
    ], FormInput.prototype, "inpType", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "formatDate", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inpLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inpPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormInput.prototype, "inpName", void 0);
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
    ], FormInput.prototype, "isMandatory", void 0);
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
    ], FormInput.prototype, "isReadonly", void 0);
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
            this.inpType = "radio";
            this.name = null;
            this.inpLabel = null;
            this.inpPlaceholder = null;
            this.inpName = null;
            this.inpValue = null;
            this.isMandatory = null;
            this.expiryDate = null;
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
            if (!this.inpLabel && this.name)
                this.inpLabel = this.tmpCreateLabel(this.name);
            if (!this.inpPlaceholder)
                this.inpPlaceholder = "Enter " + this.inpLabel;
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
    ], FormRadio.prototype, "inpType", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inpLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inpPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inpName", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "inpValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "isMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormRadio.prototype, "expiryDate", void 0);
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
            this.inpLabel = null;
            this.inpPlaceholder = null;
            this.isMandatory = null;
            this.name = null;
            this.propArr = ['id', 'name'];
            this.options = [];
            this.selectOptions = { allowClear: true, placeholder: 'Select...' };
            this.selectedValues = [];
            this.multipleSelectValues = ['z', 'y', 'x'];
        }
        FormSelect.prototype.activate = function (model) {
        };
        FormSelect.prototype.attached = function () {
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected: ' + this.initSelected + ' / ' + this.selected);
            this.selected = this.initSelected != null ? this.initSelected : 0;
            if (CV.debugConsoleLog)
                console.log('attached -> initSelected (2): ' + this.initSelected + ' / ' + this.selected);
        };
        FormSelect.prototype.selectedChanged = function (newValue) {
            if (CV.debugConsoleLog)
                console.log('selectedChanged: ' + newValue + ' / ' + this.initSelected);
            this.changed = newValue != null ? newValue : this.initSelected;
            this.selected = this.changed;
        };
        FormSelect.prototype.tmpCreateLabel = function (getStr) {
            return getStr;
        };
        FormSelect.prototype.created = function () {
            if (CV.debugConsoleLog)
                console.log('[form-inputs] created: ' + this.name);
            if (!this.inpLabel)
                this.inpLabel = this.tmpCreateLabel(this.name);
            if (!this.inpPlaceholder)
                this.inpPlaceholder = "Enter " + this.inpLabel;
        };
        FormSelect.prototype.changeCallback = function (evt) {
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
    ], FormSelect.prototype, "inpLabel", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "inpPlaceholder", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "isMandatory", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], FormSelect.prototype, "name", void 0);
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
define('views/widgets/user-panels/user-panel-confidential',["require", "exports", "aurelia-framework", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, lookups_1) {
    "use strict";
    var UserPanelConfidential = (function () {
        function UserPanelConfidential(lookups) {
            this.lookups = lookups;
            this.tmpMemberStatus = 1;
            this.lkp_memberStatus = lookups.lkp_memberStatus;
            this.lkp_userProfiles = lookups.lkp_userProfiles;
            this.lkp_credentialLevels = lookups.lkp_credentialLevels;
        }
        return UserPanelConfidential;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelConfidential.prototype, "user", void 0);
    UserPanelConfidential = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
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
define('views/widgets/user-panels/user-panel-details',["require", "exports", "aurelia-framework", "../../../resources/constants", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, Constants, lookups_1) {
    "use strict";
    var CV = Constants;
    var UserPanelDetails = (function () {
        function UserPanelDetails(lookups) {
            this.CV = CV;
            this.lkp_regions = lookups.lkp_regions;
            this.lkp_hub = lookups.lkp_hub;
            this.lkp_segment = lookups.lkp_segment;
            this.lkp_entity = lookups.lkp_entity;
            this.lkp_bp_office_address = lookups.lkp_bp_office_address;
        }
        return UserPanelDetails;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelDetails.prototype, "user", void 0);
    UserPanelDetails = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
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
define('views/widgets/user-panels/user-panel-languages',["require", "exports", "aurelia-framework", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, lookups_1) {
    "use strict";
    var UserPanelLanguages = (function () {
        function UserPanelLanguages(lookups) {
            this.lkp_languages_limitTo = 5;
            this.lkp_member_status = lookups.lkp_member_status;
            this.lkp_languages = lookups.lkp_languages;
            this.lkp_languageLevel = lookups.lkp_languageLevel;
        }
        return UserPanelLanguages;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelLanguages.prototype, "user", void 0);
    UserPanelLanguages = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
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
define('views/widgets/user-panels/user-panel-mrt-role',["require", "exports", "aurelia-framework", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, lookups_1) {
    "use strict";
    var UserPanelMrtRole = (function () {
        function UserPanelMrtRole(lookups) {
            this.lkp_coatSizes = lookups.lkp_coatSizes;
            this.lkp_primaryPositions = lookups.lkp_primaryPositions;
            this.lkp_secondaryPositions = lookups.lkp_secondaryPositions;
        }
        return UserPanelMrtRole;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelMrtRole.prototype, "user", void 0);
    UserPanelMrtRole = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
    ], UserPanelMrtRole);
    exports.UserPanelMrtRole = UserPanelMrtRole;
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
define('views/widgets/user-panels/user-panel-passport',["require", "exports", "aurelia-framework", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, lookups_1) {
    "use strict";
    var UserPanelPassport = (function () {
        function UserPanelPassport(lookups) {
            this.lookups = lookups;
            this.lkp_passportTypes = lookups.lkp_passportTypes;
            this.lkp_passportNationality = lookups.lkp_passportNationality;
        }
        return UserPanelPassport;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelPassport.prototype, "user", void 0);
    UserPanelPassport = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
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
define('views/widgets/user-panels/user-panel-training',["require", "exports", "aurelia-framework", "../../../resources/constants"], function (require, exports, aurelia_framework_1, Constants) {
    "use strict";
    var CV = Constants;
    var UserPanelTraining = (function () {
        function UserPanelTraining() {
            this.CV = CV;
            this.message = CV.MSG_TRAINING;
        }
        return UserPanelTraining;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelTraining.prototype, "user", void 0);
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
define('views/widgets/user-panels/user-panel-twic',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
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
define('views/widgets/user-panels/user-panel-visa',["require", "exports", "aurelia-framework", "../../../resources/lookups"], function (require, exports, aurelia_framework_1, lookups_1) {
    "use strict";
    var UserPanelVisa = (function () {
        function UserPanelVisa(lookups) {
            this.lookups = lookups;
            this.lkp_passportNationality = lookups.lkp_passportNationality;
            this.lkp_visaCountry = lookups.lkp_visaCountry;
            this.lkp_visaTypes = lookups.lkp_visaTypes;
        }
        return UserPanelVisa;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], UserPanelVisa.prototype, "user", void 0);
    UserPanelVisa = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [lookups_1.Lookups])
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
define('text!styles.css', ['module'], function(module) { module.exports = "body { }\n\n/* forms */\n.form-group label {background:yellow;}\n\n/* offsets */\n.padding-x-0 {padding-left:0px !important;padding-right:0px !important;}\n.margin-x-0 {margin-left:0px !important;margin-right:0px !important;}\n\n.html-file-name {margin-left:10px;color:red;font-size:0.5em;}\n\n.display-none {display:none !important}\n.display-block {display:block !important}\n.display-inline-block {display:inline-block !important}\n\n.btn-i i.fa {margin-right:10px;}\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./views/ui/nav-bar\"></require>\r\n  <require from=\"./views/ui/ui-footer\"></require>\r\n  <require from=\"./font-awesome.css\"></require>\r\n  <link href=\"src/css/main.css\" rel=\"stylesheet\" />\r\n  <link href=\"src/css/bootstrap.min.css\" rel=\"stylesheet\" />\r\n\r\n  <div id=\"container-fixed-footer\">\r\n    <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\r\n    <nav-bar router.bind=\"router\" id=\"header\"></nav-bar>\r\n\r\n    <div class=\"container\" id=\"body\">\r\n      <div class=\"row\">      \r\n        <router-view></router-view>\r\n      </div>\r\n    </div>\r\n\r\n    <ui-footer id=\"footer\"></ui-footer>\r\n  </div>\r\n\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\r\n  <require from=\"font-awesome.css\"></require>\r\n\r\n    <div class=\"container\">\r\n    <div class=\"row\">      \r\n      <div class=\"col-md-12 styleXXX\" style=\"padding-top:100px;\">\r\n          <h1>${title}</h1>\r\n        <form class=\"login-form\" submit.delegate=\"login()\">\r\n            <input type=\"text\" placeholder=\"username\" value.bind=\"username\" />\r\n            <input type=\"password\" placeholder=\"password\" value.bind=\"password\" />\r\n            <button type=\"submit\">Login</button>\r\n            <span class=\"error\">${error}</span>\r\n        </form>\r\n    </div>\r\n    </div>\r\n  </div>\r\n    \r\n</template>"; });
define('text!css/bootstrap.min.css', ['module'], function(module) { module.exports = "/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2017 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n\n/*!\n * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=de4703e65d4b602764ed4ea9f7f4c735)\n * Config saved to config.json and https://gist.github.com/de4703e65d4b602764ed4ea9f7f4c735\n *//*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:bold}dfn{font-style:italic}h1{font-size:2em;margin:0.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-0.5em}sub{bottom:-0.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace, monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=\"checkbox\"],input[type=\"radio\"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto}input[type=\"search\"]{-webkit-appearance:textfield;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}input[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:bold}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,*:before,*:after{background:transparent !important;color:#000 !important;-webkit-box-shadow:none !important;box-shadow:none !important;text-shadow:none !important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"#\"]:after,a[href^=\"javascript:\"]:after{content:\"\"}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100% !important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000 !important}.label{border:1px solid #000}.table{border-collapse:collapse !important}.table td,.table th{background-color:#fff !important}.table-bordered th,.table-bordered td{border:1px solid #ddd !important}}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*:before,*:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}input,button,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#97cc00;text-decoration:none}a:hover,a:focus{color:#5e8000;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.img-responsive,.thumbnail>img,.thumbnail a>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:0;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;display:inline-block;max-width:100%;height:auto}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=\"button\"]{cursor:pointer}h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small,.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 .small,h2 .small,h3 .small,h4 .small,h5 .small,h6 .small,.h1 .small,.h2 .small,.h3 .small,.h4 .small,.h5 .small,.h6 .small{font-weight:normal;line-height:1;color:#777}h1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px}h1 small,.h1 small,h2 small,.h2 small,h3 small,.h3 small,h1 .small,.h1 .small,h2 .small,.h2 .small,h3 .small,.h3 .small{font-size:65%}h4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px}h4 small,.h4 small,h5 small,.h5 small,h6 small,.h6 small,h4 .small,.h4 .small,h5 .small,.h5 .small,h6 .small,.h6 .small{font-size:75%}h1,.h1{font-size:36px}h2,.h2{font-size:30px}h3,.h3{font-size:24px}h4,.h4{font-size:18px}h5,.h5{font-size:14px}h6,.h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}small,.small{font-size:85%}mark,.mark{background-color:#fcf8e3;padding:.2em}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#090}a.text-primary:hover,a.text-primary:focus{color:#060}.text-success{color:#3c763d}a.text-success:hover,a.text-success:focus{color:#2b542c}.text-info{color:#31708f}a.text-info:hover,a.text-info:focus{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:hover,a.text-warning:focus{color:#66512c}.text-danger{color:#a94442}a.text-danger:hover,a.text-danger:focus{color:#843534}.bg-primary{color:#fff;background-color:#090}a.bg-primary:hover,a.bg-primary:focus{background-color:#060}.bg-success{background-color:#dff0d8}a.bg-success:hover,a.bg-success:focus{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:hover,a.bg-info:focus{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:hover,a.bg-warning:focus{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:hover,a.bg-danger:focus{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ul,ol{margin-top:0;margin-bottom:10px}ul ul,ol ul,ul ol,ol ol{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none;margin-left:-5px}.list-inline>li{display:inline-block;padding-left:5px;padding-right:5px}dl{margin-top:0;margin-bottom:20px}dt,dd{line-height:1.42857143}dt{font-weight:bold}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;clear:left;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[title],abbr[data-original-title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote p:last-child,blockquote ul:last-child,blockquote ol:last-child{margin-bottom:0}blockquote footer,blockquote small,blockquote .small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote footer:before,blockquote small:before,blockquote .small:before{content:'\\2014 \\00A0'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;border-right:5px solid #eee;border-left:0;text-align:right}.blockquote-reverse footer:before,blockquote.pull-right footer:before,.blockquote-reverse small:before,blockquote.pull-right small:before,.blockquote-reverse .small:before,blockquote.pull-right .small:before{content:''}.blockquote-reverse footer:after,blockquote.pull-right footer:after,.blockquote-reverse small:after,blockquote.pull-right small:after,.blockquote-reverse .small:after,blockquote.pull-right .small:after{content:'\\00A0 \\2014'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:0}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25)}kbd kbd{padding:0;font-size:100%;font-weight:bold;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:0}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}.row{margin-left:-15px;margin-right:-15px}.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position:relative;min-height:1px;padding-left:15px;padding-right:15px}.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>thead>tr>td{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=\"col-\"]{position:static;float:none;display:table-column}table td[class*=\"col-\"],table th[class*=\"col-\"]{position:static;float:none;display:table-cell}.table>thead>tr>td.active,.table>tbody>tr>td.active,.table>tfoot>tr>td.active,.table>thead>tr>th.active,.table>tbody>tr>th.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>tbody>tr.active>td,.table>tfoot>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr.active>th,.table>tfoot>tr.active>th{background-color:#f5f5f5}.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover,.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr.active:hover>th{background-color:#e8e8e8}.table>thead>tr>td.success,.table>tbody>tr>td.success,.table>tfoot>tr>td.success,.table>thead>tr>th.success,.table>tbody>tr>th.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>tbody>tr.success>td,.table>tfoot>tr.success>td,.table>thead>tr.success>th,.table>tbody>tr.success>th,.table>tfoot>tr.success>th{background-color:#dff0d8}.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover,.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr.success:hover>th{background-color:#d0e9c6}.table>thead>tr>td.info,.table>tbody>tr>td.info,.table>tfoot>tr>td.info,.table>thead>tr>th.info,.table>tbody>tr>th.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>tbody>tr.info>td,.table>tfoot>tr.info>td,.table>thead>tr.info>th,.table>tbody>tr.info>th,.table>tfoot>tr.info>th{background-color:#d9edf7}.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover,.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr.info:hover>th{background-color:#c4e3f3}.table>thead>tr>td.warning,.table>tbody>tr>td.warning,.table>tfoot>tr>td.warning,.table>thead>tr>th.warning,.table>tbody>tr>th.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>tbody>tr.warning>td,.table>tfoot>tr.warning>td,.table>thead>tr.warning>th,.table>tbody>tr.warning>th,.table>tfoot>tr.warning>th{background-color:#fcf8e3}.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr.warning:hover>th{background-color:#faf2cc}.table>thead>tr>td.danger,.table>tbody>tr>td.danger,.table>tfoot>tr>td.danger,.table>thead>tr>th.danger,.table>tbody>tr>th.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>tbody>tr.danger>td,.table>tfoot>tr.danger>td,.table>thead>tr.danger>th,.table>tbody>tr.danger>th,.table>tfoot>tr.danger>th{background-color:#f2dede}.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover,.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr.danger:hover>th{background-color:#ebcccc}.table-responsive{overflow-x:auto;min-height:0.01%}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>thead>tr>th,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tfoot>tr>td{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>thead>tr>th:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.table-responsive>.table-bordered>thead>tr>th:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>th,.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>td{border-bottom:0}}fieldset{padding:0;margin:0;border:0;min-width:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:bold}input[type=\"search\"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=\"radio\"],input[type=\"checkbox\"]{margin:4px 0 0;margin-top:1px \\9;line-height:normal}input[type=\"file\"]{display:block}input[type=\"range\"]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=\"file\"]:focus,input[type=\"radio\"]:focus,input[type=\"checkbox\"]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{border:0;background-color:transparent}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=\"search\"]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=\"date\"].form-control,input[type=\"time\"].form-control,input[type=\"datetime-local\"].form-control,input[type=\"month\"].form-control{line-height:34px}input[type=\"date\"].input-sm,input[type=\"time\"].input-sm,input[type=\"datetime-local\"].input-sm,input[type=\"month\"].input-sm,.input-group-sm input[type=\"date\"],.input-group-sm input[type=\"time\"],.input-group-sm input[type=\"datetime-local\"],.input-group-sm input[type=\"month\"]{line-height:30px}input[type=\"date\"].input-lg,input[type=\"time\"].input-lg,input[type=\"datetime-local\"].input-lg,input[type=\"month\"].input-lg,.input-group-lg input[type=\"date\"],.input-group-lg input[type=\"time\"],.input-group-lg input[type=\"datetime-local\"],.input-group-lg input[type=\"month\"]{line-height:46px}}.form-group{margin-bottom:15px}.radio,.checkbox{position:relative;display:block;margin-top:10px;margin-bottom:10px}.radio label,.checkbox label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:normal;cursor:pointer}.radio input[type=\"radio\"],.radio-inline input[type=\"radio\"],.checkbox input[type=\"checkbox\"],.checkbox-inline input[type=\"checkbox\"]{position:absolute;margin-left:-20px;margin-top:4px \\9}.radio+.radio,.checkbox+.checkbox{margin-top:-5px}.radio-inline,.checkbox-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;vertical-align:middle;font-weight:normal;cursor:pointer}.radio-inline+.radio-inline,.checkbox-inline+.checkbox-inline{margin-top:0;margin-left:10px}input[type=\"radio\"][disabled],input[type=\"checkbox\"][disabled],input[type=\"radio\"].disabled,input[type=\"checkbox\"].disabled,fieldset[disabled] input[type=\"radio\"],fieldset[disabled] input[type=\"checkbox\"]{cursor:not-allowed}.radio-inline.disabled,.checkbox-inline.disabled,fieldset[disabled] .radio-inline,fieldset[disabled] .checkbox-inline{cursor:not-allowed}.radio.disabled label,.checkbox.disabled label,fieldset[disabled] .radio label,fieldset[disabled] .checkbox label{cursor:not-allowed}.form-control-static{padding-top:7px;padding-bottom:7px;margin-bottom:0;min-height:34px}.form-control-static.input-lg,.form-control-static.input-sm{padding-left:0;padding-right:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}textarea.input-sm,select[multiple].input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm textarea.form-control,.form-group-sm select[multiple].form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}textarea.input-lg,select[multiple].input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg textarea.form-control,.form-group-lg select[multiple].form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.input-lg+.form-control-feedback,.input-group-lg+.form-control-feedback,.form-group-lg .form-control+.form-control-feedback{width:46px;height:46px;line-height:46px}.input-sm+.form-control-feedback,.input-group-sm+.form-control-feedback,.form-group-sm .form-control+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .help-block,.has-success .control-label,.has-success .radio,.has-success .checkbox,.has-success .radio-inline,.has-success .checkbox-inline,.has-success.radio label,.has-success.checkbox label,.has-success.radio-inline label,.has-success.checkbox-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;border-color:#3c763d;background-color:#dff0d8}.has-success .form-control-feedback{color:#3c763d}.has-warning .help-block,.has-warning .control-label,.has-warning .radio,.has-warning .checkbox,.has-warning .radio-inline,.has-warning .checkbox-inline,.has-warning.radio label,.has-warning.checkbox label,.has-warning.radio-inline label,.has-warning.checkbox-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;border-color:#8a6d3b;background-color:#fcf8e3}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .help-block,.has-error .control-label,.has-error .radio,.has-error .checkbox,.has-error .radio-inline,.has-error .checkbox-inline,.has-error.radio label,.has-error.checkbox label,.has-error.radio-inline label,.has-error.checkbox-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;border-color:#a94442;background-color:#f2dede}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn,.form-inline .input-group .form-control{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .radio,.form-inline .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .radio label,.form-inline .checkbox label{padding-left:0}.form-inline .radio input[type=\"radio\"],.form-inline .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .radio,.form-horizontal .checkbox,.form-horizontal .radio-inline,.form-horizontal .checkbox-inline{margin-top:0;margin-bottom:0;padding-top:7px}.form-horizontal .radio,.form-horizontal .checkbox{min-height:27px}.form-horizontal .form-group{margin-left:-15px;margin-right:-15px}@media (min-width:768px){.form-horizontal .control-label{text-align:right;margin-bottom:0;padding-top:7px}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn:focus,.btn:active:focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn.active.focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn:hover,.btn:focus,.btn.focus{color:#97cc00;text-decoration:none}.btn:active,.btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#97cc00;background-color:#fff;border-color:#ccc}.btn-default:focus,.btn-default.focus{color:#97cc00;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#97cc00;background-color:#e6e6e6;border-color:#adadad}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{color:#97cc00;background-color:#e6e6e6;border-color:#adadad}.btn-default:active:hover,.btn-default.active:hover,.open>.dropdown-toggle.btn-default:hover,.btn-default:active:focus,.btn-default.active:focus,.open>.dropdown-toggle.btn-default:focus,.btn-default:active.focus,.btn-default.active.focus,.open>.dropdown-toggle.btn-default.focus{color:#97cc00;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled:hover,.btn-default[disabled]:hover,fieldset[disabled] .btn-default:hover,.btn-default.disabled:focus,.btn-default[disabled]:focus,fieldset[disabled] .btn-default:focus,.btn-default.disabled.focus,.btn-default[disabled].focus,fieldset[disabled] .btn-default.focus{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#97cc00}.btn-primary{color:#fff;background-color:#090;border-color:#008000}.btn-primary:focus,.btn-primary.focus{color:#fff;background-color:#060;border-color:#000}.btn-primary:hover{color:#fff;background-color:#060;border-color:#004200}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#060;border-color:#004200}.btn-primary:active:hover,.btn-primary.active:hover,.open>.dropdown-toggle.btn-primary:hover,.btn-primary:active:focus,.btn-primary.active:focus,.open>.dropdown-toggle.btn-primary:focus,.btn-primary:active.focus,.btn-primary.active.focus,.open>.dropdown-toggle.btn-primary.focus{color:#fff;background-color:#004200;border-color:#000}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled:hover,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary:hover,.btn-primary.disabled:focus,.btn-primary[disabled]:focus,fieldset[disabled] .btn-primary:focus,.btn-primary.disabled.focus,.btn-primary[disabled].focus,fieldset[disabled] .btn-primary.focus{background-color:#090;border-color:#008000}.btn-primary .badge{color:#090;background-color:#fff}.btn-success{color:#fff;background-color:#090;border-color:#008000}.btn-success:focus,.btn-success.focus{color:#fff;background-color:#060;border-color:#000}.btn-success:hover{color:#fff;background-color:#060;border-color:#004200}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#060;border-color:#004200}.btn-success:active:hover,.btn-success.active:hover,.open>.dropdown-toggle.btn-success:hover,.btn-success:active:focus,.btn-success.active:focus,.open>.dropdown-toggle.btn-success:focus,.btn-success:active.focus,.btn-success.active.focus,.open>.dropdown-toggle.btn-success.focus{color:#fff;background-color:#004200;border-color:#000}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled:hover,.btn-success[disabled]:hover,fieldset[disabled] .btn-success:hover,.btn-success.disabled:focus,.btn-success[disabled]:focus,fieldset[disabled] .btn-success:focus,.btn-success.disabled.focus,.btn-success[disabled].focus,fieldset[disabled] .btn-success.focus{background-color:#090;border-color:#008000}.btn-success .badge{color:#090;background-color:#fff}.btn-info{color:#fff;background-color:#090;border-color:#008000}.btn-info:focus,.btn-info.focus{color:#fff;background-color:#060;border-color:#000}.btn-info:hover{color:#fff;background-color:#060;border-color:#004200}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#060;border-color:#004200}.btn-info:active:hover,.btn-info.active:hover,.open>.dropdown-toggle.btn-info:hover,.btn-info:active:focus,.btn-info.active:focus,.open>.dropdown-toggle.btn-info:focus,.btn-info:active.focus,.btn-info.active.focus,.open>.dropdown-toggle.btn-info.focus{color:#fff;background-color:#004200;border-color:#000}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled:hover,.btn-info[disabled]:hover,fieldset[disabled] .btn-info:hover,.btn-info.disabled:focus,.btn-info[disabled]:focus,fieldset[disabled] .btn-info:focus,.btn-info.disabled.focus,.btn-info[disabled].focus,fieldset[disabled] .btn-info.focus{background-color:#090;border-color:#008000}.btn-info .badge{color:#090;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning:focus,.btn-warning.focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active:hover,.btn-warning.active:hover,.open>.dropdown-toggle.btn-warning:hover,.btn-warning:active:focus,.btn-warning.active:focus,.open>.dropdown-toggle.btn-warning:focus,.btn-warning:active.focus,.btn-warning.active.focus,.open>.dropdown-toggle.btn-warning.focus{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled:hover,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning:hover,.btn-warning.disabled:focus,.btn-warning[disabled]:focus,fieldset[disabled] .btn-warning:focus,.btn-warning.disabled.focus,.btn-warning[disabled].focus,fieldset[disabled] .btn-warning.focus{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger:focus,.btn-danger.focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active:hover,.btn-danger.active:hover,.open>.dropdown-toggle.btn-danger:hover,.btn-danger:active:focus,.btn-danger.active:focus,.open>.dropdown-toggle.btn-danger:focus,.btn-danger:active.focus,.btn-danger.active.focus,.open>.dropdown-toggle.btn-danger.focus{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled:hover,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger:hover,.btn-danger.disabled:focus,.btn-danger[disabled]:focus,fieldset[disabled] .btn-danger:focus,.btn-danger.disabled.focus,.btn-danger[disabled].focus,fieldset[disabled] .btn-danger.focus{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{color:#97cc00;font-weight:normal;border-radius:0}.btn-link,.btn-link:active,.btn-link.active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:hover,.btn-link:focus,.btn-link:active{border-color:transparent}.btn-link:hover,.btn-link:focus{color:#5e8000;text-decoration:underline;background-color:transparent}.btn-link[disabled]:hover,fieldset[disabled] .btn-link:hover,.btn-link[disabled]:focus,fieldset[disabled] .btn-link:focus{color:#777;text-decoration:none}.btn-lg,.btn-group-lg>.btn{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-sm,.btn-group-sm>.btn{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-xs,.btn-group-xs>.btn{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=\"submit\"].btn-block,input[type=\"reset\"].btn-block,input[type=\"button\"].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-property:height, visibility;-o-transition-property:height, visibility;transition-property:height, visibility;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid \\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropup,.dropdown{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;font-size:14px;text-align:left;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.15);border-radius:0;-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.175);box-shadow:0 6px 12px rgba(0,0,0,0.175);-webkit-background-clip:padding-box;background-clip:padding-box}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:hover,.dropdown-menu>li>a:focus{text-decoration:none;color:#262626;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:hover,.dropdown-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#090}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{color:#777}.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:not-allowed}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{left:auto;right:0}.dropdown-menu-left{left:0;right:auto}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;left:0;right:0;bottom:0;top:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{border-top:0;border-bottom:4px dashed;border-bottom:4px solid \\9;content:\"\"}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{left:auto;right:0}.navbar-right .dropdown-menu-left{left:0;right:auto}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group>.btn,.btn-group-vertical>.btn{position:relative;float:left}.btn-group>.btn:hover,.btn-group-vertical>.btn:hover,.btn-group>.btn:focus,.btn-group-vertical>.btn:focus,.btn-group>.btn:active,.btn-group-vertical>.btn:active,.btn-group>.btn.active,.btn-group-vertical>.btn.active{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-bottom-left-radius:0;border-top-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-left:8px;padding-right:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-left:12px;padding-right:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-right-radius:0;border-top-left-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{float:none;display:table-cell;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=\"buttons\"]>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn input[type=\"checkbox\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"checkbox\"]{position:absolute;clip:rect(0, 0, 0, 0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=\"col-\"]{float:none;padding-left:0;padding-right:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn,select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn,select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn{height:auto}.input-group-addon,.input-group-btn,.input-group .form-control{display:table-cell}.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child),.input-group .form-control:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:normal;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:0}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=\"radio\"],.input-group-addon input[type=\"checkbox\"]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group-btn:last-child>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-top-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:first-child>.btn-group:not(:first-child)>.btn{border-bottom-left-radius:0;border-top-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:hover,.input-group-btn>.btn:focus,.input-group-btn>.btn:active{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{margin-bottom:0;padding-left:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:hover,.nav>li>a:focus{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#777;text-decoration:none;background-color:transparent;cursor:not-allowed}.nav .open>a,.nav .open>a:hover,.nav .open>a:focus{background-color:#eee;border-color:#97cc00}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:0 0 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#555;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent;cursor:default}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:0 0 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:0}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:hover,.nav-pills>li.active>a:focus{color:#fff;background-color:#090}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:0 0 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-right-radius:0;border-top-left-radius:0}.navbar{position:relative;min-height:45px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:0}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{overflow-x:visible;padding-right:15px;padding-left:15px;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);-webkit-overflow-scrolling:touch}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block !important;height:auto !important;padding-bottom:0;overflow:visible !important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{padding-left:0;padding-right:0}}.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:200px}}.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-top,.navbar-fixed-bottom{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-top,.navbar-fixed-bottom{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;padding:12.5px 15px;font-size:18px;line-height:20px;height:45px}.navbar-brand:hover,.navbar-brand:focus{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;margin-right:15px;padding:9px 10px;margin-top:5.5px;margin-bottom:5.5px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:0}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:6.25px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu>li>a,.navbar-nav .open .dropdown-menu .dropdown-header{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:hover,.navbar-nav .open .dropdown-menu>li>a:focus{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:12.5px;padding-bottom:12.5px}}.navbar-form{margin-left:-15px;margin-right:-15px;padding:10px 15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);margin-top:5.5px;margin-bottom:5.5px}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn,.navbar-form .input-group .form-control{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .radio,.navbar-form .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .radio label,.navbar-form .checkbox label{padding-left:0}.navbar-form .radio input[type=\"radio\"],.navbar-form .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;border:0;margin-left:0;margin-right:0;padding-top:0;padding-bottom:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-right-radius:0;border-top-left-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:5.5px;margin-bottom:5.5px}.navbar-btn.btn-sm{margin-top:7.5px;margin-bottom:7.5px}.navbar-btn.btn-xs{margin-top:11.5px;margin-bottom:11.5px}.navbar-text{margin-top:12.5px;margin-bottom:12.5px}@media (min-width:768px){.navbar-text{float:left;margin-left:15px;margin-right:15px}}@media (min-width:768px){.navbar-left{float:left !important}.navbar-right{float:right !important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#090;border-color:#007800}.navbar-default .navbar-brand{color:#fff}.navbar-default .navbar-brand:hover,.navbar-default .navbar-brand:focus{color:#e6e6e6;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#fff}.navbar-default .navbar-nav>li>a:hover,.navbar-default .navbar-nav>li>a:focus{color:#fff;background-color:#067d00}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:hover,.navbar-default .navbar-nav>.active>a:focus{color:#fff;background-color:#067d00}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:hover,.navbar-default .navbar-nav>.disabled>a:focus{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#007800}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:hover,.navbar-default .navbar-nav>.open>a:focus{background-color:#067d00;color:#fff}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#fff}.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:#067d00}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#067d00}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#fff}.navbar-default .navbar-link:hover{color:#fff}.navbar-default .btn-link{color:#fff}.navbar-default .btn-link:hover,.navbar-default .btn-link:focus{color:#fff}.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:hover,.navbar-default .btn-link[disabled]:focus,fieldset[disabled] .navbar-default .btn-link:focus{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-brand:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:hover,.navbar-inverse .navbar-nav>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:hover,.navbar-inverse .navbar-nav>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:hover,.navbar-inverse .navbar-nav>.disabled>a:focus{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:hover,.navbar-inverse .navbar-toggle:focus{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:hover,.navbar-inverse .navbar-nav>.open>a:focus{background-color:#080808;color:#fff}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:hover,.navbar-inverse .btn-link:focus{color:#fff}.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:hover,.navbar-inverse .btn-link[disabled]:focus,fieldset[disabled] .navbar-inverse .btn-link:focus{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:0}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{content:\"/\\00a0\";padding:0 5px;color:#ccc}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:0}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;line-height:1.42857143;text-decoration:none;color:#97cc00;background-color:#fff;border:1px solid #ddd;margin-left:-1px}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-bottom-left-radius:0;border-top-left-radius:0}.pagination>li:last-child>a,.pagination>li:last-child>span{border-bottom-right-radius:0;border-top-right-radius:0}.pagination>li>a:hover,.pagination>li>span:hover,.pagination>li>a:focus,.pagination>li>span:focus{z-index:2;color:#5e8000;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{z-index:3;color:#fff;background-color:#090;border-color:#090;cursor:default}.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus{color:#777;background-color:#fff;border-color:#ddd;cursor:not-allowed}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-bottom-left-radius:6px;border-top-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-bottom-right-radius:6px;border-top-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-bottom-left-radius:3px;border-top-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-bottom-right-radius:3px;border-top-right-radius:3px}.pager{padding-left:0;margin:20px 0;list-style:none;text-align:center}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:hover,.pager li>a:focus{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:hover,.pager .disabled>a:focus,.pager .disabled>span{color:#777;background-color:#fff;cursor:not-allowed}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:bold;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:hover,a.label:focus{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:hover,.label-default[href]:focus{background-color:#5e5e5e}.label-primary{background-color:#090}.label-primary[href]:hover,.label-primary[href]:focus{background-color:#060}.label-success{background-color:#090}.label-success[href]:hover,.label-success[href]:focus{background-color:#060}.label-info{background-color:#090}.label-info[href]:hover,.label-info[href]:focus{background-color:#060}.label-warning{background-color:#f0ad4e}.label-warning[href]:hover,.label-warning[href]:focus{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:hover,.label-danger[href]:focus{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:bold;color:#fff;line-height:1;vertical-align:middle;white-space:nowrap;text-align:center;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-xs .badge,.btn-group-xs>.btn .badge{top:0;padding:1px 5px}a.badge:hover,a.badge:focus{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#97cc00;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron h1,.jumbotron .h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{border-radius:6px;padding-left:15px;padding-right:15px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-left:60px;padding-right:60px}.jumbotron h1,.jumbotron .h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:0;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail>img,.thumbnail a>img{margin-left:auto;margin-right:auto}a.thumbnail:hover,a.thumbnail:focus,a.thumbnail.active{border-color:#97cc00}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:0}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:bold}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{background-color:#dff0d8;border-color:#d6e9c6;color:#3c763d}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{background-color:#d9edf7;border-color:#bce8f1;color:#31708f}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{background-color:#fcf8e3;border-color:#faebcc;color:#8a6d3b}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{background-color:#f2dede;border-color:#ebccd1;color:#a94442}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{overflow:hidden;height:20px;margin-bottom:20px;background-color:#f5f5f5;border-radius:0;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.progress-bar{float:left;width:0%;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#090;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-striped .progress-bar,.progress-bar-striped{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#090}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-info{background-color:#090}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{zoom:1;overflow:hidden}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-left,.media-right,.media-body{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{margin-bottom:20px;padding-left:0}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-right-radius:0;border-top-left-radius:0}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:hover,button.list-group-item:hover,a.list-group-item:focus,button.list-group-item:focus{text-decoration:none;color:#555;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:hover,.list-group-item.disabled:focus{background-color:#eee;color:#777;cursor:not-allowed}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:hover,.list-group-item.active:focus{z-index:2;color:#fff;background-color:#090;border-color:#090}.list-group-item.active .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>.small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:hover .list-group-item-text,.list-group-item.active:focus .list-group-item-text{color:#6f6}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:hover,button.list-group-item-success:hover,a.list-group-item-success:focus,button.list-group-item-success:focus{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,button.list-group-item-success.active,a.list-group-item-success.active:hover,button.list-group-item-success.active:hover,a.list-group-item-success.active:focus,button.list-group-item-success.active:focus{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:hover,button.list-group-item-info:hover,a.list-group-item-info:focus,button.list-group-item-info:focus{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,button.list-group-item-info.active,a.list-group-item-info.active:hover,button.list-group-item-info.active:hover,a.list-group-item-info.active:focus,button.list-group-item-info.active:focus{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:hover,button.list-group-item-warning:hover,a.list-group-item-warning:focus,button.list-group-item-warning:focus{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,button.list-group-item-warning.active,a.list-group-item-warning.active:hover,button.list-group-item-warning.active:hover,a.list-group-item-warning.active:focus,button.list-group-item-warning.active:focus{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:hover,button.list-group-item-danger:hover,a.list-group-item-danger:focus,button.list-group-item-danger:focus{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,button.list-group-item-danger.active,a.list-group-item-danger.active:hover,button.list-group-item-danger.active:hover,a.list-group-item-danger.active:focus,button.list-group-item-danger.active:focus{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:0;-webkit-box-shadow:0 1px 1px rgba(0,0,0,0.05);box-shadow:0 1px 1px rgba(0,0,0,0.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-right-radius:-1px;border-top-left-radius:-1px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>a,.panel-title>small,.panel-title>.small,.panel-title>small>a,.panel-title>.small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-right-radius:-1px;border-top-left-radius:-1px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-right-radius:0;border-top-left-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.table,.panel>.table-responsive>.table,.panel>.panel-collapse>.table{margin-bottom:0}.panel>.table caption,.panel>.table-responsive>.table caption,.panel>.panel-collapse>.table caption{padding-left:15px;padding-right:15px}.panel>.table:first-child,.panel>.table-responsive:first-child>.table:first-child{border-top-right-radius:-1px;border-top-left-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child{border-top-left-radius:-1px;border-top-right-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child{border-top-left-radius:-1px}.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child{border-top-right-radius:-1px}.panel>.table:last-child,.panel>.table-responsive:last-child>.table:last-child{border-bottom-right-radius:-1px;border-bottom-left-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-left-radius:-1px;border-bottom-right-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:-1px}.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:-1px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child th,.panel>.table>tbody:first-child>tr:first-child td{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{border:0;margin-bottom:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:0}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.panel-body,.panel-group .panel-heading+.panel-collapse>.list-group{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#ddd}.panel-primary>.panel-heading{color:#fff;background-color:#090;border-color:#ddd}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-primary>.panel-heading .badge{color:#090;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive iframe,.embed-responsive embed,.embed-responsive object,.embed-responsive video{position:absolute;top:0;left:0;bottom:0;height:100%;width:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.05);box-shadow:inset 0 1px 1px rgba(0,0,0,0.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,0.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:bold;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;filter:alpha(opacity=20)}.close:hover,.close:focus{color:#000;text-decoration:none;cursor:pointer;opacity:.5;filter:alpha(opacity=50)}button.close{padding:0;cursor:pointer;background:transparent;border:0;-webkit-appearance:none}.modal-open{overflow:hidden}.modal{display:none;overflow:hidden;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transform:translate(0, -25%);-ms-transform:translate(0, -25%);-o-transform:translate(0, -25%);transform:translate(0, -25%);-webkit-transition:-webkit-transform 0.3s ease-out;-o-transition:-o-transform 0.3s ease-out;transition:transform 0.3s ease-out}.modal.in .modal-dialog{-webkit-transform:translate(0, 0);-ms-transform:translate(0, 0);-o-transform:translate(0, 0);transform:translate(0, 0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,0.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,0.5);box-shadow:0 3px 9px rgba(0,0,0,0.5);-webkit-background-clip:padding-box;background-clip:padding-box;outline:0}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{opacity:0;filter:alpha(opacity=0)}.modal-backdrop.in{opacity:.5;filter:alpha(opacity=50)}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-left:5px;margin-bottom:0}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,0.5);box-shadow:0 5px 15px rgba(0,0,0,0.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:Arial,Helvetica,sans-serif;font-style:normal;font-weight:normal;letter-spacing:normal;line-break:auto;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;white-space:normal;word-break:normal;word-spacing:normal;word-wrap:normal;font-size:12px;opacity:0;filter:alpha(opacity=0)}.tooltip.in{opacity:.9;filter:alpha(opacity=90)}.tooltip.top{margin-top:-3px;padding:5px 0}.tooltip.right{margin-left:3px;padding:0 5px}.tooltip.bottom{margin-top:3px;padding:5px 0}.tooltip.left{margin-left:-3px;padding:0 5px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:0}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{bottom:0;right:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.clearfix:before,.clearfix:after,.dl-horizontal dd:before,.dl-horizontal dd:after,.container:before,.container:after,.container-fluid:before,.container-fluid:after,.row:before,.row:after,.form-horizontal .form-group:before,.form-horizontal .form-group:after,.btn-toolbar:before,.btn-toolbar:after,.btn-group-vertical>.btn-group:before,.btn-group-vertical>.btn-group:after,.nav:before,.nav:after,.navbar:before,.navbar:after,.navbar-header:before,.navbar-header:after,.navbar-collapse:before,.navbar-collapse:after,.pager:before,.pager:after,.panel-body:before,.panel-body:after,.modal-header:before,.modal-header:after,.modal-footer:before,.modal-footer:after{content:\" \";display:table}.clearfix:after,.dl-horizontal dd:after,.container:after,.container-fluid:after,.row:after,.form-horizontal .form-group:after,.btn-toolbar:after,.btn-group-vertical>.btn-group:after,.nav:after,.navbar:after,.navbar-header:after,.navbar-collapse:after,.pager:after,.panel-body:after,.modal-header:after,.modal-footer:after{clear:both}.center-block{display:block;margin-left:auto;margin-right:auto}.pull-right{float:right !important}.pull-left{float:left !important}.hide{display:none !important}.show{display:block !important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none !important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-xs,.visible-sm,.visible-md,.visible-lg{display:none !important}.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block{display:none !important}@media (max-width:767px){.visible-xs{display:block !important}table.visible-xs{display:table !important}tr.visible-xs{display:table-row !important}th.visible-xs,td.visible-xs{display:table-cell !important}}@media (max-width:767px){.visible-xs-block{display:block !important}}@media (max-width:767px){.visible-xs-inline{display:inline !important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block !important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block !important}table.visible-sm{display:table !important}tr.visible-sm{display:table-row !important}th.visible-sm,td.visible-sm{display:table-cell !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline !important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block !important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block !important}table.visible-md{display:table !important}tr.visible-md{display:table-row !important}th.visible-md,td.visible-md{display:table-cell !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline !important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block !important}}@media (min-width:1200px){.visible-lg{display:block !important}table.visible-lg{display:table !important}tr.visible-lg{display:table-row !important}th.visible-lg,td.visible-lg{display:table-cell !important}}@media (min-width:1200px){.visible-lg-block{display:block !important}}@media (min-width:1200px){.visible-lg-inline{display:inline !important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block !important}}@media (max-width:767px){.hidden-xs{display:none !important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none !important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none !important}}@media (min-width:1200px){.hidden-lg{display:none !important}}.visible-print{display:none !important}@media print{.visible-print{display:block !important}table.visible-print{display:table !important}tr.visible-print{display:table-row !important}th.visible-print,td.visible-print{display:table-cell !important}}.visible-print-block{display:none !important}@media print{.visible-print-block{display:block !important}}.visible-print-inline{display:none !important}@media print{.visible-print-inline{display:inline !important}}.visible-print-inline-block{display:none !important}@media print{.visible-print-inline-block{display:inline-block !important}}@media print{.hidden-print{display:none !important}}"; });
define('text!dialog-demo/add-user-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n    <require from=\"../views/widgets/inputs/form-filter-text\"></require>\r\n    <require from=\"../views/widgets/inputs/form-filter-role\"></require>\r\n    <require from=\"../resources/format/format-date\"></require>\r\n    <!--<require from=\"../views/widgets/user-list\"></require>-->\r\n\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            <div class=\"row margin-bottom-g1\">\r\n                <div class=\"col-xs-6\">\r\n                    <form-filter-text model.two-way=\"filters[0].value\"></form-filter-text>\r\n                </div>\r\n\r\n                <div class=\"col-xs-6\">\r\n                    <form-filter-role model.two-way=\"filters[1].value\" options.bind=\"lkp_role\" changed.two-way=\"filters[1].value\"\r\n                        init-selected.two-way=\"filters[1].value\"></form-filter-role>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"wrap_table-add-user-from-list\">\r\n                <table class=\"table table-striped table-hover\" aurelia-table=\"data.bind: users; display-data.bind: $displayData; filters.bind: filters;\">\r\n                    <thead>\r\n                        <tr>\r\n                            <th aut-sort=\"key: id; default: desc\">ID</th>\r\n                            <th aut-sort=\"key: firstName\">First Name</th>\r\n                            <th aut-sort=\"key: lastName\">Last Name</th>\r\n                            <th aut-sort=\"key: systemRoles.value\">Role</th>\r\n                            <th aut-sort=\"key: profile_viewed\">Profile Viewed</th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr repeat.for=\"user of $displayData\" click.delegate=\"selectUserToAdd(user)\">\r\n                            <td>${user.id}</td>\r\n                            <td>${user.firstName}</td>\r\n                            <td>${user.lastName}</td>\r\n                            <td>${ user.systemRoles.name }</td>\r\n                            <td>${ user.profile_viewed | formatDate }</td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n            \r\n            <div if.bind=\"selectedId\" class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <button type=\"button\" class=\"close\" aria-label=\"Close\" click.delegate=\"deselectUser()\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                    <strong>Selected:</strong> ${userRole.firstName} ${userRole.lastName} ( ${userRole.id} )    \r\n                </div>\r\n                <div class=\"panel-body\">\r\n                    <table class=\"table border-none half-n-half margin-bottom-0\">\r\n                        <tbody>\r\n                        <tr>\r\n                            <td>\r\n                                <form-checkbox inp-name=\"userRole_isMember\"\r\n                                    inp-label=\"MRT Member\"                            \r\n                                    model.two-way=\"userRole.isMember\"\r\n                                    init-selected.two-way=\"userRole.isMember\"\r\n                                    input-only=\"true\"></form-checkbox>\r\n                            </td>\r\n                            <td class=\"xxx_wrap-role\">\r\n                                <!--<form-select prop-arr.bind=\"['value','name']\" name=\"userRole_system_role\" input-only=\"true\" model.two-way=\"userRole.systemRoles.value\" options.bind=\"lkp_role\"\r\n                                    changed.two-way=\"userRole.systemRoles.value\" init-selected.two-way=\"userRole.systemRoles.value\"></form-select>-->\r\n\r\n                                <form-filter-role model.two-way=\"userRole.systemRoles.value\" options.bind=\"lkp_role\" changed.two-way=\"userRole.systemRoles.value\"\r\n                                    init-selected.two-way=\"userRole.systemRoles.value\"></form-filter-role>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n            \r\n            \r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>            \r\n            <button disabled.bind=\"!selectedId\" class=\"btn ${selectedId ? 'btn-primary' : 'btn-default'}\" click.trigger=\"yes()\">Add</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!css/main.css', ['module'], function(module) { module.exports = "/* main.scss */\r\n/* all changes are sent to 'main.css' */\r\n/*\r\nCIS CRS Sass Theme\r\nAuthor: Alex Mackenzie\r\nVersion: 0.0.1\r\n*/\r\n@import url(bootstrap.min.css);\r\n/* BASE - base styles, variables, mixins etc */\r\n/* http://meyerweb.com/eric/tools/css/reset/ \r\n   v2.0 | 20110126\r\n   License: none (public domain)\r\n*/\r\n/* line 6, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\nhtml, body, div, span, applet, object, iframe,\r\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\r\na, abbr, acronym, address, big, cite, code,\r\ndel, dfn, em, img, ins, kbd, q, s, samp,\r\nsmall, strike, strong, sub, sup, tt, var,\r\nb, u, i, center,\r\ndl, dt, dd, ol, ul, li,\r\nfieldset, form, label, legend,\r\ntable, caption, tbody, tfoot, thead, tr, th, td,\r\narticle, aside, canvas, details, embed,\r\nfigure, figcaption, footer, header, hgroup,\r\nmenu, nav, output, ruby, section, summary,\r\ntime, mark, audio, video {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  font-size: 100%;\r\n  font: inherit;\r\n  vertical-align: baseline;\r\n}\r\n\r\n/* HTML5 display-role reset for older browsers */\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\narticle, aside, details, figcaption, figure,\r\nfooter, header, hgroup, menu, nav, section {\r\n  display: block;\r\n}\r\n\r\n/* line 31, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\nbody {\r\n  line-height: 1;\r\n}\r\n\r\n/* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\nol, ul {\r\n  list-style: none;\r\n}\r\n\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\nblockquote, q {\r\n  quotes: none;\r\n}\r\n\r\n/* line 40, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\nblockquote:before, blockquote:after,\r\nq:before, q:after {\r\n  content: '';\r\n  content: none;\r\n}\r\n\r\n/* line 45, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base-reset.scss */\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n\r\n/* _variables.scss */\r\n/* BP Info colors */\r\n/* General Colors */\r\n/* status (span) color */\r\n/* font size and colors */\r\n/* hyperlink */\r\n/* status (background) color */\r\n/* debriefable - realised? */\r\n/* offset: margins & paddings */\r\n/* _mixins.scss */\r\n/* _normalize.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_normalize.scss */\r\nh1, h2, h3, h4, h5 {\r\n  margin-top: 0;\r\n}\r\n\r\n/* _base.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nhtml,\r\nbody {\r\n  margin: 0;\r\n  padding: 0;\r\n  height: 100%;\r\n  background: white;\r\n}\r\n\r\n/* line 12, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nheader .logo-wrap {\r\n  padding: 10px;\r\n}\r\n\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nheader .logo-wrap img {\r\n  float: left;\r\n  display: inline-block;\r\n}\r\n\r\n/* line 20, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nheader .logo-wrap span {\r\n  display: inline-block;\r\n  color: #009900;\r\n  font-weight: bold;\r\n  font-size: 20px;\r\n  line-height: 52px;\r\n}\r\n\r\n/* line 30, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.loading-message {\r\n  display: block;\r\n  width: 100%;\r\n  color: #009900;\r\n}\r\n\r\n/* line 35, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.loading-message.sm {\r\n  text-align: left;\r\n  padding: 10px;\r\n}\r\n\r\n/* line 39, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.loading-message.sm span {\r\n  display: inline-block;\r\n  margin-left: 5px;\r\n}\r\n\r\n/* line 45, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.loading-message.lg {\r\n  text-align: center;\r\n  padding: 50px 0;\r\n}\r\n\r\n/* line 49, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.loading-message.lg span {\r\n  display: block;\r\n  margin: 10px auto;\r\n}\r\n\r\n/* line 56, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nbody {\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 13px;\r\n  line-height: 1.4em;\r\n  background: #FFFFFF;\r\n  color: #303030;\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* line 65, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nbody > div.canvas {\r\n  min-height: 100%;\r\n  position: relative;\r\n}\r\n\r\n/* line 69, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nbody > div.canvas main {\r\n  padding-bottom: 100px;\r\n}\r\n\r\n/* line 73, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nbody > div.canvas footer {\r\n  position: absolute;\r\n  bottom: 0;\r\n  width: 100%;\r\n  height: 80px;\r\n}\r\n\r\n/* line 82, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.print-only {\r\n  display: none;\r\n}\r\n\r\n/* line 86, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumb {\r\n  background: #fff;\r\n  margin-bottom: 0;\r\n}\r\n\r\n/* line 91, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\na {\r\n  color: #009900;\r\n  outline: 0;\r\n}\r\n\r\n/* line 96, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\na:hover {\r\n  color: #067d00;\r\n  text-decoration: underline;\r\n  cursor: pointer;\r\n}\r\n\r\n/* line 102, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\na:focus, a:active {\r\n  color: #999999;\r\n  outline: none;\r\n}\r\n\r\n/* line 107, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n*[ng-click], *[onclick],\r\n.cursor-pointer {\r\n  outline: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n/* line 113, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\nul, li {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n\r\n/* line 119, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\ninput, textarea, button {\r\n  -webkit-border-radius: 4px;\r\n  -moz-border-radius: 4px;\r\n  border-radius: 4px;\r\n}\r\n\r\n/* line 123, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.span-no-data-available {\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 127, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.span-info {\r\n  color: #239F40;\r\n}\r\n\r\n/* line 131, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.span-good {\r\n  color: #239F40;\r\n}\r\n\r\n/* line 135, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.span-date {\r\n  color: #999999;\r\n  font-style: italic;\r\n}\r\n\r\n/* line 140, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-danger,\r\n.span-error {\r\n  color: #f00;\r\n}\r\n\r\n/* line 145, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.span-warning {\r\n  color: #f90;\r\n}\r\n\r\n/* line 149, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-obsolete {\r\n  color: #999999;\r\n}\r\n\r\n/* line 153, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap {\r\n  display: block;\r\n}\r\n\r\n/* line 156, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul {\r\n  display: block;\r\n  list-style: none;\r\n}\r\n\r\n/* line 160, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li {\r\n  display: inline;\r\n  list-style: none;\r\n}\r\n\r\n/* line 164, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li.home a,\r\n.breadcrumbWrap ul li .ng-binding {\r\n  padding: 10px;\r\n  display: inline-block;\r\n}\r\n\r\n/* line 170, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li:before {\r\n  content: '/';\r\n}\r\n\r\n/* line 174, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li:first-child:before {\r\n  content: '';\r\n}\r\n\r\n/* line 178, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li:first-child a,\r\n.breadcrumbWrap ul li:first-child span {\r\n  padding-left: 0;\r\n}\r\n\r\n/* line 183, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.breadcrumbWrap ul li:last-child a,\r\n.breadcrumbWrap ul li:last-child span {\r\n  color: #2d2d2d;\r\n}\r\n\r\n/* line 191, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.faintOpacity {\r\n  filter: alpha(opacity=30);\r\n  opacity: 0.30;\r\n}\r\n\r\n/* line 195, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.semiOpacity {\r\n  filter: alpha(opacity=50);\r\n  opacity: 0.5;\r\n}\r\n\r\n/* line 199, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.fullOpacity {\r\n  filter: alpha(opacity=100);\r\n  opacity: 1.0;\r\n}\r\n\r\n/* line 203, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.display-block {\r\n  display: block !important;\r\n}\r\n\r\n/* line 207, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.display-inline-block {\r\n  display: inline-block !important;\r\n}\r\n\r\n/* line 211, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.display-none {\r\n  display: none !important;\r\n}\r\n\r\n/* line 215, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.display-block-clear {\r\n  display: block !important;\r\n  clear: both;\r\n}\r\n\r\n/* line 220, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-good {\r\n  color: #a6cf41;\r\n}\r\n\r\n/* line 224, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-good-bg {\r\n  background: #a6cf41;\r\n}\r\n\r\n/* line 228, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-priority {\r\n  color: #eb9316;\r\n}\r\n\r\n/* line 232, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.color-pending,\r\n.color-warning {\r\n  color: #f90;\r\n}\r\n\r\n/* lbl tests */\r\n/* line 238, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.flagMe {\r\n  padding: 0px 10px;\r\n  letter-spacing: 2px;\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 244, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.emptyString {\r\n  border: 2px solid red;\r\n  background: #ff9;\r\n  color: red;\r\n}\r\n\r\n/* line 250, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-danger {\r\n  background: #f00;\r\n  color: white;\r\n}\r\n\r\n/* line 255, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.warningBG {\r\n  background: #f90;\r\n  color: white;\r\n}\r\n\r\n/* line 260, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.lightwarningBG {\r\n  background: #FFC926;\r\n}\r\n\r\n/* line 264, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-white {\r\n  background: white;\r\n}\r\n\r\n/* line 268, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-white-xxx {\r\n  background: white;\r\n}\r\n\r\n/* line 272, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.goodBG,\r\n.bg-good {\r\n  background: #a6cf41;\r\n}\r\n\r\n/* line 277, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.errorBG,\r\n.bg-error {\r\n  background: #f00;\r\n}\r\n\r\n/* line 282, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-good-light {\r\n  background: #dff0d8;\r\n}\r\n\r\n/* line 286, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-info {\r\n  background: #d9edf7;\r\n}\r\n\r\n/* line 290, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-info-strong {\r\n  background: #5bc0de;\r\n}\r\n\r\n/* line 294, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-take-action {\r\n  background: #FFCD04;\r\n}\r\n\r\n/* line 298, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-lightgray {\r\n  background: #f9f9f9;\r\n}\r\n\r\n/* line 302, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.labelBG {\r\n  background: blue;\r\n  color: white;\r\n}\r\n\r\n/* line 307, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.stringGood {\r\n  background: #5cb85c;\r\n  color: white;\r\n}\r\n\r\n/* line 312, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-changed,\r\n.bg-provisional {\r\n  background: #FDF3E4;\r\n}\r\n\r\n/* line 317, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-warning {\r\n  background: #f2dede;\r\n}\r\n\r\n/* line 321, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-priority {\r\n  background: #eb9316;\r\n}\r\n\r\n/* line 325, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-loading {\r\n  display: table;\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 100px;\r\n  text-align: center;\r\n  color: #C40F11;\r\n}\r\n\r\n/* line 333, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-loading .wrap-message {\r\n  display: table-cell;\r\n  vertical-align: middle;\r\n  width: inherit;\r\n  height: 100%;\r\n}\r\n\r\n/* line 339, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-loading .wrap-message span {\r\n  font-weight: bold;\r\n  line-height: 20px;\r\n}\r\n\r\n/* line 346, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.bg-secondary-color {\r\n  background: #C40F11;\r\n  color: white;\r\n}\r\n\r\n/* line 351, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.container-page-error {\r\n  text-align: center;\r\n  padding-top: 50px;\r\n}\r\n\r\n/* line 356, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_base.scss */\r\n.vertical-align-center {\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n\r\n/* _recycled.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.cursor-hover {\r\n  cursor: pointer;\r\n}\r\n\r\n/* line 5, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.strapline {\r\n  float: left;\r\n  height: 35px;\r\n  margin: 25px;\r\n}\r\n\r\n/* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.form-control[readonly] {\r\n  background-color: transparent !important;\r\n  border-color: transparent !important;\r\n  outline: none !important;\r\n  opacity: 1;\r\n}\r\n\r\n/* line 16, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.xxx_wrap-role .input-group .input-group-addon {\r\n  background: transparent;\r\n  padding-left: 0px;\r\n  font-weight: bold;\r\n  border: 0px;\r\n}\r\n\r\n/* line 22, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.xxx_wrap-role .input-group .input-group-addon i.fa {\r\n  display: none;\r\n}\r\n\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\nai-dialog-overlay {\r\n  background: white;\r\n  filter: alpha(opacity=50) !important;\r\n  opacity: 0.5 !important;\r\n}\r\n\r\n/* line 36, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\nai-dialog > ai-dialog-footer {\r\n  padding: 15px;\r\n}\r\n\r\n/* line 43, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\ntable.table-hover tr:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n/* line 48, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\ndiv.wrap_table-add-user-from-list {\r\n  display: block;\r\n  min-height: 100px;\r\n  max-height: 250px;\r\n  overflow-y: scroll;\r\n  overflow-x: hidden;\r\n}\r\n\r\n/* line 56, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\nai-dialog {\r\n  width: 600px;\r\n}\r\n\r\n/* line 60, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\nai-dialog ai-dialog-header h2 {\r\n  margin: 0;\r\n}\r\n\r\n/* line 66, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.btn-row {\r\n  clear: both;\r\n  display: block;\r\n  width: 100%;\r\n  padding: 15px;\r\n  text-align: center;\r\n}\r\n\r\n/* line 69, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.btn-row .btn, .btn-row .str-inline-with-btns, .btn-row .pagination-controls .page-number, .pagination-controls .btn-row .page-number {\r\n  display: inline-block;\r\n}\r\n\r\n/* line 76, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.select2 {\r\n  width: 100% !important;\r\n}\r\n\r\n/* line 78, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.select2-container .select2-selection--single .select2-selection__rendered {\r\n  padding-left: 15px;\r\n  padding-right: 25px;\r\n}\r\n\r\n/* line 83, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.select2-container--default .select2-selection--single .select2-selection__clear {\r\n  padding: 0 5px;\r\n}\r\n\r\n/* line 87, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.select2-container--default .select2-selection--single {\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  -webkit-border-radius: 0px;\r\n  -moz-border-radius: 0px;\r\n  border-radius: 0px;\r\n}\r\n\r\n/* line 93, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.select2-container .select2-selection--single {\r\n  box-sizing: border-box;\r\n  cursor: pointer;\r\n  display: block;\r\n  height: 28px;\r\n  user-select: none;\r\n  -webkit-user-select: none;\r\n}\r\n\r\n/* line 103, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel.panel-xc {\r\n  margin-bottom: 2px;\r\n  border: 0px;\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n/* line 108, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel.panel-xc .panel-heading {\r\n  border-bottom: 0px;\r\n  background: #eee;\r\n}\r\n\r\n/* line 113, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel.panel-xc .panel-body {\r\n  padding-top: 0px;\r\n  padding-bottom: 0px;\r\n}\r\n\r\n/* line 117, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel.panel-xc .panel-body .wrap-fields {\r\n  padding: 15px 0 0 0;\r\n  display: block;\r\n  float: left;\r\n  width: 100%;\r\n  height: auto;\r\n}\r\n\r\n/* line 127, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.border-none {\r\n  border: 0px;\r\n}\r\n\r\n/* line 136, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel-heading {\r\n  background: #f9f9f9;\r\n  border: 0px;\r\n}\r\n\r\n/* line 145, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.repeaters {\r\n  clear: both;\r\n  display: block;\r\n  width: 100%;\r\n  height: auto;\r\n}\r\n\r\n/* line 152, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.panel-body .divider {\r\n  clear: both;\r\n  float: left;\r\n  display: block;\r\n  width: 100%;\r\n  height: 1px;\r\n  border-top: 1px dotted #ddd;\r\n  margin: 0 0 15px 0;\r\n}\r\n\r\n/* line 170, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n[ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {\r\n  display: none !important;\r\n}\r\n\r\n/* line 174, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.highlighted {\r\n  background: yellow;\r\n}\r\n\r\n/* line 178, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.hide-border-top {\r\n  border-top: none;\r\n}\r\n\r\n/* line 180, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.hide-border-top label {\r\n  display: none;\r\n}\r\n\r\n/* line 183, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.color-amber {\r\n  color: #FFA500;\r\n}\r\n\r\n/* line 187, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.color-good {\r\n  color: #1fbb1f;\r\n}\r\n\r\n/* line 191, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.color-danger {\r\n  color: #FF0000;\r\n}\r\n\r\n/* tmp */\r\n/* forms */\r\n/* line 201, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.form-group label {\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  text-transform: capitalize;\r\n}\r\n\r\n/* offsets */\r\n/* line 204, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.padding-x-0 {\r\n  padding-left: 0px !important;\r\n  padding-right: 0px !important;\r\n}\r\n\r\n/* line 205, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.margin-x-0 {\r\n  margin-left: 0px !important;\r\n  margin-right: 0px !important;\r\n}\r\n\r\n/* line 207, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.html-file-name {\r\n  margin-left: 10px;\r\n  font-size: 0.5em;\r\n  color: #aaa;\r\n}\r\n\r\n/* line 212, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.display-none {\r\n  display: none !important;\r\n}\r\n\r\n/* line 213, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.display-block {\r\n  display: block !important;\r\n}\r\n\r\n/* line 214, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.display-inline-block {\r\n  display: inline-block !important;\r\n}\r\n\r\n/* line 216, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\nsection {\r\n  margin: 0 20px;\r\n}\r\n\r\n/* line 220, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep {\r\n  float: left;\r\n}\r\n\r\n/* line 223, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-3 {\r\n  width: 25%;\r\n}\r\n\r\n/* line 226, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-4 {\r\n  width: 33.33333333%;\r\n}\r\n\r\n/* line 229, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-5 {\r\n  width: 41.66666667%;\r\n}\r\n\r\n/* line 232, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-6 {\r\n  width: 50%;\r\n}\r\n\r\n/* line 235, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-7 {\r\n  width: 58.33333333%;\r\n}\r\n\r\n/* line 238, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-8 {\r\n  width: 66.66666667%;\r\n}\r\n\r\n/* line 241, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n.col-dep-12 {\r\n  width: 100%;\r\n}\r\n\r\n@media (min-width: 1200px) {\r\n  /* line 245, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-lg-6 > .wrap-fields > * > .form-group,\r\n  .row.row-col-lg-6 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 50%;\r\n  }\r\n  /* line 251, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-lg-4 > .wrap-fields > * > .form-group,\r\n  .row.row-col-lg-4 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 50%;\r\n  }\r\n}\r\n\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  /* line 259, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-md-6 > .wrap-fields > * > .form-group,\r\n  .row.row-col-md-6 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 50%;\r\n  }\r\n}\r\n\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  /* line 268, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-sm-6 > .wrap-fields > * > .form-group,\r\n  .row.row-col-sm-6 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 50%;\r\n  }\r\n}\r\n\r\n@media (max-width: 767px) {\r\n  /* line 277, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-xs-6 > .wrap-fields > * > .form-group,\r\n  .row.row-col-xs-6 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 50%;\r\n  }\r\n}\r\n\r\n@media (min-width: 481px) and (max-width: 640px) {\r\n  /* line 285, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_recycled.scss */\r\n  .row.row-col-xxs-12 > .wrap-fields > * > .form-group,\r\n  .row.row-col-xxs-12 > .wrap-fields > * > .repeaters > .form-group {\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n/* _print-and-web.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust {\r\n  border: none;\r\n  background: #f9f9f9;\r\n  border-left: 5px solid #239F40;\r\n}\r\n\r\n/* line 8, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-page-error {\r\n  display: inline-block;\r\n  margin: 30px auto;\r\n  text-align: center;\r\n  border: none;\r\n  background: transparent;\r\n  padding: 10px 20px;\r\n  -webkit-border-radius: 10px;\r\n  -moz-border-radius: 10px;\r\n  border-radius: 10px;\r\n}\r\n\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-page-error .page-error-code {\r\n  display: block;\r\n  font-size: 80px;\r\n  margin: 0 0 10px 0;\r\n}\r\n\r\n/* line 24, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-border {\r\n  background: transparent;\r\n  border: 5px solid #f9f9f9;\r\n}\r\n\r\n/* line 29, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-warning {\r\n  background: #fcf8e3;\r\n  border-color: #FFCD04;\r\n}\r\n\r\n/* line 33, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-info {\r\n  background: #d9edf7;\r\n  border-color: #5bc0de;\r\n}\r\n\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-success {\r\n  background: #dff0d8;\r\n  border-color: #a6cf41;\r\n}\r\n\r\n/* line 41, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-error, .panel.panel-prompt-cust.panel-danger {\r\n  background: #F7C6BE;\r\n  border-color: #f00;\r\n}\r\n\r\n/* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust > p,\r\n.panel.panel-prompt-cust > .panel-heading {\r\n  padding: 20px;\r\n  border: none;\r\n  height: auto;\r\n  line-height: normal;\r\n  background-image: none;\r\n  background-repeat: unset;\r\n  background: transparent;\r\n  color: black;\r\n}\r\n\r\n/* _fixed-footer.scss */\r\n@media all and (min-width: 641px) {\r\n  /* line 6, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_fixed-footer.scss */\r\n  html,\r\n  body {\r\n    margin: 0;\r\n    padding: 0;\r\n    height: 100%;\r\n  }\r\n  /* line 12, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_fixed-footer.scss */\r\n  #container-fixed-footer {\r\n    min-height: 100%;\r\n    position: relative;\r\n  }\r\n  /* line 19, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_fixed-footer.scss */\r\n  #body {\r\n    padding-bottom: 70px;\r\n    /* Height of the footer */\r\n  }\r\n  /* line 22, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_fixed-footer.scss */\r\n  #footer {\r\n    position: absolute;\r\n    bottom: 0;\r\n    width: 100%;\r\n    min-height: 40px;\r\n    /* Height of the footer */\r\n  }\r\n}\r\n\r\n/* MODULES - individual site components */\r\n/* _tabs.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tabs.scss */\r\n#exTab1 .tab-content {\r\n  color: white;\r\n  background-color: #428bca;\r\n  padding: 5px 15px;\r\n}\r\n\r\n/* line 9, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tabs.scss */\r\n#exTab2 h3 {\r\n  color: white;\r\n  background-color: #428bca;\r\n  padding: 5px 15px;\r\n}\r\n\r\n/* remove border radius for the tab */\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tabs.scss */\r\n#exTab1 .nav-pills > li > a {\r\n  border-radius: 0;\r\n}\r\n\r\n/* change border radius for the tab , apply corners on top*/\r\n/* line 23, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tabs.scss */\r\n#exTab3 .nav-pills > li > a {\r\n  border-radius: 4px 4px 0 0;\r\n}\r\n\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tabs.scss */\r\n#exTab3 .tab-content {\r\n  color: white;\r\n  background-color: #428bca;\r\n  padding: 5px 15px;\r\n}\r\n\r\n/* _typography.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\nh1 > i,\r\nh2 > i,\r\nh3 > i,\r\nh4 > i {\r\n  margin-right: 10px;\r\n}\r\n\r\n/* line 10, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\nh1 {\r\n  font-size: 36px;\r\n  margin: 30px 0 15px 0;\r\n  color: #007f00;\r\n}\r\n\r\n/* line 11, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\nh4 {\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 13, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\ndiv.hdr-wrap {\r\n  margin-bottom: 10px;\r\n}\r\n\r\n/* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.hdr-inline {\r\n  margin: 0;\r\n  display: inline-block;\r\n}\r\n\r\n/* line 16, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\nstrong,\r\n.strong {\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 21, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.faint-small {\r\n  color: #ccc;\r\n  font-size: 0.8em;\r\n}\r\n\r\n/* line 26, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.fa.text-after {\r\n  margin-right: 5px;\r\n}\r\n\r\n/* line 30, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.no-wrap {\r\n  white-space: nowrap;\r\n}\r\n\r\n/* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.old-value {\r\n  filter: alpha(opacity=50);\r\n  opacity: 0.5;\r\n}\r\n\r\n/* line 38, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.no-wrap {\r\n  white-space: nowrap;\r\n}\r\n\r\n/* line 42, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.text-align-left {\r\n  text-align: left;\r\n}\r\n\r\n/* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.text-align-center {\r\n  text-align: center;\r\n}\r\n\r\n/* line 50, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.text-align-right {\r\n  text-align: right;\r\n}\r\n\r\n/* line 54, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.text-line-through {\r\n  text-decoration: line-through;\r\n}\r\n\r\n/* line 58, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.strong-title-accent {\r\n  font-size: 20px;\r\n  color: #C40F11;\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 64, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.trim-string, span.trim-string-with-tooltip, span.trim-string-with-tooltip > span {\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n/* line 68, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n.ngbindPlacholder:before {\r\n  background: transparent url(../images/ajax-loader.gif) no-repeat 0 0;\r\n  content: \"\";\r\n  display: inline-block;\r\n  width: 16px;\r\n  height: 16px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 76, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_typography.scss */\r\n=======\r\n/* line 76, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_typography.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.fa-dummy, .panel-heading .btn.btn-xc_chevron:before, .panel-heading .btn-xc_chevron.str-inline-with-btns:before, .panel-heading .pagination-controls .btn-xc_chevron.page-number:before, .pagination-controls .panel-heading .btn-xc_chevron.page-number:before, ul.help-list li:before,\r\nul.error-list li:before, .fa-dummy-tooltip, span.trim-string-with-tooltip:after {\r\n  vertical-align: top;\r\n  font-family: FontAwesome;\r\n  content: \" \\f059\";\r\n}\r\n\r\n/* _buttons.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n.wrap_xc_btns_all {\r\n  display: inline-block;\r\n}\r\n\r\n/* line 5, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n.wrap_xc_btns_all a {\r\n  margin: 0 10px;\r\n}\r\n\r\n/* line 8, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n.wrap_xc_btns_all .divider {\r\n  display: inline-block;\r\n  width: 1px;\r\n  height: 10px;\r\n  border-right: 2px solid #ddd;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 18, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 18, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.panel-heading .btn.btn-xc_chevron, .panel-heading .btn-xc_chevron.str-inline-with-btns, .panel-heading .pagination-controls .btn-xc_chevron.page-number, .pagination-controls .panel-heading .btn-xc_chevron.page-number {\r\n  float: right;\r\n  background: transparent;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 22, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 22, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.panel-heading .btn.btn-xc_chevron:before, .panel-heading .btn-xc_chevron.str-inline-with-btns:before, .panel-heading .pagination-controls .btn-xc_chevron.page-number:before, .pagination-controls .panel-heading .btn-xc_chevron.page-number:before {\r\n  color: #009900;\r\n  font-size: 14px;\r\n  line-height: 14px;\r\n  content: \"\\f077\";\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 32, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 32, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.panel-heading.collapsed .btn.btn-xc_chevron:before, .panel-heading.collapsed .btn-xc_chevron.str-inline-with-btns:before, .panel-heading.collapsed .pagination-controls .btn-xc_chevron.page-number:before, .pagination-controls .panel-heading.collapsed .btn-xc_chevron.page-number:before {\r\n  content: \"\\f078\";\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 40, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 40, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group.btn-edit-avatar > .btn-group button.btn, .btn-group.btn-edit-avatar > .btn-group button.str-inline-with-btns, .btn-group.btn-edit-avatar > .btn-group .pagination-controls button.page-number, .pagination-controls .btn-group.btn-edit-avatar > .btn-group button.page-number {\r\n  line-height: 50px;\r\n  padding: 0 10px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 46, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group.btn-edit-avatar a.btn.avatar, .btn-group.btn-edit-avatar a.avatar.str-inline-with-btns, .btn-group.btn-edit-avatar .pagination-controls a.avatar.page-number, .pagination-controls .btn-group.btn-edit-avatar a.avatar.page-number {\r\n  padding: 0;\r\n  border: 1px solid #f1f1f1;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 50, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 50, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group.btn-edit-avatar a.btn.avatar img, .btn-group.btn-edit-avatar a.avatar.str-inline-with-btns img, .btn-group.btn-edit-avatar .pagination-controls a.avatar.page-number img, .pagination-controls .btn-group.btn-edit-avatar a.avatar.page-number img {\r\n  width: auto;\r\n  max-height: 50px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 57, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 57, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-debrief, .btn-debrief.str-inline-with-btns, .pagination-controls .btn-debrief.page-number {\r\n  display: block;\r\n  text-align: center;\r\n  height: 20px;\r\n  line-height: 20px;\r\n  padding: 0 10px;\r\n  -webkit-border-radius: 0px;\r\n  -moz-border-radius: 0px;\r\n  border-radius: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 65, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 65, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-debrief.cross, .btn-debrief.cross.str-inline-with-btns, .pagination-controls .btn-debrief.cross.page-number {\r\n  color: #f00;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 68, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 68, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-debrief.cross.selected, .btn-debrief.cross.selected.str-inline-with-btns, .pagination-controls .btn-debrief.cross.selected.page-number {\r\n  border-color: #f00;\r\n  background: #f00;\r\n  color: white;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 75, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 75, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-debrief.tick, .btn-debrief.tick.str-inline-with-btns, .pagination-controls .btn-debrief.tick.page-number {\r\n  color: #009900;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 78, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 78, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-debrief.tick.selected, .btn-debrief.tick.selected.str-inline-with-btns, .pagination-controls .btn-debrief.tick.selected.page-number {\r\n  border-color: #009900;\r\n  background: #009900;\r\n  color: white;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 86, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 86, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.disabled, .disabled.str-inline-with-btns, .pagination-controls .disabled.page-number, .btn[disabled], [disabled].str-inline-with-btns, .pagination-controls [disabled].page-number, fieldset[disabled] .btn, fieldset[disabled] .str-inline-with-btns, fieldset[disabled] .pagination-controls .page-number, .pagination-controls fieldset[disabled] .page-number {\r\n  color: #c8c8c8;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 90, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 90, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-gradient {\r\n  background-image: -webkit-linear-gradient(top, #fff 0, #e0e0e0 100%);\r\n  background-image: -o-linear-gradient(top, #fff 0, #e0e0e0 100%);\r\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #fff), to(#e0e0e0));\r\n  background-image: linear-gradient(to bottom, #fff 0, #e0e0e0 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe0e0e0', GradientType=0);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\r\n  background-repeat: repeat-x;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 100, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 100, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-gradient-hover {\r\n  background: #e0e0e0 !important;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 104, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 104, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn, .str-inline-with-btns, .pagination-controls .page-number {\r\n  text-align: left;\r\n  font-size: 13px;\r\n  line-height: 15px;\r\n  padding: 5px 10px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 111, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 111, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.str-inline-with-btns {\r\n  display: inline-block;\r\n  padding-left: 0;\r\n  padding-right: 0;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 118, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 118, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-lg, .btn-lg.str-inline-with-btns, .pagination-controls .btn-lg.page-number {\r\n  font-size: 18px;\r\n  line-height: 1.333;\r\n  padding: 10px 15px;\r\n  height: 28px;\r\n  -webkit-border-radius: 6px;\r\n  -moz-border-radius: 6px;\r\n  border-radius: 6px;\r\n  height: auto;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 127, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 127, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio,\r\nlabel.label-with-checkbox,\r\n.col-checkboxes label,\r\n.row-checkboxes label {\r\n  cursor: pointer;\r\n  color: #009900;\r\n  font-weight: normal;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 133, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 133, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio.strong,\r\nlabel.label-with-checkbox.strong,\r\n.col-checkboxes label.strong,\r\n.row-checkboxes label.strong {\r\n  font-weight: bold;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 137, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 137, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio input[type=\"radio\"],\r\nlabel.label-with-radio input[type=\"checkbox\"],\r\nlabel.label-with-checkbox input[type=\"radio\"], .col-checkboxes label input[type=\"radio\"],\r\n.row-checkboxes label input[type=\"radio\"],\r\nlabel.label-with-checkbox input[type=\"checkbox\"], .col-checkboxes label input[type=\"checkbox\"],\r\n.row-checkboxes label input[type=\"checkbox\"] {\r\n  width: 15px;\r\n  height: 15px;\r\n  margin-right: 5px;\r\n  margin-top: 0px;\r\n  float: left;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 147, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 147, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio.checkbox-right input[type=\"radio\"],\r\nlabel.label-with-radio.checkbox-right input[type=\"checkbox\"],\r\nlabel.label-with-checkbox.checkbox-right input[type=\"radio\"], .col-checkboxes label.checkbox-right input[type=\"radio\"],\r\n.row-checkboxes label.checkbox-right input[type=\"radio\"],\r\nlabel.label-with-checkbox.checkbox-right input[type=\"checkbox\"], .col-checkboxes label.checkbox-right input[type=\"checkbox\"],\r\n.row-checkboxes label.checkbox-right input[type=\"checkbox\"] {\r\n  margin-right: 0;\r\n  margin-left: 5px;\r\n  float: right;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 155, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 155, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio input[type=\"radio\"]:checked.ng-dirty ~ *,\r\nlabel.label-with-checkbox input[type=\"radio\"]:checked.ng-dirty ~ *, .col-checkboxes label input[type=\"radio\"]:checked.ng-dirty ~ *,\r\n.row-checkboxes label input[type=\"radio\"]:checked.ng-dirty ~ * {\r\n  font-weight: bold;\r\n  color: #a6cf41 !important;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 160, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 160, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.label-with-radio input[type=\"radio\"]:checked.ng-untouched ~ *,\r\nlabel.label-with-checkbox input[type=\"radio\"]:checked.ng-untouched ~ *, .col-checkboxes label input[type=\"radio\"]:checked.ng-untouched ~ *,\r\n.row-checkboxes label input[type=\"radio\"]:checked.ng-untouched ~ * {\r\n  font-weight: bold;\r\n  color: black;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 166, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 166, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.md-icon-button {\r\n  background: transparent;\r\n  color: white !important;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 170, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 170, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.md-icon-button:hover {\r\n  background: rgba(0, 0, 0, 0.25);\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 175, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 175, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.split-with-search-btn {\r\n  display: inline-block;\r\n  width: auto;\r\n  width: calc(100% - 60px);\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 182, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 182, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.form-control-fill > .multi-select-filter > .btn, .form-control-fill > .multi-select-filter > .str-inline-with-btns, .pagination-controls .form-control-fill > .multi-select-filter > .page-number {\r\n  width: 100%;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 187, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 187, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-a {\r\n  box-shadow: none !important;\r\n  padding-left: 0;\r\n  padding-right: 0;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 193, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 193, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-add {\r\n  background: white;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 198, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 198, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-i .fa, .btn-i.str-inline-with-btns .fa, .pagination-controls .btn-i.page-number .fa {\r\n  margin-right: 5px;\r\n  width: 1.28571429em;\r\n  text-align: center;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 204, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 204, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn.btn-i.btn-a .fa, .btn-i.btn-a.str-inline-with-btns .fa, .pagination-controls .btn-i.btn-a.page-number .fa {\r\n  margin-right: 3px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 209, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 209, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i {\r\n  -webkit-border-radius: 100%;\r\n  -moz-border-radius: 100%;\r\n  border-radius: 100%;\r\n  width: auto;\r\n  position: relative;\r\n  overflow: hidden;\r\n  padding: 0;\r\n  font-size: 14px;\r\n  width: 28px;\r\n  height: 28px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 219, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 219, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i.lg {\r\n  width: 40px;\r\n  height: 40px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 225, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 225, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i:before {\r\n  display: block;\r\n  padding-top: 100%;\r\n  content: '';\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 231, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 231, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i i.fa {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  margin: -7px 0 0 -7px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 236, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 236, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i i.fa.fa-user {\r\n  margin-left: -5px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 240, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 240, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i i.fa.fa-download, .btn-disc-i i.fa.fa-pencil, .btn-disc-i i.fa.fa-search, .btn-disc-i i.fa.fa-cog {\r\n  margin-left: -6px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 247, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 247, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-disc-i i.fa.fa-chevron-left, .btn-disc-i i.fa.fa-chevron-right {\r\n  margin-left: -5px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 254, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 254, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs {\r\n  border-bottom: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 257, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 257, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs > li {\r\n  margin-bottom: 0;\r\n  /*margin-bottom:-1;*/\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 260, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 260, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs > li.active > a,\r\n.nav-tabs > li.active > a:hover,\r\n.nav-tabs > li.active > a:focus {\r\n  color: #FFFFFF;\r\n  font-weight: bold;\r\n  border: none;\r\n  cursor: default;\r\n  text-decoration: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 270, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 270, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs > li > a {\r\n  color: #009900;\r\n  background: transparent !important;\r\n  margin-right: 0;\r\n  border: none;\r\n  padding: 10px 15px;\r\n  -webkit-border-radius: 0px;\r\n  -moz-border-radius: 0px;\r\n  border-radius: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 278, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 278, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs > li > a:hover {\r\n  text-decoration: underline;\r\n  border: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 283, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 283, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.nav-tabs > li > a > i {\r\n  margin-left: 10px;\r\n  position: absolute;\r\n  top: 12px;\r\n  right: 12px;\r\n}\r\n\r\n/*.nav-tabs.arrow > li.active > a:after {\r\n    position: absolute;\r\n    bottom: -1px;\r\n    left: 50%;\r\n    margin-left: -4px;\r\n    display: block;\r\n    content: \"\";\r\n    @include triangle(10px,top,$bp_color-white);\r\n}*/\r\n<<<<<<< HEAD\r\n/* line 307, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 307, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-add {\r\n  border-color: #a6cf41;\r\n  background: white;\r\n  box-shadow: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 312, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 312, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-add:hover, .btn-add:focus {\r\n  background: #dff0d8;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 320, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 320, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-priority {\r\n  background-image: -webkit-linear-gradient(top, #f0ad4e 0, #eb9316 100%);\r\n  background-image: -o-linear-gradient(top, #f0ad4e 0, #eb9316 100%);\r\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #f0ad4e), to(#eb9316));\r\n  background-image: linear-gradient(to bottom, #f0ad4e 0, #eb9316 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff0ad4e', endColorstr='#ffeb9316', GradientType=0);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\r\n  background-repeat: repeat-x;\r\n  border-color: #e38d13;\r\n  color: #fff;\r\n  text-shadow: none;\r\n  background-color: #f0ad4e;\r\n  border-color: #eea236;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 334, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 334, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-priority:hover, .btn-priority:focus {\r\n  background-color: #eb9316;\r\n  background-position: 0 -15px;\r\n  color: #fff;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 340, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 340, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-priority:hover {\r\n  color: #fff;\r\n  background-color: #ec971f;\r\n  border-color: #d58512;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 347, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 347, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.pagination-status {\r\n  font-weight: bold;\r\n  color: #C40F11;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 352, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 352, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.pagination-controls {\r\n  width: 110px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 355, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 355, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.pagination-controls .page-number {\r\n  text-align: center !important;\r\n  box-shadow: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 361, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 361, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.pagination-controls > a {\r\n  cursor: pointer;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 367, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 367, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group ul.dropdown-menu {\r\n  z-index: 49;\r\n  /* because md-dialog starts at 50 dropdown-toggle */\r\n  padding: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 372, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 372, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group ul.dropdown-menu li a,\r\n.btn-group ul.dropdown-menu li button {\r\n  padding: 10px;\r\n  background: transparent;\r\n  border: none;\r\n  outline: none;\r\n  display: block;\r\n  width: 100%;\r\n  text-align: left;\r\n  font-size: 13px;\r\n  line-height: 15px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 384, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 384, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group ul.dropdown-menu li a:hover,\r\n.btn-group ul.dropdown-menu li button:hover {\r\n  background: #f9f9f9;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 388, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 388, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-group ul.dropdown-menu li a i.fa,\r\n.btn-group ul.dropdown-menu li button i.fa {\r\n  margin-right: 5px;\r\n}\r\n\r\n/* fa */\r\n<<<<<<< HEAD\r\n/* line 398, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 398, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.fa.fa-ban, .fa.fa-user-times {\r\n  color: #f00;\r\n}\r\n\r\n/* overrule bootstrap btn active styles */\r\n<<<<<<< HEAD\r\n/* line 405, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 405, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nbtn.active, .btn:active, .str-inline-with-btns:active, .pagination-controls .page-number:active {\r\n  background-image: none;\r\n  outline: 0;\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 411, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 411, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-default.active.focus, .btn-default.active:focus, .btn-default.active:hover, .btn-default:active.focus, .btn-default:active:focus, .btn-default:active:hover, .open > .dropdown-toggle.btn-default.focus, .open > .dropdown-toggle.btn-default:focus, .open > .dropdown-toggle.btn-default:hover,\r\n.btn-default.active, .btn-default:active, .open > .dropdown-toggle.btn-default {\r\n  color: white;\r\n  background-color: #009900;\r\n  border-color: #009900;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 418, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_buttons.scss */\r\n=======\r\n/* line 418, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_buttons.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.btn-default.active, .btn-default:active, .open > .dropdown-toggle.btn-default {\r\n  background-image: none;\r\n}\r\n\r\n/* (END) overrule bootstrap btn active styles */\r\n/* _forms.scss */\r\n<<<<<<< HEAD\r\n/* line 6, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 6, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.form-group.is-mandatory label:after,\r\n.form-group-input-only.is-mandatory label:after {\r\n  content: \"*\";\r\n  color: #f00;\r\n  font-size: 1.2em;\r\n  margin-left: 5px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 15, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ninput[type=text]::-ms-clear,\r\ninput.searchStr::-ms-clear {\r\n  display: none;\r\n  width: 0;\r\n  height: 0;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 22, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 22, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.changed-field:not(.ng-invalid) {\r\n  border-color: yellow !important;\r\n  background: yellow !important;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 27, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list,\r\nul.error-list {\r\n  list-style: none;\r\n  margin-left: 0;\r\n  padding-left: 1em;\r\n  text-indent: -1em;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 34, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list li,\r\nul.error-list li {\r\n  list-style-image: none;\r\n  list-style-type: none;\r\n  margin: 0 0 10px 0;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 38, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 38, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list li:last-child,\r\nul.error-list li:last-child {\r\n  margin-bottom: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 42, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 42, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list li:before,\r\nul.error-list li:before {\r\n  content: \"\\f054\";\r\n  font-size: 10px;\r\n  margin-right: 5px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 51, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 51, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list.error-list li,\r\nul.error-list.error-list li {\r\n  color: #f00;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 54, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 54, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nul.help-list.error-list li:before,\r\nul.error-list.error-list li:before {\r\n  content: \"\\f069\";\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 62, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 62, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  width: 15px;\r\n  height: 15px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 68, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 68, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ninput[readonly],\r\ninput.dummy-disabled {\r\n  background: #eee;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 73, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 73, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ntextarea {\r\n  width: 100%;\r\n  min-height: 150px;\r\n  resize: vertical;\r\n}\r\n\r\n/* search input */\r\n<<<<<<< HEAD\r\n/* line 80, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 80, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.inpUpperCase {\r\n  text-transform: uppercase;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 84, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 84, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.inpFeedback {\r\n  font-weight: normal;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 87, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 87, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.inpFeedback > div {\r\n  display: inline-block;\r\n  padding: 0 10px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 92, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 92, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.inpFeedback.isError div {\r\n  color: #f00;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 96, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 96, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.inpFeedback.isGood div {\r\n  color: #a6cf41;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 102, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 102, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform .form-control {\r\n  border: 1px solid #ddd;\r\n  background: white;\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n  transition: all linear 0.5s;\r\n  width: 100%;\r\n  height: 28px;\r\n  font-size: 13px;\r\n  line-height: 1.4em;\r\n  padding: 5px 10px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 113, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 113, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform .form-control[type=\"text\"] {\r\n  padding-left: 10px;\r\n  font-size: 13px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 118, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 118, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform .form-control.form-control-auto-width {\r\n  width: auto;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 127, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 127, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform:not(.ignore-validation-styles) .form-control[required].ng-pristine:not(.ng-touched):not(.ignore-style-ng-pristine) {\r\n  background-color: #fcf8e3;\r\n  border-color: #FFCD04;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 132, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 132, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform:not(.ignore-validation-styles) .form-control.ng-invalid.ng-touched, form:not(.ignore-validation-styles) .form-control.ng-invalid-required.ng-touched {\r\n  border-color: #f00;\r\n  background: #F7C6BE;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 138, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 138, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform:not(.ignore-validation-styles) .form-control.ng-valid.ng-dirty {\r\n  border-color: #239F40;\r\n  background: #dff0d8;\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 149, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 149, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-valid {\r\n  border-color: #ddd;\r\n  background: white;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 154, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 154, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-invalid-important {\r\n  border-color: #f00;\r\n  background: #F7C6BE;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 159, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 159, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nform[novalidate].ignore-validation-styles .form-control.ng-dirty.ng-valid-important {\r\n  border-color: #239F40;\r\n  background: #dff0d8;\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 168, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 168, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ninput[type=\"number\"].inpHideSpinner::-webkit-outer-spin-button,\r\ninput[type=\"number\"].inpHideSpinner::-webkit-inner-spin-button {\r\n  -webkit-appearance: none;\r\n  margin: 0;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 174, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 174, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\ninput[type=\"number\"].inpHideSpinner {\r\n  -moz-appearance: textfield;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 180, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 180, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.col-checkboxes label {\r\n  display: block;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 187, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 187, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.row-checkboxes label,\r\n.row-radios label {\r\n  margin-right: 20px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 194, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 194, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.col-checkboxes label,\r\n.row-checkboxes label {\r\n  font-weight: normal;\r\n  cursor: pointer;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 200, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 200, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.col-checkboxes label input,\r\n.row-checkboxes label input {\r\n  margin-right: 5px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 206, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 206, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nlabel.submit-label-dummy {\r\n  display: block;\r\n  visibility: hidden;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 211, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 211, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.fa-dummy-tooltip, span.trim-string-with-tooltip:after {\r\n  content: \" \\f059\";\r\n  color: #009900;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 217, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 217, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nspan.trim-string-with-tooltip {\r\n  display: block;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 221, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 221, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nspan.trim-string-with-tooltip.is-FreeTextDescription {\r\n  max-width: 250px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 225, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 225, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\nspan.trim-string-with-tooltip > span {\r\n  display: inline-block;\r\n  max-width: calc(100% - 20px);\r\n}\r\n\r\n/* bootstrap tooltip (black background) */\r\n<<<<<<< HEAD\r\n/* line 238, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 238, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.tooltip .tooltip-inner {\r\n  max-width: 400px;\r\n  white-space: pre-wrap;\r\n  /* keep line returns */\r\n  display: inline-block;\r\n  word-wrap: break-word;\r\n  /* force long word (maybe for code) to return instead of strecthing beyond box */\r\n}\r\n\r\n/* custom tooltip (for input validation) */\r\n<<<<<<< HEAD\r\n/* line 247, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 247, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips {\r\n  position: relative;\r\n  transition: all linear 0.5s;\r\n  min-height: 28px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 252, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 252, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips .tooltip_cust {\r\n  position: absolute;\r\n  z-index: 2;\r\n  top: 0px;\r\n  left: 0px;\r\n  width: 100%;\r\n  height: 1px;\r\n  text-align: center;\r\n  padding: 0;\r\n  transition: all linear 0.5s;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 263, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 263, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips .tooltip_cust span.detail {\r\n  cursor: pointer;\r\n  background: #f00;\r\n  position: absolute;\r\n  top: 0px;\r\n  right: 0px;\r\n  width: 40px;\r\n  height: 28px;\r\n  line-height: 28px;\r\n  font-weight: bold;\r\n  text-align: center;\r\n  color: white;\r\n  font-size: 14px;\r\n  -webkit-border-radius: 4px;\r\n  -moz-border-radius: 4px;\r\n  border-radius: 4px;\r\n  opacity: 1;\r\n  transition: all linear 0.5s;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 281, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 281, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips .tooltip_cust div.message-wrap {\r\n  position: absolute;\r\n  bottom: 0px;\r\n  left: 0px;\r\n  padding: 8px 0;\r\n  width: 100%;\r\n  text-align: center;\r\n  background: transparent;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 290, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 290, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips .tooltip_cust div.message-wrap span {\r\n  background: #f00;\r\n  color: white;\r\n  font-size: 12px;\r\n  line-height: 12px;\r\n  font-weight: bold;\r\n  padding: 6px 10px;\r\n  -webkit-border-radius: 4px;\r\n  -moz-border-radius: 4px;\r\n  border-radius: 4px;\r\n  display: inline-block;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 302, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 302, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips .tooltip_cust span.tooltip-arrow {\r\n  top: -8px;\r\n  left: 50%;\r\n  margin-left: -6px;\r\n  border-width: 6px 6px 0;\r\n  border-top-color: #f00;\r\n  background: transparent;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 312, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 312, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips.isSelectList .tooltip_cust {\r\n  display: none;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 319, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 319, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips.tooltip-below .tooltip_cust {\r\n  top: auto;\r\n  bottom: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 323, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 323, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips.tooltip-below .tooltip_cust span.detail {\r\n  top: auto;\r\n  bottom: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 328, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 328, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips.tooltip-below .tooltip_cust div.message-wrap {\r\n  top: 0px;\r\n}\r\n\r\n<<<<<<< HEAD\r\n/* line 335, C:/Users/AMackenzie/Documents/WORK/MRT/site3/user manager 3/src/scss/modules/_forms.scss */\r\n=======\r\n/* line 335, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_forms.scss */\r\n>>>>>>> 7caa9294580503c40497c742c339efa86d76c374\r\n.hasTooltips.tooltip-below .tooltip_cust span.tooltip-arrow {\r\n  top: auto;\r\n  bottom: -10px;\r\n  border-width: 0 6px 6px;\r\n  border-bottom-color: #f00;\r\n}\r\n\r\n/* _tables.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table-legend-cell {\r\n  clear: both;\r\n  display: block;\r\n  width: auto;\r\n  float: right;\r\n  margin: 20px 0;\r\n}\r\n\r\n/* line 11, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table-legend-cell tr > td {\r\n  border: 1px solid #ddd;\r\n  padding: 5px;\r\n}\r\n\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table-legend-cell tr > td:first-child {\r\n  padding-right: 30px;\r\n}\r\n\r\n/* line 19, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table-legend-cell tr > td:last-child {\r\n  padding-left: 30px;\r\n}\r\n\r\n/* line 26, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-tender {\r\n  background: #EAEAEA;\r\n  color: #999999;\r\n}\r\n\r\n/* line 31, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-tender-border {\r\n  background: #ddd;\r\n}\r\n\r\n/* line 35, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-pending {\r\n  background: #FFFDD9;\r\n}\r\n\r\n/* line 39, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-pending-border {\r\n  background: #faebcc;\r\n}\r\n\r\n/* line 43, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-declined {\r\n  background: #f2dede;\r\n  color: #a94442;\r\n}\r\n\r\n/* line 48, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-obsolete {\r\n  background: #f2dede;\r\n  color: #a94442;\r\n}\r\n\r\n/* line 53, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-approved {\r\n  background: #dff0d8;\r\n  color: #090;\r\n}\r\n\r\n/* line 58, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-approved {\r\n  background: #dff0d8;\r\n}\r\n\r\n/* line 62, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-realised {\r\n  color: #009900;\r\n}\r\n\r\n/* line 66, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cd-bg-color-lost {\r\n  color: #f00;\r\n}\r\n\r\n/* line 70, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.cell-txt {\r\n  display: block;\r\n  width: 100%;\r\n  height: 18px;\r\n  line-height: 18px;\r\n  padding: 0 5px;\r\n  font-size: 11px;\r\n}\r\n\r\n/* line 79, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table-row-border {\r\n  border: none;\r\n  border-bottom: 1px dotted #ddd;\r\n}\r\n\r\n/* line 84, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > tbody + tbody {\r\n  border-top: 1px solid #ddd;\r\n}\r\n\r\n/* line 91, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table.border-none > thead > tr td,\r\n.table.border-none > tbody > tr td,\r\n.table.border-none > tfoot > tr td {\r\n  border: 0px;\r\n}\r\n\r\n/* line 98, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr.event-details-open td,\r\n.table > tbody > tr.event-details-open td,\r\n.table > tfoot > tr.event-details-open td {\r\n  background: #c4e3f3 !important;\r\n  border-bottom: none;\r\n}\r\n\r\n/* line 103, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th, .table > thead > tr td,\r\n.table > tbody > tr th,\r\n.table > tbody > tr td,\r\n.table > tfoot > tr th,\r\n.table > tfoot > tr td {\r\n  padding: 5px;\r\n  vertical-align: middle;\r\n}\r\n\r\n/* line 107, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th > label, .table > thead > tr td > label,\r\n.table > tbody > tr th > label,\r\n.table > tbody > tr td > label,\r\n.table > tfoot > tr th > label,\r\n.table > tfoot > tr td > label {\r\n  margin-bottom: 0px;\r\n}\r\n\r\n/* line 111, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th.col-hidden, .table > thead > tr td.col-hidden,\r\n.table > tbody > tr th.col-hidden,\r\n.table > tbody > tr td.col-hidden,\r\n.table > tfoot > tr th.col-hidden,\r\n.table > tfoot > tr td.col-hidden {\r\n  display: none;\r\n}\r\n\r\n/* line 115, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th.col-actions, .table > thead > tr th.col-actions-printable, .table > thead > tr td.col-actions, .table > thead > tr td.col-actions-printable,\r\n.table > tbody > tr th.col-actions,\r\n.table > tbody > tr th.col-actions-printable,\r\n.table > tbody > tr td.col-actions,\r\n.table > tbody > tr td.col-actions-printable,\r\n.table > tfoot > tr th.col-actions,\r\n.table > tfoot > tr th.col-actions-printable,\r\n.table > tfoot > tr td.col-actions,\r\n.table > tfoot > tr td.col-actions-printable {\r\n  text-align: right;\r\n  min-width: 100px;\r\n}\r\n\r\n/* line 120, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th.col-actions .row-checkboxes label:last-child,\r\n.table > thead > tr th.col-actions .row-radios label:last-child, .table > thead > tr th.col-actions-printable .row-checkboxes label:last-child,\r\n.table > thead > tr th.col-actions-printable .row-radios label:last-child, .table > thead > tr td.col-actions .row-checkboxes label:last-child,\r\n.table > thead > tr td.col-actions .row-radios label:last-child, .table > thead > tr td.col-actions-printable .row-checkboxes label:last-child,\r\n.table > thead > tr td.col-actions-printable .row-radios label:last-child,\r\n.table > tbody > tr th.col-actions .row-checkboxes label:last-child,\r\n.table > tbody > tr th.col-actions .row-radios label:last-child,\r\n.table > tbody > tr th.col-actions-printable .row-checkboxes label:last-child,\r\n.table > tbody > tr th.col-actions-printable .row-radios label:last-child,\r\n.table > tbody > tr td.col-actions .row-checkboxes label:last-child,\r\n.table > tbody > tr td.col-actions .row-radios label:last-child,\r\n.table > tbody > tr td.col-actions-printable .row-checkboxes label:last-child,\r\n.table > tbody > tr td.col-actions-printable .row-radios label:last-child,\r\n.table > tfoot > tr th.col-actions .row-checkboxes label:last-child,\r\n.table > tfoot > tr th.col-actions .row-radios label:last-child,\r\n.table > tfoot > tr th.col-actions-printable .row-checkboxes label:last-child,\r\n.table > tfoot > tr th.col-actions-printable .row-radios label:last-child,\r\n.table > tfoot > tr td.col-actions .row-checkboxes label:last-child,\r\n.table > tfoot > tr td.col-actions .row-radios label:last-child,\r\n.table > tfoot > tr td.col-actions-printable .row-checkboxes label:last-child,\r\n.table > tfoot > tr td.col-actions-printable .row-radios label:last-child {\r\n  margin-right: 0px;\r\n}\r\n\r\n/* line 126, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr th.col-hidden-header, .table > thead > tr td.col-hidden-header,\r\n.table > tbody > tr th.col-hidden-header,\r\n.table > tbody > tr td.col-hidden-header,\r\n.table > tfoot > tr th.col-hidden-header,\r\n.table > tfoot > tr td.col-hidden-header {\r\n  color: #239F40;\r\n  font-size: 0px;\r\n  padding: 0px;\r\n  border-bottom: none !important;\r\n  height: 0px;\r\n}\r\n\r\n/* line 135, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr:last-child th,\r\n.table > tbody > tr:last-child th,\r\n.table > tfoot > tr:last-child th {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n\r\n/* line 139, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.table > thead > tr:last-child td,\r\n.table > tbody > tr:last-child td,\r\n.table > tfoot > tr:last-child td {\r\n  border-bottom: none;\r\n}\r\n\r\n/* line 145, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\ntable.half-n-half tr > th,\r\ntable.half-n-half tr > td {\r\n  width: 50%;\r\n}\r\n\r\n/* line 151, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\ntable.fixed-layout {\r\n  table-layout: fixed;\r\n  /* This is used to squeeze large strings(with no spaces) into the table cell without exceeding table */\r\n  /* NOTE: requires 'table-layout: fixed' table class to work */\r\n}\r\n\r\n/* line 155, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\ntable.fixed-layout .squeeze-into-cell {\r\n  white-space: pre-wrap;\r\n  white-space: -moz-pre-wrap;\r\n  white-space: -pre-wrap;\r\n  white-space: -o-pre-wrap;\r\n  word-wrap: break-word;\r\n  display: block;\r\n}\r\n\r\n/* line 165, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.wrap-longtext {\r\n  white-space: pre;\r\n}\r\n\r\n/* line 169, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.aut-sort:before {\r\n  font-family: FontAwesome;\r\n  padding-right: 0.5em;\r\n  width: 1.28571429em;\r\n  display: inline-block;\r\n  text-align: center;\r\n}\r\n\r\n/* line 181, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.aut-asc:before {\r\n  content: \"\\f160\";\r\n}\r\n\r\n/* line 185, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_tables.scss */\r\n.aut-desc:before {\r\n  content: \"\\f161\";\r\n}\r\n\r\n/* _toastr.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container > div {\r\n  opacity: 1 !important;\r\n}\r\n\r\n/* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container.toast-top-center, #toast-container.toast-bottom-center {\r\n  left: 50%;\r\n  right: auto;\r\n  margin-left: -250px;\r\n  width: 500px;\r\n}\r\n\r\n/* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container.toast-top-center > div, #toast-container.toast-bottom-center > div {\r\n  width: 100%;\r\n}\r\n\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container.toast-top-center > div button.toast-close-button, #toast-container.toast-bottom-center > div button.toast-close-button {\r\n  margin-right: 5px;\r\n}\r\n\r\n/* line 23, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container.toast-top-center {\r\n  top: 20px;\r\n}\r\n\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_toastr.scss */\r\n#toast-container.toast-bottom-center {\r\n  bottom: 50px;\r\n}\r\n\r\n/* hovercard.scss */\r\n/* line 2, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.angular-hovercard {\r\n  display: inline-block;\r\n  position: relative;\r\n}\r\n\r\n/* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.angular-hovercard-label {\r\n  position: relative;\r\n}\r\n\r\n/* line 11, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.angular-hovercard-label.angular-hovercard-active {\r\n  z-index: 99;\r\n}\r\n\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.angular-hovercard-detail {\r\n  /* http://www.cssmatic.com/box-shadow */\r\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\r\n  -moz-box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.175);\r\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\r\n  background: white;\r\n  border: 1px solid #ddd;\r\n  opacity: 0;\r\n  padding: 0;\r\n  position: absolute;\r\n  visibility: hidden;\r\n  width: auto;\r\n  min-width: 500px;\r\n  z-index: 98;\r\n}\r\n\r\n/* line 28, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.angular-hovercard-detail.angular-hovercard-active {\r\n  min-height: 200px;\r\n  opacity: 1;\r\n  visibility: visible;\r\n}\r\n\r\n/* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap {\r\n  font-size: 11px;\r\n}\r\n\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row {\r\n  display: block;\r\n  padding: 5px;\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n\r\n/* line 42, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-overview {\r\n  padding: 10px;\r\n  font-size: 0.9em;\r\n  color: #303030;\r\n}\r\n\r\n/* line 47, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-overview table {\r\n  width: 100%;\r\n}\r\n\r\n/* line 51, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-overview table tr td {\r\n  border: none;\r\n  padding: 3px;\r\n}\r\n\r\n/* line 55, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-overview table tr td.border-bottom {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n\r\n/* line 59, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-overview table tr td:last-child {\r\n  text-align: right;\r\n}\r\n\r\n/* line 67, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row label {\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 71, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-actions {\r\n  padding: 0px;\r\n  max-height: 200px;\r\n  overflow-y: scroll;\r\n}\r\n\r\n/* line 77, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-actions table {\r\n  width: 100%;\r\n}\r\n\r\n/* line 81, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-actions table tr th {\r\n  color: white;\r\n}\r\n\r\n/* line 85, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-actions table tr td {\r\n  border-bottom: 1px solid #ddd;\r\n  font-weight: normal;\r\n}\r\n\r\n/* line 90, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row.wrap-actions table tr:last-child td {\r\n  border-bottom: none;\r\n}\r\n\r\n/* line 97, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/modules/_hovercard.scss */\r\n.hoverCardDetailsWrap .content-row:last-child {\r\n  border-bottom: none;\r\n}\r\n\r\n/*@import 'modules/_md-dialog.scss';*/\r\n/* LAYOUTS - page layout styles */\r\n/* _bootstrap-overrule.scss */\r\n/* line 2, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.navbar-default .navbar-toggle {\r\n  border-color: transparent !important;\r\n}\r\n\r\n/* line 6, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.navbar-default .navbar-toggle .icon-bar {\r\n  background-color: #fff !important;\r\n}\r\n\r\n/* line 10, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.btn-default:hover,\r\n.btn-default:active,\r\n.btn-default:focus {\r\n  color: #067d00 !important;\r\n}\r\n\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.dropdown-menu > li.divider {\r\n  margin: 0;\r\n}\r\n\r\n/* line 19, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.dropdown-menu > li > a {\r\n  padding: 3px 10px;\r\n}\r\n\r\n/* line 25, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.wrap-pagination > ul.pagination {\r\n  margin-top: 0px !important;\r\n  margin-bottom: 0px !important;\r\n}\r\n\r\n/* line 31, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.pagination > li > a,\r\n.pagination > li > span {\r\n  padding: 4px 10px;\r\n  color: #009900;\r\n  text-decoration: none;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n}\r\n\r\n/* line 40, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.pagination > .disabled > a,\r\n.pagination > .disabled > a:focus,\r\n.pagination > .disabled > a:hover,\r\n.pagination > .disabled > span,\r\n.pagination > .disabled > span:focus,\r\n.pagination > .disabled > span:hover {\r\n  color: #c8c8c8;\r\n  background-color: #fff;\r\n  border-color: #ddd;\r\n}\r\n\r\n/* line 51, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.pagination > .active > a,\r\n.pagination > .active > a:focus,\r\n.pagination > .active > a:hover,\r\n.pagination > .active > span,\r\n.pagination > .active > span:focus,\r\n.pagination > .active > span:hover {\r\n  color: #000;\r\n  background-color: #f9f9f9;\r\n  border-color: #ddd;\r\n}\r\n\r\n/* line 62, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.input-group-addon {\r\n  padding: 4px 10px;\r\n  color: #555;\r\n  background-color: #f9f9f9;\r\n  border: 1px solid #ddd;\r\n}\r\n\r\n/* line 69, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_bootstrap-overrule.scss */\r\n.btn-default {\r\n  color: #009900;\r\n  background-color: #fff;\r\n  border-color: #ddd;\r\n}\r\n\r\n/* _header.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_header.scss */\r\nheader {\r\n  padding: 15px;\r\n}\r\n\r\n/* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_header.scss */\r\nheader a img {\r\n  float: left;\r\n  display: inline-block;\r\n  max-height: 70px;\r\n}\r\n\r\n/* line 12, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_header.scss */\r\nheader a h3 {\r\n  float: left;\r\n  display: inline-block;\r\n  margin: 0;\r\n  padding: 30px 20px;\r\n  padding-bottom: 0px;\r\n  color: #009900 !important;\r\n  text-decoration: none;\r\n}\r\n\r\n/* line 23, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_header.scss */\r\nheader div.user {\r\n  text-align: right;\r\n  padding-top: 25px;\r\n}\r\n\r\n/* line 29, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_header.scss */\r\nheader div.user .btn-group.btn-edit-avatar > .btn-group button.btn, header div.user .btn-group.btn-edit-avatar > .btn-group button.str-inline-with-btns, header div.user .btn-group.btn-edit-avatar > .btn-group .pagination-controls button.page-number, .pagination-controls header div.user .btn-group.btn-edit-avatar > .btn-group button.page-number {\r\n  border: 0px;\r\n}\r\n\r\n/* line 4, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_nav-bar.scss */\r\nnav.navbar {\r\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAtCAIAAADgGZaTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQjczNDc2RjQ4OTYxMUUzQUYyNkY4MUUyN0VFM0E1RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQjczNDc3MDQ4OTYxMUUzQUYyNkY4MUUyN0VFM0E1RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFCNzM0NzZENDg5NjExRTNBRjI2RjgxRTI3RUUzQTVFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFCNzM0NzZFNDg5NjExRTNBRjI2RjgxRTI3RUUzQTVFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wZEQLwAAADxJREFUeNpiUOxnYPrzD4j/MzD9A9L/GSCYAUT/h9JobIb/uNWhyP1HUoNHLTIfRS2aHgag+1j/sQIEGACz2yfhBBU55gAAAABJRU5ErkJggg==) repeat-x top left #007f00;\r\n  border: 0px !important;\r\n  margin-bottom: 40px;\r\n}\r\n\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_nav-bar.scss */\r\nnav ul.nav.navbar-nav li {\r\n  border-left: 1px solid #006e00;\r\n}\r\n\r\n/* line 18, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_nav-bar.scss */\r\nnav ul.nav.navbar-nav li.active {\r\n  background: #067d00;\r\n  border-bottom: 2px solid #ff0;\r\n}\r\n\r\n/* line 23, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_nav-bar.scss */\r\nnav ul.nav.navbar-nav li a {\r\n  border-left: 1px solid #309730;\r\n}\r\n\r\n/*@import 'layouts/_header-responsive.scss';*/\r\n/* _footer.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_footer.scss */\r\nfooter {\r\n  overflow: hidden;\r\n  background: #eee;\r\n  border-top: 1px solid #999;\r\n  padding-top: 10px;\r\n}\r\n\r\n/* line 9, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_footer.scss */\r\nfooter ul.ul-inline-piped {\r\n  display: inline-block;\r\n  list-style: none;\r\n  text-align: center;\r\n}\r\n\r\n/* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_footer.scss */\r\nfooter ul.ul-inline-piped li {\r\n  display: inline-block;\r\n}\r\n\r\n/* line 16, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_footer.scss */\r\nfooter ul.ul-inline-piped li:after {\r\n  content: \"|\";\r\n  margin: 0 10px;\r\n}\r\n\r\n/* line 21, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_footer.scss */\r\nfooter ul.ul-inline-piped li:last-child:after {\r\n  display: none;\r\n}\r\n\r\n/*@import 'layouts/_img.scss';*/\r\n/* _panels.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_panels.scss */\r\n.panel {\r\n  -webkit-box-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n/* line 6, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_panels.scss */\r\n.panel.panel-bp {\r\n  background: #eee;\r\n  border: 0px;\r\n  border-bottom: 3px solid #009900;\r\n}\r\n\r\n/* line 12, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_panels.scss */\r\n.panel.has-button-bar {\r\n  margin-bottom: 0px;\r\n}\r\n\r\n/* _offsets.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.float-none {\r\n  float: none !important;\r\n}\r\n\r\n/* line 4, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.ltr .float-left {\r\n  float: left !important;\r\n}\r\n\r\n/* line 5, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.ltr .float-right {\r\n  float: right !important;\r\n}\r\n\r\n/* Padding */\r\n/* line 8, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-0 {\r\n  padding: 0 !important;\r\n}\r\n\r\n/* line 9, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-1 {\r\n  padding: 10px !important;\r\n}\r\n\r\n/* line 10, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-1-5 {\r\n  padding: 15px !important;\r\n}\r\n\r\n/* line 11, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-2 {\r\n  padding: 20px !important;\r\n}\r\n\r\n/* line 12, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-x-0 {\r\n  padding-left: 0 !important;\r\n  padding-right: 0 !important;\r\n}\r\n\r\n/* line 13, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-y-0 {\r\n  padding-top: 0 !important;\r\n  padding-bottom: 0 !important;\r\n}\r\n\r\n/* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-x-1 {\r\n  padding-left: 10px !important;\r\n  padding-right: 10px !important;\r\n}\r\n\r\n/* line 15, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-x-1-5 {\r\n  padding-left: 15px !important;\r\n  padding-right: 15px !important;\r\n}\r\n\r\n/* line 16, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-y-1 {\r\n  padding-top: 10px !important;\r\n  padding-bottom: 10px !important;\r\n}\r\n\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-y-1-5, .tab-content {\r\n  padding-top: 15px !important;\r\n  padding-bottom: 15px !important;\r\n}\r\n\r\n/* line 18, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-top-0 {\r\n  padding-top: 0 !important;\r\n}\r\n\r\n/* line 19, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-top-0-5 {\r\n  padding-top: 5px !important;\r\n}\r\n\r\n/* line 20, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-top-1 {\r\n  padding-top: 10px !important;\r\n}\r\n\r\n/* line 21, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-top-1-5 {\r\n  padding-top: 15px !important;\r\n}\r\n\r\n/* line 22, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-top-2 {\r\n  padding-top: 20px !important;\r\n}\r\n\r\n/* line 23, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-bottom-0 {\r\n  padding-bottom: 0 !important;\r\n}\r\n\r\n/* line 24, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-bottom-1 {\r\n  padding-bottom: 10px !important;\r\n}\r\n\r\n/* line 25, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-bottom-g1 {\r\n  padding-bottom: 15px !important;\r\n}\r\n\r\n/* line 26, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-bottom-1-5 {\r\n  padding-bottom: 15px !important;\r\n}\r\n\r\n/* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-bottom-2 {\r\n  padding-bottom: 20px !important;\r\n}\r\n\r\n/* line 28, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-left-0 {\r\n  padding-left: 0 !important;\r\n}\r\n\r\n/* line 29, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-left-1 {\r\n  padding-left: 10px !important;\r\n}\r\n\r\n/* line 30, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-left-2 {\r\n  padding-left: 20px !important;\r\n}\r\n\r\n/* line 31, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-left-3 {\r\n  padding-left: 30px !important;\r\n}\r\n\r\n/* line 32, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-right-0 {\r\n  padding-right: 0 !important;\r\n}\r\n\r\n/* line 33, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-right-1 {\r\n  padding-right: 10px !important;\r\n}\r\n\r\n/* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.padding-right-2 {\r\n  padding-right: 20px !important;\r\n}\r\n\r\n/* Margin */\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-0 {\r\n  margin: 0 !important;\r\n}\r\n\r\n/* line 38, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-x-0 {\r\n  margin-left: 0 !important;\r\n  margin-right: 0 !important;\r\n}\r\n\r\n/* line 39, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-x-1 {\r\n  margin-left: 10px !important;\r\n  margin-right: 10px !important;\r\n}\r\n\r\n/* line 40, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-x-g1 {\r\n  margin-left: 15px !important;\r\n  margin-right: 15px !important;\r\n}\r\n\r\n/* line 41, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-y-0 {\r\n  margin-top: 0 !important;\r\n  margin-bottom: 0 !important;\r\n}\r\n\r\n/* line 42, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-y-1 {\r\n  margin-top: 10px !important;\r\n  margin-bottom: 10px !important;\r\n}\r\n\r\n/* line 43, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-y-g1 {\r\n  margin-top: 15px !important;\r\n  margin-bottom: 15px !important;\r\n}\r\n\r\n/* line 44, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-y-g2 {\r\n  margin-top: 30px !important;\r\n  margin-bottom: 30px !important;\r\n}\r\n\r\n/* line 45, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-0 {\r\n  margin-top: 0 !important;\r\n}\r\n\r\n/* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-1 {\r\n  margin-top: 10px !important;\r\n}\r\n\r\n/* line 47, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-1-5 {\r\n  margin-top: 15px !important;\r\n}\r\n\r\n/* line 48, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-2 {\r\n  margin-top: 20px !important;\r\n}\r\n\r\n/* line 49, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-3 {\r\n  margin-top: 30px !important;\r\n}\r\n\r\n/* line 50, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-4 {\r\n  margin-top: 40px !important;\r\n}\r\n\r\n/* line 51, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-top-massive {\r\n  margin-top: 100px !important;\r\n}\r\n\r\n/* line 52, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-bottom-0 {\r\n  margin-bottom: 0 !important;\r\n}\r\n\r\n/* line 53, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-bottom-1 {\r\n  margin-bottom: 10px !important;\r\n}\r\n\r\n/* line 54, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-bottom-g1 {\r\n  margin-bottom: 15px !important;\r\n}\r\n\r\n/* line 55, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-bottom-2 {\r\n  margin-bottom: 20px !important;\r\n}\r\n\r\n/* line 56, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-left-1 {\r\n  margin-left: 10px !important;\r\n}\r\n\r\n/* line 57, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-right-1 {\r\n  margin-right: 10px !important;\r\n}\r\n\r\n/* line 58, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.margin-0-auto {\r\n  margin: 0 auto;\r\n}\r\n\r\n/* Border */\r\n/* line 61, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.border-0 {\r\n  border: 0px !important;\r\n}\r\n\r\n/* line 62, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.border-top-0 {\r\n  border-top: 0px !important;\r\n}\r\n\r\n/* line 63, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.border-bottom-0 {\r\n  border-bottom: 0px !important;\r\n}\r\n\r\n/* line 64, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.border-left-0 {\r\n  border-left: 0px !important;\r\n}\r\n\r\n/* line 65, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.border-right-0 {\r\n  border-right: 0px !important;\r\n}\r\n\r\n/* Widths */\r\n/* line 68, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.min-width-100 {\r\n  min-width: 100px !important;\r\n}\r\n\r\n/* line 69, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_offsets.scss */\r\n.min-width-150 {\r\n  min-width: 150px !important;\r\n}\r\n\r\n/*@import 'layouts/_search.scss';*/\r\n/*@import 'layouts/_nav-tree.scss';*/\r\n/* _ie-only.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_ie-only.scss */\r\n.panel-heading .panel-btn-wrap.ie-hide {\r\n  display: none\\9;\r\n}\r\n\r\n@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\r\n  /* IE10+ CSS styles go here */\r\n  /* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_ie-only.scss */\r\n  .ie-hide {\r\n    display: none !important;\r\n  }\r\n}\r\n\r\n/* _mobile.scss */\r\n/* lg */\r\n/* md */\r\n@media (max-width: 1199px) {\r\n  /* line 13, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_mobile.scss */\r\n  .fa-textAfter-md:after {\r\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n    content: attr(fa-textAfter) !important;\r\n    margin-left: 5px;\r\n  }\r\n  /* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_mobile.scss */\r\n  .rtl .fa-textAfter-md:after {\r\n    margin-left: 0;\r\n    margin-right: 5px;\r\n  }\r\n}\r\n\r\n/* sm */\r\n/* xs */\r\n@media (max-width: 992px) {\r\n  /* line 25, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_mobile.scss */\r\n  .md-dialog-container md-dialog {\r\n    min-width: auto;\r\n    max-width: auto;\r\n    width: 90% !important;\r\n  }\r\n  /* line 28, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_mobile.scss */\r\n  .wrap-subsections {\r\n    padding: 20px 5%;\r\n  }\r\n  /* line 29, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_mobile.scss */\r\n  .rwd_sm_clear-both {\r\n    clear: both;\r\n  }\r\n}\r\n\r\n/* md */\r\n/* lg */\r\n/* md */\r\n/* sm */\r\n/* xs */\r\n/* _xxxs.scss */\r\n/* xxs and xxxs */\r\n/* amAdded */\r\n/* line 7, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n.row-no-padding [class*=\"col-\"] {\r\n  padding-left: 0 !important;\r\n  padding-right: 0 !important;\r\n}\r\n\r\n@media all and (min-width: 481px) and (max-width: 640px) {\r\n  /* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-1, .col-xxs-10, .col-xxs-11, .col-xxs-12, .col-xxs-2, .col-xxs-3, .col-xxs-4, .col-xxs-5, .col-xxs-6, .col-xxs-7, .col-xxs-8, .col-xxs-9 {\r\n    position: relative;\r\n    min-height: 1px;\r\n    padding-right: 15px;\r\n    padding-left: 15px;\r\n  }\r\n  /* line 21, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-1, .col-xxs-10, .col-xxs-11, .col-xxs-12, .col-xxs-2, .col-xxs-3, .col-xxs-4, .col-xxs-5, .col-xxs-6, .col-xxs-7, .col-xxs-8, .col-xxs-9 {\r\n    float: left;\r\n  }\r\n}\r\n\r\n@media all and (min-width: 321px) and (max-width: 480px) {\r\n  /* line 27, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-1, .col-xxxs-10, .col-xxxs-11, .col-xxxs-12, .col-xxxs-2, .col-xxxs-3, .col-xxxs-4, .col-xxxs-5, .col-xxxs-6, .col-xxxs-7, .col-xxxs-8, .col-xxxs-9 {\r\n    position: relative;\r\n    min-height: 1px;\r\n    padding-right: 15px;\r\n    padding-left: 15px;\r\n  }\r\n  /* line 34, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-1, .col-xxxs-10, .col-xxxs-11, .col-xxxs-12, .col-xxxs-2, .col-xxxs-3, .col-xxxs-4, .col-xxxs-5, .col-xxxs-6, .col-xxxs-7, .col-xxxs-8, .col-xxxs-9 {\r\n    float: left;\r\n  }\r\n}\r\n\r\n@media all and (min-width: 481px) and (max-width: 640px) {\r\n  /* line 41, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .hidden-xxs {\r\n    display: none !important;\r\n  }\r\n  /* line 42, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .visible-xxs {\r\n    display: block !important;\r\n  }\r\n  /* line 44, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-12 {\r\n    right: 100%;\r\n  }\r\n  /* line 45, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  /* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  /* line 47, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-9 {\r\n    right: 75%;\r\n  }\r\n  /* line 48, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  /* line 49, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  /* line 50, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-6 {\r\n    right: 50%;\r\n  }\r\n  /* line 51, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  /* line 52, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  /* line 53, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-3 {\r\n    right: 25%;\r\n  }\r\n  /* line 54, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  /* line 55, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  /* line 56, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-pull-0 {\r\n    right: auto;\r\n  }\r\n  /* line 58, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-12 {\r\n    left: 100%;\r\n  }\r\n  /* line 59, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  /* line 60, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  /* line 61, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-9 {\r\n    left: 75%;\r\n  }\r\n  /* line 62, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  /* line 63, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  /* line 64, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-6 {\r\n    left: 50%;\r\n  }\r\n  /* line 65, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  /* line 66, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  /* line 67, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-3 {\r\n    left: 25%;\r\n  }\r\n  /* line 68, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  /* line 69, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  /* line 70, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-push-0 {\r\n    left: auto;\r\n  }\r\n  /* line 71, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  /* line 72, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  /* line 73, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  /* line 74, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  /* line 75, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  /* line 76, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  /* line 77, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  /* line 78, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  /* line 79, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  /* line 80, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  /* line 81, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  /* line 82, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  /* line 83, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n  /* line 85, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  /* line 86, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  /* line 87, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-3 {\r\n    width: 25%;\r\n  }\r\n  /* line 88, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  /* line 89, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  /* line 90, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-6 {\r\n    width: 50%;\r\n  }\r\n  /* line 91, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  /* line 92, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  /* line 93, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-9 {\r\n    width: 75%;\r\n  }\r\n  /* line 94, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  /* line 95, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  /* line 96, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-12 {\r\n    width: 100%;\r\n  }\r\n  /* line 98, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxs-padding-2 {\r\n    background: red;\r\n    padding: 20px !important;\r\n  }\r\n}\r\n\r\n@media all and (min-width: 321px) and (max-width: 480px) {\r\n  /* line 102, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .hidden-xxxs {\r\n    display: none !important;\r\n  }\r\n  /* line 103, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .visible-xxxs {\r\n    display: block !important;\r\n  }\r\n  /* line 105, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-12 {\r\n    right: 100%;\r\n  }\r\n  /* line 106, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  /* line 107, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  /* line 108, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-9 {\r\n    right: 75%;\r\n  }\r\n  /* line 109, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  /* line 110, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  /* line 111, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-6 {\r\n    right: 50%;\r\n  }\r\n  /* line 112, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  /* line 113, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  /* line 114, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-3 {\r\n    right: 25%;\r\n  }\r\n  /* line 115, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  /* line 116, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  /* line 117, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-pull-0 {\r\n    right: auto;\r\n  }\r\n  /* line 119, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-12 {\r\n    left: 100%;\r\n  }\r\n  /* line 120, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  /* line 121, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  /* line 122, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-9 {\r\n    left: 75%;\r\n  }\r\n  /* line 123, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  /* line 124, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  /* line 125, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-6 {\r\n    left: 50%;\r\n  }\r\n  /* line 126, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  /* line 127, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  /* line 128, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-3 {\r\n    left: 25%;\r\n  }\r\n  /* line 129, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  /* line 130, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  /* line 131, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-push-0 {\r\n    left: auto;\r\n  }\r\n  /* line 132, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  /* line 133, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  /* line 134, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  /* line 135, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  /* line 136, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  /* line 137, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  /* line 138, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  /* line 139, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  /* line 140, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  /* line 141, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  /* line 142, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  /* line 143, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  /* line 144, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n  /* line 146, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  /* line 147, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  /* line 148, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-3 {\r\n    width: 25%;\r\n  }\r\n  /* line 149, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  /* line 150, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  /* line 151, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-6 {\r\n    width: 50%;\r\n  }\r\n  /* line 152, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  /* line 153, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  /* line 154, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-9 {\r\n    width: 75%;\r\n  }\r\n  /* line 155, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  /* line 156, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  /* line 157, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-12 {\r\n    width: 100%;\r\n  }\r\n  /* amAdded */\r\n  /* line 160, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-text-align-left {\r\n    text-align: left;\r\n  }\r\n  /* line 161, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-text-align-right {\r\n    text-align: left;\r\n  }\r\n  /* line 162, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-padding-left-0 {\r\n    padding-left: 0;\r\n  }\r\n  /* line 163, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-padding-left-1 {\r\n    padding-left: 10px !important;\r\n  }\r\n  /* line 164, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-padding-right-0 {\r\n    padding-right: 0;\r\n  }\r\n  /* line 165, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/layouts/_xxxs.scss */\r\n  .col-xxxs-padding-2 {\r\n    background: yellow;\r\n    padding: 20px !important;\r\n  }\r\n}\r\n\r\n/* print.css */\r\n\r\n/*# sourceMappingURL=../css/main.map */"; });
define('text!dialog-demo/delete-user-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            \r\n            <table class=\"table border-none half-n-half\">\r\n                <tbody>\r\n                <tr>\r\n                    <td><label>ID:</label> ${userRole.id}</td>\r\n                    <td><label>Name:</label> ${userRole.firstName} ${userRole.lastName}</td>\r\n                </tr>                \r\n                </tbody>\r\n            </table>\r\n\r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>\r\n            <button class=\"btn btn-primary\" click.trigger=\"yes()\">Yes</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!css/print.css', ['module'], function(module) { module.exports = "/* print.scss */\r\n/* all changes are sent to 'print.css' */\r\n/*\r\nCIS CRS Sass Theme\r\nAuthor: Alex Mackenzie\r\nVersion: 0.0.1\r\n*/\r\n/* _variables.scss */\r\n/* BP Info colors */\r\n/* General Colors */\r\n/* status (span) color */\r\n/* font size and colors */\r\n/* hyperlink */\r\n/* status (background) color */\r\n/* debriefable - realised? */\r\n/* offset: margins & paddings */\r\n/* _mixins.scss */\r\n/* _print-and-web.scss */\r\n/* line 3, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust {\r\n  border: none;\r\n  background: #f9f9f9;\r\n  border-left: 5px solid #239F40;\r\n}\r\n\r\n/* line 8, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-page-error {\r\n  display: inline-block;\r\n  margin: 30px auto;\r\n  text-align: center;\r\n  border: none;\r\n  background: transparent;\r\n  padding: 10px 20px;\r\n  -webkit-border-radius: 10px;\r\n  -moz-border-radius: 10px;\r\n  border-radius: 10px;\r\n}\r\n\r\n/* line 17, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-page-error .page-error-code {\r\n  display: block;\r\n  font-size: 80px;\r\n  margin: 0 0 10px 0;\r\n}\r\n\r\n/* line 24, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-border {\r\n  background: transparent;\r\n  border: 5px solid #f9f9f9;\r\n}\r\n\r\n/* line 29, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-warning {\r\n  background: #fcf8e3;\r\n  border-color: #FFCD04;\r\n}\r\n\r\n/* line 33, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-info {\r\n  background: #d9edf7;\r\n  border-color: #5bc0de;\r\n}\r\n\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-success {\r\n  background: #dff0d8;\r\n  border-color: #a6cf41;\r\n}\r\n\r\n/* line 41, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust.panel-error, .panel.panel-prompt-cust.panel-danger {\r\n  background: #F7C6BE;\r\n  border-color: #f00;\r\n}\r\n\r\n/* line 46, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/base/_print-and-web.scss */\r\n.panel.panel-prompt-cust > p,\r\n.panel.panel-prompt-cust > .panel-heading {\r\n  padding: 20px;\r\n  border: none;\r\n  height: auto;\r\n  line-height: normal;\r\n  background-image: none;\r\n  background-repeat: unset;\r\n  background: transparent;\r\n  color: black;\r\n}\r\n\r\n/* BASE - base styles, variables, mixins etc */\r\n/* line 14, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nhtml, body {\r\n  height: auto;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n/* line 20, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nbody {\r\n  color: #000;\r\n  background: #fff;\r\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\r\n  font-size: 10pt;\r\n  line-height: 1.5;\r\n  font-weight: normal;\r\n  width: 100%;\r\n  margin: 0;\r\n  padding: 0;\r\n  text-align: left;\r\n}\r\n\r\n/* line 33, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nmain {\r\n  min-height: auto !important;\r\n}\r\n\r\n/* line 37, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.position-relative#printableArea {\r\n  position: unset;\r\n}\r\n\r\n/* line 41, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.print-none,\r\nheader,\r\ntable tr .col-actions, table tr .col-hidden, table tr .col-checkbox,\r\nbutton, .panel-btn-wrap,\r\n.tab-content > .inactive,\r\n.tab-pane:not(.active) {\r\n  display: none;\r\n}\r\n\r\n/* line 50, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n[ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak, .ng-hide:not(.ng-hide-animate) {\r\n  display: none !important;\r\n}\r\n\r\n/* line 54, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.text-align-center {\r\n  text-align: center;\r\n}\r\n\r\n/* line 58, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.tab-content > .active {\r\n  display: block;\r\n}\r\n\r\n/* .breadcrumbWrap */\r\n/* line 63, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.breadcrumbWrap {\r\n  display: block;\r\n  width: 100%;\r\n}\r\n\r\n/* line 67, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.breadcrumbWrap ul {\r\n  display: block;\r\n  width: 100%;\r\n  list-style: none;\r\n  margin: 0 0 40px 0;\r\n  padding: 0;\r\n}\r\n\r\n/* line 74, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.breadcrumbWrap ul li {\r\n  display: inline;\r\n  list-style: none;\r\n  margin: 0;\r\n}\r\n\r\n/* line 79, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.breadcrumbWrap ul li:before {\r\n  content: ' > ';\r\n  margin: 0 10px;\r\n}\r\n\r\n/* line 84, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.breadcrumbWrap ul li:first-child:before {\r\n  content: '' !important;\r\n  margin: 0;\r\n}\r\n\r\n/* line 92, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading-strong {\r\n  display: block;\r\n  width: 100%;\r\n}\r\n\r\n/* line 96, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading-strong h3 {\r\n  font-size: 16pt;\r\n  color: #c40f11;\r\n}\r\n\r\n/* .panel-heading */\r\n/* line 103, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading {\r\n  font-weight: bold;\r\n  border-bottom: 1px solid #000;\r\n}\r\n\r\n/* line 107, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading[aria-hidden=\"true\"],\r\n.panel-heading.panel-collapse-trigger > .panel-collapse > .panel-heading {\r\n  display: none;\r\n}\r\n\r\n/* line 112, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading .panel-title {\r\n  display: inline-block;\r\n  font-size: 12pt;\r\n}\r\n\r\n/* line 117, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-heading .panel-title-date {\r\n  display: inline-block;\r\n  font-weight: normal;\r\n  font-style: italic;\r\n  margin: 0 10px;\r\n}\r\n\r\n/* .panel-collapse */\r\n/* line 126, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-collapse {\r\n  display: block !important;\r\n  height: auto !important;\r\n}\r\n\r\n/* line 130, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-collapse .wrap-subsections {\r\n  padding: 40px 10%;\r\n}\r\n\r\n/* line 135, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-collapse .wrap-subsections .is-subsection .panel-collapse-wrap > .panel-heading {\r\n  border-bottom: none;\r\n}\r\n\r\n/* line 139, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.panel-collapse .wrap-subsections .is-subsection .panel-collapse-wrap > .panel-collapse {\r\n  border: 2px solid #ccc;\r\n  padding: 20px;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n/* table */\r\n/* line 150, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n  width: 100%;\r\n  margin-bottom: 40px;\r\n}\r\n\r\n/* line 156, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\ntable.half-n-half tr th,\r\ntable.half-n-half tr td {\r\n  width: 50%;\r\n}\r\n\r\n/* line 162, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\ntable tr th,\r\ntable tr td {\r\n  padding: 0 10px 0 0;\r\n  border: none;\r\n  text-align: auto;\r\n  border-bottom: 1px dotted #ccc;\r\n}\r\n\r\n/* line 170, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\ntable tr th {\r\n  border-bottom: 1px solid #000;\r\n}\r\n\r\n/* line 173, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\ntable tr th.col-hidden-header {\r\n  display: none;\r\n}\r\n\r\n/* line 183, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nh1, h2, h3, h4, h5, h6 {\r\n  page-break-after: avoid;\r\n  page-break-inside: avoid;\r\n}\r\n\r\n/* line 188, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nimg {\r\n  page-break-inside: avoid;\r\n  page-break-after: avoid;\r\n}\r\n\r\n/* line 193, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nblockquote, pre, panel {\r\n  page-break-inside: avoid;\r\n}\r\n\r\n/* line 197, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nul, ol, dl {\r\n  page-break-before: avoid;\r\n}\r\n\r\n/* line 201, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nul {\r\n  page-break-inside: avoid;\r\n}\r\n\r\n/* line 205, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\narticle {\r\n  page-break-before: always;\r\n}\r\n\r\n/* span highlights */\r\n/* line 210, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.span-no-data-available {\r\n  font-weight: bold;\r\n}\r\n\r\n/* line 214, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.span-info {\r\n  color: #239f40;\r\n}\r\n\r\n/* line 218, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.span-good {\r\n  color: #239f40;\r\n}\r\n\r\n/* line 222, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.span-error {\r\n  color: red;\r\n}\r\n\r\n/* line 226, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\n.span-warning {\r\n  color: #ff9900;\r\n}\r\n\r\n/* .footer */\r\n/* line 231, C:/Users/al_20/Documents/WORK/Agily/MRT/site/user-manager-4/src/scss/print.scss */\r\nfooter {\r\n  clear: both;\r\n  display: inline-block;\r\n  margin-top: 40px;\r\n  font-weight: bold;\r\n  text-align: right;\r\n  border: 1px solid #000;\r\n  padding: 20px;\r\n  float: right;\r\n}\r\n\r\n/* page layouts */\r\n@page {\r\n  margin: 2cm;\r\n}\r\n\r\n/*# sourceMappingURL=../css/print.map */"; });
define('text!dialog-demo/dialog-demo.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"col-md-12\">\r\n        <button class=\"btn btn-primary btn-block\" click.trigger=\"open()\">Show Information</button>\r\n    </div>\r\n</template>"; });
define('text!scss/bootstrap.min.css', ['module'], function(module) { module.exports = "/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{margin:.67em 0;font-size:2em}mark{color:#000;background:#ff0}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{height:0;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{margin:0;font:inherit;color:inherit}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}input{line-height:normal}input[type=checkbox],input[type=radio]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-appearance:textfield}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{padding:.35em .625em .75em;margin:0 2px;border:1px solid silver}legend{padding:0;border:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-spacing:0;border-collapse:collapse}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"javascript:\"]:after,a[href^=\"#\"]:after{content:\"\"}blockquote,pre{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}img{max-width:100%!important}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000!important}.label{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #ddd!important}}@font-face{font-family:'Glyphicons Halflings';src:url(../fonts/glyphicons-halflings-regular.eot);src:url(../fonts/glyphicons-halflings-regular.eot?#iefix) format('embedded-opentype'),url(../fonts/glyphicons-halflings-regular.woff2) format('woff2'),url(../fonts/glyphicons-halflings-regular.woff) format('woff'),url(../fonts/glyphicons-halflings-regular.ttf) format('truetype'),url(../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format('svg')}.glyphicon{position:relative;top:1px;display:inline-block;font-family:'Glyphicons Halflings';font-style:normal;font-weight:400;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.glyphicon-asterisk:before{content:\"\\002a\"}.glyphicon-plus:before{content:\"\\002b\"}.glyphicon-eur:before,.glyphicon-euro:before{content:\"\\20ac\"}.glyphicon-minus:before{content:\"\\2212\"}.glyphicon-cloud:before{content:\"\\2601\"}.glyphicon-envelope:before{content:\"\\2709\"}.glyphicon-pencil:before{content:\"\\270f\"}.glyphicon-glass:before{content:\"\\e001\"}.glyphicon-music:before{content:\"\\e002\"}.glyphicon-search:before{content:\"\\e003\"}.glyphicon-heart:before{content:\"\\e005\"}.glyphicon-star:before{content:\"\\e006\"}.glyphicon-star-empty:before{content:\"\\e007\"}.glyphicon-user:before{content:\"\\e008\"}.glyphicon-film:before{content:\"\\e009\"}.glyphicon-th-large:before{content:\"\\e010\"}.glyphicon-th:before{content:\"\\e011\"}.glyphicon-th-list:before{content:\"\\e012\"}.glyphicon-ok:before{content:\"\\e013\"}.glyphicon-remove:before{content:\"\\e014\"}.glyphicon-zoom-in:before{content:\"\\e015\"}.glyphicon-zoom-out:before{content:\"\\e016\"}.glyphicon-off:before{content:\"\\e017\"}.glyphicon-signal:before{content:\"\\e018\"}.glyphicon-cog:before{content:\"\\e019\"}.glyphicon-trash:before{content:\"\\e020\"}.glyphicon-home:before{content:\"\\e021\"}.glyphicon-file:before{content:\"\\e022\"}.glyphicon-time:before{content:\"\\e023\"}.glyphicon-road:before{content:\"\\e024\"}.glyphicon-download-alt:before{content:\"\\e025\"}.glyphicon-download:before{content:\"\\e026\"}.glyphicon-upload:before{content:\"\\e027\"}.glyphicon-inbox:before{content:\"\\e028\"}.glyphicon-play-circle:before{content:\"\\e029\"}.glyphicon-repeat:before{content:\"\\e030\"}.glyphicon-refresh:before{content:\"\\e031\"}.glyphicon-list-alt:before{content:\"\\e032\"}.glyphicon-lock:before{content:\"\\e033\"}.glyphicon-flag:before{content:\"\\e034\"}.glyphicon-headphones:before{content:\"\\e035\"}.glyphicon-volume-off:before{content:\"\\e036\"}.glyphicon-volume-down:before{content:\"\\e037\"}.glyphicon-volume-up:before{content:\"\\e038\"}.glyphicon-qrcode:before{content:\"\\e039\"}.glyphicon-barcode:before{content:\"\\e040\"}.glyphicon-tag:before{content:\"\\e041\"}.glyphicon-tags:before{content:\"\\e042\"}.glyphicon-book:before{content:\"\\e043\"}.glyphicon-bookmark:before{content:\"\\e044\"}.glyphicon-print:before{content:\"\\e045\"}.glyphicon-camera:before{content:\"\\e046\"}.glyphicon-font:before{content:\"\\e047\"}.glyphicon-bold:before{content:\"\\e048\"}.glyphicon-italic:before{content:\"\\e049\"}.glyphicon-text-height:before{content:\"\\e050\"}.glyphicon-text-width:before{content:\"\\e051\"}.glyphicon-align-left:before{content:\"\\e052\"}.glyphicon-align-center:before{content:\"\\e053\"}.glyphicon-align-right:before{content:\"\\e054\"}.glyphicon-align-justify:before{content:\"\\e055\"}.glyphicon-list:before{content:\"\\e056\"}.glyphicon-indent-left:before{content:\"\\e057\"}.glyphicon-indent-right:before{content:\"\\e058\"}.glyphicon-facetime-video:before{content:\"\\e059\"}.glyphicon-picture:before{content:\"\\e060\"}.glyphicon-map-marker:before{content:\"\\e062\"}.glyphicon-adjust:before{content:\"\\e063\"}.glyphicon-tint:before{content:\"\\e064\"}.glyphicon-edit:before{content:\"\\e065\"}.glyphicon-share:before{content:\"\\e066\"}.glyphicon-check:before{content:\"\\e067\"}.glyphicon-move:before{content:\"\\e068\"}.glyphicon-step-backward:before{content:\"\\e069\"}.glyphicon-fast-backward:before{content:\"\\e070\"}.glyphicon-backward:before{content:\"\\e071\"}.glyphicon-play:before{content:\"\\e072\"}.glyphicon-pause:before{content:\"\\e073\"}.glyphicon-stop:before{content:\"\\e074\"}.glyphicon-forward:before{content:\"\\e075\"}.glyphicon-fast-forward:before{content:\"\\e076\"}.glyphicon-step-forward:before{content:\"\\e077\"}.glyphicon-eject:before{content:\"\\e078\"}.glyphicon-chevron-left:before{content:\"\\e079\"}.glyphicon-chevron-right:before{content:\"\\e080\"}.glyphicon-plus-sign:before{content:\"\\e081\"}.glyphicon-minus-sign:before{content:\"\\e082\"}.glyphicon-remove-sign:before{content:\"\\e083\"}.glyphicon-ok-sign:before{content:\"\\e084\"}.glyphicon-question-sign:before{content:\"\\e085\"}.glyphicon-info-sign:before{content:\"\\e086\"}.glyphicon-screenshot:before{content:\"\\e087\"}.glyphicon-remove-circle:before{content:\"\\e088\"}.glyphicon-ok-circle:before{content:\"\\e089\"}.glyphicon-ban-circle:before{content:\"\\e090\"}.glyphicon-arrow-left:before{content:\"\\e091\"}.glyphicon-arrow-right:before{content:\"\\e092\"}.glyphicon-arrow-up:before{content:\"\\e093\"}.glyphicon-arrow-down:before{content:\"\\e094\"}.glyphicon-share-alt:before{content:\"\\e095\"}.glyphicon-resize-full:before{content:\"\\e096\"}.glyphicon-resize-small:before{content:\"\\e097\"}.glyphicon-exclamation-sign:before{content:\"\\e101\"}.glyphicon-gift:before{content:\"\\e102\"}.glyphicon-leaf:before{content:\"\\e103\"}.glyphicon-fire:before{content:\"\\e104\"}.glyphicon-eye-open:before{content:\"\\e105\"}.glyphicon-eye-close:before{content:\"\\e106\"}.glyphicon-warning-sign:before{content:\"\\e107\"}.glyphicon-plane:before{content:\"\\e108\"}.glyphicon-calendar:before{content:\"\\e109\"}.glyphicon-random:before{content:\"\\e110\"}.glyphicon-comment:before{content:\"\\e111\"}.glyphicon-magnet:before{content:\"\\e112\"}.glyphicon-chevron-up:before{content:\"\\e113\"}.glyphicon-chevron-down:before{content:\"\\e114\"}.glyphicon-retweet:before{content:\"\\e115\"}.glyphicon-shopping-cart:before{content:\"\\e116\"}.glyphicon-folder-close:before{content:\"\\e117\"}.glyphicon-folder-open:before{content:\"\\e118\"}.glyphicon-resize-vertical:before{content:\"\\e119\"}.glyphicon-resize-horizontal:before{content:\"\\e120\"}.glyphicon-hdd:before{content:\"\\e121\"}.glyphicon-bullhorn:before{content:\"\\e122\"}.glyphicon-bell:before{content:\"\\e123\"}.glyphicon-certificate:before{content:\"\\e124\"}.glyphicon-thumbs-up:before{content:\"\\e125\"}.glyphicon-thumbs-down:before{content:\"\\e126\"}.glyphicon-hand-right:before{content:\"\\e127\"}.glyphicon-hand-left:before{content:\"\\e128\"}.glyphicon-hand-up:before{content:\"\\e129\"}.glyphicon-hand-down:before{content:\"\\e130\"}.glyphicon-circle-arrow-right:before{content:\"\\e131\"}.glyphicon-circle-arrow-left:before{content:\"\\e132\"}.glyphicon-circle-arrow-up:before{content:\"\\e133\"}.glyphicon-circle-arrow-down:before{content:\"\\e134\"}.glyphicon-globe:before{content:\"\\e135\"}.glyphicon-wrench:before{content:\"\\e136\"}.glyphicon-tasks:before{content:\"\\e137\"}.glyphicon-filter:before{content:\"\\e138\"}.glyphicon-briefcase:before{content:\"\\e139\"}.glyphicon-fullscreen:before{content:\"\\e140\"}.glyphicon-dashboard:before{content:\"\\e141\"}.glyphicon-paperclip:before{content:\"\\e142\"}.glyphicon-heart-empty:before{content:\"\\e143\"}.glyphicon-link:before{content:\"\\e144\"}.glyphicon-phone:before{content:\"\\e145\"}.glyphicon-pushpin:before{content:\"\\e146\"}.glyphicon-usd:before{content:\"\\e148\"}.glyphicon-gbp:before{content:\"\\e149\"}.glyphicon-sort:before{content:\"\\e150\"}.glyphicon-sort-by-alphabet:before{content:\"\\e151\"}.glyphicon-sort-by-alphabet-alt:before{content:\"\\e152\"}.glyphicon-sort-by-order:before{content:\"\\e153\"}.glyphicon-sort-by-order-alt:before{content:\"\\e154\"}.glyphicon-sort-by-attributes:before{content:\"\\e155\"}.glyphicon-sort-by-attributes-alt:before{content:\"\\e156\"}.glyphicon-unchecked:before{content:\"\\e157\"}.glyphicon-expand:before{content:\"\\e158\"}.glyphicon-collapse-down:before{content:\"\\e159\"}.glyphicon-collapse-up:before{content:\"\\e160\"}.glyphicon-log-in:before{content:\"\\e161\"}.glyphicon-flash:before{content:\"\\e162\"}.glyphicon-log-out:before{content:\"\\e163\"}.glyphicon-new-window:before{content:\"\\e164\"}.glyphicon-record:before{content:\"\\e165\"}.glyphicon-save:before{content:\"\\e166\"}.glyphicon-open:before{content:\"\\e167\"}.glyphicon-saved:before{content:\"\\e168\"}.glyphicon-import:before{content:\"\\e169\"}.glyphicon-export:before{content:\"\\e170\"}.glyphicon-send:before{content:\"\\e171\"}.glyphicon-floppy-disk:before{content:\"\\e172\"}.glyphicon-floppy-saved:before{content:\"\\e173\"}.glyphicon-floppy-remove:before{content:\"\\e174\"}.glyphicon-floppy-save:before{content:\"\\e175\"}.glyphicon-floppy-open:before{content:\"\\e176\"}.glyphicon-credit-card:before{content:\"\\e177\"}.glyphicon-transfer:before{content:\"\\e178\"}.glyphicon-cutlery:before{content:\"\\e179\"}.glyphicon-header:before{content:\"\\e180\"}.glyphicon-compressed:before{content:\"\\e181\"}.glyphicon-earphone:before{content:\"\\e182\"}.glyphicon-phone-alt:before{content:\"\\e183\"}.glyphicon-tower:before{content:\"\\e184\"}.glyphicon-stats:before{content:\"\\e185\"}.glyphicon-sd-video:before{content:\"\\e186\"}.glyphicon-hd-video:before{content:\"\\e187\"}.glyphicon-subtitles:before{content:\"\\e188\"}.glyphicon-sound-stereo:before{content:\"\\e189\"}.glyphicon-sound-dolby:before{content:\"\\e190\"}.glyphicon-sound-5-1:before{content:\"\\e191\"}.glyphicon-sound-6-1:before{content:\"\\e192\"}.glyphicon-sound-7-1:before{content:\"\\e193\"}.glyphicon-copyright-mark:before{content:\"\\e194\"}.glyphicon-registration-mark:before{content:\"\\e195\"}.glyphicon-cloud-download:before{content:\"\\e197\"}.glyphicon-cloud-upload:before{content:\"\\e198\"}.glyphicon-tree-conifer:before{content:\"\\e199\"}.glyphicon-tree-deciduous:before{content:\"\\e200\"}.glyphicon-cd:before{content:\"\\e201\"}.glyphicon-save-file:before{content:\"\\e202\"}.glyphicon-open-file:before{content:\"\\e203\"}.glyphicon-level-up:before{content:\"\\e204\"}.glyphicon-copy:before{content:\"\\e205\"}.glyphicon-paste:before{content:\"\\e206\"}.glyphicon-alert:before{content:\"\\e209\"}.glyphicon-equalizer:before{content:\"\\e210\"}.glyphicon-king:before{content:\"\\e211\"}.glyphicon-queen:before{content:\"\\e212\"}.glyphicon-pawn:before{content:\"\\e213\"}.glyphicon-bishop:before{content:\"\\e214\"}.glyphicon-knight:before{content:\"\\e215\"}.glyphicon-baby-formula:before{content:\"\\e216\"}.glyphicon-tent:before{content:\"\\26fa\"}.glyphicon-blackboard:before{content:\"\\e218\"}.glyphicon-bed:before{content:\"\\e219\"}.glyphicon-apple:before{content:\"\\f8ff\"}.glyphicon-erase:before{content:\"\\e221\"}.glyphicon-hourglass:before{content:\"\\231b\"}.glyphicon-lamp:before{content:\"\\e223\"}.glyphicon-duplicate:before{content:\"\\e224\"}.glyphicon-piggy-bank:before{content:\"\\e225\"}.glyphicon-scissors:before{content:\"\\e226\"}.glyphicon-bitcoin:before{content:\"\\e227\"}.glyphicon-btc:before{content:\"\\e227\"}.glyphicon-xbt:before{content:\"\\e227\"}.glyphicon-yen:before{content:\"\\00a5\"}.glyphicon-jpy:before{content:\"\\00a5\"}.glyphicon-ruble:before{content:\"\\20bd\"}.glyphicon-rub:before{content:\"\\20bd\"}.glyphicon-scale:before{content:\"\\e230\"}.glyphicon-ice-lolly:before{content:\"\\e231\"}.glyphicon-ice-lolly-tasted:before{content:\"\\e232\"}.glyphicon-education:before{content:\"\\e233\"}.glyphicon-option-horizontal:before{content:\"\\e234\"}.glyphicon-option-vertical:before{content:\"\\e235\"}.glyphicon-menu-hamburger:before{content:\"\\e236\"}.glyphicon-modal-window:before{content:\"\\e237\"}.glyphicon-oil:before{content:\"\\e238\"}.glyphicon-grain:before{content:\"\\e239\"}.glyphicon-sunglasses:before{content:\"\\e240\"}.glyphicon-text-size:before{content:\"\\e241\"}.glyphicon-text-color:before{content:\"\\e242\"}.glyphicon-text-background:before{content:\"\\e243\"}.glyphicon-object-align-top:before{content:\"\\e244\"}.glyphicon-object-align-bottom:before{content:\"\\e245\"}.glyphicon-object-align-horizontal:before{content:\"\\e246\"}.glyphicon-object-align-left:before{content:\"\\e247\"}.glyphicon-object-align-vertical:before{content:\"\\e248\"}.glyphicon-object-align-right:before{content:\"\\e249\"}.glyphicon-triangle-right:before{content:\"\\e250\"}.glyphicon-triangle-left:before{content:\"\\e251\"}.glyphicon-triangle-bottom:before{content:\"\\e252\"}.glyphicon-triangle-top:before{content:\"\\e253\"}.glyphicon-console:before{content:\"\\e254\"}.glyphicon-superscript:before{content:\"\\e255\"}.glyphicon-subscript:before{content:\"\\e256\"}.glyphicon-menu-left:before{content:\"\\e257\"}.glyphicon-menu-right:before{content:\"\\e258\"}.glyphicon-menu-down:before{content:\"\\e259\"}.glyphicon-menu-up:before{content:\"\\e260\"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#337ab7;text-decoration:none}a:focus,a:hover{color:#23527c;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.carousel-inner>.item>a>img,.carousel-inner>.item>img,.img-responsive,.thumbnail a>img,.thumbnail>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{display:inline-block;max-width:100%;height:auto;padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=button]{cursor:pointer}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-weight:400;line-height:1;color:#777}.h1,.h2,.h3,h1,h2,h3{margin-top:20px;margin-bottom:10px}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small{font-size:65%}.h4,.h5,.h6,h4,h5,h6{margin-top:10px;margin-bottom:10px}.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-size:75%}.h1,h1{font-size:36px}.h2,h2{font-size:30px}.h3,h3{font-size:24px}.h4,h4{font-size:18px}.h5,h5{font-size:14px}.h6,h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}.small,small{font-size:85%}.mark,mark{padding:.2em;background-color:#fcf8e3}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#337ab7}a.text-primary:focus,a.text-primary:hover{color:#286090}.text-success{color:#3c763d}a.text-success:focus,a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:focus,a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:focus,a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:focus,a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#337ab7}a.bg-primary:focus,a.bg-primary:hover{background-color:#286090}.bg-success{background-color:#dff0d8}a.bg-success:focus,a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:focus,a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:focus,a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:focus,a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ol,ul{margin-top:0;margin-bottom:10px}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;margin-left:-5px;list-style:none}.list-inline>li{display:inline-block;padding-right:5px;padding-left:5px}dl{margin-top:0;margin-bottom:20px}dd,dt{line-height:1.42857143}dt{font-weight:700}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[data-original-title],abbr[title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote ol:last-child,blockquote p:last-child,blockquote ul:last-child{margin-bottom:0}blockquote .small,blockquote footer,blockquote small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote .small:before,blockquote footer:before,blockquote small:before{content:'\\2014 \\00A0'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;text-align:right;border-right:5px solid #eee;border-left:0}.blockquote-reverse .small:before,.blockquote-reverse footer:before,.blockquote-reverse small:before,blockquote.pull-right .small:before,blockquote.pull-right footer:before,blockquote.pull-right small:before{content:''}.blockquote-reverse .small:after,.blockquote-reverse footer:after,.blockquote-reverse small:after,blockquote.pull-right .small:after,blockquote.pull-right footer:after,blockquote.pull-right small:after{content:'\\00A0 \\2014'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,.25)}kbd kbd{padding:0;font-size:100%;font-weight:700;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;color:#333;word-break:break-all;word-wrap:break-word;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.row{margin-right:-15px;margin-left:-15px}.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border:1px solid #ddd}.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=col-]{position:static;display:table-column;float:none}table td[class*=col-],table th[class*=col-]{position:static;display:table-cell;float:none}.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active{background-color:#f5f5f5}.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover{background-color:#e8e8e8}.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success{background-color:#dff0d8}.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover{background-color:#d0e9c6}.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info{background-color:#d9edf7}.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover{background-color:#c4e3f3}.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning{background-color:#fcf8e3}.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover{background-color:#faf2cc}.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger{background-color:#f2dede}.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover{background-color:#ebcccc}.table-responsive{min-height:.01%;overflow-x:auto}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>td,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>thead>tr>th{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:700}input[type=search]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{margin:4px 0 0;margin-top:1px\\9;line-height:normal}input[type=file]{display:block}input[type=range]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=file]:focus,input[type=checkbox]:focus,input[type=radio]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{background-color:transparent;border:0}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=search]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=date].form-control,input[type=time].form-control,input[type=datetime-local].form-control,input[type=month].form-control{line-height:34px}.input-group-sm input[type=date],.input-group-sm input[type=time],.input-group-sm input[type=datetime-local],.input-group-sm input[type=month],input[type=date].input-sm,input[type=time].input-sm,input[type=datetime-local].input-sm,input[type=month].input-sm{line-height:30px}.input-group-lg input[type=date],.input-group-lg input[type=time],.input-group-lg input[type=datetime-local],.input-group-lg input[type=month],input[type=date].input-lg,input[type=time].input-lg,input[type=datetime-local].input-lg,input[type=month].input-lg{line-height:46px}}.form-group{margin-bottom:15px}.checkbox,.radio{position:relative;display:block;margin-top:10px;margin-bottom:10px}.checkbox label,.radio label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:400;cursor:pointer}.checkbox input[type=checkbox],.checkbox-inline input[type=checkbox],.radio input[type=radio],.radio-inline input[type=radio]{position:absolute;margin-top:4px\\9;margin-left:-20px}.checkbox+.checkbox,.radio+.radio{margin-top:-5px}.checkbox-inline,.radio-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;font-weight:400;vertical-align:middle;cursor:pointer}.checkbox-inline+.checkbox-inline,.radio-inline+.radio-inline{margin-top:0;margin-left:10px}fieldset[disabled] input[type=checkbox],fieldset[disabled] input[type=radio],input[type=checkbox].disabled,input[type=checkbox][disabled],input[type=radio].disabled,input[type=radio][disabled]{cursor:not-allowed}.checkbox-inline.disabled,.radio-inline.disabled,fieldset[disabled] .checkbox-inline,fieldset[disabled] .radio-inline{cursor:not-allowed}.checkbox.disabled label,.radio.disabled label,fieldset[disabled] .checkbox label,fieldset[disabled] .radio label{cursor:not-allowed}.form-control-static{min-height:34px;padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-right:0;padding-left:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}select[multiple].input-sm,textarea.input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm select[multiple].form-control,.form-group-sm textarea.form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}select[multiple].input-lg,textarea.input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg select[multiple].form-control,.form-group-lg textarea.form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.form-group-lg .form-control+.form-control-feedback,.input-group-lg+.form-control-feedback,.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.form-group-sm .form-control+.form-control-feedback,.input-group-sm+.form-control-feedback,.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .checkbox,.has-success .checkbox-inline,.has-success .control-label,.has-success .help-block,.has-success .radio,.has-success .radio-inline,.has-success.checkbox label,.has-success.checkbox-inline label,.has-success.radio label,.has-success.radio-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;background-color:#dff0d8;border-color:#3c763d}.has-success .form-control-feedback{color:#3c763d}.has-warning .checkbox,.has-warning .checkbox-inline,.has-warning .control-label,.has-warning .help-block,.has-warning .radio,.has-warning .radio-inline,.has-warning.checkbox label,.has-warning.checkbox-inline label,.has-warning.radio label,.has-warning.radio-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;background-color:#fcf8e3;border-color:#8a6d3b}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .checkbox,.has-error .checkbox-inline,.has-error .control-label,.has-error .help-block,.has-error .radio,.has-error .radio-inline,.has-error.checkbox label,.has-error.checkbox-inline label,.has-error.radio label,.has-error.radio-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;background-color:#f2dede;border-color:#a94442}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .form-control,.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .checkbox,.form-inline .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .checkbox label,.form-inline .radio label{padding-left:0}.form-inline .checkbox input[type=checkbox],.form-inline .radio input[type=radio]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .checkbox,.form-horizontal .checkbox-inline,.form-horizontal .radio,.form-horizontal .radio-inline{padding-top:7px;margin-top:0;margin-bottom:0}.form-horizontal .checkbox,.form-horizontal .radio{min-height:27px}.form-horizontal .form-group{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.form-horizontal .control-label{padding-top:7px;margin-bottom:0;text-align:right}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.btn.active.focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn:active:focus,.btn:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn.focus,.btn:focus,.btn:hover{color:#333;text-decoration:none}.btn.active,.btn:active{background-image:none;outline:0;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none;opacity:.65}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default.focus,.btn-default:focus{color:#333;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active.focus,.btn-default.active:focus,.btn-default.active:hover,.btn-default:active.focus,.btn-default:active:focus,.btn-default:active:hover,.open>.dropdown-toggle.btn-default.focus,.open>.dropdown-toggle.btn-default:focus,.open>.dropdown-toggle.btn-default:hover{color:#333;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled.focus,.btn-default.disabled:focus,.btn-default.disabled:hover,.btn-default[disabled].focus,.btn-default[disabled]:focus,.btn-default[disabled]:hover,fieldset[disabled] .btn-default.focus,fieldset[disabled] .btn-default:focus,fieldset[disabled] .btn-default:hover{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#286090;border-color:#122b40}.btn-primary:hover{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active.focus,.btn-primary.active:focus,.btn-primary.active:hover,.btn-primary:active.focus,.btn-primary:active:focus,.btn-primary:active:hover,.open>.dropdown-toggle.btn-primary.focus,.open>.dropdown-toggle.btn-primary:focus,.open>.dropdown-toggle.btn-primary:hover{color:#fff;background-color:#204d74;border-color:#122b40}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled.focus,.btn-primary.disabled:focus,.btn-primary.disabled:hover,.btn-primary[disabled].focus,.btn-primary[disabled]:focus,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary.focus,fieldset[disabled] .btn-primary:focus,fieldset[disabled] .btn-primary:hover{background-color:#337ab7;border-color:#2e6da4}.btn-primary .badge{color:#337ab7;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#449d44;border-color:#255625}.btn-success:hover{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active.focus,.btn-success.active:focus,.btn-success.active:hover,.btn-success:active.focus,.btn-success:active:focus,.btn-success:active:hover,.open>.dropdown-toggle.btn-success.focus,.open>.dropdown-toggle.btn-success:focus,.open>.dropdown-toggle.btn-success:hover{color:#fff;background-color:#398439;border-color:#255625}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled.focus,.btn-success.disabled:focus,.btn-success.disabled:hover,.btn-success[disabled].focus,.btn-success[disabled]:focus,.btn-success[disabled]:hover,fieldset[disabled] .btn-success.focus,fieldset[disabled] .btn-success:focus,fieldset[disabled] .btn-success:hover{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#31b0d5;border-color:#1b6d85}.btn-info:hover{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active.focus,.btn-info.active:focus,.btn-info.active:hover,.btn-info:active.focus,.btn-info:active:focus,.btn-info:active:hover,.open>.dropdown-toggle.btn-info.focus,.open>.dropdown-toggle.btn-info:focus,.open>.dropdown-toggle.btn-info:hover{color:#fff;background-color:#269abc;border-color:#1b6d85}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled.focus,.btn-info.disabled:focus,.btn-info.disabled:hover,.btn-info[disabled].focus,.btn-info[disabled]:focus,.btn-info[disabled]:hover,fieldset[disabled] .btn-info.focus,fieldset[disabled] .btn-info:focus,fieldset[disabled] .btn-info:hover{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning.focus,.btn-warning:focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active.focus,.btn-warning.active:focus,.btn-warning.active:hover,.btn-warning:active.focus,.btn-warning:active:focus,.btn-warning:active:hover,.open>.dropdown-toggle.btn-warning.focus,.open>.dropdown-toggle.btn-warning:focus,.open>.dropdown-toggle.btn-warning:hover{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled.focus,.btn-warning.disabled:focus,.btn-warning.disabled:hover,.btn-warning[disabled].focus,.btn-warning[disabled]:focus,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning.focus,fieldset[disabled] .btn-warning:focus,fieldset[disabled] .btn-warning:hover{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active.focus,.btn-danger.active:focus,.btn-danger.active:hover,.btn-danger:active.focus,.btn-danger:active:focus,.btn-danger:active:hover,.open>.dropdown-toggle.btn-danger.focus,.open>.dropdown-toggle.btn-danger:focus,.open>.dropdown-toggle.btn-danger:hover{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled.focus,.btn-danger.disabled:focus,.btn-danger.disabled:hover,.btn-danger[disabled].focus,.btn-danger[disabled]:focus,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger.focus,fieldset[disabled] .btn-danger:focus,fieldset[disabled] .btn-danger:hover{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{font-weight:400;color:#337ab7;border-radius:0}.btn-link,.btn-link.active,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:active,.btn-link:focus,.btn-link:hover{border-color:transparent}.btn-link:focus,.btn-link:hover{color:#23527c;text-decoration:underline;background-color:transparent}.btn-link[disabled]:focus,.btn-link[disabled]:hover,fieldset[disabled] .btn-link:focus,fieldset[disabled] .btn-link:hover{color:#777;text-decoration:none}.btn-group-lg>.btn,.btn-lg{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-group-sm>.btn,.btn-sm{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-property:height,visibility;-o-transition-property:height,visibility;transition-property:height,visibility}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid\\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown,.dropup{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{color:#262626;text-decoration:none;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:focus,.dropdown-menu>.active>a:hover{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{color:#777}.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{text-decoration:none;cursor:not-allowed;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false)}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{right:0;left:auto}.dropdown-menu-left{right:auto;left:0}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{content:\"\";border-top:0;border-bottom:4px dashed;border-bottom:4px solid\\9}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{right:0;left:auto}.navbar-right .dropdown-menu-left{right:auto;left:0}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;float:left}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group-vertical>.btn:hover,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus,.btn-group>.btn:hover{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-bottom-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-right:8px;padding-left:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-right:12px;padding-left:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-top-right-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{display:table-cell;float:none;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=buttons]>.btn input[type=checkbox],[data-toggle=buttons]>.btn input[type=radio],[data-toggle=buttons]>.btn-group>.btn input[type=checkbox],[data-toggle=buttons]>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=col-]{float:none;padding-right:0;padding-left:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn,textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn,textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn{height:auto}.input-group .form-control,.input-group-addon,.input-group-btn{display:table-cell}.input-group .form-control:not(:first-child):not(:last-child),.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:400;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=checkbox],.input-group-addon input[type=radio]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn-group:not(:last-child)>.btn,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:first-child>.btn-group:not(:first-child)>.btn,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:active,.input-group-btn>.btn:focus,.input-group-btn>.btn:hover{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{padding-left:0;margin-bottom:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:focus,.nav>li>a:hover{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:focus,.nav>li.disabled>a:hover{color:#777;text-decoration:none;cursor:not-allowed;background-color:transparent}.nav .open>a,.nav .open>a:focus,.nav .open>a:hover{background-color:#eee;border-color:#337ab7}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus,.nav-tabs>li.active>a:hover{color:#555;cursor:default;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:focus,.nav-pills>li.active>a:hover{color:#fff;background-color:#337ab7}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{padding-right:15px;padding-left:15px;overflow-x:visible;-webkit-overflow-scrolling:touch;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block!important;height:auto!important;padding-bottom:0;overflow:visible!important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse{padding-right:0;padding-left:0}}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:200px}}.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-bottom,.navbar-fixed-top{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-bottom,.navbar-fixed-top{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;height:50px;padding:15px 15px;font-size:18px;line-height:20px}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;padding:9px 10px;margin-top:8px;margin-right:15px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu .dropdown-header,.navbar-nav .open .dropdown-menu>li>a{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:focus,.navbar-nav .open .dropdown-menu>li>a:hover{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}}.navbar-form{padding:10px 15px;margin-top:8px;margin-right:-15px;margin-bottom:8px;margin-left:-15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1)}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .form-control,.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .checkbox,.navbar-form .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .checkbox label,.navbar-form .radio label{padding-left:0}.navbar-form .checkbox input[type=checkbox],.navbar-form .radio input[type=radio]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;padding-top:0;padding-bottom:0;margin-right:0;margin-left:0;border:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-left-radius:0;border-top-right-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-right:15px;margin-left:15px}}@media (min-width:768px){.navbar-left{float:left!important}.navbar-right{float:right!important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:focus,.navbar-default .navbar-brand:hover{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:focus,.navbar-default .navbar-nav>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:focus,.navbar-default .navbar-nav>.disabled>a:hover{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:focus,.navbar-default .navbar-toggle:hover{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#555;background-color:#e7e7e7}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:focus,.navbar-default .btn-link:hover{color:#333}.navbar-default .btn-link[disabled]:focus,.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:focus,fieldset[disabled] .navbar-default .btn-link:hover{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:focus,.navbar-inverse .navbar-brand:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:focus,.navbar-inverse .navbar-nav>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:focus,.navbar-inverse .navbar-nav>.disabled>a:hover{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:focus,.navbar-inverse .navbar-toggle:hover{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:focus,.navbar-inverse .navbar-nav>.open>a:hover{color:#fff;background-color:#080808}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:focus,.navbar-inverse .btn-link:hover{color:#fff}.navbar-inverse .btn-link[disabled]:focus,.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:focus,fieldset[disabled] .navbar-inverse .btn-link:hover{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{padding:0 5px;color:#ccc;content:\"/\\00a0\"}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:3;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:focus,.pager li>a:hover{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:focus,.pager .disabled>a:hover,.pager .disabled>span{color:#777;cursor:not-allowed;background-color:#fff}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:focus,a.label:hover{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:focus,.label-default[href]:hover{background-color:#5e5e5e}.label-primary{background-color:#337ab7}.label-primary[href]:focus,.label-primary[href]:hover{background-color:#286090}.label-success{background-color:#5cb85c}.label-success[href]:focus,.label-success[href]:hover{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:focus,.label-info[href]:hover{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:focus,.label-warning[href]:hover{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:focus,.label-danger[href]:hover{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}a.badge:focus,a.badge:hover{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#337ab7;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron .h1,.jumbotron h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{padding-right:15px;padding-left:15px;border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-right:60px;padding-left:60px}.jumbotron .h1,.jumbotron h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail a>img,.thumbnail>img{margin-right:auto;margin-left:auto}a.thumbnail.active,a.thumbnail:focus,a.thumbnail:hover{border-color:#337ab7}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:700}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{height:20px;margin-bottom:20px;overflow:hidden;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-bar-striped,.progress-striped .progress-bar{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress-bar.active,.progress.active .progress-bar{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-info{background-color:#5bc0de}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{overflow:hidden;zoom:1}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-body,.media-left,.media-right{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{padding-left:0;margin-bottom:20px}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:focus,a.list-group-item:hover,button.list-group-item:focus,button.list-group-item:hover{color:#555;text-decoration:none;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:focus,.list-group-item.disabled:hover{color:#777;cursor:not-allowed;background-color:#eee}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:focus,.list-group-item.active:hover{z-index:2;color:#fff;background-color:#337ab7;border-color:#337ab7}.list-group-item.active .list-group-item-heading,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:focus .list-group-item-text,.list-group-item.active:hover .list-group-item-text{color:#c7ddef}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:focus,a.list-group-item-success:hover,button.list-group-item-success:focus,button.list-group-item-success:hover{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,a.list-group-item-success.active:focus,a.list-group-item-success.active:hover,button.list-group-item-success.active,button.list-group-item-success.active:focus,button.list-group-item-success.active:hover{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:focus,a.list-group-item-info:hover,button.list-group-item-info:focus,button.list-group-item-info:hover{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,a.list-group-item-info.active:focus,a.list-group-item-info.active:hover,button.list-group-item-info.active,button.list-group-item-info.active:focus,button.list-group-item-info.active:hover{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:focus,a.list-group-item-warning:hover,button.list-group-item-warning:focus,button.list-group-item-warning:hover{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,a.list-group-item-warning.active:focus,a.list-group-item-warning.active:hover,button.list-group-item-warning.active,button.list-group-item-warning.active:focus,button.list-group-item-warning.active:hover{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:focus,a.list-group-item-danger:hover,button.list-group-item-danger:focus,button.list-group-item-danger:hover{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,a.list-group-item-danger.active:focus,a.list-group-item-danger.active:hover,button.list-group-item-danger.active,button.list-group-item-danger.active:focus,button.list-group-item-danger.active:hover{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-left-radius:3px;border-top-right-radius:3px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>.small,.panel-title>.small>a,.panel-title>a,.panel-title>small,.panel-title>small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-left-radius:3px;border-top-right-radius:3px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-left-radius:0;border-top-right-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.panel-collapse>.table,.panel>.table,.panel>.table-responsive>.table{margin-bottom:0}.panel>.panel-collapse>.table caption,.panel>.table caption,.panel>.table-responsive>.table caption{padding-right:15px;padding-left:15px}.panel>.table-responsive:first-child>.table:first-child,.panel>.table:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table:first-child>thead:first-child>tr:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child{border-top-left-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child{border-top-right-radius:3px}.panel>.table-responsive:last-child>.table:last-child,.panel>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:3px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child td,.panel>.table>tbody:first-child>tr:first-child th{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{margin-bottom:0;border:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:4px}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.list-group,.panel-group .panel-heading+.panel-collapse>.panel-body{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#337ab7}.panel-primary>.panel-heading{color:#fff;background-color:#337ab7;border-color:#337ab7}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#337ab7}.panel-primary>.panel-heading .badge{color:#337ab7;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#337ab7}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);box-shadow:inset 0 1px 1px rgba(0,0,0,.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);opacity:.2}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}button.close{-webkit-appearance:none;padding:0;cursor:pointer;background:0 0;border:0}.modal-open{overflow:hidden}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.modal.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{filter:alpha(opacity=0);opacity:0}.modal-backdrop.in{filter:alpha(opacity=50);opacity:.5}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-bottom:0;margin-left:5px}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:12px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;filter:alpha(opacity=0);opacity:0;line-break:auto}.tooltip.in{filter:alpha(opacity=90);opacity:.9}.tooltip.top{padding:5px 0;margin-top:-3px}.tooltip.right{padding:0 5px;margin-left:3px}.tooltip.bottom{padding:5px 0;margin-top:3px}.tooltip.left{padding:0 5px;margin-left:-3px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{right:5px;bottom:0;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.popover{position:absolute;top:0;left:0;z-index:1060;display:none;max-width:276px;padding:1px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);line-break:auto}.popover.top{margin-top:-10px}.popover.right{margin-left:10px}.popover.bottom{margin-top:10px}.popover.left{margin-left:-10px}.popover-title{padding:8px 14px;margin:0;font-size:14px;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0}.popover-content{padding:9px 14px}.popover>.arrow,.popover>.arrow:after{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid}.popover>.arrow{border-width:11px}.popover>.arrow:after{content:\"\";border-width:10px}.popover.top>.arrow{bottom:-11px;left:50%;margin-left:-11px;border-top-color:#999;border-top-color:rgba(0,0,0,.25);border-bottom-width:0}.popover.top>.arrow:after{bottom:1px;margin-left:-10px;content:\" \";border-top-color:#fff;border-bottom-width:0}.popover.right>.arrow{top:50%;left:-11px;margin-top:-11px;border-right-color:#999;border-right-color:rgba(0,0,0,.25);border-left-width:0}.popover.right>.arrow:after{bottom:-10px;left:1px;content:\" \";border-right-color:#fff;border-left-width:0}.popover.bottom>.arrow{top:-11px;left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:#999;border-bottom-color:rgba(0,0,0,.25)}.popover.bottom>.arrow:after{top:1px;margin-left:-10px;content:\" \";border-top-width:0;border-bottom-color:#fff}.popover.left>.arrow{top:50%;right:-11px;margin-top:-11px;border-right-width:0;border-left-color:#999;border-left-color:rgba(0,0,0,.25)}.popover.left>.arrow:after{right:1px;bottom:-10px;content:\" \";border-right-width:0;border-left-color:#fff}.carousel{position:relative}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner>.item{position:relative;display:none;-webkit-transition:.6s ease-in-out left;-o-transition:.6s ease-in-out left;transition:.6s ease-in-out left}.carousel-inner>.item>a>img,.carousel-inner>.item>img{line-height:1}@media all and (transform-3d),(-webkit-transform-3d){.carousel-inner>.item{-webkit-transition:-webkit-transform .6s ease-in-out;-o-transition:-o-transform .6s ease-in-out;transition:transform .6s ease-in-out;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-perspective:1000px;perspective:1000px}.carousel-inner>.item.active.right,.carousel-inner>.item.next{left:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.carousel-inner>.item.active.left,.carousel-inner>.item.prev{left:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.carousel-inner>.item.active,.carousel-inner>.item.next.left,.carousel-inner>.item.prev.right{left:0;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.carousel-inner>.active,.carousel-inner>.next,.carousel-inner>.prev{display:block}.carousel-inner>.active{left:0}.carousel-inner>.next,.carousel-inner>.prev{position:absolute;top:0;width:100%}.carousel-inner>.next{left:100%}.carousel-inner>.prev{left:-100%}.carousel-inner>.next.left,.carousel-inner>.prev.right{left:0}.carousel-inner>.active.left{left:-100%}.carousel-inner>.active.right{left:100%}.carousel-control{position:absolute;top:0;bottom:0;left:0;width:15%;font-size:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6);background-color:rgba(0,0,0,0);filter:alpha(opacity=50);opacity:.5}.carousel-control.left{background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,.0001)));background-image:linear-gradient(to right,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);background-repeat:repeat-x}.carousel-control.right{right:0;left:auto;background-image:-webkit-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.0001)),to(rgba(0,0,0,.5)));background-image:linear-gradient(to right,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);background-repeat:repeat-x}.carousel-control:focus,.carousel-control:hover{color:#fff;text-decoration:none;filter:alpha(opacity=90);outline:0;opacity:.9}.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{position:absolute;top:50%;z-index:5;display:inline-block;margin-top:-10px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{left:50%;margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{right:50%;margin-right:-10px}.carousel-control .icon-next,.carousel-control .icon-prev{width:20px;height:20px;font-family:serif;line-height:1}.carousel-control .icon-prev:before{content:'\\2039'}.carousel-control .icon-next:before{content:'\\203a'}.carousel-indicators{position:absolute;bottom:10px;left:50%;z-index:15;width:60%;padding-left:0;margin-left:-30%;text-align:center;list-style:none}.carousel-indicators li{display:inline-block;width:10px;height:10px;margin:1px;text-indent:-999px;cursor:pointer;background-color:#000\\9;background-color:rgba(0,0,0,0);border:1px solid #fff;border-radius:10px}.carousel-indicators .active{width:12px;height:12px;margin:0;background-color:#fff}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6)}.carousel-caption .btn{text-shadow:none}@media screen and (min-width:768px){.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{width:30px;height:30px;margin-top:-10px;font-size:30px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{margin-right:-10px}.carousel-caption{right:20%;left:20%;padding-bottom:30px}.carousel-indicators{bottom:20px}}.btn-group-vertical>.btn-group:after,.btn-group-vertical>.btn-group:before,.btn-toolbar:after,.btn-toolbar:before,.clearfix:after,.clearfix:before,.container-fluid:after,.container-fluid:before,.container:after,.container:before,.dl-horizontal dd:after,.dl-horizontal dd:before,.form-horizontal .form-group:after,.form-horizontal .form-group:before,.modal-footer:after,.modal-footer:before,.modal-header:after,.modal-header:before,.nav:after,.nav:before,.navbar-collapse:after,.navbar-collapse:before,.navbar-header:after,.navbar-header:before,.navbar:after,.navbar:before,.pager:after,.pager:before,.panel-body:after,.panel-body:before,.row:after,.row:before{display:table;content:\" \"}.btn-group-vertical>.btn-group:after,.btn-toolbar:after,.clearfix:after,.container-fluid:after,.container:after,.dl-horizontal dd:after,.form-horizontal .form-group:after,.modal-footer:after,.modal-header:after,.nav:after,.navbar-collapse:after,.navbar-header:after,.navbar:after,.pager:after,.panel-body:after,.row:after{clear:both}.center-block{display:block;margin-right:auto;margin-left:auto}.pull-right{float:right!important}.pull-left{float:left!important}.hide{display:none!important}.show{display:block!important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none!important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-lg,.visible-md,.visible-sm,.visible-xs{display:none!important}.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block{display:none!important}@media (max-width:767px){.visible-xs{display:block!important}table.visible-xs{display:table!important}tr.visible-xs{display:table-row!important}td.visible-xs,th.visible-xs{display:table-cell!important}}@media (max-width:767px){.visible-xs-block{display:block!important}}@media (max-width:767px){.visible-xs-inline{display:inline!important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block!important}table.visible-sm{display:table!important}tr.visible-sm{display:table-row!important}td.visible-sm,th.visible-sm{display:table-cell!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block!important}table.visible-md{display:table!important}tr.visible-md{display:table-row!important}td.visible-md,th.visible-md{display:table-cell!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block!important}}@media (min-width:1200px){.visible-lg{display:block!important}table.visible-lg{display:table!important}tr.visible-lg{display:table-row!important}td.visible-lg,th.visible-lg{display:table-cell!important}}@media (min-width:1200px){.visible-lg-block{display:block!important}}@media (min-width:1200px){.visible-lg-inline{display:inline!important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block!important}}@media (max-width:767px){.hidden-xs{display:none!important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none!important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none!important}}@media (min-width:1200px){.hidden-lg{display:none!important}}.visible-print{display:none!important}@media print{.visible-print{display:block!important}table.visible-print{display:table!important}tr.visible-print{display:table-row!important}td.visible-print,th.visible-print{display:table-cell!important}}.visible-print-block{display:none!important}@media print{.visible-print-block{display:block!important}}.visible-print-inline{display:none!important}@media print{.visible-print-inline{display:inline!important}}.visible-print-inline-block{display:none!important}@media print{.visible-print-inline-block{display:inline-block!important}}@media print{.hidden-print{display:none!important}}\n/*# sourceMappingURL=bootstrap.min.css.map */"; });
define('text!dialog-demo/info-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n                <h2>Edit User</h2>\r\n        </ai-dialog-header>  \r\n\r\n        <ai-dialog-body>\r\n            <div class=\"text-center\">\r\n                <div class=\"row\">\r\n                    <strong>First Name: </strong> ${info.firstName} / ${userArr.firstName}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>Last Name: </strong> ${info.lastName}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>emailAddress: </strong> ${info.emailAddress}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>City: </strong> ${info.city}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <strong>Country: </strong> ${info.country}\r\n                </div>\r\n                <div class=\"row\">\r\n                    <h4>Is this information correct?</h4>\r\n                </div>\r\n            </div>        \r\n        </ai-dialog-body>\r\n        \r\n        <ai-dialog-footer>\r\n            <button class=\"btn btn-primary\" click.trigger=\"yes()\">Yes</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"no()\">No</button>\r\n        </ai-dialog-footer>  \r\n    </ai-dialog>\r\n</template>"; });
define('text!dialog-demo/roles-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../views/widgets/inputs/form-checkbox\"></require>\r\n    <require from=\"../views/widgets/inputs/form-select\"></require>\r\n    <require from=\"../views/widgets/inputs/form-filter-role\"></require>\r\n\r\n    <ai-dialog>\r\n        <ai-dialog-header>\r\n            <h2>${title}</h2>\r\n        </ai-dialog-header>\r\n\r\n        <ai-dialog-body>\r\n            <table class=\"table border-none half-n-half\">\r\n                <tbody>\r\n                <tr>\r\n                    <td><label>ID:</label> ${userRole.id}</td>\r\n                    <td><label>Name:</label> ${userRole.firstName} ${userRole.lastName}</td>\r\n                </tr>\r\n                <tr>\r\n                    <td>\r\n                        <form-checkbox inp-name=\"userRole_isMember\"\r\n                            inp-label=\"MRT Member\"                            \r\n                            model.two-way=\"userRole.isMember\"\r\n                            init-selected.two-way=\"userRole.isMember\"\r\n                            input-only=\"true\"></form-checkbox>\r\n                    </td>\r\n                    <td class=\"xxx_wrap-role\">\r\n                        <form-filter-role name=\"userRole_system_role\" model.two-way=\"userRole.systemRoles.value\" options.bind=\"lkp_role\" changed.two-way=\"userRole.systemRoles.value\"\r\n                            init-selected.two-way=\"userRole.systemRoles.value\"></form-filter-role>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </ai-dialog-body>\r\n\r\n        <ai-dialog-footer>\r\n            <button class=\"btn btn-primary\" click.trigger=\"yes()\">Yes</button>\r\n            <button class=\"btn btn-default pull-left\" click.trigger=\"cancel()\">Cancel</button>\r\n        </ai-dialog-footer>\r\n    </ai-dialog>\r\n</template>"; });
define('text!resources/select2.html', ['module'], function(module) { module.exports = "<template>select2\r\n    <select name.bind=\"name\" value.bind=\"selected\" id.bind=\"name\">\r\n        <option repeat.for=\"option of options\" value.bind=\"option.value\">${option.label}</option>\r\n    </select>\r\n</template>"; });
define('text!user-info/set-info.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <div class=\"col-md-2\"></div>\r\n    <div class=\"col-md-8\">\r\n        <form action=\"\" submit.trigger=\"save()\">\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"firstName\" placeholder=\"First Name\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"lastName\" placeholder=\"Last Name\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"emailAddress\" placeholder=\"emailAddress\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"city\" placeholder=\"City\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <input type=\"text\" class=\"form-control\" value.bind=\"country\" placeholder=\"Country\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n                <button class=\"btn btn-primary\" type=\"submit\">Save</button>\r\n            </div>\r\n        </form>\r\n    </div>\r\n    \r\n</template>"; });
define('text!user-info/view-info.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <div class=\"col-md-2\"></div>\r\n    <div class=\"col-md-8\">\r\n        <div class=\"text-center\">\r\n            <div class=\"row\">\r\n                <strong>First Name: </strong> ${userInfo.first_ame}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>Last Name: </strong> ${userInfo.lastName}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>emailAddress: </strong> ${userInfo.emailAddress}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>City: </strong> ${userInfo.city}\r\n            </div>\r\n            <div class=\"row\">\r\n                <strong>Country: </strong> ${userInfo.country}\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n</template>"; });
define('text!views/pages/login.html', ['module'], function(module) { module.exports = "<template>\r\n    ${title}\r\n</template>"; });
define('text!views/pages/user-add.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/inputs/form-input\"></require>\r\n  <require from=\"../widgets/inputs/form-select\"></require>\r\n  <require from=\"../widgets/inputs/form-radio\"></require>\r\n  <require from=\"../widgets/inputs/form-checkbox\"></require>\r\n  <require from=\"../widgets/form-user-full-body\"></require>\r\n  <require from=\"../widgets/btn-xc-all\"></require>\r\n\r\n  <div class=\"btn-group btn-edit-avatar pull-right\" role=\"group\" aria-label=\"user options\">\r\n\r\n    <div class=\"btn-group\" role=\"group\">\r\n      <button class=\"btn btn-default dropdown-toggle btn-i\" type=\"button\"\r\n        id=\"dropdownMenu1\"\r\n        data-toggle=\"dropdown\"\r\n        aria-haspopup=\"true\"\r\n        aria-expanded=\"true\">\r\n          <i class=\"fa fa-pencil\"></i>\r\n          David Bowie\r\n          <span class=\"caret\"></span>\r\n      </button>\r\n      <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\">\r\n        <li><a href=\"#\"><i class=\"fa fa-fw fa-pencil\"></i> Change Username</a></li>\r\n        <li><a href=\"#\"><i class=\"fa fa-fw fa-photo\"></i> Change Avatar</a></li>\r\n      </ul>\r\n    </div>\r\n\r\n    <a class=\"btn btn-default avatar\">\r\n      <img src=\"/src/img/low.jpg\" alt=\"tmp me\">\r\n    </a>\r\n\r\n  </div>\r\n\r\n\r\n  <h1 class=\"display-inline-block\">${title}</h1>\r\n  <btn-xc-all wrapper-id=\"user-panels\"></btn-xc-all>\r\n\r\n  <form role=\"form\" class=\"form-horizontal\" id=\"user-panels\">\r\n<!--cust-xc-expanded=\"true\"-->\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"User\" cust-body=\"user-details\" cust-xc=\"true\" cust-xc-id=\"xc_user\" cust-xc-expanded=\"true\"></form-user-full-body>\r\n\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"MRT Role Information\" cust-body=\"user-mrt-role\" cust-xc=\"true\" cust-xc-id=\"xc_mrt-role\"></form-user-full-body>\r\n\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"Languages\" cust-body=\"user-languages\" cust-xc=\"true\" cust-xc-id=\"xc_languages\"></form-user-full-body>\r\n\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"Passport Information\" cust-body=\"user-passport\" cust-xc=\"true\" cust-xc-id=\"xc_passport\"></form-user-full-body>\r\n\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"Visa Information\" cust-body=\"user-visa\" cust-xc=\"true\" cust-xc-id=\"xc_visa\"></form-user-full-body>\r\n\r\n    <form-user-full-body user.bind=\"user\" cust-title=\"Training\" cust-body=\"user-training\" cust-xc=\"true\" cust-xc-id=\"xc_training\"></form-user-full-body>\r\n\r\n    <!--<form-user-full-body user.bind=\"user\" cust-title=\"TWIC Information\" cust-body=\"user-twic\" cust-xc=\"true\" cust-xc-id=\"xc_twic\"></form-user-full-body>-->\r\n\r\n    <form-user-full-body if.bind=\"user.permissions.accessConfidentialFields\" cust-icon=\"fa-exclamation-triangle\" user.bind=\"user\" cust-title=\"Confidential Information\" cust-body=\"user-confidential\" cust-xc=\"true\" cust-xc-id=\"xc_confidential\"></form-user-full-body>\r\n\r\n  </form>\r\n\r\n  <div class=\"button-bar col-md-12 padding-x-0 text-align-right\">\r\n      <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/pages/user-no-selection.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/user-list\"></require>\r\n\r\n  <div class=\"col-md-12\" if.bind=\"title\">\r\n    <h1>${title}<span class=\"html-file-name\">(user-no-selection.html)</span></h1>\r\n    <hr>\r\n  </div>\r\n\r\n  <user-list class=\"col-md-12\"></user-list>\r\n\r\n</template>"; });
define('text!views/pages/user-selected.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/user-list\"></require>\r\n  <require from=\"../widgets/user-edit\"></require>\r\n  <require from=\"./user-add\"></require>\r\n\r\n  <!--<div class=\"col-md-12\">\r\n    <h1>${title}<span class=\"html-file-name\">(user-selected.html)</span></h1>\r\n    <hr>\r\n  </div>-->\r\n\r\n  <div if.bind=\"!editType\">\r\n    <user-list class=\"col-xs-12 col-md-8\"></user-list>\r\n\r\n    <div class=\"col-xs-12 col-md-4\">\r\n      <user-edit user.bind=\"user\"></user-edit>\r\n    </div>\r\n  </div>\r\n\r\n  <div if.bind=\"user && editType=='edit'\" class=\"col-xs-12\">\r\n    <user-add user.bind=\"user\"></user-add>\r\n  </div>\r\n\r\n</template>"; });
define('text!views/pages/welcome.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../widgets/list-activity\"></require>\r\n    <require from=\"../widgets/user-list\"></require>\r\n\r\n    <!--<div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <h1>${title}<span class=\"html-file-name\">(welcome.html)</span></h1>\r\n        </div>\r\n    </div>\r\n\r\n    <hr>-->\r\n\r\n    <!--<div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <div id=\"exTab2\" class=\"containerXXX\">\r\n                <ul class=\"nav nav-pills\">\r\n                    <li class=\"active\">\r\n                        <a href=\"#home\" data-toggle=\"tab\">Home</a>\r\n                    </li>\r\n                    <li><a href=\"#team\" data-toggle=\"tab\">Team</a>\r\n                    </li>\r\n                </ul>\r\n\r\n                <div class=\"tab-content clearfix\">\r\n                    <div class=\"tab-pane active\" id=\"home\">\r\n                        <h3>Home</h3>\r\n                    </div>\r\n                    <div class=\"tab-pane\" id=\"team\">\r\n                        <h3>Team</h3>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>-->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-md-6\">\r\n            <list-activity></list-activity>\r\n        </div>\r\n\r\n        <div class=\"col-md-6\">\r\n            <user-list cust-title=\"Users-lite\" cust-disable-cells=\"['firstName','personalNumber','systemRoles']\" cust-table-pagination.bind=\"true\"\r\n                cust-table-page-size.bind=\"10\"></user-list>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/btn-xc-all.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"wrap_xc_btns_all\">\r\n    <a click.trigger=\"xc_all('expand')\">${CV.BTN_XC_Expand}</a>\r\n    <div class=\"divider\"></div>\r\n    <a click.trigger=\"xc_all('collapse')\">${CV.BTN_XC_Collapse}</a>\r\n  </div>\r\n</template>"; });
define('text!views/widgets/form-user-full-body.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"./user-panels/user-panel-details\"></require>\r\n    <require from=\"./user-panels/user-panel-mrt-role\"></require>\r\n    <require from=\"./user-panels/user-panel-languages\"></require>    \r\n    <require from=\"./user-panels/user-panel-passport\"></require>\r\n    <require from=\"./user-panels/user-panel-visa\"></require>\r\n    <require from=\"./user-panels/user-panel-training\"></require>\r\n    <require from=\"./user-panels/user-panel-twic\"></require>\r\n    <require from=\"./user-panels/user-panel-confidential\"></require>\r\n    \r\n    <div class=\"panel panel-default panel-xc\">\r\n        <div class=\"panel-heading cursor-hover ${custXcExpanded ? '' : 'collapsed'}\" data-toggle=\"collapse\"\r\n                data-target=\"#${custXcId}\">\r\n            <i if.bind=\"custIcon\" class=\"fa ${custIcon} text-after\"></i>\r\n\r\n            ${custTitle}\r\n             <!--| ${user.firstName} | ${user.lkp_regions_selected} > ${user.lkp_hub_selected} > ${user.lkp_segment_selected} > ${user.lkp_entity_selected}-->\r\n            <button if.bind=\"custXc\" class=\"btn btn-xc_chevron btn-xs\" type=\"button\"                \r\n                aria-expanded=\"${custXcExpanded}\"\r\n                aria-controls=\"collapseExample\">\r\n            </button>\r\n        </div>\r\n\r\n        <div id=\"${custXcId}\" class=\"panel-body row row-col-xxs-12 row-col-xs-6 row-col-sm-6 row-col-md-6 ${custXc ? 'collapse' : ''} ${custXcExpanded ? 'in' : ''} ${custXcResClass ? custXcResClass : 'row-col-lg-4'}\">\r\n            <div class=\"wrap-fields\">\r\n                <user-panel-details if.bind=\"custBody=='user-details'\" user.bind=\"user\"></user-panel-details>                \r\n                <user-panel-mrt-role if.bind=\"custBody=='user-mrt-role'\" user.bind=\"user\"></user-panel-mrt-role>\r\n                <user-panel-languages if.bind=\"custBody=='user-languages'\" user.bind=\"user\"></user-panel-languages>\r\n                <user-panel-passport if.bind=\"custBody=='user-passport'\" user.bind=\"user\"></user-panel-passport>\r\n                <user-panel-visa if.bind=\"custBody=='user-visa'\" user.bind=\"user\"></user-panel-visa>\r\n                <user-panel-training if.bind=\"custBody=='user-training'\" user.bind=\"user\"></user-panel-training>\r\n                <user-panel-twic if.bind=\"custBody=='user-twic'\" user.bind=\"user\"></user-panel-twic>\r\n                <user-panel-confidential if.bind=\"custBody=='user-confidential'\" user.bind=\"user\"></user-panel-confidential>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/list-activity.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <div class=\"hdr-wrap\">\r\n        <h1 class=\"hdr-inline\">${title}<span class=\"html-file-name\">(list-activity.html)</span></h1>\r\n    </div>\r\n\r\n    <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\">Future Events<i class=\"fa fa-bell pull-right\"></i></div>\r\n        <div class=\"panel-body\">\r\n            <table class=\"table table-striped\">\r\n                <thead>\r\n                    <tr>\r\n                        <th>Date</th>\r\n                        <th>Activity</th>\r\n                        <th>Status</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr>\r\n                        <td>08/04/2017</td>\r\n                        <td>My profile status will need updating</td>\r\n                        <td><i class=\"fa fa-pencil\"></i></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>03/04/2017</td>\r\n                        <td>My password will need updating</td>\r\n                        <td><i class=\"fa fa-lock\"></i></td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\">${title2}<i class=\"fa fa-history pull-right\"></i></div>\r\n        <div class=\"panel-body\">\r\n            <table class=\"table table-striped\">\r\n                <thead>\r\n                    <tr>\r\n                        <th>Date</th>\r\n                        <th>Activity</th>\r\n                        <th>Status</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr>\r\n                        <td>23/01/2017 17:31pm</td>\r\n                        <td><a href=\"#\">David Bowie</a> updated profile</td>\r\n                        <td><i class=\"fa fa-pencil\"></i></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>22/01/2017 09:44pm</td>\r\n                        <td><a href=\"#\">David Bowie</a> added to MRT</td>\r\n                        <td><i class=\"fa fa-plus\"></i></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>18/01/2017 11:57pm</td>\r\n                        <td><a href=\"#\">Charles Carter</a> deleted from MRT</td>\r\n                        <td><i class=\"fa fa-minus\"></i></td>\r\n                    </tr>\r\n                </tbody>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/prompt.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog>\r\n    <ai-dialog-body>\r\n      <h2>Dialog</h2>\r\n    </ai-dialog-body>\r\n  </ai-dialog>\r\n</template>"; });
define('text!views/widgets/user-edit.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../widgets/inputs/form-input\"></require>\r\n\r\n  <div class=\"hdr-wrap\">\r\n    <h1 class=\"hdr-inline\">${title}<span class=\"html-file-name\">(user-edit.html)</span></h1>\r\n  </div>\r\n\r\n  <!--<p>id: ${user.id}</p>\r\n  <p>originalUser.firstName: ${originalUser.firstName}</p>\r\n  <p>user.firstName: ${user.firstName}</p>-->\r\n\r\n  <div class=\"panel panel-bp margin-x-0 has-button-bar\">\r\n    <div class=\"panel-body row\">\r\n      \r\n      <form role=\"form\" class=\"form-horizontal\">\r\n\r\n        <form-input name=\"firstName\" model.two-way=\"user.firstName\"></form-input>\r\n        <form-input name=\"lastName\" model.two-way=\"user.lastName\" inp-label=\"Last Name\"></form-input>\r\n        <form-input name=\"emailAddress\" model.two-way=\"user.emailAddress\" inp-label=\"emailAddress\"></form-input>\r\n        <form-input name=\"personalNumber\" model.two-way=\"user.personalNumber\" inp-label=\"Telephone\"></form-input>\r\n\r\n      </form>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div bind.if=\"user\">\r\n    <div class=\"button-bar col-md-12 padding-x-0 text-align-right\">\r\n      <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n    </div>\r\n  </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-list.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../widgets/inputs/form-input\"></require>\r\n    <require from=\"../widgets/inputs/form-filter-text\"></require>\r\n    <require from=\"../widgets/inputs/form-filter-role\"></require>\r\n    <require from=\"../widgets/inputs/form-select\"></require>\r\n    <require from=\"../../resources/format/format-date\"></require>\r\n\r\n    <div class=\"hdr-wrap\" if.bind=\"!custHideTitleBar\">\r\n        <h1 class=\"hdr-inline\">${title}<span class=\"html-file-name\">(user-list.html)</span></h1>\r\n        <a class=\"btn btn-default btn-i pull-right\" click.delegate=\"addUser()\">\r\n            <i class=\"fa fa-plus\"></i>Add User\r\n        </a>\r\n    </div>\r\n\r\n    <p if.bind=\"debugShowOutput\">found: ${found} / ${selectedId} / filter: ${filters}</p>\r\n    <p if.bind=\"debugShowOutput\">rolesArrDynamic: ${rolesArrDynamic}</p>\r\n    <p if.bind=\"debugShowOutput\">filters[1].value: ${filters[1].value} / ${rolesArrDynamic}</p>\r\n\r\n    <div class=\"row margin-y-g2\">\r\n        <div class=\"col-xs-6\">\r\n            <form-filter-text model.two-way=\"filters[0].value\"></form-filter-text>\r\n        </div>\r\n\r\n        <div class=\"col-xs-6\">\r\n            <form-filter-role model.two-way=\"filters[1].value\" options.bind=\"lkp_role\" changed.two-way=\"filters[1].value\"\r\n                init-selected.two-way=\"filters[1].value\"></form-filter-role>\r\n        </div>\r\n    </div>\r\n\r\n    <table class=\"table table-striped\" aurelia-table=\"data.bind: users; display-data.bind: $displayData; filters.bind: filters; current-page.bind: currentPage; page-size.bind: custTablePageSize; total-items.bind: totalItems;\">\r\n        <thead>\r\n            <tr>\r\n                <th aut-sort=\"key: id; default: desc\" if.bind=\"isNotDisabled('id')\">id</th>\r\n                <th aut-sort=\"key: firstName\" if.bind=\"isNotDisabled('firstName')\">First Name</th>\r\n                <th aut-sort=\"key: lastName\" if.bind=\"isNotDisabled('lastName')\">Last Name</th>\r\n                <th aut-sort=\"key: emailAddress\" if.bind=\"isNotDisabled('emailAddress')\">E-mail</th>\r\n                <th aut-sort=\"key: personalNumber\" if.bind=\"isNotDisabled('personalNumber')\">Telephone</th>\r\n                <th aut-sort=\"key: systemRoles.value\" if.bind=\"isNotDisabled('systemRoles')\">Role</th>\r\n                <th if.bind=\"isNotDisabled('edit')\">Edit</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n            <tr repeat.for=\"user of $displayData\" class=\"${user.id === $parent.selectedId ? 'active' : ''}\">\r\n                <td if.bind=\"isNotDisabled('id')\">${user.id}</td>\r\n                <td if.bind=\"isNotDisabled('firstName')\">${user.firstName}</td>\r\n                <td if.bind=\"isNotDisabled('lastName')\">${user.lastName}</td>\r\n                <td if.bind=\"isNotDisabled('emailAddress')\"><a href=\"mailto:${user.emailAddress}\">${user.emailAddress}</a></td>\r\n                <td if.bind=\"isNotDisabled('personalNumber')\"><a href=\"tel:${user.personalNumber}\">${user.personalNumber}</a></td>\r\n                <td if.bind=\"isNotDisabled('systemRoles')\">${user.systemRoles.name}</td>\r\n                <td if.bind=\"isNotDisabled('edit')\">\r\n                    <div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"User actions\">\r\n                        <!--<a class=\"btn btn-default\" route-href=\"route: users; params.bind: {id:user.id}\" title=\"Quick edit\">\r\n                            <i class=\"fa fa-pencil\"></i>\r\n                        </a>-->\r\n                        <a class=\"btn btn-default\" route-href=\"route: user-edit; params.bind: {id:user.id, editType:'edit'}\" title=\"Full edit\">\r\n                            <i class=\"fa fa-list\"></i>\r\n                        </a>\r\n                        <a class=\"btn btn-default\" click.delegate=\"changeUserRoles(user.id)\" title=\"Change User Permissions\">\r\n                            <i class=\"fa fa-cog\"></i>\r\n                        </a>\r\n                        <a class=\"btn btn-default\" click.delegate=\"deleteUser(user.id)\" title=\"Delete User\">\r\n                            <i class=\"fa fa-trash\"></i>\r\n                        </a>\r\n                    </div>\r\n                </td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n    <div class=\"row\" if.bind=\"custTablePagination\">\r\n        <div class=\"col-md-7\">\r\n            <aut-pagination current-page.bind=\"currentPage\" page-size.bind=\"custTablePageSize\" total-items.bind=\"totalItems\" pagination-size.bind=\"5\"\r\n                boundary-links.bind=\"true\"> </aut-pagination>\r\n        </div>\r\n\r\n        <div class=\"col-md-5\">\r\n            <div class=\"form-inline\">\r\n                <div class=\"form-group pull-right\">\r\n                    <label for=\"custTablePageSize\">Page Size: </label>\r\n                    <select value.bind=\"custTablePageSize\" id=\"custTablePageSize\" class=\"form-control\">\r\n                        <option model.bind=\"5\">5</option>\r\n                        <option model.bind=\"10\">10</option>\r\n                        <option model.bind=\"20\">20</option>\r\n                        <option model.bind=\"50\">50</option>\r\n                        <option model.bind=\"100\">100</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!views/ui/nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./ui-header\"></require>\r\n    \r\n    <ui-header></ui-header>\r\n    \r\n    <nav id=\"header\" class=\"navbar navbar-default navbar-static-topXXX\" role=\"navigation\">\r\n    <div class=\"container\">\r\n        <div class=\"navbar-header\">\r\n            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\r\n                <span class=\"sr-only\">Toggle Navigation</span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n            </button>\r\n            <a class=\"navbar-brand\" href=\"/#/\">\r\n                <i class=\"fa fa-home\"></i>\r\n                <span>${router.title}</span>\r\n            </a>\r\n        </div>\r\n\r\n        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\r\n            <ul class=\"nav navbar-nav\">\r\n                <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\r\n                    <a href.bind=\"row.href\">${row.title}</a>\r\n                </li>\r\n            </ul>\r\n\r\n            <ul class=\"nav navbar-nav navbar-right\">\r\n                <li class=\"loader\" if.bind=\"router.isNavigating\">\r\n                    <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n        </div>\r\n\r\n        </nav>\r\n\r\n\r\n\r\n</template>"; });
define('text!views/ui/ui-footer.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <footer>        \r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-6\">\r\n                    <ul class=\"ul-inline-piped\">\r\n                        <li>${CV.SITE_OWNER_ABBR} ${CV.SITE_NAME}</li>\r\n                    </ul>\r\n                </div>\r\n                 <div class=\"col-xs-6 text-align-right\">\r\n                    <span>${CV.COPYRIGHT}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </header>\r\n\r\n</template>"; });
define('text!views/ui/ui-header.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <header class=\"container\">\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-8 logo-wrap\">\r\n                <a class=\"logo\" href=\"#\" title=\"${CV.SITE_NAME}\">\r\n                    <img src=\"/src/css/bp-responsive.svg\" alt=\"${CV.SITE_NAME_ABBR}\">\r\n                    \r\n                    <!--<h3>${CV.SITE_NAME}</h3>-->\r\n                </a>\r\n                <img class=\"strapline\" src=\"/src/img/MRT_Identifier_V1b.png\">\r\n            </div>\r\n            <div class=\"col-xs-4 user\">\r\n                <div class=\"btn-group btn-edit-avatar\" role=\"group\" aria-label=\"user options\">\r\n\r\n                    <div class=\"btn-group\" role=\"group\">\r\n                        <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" \r\n                            data-toggle=\"dropdown\"\r\n                            aria-haspopup=\"true\"\r\n                            aria-expanded=\"true\">\r\n                            Alex Mack\r\n                            <span class=\"caret\"></span>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\">\r\n                            <li><a href=\"#\"><i class=\"fa fa-fw fa-cog\"></i> Profile Settings</a></li>\r\n                            <li><a href=\"#\"><i class=\"fa fa-fw fa-bell\"></i> Notifications</a></li>\r\n                            <li role=\"separator\" class=\"divider\"></li>\r\n                            <li><a href=\"#\"><i class=\"fa fa-fw fa-sign-out\"></i> Log out</a></li>\r\n                        </ul>\r\n                    </div>\r\n\r\n                    <a class=\"btn btn-default avatar\">\r\n                        <img src=\"/src/img/tmp-avatar-me.jpg\" alt=\"tmp me\">\r\n                    </a>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </header>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-checkbox.html', ['module'], function(module) { module.exports = "<template class=\"${inputOnly ? 'form-group-input-only' : 'form-group col-xs-12'} ${isMandatory ? 'is-mandatory' : ''}\">\r\n\r\n    <span if.bind=\"!inputOnly\" class=\"col-xs-6 col-debug\">\r\n        <label for.bind=\"inpName\" title.bind=\"inpLabel\">\r\n            ${inpLabel} / ${model}\r\n        </label>\r\n    </span>\r\n    <span if.bind=\"!inputOnly\" class=\"col-xs-6 col-debug\">\r\n        <label for.bind=\"inpName\" if.bind=\"inputOnly\" class=\"label-with-checkbox ${inpPlacement ? 'checkbox-' + inpPlacement : ''}\">\r\n            ${inpLabel}\r\n        </label>\r\n        <input type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">\r\n    </span>\r\n\r\n\r\n    <label if.bind=\"inputOnly\" class=\"label-with-checkbox ${inpPlacement ? 'checkbox-' + inpPlacement : ''}\">\r\n        <input type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">\r\n        ${inpLabel}\r\n    </label>\r\n\r\n\r\n    <!--<span class=\"${inputOnly ? '' : 'col-xs-4'} col-debug\">\r\n        <label if.bind=\"inputOnly\" class=\"label-with-checkbox ${inpPlacement ? 'checkbox-' + inpPlacement : ''}\">\r\n            <input type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">${inpLabel}\r\n        </label>\r\n        <input if.bind=\"!inputOnly\" type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">\r\n    </span>-->\r\n</template>"; });
define('text!views/widgets/inputs/form-filter-role.html', ['module'], function(module) { module.exports = "<template class=\"input-group\">\r\n    \r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n    <require from=\"select2/css/select2.min.css\"></require>\r\n\r\n    <span class=\"input-group-addon\" id=\"basic-addon3\">\r\n        <i class=\"fa fa-cog text-after\"></i>\r\n        Role\r\n    </span>\r\n\r\n    <select if.bind=\"!autocomplete\" class=\"form-control\" value.bind=\"initSelected\" disabled.bind=\"!isEnabled\" selected.two-way=\"selected\"\r\n        change.delegate=\"changeCallback($event)\">\r\n        <option value=\"\">${inpPlaceholder}</option>                 \r\n        <option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option.value\">\r\n            ${option.name}\r\n        </option>\r\n    </select>\r\n\r\n    <select if.bind=\"autocomplete\" class=\"form-control\" id.bind=\"name\" select2.bind=\"selectOptions\" value.bind=\"initSelected\"\r\n        disabled.bind=\"!isEnabled\" change.delegate=\"changeCallback($event)\">\r\n        \r\n        <option value=\"\">${inpPlaceholder}</option>\r\n        <option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option.value\">\r\n            ${option.name}\r\n        </option>\r\n    </select>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-filter-text.html', ['module'], function(module) { module.exports = "<template class=\"input-group\">\r\n    <span class=\"input-group-addon\" id=\"basic-addon3\">\r\n        <i class=\"fa fa-filter text-after\"></i>\r\n        ${inpLabel}\r\n    </span>\r\n    <input type=\"text\" value.bind=\"model\" placeholder=\"Enter filter text\" class=\"form-control\" />\r\n</template>"; });
define('text!views/widgets/inputs/form-input.html', ['module'], function(module) { module.exports = "<template class=\"form-group col-xs-12 ${isMandatory ? 'is-mandatory' : ''}\">\r\n    \r\n    <require from=\"aurelia-mask/masked-input\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <label class=\"col-xs-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n        <!--<i if.bind=\"isReadonly\" class=\"fa fa-eye text-after\" title=\"Read Only\"></i>\r\n        <i if.bind=\"isMemberOnly\" class=\"fa fa-exclamation-triangle text-after\" title=\"Members Only\"></i>-->\r\n        ${inpLabel}\r\n    </label>\r\n    <div class=\"col-xs-6\">\r\n        <input if.bind=\"maskPattern=='telephone'\" type=\"inpType\" masked=\"value.bind: model; mask.bind: maskPatternTelephone\" class=\"form-control\" id.one-way=\"name\" placeholder.bind=\"inpPlaceholder\"/>\r\n        <input if.bind=\"maskPattern=='telephone-cc'\" type=\"inpType\" masked=\"value.bind: model; mask.bind: maskPatternTelephoneCc\" class=\"form-control\" id.one-way=\"name\" placeholder.bind=\"inpPlaceholder\"/>\r\n        <input if.bind=\"inpType=='date'\" type=\"inpType\" value.bind=\"model | formatDate\" class=\"form-control\" id.one-way=\"name\" placeholder.bind=\"inpPlaceholder\">\r\n        <input if.bind=\"!maskPattern && inpType=='text'\" type=\"inpType\" value.bind=\"model\" class=\"form-control\" id.one-way=\"name\" placeholder.bind=\"inpPlaceholder\" readonly.bind=\"isReadonly\">\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-radio.html', ['module'], function(module) { module.exports = "<template class=\"form-group col-xs-12 ${isMandatory ? 'is-mandatory' : ''}\">\r\n\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n    <require from=\"./form-input\"></require>\r\n\r\n    <span class=\"${expiryDate ? 'col-xs-5 col-md-8' : 'col-xs-8'} col-debug\">\r\n        <label for.bind=\"inpName\" title.bind=\"inpLabel\">\r\n            ${inpLabel}\r\n        </label>\r\n    </span>\r\n    <span class=\"col-xs-2 ${expiryDate ? 'col-md-1' : ''} col-debug\">\r\n        <input type=\"radio\" name.bind=\"inpName\" model.bind=\"1\" checked.bind=\"model\"> Yes\r\n    </span>\r\n    <span class=\"col-xs-2 ${expiryDate ? 'col-md-1' : ''} col-debug\">\r\n        <input type=\"radio\" name.bind=\"inpName\" model.bind=\"0\" checked.bind=\"model\"> No\r\n    </span>\r\n    <span class=\"col-xs-3 ${expiryDate ? 'col-md-2' : ''} text-align-right col-debug\" if.bind=\"expiryDate\">\r\n        <input if.bind=\"expiryDate=='--'\" type=\"text\" value=\"--\" class=\"form-control\">\r\n        <input if.bind=\"expiryDate!='--'\" type=\"text\" value.bind=\"expiryDate | formatDate\" class=\"form-control\">\r\n    </span>\r\n\r\n</template>"; });
define('text!views/widgets/inputs/form-select.html', ['module'], function(module) { module.exports = "<template class=\"form-group col-xs-12 ${isMandatory ? 'is-mandatory' : ''}\">\r\n\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n    <require from=\"select2/css/select2.min.css\"></require>\r\n\r\n    <label class=\"col-xs-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n        ${inpLabel}\r\n        <!--${optionFilter ? ' > [' + optionFilter + ']' : ''}-->\r\n    </label>\r\n    <div class=\"col-xs-6\">\r\n        <!--/ ${changed} / ${initSelected} / ${selected}-->\r\n        <!--selected.two-way=\"selected\" -->\r\n        <!--| ${model} | ${selected} | ${changed} | ${initSelected}-->\r\n        <!--propArr: ${propArr[0]} | ${propArr[1]}-->\r\n        <select class=\"form-control\"\r\n            value.bind=\"initSelected\"\r\n            disabled.bind=\"!isEnabled\"\r\n            selected.two-way=\"selected\"\r\n            change.delegate=\"changeCallback($event)\">\r\n\r\n            <option value=\"\">${inpPlaceholder}</option>\r\n            <!--<option repeat.for=\"option of options | filter:'parentValue':optionFilter\" model.bind=\"option[propArr[0]]\">-->\r\n            <option repeat.for=\"option of options | filter:optionFilter[0]:optionFilter[1]\"\r\n                model.bind=\"option[propArr[0]]\"\r\n                css=\"background-color:red\"\r\n                >\r\n                ${option[propArr[1]]}\r\n            </option>\r\n        </select>\r\n\r\n        <!--<select if.bind=\"autocomplete\" class=\"form-control\"\r\n            id.bind=\"name\"\r\n            select2.bind=\"selectOptions\"\r\n            value.bind=\"initSelected\"\r\n            disabled.bind=\"!isEnabled\"\r\n            change.delegate=\"changeCallback($event)\">\r\n\r\n            <option value=\"\">${inpPlaceholder}</option>\r\n            <option repeat.for=\"option of options | filter:optionFilter[0]:optionFilter[1]\" model.bind=\"option[propArr[0]]\">\r\n                ${option[propArr[1]]}\r\n            </option>\r\n        </select>-->\r\n\r\n    </div>\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-confidential.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/constants\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n\r\n    <form-select inp-label=\"Member Status\"\r\n        model.two-way=\"tmpMemberStatus\"\r\n        options.bind=\"lkp_memberStatus\"\r\n        changed.two-way=\"tmpMemberStatus\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"tmpMemberStatus\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <form-input inp-type=\"date\" model.two-way=\"user.profile.entityStatus.createdOn\" inp-label=\"Date Joined\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n    <div class=\"divider dotted\"></div>\r\n\r\n    <!--<form-select inp-label=\"Username/NTID\"\r\n        prop-arr.bind=\"['value','loginName']\"\r\n        model.two-way=\"user.user.id\"\r\n        options.bind=\"lkp_userProfiles\"\r\n        changed.two-way=\"user.user.id\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.user.id\"\r\n        is-mandatory.bind=\"true\"></form-select>-->\r\n\r\n    <form-select inp-label=\"Credentials Level\"\r\n        prop-arr.bind=\"['value','name']\"\r\n        model.two-way=\"user.user.systemRoles.value\"\r\n        options.bind=\"lkp_credentialLevels\"\r\n        changed.two-way=\"user.user.systemRoles.value\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.user.systemRoles.value\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n        <div class=\"divider dotted\"></div>\r\n\r\n    <form-input model.two-way=\"tmpField2\" inp-label=\"Confidential Field 2\"></form-input>\r\n     <form-input model.two-way=\"tmpField3\" inp-label=\"Confidential Field 3\"></form-input>\r\n\r\n    <div class=\"divider dotted\"></div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-details.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../filter\"></require>\r\n    <require from=\"../../../resources/constants\"></require>\r\n    <require from=\"../../../resources/select2\"></require>\r\n\r\n    <form-input name=\"firstName\" model.two-way=\"user.user.firstName\" inp-label=\"First Name\" is-readonly.bind=\"true\"></form-input>\r\n    <form-input name=\"lastName\" model.two-way=\"user.user.lastName\" inp-label=\"Last Name\" is-readonly.bind=\"true\"></form-input>\r\n    <form-input name=\"loginName\" model.two-way=\"user.user.loginName\" inp-label=\"Username/NTID\" is-readonly.bind=\"true\"></form-input>\r\n    <form-input name=\"emailAddress\" model.two-way=\"user.user.emailAddress\" inp-label=\"Email Address\" is-readonly.bind=\"true\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n    <div class=\"col-xs-12\" if.bind=\"CV.debugShowOutput\">? DEV NOTE: SELECT [1,3,8,9] ... SELECTED: ${user.firstName}: ${user.lkp_regions_selected} > ${user.lkp_hub_selected} > ${user.lkp_segment_selected} > ${user.lkp_entity_selected} ?</div>\r\n    \r\n     <!--<div class=\"divider\"></div>\r\n    ? ${user.profile.region.id} > ${user.profile.hub.id} !\r\n     <div class=\"divider\"></div>-->\r\n\r\n    <form-select name=\"region\"\r\n        model.two-way=\"user.profile.region.id\"\r\n        options.bind=\"lkp_regions\"\r\n        changed.two-way=\"user.profile.region.id\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.profile.region.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <form-select inp-label=\"hub\"\r\n        model.two-way=\"user.profile.hub.id\"\r\n        options.bind=\"lkp_hub\"\r\n        changed.two-way=\"user.profile.hub.id\"        \r\n        init-selected.two-way=\"user.profile.hub.id\"\r\n        option-filter.bind=\"['regionId',user.profile.region.id]\"\r\n        is-enabled.bind=\"user.profile.region.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <!--<div class=\"form-group col-xs-12\">\r\n        <label class=\"col-sm-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n            Hub\r\n        </label>\r\n        <div class=\"col-sm-6\">\r\n            <select class=\"form-control\"\r\n                model.bind=\"user.profile.hub.id\"\r\n                disabled.bind=\"!user.profile.region.id\"        \r\n                >        \r\n                <option value=\"\">Select...</option>\r\n                <option repeat.for=\"option of lkp_hub | filter:'regionId':user.profile.region.id\" value=\"option.id\" selected.bind=\"option.id==user.profile.hub.id\">\r\n                    ${option.name}\r\n                </option>\r\n            </select>\r\n        </div>\r\n    </div>-->\r\n  \r\n     <div class=\"divider\"></div>\r\n     \r\n    <form-select name=\"segment\"\r\n        model.two-way=\"user.profile.segment.id\"\r\n        options.bind=\"lkp_segment\"\r\n        changed.two-way=\"user.profile.segment.id\"        \r\n        init-selected.two-way=\"user.profile.segment.id\"\r\n        autocomplete.bind=\"true\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <form-select inp-label=\"Entity\"\r\n        model.two-way=\"user.profile.entity.id\"\r\n        options.bind=\"lkp_entity\"\r\n        changed.two-way=\"user.profile.entity.id\"        \r\n        init-selected.two-way=\"user.profile.entity.id\"\r\n        option-filter.bind=\"['segmentId',user.profile.segment.id]\"\r\n        is-enabled.bind=\"user.profile.segment.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n    <!--<div class=\"form-group col-xs-12\">\r\n        <label class=\"col-sm-6\" for.bind=\"name\" title.bind=\"inpLabel\">\r\n            Entity\r\n        </label>\r\n        <div class=\"col-sm-6\">\r\n            <select class=\"form-control\"\r\n                model.bind=\"user.profile.entity.id\"\r\n                disabled.bind=\"!user.profile.segment.id\"        \r\n                >        \r\n                <option value=\"\">Select...</option>\r\n                <option repeat.for=\"option of lkp_entity | filter:'segmentId':user.profile.segment.id\" value=\"option.id\" selected.bind=\"option.id==user.profile.entity.id\">\r\n                    ${option.name}\r\n                </option>\r\n            </select>\r\n        </div>\r\n    </div>-->\r\n\r\n    <!--<form-select name=\"lkp_entity\"\r\n        model.two-way=\"user.lkp_entity_selected\"\r\n        options.bind=\"lkp_entity\"\r\n        changed.two-way=\"user.lkp_entity_selected\"        \r\n        init-selected.two-way=\"user.lkp_entity_selected\"\r\n        option-filter.bind=\"user.lkp_segment_selected\"\r\n        autocomplete.bind=\"true\"\r\n        is-enabled.bind=\"user.lkp_regions_selected && user.lkp_hub_selected && user.lkp_segment_selected\"></form-select>-->\r\n\r\n    \r\n    <div class=\"divider\"></div>\r\n\r\n    <form-input inp-label=\"Function\" model.two-way=\"user.profile.function\" is-mandatory.bind=\"true\"></form-input>\r\n    <form-input inp-label=\"Location\" model.two-way=\"user.profile.location\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n    \r\n    <form-select inp-label=\"BP Office\"\r\n        model.two-way=\"user.profile.office.id\"\r\n        options.bind=\"lkp_bp_office_address\"\r\n        changed.two-way=\"user.profile.office.id\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.profile.office.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <div class=\"divider\"></div>\r\n    \r\n    <form-input name=\"businessNumber\" model.two-way=\"user.profile.businessNumber\" mask-pattern=\"telephone\" inp-label=\"Business Cell Number\" is-mandatory.bind=\"true\"></form-input>\r\n    <form-input name=\"personalNumber\" model.two-way=\"user.profile.personalNumber\" mask-pattern=\"telephone\" inp-label=\"Personal Cell Number\"></form-input>\r\n    <form-input name=\"officeNumber\" model.two-way=\"user.profile.officeNumber\" mask-pattern=\"telephone\" inp-label=\"Office Number\"></form-input>\r\n    <form-input name=\"lyncNumber\" model.two-way=\"user.profile.lyncNumber\" mask-pattern=\"telephone\" inp-label=\"Lync Number\"></form-input>\r\n    <form-input name=\"homeNumber\" model.two-way=\"user.profile.homeNumber\" mask-pattern=\"telephone\" inp-label=\"Home Number\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <form-input name=\"lineManager\" model.two-way=\"user.user.lineManager.displayName\" inp-label=\"Line Manager\" is-readonly.bind=\"true\"></form-input>\r\n    <form-input name=\"lineManager_emailAddress\" model.two-way=\"user.user.lineManager.emailAddress\" inp-label=\"Line Manager Email\" is-readonly.bind=\"true\"></form-input>\r\n    <form-input name=\"loginName\" model.two-way=\"user.user.lineManager.loginName\" inp-label=\"Line Manager NTID\" is-readonly.bind=\"true\"></form-input>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <form-input name=\"emergencyContactName\" model.two-way=\"user.profile.emergencyContactName\" inp-label=\"Emergency Contact Name\" is-mandatory.bind=\"true\"></form-input>\r\n    <form-input name=\"emergencyContactNumber\" model.two-way=\"user.profile.emergencyContactNumber\" mask-pattern=\"telephone\" inp-label=\"Emergency Contact Number\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-languages.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../../../resources/format/format-date\"></require>\r\n\r\n    <div class=\"repeaters row-fluid\" repeat.for=\"row of user.profile.languages\">\r\n        \r\n        <div if.bind=\"$index>0\" class=\"divider dotted\"></div>\r\n\r\n        <form-select name=\"lkp_language[$index]\" inp-label=\"Language\"\r\n            model.two-way=\"user.profile.languages[$index].language.id\"\r\n            options.bind=\"lkp_languages\"\r\n            changed.two-way=\"user.profile.languages[$index].language.id\"\r\n            autocomplete.bind=\"true\"\r\n            init-selected.two-way=\"user.profile.languages[$index].language.id\"></form-select>\r\n\r\n        <form-select name=\"lkp_languageLevel[$index]\" inp-label=\"Language Level\"\r\n            prop-arr.bind=\"['value','name']\"\r\n            model.two-way=\"user.profile.languages[$index].proficiency.value\"\r\n            options.bind=\"lkp_languageLevel\"\r\n            changed.two-way=\"user.profile.languages[$index].proficiency.value\"\r\n            init-selected.two-way=\"user.profile.languages[$index].proficiency.value\"\r\n            is-enabled.bind=\"user.profile.languages[$index].language.id\"></form-select>\r\n\r\n        <div class=\"col-xs-12 margin-bottom-g1\">\r\n            <button class=\"btn btn-default btn-sm\" if.bind=\"$index+1 == user.profile.languages.length && $index+1<lkp_languages_limitTo\">\r\n                <i class=\"fa fa-plus\"></i>\r\n                Add Language\r\n            </button>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-mrt-role.html', ['module'], function(module) { module.exports = "<template>\r\n    \r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n\r\n    <form-select name=\"lkp_member_status\" inp-label=\"Coat Size\"\r\n        model.two-way=\"user.profile.coatSize.id\"\r\n        options.bind=\"lkp_coatSizes\"\r\n        changed.two-way=\"user.profile.coatSize.id\"\r\n        init-selected.two-way=\"user.profile.coatSize.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <form-select name=\"Primary ICS\"\r\n        model.two-way=\"user.profile.primaryPosition.id\"\r\n        options.bind=\"lkp_primaryPositions\"\r\n        changed.two-way=\"user.profile.primaryPosition.id\"\r\n        autocomplete.bind=\"true\"\r\n        init-selected.two-way=\"user.profile.primaryPosition.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n    <form-select inp-label=\"Secondary ICS\"\r\n        model.two-way=\"user.profile.secondaryPosition.id\"\r\n        options.bind=\"lkp_secondaryPositions\"\r\n        changed.two-way=\"user.profile.secondaryPosition.id\"        \r\n        init-selected.two-way=\"user.profile.secondaryPosition.id\"\r\n        option-filter.bind=\"['primaryPositionId',user.profile.primaryPosition.id]\"\r\n        is-enabled.bind=\"user.profile.primaryPosition.id\"\r\n        is-mandatory.bind=\"true\"></form-select>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-passport.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../inputs/form-checkbox\"></require>\r\n\r\n    <div class=\"repeaters row-fluid\" repeat.for=\"row of user.profile.passports\">\r\n\r\n        <div if.bind=\"$index>0\" class=\"divider dotted\"></div>\r\n\r\n        <form-select inp-label=\"Passport Type\"\r\n            prop-arr.bind=\"['value','name']\"\r\n            model.two-way=\"user.profile.passports[$index].type.value\"\r\n            options.bind=\"lkp_passportTypes\"\r\n            changed.two-way=\"user.profile.passports[$index].type.value\"\r\n            autocomplete.bind=\"true\"\r\n            init-selected.two-way=\"user.profile.passports[$index].type.value\"\r\n            is-mandatory.bind=\"true\"></form-select>\r\n\r\n        <form-input model.two-way=\"user.profile.passports[$index].number\" inp-label=\"Passport Number\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n        <form-select inp-label=\"Passport Nationality\"\r\n            model.two-way=\"user.profile.passports[$index].country.id\"\r\n            options.bind=\"lkp_passportNationality\"\r\n            changed.two-way=\"user.profile.passports[$index].country.id\"\r\n            autocomplete.bind=\"true\"\r\n            init-selected.two-way=\"user.profile.passports[$index].country.id\"\r\n            is-mandatory.bind=\"true\"></form-select>\r\n\r\n        <form-input inp-type=\"date\" model.two-way=\"user.profile.passports[$index].expiresOn\" inp-label=\"Passport Expiry Date\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n        <div class=\"btn-row text-align-left\" if.bind=\"$index+1 == user.profile.passports.length\">\r\n            <button class=\"btn btn-default btn-sm btn-i\">\r\n                <i class=\"fa fa-plus\"></i>\r\n                Add Passport\r\n            </button>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-training.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-radio\"></require>\r\n\r\n    <div class=\"row-fluid\">\r\n        <div class=\"col-xs-12\" innerhtml.bind=\"message\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"divider\"></div>\r\n\r\n    <div class=\"repeaters row-fluid margin-bottom-g1\" repeat.for=\"row of user.profile.trainings\">\r\n\r\n        <div if.bind=\"$index>0\" class=\"divider dotted\"></div>\r\n\r\n        <div class=\"col-xs-12\">\r\n            <form-radio inp-name.bind=\"['training_' + $index]\"\r\n                inp-label.bind=\"user.profile.trainings[$index].training.name\"\r\n                model.two-way=\"user.profile.trainings[$index].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[$index].expiresOn ? user.profile.trainings[$index].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[$index].training.id\"></form-radio>\r\n        </div>\r\n\r\n    </div>\r\n\r\n        <!--<div class=\"col-xs-12\">\r\n            <form-radio inp-name.bind.bind=\"'training_ics\" inp-label.bind=\"user.profile.trainings[0].training.name\" model.two-way=\"user.profile.trainings[0].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[0].expiresOn ? user.profile.trainings[0].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[0].training.id\"></form-radio>\r\n        </div>\r\n\r\n        <div class=\"divider dotted\"></div>\r\n\r\n        <div class=\"col-xs-12\">\r\n            <form-radio inp-name.bind=\"'training_haz'\" inp-label.bind=\"user.profile.trainings[1].training.name\" model.two-way=\"user.profile.trainings[1].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[1].expiresOn ? user.profile.trainings[1].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[1].training.id\"></form-radio>\r\n        </div>\r\n\r\n        <div class=\"divider dotted\"></div>\r\n\r\n        <div class=\"col-xs-12 margin-bottom-2\">\r\n            <form-radio inp-name.bind=\"'training_offs'\" inp-label.bind=\"user.profile.trainings[2].training.name\" model.two-way=\"user.profile.trainings[2].training.id\"\r\n                expiry-date.two-way=\"user.profile.trainings[2].expiresOn ? user.profile.trainings[2].expiresOn : '--'\"\r\n                init-selected.two-way=\"user.profile.trainings[2].training.id\"></form-radio>\r\n        </div>-->\r\n\r\n    <!--</div>-->\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-twic.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-radio\"></require>\r\n\r\n    <div class=\"col-xs-12\">\r\n        <form-radio inp-name.bind=\"twic_card\"\r\n            inp-label=\"Hold a TWIC Card\"\r\n            model.two-way=\"user.twic_card.value\"\r\n            expiry-date.two-way=\"user.twic_card.expiryDate\"\r\n            init-selected.two-way=\"user.twic_card.value\"></form-radio>\r\n    </div>\r\n\r\n</template>"; });
define('text!views/widgets/user-panels/user-panel-visa.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <require from=\"../inputs/form-input\"></require>\r\n    <require from=\"../inputs/form-select\"></require>\r\n    <require from=\"../inputs/form-checkbox\"></require>\r\n\r\n    <div class=\"repeaters row-fluid\" repeat.for=\"row of user.profile.visas\">\r\n\r\n        <div if.bind=\"$index>0\" class=\"divider dotted\"></div>\r\n\r\n        <form-select inp-label=\"Visa Country\" model.two-way=\"user.profile.visas[$index].country.id\" options.bind=\"lkp_passportNationality\"\r\n            changed.two-way=\"user.profile.visas[$index].country.id\" autocomplete.bind=\"true\" init-selected.two-way=\"user.profile.visas[$index].country.id\"\r\n            is-mandatory.bind=\"true\"></form-select>\r\n\r\n        <form-input inp-type=\"date\" model.two-way=\"user.profile.visas[$index].expiresOn\" inp-label=\"Visa Expiry Date\" is-mandatory.bind=\"true\"></form-input>\r\n\r\n        <form-select inp-label=\"Visa Type\" prop-arr.bind=\"['value','name']\" model.two-way=\"user.profile.visas[$index].type.value\"\r\n            options.bind=\"lkp_visaTypes\" changed.two-way=\"user.profile.visas[$index].type.value\" autocomplete.bind=\"true\" init-selected.two-way=\"user.profile.visas[$index].type.value\"\r\n            is-mandatory.bind=\"true\"></form-select>\r\n\r\n        <!--<form-checkbox\r\n            class=\"margin-x-g1\"\r\n            inp-label=\"Multiple Visas\"                            \r\n            model.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n            init-selected.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n            input-only=\"true\"\r\n            is-mandatory.bind=\"true\"></form-checkbox>-->\r\n\r\n        <div class=\"col-xs-6\">\r\n            <form-checkbox inp-name.bind=\"['multipleEntry_' + $index]\"\r\n                inp-label=\"Multiple Visas\"                            \r\n                model.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n                init-selected.two-way=\"user.profile.visas[$index].multipleEntry\"\r\n                input-only=\"true\"\r\n                is-mandatory.bind=\"true\"></form-checkbox>\r\n            <!--<span class=\"form-group col-xs-6 col-debug is-mandatory\">            \r\n            <label class=\"label-with-checkbox\">\r\n                <input type=\"checkbox\" name.bind=\"inpName\" model.bind=\"true\" checked.bind=\"model\">\r\n                Multiple Visas\r\n            </label>        -->\r\n        </span>\r\n        </div>\r\n        \r\n\r\n        <div class=\"btn-row text-align-left\" if.bind=\"$index+1 == user.profile.visas.length\">\r\n            <button class=\"btn btn-default btn-sm btn-i\">\r\n                <i class=\"fa fa-plus\"></i>\r\n                Add Visa\r\n            </button>\r\n        </div>\r\n\r\n    </div>\r\n\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map