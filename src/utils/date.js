 const getFormatDate =  function getFormatDate() {
  const date = new Date();

  const getMonth = () => date.getMonth() + 1;
  const getDate = () => date.getDate();
  const getFullYear = () => date.getFullYear();
  const getHours = () => date.getHours();
  const getMinutes = () => date.getMinutes();
  const getSeconds = () => date.getSeconds();

  let month = getMonth();
  let strDate = getDate();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  const currentDate =
    getFullYear() +
    "-" +
    month +
    "-" +
    strDate +
    " " +
    getHours() +
    ":" +
    getMinutes() +
    ":" +
    getSeconds();

  return currentDate;
}
module.exports = {
  getFormatDate
}