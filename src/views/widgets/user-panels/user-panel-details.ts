import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject, bindable } from 'aurelia-framework';


@autoinject
export class UserPanelDetails {
    @bindable user;
    http:HttpClient;

    constructor(http:HttpClient) {
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

    activate(){    
        console.log('getSomeJson: ');

        this.http.fetch('./dummy-data.json')
            .then(response => response.json())
            .then(data => {
                    console.log('getSomeJson: ' + data);
            })
    }
}