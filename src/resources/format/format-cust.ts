import {inject} from 'aurelia-framework';

function htmlEncode(html) {
  return document.createElement('a').appendChild( 
    document.createTextNode(html)).parentNode.innerHTML;
}

@inject(Element)
export class PreserveBreaksCustomAttribute {
  constructor(element) {
    this.element = element;
  }

  valueChanged() {
    let html = htmlEncode(this.value);
    html = html.replace(/\r/g, '').replace(/\n/g, '<br/>');
    this.element.innerHTML = html;
  }
}

import numeral from 'numeral';

export class ConvertTicksValueConverter {
  toView(value) {
    return numeral(value / 1000).format('0[.][0]');//2500 becomes 2.5, 2000 becomes 2
  }
}