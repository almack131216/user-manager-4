import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

inject(Element)
export class FormRadio {
    @bindable inpClass = null;
    @bindable inpLabel = null;
    @bindable inpPlaceholder = null;
    @bindable inpValue = null;
    @bindable inpValueTwoWay = null;
    @bindable isMandatory = null;

    @bindable name = null;
    @bindable value = null;
    @bindable valTwoWay = null;

    public constructor(model) {

    }
}