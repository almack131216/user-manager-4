import * as moment from 'moment';
import {autoinject} from 'aurelia-framework';
import {Configuration} from '../globals'; 

@autoinject()
export class DateFormatValueConverter {
    gDateFormat;

    constructor(config: Configuration) {
        console.log('DateFormatValueConverter: ' + this.gDateFormat + ' / ' + config.gDateFormat);        
        this.gDateFormat = config.gDateFormat;
    }
    
   toView(value, format) {
      return moment(value).format(format ? format : this.gDateFormat);
   }
}