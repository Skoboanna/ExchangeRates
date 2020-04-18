export function getDateFromToday(numberOfDays): string {
    let today = new Date();
    let calculatedDate = new Date(today.setDate(today.getDate() - numberOfDays))
    let calculatedDateString = calculatedDate.toISOString().substring(0, 10);
    return calculatedDateString;
}

export function getOrderedObjectKeys(obj): string[] {
    let keys = Object.keys(obj);
    keys.sort();
    return keys;
}

export function getOrderedListOfObjects(objectList): object[] {
    let sortedKeys = getOrderedObjectKeys(objectList);
    let orderedListOfObjects = [];
    sortedKeys.forEach(key => orderedListOfObjects.push(objectList[key]));
    console.log(orderedListOfObjects);
    return orderedListOfObjects;
}