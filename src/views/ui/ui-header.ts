import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

export class UiHeader {
    public CV = CV
    //@bindable currentUser = null;

    imgSrc_logo;
    imgSrc_strapline;

    created(){
        this.imgSrc_logo = 'src/css/bp-logo.jpg';
        this.imgSrc_strapline = 'src/img/MRT_Identifier_V1b.png';
    }
    
}