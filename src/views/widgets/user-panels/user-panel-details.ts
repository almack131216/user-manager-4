import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

@autoinject
export class UserPanelDetails {
    public CV = CV;
    @bindable user;
    defaultSelected;
    http: HttpClient;
    sel_region_selected_root;

    constructor(http: HttpClient) {
        this.http = http;
        this.getSomeJson();
        // this.http.fetch('src/views/widgets/user-panels/dummy-data.json')
        //     .then(response => response.json())
        //     .then(data => {
        //             console.log('getSomeJson: ' + data);
        //     })
    }

    getSomeJson() {
        this.http.fetch('src/views/widgets/user-panels/dummy-data.json')
            .then(response => response.json())
            .then(data => {
                console.log('getSomeJson: ' + JSON.stringify(data));
            })
    }

    activate() {
        console.log('getSomeJson: ');

        this.http.fetch('./dummy-data.json')
            .then(response => response.json())
            .then(data => {
                console.log('getSomeJson: ' + data);
            })
    }

    
}