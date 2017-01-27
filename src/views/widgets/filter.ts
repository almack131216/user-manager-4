export class FilterValueConverter {
  toView(array, propertyName, filter_on) {
    return array.filter(i => i[propertyName] == filter_on);
  }
}