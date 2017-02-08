export class FilterValueConverter {
  toView(array, propertyName, filter_on) {
    console.log('FilterValueConverter: ' + JSON.stringify(propertyName) );
    return array.filter(i => i[propertyName] == filter_on);
  }
}