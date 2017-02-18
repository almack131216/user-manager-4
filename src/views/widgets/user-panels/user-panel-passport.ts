
import { bindable } from 'aurelia-framework';

export class UserPanelPassport {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
    @bindable myLookups;
}