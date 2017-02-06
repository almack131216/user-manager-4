/* lookups.js */
/*
put all global variables here, as camel-case prefixed with a small 'g'
*/

export class Lookups {
  lkp_Roles;
  lkp_VisaType;

  constructor() {
    this.lkp_Roles = [
        {"id":0,"label":"Zero"},
        {"id":3,"label":"Role 3"},
        {"id":1,"label":"Role 1"},
        {"id":2,"label":"Role 2"}        
    ];
    this.lkp_VisaType = [];
  }
}