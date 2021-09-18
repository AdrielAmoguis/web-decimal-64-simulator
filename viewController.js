/* TODO: Implement controller 

    This controller is supposed to be responsible to interface data coming in from the
    encode.js and decode.js files to and from the html page.
    
    Ideally, the HTML page should only call script functions from this file.
    This file will be the one to call encode.js and decode.js.
*/

/**
 * This function clears the two input textboxes.
 */
function clearInputFields(e) {
  e.preventDefault();
  const tb1 = document.getElementById("inputSignificand");
  const tb2 = document.getElementById("inputExponent");

  tb1.value = "";
  tb2.value = "";
}

/**
 * This function does the view handling for the output.
 */
function compute(e) {
  e.preventDefault();

  const inputDecimal = Number(
    document.getElementById("inputSignificand").value
  );
  const inputExponent = Number(document.getElementById("inputExponent").value);

  // Calculate
  const answerBinaryString = encodeDecimal64(inputDecimal, inputExponent);
  const outputHex = inHex(answerBinaryString);

  // Display answer
  const outputSignBit = document.getElementById("outputSignBit");
  const outputCombination = document.getElementById("outputCombination");
  const outputExponentCont = document.getElementById("outputExponentCont");
  const outputCoefContinuation = document.getElementById(
    "outputCoefContinuation"
  );
  const outputHexField = document.getElementById("outputHex");

  // Commit outputs
  outputSignBit.value = answerBinaryString.substring(0, 1);
  outputCombination.value = answerBinaryString.substring(1, 6);
  outputExponentCont.value = answerBinaryString.substring(6, 14);
  outputCoefContinuation.value = answerBinaryString.substring(14, 65);
  outputHexField.value = outputHex;
}

function copyBinary(e) {
  e.preventDefault();

  const outputSignBit = document.getElementById("outputSignBit");
  const outputCombination = document.getElementById("outputCombination");
  const outputExponentCont = document.getElementById("outputExponentCont");
  const outputCoefContinuation = document.getElementById(
    "outputCoefContinuation"
  );

  const answerBinaryString = `${outputSignBit.value}${outputCombination.value}${outputExponentCont.value}${outputCoefContinuation.value}`;

  navigator.clipboard.writeText(answerBinaryString);
}

function copyHex(e) {
  e.preventDefault();
  const outputHexField = document.getElementById("outputHex");
  outputHexField.select();
  navigator.clipboard.writeText(outputHexField.value);
}
