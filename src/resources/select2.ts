import {customAttribute, DOM, inject} from 'aurelia-framework';
import 'jquery';
import 'select2';

@customAttribute('select2')
@inject(DOM.Element)
export class Select2CustomAttribute {
  private value: any;

  constructor(private element) {
  }

  public attached() {
     $(this.element).select2(this.value).on('change', evt => {
          if (evt.originalEvent) {
            return;
          }

          this.element.dispatchEvent(new Event('change'));
    });
  }

  public detached() {
    $(this.element).select2('destroy');
  }
}