/**
 * All code here will be implemented to decode a given decimal to its IEEE-754 2008 binary string representation.
 */

/**
 * This function will be called by the viewController when the user activates the encoder.
 * @param {*} decimalInput The given number in decimal format that will be converted to decimal 64 binary string.
 * @param {*} exponent This is for the exponent 
 * @returns An object containing the steps taken and the final answer.
 */
function encodeDecimal64(decimalInput) {
    const steps = [];
    let finalAnswer = '';

    // TODO: Implement this.

    // Returns the string array of steps taken that will be displayed to the user. This is expected to be a list of strings.
    // Returns also the final answer -- this is expected to be of type String that contains the binary string.
    return { steps, finalAnswer };
}

/**
 * This function will be used to normalize the user input to 16 whole decimal digits
 * Format: From any input to    dddd dddd dddd dddd x10 E
 * @param {*} decimalInput. assumed to be INT
 * @param {*} exponent. assumed to be INT
 * @returns A normalized version of the input. This will be in STRING format
 */
function normalize(decimalInput, exponent) {

  let normalized = ""

  /** Test Case */
  //decimalInput = 1.234567;

  // Check first for decimal numbers
  while (decimalInput % 1 != 0){
    decimalInput *= 10;
    exponent -= 1;
  }
 
  // Get the number of digits from decimal input 
  if (decimalInput.toString().length > 16 ) {
    normalized = decimalInput.toString().padStart(16, "0");
  }

  console.log(normalized);
  console.log(exponent);
}

/**
 * This function gets sign for the sign bit
 * @param {*} decimalInput assumed to be INT
 * @returns sign bit in STRING format
 */
function getSign(decimalInput) {
  let signBit = "";

  if (decimalInput < 0) signBit="1";
  else signBit="0";

  console.log(signBit);

  return signBit;
}

/**
 * This function computes for e+398
 * @param {*} exponent. assumed to be INT
 * @returns e+398 in INT format
 */
function getEPrime(exponent) {
  return exponent+398;
}

/**
 * This function takes the normalized decimalInput and takes the MSD
 * @param {*} number. assumed in INT to be converted to BINARY FORMAT
 * @return number in binary format
 */
function toBin(x) {
  return (x >>> 0).toString(2);
}

/**
 * This function calls toBin() for first 2digits and getPrime() forlast 3 digits
 * @param  UNFINISHED
 */
function getCF() {
  let firstTwo = "";
  let lastThree = "";

  firstTwo = toBin();
  lastThree = getPrime();
}