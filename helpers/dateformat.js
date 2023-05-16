const dateandtime = require('date-and-time')

function generateRandomLetters(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      let randomCharCode = Math.floor(Math.random() * 26) + 97; // generate a random number between 97 and 122, which correspond to the ASCII codes for lowercase letters
      let randomLetter = String.fromCharCode(randomCharCode); // convert the ASCII code to a letter
      result += randomLetter;
    }
    return result;
  }
  


const dateformat = (date)=>{
    return dateandtime.format(date,"DD.MM.YYYY HH:mm")
}

const hour = (date)=>{
  return dateandtime.format(date,"HH:mm")
}


const length = (myarray)=>{
    return myarray.length
}
const onlyletters = ()=>{
    return generateRandomLetters(10)
}

module.exports = {dateformat,length,onlyletters,hour}