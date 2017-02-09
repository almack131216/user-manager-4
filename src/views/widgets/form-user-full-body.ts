import { bindable, bindingMode } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

export class FormUserFullBody {
    @bindable user = null;
    @bindable custIcon = null;
    @bindable custBody = null;
    @bindable custClass = null;
    @bindable custTitle = null;
    @bindable custXc = null;
    @bindable custXcId = null;
    @bindable custXcExpanded = null;
    @bindable custXcResClass = null;
}