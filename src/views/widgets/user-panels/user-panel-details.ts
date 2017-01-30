import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject, bindable } from 'aurelia-framework';


@autoinject
export class UserPanelDetails {
    @bindable user;
    defaultSelected;
    http: HttpClient;

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

    selectOptions = { allowClear: true, placeholder: 'Select...' };
    selectedValue: string = '';
    singleSelectValues: string[] = ['a', 'b', 'c'];
    selectedValues: string[] = [];
    multipleSelectValues: string[] = ['z', 'y', 'x'];

    /* Justification: this is a recommended fix for an issue with Select2 and Aurelia integration as documented here
                 http://stackoverflow.com/questions/33452623/aurelia-trying-to-load-html-from-select2#answer-34121891 */
    /* tslint:disable-next-line no-empty */
    changeCallback(evt: Event): void {
    }
}