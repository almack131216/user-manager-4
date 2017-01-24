import 'bootstrap';
import * as $ from 'bootstrap';


export class BtnXcAll {

  xc_all(getState){
    console.log(getState);
    if(getState=='expand'){
      $('.collapse').addClass('in');
      $('.btn-xc_chevron').removeClass('collapsed');
      $('.btn-xc_chevron').attr('aria-expanded',true);
      $('.collapse').attr('aria-expanded',true);
      $('.collapse').css('height','auto');
    }
    if(getState=='collapse'){
      $('.collapse').removeClass('in');
      $('.btn-xc_chevron').addClass('collapsed');
      $('.btn-xc_chevron').attr('aria-expanded',false);
      $('.collapse').attr('aria-expanded',true);
      $('.collapse').css('height','0px');
    }
  }

}