/**
 * All code here will be implemented to decode a given decimal to its IEEE-754 2008 binary string representation.
 */

/**
 * This function will be called by the viewController when the user activates the encoder.
 * @param {*} decimalInput The given number in decimal format that will be converted to decimal 64 binary string.
 * @param {*} exponent This is for the exponent
 * @returns An object containing the steps taken and the final answer.
 */
function encodeDecimal64(decimalInput, exponent) {
  // TODO: Implement this.
  const { normalized, normalizedExponent } = normalize(decimalInput, exponent);
  const signBit = getSign(decimalInput);
  const ePrime = getEPrime(normalizedExponent);
  const exponentBin = toBinPad(ePrime, 10);
  const combinationField = getCF(normalized.charAt(0), exponentBin);
  const exponentContinuation = String(exponentBin).substring(2, 11);

  // Returns the string array of steps taken that will be displayed to the user. This is expected to be a list of strings.
  // Returns also the final answer -- this is expected to be of type String that contains the binary string.
  return `${signBit}${combinationField}${exponentContinuation}`;
}

/**
 * This function will be used to normalize the user input to 16 whole decimal digits
 * Format: From any input to    dddd dddd dddd dddd x10 E
 * @param {*} decimalInput. assumed to be INT
 * @param {*} exponent. assumed to be INT
 * @returns A normalized version of the input. This will be in STRING format
 */
function normalize(decimalInput, exponent) {
  let normalized = "";
  let exp = exponent;

  /** Test Case */
  //decimalInput = 1.234567;

  // Check first for decimal numbers
  while (decimalInput % 1 != 0) {
    decimalInput *= 10;
    exp -= 1;
  }

  // Get the number of digits from decimal input
  if (decimalInput.toString().length > 16) {
    normalized = decimalInput.toString().padStart(16, "0");
  } else {
    normalized = decimalInput.toString();
  }

  //console.log("Normalized: ", normalized);
  //console.log("Exponent: ", exp);
  return { normalized, normalizedExponent: exp };
}

/**
 * This function gets sign for the sign bit
 * @param {*} decimalInput assumed to be INT
 * @returns sign bit in STRING format
 */
function getSign(decimalInput) {
  let signBit = "";

  if (decimalInput < 0) signBit = "1";
  else signBit = "0";

  //console.log("Sign bit: ", signBit);

  return signBit;
}

/**
 * This function computes for e+398
 * @param {*} exponent. assumed to be INT
 * @returns e+398 in INT format
 */
function getEPrime(exponent) {
  //console.log("ePrime: ", exponent + 398);
  return exponent + 398;
}

/**
 * This function takes the normalized decimalInput and takes the MSD
 * @param {*} number. assumed in INT to be converted to BINARY FORMAT
 * @return number in binary format
 */
function toBin(x) {
  x = Number(x);
  return (x >>> 0).toString(2);
}

/**
 * This function does the same thing as above, but pads to padLen digits in length.
 * @param {*} digit
 * @returns
 */
function toBinPad(digit, padLen) {
  digit = Number(digit);
  return (digit >>> 0).toString(2).padStart(padLen, 0);
}

/**
 * This function calls toBin() for first 2digits and getPrime() forlast 3 digits
 * @param  UNFINISHED
 */
function getCF(coefficientMSD, exponentBin) {
  // Decide which implementation (0-7, 8-9)
  const coeffMSD = Number(coefficientMSD);
  const coeffMSDBin = toBinPad(coeffMSD, 4);
  let exponentBits = "";
  let coefficientBits = "";
  if (coeffMSD < 8 && coeffMSD >= 0) {
    // Implement: a b c d e
    exponentBits = exponentBin.substring(0, 2);
    coefficientBits = coeffMSDBin.substring(1, 4);
  } else if (coeffMSD >= 8 && coeffMSD <= 9) {
    // Implement: 1 1 c d e
    exponentBits = "11" + exponentBin.substring(0, 2);
    coefficientBits = coeffMSDBin.substring(3, 4);
  }

  const combination = (exponentBits + coefficientBits).padStart(5);

  //   console.log("Exponent Field: ", exponentBits);
  //   console.log("Coefficient Field: ", coefficientBits);
  //   console.log("Combination Field: ", combination);

  return combination;
}
