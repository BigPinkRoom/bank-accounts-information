export function convertDateToIso(dateObj) {
  console.log('date object', dateObj);
  return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
}

export function compareIsoDates(dateOneIso, dateSecondIso) {
  console.log('date one', dateOneIso, dateSecondIso);
  const dateOne = new Date(dateOneIso).getDate();
  const dateSecond = new Date(dateSecondIso).getDate();

  if (dateOne > dateSecond) {
    return 'greater';
  } else if (dateOne === dateSecond) {
    return 'equal';
  } else if (dateOne < dateSecond) {
    return 'less';
  }
}
