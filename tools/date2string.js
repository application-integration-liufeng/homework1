function date2stringdate (date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? '0' + month : month.toString();
  day = day < 10 ? '0' + day : day.toString();
  return `${year}-${month}-${day}`;
}
function date2stringtime (date) {
  let hour = date.getHours();
  let minute = date.getMinutes();
  hour = hour < 10 ? '0' + hour : hour.toString();
  minute = minute < 10 ? '0' + minute : minute.toString();
  return `${date2stringdate(date)} ${hour}:${minute}`;
}



module.exports = { date2stringtime, date2stringdate }





