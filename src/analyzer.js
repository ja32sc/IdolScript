import * as core from "./core.js";
import * as ohm from "ohm-js";
import fs from "fs";

// Read the grammar from the grammar file
const grammar = ohm.grammar(fs.readFileSync("idolscript.ohm").toString());

// Create a semantic analyzer for IdolScript
export default function analyze(sourceCode) {
  const matcher = grammar.match(sourceCode);
  if (!matcher.succeeded()) {
    throw new Error(matcher.message);
  }
  return analyzer(matcher).ast;
}

// Context for semantic analysis
class Context {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
    this.functions = new Map();
    this.inLoop = parent?.inLoop || false;
    this.inFunction = parent?.inFunction || false;
  }

  add(name, entity) {
    if (this.variables.has(name)) {
      throw new Error(`Identifier ${name} already declared`);
    }
    this.variables.set(name, entity);
    return entity;
  }

  addFunction(name, entity) {
    if (this.functions.has(name)) {
      throw new Error(`Function ${name} already declared`);
    }
    this.functions.set(name, entity);
    return entity;
  }

  lookup(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`Identifier ${name} not declared`);
  }

  lookupFunction(name) {
    if (this.functions.has(name)) {
      return this.functions.get(name);
    }
    if (this.parent) {
      return this.parent.lookupFunction(name);
    }
    throw new Error(`Function ${name} not declared`);
  }

  checkInLoop(operation) {
    if (!this.inLoop) {
      throw new Error(`${operation} can only appear in a loop`);
    }
  }

  checkInFunction(operation) {
    if (!this.inFunction) {
      throw new Error(`${operation} can only appear in a function`);
    }
  }

  newChild({ inLoop = this.inLoop, inFunction = this.inFunction } = {}) {
    const childContext = new Context(this);
    childContext.inLoop = inLoop;
    childContext.inFunction = inFunction;
    return childContext;
  }
}

// Create the analyzer object with its semantic actions
const analyzer = grammar.createSemantics().addOperation("ast", {
  Program(statements, _end) {
    const context = new Context();
    for (const name of Object.keys(core.standardLibrary)) {
      context.add(name, core.standardLibrary[name]);
    }
    return core.program(statements.ast(context));
  },

  Statement_vardec(_keyword, id, _eq, exp) {
    return function(context) {
      const name = id.sourceString;
      const value = exp.ast(context);
      const variable = core.variable(name, true, value.type);
      context.add(name, variable);
      return core.variableDeclaration(variable, value);
    };
  },

  Statement_fundec(_keyword, id, _open, params, _close, block) {
    return function(context) {
      const name = id.sourceString;
      const paramNames = params.ast();
      // Create function context for analysis
      const functionContext = context.newChild({ inFunction: true });
      // Declare parameters in function context
      const paramEntities = paramNames.map(paramName => {
        const parameter = core.variable(paramName, false, core.anyType);
        functionContext.add(paramName, parameter);
        return parameter;
      });
      // Analyze function body in function context
      const body = block.ast(functionContext);
      // Create function entity
      const functionType = core.functionType(
        paramEntities.map(p => p.type),
        core.anyType // Default return type (can be refined later)
      );
      const func = core.fun(name, paramEntities, body, functionType);
      context.addFunction(name, func);
      return core.functionDeclaration(func);
    };
  },

  Statement_assign(id, _eq, exp) {
    return function(context) {
      const name = id.sourceString;
      const value = exp.ast(context);
      const variable = context.lookup(name);
      if (!variable.mutable) {
        throw new Error(`Cannot assign to constant '${name}'`);
      }
      return core.assignment(variable, value);
    };
  },

  Statement_print(_keyword, exp) {
    return function(context) {
      return core.functionCall(core.standardLibrary.print, [exp.ast(context)]);
    };
  },

  Statement_break(_break) {
    return function(context) {
      context.checkInLoop("exitStage (break)");
      return core.breakStatement;
    };
  },

  Statement_return(_keyword, exp) {
    return function(context) {
      context.checkInFunction("encore (return)");
      return core.returnStatement(exp.ast(context));
    };
  },

  Statement_shortreturn(_keyword) {
    return function(context) {
      context.checkInFunction("encore (return)");
      return core.shortReturnStatement;
    };
  },

  Block(_open, statements, _close) {
    return function(context) {
      const blockContext = context.newChild();
      return statements.asIteration().map(s => s.ast(blockContext));
    };
  },

  IfStmt_elsif(_if, exp, block1, _else, block2) {
    return function(context) {
      return core.ifStatement(
        exp.ast(context),
        block1.ast(context),
        block2.ast(context)
      );
    };
  },

  IfStmt_long(_if, exp, block) {
    return function(context) {
      return core.shortIfStatement(exp.ast(context), block.ast(context));
    };
  },

  WhileStmt_while(_while, exp, block) {
    return function(context) {
      return core.whileStatement(
        exp.ast(context),
        block.ast(context.newChild({ inLoop: true }))
      );
    };
  },

  WhileStmt_repeat(_repeat, exp, block) {
    return function(context) {
      return core.repeatStatement(
        exp.ast(context),
        block.ast(context.newChild({ inLoop: true }))
      );
    };
  },

  ForStmt_range(_for, id, _in, exp1, op, exp2, block) {
    return function(context) {
      const iterator = id.sourceString;
      const loopContext = context.newChild({ inLoop: true });
      const iteratorVar = core.variable(iterator, true, core.intType);
      loopContext.add(iterator, iteratorVar);
      return core.forRangeStatement(
        iteratorVar,
        exp1.ast(context),
        op.sourceString,
        exp2.ast(context),
        block.ast(loopContext)
      );
    };
  },

  ArrayOp_push(id, _dot, _push, _open, exp, _close) {
    return function(context) {
      const array = context.lookup(id.sourceString);
      if (!array.type || array.type.kind !== "ArrayType") {
        throw new Error(`${id.sourceString} is not an array`);
      }
      return {
        kind: "ArrayPush",
        array,
        element: exp.ast(context)
      };
    };
  },

  ArrayOp_pop(id, _dot, _pop, _open, _close) {
    return function(context) {
      const array = context.lookup(id.sourceString);
      if (!array.type || array.type.kind !== "ArrayType") {
        throw new Error(`${id.sourceString} is not an array`);
      }
      return {
        kind: "ArrayPop",
        array
      };
    };
  },

  Exp_unary(op, exp) {
    return function(context) {
      const operand = exp.ast(context);
      const operator = op.sourceString;

      // Determine result type based on the operator and operand
      let type;
      if (operator === "!") {
        if (operand.type !== core.booleanType) {
          throw new Error("Logical NOT can only be applied to booleans");
        }
        type = core.booleanType;
      } else if (operator === "-") {
        if (operand.type !== core.intType && operand.type !== core.floatType) {
          throw new Error("Negation can only be applied to numbers");
        }
        type = operand.type;
      }

      return core.unary(operator, operand, type);
    };
  },

  Exp_ternary(exp1, _q, exp2, _colon, exp3) {
    return function(context) {
      const test = exp1.ast(context);
      const consequent = exp2.ast(context);
      const alternate = exp3.ast(context);

      if (test.type !== core.booleanType) {
        throw new Error("Test in conditional expression must be a boolean");
      }

      if (consequent.type !== alternate.type) {
        throw new Error("Type mismatch in conditional expression branches");
      }

      return core.conditional(test, consequent, alternate, consequent.type);
    };
  },

  Exp1_or(exp1, _or, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);

      if (left.type !== core.booleanType || right.type !== core.booleanType) {
        throw new Error("Logical OR requires boolean operands");
      }

      return core.binary("||", left, right, core.booleanType);
    };
  },

  Exp2_and(exp1, _and, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);

      if (left.type !== core.booleanType || right.type !== core.booleanType) {
        throw new Error("Logical AND requires boolean operands");
      }

      return core.binary("&&", left, right, core.booleanType);
    };
  },

  Exp3_compare(exp1, op, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);
      const operator = op.sourceString;

      // Ensure types are compatible for comparison
      if ((left.type !== right.type) &&
          !((left.type === core.intType && right.type === core.floatType) ||
            (left.type === core.floatType && right.type === core.intType))) {
        throw new Error(`Cannot compare ${left.type} with ${right.type}`);
      }

      return core.binary(operator, left, right, core.booleanType);
    };
  },

  Exp4_addsub(exp1, op, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);
      const operator = op.sourceString;

      // Check if operator is valid for the operand types
      if ((left.type !== core.intType && left.type !== core.floatType && left.type !== core.stringType) ||
          (right.type !== core.intType && right.type !== core.floatType && right.type !== core.stringType)) {
        throw new Error(`${operator} requires numeric or string operands`);
      }

      // String concatenation
      if (left.type === core.stringType || right.type === core.stringType) {
        if (operator === "-") {
          throw new Error("Cannot subtract strings");
        }
        return core.binary(operator, left, right, core.stringType);
      }

      // Determine result type (float if either operand is float)
      const resultType = (left.type === core.floatType || right.type === core.floatType)
        ? core.floatType
        : core.intType;

      return core.binary(operator, left, right, resultType);
    };
  },

  Exp5_muldivmod(exp1, op, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);
      const operator = op.sourceString;

      // Check operand types
      if (left.type !== core.intType && left.type !== core.floatType) {
        throw new Error(`Left operand of ${operator} must be numeric`);
      }
      if (right.type !== core.intType && right.type !== core.floatType) {
        throw new Error(`Right operand of ${operator} must be numeric`);
      }

      // Determine result type (float if either operand is float)
      const resultType = (left.type === core.floatType || right.type === core.floatType)
        ? core.floatType
        : core.intType;

      return core.binary(operator, left, right, resultType);
    };
  },

  Exp6_exp(exp1, _exp, exp2) {
    return function(context) {
      const left = exp1.ast(context);
      const right = exp2.ast(context);

      // Check operand types
      if (left.type !== core.intType && left.type !== core.floatType) {
        throw new Error("Base of exponentiation must be numeric");
      }
      if (right.type !== core.intType && right.type !== core.floatType) {
        throw new Error("Exponent must be numeric");
      }

      // Result is always float for exponentiation
      return core.binary("**", left, right, core.floatType);
    };
  },

  Exp7_member(exp, _dot, id) {
    return function(context) {
      const object = exp.ast(context);
      const fieldName = id.sourceString;

      // Check that object has fields (is a struct type)
      if (!object.type || !object.type.fields) {
        throw new Error(`Cannot access field '${fieldName}' of non-struct type`);
      }

      // Find the field
      const field = object.type.fields.find(f => f.name === fieldName);
      if (!field) {
        throw new Error(`Field '${fieldName}' not found in struct`);
      }

      return core.memberExpression(object, ".", field);
    };
  },

  Exp7_index(exp, _open, index, _close) {
    return function(context) {
      const array = exp.ast(context);
      const indexExp = index.ast(context);

      // Check that we're indexing an array
      if (!array.type || array.type.kind !== "ArrayType") {
        throw new Error("Cannot index a non-array");
      }

      // Check that index is an integer
      if (indexExp.type !== core.intType) {
        throw new Error("Array index must be an integer");
      }

      return core.subscript(array, indexExp);
    };
  },

  Exp7_float(_float) {
    return function(context) {
      return parseFloat(this.sourceString);
    };
  },

  Exp7_num(_num) {
    return function(context) {
      return BigInt(this.sourceString);
    };
  },

  Exp7_true(_true) {
    return function(context) {
      return true;
    };
  },

  Exp7_false(_false) {
    return function(context) {
      return false;
    };
  },

  Exp7_id(id) {
    return function(context) {
      return context.lookup(id.sourceString);
    };
  },

  ArrayLiteral_array(_open, elements, _close) {
    return function(context) {
      const elementList = elements.asIteration().map(e => e.ast(context));
      if (elementList.length === 0) {
        return core.emptyArray(core.anyType);
      }

      // Check that all elements have the same type
      const firstType = elementList[0].type;
      for (let i = 1; i < elementList.length; i++) {
        if (elementList[i].type !== firstType) {
          throw new Error("Array elements must have the same type");
        }
      }

      return core.arrayExpression(elementList);
    };
  },

  strlit_string(_open, chars, _close) {
    return function(context) {
      // Process escape sequences and return the string
      return this.sourceString.slice(1, -1);
    };
  },

  Call_call(id, _open, args, _close) {
    return function(context) {
      const name = id.sourceString;
      let func;

      try {
        func = context.lookupFunction(name);
      } catch (e) {
        // Check if it's a standard library function
        if (core.standardLibrary[name] && core.standardLibrary[name].intrinsic) {
          func = core.standardLibrary[name];
        } else {
          throw new Error(`Function '${name}' not defined`);
        }
      }

      const argList = args.asIteration().map(a => a.ast(context));

      // Check argument count matches parameters
      if (func.type && func.type.paramTypes && func.type.paramTypes.length !== argList.length) {
        throw new Error(`Function '${name}' called with wrong number of arguments`);
      }

      return core.functionCall(func, argList);
    };
  },

  Params_params(ids) {
    return ids.asIteration().map(id => id.sourceString);
  },

  Args_args(exps) {
    return exps.asIteration();
  },

  Exp7_parens(_open, exp, _close) {
    return function(context) {
      return exp.ast(context);
    };
  },

  _iter(...children) {
    return children.map(child => child.ast);
  },

  _terminal() {
    return this.sourceString;
  },

  _nonterminal(children) {
    const childResults = children.map(child => child.ast);
    if (childResults.length === 1) {
      return childResults[0];
    }
    return childResults;
  },
});

// Exports
export { Context };
