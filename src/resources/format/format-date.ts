import * as moment from 'moment';

import {autoinject,inject} from 'aurelia-framework';
import * as Constants from '../constants';
const CV = Constants 

//@autoinject()
export class FormatDateValueConverter {
    public CV = CV
    gDateFormat = CV.FORMAT_DATE;
    message: string;

    constructor(){
        //this.moment = moment;             
        //this.gDateFormat = CV.FORMAT_DATE;
        //this.message = moment.tz("2014-06-01 12:00", "Europe/Amsterdam").format();
        console.log('moment: ' + this.message);
    }
    
   toView(value,format) {
        console.log('DateFormatValueConverter: ' + value + ' / ' + this.gDateFormat + ' / ' + format);
      //return moment.tz("2014-06-01 12:00", "Europe/Amsterdam").format();//moment(value).format('YYYY-MM-DD HH:mm');//(format ? format : this.gDateFormat);
      //return (moment as any).default(value).format('YYYY-MM-DD HH:mm'); 
      return moment(value, 'YYYY-MM-DD HH:mm').format(format ? format : this.gDateFormat);
      //return 'x' + moment(value, format);
   }
}