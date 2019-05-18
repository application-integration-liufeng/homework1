module.exports = date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month.toString();
  let day = date.getDate();
  day = day < 10 ? '0' + day : day.toString();
  return `${year}-${month}-${day}`;
};
