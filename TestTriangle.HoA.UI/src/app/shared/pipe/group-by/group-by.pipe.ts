import { Pipe, PipeTransform } from '@angular/core';

/**
 * To group by
 */
@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  /**
   * To transform collections
   * @param collection collection
   * @param property property
   * @param hasOptionGroup has option group
   */
  transform(collection: Array<any>, property: string, hasOptionGroup: boolean = false): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!hasOptionGroup) {
      return [{key: '', value : collection}];
    }
    if (!collection) {
        return null;
    }
    const groupedCollection = collection.reduce((previous, current) => {
        if (!previous[current[property]]) {
            previous[current[property]] = [current];
        } else {
            previous[current[property]].push(current);
        }
        return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
}

}
