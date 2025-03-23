export function program(statements) {
  return { kind: "Program", statements }
}

export function variableDeclaration(kind, name, initializer) {
  return { kind: "VariableDeclaration", kindType: kind, name, initializer }
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

export function ifStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate }
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

export function binaryExpression(op, left, right) {
  return { kind: "BinaryExpression", op, left, right }
}

export function unaryExpression(op, operand) {
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

export function memberExpression(object, property) {
  return { kind: "MemberExpression", object, property }
}

export function subscriptExpression(array, index) {
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

