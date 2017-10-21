//@flow

export const reverseString = (str:string)=>{ return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);};

const utils = {

	reverseString,

}

export default utils;
