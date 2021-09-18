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
  const signBit = getSign(decimalInput);
  const { normalized, normalizedExponent } = normalize(decimalInput, exponent);
  const ePrime = getEPrime(normalizedExponent);
  const exponentBin = toBinPad(ePrime, 10);
  const combinationField = getCF(normalized.charAt(0), exponentBin);
  const exponentContinuation = String(exponentBin).substring(2, 11);
  const coefficientContinuation = getDPBCD15(
    normalized.substring(1, normalized.length)
  );

  // Check for special cases
  // Case 1: NAN
  if (typeof decimalInput !== "number" || typeof exponent !== "number") {
    // Return NaN
    let coef = "";
    for (var i = 0; i < 50; i++) coef += "x";
    return `x11111xxxxxxxx${coef}`;
  } else if (exponent > 384 || exponent < -383) {
    // INF
    let coef = "";
    for (var i = 0; i < 50; i++) coef += "x";
    return `${signBit}11110xxxxxxxx${coef}`;
  }

  // Returns the string array of steps taken that will be displayed to the user. This is expected to be a list of strings.
  // Returns also the final answer -- this is expected to be of type String that contains the binary string.
  return `${signBit}${combinationField}${exponentContinuation}${coefficientContinuation}`;
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
  let decimalString = decimalInput.toString();
  if (decimalString.startsWith("-")) decimalString = decimalString.substring(1);
  if (decimalInput.toString().length < 16) {
    normalized = decimalString.padStart(16, "0");
  } else {
    normalized = decimalString;
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
  // Decide which implementation (0-7, 8-9) OR Special case
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

/**
 * This function converts a decimal number to its densely packed BCD representation
 * @param {*} number. assumed to be a 3-digit INT
 * @return densely packed BCD representation of the 3-digit INT. This will be in STRING format
 */
function toDPBCD3(x) {
  n = Array.from(String(x), Number);
  digit = Array(3).fill(0);
  digit.splice(3 - n.length, n.length, ...n);

  //get bin of each digit
  orig = [];
  for (const val of digit) {
    d = Array.from(toBinPad(val, 4), Number);
    orig = orig.concat(d);
  }

  ans = Array(10).fill(0);
  if (digit[0] < 8) {
    //0 _ _
    ans.splice(0, 3, ...orig.slice(1, 4));
    if (digit[1] < 8) {
      //0 0 _
      ans.splice(3, 3, ...orig.slice(5, 8));
      if (digit[2] < 8)
        //0 0 0
        ans.splice(7, 3, ...orig.slice(9, 12));
      //0 0 1
      else ans.splice(6, 4, 1, 0, 0, orig[11]);
    } else {
      //0 1 _
      if (digit[2] < 8)
        // 0 1 0
        ans.splice(3, 7, orig[9], orig[10], orig[7], 1, 0, 1, orig[11]);
      // 0 1 1
      else ans.splice(3, 7, 1, 0, orig[7], 1, 1, 1, orig[11]);
    }
  } else if (digit[1] < 8 && digit[2] < 8)
    //1 0 0
    ans.splice(
      0,
      10,
      orig[9],
      orig[10],
      orig[3],
      orig[5],
      orig[6],
      orig[7],
      1,
      1,
      0,
      orig[11]
    );
  else if (digit[1] < 8 && digit[2] > 7)
    //1 0 1
    ans.splice(
      0,
      10,
      orig[5],
      orig[6],
      orig[3],
      0,
      1,
      orig[7],
      1,
      1,
      1,
      orig[11]
    );
  else if (digit[1] > 7 && digit[2] < 8)
    //1 1 0
    ans.splice(
      0,
      10,
      orig[9],
      orig[10],
      orig[3],
      0,
      0,
      orig[7],
      1,
      1,
      1,
      orig[11]
    );
  // 1 1 1
  else ans.splice(0, 10, 0, 0, orig[3], 1, 1, orig[7], 1, 1, 1, orig[11]);

  return ans.join("");
}

/**
 * This function converts a decimal number to its densely packed BCD representation
 * @param {*} number. assumed to be a 15-digit INT
 * @return densely packed BCD representation of the 15-digit INT. This will be in STRING format
 */
function getDPBCD15(x) {
  s = x.toString();
  var ans = "";
  for (i = 0; i < 15; i += 3) {
    sub = s.substring(i, i + 3);
    bcd = toDPBCD3(sub);
    ans += bcd;
  }
  return ans;
}

/**
 * This function converts the binary answer to its hexadecimal representation
 * @param {*} decimalInput The given number in decimal format that will be converted to decimal 64 binary string.
 * @param {*} exponent This is for the exponent
 * @return answer in hexadecimal
 */
function inHex(bin) {
  // Remove the x
  const firstX = bin.indexOf("x");
  let cleanedBin = "";
  if (firstX !== -1) {
    cleanedBin = bin.substring(0, firstX);
  } else {
    cleanedBin = bin;
  }
  toInt = BigInt("0b" + cleanedBin);
  return toInt.toString(16).toUpperCase();
}
