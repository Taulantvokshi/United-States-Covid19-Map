export var getDateArray = function (start, end) {
  var arr = [],
    dt = new Date(start);

  while (dt <= end) {
    var dateObj = new Date(dt);
    var month =
      Number(dateObj.getUTCMonth() + 1) > 9
        ? dateObj.getUTCMonth() + 1
        : `0${dateObj.getUTCMonth() + 1}`;
    var day =
      Number(dateObj.getUTCDate()) > 9
        ? dateObj.getUTCDate()
        : `0${dateObj.getUTCDate()}`;

    var year = dateObj.getUTCFullYear();
    const newDate = year + '/' + month + '/' + day;
    arr.push(newDate);
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};
