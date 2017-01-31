/* globals.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/

export class Configuration {
  gDelay;
  gDelay2;
  gCurrency;
  gCurrencyFormat;
  gDateFormat;

  constructor() {
    this.gDelay = 2000;
    this.gDelay2 = 1100;
    this.gCurrency = '£';
    this.gCurrencyFormat = '(0,0.00)';
    this.gDateFormat = 'MMMM Mo YYYY';
  }
}