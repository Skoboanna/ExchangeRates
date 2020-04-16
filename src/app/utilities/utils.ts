export function sortObjectByKeys(obj): object {
    const sortedObject = {};
    Object.keys(obj).sort().forEach(function (key) {
        sortedObject[key] = obj[key];
    });
    return sortedObject;
}

export function getDateFromToday(numberOfDays): string {
    let today = new Date();
    let calculatedDate = new Date(today.setDate(today.getDate() - numberOfDays))
    let calculatedDateString = calculatedDate.toISOString().substring(0, 10);
    return calculatedDateString;
}