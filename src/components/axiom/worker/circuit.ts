//This file is generated by the AxiomREPL. DO NOT DIRECTLY EDIT THIS FILE!
//To make changes, go to https://repl.axiom.xyz/ and export a new circuit.
//
//                 _                 _____  ______ _____  _
//     /\         (_)               |  __ \|  ____|  __ \| |
//    /  \   __  ___  ___  _ __ ___ | |__) | |__  | |__) | |
//   / /\ \  \ \/ / |/ _ \| '_ ` _ \|  _  /|  __| |  ___/| |
//  / ____ \  >  <| | (_) | | | | | | | \ \| |____| |    | |____
// /_/    \_\/_/\_\_|\___/|_| |_| |_|_|  \_\______|_|    |______|
//
//

import { Halo2Lib, AxiomData, CircuitValue } from "@axiom-crypto/experimental/halo2-js";
// import { CircuitValue256 } from "@axiom-crypto/experimental/v2/circuit/CircuitValue256";
const defaultInputs = {
  aggregator: "0x9b0FC4bb9981e5333689d69BdBF66351B9861E62",
  blockNum: 9938576,
  txIndex: 29,
  thresholdPrice: 150000000000,
  shouldBeLess: 0,
  oToken: "0x9b0FC4bb9981e5333689d69BdBF66351B9861E61",
};
type CircuitInputType = typeof defaultInputs;
export interface CircuitInputs extends CircuitInputType {}
export interface CircuitValueInputs {
  aggregator: CircuitValue;
  blockNum: CircuitValue;
  txIndex: CircuitValue;
  thresholdPrice: CircuitValue;
  shouldBeLess: CircuitValue;
  oToken: CircuitValue;
}
const circuitFn = async (
  halo2Lib: Halo2Lib,
  axiomData: AxiomData,
  { aggregator, blockNum, txIndex, thresholdPrice, shouldBeLess, oToken }: CircuitValueInputs,
) => {
  const { witness, add, or, dec, isEqual, checkEqual, isLessThan, log } = halo2Lib;
  const { getReceipt, getHeader, addToCallback } = axiomData;
  // AnswerUpdated(indexed int256,indexed uint256,uint256)
  const eventSchema = "0x0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f";
  // get block timestamp
  const blockTimestamp = getHeader(blockNum)
    .timestamp()
    .toCircuitValue();
  // get tx receipt
  const rx = getReceipt(blockNum, txIndex);
  // get log
  const eventLog = rx.log(2);
  // check contract
  const address = eventLog.address().toCircuitValue();
  checkEqual(address, aggregator);
  // surface price (8 decimal places)
  const price = eventLog.topic(1, eventSchema).toCircuitValue();
  // check price is less than threshold
  const isLessThanRequired = isLessThan(price, thresholdPrice);
  // check price is equal to threshold
  const equals = isEqual(price, thresholdPrice);
  const isLessThanOrEqual = or(isLessThanRequired, equals);
  // only valid if !isLess == !isLessThanOrEqual || isLess == isLessThanOrEqual
  const valid = isEqual(shouldBeLess, isLessThanOrEqual);
  // callback
  addToCallback(blockNum);
  addToCallback(blockTimestamp);
  addToCallback(witness(eventSchema));
  addToCallback(address);
  addToCallback(oToken);
  addToCallback(thresholdPrice);
  addToCallback(shouldBeLess);
  addToCallback(valid);
};
const config = {
  k: 13,
  numAdvice: 4,
  numLookupAdvice: 1,
  numInstance: 1,
  numLookupBits: 12,
  numVirtualInstance: 2,
};
const vk = [
  2,
  13,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  0,
  22,
  53,
  175,
  191,
  189,
  44,
  47,
  125,
  102,
  223,
  68,
  183,
  53,
  24,
  221,
  245,
  11,
  40,
  210,
  84,
  147,
  34,
  241,
  111,
  251,
  44,
  176,
  97,
  40,
  23,
  111,
  5,
  236,
  172,
  54,
  30,
  205,
  68,
  139,
  37,
  34,
  255,
  110,
  222,
  63,
  213,
  167,
  105,
  46,
  125,
  148,
  2,
  105,
  228,
  6,
  175,
  114,
  9,
  31,
  238,
  182,
  133,
  168,
  45,
  206,
  79,
  81,
  143,
  172,
  159,
  56,
  65,
  80,
  91,
  25,
  114,
  82,
  240,
  216,
  13,
  232,
  196,
  246,
  65,
  204,
  226,
  26,
  170,
  206,
  207,
  107,
  158,
  182,
  223,
  215,
  1,
  89,
  104,
  118,
  33,
  128,
  36,
  182,
  12,
  226,
  42,
  200,
  191,
  79,
  225,
  252,
  40,
  117,
  76,
  0,
  94,
  172,
  71,
  131,
  254,
  16,
  159,
  82,
  209,
  213,
  32,
  31,
  47,
  153,
  138,
  239,
  106,
  115,
  169,
  201,
  255,
  200,
  126,
  102,
  37,
  57,
  165,
  219,
  131,
  135,
  135,
  64,
  208,
  192,
  107,
  244,
  141,
  249,
  64,
  66,
  45,
  236,
  62,
  173,
  23,
  137,
  86,
  146,
  58,
  35,
  164,
  178,
  7,
  41,
  32,
  149,
  216,
  34,
  92,
  58,
  4,
  171,
  184,
  56,
  98,
  67,
  132,
  243,
  66,
  86,
  159,
  203,
  139,
  187,
  36,
  113,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  155,
  64,
  233,
  83,
  36,
  215,
  120,
  197,
  230,
  91,
  118,
  91,
  17,
  86,
  63,
  232,
  70,
  139,
  218,
  95,
  229,
  57,
  203,
  121,
  253,
  117,
  250,
  195,
  170,
  255,
  175,
  13,
  151,
  60,
  223,
  201,
  22,
  104,
  110,
  75,
  110,
  9,
  196,
  174,
  89,
  18,
  167,
  238,
  52,
  100,
  227,
  62,
  9,
  181,
  138,
  160,
  34,
  199,
  221,
  57,
  124,
  67,
  112,
  17,
  135,
  162,
  4,
  140,
  192,
  14,
  135,
  96,
  27,
  199,
  98,
  223,
  221,
  186,
  210,
  144,
  188,
  246,
  234,
  111,
  98,
  185,
  149,
  202,
  53,
  4,
  170,
  232,
  146,
  1,
  91,
  34,
  15,
  224,
  102,
  34,
  173,
  56,
  231,
  94,
  197,
  95,
  171,
  177,
  125,
  233,
  176,
  87,
  111,
  168,
  18,
  217,
  186,
  116,
  209,
  133,
  129,
  84,
  251,
  223,
  33,
  223,
  229,
  22,
  129,
  32,
  221,
  160,
  2,
  15,
  131,
  249,
  95,
  54,
  190,
  51,
  37,
  210,
  75,
  10,
  123,
  164,
  170,
  220,
  46,
  2,
  32,
  0,
  126,
  162,
  161,
  23,
  118,
  254,
  8,
  8,
  145,
  202,
  133,
  199,
  119,
  206,
  57,
  43,
  71,
  250,
  177,
  202,
  247,
  247,
  49,
  208,
  24,
  55,
  134,
  206,
  167,
  14,
  195,
  5,
  67,
  75,
  229,
  119,
  93,
  216,
  75,
  48,
  129,
  127,
  109,
  132,
  109,
  219,
  168,
  23,
  159,
  8,
  162,
  147,
  15,
  247,
  240,
  86,
  108,
  80,
  248,
  240,
  65,
  159,
  237,
  247,
  215,
  190,
  191,
  70,
  240,
  218,
  95,
  15,
  139,
  84,
  196,
  177,
  252,
  158,
  196,
  233,
  173,
  21,
  59,
  139,
  120,
  126,
  241,
  79,
  176,
  156,
  21,
  225,
  98,
  163,
  218,
  200,
  210,
  106,
  88,
  71,
  32,
  119,
  134,
  30,
  248,
  17,
  160,
  55,
  121,
  168,
  124,
  85,
  5,
  232,
  156,
  11,
  224,
  89,
  116,
  78,
  181,
  45,
  120,
  198,
  223,
  203,
  156,
  189,
  160,
  140,
  117,
  105,
  10,
  53,
  212,
  37,
  140,
  202,
  224,
  95,
  204,
  114,
  5,
  234,
  227,
  19,
  84,
  3,
  218,
  83,
  80,
  10,
  207,
  66,
  72,
  41,
  104,
  80,
  210,
  173,
  6,
  147,
  3,
  3,
  204,
  9,
  218,
  43,
  97,
  136,
  177,
  153,
  149,
  76,
  195,
  250,
  108,
  198,
  72,
  11,
  83,
  199,
  50,
  108,
  89,
  109,
  74,
  133,
  130,
  76,
  114,
  207,
  80,
  75,
  238,
  153,
  153,
  114,
  227,
  15,
  200,
  235,
  239,
  232,
  0,
  185,
  98,
  96,
  188,
  125,
  114,
  204,
  23,
  54,
  4,
  151,
  216,
  19,
  154,
  224,
  107,
  127,
  103,
  55,
  221,
  36,
  206,
  6,
  125,
  90,
  163,
  41,
  17,
  123,
  66,
  244,
  50,
  27,
  68,
  1,
  2,
  125,
  12,
  81,
  98,
  60,
  138,
  198,
  118,
  164,
  66,
  42,
  237,
  194,
  32,
  107,
  14,
  222,
  190,
  2,
  34,
  90,
  221,
  19,
  157,
  31,
  12,
  222,
  25,
  128,
  125,
  8,
  221,
  22,
  160,
  0,
  232,
  158,
  14,
  95,
  100,
  149,
  53,
  169,
  123,
  201,
  36,
  174,
  8,
  190,
  143,
  36,
  137,
  165,
  11,
  19,
];
export const circuit = Object.freeze({
  circuit: circuitFn,
  config,
  defaultInputs,
  vk,
});
