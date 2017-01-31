import numeral from 'numeral';

export class NumberFormatValueConverter {
  toView(value, format) {
    return numeral(value).format(format ? format : '');
  }
}

export class RoundDownValueConverter {
  toView(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
  }
}