
import { bindable } from 'aurelia-framework';

export class UserPanelVisa {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
    @bindable myLookups;
}