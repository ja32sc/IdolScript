import { describe, it } from "node:test"
import assert from "node:assert/strict"
import parse from "../src/parser.js"

// Programs expected to be syntactically correct
const syntaxChecks = [
  ["variable declarations", "idol x = 5 idol y = 10 idol z = x + y"],
  ["function declaration", "episode addNumbers(a, b) { idol result = a + b encore result }"],
  ["assignment and expression evaluation", "idol a = 1 idol b = 2 idol result = a + b * 3 encore result"],
  ["if statement (long form)", 'plotTwist a > b { encore "a is greater" } fate { encore "b is greater or equal" }'],
  ["if statement (short form)", 'plotTwist a == b { encore "equal" }'],
  ["while loop (audition)", "audition x < 5 { perform x x = x + 1 }"],
  ["for loop (spotlight)", "spotlight i in 0 till 5 { perform i }"],
  ["array access", "idol unit = [1, 2, 3] idol firstMember = unit[0] perform firstMember"],
  ["function return", "episode multiply(a, b) { idol result = a * b encore result }"],
  ["nested expressions", "idol result = (2 + 3) * (4 - 1) encore result"],
  ["complex assignment", "idol a = 1 idol b = 2 idol result = (a + b) * 3 encore result"],
  ["array literal", "idol unit = [1, 2, 3] perform unit"],
  ['string literal', 'perform "Hello, IdolScript!"']
]

// Programs with syntax errors that the parser will detect
const syntaxErrors = [
  ["non-Latin character in an identifier", "idol コンパイラ = 100;"],
  ["malformed number", "idol x = 2.;"],
  ["missing operand", "perform (5 -);"],
  ["invalid operator in expression", "idol x = * 71;"],
  ["invalid negation before exponentiation", "perform -2**2;"],
  ["unclosed parenthesis", "perform (83 * ((((-(13 / 21))))))) + 1 - 0;"],
  ["array literal with trailing comma", "idol unit = [1, 2, 3,];"],
  ["non-assignment to true", "true = 1;"],
  ["non-assignment to false", "false = 1;"],
  ["invalid member access on number", "perform 500.x;"],
  ["invalid function call on number", "perform 500(2);"],
  ["array access on number", "perform 500[2];"]
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`matches ${scenario}`, () => {
      assert(parse(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }
})
