import { bindable } from 'aurelia-framework';

export class SpanCustActiveStatus {
    @bindable isActive;
    @bindable reviewPending;
    @bindable reviewResult;
}