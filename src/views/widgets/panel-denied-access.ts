import { bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

export class PanelDeniedAccess {
    public CV = CV
    @bindable custClass

    title = CV.myApiMsg.AccessDeniedTitle
    message = CV.myApiMsg.AccessDeniedMessage
}