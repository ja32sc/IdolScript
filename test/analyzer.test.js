import { describe, it } from "node:test"
import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import { program, variableDeclaration, variable, binary, floatType } from "../src/core.js"


// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'idol x = 1 idol y = "idol"'],
  ["short return", "episode f() { encore }"],
  ["long return", "episode f() { encore idol }"],
  ["return in nested if", "episode f() { plotTwist idol { encore } }"],
  ["break in nested if", "audition idol { plotTwist idol { exitStage } }"],
  ["long if", "plotTwist idol { perform 1 } fate { perform 3 }"],
  ["elsif", "plotTwist idol { perform 1 } fate plotTwist idol { perform 0 } fate { perform 3 }"],
  ["for in range", "spotlight i in 1 till 10 { perform 0 }"],
  ["repeat", "repeat 3 { idol a = 1 perform a }"],
  ["conditionals with ints", "perform idol ? 8 : 5"],
  ["conditionals with strings", 'perform idol ? "x" : "y"'],
  ["||", "perform idol||(1<2)||idol||(!idol)"],
  ["&&", "perform idol&&(1<2)&&idol&&(!idol)"],
  ["relations", 'perform 1<=2 && "x">"y" && 3.5<1.2'],
  ["arithmetic", "idol x=1 perform  2*3+5**(-3)/2-5%8"],
  ["outer variable", "idol x=1 audition idol { perform x }"],
  ["function call", "episode f(x) { encore x } perform f(10)"],
  ["array literal", "idol a = [1, 2, 3] perform a[1]"],
  ["array push", "idol a = [1] a.addMember(2)"],
  ["array pop", "idol a = [1,2,3] a.graduate()"],
  // 5 additional semantic checks
  ["nested arithmetic", "idol x=2 perform x*(3+4)*(5-2)"],
  ["function with multiple parameters", "episode calc(x, y, z) { encore x*y+z } perform calc(2, 3, 4)"],
  ["nested array access", "idol a = [[1,2],[3,4]] perform a[0][1]"],
  ["multiple variable declarations", "idol x=1 idol y=2 idol z=3 perform x+y+z"],
  ["complex boolean expression", "idol a=idol idol b=!a plotTwist a&&!b { perform 1 }"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["undeclared id", "perform(x)", /Identifier x not declared/],
  ["redeclared id", "idol x = 1 idol x = 1", /Identifier x already declared/],
  ["assign to constant", "idol x = 1 x = 2", /Cannot assign to immutable/],
  ["break outside loop", "exitStage", /Break can only appear in a loop/],
  ["return outside function", "encore", /Return can only appear in a function/],
  ["non-boolean if test", "plotTwist 1 {}", /Expected a boolean/],
  ["non-boolean while test", "audition 1 {}", /Expected a boolean/],
  ["non-boolean conditional test", "perform(1 ? 2 : 3)", /Expected a boolean/],
  ["mismatched conditional arms", "perform(idol ? 1 : idol)", /Operands do not have the same type/],
  ["bad types for ||", "perform(idol || 1)", /Expected a boolean/],
  ["bad types for &&", "perform(idol && 1)", /Expected a boolean/],
  ["bad types for +", "perform(idol + 1)", /Expected a number or string/],
  ["bad types for -", "perform(idol - 1)", /Expected a number/],
  ["bad types for *", "perform(idol * 1)", /Expected a number/],
  ["bad types for /", "perform(idol / 1)", /Expected a number/],
  ["bad types for **", "perform(idol ** 1)", /Expected a number/],
  ["shadowing", "idol x = 1 audition idol { idol x = 2 }", /Identifier x already declared/],
  ["function call with too many args", "episode f(x) {} f(1, 2)", /1 argument\(s\) required but 2 passed/],
  ["function call with too few args", "episode f(x) {} f()", /1 argument\(s\) required but 0 passed/],
  // 5 additional semantic errors
  ["bad index type", "idol a = [1,2,3] perform a[idol]", /Expected a number/],
  ["non-array member access", "idol x = 1 x.addMember(5)", /Expected an array/],
  ["non-array pop", "idol x = 1 x.graduate()", /Expected an array/],
  ["comparison of different types", "perform 1 < idol", /Expected a number/],
  ["modulo with non-number", "perform idol % 5", /Expected a number/],
]

describe("The analyzer", () => {
  it("throws on syntax errors", () => {
    assert.throws(() => analyze("*(^%$"))
  })
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(source), errorMessagePattern)
    })
  }
})
