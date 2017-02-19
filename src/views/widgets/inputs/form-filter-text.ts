import { bindable, inject, autoinject, bindingMode } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import {BindingEngine} from "aurelia-binding";

inject(BindingEngine)
inject(Element)
export class FormFilterText {
    @bindable custMandatory = null;

    @bindable custLabel = 'Text';
    @bindable name = null;
    @bindable value = null;

    public constructor(model) {
    }

    @bindable model;
    activate(model) {
        // model is the passed through object
    }
}