import 'bootstrap';
import * as $ from 'bootstrap';


export class BtnXcAll {

  xc_all(getState){
    console.log(getState);
    if(getState=='expand'){
        $('.panel-body.collapse:not(".in")').collapse('show');
    }
    if(getState=='collapse'){
        $('.panel-body.collapse.in').collapse('hide');
    }
  }

}