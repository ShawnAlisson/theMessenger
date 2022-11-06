export const converToLocalTime = (serverDate) => {
  var dt = new Date(Date.parse(serverDate));
  var localDate = dt;

  var gmt = localDate;
  var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
  // var localNow = new Date().getTimezoneOffset(); // get the timezone
  // offset in minutes
  // var localTime = min - localNow; // get the local time

  var dateStr = new Date(min * 1000 * 60);
  // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
  // dateStr = dateStr.toString()
  var year = dateStr.getFullYear();
  var month = ("0" + (dateStr.getMonth() + 1)).slice(-2);
  var day = ("0" + dateStr.getDate()).slice(-2);
  var hour = ("0" + dateStr.getHours()).slice(-2);
  var minute = ("0" + dateStr.getMinutes()).slice(-2);
  var second = ("0" + dateStr.getSeconds()).slice(-2);
  var dayWeek = dateStr.getDay();
  return [year, month, day, hour, minute, second, dayWeek];
};

export const thisYear = () => {
  return new Date(Date.now()).getFullYear();
};
