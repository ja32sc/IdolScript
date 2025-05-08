export const Type = {
  VOID: "void",
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
  ARRAY: "array",
  FUNCTION: "function"
}

export const standardLibrary = {
  print: { name: "print" },
  sin: { name: "sin" },
  cos: { name: "cos" },
  exp: { name: "exp" },
  ln: { name: "ln" },
  sqrt: { name: "sqrt" },
  hypot: { name: "hypot" },
  π: { name: "π" },
  bytes: { name: "bytes" },
  codepoints: { name: "codepoints" },
  random: { name: "random" }
}


export function program(statements) {
  return { kind: "Program", statements }
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer }
}

export function variable(name, mutable, type) {
  return { kind: "Variable", name, mutable, type }
}

export function assignment(target, source) {
  return { kind: "Assignment", target, source }
}

export function functionDeclaration(name, params, body) {
  return { kind: "FunctionDeclaration", name, params, body }
}

export function functionCall(callee, args) {
  return { kind: "FunctionCall", callee, args }
}

export function IfStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate }
}

export function ShortIfStatement(test, consequent) {
  return { kind: "IfStatement", test, consequent }
}

export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body }
}

export function forRangeStatement(iterator, start, op, end, body) {
  return { kind: "ForRangeStatement", iterator, start, op, end, body }
}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression }
}

export function breakStatement() {
  return { kind: "BreakStatement" }
}

export function printStatement(expression) {
  return { kind: "PrintStatement", expression }
}

export function binary(op, left, right, type) {
  return { kind: "BinaryExpression", op, left, right, type }
}

export function floatType() {
  return { kind: "FloatType" }
}

export function unary(op, operand) {
  return { kind: "UnaryExpression", op, operand }
}

export function arrayExpression(elements) {
  return { kind: "ArrayExpression", elements }
}

export function arrayPush(array, element) {
  return { kind: "ArrayPush", array, element }
}

export function arrayPop(array) {
  return { kind: "ArrayPop", array }
}

export function memberExpression(object, op, property) {
  return { kind: "MemberExpression", object, op, property }
}

export function subscript(array, index) {
  return { kind: "SubscriptExpression", array, index }
}

export function literal(value) {
  return { kind: "Literal", value }
}

export function identifier(name) {
  return { kind: "Identifier", name }
}

export function block(statements) {
  return { kind: "Block", statements }
}

export function conditionalExpression(test, consequent, alternate) {
  return { kind: "ConditionalExpression", test, consequent, alternate }
}

export function repeatStatement(count, body) {
  return { kind: "RepeatStatement", count, body }
}

export function emptyArray(type) {
  return { kind: "EmptyArray", type }
}

export function emptyOptional(baseType) {
  return { kind: "EmptyOptional", baseType, type: optionalType(baseType) }
}

export function optionalType(baseType) {
  return { kind: "OptionalType", baseType }
}

// Additional functions needed for the tests
export function increment(target) {
  return { kind: "Increment", target };
}

export function decrement(target) {
  return { kind: "Decrement", target };
}

export function ifStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate };
}

export function shortIfStatement(test, consequent) {
  return { kind: "ShortIfStatement", test, consequent };
}

export function forStatement(iterator, collection, body) {
  return { kind: "ForStatement", iterator, collection, body };
}

export function conditional(test, consequent, alternate) {
  return { kind: "Conditional", test, consequent, alternate };
}

export function field(name, type) {
  return { kind: "Field", name, type };
}

export function typeDeclaration(fields) {
  return { kind: "TypeDeclaration", fields };
}

export function constructorCall(callee, args) {
  return { kind: "ConstructorCall", callee, args };
}

export function fun(name, params, body, type) {
  return { kind: "Function", name, params, body, type };
}

export function shortReturnStatement() {
  return { kind: "ShortReturnStatement" };
}
