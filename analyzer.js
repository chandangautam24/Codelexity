var CodelexityModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/analyzer/Analyzer.js
  var Analyzer_exports = {};
  __export(Analyzer_exports, {
    Analyzer: () => Analyzer
  });

  // src/engine/ast/ASTNode.js
  var nextNodeId = 1;
  var ASTNode = class _ASTNode {
    constructor(type, properties = {}) {
      this.id = nextNodeId++;
      this.type = type;
      this.parent = null;
      this.children = [];
      for (const [key, value] of Object.entries(properties)) {
        this[key] = value;
      }
      if (properties.body && Array.isArray(properties.body)) {
        for (const child of properties.body) {
          if (child instanceof _ASTNode) this.addChild(child);
        }
      }
    }
    addChild(child) {
      if (!child) return;
      if (Array.isArray(child)) {
        child.forEach((c) => this.addChild(c));
        return;
      }
      if (child instanceof _ASTNode) {
        child.parent = this;
        this.children.push(child);
      }
    }
    getNestingDepth(nodeType = null) {
      let depth = 0;
      let curr = this.parent;
      while (curr) {
        if (!nodeType || curr.type === nodeType) {
          depth++;
        }
        curr = curr.parent;
      }
      return depth;
    }
    findChildren(type) {
      const results = [];
      for (const child of this.children) {
        if (child.type === type) results.push(child);
        results.push(...child.findChildren(type));
      }
      return results;
    }
    findAncestor(predicate) {
      let curr = this.parent;
      while (curr) {
        if (predicate(curr)) return curr;
        curr = curr.parent;
      }
      return null;
    }
    walk(callback) {
      callback(this);
      for (const child of this.children) {
        child.walk(callback);
      }
    }
  };
  var NODE_TYPES = Object.freeze({
    PROGRAM: "Program",
    FUNCTION_DECLARATION: "FunctionDeclaration",
    CLASS_DECLARATION: "ClassDeclaration",
    BLOCK_STATEMENT: "BlockStatement",
    FOR_STATEMENT: "ForStatement",
    WHILE_STATEMENT: "WhileStatement",
    DO_WHILE_STATEMENT: "DoWhileStatement",
    IF_STATEMENT: "IfStatement",
    RETURN_STATEMENT: "ReturnStatement",
    BREAK_STATEMENT: "BreakStatement",
    CONTINUE_STATEMENT: "ContinueStatement",
    VARIABLE_DECLARATION: "VariableDeclaration",
    EXPRESSION_STATEMENT: "ExpressionStatement",
    CALL_EXPRESSION: "CallExpression",
    BINARY_EXPRESSION: "BinaryExpression",
    ASSIGNMENT_EXPRESSION: "AssignmentExpression",
    UPDATE_EXPRESSION: "UpdateExpression",
    IDENTIFIER: "Identifier",
    LITERAL: "Literal"
  });

  // src/shared/constants.js
  var PLATFORMS = Object.freeze({
    LEETCODE: "LeetCode",
    GEEKSFORGEEKS: "GeeksforGeeks",
    UNKNOWN: "Unknown"
  });
  var LANGUAGES = Object.freeze({
    CPP: "C++",
    JAVA: "Java",
    PYTHON: "Python",
    JAVASCRIPT: "JavaScript",
    UNKNOWN: "Unknown"
  });
  var UI_STATES = Object.freeze({
    IDLE: "IDLE",
    ANALYZING: "ANALYZING",
    SUCCESS: "SUCCESS",
    SYNTAX_ERROR: "SYNTAX_ERROR",
    UNSUPPORTED_LANGUAGE: "UNSUPPORTED_LANGUAGE",
    EDITOR_NOT_FOUND: "EDITOR_NOT_FOUND",
    PARSER_ERROR: "PARSER_ERROR",
    LOW_CONFIDENCE: "LOW_CONFIDENCE",
    NO_CODE: "NO_CODE"
  });
  var COMPLEXITY_FAMILIES = Object.freeze({
    CONSTANT: "constant",
    LOGARITHMIC: "logarithmic",
    SQRT: "sqrt",
    POLYNOMIAL: "polynomial",
    POLYLOG: "polylog",
    EXPONENTIAL: "exponential",
    FACTORIAL: "factorial",
    GRAPH_LINEAR: "graph_linear",
    GRAPH_LOG: "graph_log",
    GRAPH_CUBIC: "graph_cubic",
    UNKNOWN: "unknown"
  });
  var COMPLEXITY_CLASSES = Object.freeze({
    O_1: "O(1)",
    O_LOG_N: "O(log n)",
    O_SQRT_N: "O(\u221An)",
    O_N: "O(n)",
    O_N_LOG_N: "O(n log n)",
    O_N_SQRT_N: "O(n\u221An)",
    O_N2: "O(n\xB2)",
    O_N3: "O(n\xB3)",
    O_2N: "O(2^n)",
    O_3N: "O(3^n)",
    O_4N: "O(4^n)",
    O_N_FACT: "O(n!)",
    O_V_E: "O(V + E)",
    O_V_E_LOG_V: "O((V + E) log V)",
    O_V3: "O(V\xB3)",
    UNKNOWN: "Unknown"
  });
  var CONFIDENCE_LEVELS = Object.freeze({
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW"
  });
  var STEP_TYPES = Object.freeze({
    LINEAR: "linear",
    LOGARITHMIC: "logarithmic",
    CONSTANT: "constant",
    SQRT: "sqrt",
    DEPENDENT: "dependent"
  });
  var CONTAINER_TYPES = Object.freeze({
    SCALAR: "scalar",
    LINEAR_ARRAY: "linear_array",
    HASH_MAP: "hash_map",
    HASH_SET: "hash_set",
    TREE_MAP: "tree_map",
    STACK_QUEUE: "stack_queue",
    MATRIX_2D: "matrix_2d",
    GRAPH_ADJ: "graph_adj"
  });
  var DEFAULT_SETTINGS = Object.freeze({
    realtimeAnalysis: true,
    debounceMs: 350,
    autoExpandOnHeavyComplexity: false
  });

  // src/engine/parsers/BaseParser.js
  var BaseParser = class {
    constructor(language) {
      this.language = language;
    }
    stripComments(code) {
      if (!code) return "";
      if (this.language === "Python") {
        return code.replace(/(?<!["'])#.*$/gm, (m) => " ".repeat(m.length));
      }
      return code.replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length)).replace(/\/\/.*$/gm, (m) => " ".repeat(m.length)).replace(/(?<!["'])#.*$/gm, (m) => " ".repeat(m.length));
    }
    findMatching(str, startIndex, openChar = "(", closeChar = ")") {
      let depth = 0;
      let inString = false;
      let stringChar = "";
      for (let i = startIndex; i < str.length; i++) {
        const c = str[i];
        if (inString) {
          if (c === stringChar && str[i - 1] !== "\\") {
            inString = false;
          }
          continue;
        } else if (c === '"' || c === "'") {
          inString = true;
          stringChar = c;
          continue;
        }
        if (c === openChar) {
          depth++;
        } else if (c === closeChar) {
          depth--;
          if (depth === 0) return i;
        }
      }
      return -1;
    }
    classifyLoopStep(stepStr, varName = null) {
      if (!stepStr) return STEP_TYPES.LINEAR;
      const s = stepStr.replace(/\s+/g, "");
      if (/\*=|(\/=|>>=|<<=)/.test(s) || /\b\w+\s*=\s*\w+\s*(\*|\/|>>|<<)\s*\d+/.test(s) || /(>>|<<)\s*1\b|\/\s*2\b/.test(s)) {
        return STEP_TYPES.LOGARITHMIC;
      }
      if (varName && new RegExp(`[+\\-*/]=.*\\b${varName}\\b`).test(s)) {
        return STEP_TYPES.DEPENDENT;
      }
      return STEP_TYPES.LINEAR;
    }
    parse(code) {
      throw new Error("parse(code) must be implemented by concrete language parser");
    }
  };

  // src/engine/parsers/cppParser.js
  var CppParser = class extends BaseParser {
    constructor() {
      super("C++");
    }
    parse(rawCode) {
      const code = this.stripComments(rawCode);
      const root = new ASTNode(NODE_TYPES.PROGRAM, { language: "C++" });
      const errors = [];
      try {
        const functions = this.extractFunctions(code);
        const functionNodes = [];
        for (const fn of functions) {
          const fnNode = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: fn.name,
            params: fn.params,
            rawBody: fn.body
          });
          root.addChild(fnNode);
          functionNodes.push(fnNode);
          this.parseStatements(fnNode, fn.body, fn.name);
        }
        if (functionNodes.length === 0) {
          const defaultFn = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: "main_or_snippet",
            params: "",
            rawBody: code
          });
          root.addChild(defaultFn);
          this.parseStatements(defaultFn, code, "main_or_snippet");
        }
        return {
          root,
          language: "C++",
          success: true,
          errors
        };
      } catch (err) {
        errors.push(err.message);
        return {
          root,
          language: "C++",
          success: false,
          errors
        };
      }
    }
    extractFunctions(code) {
      const fns = [];
      const fnRegex = /(?:(?:public|private|protected|static|inline|virtual)\s*:?\s*)*(?:[\w<>:*&]+\s+)+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(?:const)?\s*\{/g;
      let m;
      while (m = fnRegex.exec(code)) {
        const fnName = m[1];
        const params = m[2];
        if (["if", "for", "while", "switch", "catch", "class", "struct"].includes(fnName)) continue;
        const openBraceIdx = fnRegex.lastIndex - 1;
        const closeBraceIdx = this.findMatching(code, openBraceIdx, "{", "}");
        if (closeBraceIdx !== -1) {
          const body = code.slice(openBraceIdx + 1, closeBraceIdx);
          fns.push({ name: fnName, params, body });
        }
      }
      return fns;
    }
    parseStatements(parentNode, code, currentFnName) {
      let i = 0;
      while (i < code.length) {
        while (i < code.length && /[\s;{}]/.test(code[i])) i++;
        if (i >= code.length) break;
        const rest = code.slice(i);
        const forMatch = rest.match(/^for\s*\(/);
        if (forMatch) {
          const parenStart = i + forMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const forHeader = code.slice(parenStart + 1, parenEnd);
            const parts = forHeader.split(";");
            let forNode;
            if (parts.length >= 3) {
              const init = parts[0].trim();
              const test = parts[1].trim();
              const update = parts.slice(2).join(";").trim();
              const varMatch = init.match(/(?:int|size_t|auto|long)?\s*([A-Za-z_]\w*)\s*=/);
              const varName = varMatch ? varMatch[1] : null;
              const stepType = this.classifyLoopStep(update, varName);
              const isDependent = /<|\b/.test(test) && /\b(i|j|k|m|n)\b/.test(init) && init.includes("=");
              const isSqrt = /(\b\w+\s*\*\s*\w+\s*<=?\s*[a-zA-Z_]\w*)|(sqrt\s*\()/i.test(test);
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                init,
                test,
                update,
                varName,
                stepType,
                isDependent,
                isSqrt
              });
            } else {
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                isRangeBased: true,
                stepType: STEP_TYPES.LINEAR,
                header: forHeader
              });
            }
            parentNode.addChild(forNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const loopBodyCode = code.slice(bodyStart + 1, bodyEnd);
                forNode.bodyCode = loopBodyCode;
                this.parseStatements(forNode, loopBodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            } else {
              const semi = code.indexOf(";", parenEnd);
              if (semi !== -1) {
                const singleStmtCode = code.slice(parenEnd + 1, semi + 1);
                forNode.bodyCode = singleStmtCode;
                this.parseStatements(forNode, singleStmtCode, currentFnName);
                i = semi + 1;
                continue;
              }
            }
          }
        }
        const whileMatch = rest.match(/^while\s*\(/);
        if (whileMatch) {
          const parenStart = i + whileMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const isBinarySearch = /(lo|left|low)\s*<=?\s*(hi|right|high)/.test(condition) && /(mid|m)\s*=/.test(code) && /\/\s*2\b|>>\s*1\b/.test(code) || /(mid|m)\s*=.*(?:\/\s*2|>>\s*1)/.test(code);
            const stepType = isBinarySearch ? STEP_TYPES.LOGARITHMIC : STEP_TYPES.LINEAR;
            const whileNode = new ASTNode(NODE_TYPES.WHILE_STATEMENT, {
              condition,
              stepType,
              isBinarySearch
            });
            parentNode.addChild(whileNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const bodyCode = code.slice(bodyStart + 1, bodyEnd);
                whileNode.bodyCode = bodyCode;
                if (/(>>=|<<=|\/=|(?:\b\w+\s*=\s*\w+\s*(?:\/|>>)\s*(?:2|1)))/.test(bodyCode)) {
                  whileNode.stepType = STEP_TYPES.LOGARITHMIC;
                }
                this.parseStatements(whileNode, bodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            } else {
              const semi = code.indexOf(";", parenEnd);
              if (semi !== -1) {
                const singleStmtCode = code.slice(parenEnd + 1, semi + 1);
                whileNode.bodyCode = singleStmtCode;
                this.parseStatements(whileNode, singleStmtCode, currentFnName);
                i = semi + 1;
                continue;
              }
            }
          }
        }
        const ifMatch = rest.match(/^if\s*\(/);
        if (ifMatch) {
          const parenStart = i + ifMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const ifNode = new ASTNode(NODE_TYPES.IF_STATEMENT, { condition });
            parentNode.addChild(ifNode);
            const between = code.slice(parenEnd + 1, parenEnd + 15);
            if (between.includes("{")) {
              const bodyStart = code.indexOf("{", parenEnd);
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const consequentCode = code.slice(bodyStart + 1, bodyEnd);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, consequentCode, currentFnName);
                i = bodyEnd + 1;
                const afterIf = code.slice(i).trimStart();
                if (afterIf.startsWith("else")) {
                  const elseIdx = code.indexOf("else", i);
                  const elseBodyStart = code.indexOf("{", elseIdx);
                  if (elseBodyStart !== -1 && elseBodyStart - elseIdx < 20) {
                    const elseBodyEnd = this.findMatching(code, elseBodyStart, "{", "}");
                    if (elseBodyEnd !== -1) {
                      const alternateCode = code.slice(elseBodyStart + 1, elseBodyEnd);
                      const alternateNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "else" });
                      ifNode.addChild(alternateNode);
                      this.parseStatements(alternateNode, alternateCode, currentFnName);
                      i = elseBodyEnd + 1;
                    }
                  }
                }
                continue;
              }
            } else {
              const semi = code.indexOf(";", parenEnd);
              if (semi !== -1) {
                const singleStmtCode = code.slice(parenEnd + 1, semi + 1);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, singleStmtCode, currentFnName);
                i = semi + 1;
                continue;
              }
            }
          }
        }
        if (rest.startsWith("break;") || rest.startsWith("break ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.BREAK_STATEMENT));
          i += 6;
          continue;
        }
        if (rest.startsWith("continue;") || rest.startsWith("continue ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.CONTINUE_STATEMENT));
          i += 9;
          continue;
        }
        if (rest.startsWith("return ") || rest.startsWith("return;") || rest === "return") {
          const retNode = new ASTNode(NODE_TYPES.RETURN_STATEMENT);
          parentNode.addChild(retNode);
          const semi = code.indexOf(";", i);
          if (semi !== -1) {
            const retExpr = code.slice(i + 6, semi);
            this.parseStatements(retNode, retExpr, currentFnName);
            i = semi + 1;
          } else {
            i += 6;
          }
          continue;
        }
        const containerDecl = this.matchContainerDeclaration(rest);
        if (containerDecl) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.VARIABLE_DECLARATION, {
              containerType: containerDecl.type,
              containerKind: containerDecl.containerKind,
              isPriorityQueue: containerDecl.isPriorityQueue,
              name: containerDecl.name,
              isFixedSize: containerDecl.isFixedSize
            })
          );
          const semi = code.indexOf(";", i);
          if (semi !== -1) {
            i = semi + 1;
            continue;
          } else {
            i += rest.length;
            break;
          }
        }
        const call = this.matchCallExpression(rest, currentFnName);
        if (call) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.CALL_EXPRESSION, {
              callee: call.callee,
              args: call.args,
              isSorting: call.isSorting,
              isBinarySearch: call.isBinarySearch
            })
          );
          i += call.length;
          continue;
        }
        i++;
      }
    }
    matchContainerDeclaration(str) {
      const sqMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?(priority_queue|queue|stack|deque)\s*</);
      if (sqMatch) {
        const containerKind = sqMatch[1];
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return {
              type: CONTAINER_TYPES.STACK_QUEUE,
              containerKind,
              isPriorityQueue: containerKind === "priority_queue",
              name: varMatch[1],
              isFixedSize: false
            };
          }
        }
      }
      const vec2dMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?vector\s*<\s*(?:std::)?vector\s*</);
      if (vec2dMatch) {
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return { type: CONTAINER_TYPES.MATRIX_2D, name: varMatch[1], isFixedSize: false };
          }
        }
      }
      const arr2dMatch = str.match(/^(?:(?:const|static)\s+)?(?:int|double|long|bool|char)\s+([A-Za-z_]\w*)\s*\[[^\]]+\]\s*\[[^\]]+\]/);
      if (arr2dMatch) {
        return { type: CONTAINER_TYPES.MATRIX_2D, name: arr2dMatch[1], isFixedSize: false };
      }
      const uMapMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?unordered_map\s*</);
      if (uMapMatch) {
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return { type: CONTAINER_TYPES.HASH_MAP, name: varMatch[1], isFixedSize: false };
          }
        }
      }
      const uSetMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?unordered_set\s*</);
      if (uSetMatch) {
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return { type: CONTAINER_TYPES.HASH_SET, name: varMatch[1], isFixedSize: false };
          }
        }
      }
      const tMapMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?map\s*</);
      if (tMapMatch) {
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return { type: CONTAINER_TYPES.TREE_MAP, name: varMatch[1], isFixedSize: false };
          }
        }
      }
      const fixedArrMatch = str.match(/^(?:(?:const|static)\s+)?(?:int|char|bool)\s+([A-Za-z_]\w*)\s*\[\s*(\d+)\s*\]/);
      if (fixedArrMatch) {
        const size = parseInt(fixedArrMatch[2], 10);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: fixedArrMatch[1], isFixedSize: size <= 1024 };
      }
      const vecMatch = str.match(/^(?:(?:const|static)\s+)?(?:std::)?vector\s*</);
      if (vecMatch) {
        const angleStart = str.indexOf("<");
        const angleEnd = this.findMatching(str, angleStart, "<", ">");
        if (angleEnd !== -1) {
          const afterAngle = str.slice(angleEnd + 1);
          const fixedMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)\s*\(\s*(\d+)/);
          if (fixedMatch) {
            const size = parseInt(fixedMatch[2], 10);
            return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: fixedMatch[1], isFixedSize: size <= 1024 };
          }
          const varMatch = afterAngle.match(/^\s*([A-Za-z_]\w*)/);
          if (varMatch) {
            return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: varMatch[1], isFixedSize: false };
          }
        }
      }
      return null;
    }
    matchCallExpression(str, currentFnName) {
      const callMatch = str.match(/^([A-Za-z_]\w*(?:::[A-Za-z_]\w*|(?:\.|\->)[A-Za-z_]\w*)?)\s*\(/);
      if (!callMatch) return null;
      const callee = callMatch[1];
      if (["if", "for", "while", "switch", "sizeof", "catch", "vector", "return"].includes(callee)) {
        return null;
      }
      const parenStart = str.indexOf("(");
      const parenEnd = this.findMatching(str, parenStart, "(", ")");
      const args = parenEnd !== -1 ? str.slice(parenStart + 1, parenEnd) : "";
      const isSorting = callee === "sort" || callee === "std::sort" || callee.endsWith(".sort");
      const isBinarySearch = callee === "binary_search" || callee === "std::binary_search" || callee.includes("lower_bound") || callee.includes("upper_bound");
      const length = parenEnd !== -1 ? parenEnd + 1 : callMatch[0].length;
      return { callee, args, isSorting, isBinarySearch, length };
    }
  };

  // src/engine/parsers/javaParser.js
  var JavaParser = class extends BaseParser {
    constructor() {
      super("Java");
    }
    parse(rawCode) {
      const code = this.stripComments(rawCode);
      const root = new ASTNode(NODE_TYPES.PROGRAM, { language: "Java" });
      const errors = [];
      try {
        const functions = this.extractMethods(code);
        const functionNodes = [];
        for (const fn of functions) {
          const fnNode = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: fn.name,
            params: fn.params,
            rawBody: fn.body
          });
          root.addChild(fnNode);
          functionNodes.push(fnNode);
          this.parseStatements(fnNode, fn.body, fn.name);
        }
        if (functionNodes.length === 0) {
          const defaultFn = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: "main_or_snippet",
            params: "",
            rawBody: code
          });
          root.addChild(defaultFn);
          this.parseStatements(defaultFn, code, "main_or_snippet");
        }
        return {
          root,
          language: "Java",
          success: true,
          errors
        };
      } catch (err) {
        errors.push(err.message);
        return {
          root,
          language: "Java",
          success: false,
          errors
        };
      }
    }
    extractMethods(code) {
      const methods = [];
      const methodRegex = /(?:(?:public|private|protected|static|final|synchronized)\s+)*(?:[\w<>\[\],\s]+)\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*\{/g;
      let m;
      while (m = methodRegex.exec(code)) {
        const fnName = m[1];
        const params = m[2];
        if (["if", "for", "while", "switch", "catch", "class", "interface"].includes(fnName)) continue;
        const openBraceIdx = methodRegex.lastIndex - 1;
        const closeBraceIdx = this.findMatching(code, openBraceIdx, "{", "}");
        if (closeBraceIdx !== -1) {
          const body = code.slice(openBraceIdx + 1, closeBraceIdx);
          methods.push({ name: fnName, params, body });
        }
      }
      return methods;
    }
    parseStatements(parentNode, code, currentFnName) {
      let i = 0;
      while (i < code.length) {
        while (i < code.length && /[\s;{}]/.test(code[i])) i++;
        if (i >= code.length) break;
        const rest = code.slice(i);
        const forMatch = rest.match(/^for\s*\(/);
        if (forMatch) {
          const parenStart = i + forMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const forHeader = code.slice(parenStart + 1, parenEnd);
            const parts = forHeader.split(";");
            let forNode;
            if (parts.length >= 3) {
              const init = parts[0].trim();
              const test = parts[1].trim();
              const update = parts.slice(2).join(";").trim();
              const varMatch = init.match(/(?:int|long|double|float)?\s*([A-Za-z_]\w*)\s*=/);
              const varName = varMatch ? varMatch[1] : null;
              const stepType = this.classifyLoopStep(update, varName);
              const isDependent = /<|\b/.test(test) && /\b(i|j|k|m|n)\b/.test(init) && init.includes("=");
              const isSqrt = /(\b\w+\s*\*\s*\w+\s*<=?\s*[a-zA-Z_]\w*)|(Math\.sqrt\s*\()/i.test(test);
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                init,
                test,
                update,
                varName,
                stepType,
                isDependent,
                isSqrt
              });
            } else {
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                isRangeBased: true,
                stepType: STEP_TYPES.LINEAR,
                header: forHeader
              });
            }
            parentNode.addChild(forNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const loopBodyCode = code.slice(bodyStart + 1, bodyEnd);
                forNode.bodyCode = loopBodyCode;
                this.parseStatements(forNode, loopBodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            }
          }
        }
        const whileMatch = rest.match(/^while\s*\(/);
        if (whileMatch) {
          const parenStart = i + whileMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const isBinarySearch = /(lo|left|low)\s*<=?\s*(hi|right|high)/.test(condition) && /(mid|m)\s*=/.test(code) && /\/\s*2\b|>>\s*1\b/.test(code) || /(mid|m)\s*=.*(?:\/\s*2|>>\s*1)/.test(code);
            const stepType = isBinarySearch ? STEP_TYPES.LOGARITHMIC : STEP_TYPES.LINEAR;
            const whileNode = new ASTNode(NODE_TYPES.WHILE_STATEMENT, {
              condition,
              stepType,
              isBinarySearch
            });
            parentNode.addChild(whileNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const bodyCode = code.slice(bodyStart + 1, bodyEnd);
                whileNode.bodyCode = bodyCode;
                if (/(>>=|<<=|\/=|(?:\b\w+\s*=\s*\w+\s*(?:\/|>>)\s*(?:2|1)))/.test(bodyCode)) {
                  whileNode.stepType = STEP_TYPES.LOGARITHMIC;
                }
                this.parseStatements(whileNode, bodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            }
          }
        }
        const ifMatch = rest.match(/^if\s*\(/);
        if (ifMatch) {
          const parenStart = i + ifMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const ifNode = new ASTNode(NODE_TYPES.IF_STATEMENT, { condition });
            parentNode.addChild(ifNode);
            const between = code.slice(parenEnd + 1, parenEnd + 15);
            if (between.includes("{")) {
              const bodyStart = code.indexOf("{", parenEnd);
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const consequentCode = code.slice(bodyStart + 1, bodyEnd);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, consequentCode, currentFnName);
                i = bodyEnd + 1;
                const afterIf = code.slice(i).trimStart();
                if (afterIf.startsWith("else")) {
                  const elseIdx = code.indexOf("else", i);
                  const elseBodyStart = code.indexOf("{", elseIdx);
                  if (elseBodyStart !== -1 && elseBodyStart - elseIdx < 20) {
                    const elseBodyEnd = this.findMatching(code, elseBodyStart, "{", "}");
                    if (elseBodyEnd !== -1) {
                      const alternateCode = code.slice(elseBodyStart + 1, elseBodyEnd);
                      const alternateNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "else" });
                      ifNode.addChild(alternateNode);
                      this.parseStatements(alternateNode, alternateCode, currentFnName);
                      i = elseBodyEnd + 1;
                    }
                  }
                }
                continue;
              }
            } else {
              const semi = code.indexOf(";", parenEnd);
              if (semi !== -1) {
                const singleStmtCode = code.slice(parenEnd + 1, semi + 1);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, singleStmtCode, currentFnName);
                i = semi + 1;
                continue;
              }
            }
          }
        }
        if (rest.startsWith("break;") || rest.startsWith("break ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.BREAK_STATEMENT));
          i += 6;
          continue;
        }
        if (rest.startsWith("continue;") || rest.startsWith("continue ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.CONTINUE_STATEMENT));
          i += 9;
          continue;
        }
        if (rest.startsWith("return ") || rest.startsWith("return;") || rest === "return") {
          const retNode = new ASTNode(NODE_TYPES.RETURN_STATEMENT);
          parentNode.addChild(retNode);
          const semi = code.indexOf(";", i);
          if (semi !== -1) {
            const retExpr = code.slice(i + 6, semi);
            this.parseStatements(retNode, retExpr, currentFnName);
            i = semi + 1;
          } else {
            i += 6;
          }
          continue;
        }
        const containerDecl = this.matchContainerDeclaration(rest);
        if (containerDecl) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.VARIABLE_DECLARATION, {
              containerType: containerDecl.type,
              containerKind: containerDecl.containerKind,
              isPriorityQueue: containerDecl.isPriorityQueue,
              name: containerDecl.name,
              isFixedSize: containerDecl.isFixedSize
            })
          );
          const semi = code.indexOf(";", i);
          if (semi !== -1) {
            i = semi + 1;
            continue;
          }
        }
        const call = this.matchCallExpression(rest, currentFnName);
        if (call) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.CALL_EXPRESSION, {
              callee: call.callee,
              args: call.args,
              isSorting: call.isSorting,
              isBinarySearch: call.isBinarySearch
            })
          );
          i += call.length;
          continue;
        }
        i++;
      }
    }
    matchContainerDeclaration(str) {
      if (/\b(?:int|double|long|boolean|char)\s*\[\s*\]\s*\[\s*\]\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:int|double|long|boolean|char)\s*\[\s*\]\s*\[\s*\]\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.MATRIX_2D, name: m[1], isFixedSize: false };
      }
      if (/\b(?:HashMap|Map)\s*<[^>]+>\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:HashMap|Map)\s*<[^>]+>\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.HASH_MAP, name: m[1], isFixedSize: false };
      }
      if (/\b(?:HashSet|Set)\s*<[^>]+>\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:HashSet|Set)\s*<[^>]+>\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.HASH_SET, name: m[1], isFixedSize: false };
      }
      if (/\b(?:TreeMap|TreeSet)\s*<[^>]+>\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:TreeMap|TreeSet)\s*<[^>]+>\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.TREE_MAP, name: m[1], isFixedSize: false };
      }
      if (/\b(?:PriorityQueue|Queue|Deque|ArrayDeque|Stack)\s*<[^>]+>\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:PriorityQueue|Queue|Deque|ArrayDeque|Stack)\s*<[^>]+>\s*([A-Za-z_]\w*)/);
        const isPQ = /PriorityQueue/.test(m[0]);
        const kind = isPQ ? "priority_queue" : /Stack/.test(m[0]) ? "stack" : /Deque/.test(m[0]) ? "deque" : "queue";
        return { type: CONTAINER_TYPES.STACK_QUEUE, containerKind: kind, name: m[1], isFixedSize: false, isPriorityQueue: isPQ };
      }
      if (/new\s+(?:int|char|boolean)\s*\[\s*(\d+)\s*\]/.test(str)) {
        const m = str.match(/(?:(?:int|char|boolean)\s*\[\s*\]\s*([A-Za-z_]\w*))?[\s\S]*?new\s+(?:int|char|boolean)\s*\[\s*(\d+)\s*\]/);
        const size = m && m[2] ? parseInt(m[2], 10) : 0;
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: m ? m[1] || "arr" : "arr", isFixedSize: size <= 1024 };
      }
      if (/\b(?:ArrayList|List)\s*<[^>]+>\s*([A-Za-z_]\w*)/.test(str)) {
        const m = str.match(/\b(?:ArrayList|List)\s*<[^>]+>\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: m[1], isFixedSize: false };
      }
      if (/\b(?:int|double|long|boolean|char)\s*\[\s*\]\s*([A-Za-z_]\w*)\s*=/.test(str)) {
        const m = str.match(/\b(?:int|double|long|boolean|char)\s*\[\s*\]\s*([A-Za-z_]\w*)/);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: m[1], isFixedSize: false };
      }
      return null;
    }
    matchCallExpression(str, currentFnName) {
      const callMatch = str.match(/^([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\s*\(/);
      if (!callMatch) return null;
      const callee = callMatch[1];
      if (["if", "for", "while", "switch", "catch", "return"].includes(callee)) {
        return null;
      }
      const parenStart = str.indexOf("(");
      const parenEnd = this.findMatching(str, parenStart, "(", ")");
      const args = parenEnd !== -1 ? str.slice(parenStart + 1, parenEnd) : "";
      const isSorting = callee === "Arrays.sort" || callee === "Collections.sort" || callee.endsWith(".sort");
      const isBinarySearch = callee === "Arrays.binarySearch" || callee === "Collections.binarySearch";
      const length = parenEnd !== -1 ? parenEnd + 1 : callMatch[0].length;
      return { callee, args, isSorting, isBinarySearch, length };
    }
  };

  // src/engine/parsers/pythonParser.js
  var PythonParser = class extends BaseParser {
    constructor() {
      super("Python");
    }
    parse(rawCode) {
      const code = this.stripComments(rawCode);
      const root = new ASTNode(NODE_TYPES.PROGRAM, { language: "Python" });
      const errors = [];
      try {
        const lines = code.split("\n");
        const scopeStack = [{ indent: -1, node: root }];
        const functionNodes = [];
        let currentFnName = null;
        let currentFnNode = null;
        let currentFnIndent = -1;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          const indent = line.match(/^\s*/)[0].replace(/\t/g, "    ").length;
          while (scopeStack.length > 1 && indent <= scopeStack[scopeStack.length - 1].indent) {
            scopeStack.pop();
          }
          if (currentFnNode && indent <= currentFnIndent) {
            currentFnNode = null;
            currentFnIndent = -1;
            currentFnName = null;
          }
          const parentNode = scopeStack[scopeStack.length - 1].node;
          const fnMatch = line.match(/^\s*def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(?:->[^:]+)?:\s*$/);
          if (fnMatch) {
            currentFnName = fnMatch[1];
            currentFnIndent = indent;
            const fnNode = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
              name: fnMatch[1],
              params: fnMatch[2],
              raw: line.trim(),
              rawBody: ""
            });
            currentFnNode = fnNode;
            functionNodes.push(fnNode);
            parentNode.addChild(fnNode);
            scopeStack.push({ indent, node: fnNode });
            continue;
          }
          if (currentFnNode) {
            currentFnNode.rawBody = (currentFnNode.rawBody || "") + line + "\n";
          }
          const forRangeMatch = line.match(/^\s*for\s+([A-Za-z_,\s]+)\s+in\s+range\(([^)]+)\):/);
          if (forRangeMatch) {
            const varName = forRangeMatch[1].trim();
            const rangeArgs = forRangeMatch[2].split(",").map((s) => s.trim());
            const step = rangeArgs.length === 3 ? rangeArgs[2] : "1";
            const stepType = this.classifyLoopStep(step, varName);
            const init = rangeArgs.length >= 2 ? rangeArgs[0] : "0";
            const test = rangeArgs.length === 1 ? rangeArgs[0] : rangeArgs[1] || rangeArgs[0];
            const isSqrt = /sqrt\b|\*\*\s*0\.5/.test(rangeArgs.join(" "));
            const forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
              varName,
              init,
              test,
              stepType,
              isSqrt,
              raw: line.trim()
            });
            parentNode.addChild(forNode);
            scopeStack.push({ indent, node: forNode });
            continue;
          }
          const forIterMatch = line.match(/^\s*for\s+([A-Za-z_,\s]+)\s+in\s+(?:enumerate\()?\s*([A-Za-z_]\w*)/);
          if (forIterMatch) {
            const forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
              varName: forIterMatch[1].trim(),
              test: forIterMatch[2].trim(),
              stepType: STEP_TYPES.LINEAR,
              isRangeBased: true,
              raw: line.trim()
            });
            parentNode.addChild(forNode);
            scopeStack.push({ indent, node: forNode });
            continue;
          }
          const whileMatch = line.match(/^\s*while\s+([^:]+):/);
          if (whileMatch) {
            const condition = whileMatch[1].trim();
            const isBinarySearch = /(lo|left|low)\s*<=?\s*(hi|right|high)/.test(condition) && /(mid|m)\s*=/.test(code) && /\/\/\s*2\b|>>\s*1\b/.test(code) || /(mid|m)\s*=.*(?:\/\/\s*2|>>\s*1)/.test(code);
            const isHalving = /(\/\/=|\/\s*2|>>\s*1)/.test(line);
            const stepType = isBinarySearch || isHalving ? STEP_TYPES.LOGARITHMIC : STEP_TYPES.LINEAR;
            const whileNode = new ASTNode(NODE_TYPES.WHILE_STATEMENT, {
              condition,
              stepType,
              isBinarySearch,
              raw: line.trim()
            });
            parentNode.addChild(whileNode);
            scopeStack.push({ indent, node: whileNode });
            continue;
          }
          const ifMatch = line.match(/^\s*(if|elif)\s+([^:]+):/);
          if (ifMatch) {
            const branchType = ifMatch[1];
            const condition = ifMatch[2].trim();
            if (branchType === "if") {
              const ifNode = new ASTNode(NODE_TYPES.IF_STATEMENT, { condition, branchType });
              const thenNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
              ifNode.addChild(thenNode);
              parentNode.addChild(ifNode);
              scopeStack.push({ indent, node: thenNode, ifNode });
            } else {
              const lastSibling = parentNode.children[parentNode.children.length - 1];
              if (lastSibling && lastSibling.type === NODE_TYPES.IF_STATEMENT) {
                const elifNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "elif", condition });
                lastSibling.addChild(elifNode);
                scopeStack.push({ indent, node: elifNode, ifNode: lastSibling });
              } else {
                const ifNode = new ASTNode(NODE_TYPES.IF_STATEMENT, { condition, branchType });
                parentNode.addChild(ifNode);
                scopeStack.push({ indent, node: ifNode });
              }
            }
            continue;
          }
          const elseMatch = line.match(/^\s*else\s*:/);
          if (elseMatch) {
            const lastSibling = parentNode.children[parentNode.children.length - 1];
            if (lastSibling && lastSibling.type === NODE_TYPES.IF_STATEMENT) {
              const elseNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "else" });
              lastSibling.addChild(elseNode);
              scopeStack.push({ indent, node: elseNode, ifNode: lastSibling });
            } else {
              const elseNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "else" });
              parentNode.addChild(elseNode);
              scopeStack.push({ indent, node: elseNode });
            }
            continue;
          }
          if (/^\s*break\b/.test(line)) {
            parentNode.addChild(new ASTNode(NODE_TYPES.BREAK_STATEMENT));
            continue;
          }
          if (/^\s*continue\b/.test(line)) {
            parentNode.addChild(new ASTNode(NODE_TYPES.CONTINUE_STATEMENT));
            continue;
          }
          const containerDecl = this.matchPythonContainers(line);
          if (containerDecl) {
            parentNode.addChild(
              new ASTNode(NODE_TYPES.VARIABLE_DECLARATION, {
                containerType: containerDecl.type,
                name: containerDecl.name,
                isFixedSize: containerDecl.isFixedSize
              })
            );
          }
          const calls = this.matchPythonCalls(line, currentFnName);
          for (const call of calls) {
            parentNode.addChild(
              new ASTNode(NODE_TYPES.CALL_EXPRESSION, {
                callee: call.callee,
                args: call.args,
                isSorting: call.isSorting,
                isBinarySearch: call.isBinarySearch
              })
            );
          }
        }
        if (functionNodes.length === 0) {
          const defaultFn = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: "main_or_snippet",
            params: "",
            rawBody: code
          });
          root.addChild(defaultFn);
        }
        return {
          root,
          language: "Python",
          success: true,
          errors
        };
      } catch (err) {
        errors.push(err.message);
        return {
          root,
          language: "Python",
          success: false,
          errors
        };
      }
    }
    matchPythonContainers(line) {
      if (/\[\s*\[.*?\](?:\s*\*[^\]]+)?\s*for\s+.*?in\s+range/.test(line)) {
        return { type: CONTAINER_TYPES.MATRIX_2D, name: "matrix", isFixedSize: false };
      }
      if (line.includes("=") && (/=\s*\{\s*\}/.test(line) || /\b(?:dict\(|defaultdict\()/.test(line))) {
        const varName = line.split("=")[0].trim();
        return { type: CONTAINER_TYPES.HASH_MAP, name: varName, isFixedSize: false };
      }
      if (line.includes("=") && (/\bset\(/.test(line) || /=\s*\{\s*[^}]+\s*\}/.test(line))) {
        const varName = line.split("=")[0].trim();
        return { type: CONTAINER_TYPES.HASH_SET, name: varName, isFixedSize: false };
      }
      const fixedArrMatch = line.match(/=\s*\[[^\]]+\]\s*\*\s*(\d+)/);
      if (fixedArrMatch) {
        const size = parseInt(fixedArrMatch[1], 10);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: "arr", isFixedSize: size <= 1024 };
      }
      if (/=\s*(\[\s*\]|list\()/.test(line)) {
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: "list", isFixedSize: false };
      }
      return null;
    }
    matchPythonCalls(line, currentFnName) {
      const isSorting = line.includes(".sort(") || /\bsorted\s*\(/.test(line);
      const isBinarySearch = /\bbisect\b/.test(line);
      const calls = [];
      const callRegex = /\b([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\s*\(([^)]*)\)/g;
      let m;
      while (m = callRegex.exec(line)) {
        const callee = m[1];
        if (["range", "enumerate", "len", "print", "int", "str", "list", "dict", "set"].includes(callee)) {
          if (!isSorting && !isBinarySearch) continue;
        }
        calls.push({
          callee,
          args: m[2],
          isSorting,
          isBinarySearch
        });
      }
      return calls;
    }
  };

  // src/engine/parsers/javascriptParser.js
  var JavaScriptParser = class extends BaseParser {
    constructor() {
      super("JavaScript");
    }
    parse(rawCode) {
      const code = this.stripComments(rawCode);
      const root = new ASTNode(NODE_TYPES.PROGRAM, { language: "JavaScript" });
      const errors = [];
      try {
        const functions = this.extractFunctions(code);
        const functionNodes = [];
        for (const fn of functions) {
          const fnNode = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: fn.name,
            params: fn.params,
            rawBody: fn.body
          });
          root.addChild(fnNode);
          functionNodes.push(fnNode);
          this.parseStatements(fnNode, fn.body, fn.name);
        }
        if (functionNodes.length === 0) {
          const defaultFn = new ASTNode(NODE_TYPES.FUNCTION_DECLARATION, {
            name: "main_or_snippet",
            params: "",
            rawBody: code
          });
          root.addChild(defaultFn);
          this.parseStatements(defaultFn, code, "main_or_snippet");
        }
        return {
          root,
          language: "JavaScript",
          success: true,
          errors
        };
      } catch (err) {
        errors.push(err.message);
        return {
          root,
          language: "JavaScript",
          success: false,
          errors
        };
      }
    }
    extractFunctions(code) {
      const functions = [];
      const fnRegex = /\bfunction\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*\{/g;
      let m;
      while (m = fnRegex.exec(code)) {
        const fnName = m[1];
        const params = m[2];
        const openBraceIdx = fnRegex.lastIndex - 1;
        const closeBraceIdx = this.findMatching(code, openBraceIdx, "{", "}");
        if (closeBraceIdx !== -1) {
          const body = code.slice(openBraceIdx + 1, closeBraceIdx);
          functions.push({ name: fnName, params, body });
        }
      }
      const arrowRegex = /(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(?:async\s*)?(?:\(([^)]*)\)|([A-Za-z_]\w*))\s*=>\s*\{/g;
      while (m = arrowRegex.exec(code)) {
        const fnName = m[1];
        const params = m[2] || m[3] || "";
        const openBraceIdx = arrowRegex.lastIndex - 1;
        const closeBraceIdx = this.findMatching(code, openBraceIdx, "{", "}");
        if (closeBraceIdx !== -1) {
          const body = code.slice(openBraceIdx + 1, closeBraceIdx);
          functions.push({ name: fnName, params, body });
        }
      }
      return functions;
    }
    parseStatements(parentNode, code, currentFnName) {
      let i = 0;
      while (i < code.length) {
        while (i < code.length && /[\s;{}]/.test(code[i])) i++;
        if (i >= code.length) break;
        const rest = code.slice(i);
        const forMatch = rest.match(/^for\s*\(/);
        if (forMatch) {
          const parenStart = i + forMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const forHeader = code.slice(parenStart + 1, parenEnd);
            const parts = forHeader.split(";");
            let forNode;
            if (parts.length >= 3) {
              const init = parts[0].trim();
              const test = parts[1].trim();
              const update = parts.slice(2).join(";").trim();
              const varMatch = init.match(/(?:let|var|const)?\s*([A-Za-z_]\w*)\s*=/);
              const varName = varMatch ? varMatch[1] : null;
              const stepType = this.classifyLoopStep(update, varName);
              const isDependent = /<|\b/.test(test) && /\b(i|j|k|m|n)\b/.test(init) && init.includes("=");
              const isSqrt = /(\b\w+\s*\*\s*\w+\s*<=?\s*[a-zA-Z_]\w*)|(Math\.sqrt\s*\()/i.test(test);
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                init,
                test,
                update,
                varName,
                stepType,
                isDependent,
                isSqrt
              });
            } else {
              forNode = new ASTNode(NODE_TYPES.FOR_STATEMENT, {
                isRangeBased: true,
                stepType: STEP_TYPES.LINEAR,
                header: forHeader
              });
            }
            parentNode.addChild(forNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const loopBodyCode = code.slice(bodyStart + 1, bodyEnd);
                forNode.bodyCode = loopBodyCode;
                this.parseStatements(forNode, loopBodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            }
          }
        }
        const whileMatch = rest.match(/^while\s*\(/);
        if (whileMatch) {
          const parenStart = i + whileMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const isBinarySearch = /(lo|left|low)\s*<=?\s*(hi|right|high)/.test(condition) && /(mid|m)\s*=/.test(code) && /\/\s*2\b|>>\s*1\b|Math\.floor/.test(code) || /(mid|m)\s*=.*(?:\/\s*2|>>\s*1)/.test(code);
            const stepType = isBinarySearch ? STEP_TYPES.LOGARITHMIC : STEP_TYPES.LINEAR;
            const whileNode = new ASTNode(NODE_TYPES.WHILE_STATEMENT, {
              condition,
              stepType,
              isBinarySearch
            });
            parentNode.addChild(whileNode);
            const bodyStart = code.indexOf("{", parenEnd);
            if (bodyStart !== -1 && bodyStart - parenEnd < 15) {
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const bodyCode = code.slice(bodyStart + 1, bodyEnd);
                whileNode.bodyCode = bodyCode;
                if (/(>>=|<<=|\/=|(?:\b\w+\s*=\s*\w+\s*(?:\/|>>)\s*(?:2|1)|\bMath\.floor\s*\(\s*\w+\s*\/\s*2))/.test(bodyCode)) {
                  whileNode.stepType = STEP_TYPES.LOGARITHMIC;
                }
                this.parseStatements(whileNode, bodyCode, currentFnName);
                i = bodyEnd + 1;
                continue;
              }
            }
          }
        }
        const ifMatch = rest.match(/^if\s*\(/);
        if (ifMatch) {
          const parenStart = i + ifMatch[0].length - 1;
          const parenEnd = this.findMatching(code, parenStart, "(", ")");
          if (parenEnd !== -1) {
            const condition = code.slice(parenStart + 1, parenEnd);
            const ifNode = new ASTNode(NODE_TYPES.IF_STATEMENT, { condition });
            parentNode.addChild(ifNode);
            const between = code.slice(parenEnd + 1, parenEnd + 15);
            if (between.includes("{")) {
              const bodyStart = code.indexOf("{", parenEnd);
              const bodyEnd = this.findMatching(code, bodyStart, "{", "}");
              if (bodyEnd !== -1) {
                const consequentCode = code.slice(bodyStart + 1, bodyEnd);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, consequentCode, currentFnName);
                i = bodyEnd + 1;
                const afterIf = code.slice(i).trimStart();
                if (afterIf.startsWith("else")) {
                  const elseIdx = code.indexOf("else", i);
                  const elseBodyStart = code.indexOf("{", elseIdx);
                  if (elseBodyStart !== -1 && elseBodyStart - elseIdx < 20) {
                    const elseBodyEnd = this.findMatching(code, elseBodyStart, "{", "}");
                    if (elseBodyEnd !== -1) {
                      const alternateCode = code.slice(elseBodyStart + 1, elseBodyEnd);
                      const alternateNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "else" });
                      ifNode.addChild(alternateNode);
                      this.parseStatements(alternateNode, alternateCode, currentFnName);
                      i = elseBodyEnd + 1;
                    }
                  }
                }
                continue;
              }
            } else {
              const semi = code.indexOf(";", parenEnd);
              if (semi !== -1) {
                const singleStmtCode = code.slice(parenEnd + 1, semi + 1);
                const consequentNode = new ASTNode(NODE_TYPES.BLOCK_STATEMENT, { branch: "then" });
                ifNode.addChild(consequentNode);
                this.parseStatements(consequentNode, singleStmtCode, currentFnName);
                i = semi + 1;
                continue;
              }
            }
          }
        }
        if (rest.startsWith("break;") || rest.startsWith("break ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.BREAK_STATEMENT));
          i += 6;
          continue;
        }
        if (rest.startsWith("continue;") || rest.startsWith("continue ")) {
          parentNode.addChild(new ASTNode(NODE_TYPES.CONTINUE_STATEMENT));
          i += 9;
          continue;
        }
        if (rest.startsWith("return ") || rest.startsWith("return;") || rest === "return") {
          const retNode = new ASTNode(NODE_TYPES.RETURN_STATEMENT);
          parentNode.addChild(retNode);
          const semi = code.indexOf(";", i);
          if (semi !== -1) {
            const retExpr = code.slice(i + 6, semi);
            this.parseStatements(retNode, retExpr, currentFnName);
            i = semi + 1;
          } else {
            i += 6;
          }
          continue;
        }
        const containerDecl = this.matchJSContainers(rest);
        if (containerDecl) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.VARIABLE_DECLARATION, {
              containerType: containerDecl.type,
              name: containerDecl.name,
              isFixedSize: containerDecl.isFixedSize
            })
          );
        }
        const call = this.matchJSCalls(rest, currentFnName);
        if (call) {
          parentNode.addChild(
            new ASTNode(NODE_TYPES.CALL_EXPRESSION, {
              callee: call.callee,
              args: call.args,
              isSorting: call.isSorting,
              isBinarySearch: call.isBinarySearch
            })
          );
          i += call.length;
          continue;
        }
        i++;
      }
    }
    matchJSContainers(str) {
      if (/Array\.from\([^)]*Array\(|Array\([^)]*\)\.fill\([^)]*Array\(/.test(str)) {
        return { type: CONTAINER_TYPES.MATRIX_2D, name: "matrix", isFixedSize: false };
      }
      if (/new\s+Map\s*\(/.test(str)) {
        return { type: CONTAINER_TYPES.HASH_MAP, name: "map", isFixedSize: false };
      }
      if (/new\s+Set\s*\(/.test(str)) {
        return { type: CONTAINER_TYPES.HASH_SET, name: "set", isFixedSize: false };
      }
      if (/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*\{\s*\}/.test(str)) {
        const m = str.match(/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*\{\s*\}/);
        return { type: CONTAINER_TYPES.HASH_MAP, name: m[1], isFixedSize: false };
      }
      const fixedMatch = str.match(/new\s+(?:Array|Uint8Array|Int32Array)\s*\(\s*(\d+)\s*\)/);
      if (fixedMatch) {
        const size = parseInt(fixedMatch[1], 10);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: "arr", isFixedSize: size <= 1024 };
      }
      if (/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*\[\s*\]/.test(str)) {
        const m = str.match(/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*\[\s*\]/);
        return { type: CONTAINER_TYPES.LINEAR_ARRAY, name: m[1], isFixedSize: false };
      }
      return null;
    }
    matchJSCalls(str, currentFnName) {
      const callMatch = str.match(/^([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\s*\(/);
      if (!callMatch) return null;
      const callee = callMatch[1];
      if (["if", "for", "while", "switch", "catch", "return"].includes(callee)) {
        return null;
      }
      const parenStart = str.indexOf("(");
      const parenEnd = this.findMatching(str, parenStart, "(", ")");
      const args = parenEnd !== -1 ? str.slice(parenStart + 1, parenEnd) : "";
      const isSorting = callee === "sort" || callee.endsWith(".sort") || str.includes(".sort(");
      const length = parenEnd !== -1 ? parenEnd + 1 : callMatch[0].length;
      return { callee, args, isSorting, isBinarySearch: false, length };
    }
  };

  // src/engine/parsers/ParserFactory.js
  var ParserFactory = class {
    static parsers = {
      [LANGUAGES.CPP]: new CppParser(),
      [LANGUAGES.JAVA]: new JavaParser(),
      [LANGUAGES.PYTHON]: new PythonParser(),
      [LANGUAGES.JAVASCRIPT]: new JavaScriptParser()
    };
    static getParser(language = LANGUAGES.CPP) {
      const lang = this.normalizeLanguage(language);
      return this.parsers[lang] || this.parsers[LANGUAGES.CPP];
    }
    static parse(code, language = LANGUAGES.CPP) {
      const parser = this.getParser(language);
      return parser.parse(code);
    }
    static normalizeLanguage(raw) {
      if (!raw || typeof raw !== "string") return LANGUAGES.CPP;
      const s = raw.trim().toLowerCase();
      if (s.includes("c++") || s === "cpp" || s === "cplusplus" || s === "c_cpp" || s === "c" || s.startsWith("c ")) {
        return LANGUAGES.CPP;
      }
      if (s.includes("python") || s === "py" || s === "python3") {
        return LANGUAGES.PYTHON;
      }
      if (s.includes("java") && !s.includes("javascript")) {
        return LANGUAGES.JAVA;
      }
      if (s.includes("javascript") || s.includes("typescript") || s === "js" || s === "ts") {
        return LANGUAGES.JAVASCRIPT;
      }
      return LANGUAGES.CPP;
    }
  };

  // src/engine/ast/ASTVisitor.js
  var ASTVisitor = class {
    static visit(root, visitorMap) {
      if (!root) return;
      function traverse(node) {
        if (!node) return;
        const enter = visitorMap[node.type] || visitorMap["*"];
        if (typeof enter === "function") {
          enter(node);
        }
        for (const child of node.children) {
          traverse(child);
        }
        const exit = visitorMap[`${node.type}:exit`];
        if (typeof exit === "function") {
          exit(node);
        }
      }
      traverse(root);
    }
    static findNodes(root, predicate) {
      const results = [];
      if (!root) return results;
      function traverse(node) {
        if (predicate(node)) {
          results.push(node);
        }
        for (const child of node.children) {
          traverse(child);
        }
      }
      traverse(root);
      return results;
    }
  };

  // src/engine/rules/complexityRules.js
  var ComplexityExpression = class _ComplexityExpression {
    constructor(family, params = {}) {
      this.family = family;
      this.degree = params.degree ?? 1;
      this.logPower = params.logPower ?? 0;
      this.base = params.base ?? 2;
      this.variable = params.variable || "n";
      this.label = params.label || null;
      this.qualifier = params.qualifier || "";
    }
    static constant() {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.CONSTANT);
    }
    static log(power = 1) {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.LOGARITHMIC, { logPower: power });
    }
    static sqrt() {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.SQRT, { degree: 0.5 });
    }
    static polynomial(degree = 1, variable = "n") {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.POLYNOMIAL, { degree, variable });
    }
    static polylog(degree = 1, logPower = 1, variable = "n") {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.POLYLOG, { degree, logPower, variable });
    }
    static exponential(base = 2, variable = "n") {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.EXPONENTIAL, { base, variable });
    }
    static factorial(variable = "n") {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.FACTORIAL, { variable });
    }
    static graphLinear() {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.GRAPH_LINEAR, { label: "O(V + E)" });
    }
    static graphLog() {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.GRAPH_LOG, { label: "O((V + E) log V)" });
    }
    static graphCubic() {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.GRAPH_CUBIC, { label: "O(V\xB3)" });
    }
    static unknown(reason = "") {
      return new _ComplexityExpression(COMPLEXITY_FAMILIES.UNKNOWN, { label: "Unknown", qualifier: reason });
    }
    static fromString(str) {
      if (!str || typeof str !== "string") return _ComplexityExpression.constant();
      const s = str.trim();
      if (s === "O(1)" || s === "1") return _ComplexityExpression.constant();
      if (s === "O(log n)" || s === "O(logn)") return _ComplexityExpression.log(1);
      if (s === "O(log\xB2 n)" || s === "O(log^2 n)") return _ComplexityExpression.log(2);
      if (s === "O(\u221An)" || s === "O(sqrt(n))") return _ComplexityExpression.sqrt();
      if (s === "O(n)") return _ComplexityExpression.polynomial(1);
      if (s === "O(n log n)") return _ComplexityExpression.polylog(1, 1);
      if (s === "O(n log\xB2 n)" || s === "O(n log^2 n)") return _ComplexityExpression.polylog(1, 2);
      if (s === "O(n\xB2 log n)" || s === "O(n^2 log n)") return _ComplexityExpression.polylog(2, 1);
      if (s === "O(n\u221An)" || s === "O(n sqrt(n))") return _ComplexityExpression.polynomial(1.5);
      if (s === "O(n\xB2)" || s === "O(n^2)") return _ComplexityExpression.polynomial(2);
      if (s === "O(n\xB3)" || s === "O(n^3)") return _ComplexityExpression.polynomial(3);
      if (s === "O(V)") return new _ComplexityExpression(COMPLEXITY_FAMILIES.GRAPH_LINEAR, { label: "O(V)" });
      if (s === "O(V + E)" || s === "O(V+E)") return _ComplexityExpression.graphLinear();
      if (s.includes("(V + E) log V") || s.includes("(V+E)logV")) return _ComplexityExpression.graphLog();
      if (s === "O(V\xB3)" || s === "O(V^3)") return _ComplexityExpression.graphCubic();
      if (s === "O(n!)") return _ComplexityExpression.factorial("n");
      const expMatch = s.match(/O\((\d+)\^n\)/i);
      if (expMatch) {
        return _ComplexityExpression.exponential(parseInt(expMatch[1], 10));
      }
      const polyMatch = s.match(/O\(n\^([\d.]+)\)/i);
      if (polyMatch) {
        return _ComplexityExpression.polynomial(parseFloat(polyMatch[1]));
      }
      if (s.toLowerCase().includes("unknown")) return _ComplexityExpression.unknown();
      return _ComplexityExpression.polynomial(1);
    }
    getRank() {
      switch (this.family) {
        case COMPLEXITY_FAMILIES.CONSTANT:
          return 0;
        case COMPLEXITY_FAMILIES.LOGARITHMIC:
          return 1 + (this.logPower - 1) * 0.1;
        case COMPLEXITY_FAMILIES.SQRT:
          return 1.5;
        case COMPLEXITY_FAMILIES.POLYNOMIAL:
          return 1 + this.degree;
        case COMPLEXITY_FAMILIES.POLYLOG:
          return 1 + this.degree + 0.05 * this.logPower;
        case COMPLEXITY_FAMILIES.GRAPH_LINEAR:
          return 2;
        case COMPLEXITY_FAMILIES.GRAPH_LOG:
          return 2.15;
        case COMPLEXITY_FAMILIES.GRAPH_CUBIC:
          return 4;
        case COMPLEXITY_FAMILIES.EXPONENTIAL:
          return 10 + (this.base - 2);
        case COMPLEXITY_FAMILIES.FACTORIAL:
          return 50;
        case COMPLEXITY_FAMILIES.UNKNOWN:
          return -1;
        default:
          return 0;
      }
    }
    compare(other) {
      if (!other) return 1;
      const expr2 = other instanceof _ComplexityExpression ? other : _ComplexityExpression.fromString(other);
      return this.getRank() - expr2.getRank();
    }
    add(other) {
      if (!other) return this;
      const expr2 = other instanceof _ComplexityExpression ? other : _ComplexityExpression.fromString(other);
      return this.compare(expr2) >= 0 ? this : expr2;
    }
    multiply(other) {
      if (!other) return this;
      const expr2 = other instanceof _ComplexityExpression ? other : _ComplexityExpression.fromString(other);
      if (this.family === COMPLEXITY_FAMILIES.CONSTANT) return expr2;
      if (expr2.family === COMPLEXITY_FAMILIES.CONSTANT) return this;
      if (this.family === COMPLEXITY_FAMILIES.UNKNOWN) return this;
      if (expr2.family === COMPLEXITY_FAMILIES.UNKNOWN) return expr2;
      if (this.family === COMPLEXITY_FAMILIES.FACTORIAL || expr2.family === COMPLEXITY_FAMILIES.FACTORIAL) {
        return _ComplexityExpression.factorial(this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.EXPONENTIAL) return this;
      if (expr2.family === COMPLEXITY_FAMILIES.EXPONENTIAL) return expr2;
      if (this.family === COMPLEXITY_FAMILIES.LOGARITHMIC && expr2.family === COMPLEXITY_FAMILIES.LOGARITHMIC) {
        return _ComplexityExpression.log(this.logPower + expr2.logPower);
      }
      if (this.family === COMPLEXITY_FAMILIES.POLYNOMIAL && expr2.family === COMPLEXITY_FAMILIES.LOGARITHMIC) {
        return _ComplexityExpression.polylog(this.degree, expr2.logPower, this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.LOGARITHMIC && expr2.family === COMPLEXITY_FAMILIES.POLYNOMIAL) {
        return _ComplexityExpression.polylog(expr2.degree, this.logPower, expr2.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.POLYNOMIAL && expr2.family === COMPLEXITY_FAMILIES.POLYNOMIAL) {
        return _ComplexityExpression.polynomial(this.degree + expr2.degree, this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.POLYNOMIAL && expr2.family === COMPLEXITY_FAMILIES.SQRT) {
        return _ComplexityExpression.polynomial(this.degree + 0.5, this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.SQRT && expr2.family === COMPLEXITY_FAMILIES.POLYNOMIAL) {
        return _ComplexityExpression.polynomial(0.5 + expr2.degree, expr2.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.SQRT && expr2.family === COMPLEXITY_FAMILIES.SQRT) {
        return _ComplexityExpression.polynomial(1, this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.POLYNOMIAL && expr2.family === COMPLEXITY_FAMILIES.POLYLOG) {
        return _ComplexityExpression.polylog(this.degree + expr2.degree, expr2.logPower, this.variable);
      }
      if (this.family === COMPLEXITY_FAMILIES.POLYLOG && expr2.family === COMPLEXITY_FAMILIES.POLYNOMIAL) {
        return _ComplexityExpression.polylog(this.degree + expr2.degree, this.logPower, this.variable);
      }
      return this.compare(expr2) >= 0 ? this : expr2;
    }
    format() {
      let res = "";
      switch (this.family) {
        case COMPLEXITY_FAMILIES.CONSTANT:
          res = COMPLEXITY_CLASSES.O_1;
          break;
        case COMPLEXITY_FAMILIES.LOGARITHMIC:
          res = this.logPower > 1 ? `O(log${toSuperscript(this.logPower)} n)` : COMPLEXITY_CLASSES.O_LOG_N;
          break;
        case COMPLEXITY_FAMILIES.SQRT:
          res = COMPLEXITY_CLASSES.O_SQRT_N;
          break;
        case COMPLEXITY_FAMILIES.POLYNOMIAL:
          if (this.degree === 0) res = COMPLEXITY_CLASSES.O_1;
          else if (this.degree === 1) res = COMPLEXITY_CLASSES.O_N;
          else if (this.degree === 1.5) res = COMPLEXITY_CLASSES.O_N_SQRT_N;
          else if (this.degree === 2) res = COMPLEXITY_CLASSES.O_N2;
          else if (this.degree === 3) res = COMPLEXITY_CLASSES.O_N3;
          else if (Number.isInteger(this.degree)) res = `O(${this.variable}${toSuperscript(this.degree)})`;
          else res = `O(${this.variable}^${this.degree})`;
          break;
        case COMPLEXITY_FAMILIES.POLYLOG:
          if (this.degree === 0) {
            res = this.logPower > 1 ? `O(log${toSuperscript(this.logPower)} n)` : COMPLEXITY_CLASSES.O_LOG_N;
          } else if (this.degree === 1 && this.logPower === 1) {
            res = COMPLEXITY_CLASSES.O_N_LOG_N;
          } else if (this.degree === 1) {
            res = `O(n log${toSuperscript(this.logPower)} n)`;
          } else if (this.logPower === 1) {
            res = `O(${this.variable}${toSuperscript(this.degree)} log ${this.variable})`;
          } else {
            res = `O(${this.variable}${toSuperscript(this.degree)} log${toSuperscript(this.logPower)} ${this.variable})`;
          }
          break;
        case COMPLEXITY_FAMILIES.EXPONENTIAL:
          res = `O(${this.base}^${this.variable})`;
          break;
        case COMPLEXITY_FAMILIES.FACTORIAL:
          res = `O(${this.variable}!)`;
          break;
        case COMPLEXITY_FAMILIES.GRAPH_LINEAR:
          res = this.label || COMPLEXITY_CLASSES.O_V_E;
          break;
        case COMPLEXITY_FAMILIES.GRAPH_LOG:
          res = COMPLEXITY_CLASSES.O_V_E_LOG_V;
          break;
        case COMPLEXITY_FAMILIES.GRAPH_CUBIC:
          res = COMPLEXITY_CLASSES.O_V3;
          break;
        case COMPLEXITY_FAMILIES.UNKNOWN:
          res = COMPLEXITY_CLASSES.UNKNOWN;
          break;
        default:
          res = this.label || COMPLEXITY_CLASSES.O_1;
      }
      if (this.qualifier) {
        res += ` ${this.qualifier}`;
      }
      return res;
    }
    toString() {
      return this.format();
    }
  };
  function toSuperscript(num) {
    const map = { "0": "\u2070", "1": "\xB9", "2": "\xB2", "3": "\xB3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079" };
    return String(num).split("").map((c) => map[c] || c).join("");
  }
  var SpaceExpression = class _SpaceExpression {
    constructor(complexity, reason = "") {
      this.complexity = complexity;
      this.reason = reason;
    }
    static constant(reason = "Only scalar variables or in-place memory used.") {
      return new _SpaceExpression(COMPLEXITY_CLASSES.O_1, reason);
    }
    static log(reason = "Recursion call stack depth proportional to log n.") {
      return new _SpaceExpression(COMPLEXITY_CLASSES.O_LOG_N, reason);
    }
    static linear(reason = "Auxiliary storage proportional to input size.") {
      return new _SpaceExpression(COMPLEXITY_CLASSES.O_N, reason);
    }
    static quadratic(reason = "2D matrix or state grid storage.") {
      return new _SpaceExpression(COMPLEXITY_CLASSES.O_N2, reason);
    }
    static graphV(reason = "Graph visited set and traversal queue require O(V) space.") {
      return new _SpaceExpression("O(V)", reason);
    }
    static graphVE(reason = "Adjacency list storage requires O(V + E) space.") {
      return new _SpaceExpression("O(V + E)", reason);
    }
    static unknown(reason = "Auxiliary space allocation could not be bound.") {
      return new _SpaceExpression(COMPLEXITY_CLASSES.UNKNOWN, reason);
    }
    format() {
      return this.complexity;
    }
    toString() {
      return this.complexity;
    }
  };
  function maxComplexity(c1, c2) {
    const expr1 = c1 instanceof ComplexityExpression ? c1 : ComplexityExpression.fromString(c1);
    const expr2 = c2 instanceof ComplexityExpression ? c2 : ComplexityExpression.fromString(c2);
    const maxExpr = expr1.compare(expr2) >= 0 ? expr1 : expr2;
    return typeof c1 === "string" && typeof c2 === "string" ? maxExpr.format() : maxExpr;
  }

  // src/engine/rules/loopRules.js
  var LoopRules = class {
    /**
     * Classifies update expression step type: linear, logarithmic, sqrt, constant
     */
    static classifyStep(stepStr, varName = null) {
      if (!stepStr) return STEP_TYPES.LINEAR;
      const s = stepStr.replace(/\s+/g, "");
      if (/\*=|(\/=|>>=|<<=)/.test(s) || /\b\w+\s*=\s*\w+\s*(\*|\/|>>|<<)\s*\d+/.test(s) || /(>>|<<)\s*1\b|\/\s*2\b/.test(s)) {
        return STEP_TYPES.LOGARITHMIC;
      }
      if (varName && new RegExp(`[+\\-*/]=.*\\b${varName}\\b`).test(s)) {
        return STEP_TYPES.DEPENDENT;
      }
      return STEP_TYPES.LINEAR;
    }
    /**
     * Evaluates the complexity of a single loop given its init, condition, and step
     */
    static evaluateLoopBound(initStr = "", testStr = "", updateStr = "", varName = null) {
      const init = String(initStr || "");
      const test = String(testStr || "");
      const update = String(updateStr || "");
      if (/(\b\w+\s*\*\s*\w+\s*<=?\s*[a-zA-Z_]\w*)|(sqrt\s*\()/i.test(test) || /(\b\w+\s*\*\s*\w+\s*<=?\s*[a-zA-Z_]\w*)|(sqrt\s*\()/i.test(init)) {
        return {
          expression: ComplexityExpression.sqrt(),
          isConstant: false,
          reason: "Square root loop bound (i * i <= n or sqrt(n)) \u2192 O(\u221An)"
        };
      }
      const trimmedTest = test.trim();
      if (/^\d+$/.test(trimmedTest)) {
        const num = parseInt(trimmedTest, 10);
        if (!isNaN(num) && num <= 1e3) {
          return {
            expression: ComplexityExpression.constant(),
            isConstant: true,
            reason: `Loop bound is fixed numeric constant (${num}) \u2192 O(1)`
          };
        }
      }
      const constBoundMatch = test.match(/<\s*(\d+)\b|>\s*0\b/);
      if (constBoundMatch && !/\b[a-zA-Z_]\w*\b/.test(test.replace(new RegExp(`\\b${varName}\\b`, "g"), ""))) {
        const num = parseInt(constBoundMatch[1], 10);
        if (!isNaN(num) && num <= 1e3) {
          return {
            expression: ComplexityExpression.constant(),
            isConstant: true,
            reason: `Loop bound is fixed numeric constant (${num}) \u2192 O(1)`
          };
        }
      }
      const stepType = this.classifyStep(update, varName);
      if (stepType === STEP_TYPES.LOGARITHMIC) {
        return {
          expression: ComplexityExpression.log(1),
          isConstant: false,
          reason: "Geometric progression loop step (*= 2 or /= 2) \u2192 O(log n)"
        };
      }
      return {
        expression: ComplexityExpression.polynomial(1),
        isConstant: false,
        reason: "Linear loop iteration \u2192 O(n)"
      };
    }
    /**
     * Determine whether an inner loop has triangular dependence on outer variable
     */
    static isTriangularDependent(innerInit = "", innerTest = "", outerVar = "i") {
      if (!outerVar) return false;
      const initPattern = new RegExp(`=\\s*\\b${outerVar}\\b`);
      const testPattern = new RegExp(`[<>]=?\\s*\\b${outerVar}\\b`);
      return initPattern.test(innerInit) || testPattern.test(innerTest);
    }
  };

  // src/engine/analyzers/controlFlowAnalyzer.js
  var ControlFlowAnalyzer = class {
    /**
     * Computes the maximum number of recursive calls to `targetFnName` that execute
     * along ANY SINGLE execution path through the AST node.
     */
    static getMaxCallsOnAnyPath(node, targetFnName) {
      if (!node) return 0;
      if (node.type === NODE_TYPES.CALL_EXPRESSION) {
        const isTarget = node.callee === targetFnName || node.callee?.endsWith("." + targetFnName);
        return isTarget ? 1 : 0;
      }
      if (node.type === NODE_TYPES.IF_STATEMENT) {
        let maxBranchCalls = 0;
        const childBlocks = node.children.filter((c) => c.type === NODE_TYPES.BLOCK_STATEMENT);
        if (childBlocks.length > 0) {
          for (const block of childBlocks) {
            const callsInBranch = this.getMaxCallsOnAnyPath(block, targetFnName);
            maxBranchCalls = Math.max(maxBranchCalls, callsInBranch);
          }
        } else {
          for (const child of node.children) {
            const cCalls = this.getMaxCallsOnAnyPath(child, targetFnName);
            maxBranchCalls = Math.max(maxBranchCalls, cCalls);
          }
        }
        return maxBranchCalls;
      }
      if (node.type === NODE_TYPES.FOR_STATEMENT || node.type === NODE_TYPES.WHILE_STATEMENT || node.type === NODE_TYPES.DO_WHILE_STATEMENT) {
        let callsInside = 0;
        for (const child of node.children) {
          callsInside += this.getMaxCallsOnAnyPath(child, targetFnName);
        }
        return callsInside;
      }
      return this.computeMaxPath(node.children, 0, targetFnName);
    }
    static computeMaxPath(children, index, targetFnName) {
      if (!children || index >= children.length) return 0;
      const child = children[index];
      if (child.type === NODE_TYPES.IF_STATEMENT) {
        const callsInIf = this.getMaxCallsOnAnyPath(child, targetFnName);
        const hasReturnInIf = this.nodeHasReturn(child);
        if (hasReturnInIf) {
          const callsAfter = this.computeMaxPath(children, index + 1, targetFnName);
          return Math.max(callsInIf, callsAfter);
        } else {
          return callsInIf + this.computeMaxPath(children, index + 1, targetFnName);
        }
      }
      if (child.type === NODE_TYPES.RETURN_STATEMENT) {
        return this.getMaxCallsOnAnyPath(child, targetFnName);
      }
      return this.getMaxCallsOnAnyPath(child, targetFnName) + this.computeMaxPath(children, index + 1, targetFnName);
    }
    static nodeHasReturn(node) {
      if (!node) return false;
      if (node.type === NODE_TYPES.RETURN_STATEMENT) return true;
      for (const child of node.children) {
        if (this.nodeHasReturn(child)) return true;
      }
      return false;
    }
    /**
     * Check if a loop contains an early break statement
     */
    static hasEarlyBreak(loopNode) {
      if (!loopNode) return false;
      let found = false;
      loopNode.walk((node) => {
        if (node.type === NODE_TYPES.BREAK_STATEMENT) {
          found = true;
        }
      });
      return found;
    }
  };

  // src/engine/analyzers/loopAnalyzer.js
  var LoopAnalyzer = class {
    static analyze(astRoot) {
      const loopNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.FOR_STATEMENT || n.type === NODE_TYPES.WHILE_STATEMENT || n.type === NODE_TYPES.DO_WHILE_STATEMENT
      );
      if (loopNodes.length === 0) {
        return {
          timeComplexity: ComplexityExpression.constant(),
          maxNestingDepth: 0,
          hasBreak: false,
          patterns: [],
          breakdowns: []
        };
      }
      const breakdowns = [];
      const patterns = [];
      let overallComplexity = ComplexityExpression.constant();
      let hasBreak = false;
      const hasBinarySearch = loopNodes.some((n) => n.isBinarySearch);
      if (hasBinarySearch && loopNodes.length === 1) {
        return {
          timeComplexity: ComplexityExpression.log(1),
          maxNestingDepth: 1,
          hasBreak: false,
          patterns: ["binary-search", "interval-halving"],
          breakdowns: ["Interval halving loop pattern (binary search) achieves O(log n) time."]
        };
      }
      const rootLoops = loopNodes.filter((loop) => {
        let p = loop.parent;
        while (p) {
          if (p.type === NODE_TYPES.FOR_STATEMENT || p.type === NODE_TYPES.WHILE_STATEMENT || p.type === NODE_TYPES.DO_WHILE_STATEMENT) {
            return false;
          }
          p = p.parent;
        }
        return true;
      });
      let maxDepth = 0;
      for (const rootLoop of rootLoops) {
        const branchResult = this.computeLoopBranchComplexity(rootLoop);
        overallComplexity = overallComplexity.add(branchResult.complexity);
        maxDepth = Math.max(maxDepth, branchResult.depth);
        breakdowns.push(...branchResult.breakdowns);
        patterns.push(...branchResult.patterns);
        if (branchResult.hasBreak) hasBreak = true;
      }
      if (maxDepth === 1) {
        patterns.push("single-loop");
        if (overallComplexity.family === "logarithmic") {
          breakdowns.push("Single logarithmic loop with geometric step (*= 2 or /= 2) \u2192 O(log n).");
        } else if (overallComplexity.family === "sqrt") {
          breakdowns.push("Single loop with square root bound (i * i <= n or sqrt(n)) \u2192 O(\u221An).");
        } else {
          breakdowns.push("Single linear loop traversal detected \u2192 O(n).");
        }
      } else if (maxDepth === 2) {
        patterns.push("nested-loop", "2x-nested-loop");
        if (overallComplexity.family === "polylog") {
          breakdowns.push("Nested loop with one linear and one logarithmic dimension \u2192 O(n log n).");
        } else if (overallComplexity.family === "polynomial" && overallComplexity.degree === 1.5) {
          breakdowns.push("Nested loop with outer linear and inner square root bound \u2192 O(n\u221An).");
        } else if (overallComplexity.family === "polynomial" && overallComplexity.degree === 1) {
          breakdowns.push("Nested loop with constant inner bound \u2192 O(n).");
        } else {
          breakdowns.push("2 nested loops detected (inner loop executes for outer iterations) \u2192 O(n\xB2).");
        }
      } else if (maxDepth >= 3) {
        patterns.push("deeply-nested-loops", `${maxDepth}x-nested-loop`);
        breakdowns.push(`${maxDepth} nested loops detected \u2192 polynomial ${overallComplexity.format()}.`);
      }
      return {
        timeComplexity: overallComplexity,
        maxNestingDepth: maxDepth,
        hasBreak,
        patterns: Array.from(new Set(patterns)),
        breakdowns: Array.from(new Set(breakdowns))
      };
    }
    static computeLoopBranchComplexity(loopNode, depth = 1) {
      const breakdowns = [];
      const patterns = [];
      const boundInfo = LoopRules.evaluateLoopBound(
        loopNode.init,
        loopNode.test || loopNode.condition,
        loopNode.update,
        loopNode.varName
      );
      let currentCost = loopNode.stepType === STEP_TYPES.LOGARITHMIC ? ComplexityExpression.log(1) : boundInfo.expression;
      const hasBreak = ControlFlowAnalyzer.hasEarlyBreak(loopNode);
      if (hasBreak) {
        breakdowns.push("Early termination statement (break) detected \u2014 worst-case bound maintained.");
      }
      if (this.hasLogarithmicContainer(loopNode)) {
        currentCost = currentCost.multiply(ComplexityExpression.log(1));
        patterns.push("logarithmic-container-ops");
        breakdowns.push("Loop body performs logarithmic container operations (priority queue / ordered map) costing O(log n) per iteration.");
      }
      const childLoops = this.getDirectChildLoops(loopNode);
      if (childLoops.length === 0) {
        return {
          complexity: currentCost,
          depth,
          hasBreak,
          breakdowns,
          patterns
        };
      }
      let maxChildDepth = depth;
      let combinedChildrenCost = ComplexityExpression.constant();
      for (const childLoop of childLoops) {
        const isTriangular = LoopRules.isTriangularDependent(
          childLoop.init,
          childLoop.test,
          loopNode.varName || "i"
        );
        if (isTriangular) {
          patterns.push("triangular-loop");
        }
        const childRes = this.computeLoopBranchComplexity(childLoop, depth + 1);
        maxChildDepth = Math.max(maxChildDepth, childRes.depth);
        combinedChildrenCost = combinedChildrenCost.add(childRes.complexity);
        breakdowns.push(...childRes.breakdowns);
        patterns.push(...childRes.patterns);
      }
      const multipliedCost = currentCost.multiply(combinedChildrenCost);
      return {
        complexity: multipliedCost,
        depth: maxChildDepth,
        hasBreak,
        breakdowns,
        patterns
      };
    }
    static getDirectChildLoops(node) {
      const directLoops = [];
      function scan(curr) {
        for (const child of curr.children) {
          if (child.type === NODE_TYPES.FOR_STATEMENT || child.type === NODE_TYPES.WHILE_STATEMENT || child.type === NODE_TYPES.DO_WHILE_STATEMENT) {
            directLoops.push(child);
          } else {
            scan(child);
          }
        }
      }
      scan(node);
      return directLoops;
    }
    static hasLogarithmicContainer(loopNode) {
      const code = loopNode.bodyCode || loopNode.raw || "";
      if (/\b(?:pq|heap|priority_queue)\.(?:push|pop|add|poll|top|peek)\b/i.test(code) || /\b(?:treeMap|ordered)\.(?:put|insert|get|remove)\b/i.test(code) || /\b(?:ordered|treeMap)\s*\[/.test(code) || /\bmap\s*<[^>]+>[\s\S]*?\b(?:insert|\[)/.test(code)) {
        return true;
      }
      let p = loopNode.parent;
      while (p && p.parent) p = p.parent;
      if (p) {
        const decls = p.findChildren ? p.findChildren(NODE_TYPES.VARIABLE_DECLARATION) : [];
        const hasOrdered = decls.some(
          (d) => d.containerType === CONTAINER_TYPES.TREE_MAP || d.isPriorityQueue
        );
        if (hasOrdered) {
          if (/\b(?:push|pop|add|poll|put|insert)\s*\(|\b\w+\s*\[/.test(code)) {
            return true;
          }
        }
      }
      return false;
    }
  };

  // src/engine/rules/recurrenceSolver.js
  var RecurrenceSolver = class {
    /**
     * Solves recurrence relation:
     * @param {Object} options
     * @param {number} options.recursiveCalls - Number of subproblems (a)
     * @param {string} options.sizeReduction - 'half' (n/2), 'minus-one' (n-1), 'loop' (inside loop)
     * @param {string|ComplexityExpression} options.nonRecursiveCost - Cost of work at current level
     * @param {boolean} options.isMemoized - Whether memoization/caching is present
     * @param {number} [options.divisionFactor=2] - Division factor b (for divide & conquer)
     */
    static solve({
      recursiveCalls = 1,
      sizeReduction = "minus-one",
      nonRecursiveCost = "1",
      isMemoized = false,
      divisionFactor = 2
    }) {
      if (isMemoized) {
        return {
          time: ComplexityExpression.polynomial(1),
          space: SpaceExpression.linear("Memoization table requires O(n) storage and call stack bounded by O(n)."),
          confidence: CONFIDENCE_LEVELS.HIGH,
          reason: "Overlapping subproblems are cached via memoization, reducing exponential recurrence tree to O(n) time and O(n) auxiliary space."
        };
      }
      const workExpr = nonRecursiveCost instanceof ComplexityExpression ? nonRecursiveCost : ComplexityExpression.fromString(String(nonRecursiveCost));
      if (sizeReduction === "minus-one" || sizeReduction === "linear") {
        if (recursiveCalls === 1) {
          const time = workExpr.multiply(ComplexityExpression.polynomial(1));
          return {
            time,
            space: SpaceExpression.linear("Linear recursion call stack depth of n."),
            confidence: CONFIDENCE_LEVELS.HIGH,
            reason: `Recurrence T(n) = T(n - 1) + ${workExpr.format()} sums across n levels \u2192 ${time.format()} time.`
          };
        }
        if (recursiveCalls >= 2) {
          const time = ComplexityExpression.exponential(recursiveCalls);
          return {
            time,
            space: SpaceExpression.linear("Maximum recursion call stack depth is proportional to n."),
            confidence: CONFIDENCE_LEVELS.HIGH,
            reason: `Recurrence T(n) = ${recursiveCalls}T(n - 1) + ${workExpr.format()} branches ${recursiveCalls}-fold at each level \u2192 ${time.format()} exponential time.`
          };
        }
      }
      if (sizeReduction === "half" || sizeReduction === "divide") {
        const a = recursiveCalls;
        const b = divisionFactor || 2;
        const log_b_a = Math.log(a) / Math.log(b);
        let k = 0;
        let p = 0;
        if (workExpr.family === "constant") {
          k = 0;
        } else if (workExpr.family === "logarithmic") {
          k = 0;
          p = workExpr.logPower || 1;
        } else if (workExpr.family === "polynomial") {
          k = workExpr.degree;
        } else if (workExpr.family === "polylog") {
          k = workExpr.degree;
          p = workExpr.logPower;
        }
        const EPSILON = 1e-3;
        if (k < log_b_a - EPSILON) {
          let time;
          if (Math.abs(log_b_a - Math.round(log_b_a)) < 0.01) {
            time = ComplexityExpression.polynomial(Math.round(log_b_a));
          } else {
            time = ComplexityExpression.polynomial(Number(log_b_a.toFixed(3)));
          }
          return {
            time,
            space: SpaceExpression.log("Divide-and-conquer call stack depth of log_b(n)."),
            confidence: CONFIDENCE_LEVELS.HIGH,
            reason: `Master Theorem Case 1: T(n) = ${a}T(n/${b}) + ${workExpr.format()}, leaf nodes dominate \u2192 ${time.format()}.`
          };
        }
        if (Math.abs(k - log_b_a) <= EPSILON) {
          const time = ComplexityExpression.polylog(k, p + 1);
          return {
            time,
            space: SpaceExpression.log("Divide-and-conquer call stack depth of log_b(n)."),
            confidence: CONFIDENCE_LEVELS.HIGH,
            reason: `Master Theorem Case 2: T(n) = ${a}T(n/${b}) + ${workExpr.format()}, work evenly balanced across levels \u2192 ${time.format()}.`
          };
        }
        if (k > log_b_a + EPSILON) {
          return {
            time: workExpr,
            space: SpaceExpression.log("Divide-and-conquer call stack depth of log_b(n)."),
            confidence: CONFIDENCE_LEVELS.HIGH,
            reason: `Master Theorem Case 3: T(n) = ${a}T(n/${b}) + ${workExpr.format()}, root work dominates \u2192 ${workExpr.format()}.`
          };
        }
      }
      if (sizeReduction === "loop" || sizeReduction === "factorial") {
        return {
          time: ComplexityExpression.factorial("n"),
          space: SpaceExpression.linear("Backtracking permutation depth is bounded by n."),
          confidence: CONFIDENCE_LEVELS.HIGH,
          reason: "Recurrence T(n) = n * T(n - 1) branches across permutations \u2192 O(n!) factorial search space."
        };
      }
      return {
        time: ComplexityExpression.polynomial(1),
        space: SpaceExpression.linear(),
        confidence: CONFIDENCE_LEVELS.MEDIUM,
        reason: "Standard linear recursive descent."
      };
    }
  };

  // src/engine/analyzers/recursionAnalyzer.js
  var RecursionAnalyzer = class {
    static analyze(astRoot, memoizationInfo = null, graphInfo = null) {
      const functionNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.FUNCTION_DECLARATION
      );
      let hasRecursion = false;
      let recursiveFunctionName = null;
      let maxEffectiveBranches = 0;
      let sizeReduction = "minus-one";
      let isInsideLoop = false;
      let workPerLevel = ComplexityExpression.constant();
      const patterns = [];
      const breakdowns = [];
      for (const fn of functionNodes) {
        if (!fn.name || fn.name === "main_or_snippet") continue;
        const callExpressions = fn.findChildren(NODE_TYPES.CALL_EXPRESSION);
        const recursiveCalls = callExpressions.filter(
          (call) => call.callee === fn.name || call.callee?.endsWith("." + fn.name)
        );
        if (recursiveCalls.length > 0) {
          hasRecursion = true;
          recursiveFunctionName = fn.name;
          const effectiveBranchesOnPath = ControlFlowAnalyzer.getMaxCallsOnAnyPath(fn, fn.name);
          maxEffectiveBranches = Math.max(maxEffectiveBranches, effectiveBranchesOnPath);
          const dividesArg = recursiveCalls.some(
            (c) => c.args && /\/\s*2\b|>>\s*1\b|\/\/\s*2\b/.test(c.args)
          );
          const hasMidHalving = Boolean(
            fn.rawBody && /(mid|m)\s*=.*(?:\/\s*2|>>\s*1)/.test(fn.rawBody)
          );
          const hasPartitioning = Boolean(
            fn.rawBody && /\b(partition|pivot|pi)\b/i.test(fn.rawBody) || recursiveCalls.some((c) => c.args && /\b(?:pi|pivot)\b/i.test(c.args))
          );
          if (dividesArg || hasMidHalving || hasPartitioning) {
            sizeReduction = "half";
          }
          const inLoop = recursiveCalls.some(
            (c) => Boolean(
              c.findAncestor(
                (n) => n.type === NODE_TYPES.FOR_STATEMENT || n.type === NODE_TYPES.WHILE_STATEMENT || n.type === NODE_TYPES.DO_WHILE_STATEMENT
              )
            )
          );
          if (inLoop && (!graphInfo || !graphInfo.hasGraphPattern)) {
            isInsideLoop = true;
          }
          const loopsInFn = fn.findChildren(NODE_TYPES.FOR_STATEMENT).concat(fn.findChildren(NODE_TYPES.WHILE_STATEMENT));
          const hasPartitionWork = Boolean(fn.rawBody && /\b(?:partition|pivot|merge)\b/i.test(fn.rawBody));
          if ((loopsInFn.length > 0 || hasPartitionWork) && !isInsideLoop) {
            workPerLevel = ComplexityExpression.polynomial(1);
          }
        }
      }
      if (!hasRecursion) {
        return {
          hasRecursion: false,
          timeComplexity: ComplexityExpression.constant(),
          stackSpace: SpaceExpression.constant(),
          confidence: CONFIDENCE_LEVELS.HIGH,
          patterns: [],
          breakdowns: []
        };
      }
      const isMemoized = Boolean(memoizationInfo && memoizationInfo.hasMemoization);
      const solution = RecurrenceSolver.solve({
        recursiveCalls: maxEffectiveBranches,
        sizeReduction: isInsideLoop ? "loop" : sizeReduction,
        nonRecursiveCost: workPerLevel,
        isMemoized
      });
      if (isInsideLoop) {
        patterns.push("recursion", "backtracking", "permutations", "factorial-complexity");
        breakdowns.push(
          `Recursive self-invocation inside iteration loop detected in '${recursiveFunctionName}' (backtracking / permutation pattern) \u2192 ${solution.time.format()} time.`
        );
      } else if (isMemoized) {
        patterns.push("recursion", "memoization", "dynamic-programming");
        breakdowns.push(
          `Memoized recursive function detected in '${recursiveFunctionName}' \u2192 ${solution.time.format()} time, ${solution.space.format()} auxiliary storage.`
        );
      } else if (sizeReduction === "half") {
        if (maxEffectiveBranches === 1) {
          patterns.push("recursion", "binary-search-recursion");
          breakdowns.push(
            `Logarithmic recursive interval halving detected in '${recursiveFunctionName}' \u2192 O(log n) time and O(log n) stack space.`
          );
        } else {
          patterns.push("recursion", "divide-and-conquer");
          breakdowns.push(
            `Divide-and-conquer recursion in '${recursiveFunctionName}' (${maxEffectiveBranches} subproblems halving input) \u2192 ${solution.time.format()} time.`
          );
        }
      } else {
        if (maxEffectiveBranches >= 2) {
          patterns.push("recursion", "branching-recursion", "exponential-complexity");
          breakdowns.push(
            `Branching recursive calls in '${recursiveFunctionName}' (${maxEffectiveBranches} calls per execution path) \u2192 ${solution.time.format()} exponential time.`
          );
        } else {
          patterns.push("recursion", "linear-recursion");
          breakdowns.push(
            `Linear recursion in '${recursiveFunctionName}' (single recursive call per path) \u2192 ${solution.time.format()} time, O(n) call stack auxiliary memory.`
          );
        }
      }
      return {
        hasRecursion: true,
        timeComplexity: solution.time,
        stackSpace: solution.space,
        confidence: solution.confidence,
        patterns,
        breakdowns
      };
    }
  };

  // src/engine/analyzers/sortingAnalyzer.js
  var SortingAnalyzer = class {
    static analyze(astRoot) {
      const callNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.CALL_EXPRESSION && n.isSorting
      );
      if (callNodes.length === 0) {
        return {
          hasSorting: false,
          timeComplexity: ComplexityExpression.constant(),
          isInsideLoop: false,
          patterns: [],
          breakdowns: []
        };
      }
      const isInsideLoop = callNodes.some((node) => {
        let p = node.parent;
        while (p) {
          if (p.type === NODE_TYPES.FOR_STATEMENT || p.type === NODE_TYPES.WHILE_STATEMENT || p.type === NODE_TYPES.DO_WHILE_STATEMENT) {
            return true;
          }
          p = p.parent;
        }
        return false;
      });
      const patterns = ["sorting"];
      const breakdowns = [];
      if (isInsideLoop) {
        patterns.push("sorting-inside-loop");
        breakdowns.push(
          "Comparison sorting executed inside an iteration loop \u2192 dominates with O(n\xB2 log n) or higher."
        );
        return {
          hasSorting: true,
          timeComplexity: ComplexityExpression.polylog(2, 1),
          isInsideLoop: true,
          patterns,
          breakdowns
        };
      }
      breakdowns.push("Standard comparison sort operation detected \u2192 O(n log n) time.");
      return {
        hasSorting: true,
        timeComplexity: ComplexityExpression.polylog(1, 1),
        isInsideLoop: false,
        patterns,
        breakdowns
      };
    }
  };

  // src/engine/analyzers/searchingAnalyzer.js
  var SearchingAnalyzer = class {
    static analyze(astRoot) {
      const patterns = [];
      const breakdowns = [];
      let hasBinarySearch = false;
      const whileNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.WHILE_STATEMENT && n.isBinarySearch
      );
      const callNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.CALL_EXPRESSION && n.isBinarySearch
      );
      if (whileNodes.length > 0 || callNodes.length > 0) {
        hasBinarySearch = true;
        patterns.push("binary-search");
        breakdowns.push("Binary search interval halving detected \u2192 O(log n) time.");
      }
      return {
        hasBinarySearch,
        timeComplexity: hasBinarySearch ? ComplexityExpression.log(1) : ComplexityExpression.constant(),
        patterns,
        breakdowns
      };
    }
  };

  // src/engine/analyzers/graphAnalyzer.js
  var GraphAnalyzer = class {
    static analyze(astRoot) {
      let hasGraphPattern = false;
      let timeComplexity = null;
      let spaceComplexity = null;
      const patterns = [];
      const breakdowns = [];
      let fullText = "";
      astRoot.walk((node) => {
        if (node.rawBody) fullText += " " + node.rawBody;
        if (node.raw) fullText += " " + node.raw;
        if (node.name) fullText += " " + node.name;
        if (node.params) fullText += " " + node.params;
      });
      const hasDistRelaxation = /(?:dist|matrix|graph|d|adj)\[[a-zA-Z_]\w*\]\[[a-zA-Z_]\w*\]\s*=\s*(?:min|std::min|Math\.min)\s*\(/i.test(fullText) || /(?:dist|matrix|graph|d|adj)\[[a-zA-Z_]\w*\]\[[a-zA-Z_]\w*\]\s*>\s*(?:dist|matrix|graph|d|adj)/i.test(fullText);
      const loopNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.FOR_STATEMENT || n.type === NODE_TYPES.WHILE_STATEMENT
      );
      const maxNesting = loopNodes.reduce((acc, l) => Math.max(acc, l.getNestingDepth(NODE_TYPES.FOR_STATEMENT)), 0);
      if (hasDistRelaxation && maxNesting >= 2) {
        hasGraphPattern = true;
        timeComplexity = ComplexityExpression.graphCubic();
        spaceComplexity = SpaceExpression.quadratic("Adjacency matrix representation requires O(V\xB2) space.");
        patterns.push("graph", "floyd-warshall", "all-pairs-shortest-path");
        breakdowns.push("Floyd-Warshall all-pairs shortest path pattern detected (3 nested loops with matrix relaxation) \u2192 O(V\xB3) time, O(V\xB2) space.");
        return { hasGraphPattern, timeComplexity, spaceComplexity, patterns, breakdowns };
      }
      const hasDijkstra = /\b(?:priority_queue|PriorityQueue|heapq)\b/i.test(fullText) && /\b(?:dist|distance)\b/i.test(fullText);
      if (hasDijkstra) {
        hasGraphPattern = true;
        timeComplexity = ComplexityExpression.graphLog();
        spaceComplexity = SpaceExpression.graphV("Distance map and min-heap allocate O(V) space.");
        patterns.push("graph", "dijkstra", "shortest-path", "min-heap");
        breakdowns.push("Dijkstra shortest path algorithm with priority queue detected \u2192 O((V + E) log V) time, O(V) auxiliary space.");
        return { hasGraphPattern, timeComplexity, spaceComplexity, patterns, breakdowns };
      }
      const hasBFS = /\b(?:queue|deque|ArrayDeque)\b/i.test(fullText) && /\b(?:visited|seen)\b/i.test(fullText) && /\b(?:push|pop|poll|offer|shift|popleft)\b/i.test(fullText);
      if (hasBFS) {
        hasGraphPattern = true;
        timeComplexity = ComplexityExpression.graphLinear();
        spaceComplexity = SpaceExpression.graphV("Queue and visited state array require O(V) auxiliary space.");
        patterns.push("graph", "breadth-first-search", "bfs");
        breakdowns.push("Breadth-First Search (BFS) graph traversal detected \u2192 O(V + E) time, O(V) auxiliary space.");
        return { hasGraphPattern, timeComplexity, spaceComplexity, patterns, breakdowns };
      }
      const hasDFS = /\b(?:visited|seen)\b/i.test(fullText) && (/\b(?:dfs|traverseGraph|explore)\b/i.test(fullText) || /\badj\[/.test(fullText));
      if (hasDFS) {
        hasGraphPattern = true;
        timeComplexity = ComplexityExpression.graphLinear();
        spaceComplexity = SpaceExpression.graphV("Recursion stack and visited state array require O(V) space.");
        patterns.push("graph", "depth-first-search", "dfs");
        breakdowns.push("Depth-First Search (DFS) graph traversal detected \u2192 O(V + E) time, O(V) auxiliary space.");
        return { hasGraphPattern, timeComplexity, spaceComplexity, patterns, breakdowns };
      }
      return {
        hasGraphPattern: false,
        timeComplexity: null,
        spaceComplexity: null,
        patterns: [],
        breakdowns: []
      };
    }
  };

  // src/engine/ast/ASTUtils.js
  var ASTUtils = class {
    static isInsideLoop(node) {
      let p = node.parent;
      while (p) {
        if (p.type === NODE_TYPES.FOR_STATEMENT || p.type === NODE_TYPES.WHILE_STATEMENT || p.type === NODE_TYPES.DO_WHILE_STATEMENT) {
          return true;
        }
        p = p.parent;
      }
      return false;
    }
    static getEnclosingLoop(node) {
      let p = node.parent;
      while (p) {
        if (p.type === NODE_TYPES.FOR_STATEMENT || p.type === NODE_TYPES.WHILE_STATEMENT || p.type === NODE_TYPES.DO_WHILE_STATEMENT) {
          return p;
        }
        p = p.parent;
      }
      return null;
    }
    static findEnclosingFunction(node) {
      let p = node.parent;
      while (p) {
        if (p.type === NODE_TYPES.FUNCTION_DECLARATION) {
          return p;
        }
        p = p.parent;
      }
      return null;
    }
    static findFunctionByName(root, name) {
      if (!root || !name) return null;
      let found = null;
      root.walk((node) => {
        if (node.type === NODE_TYPES.FUNCTION_DECLARATION && node.name === name) {
          found = node;
        }
      });
      return found;
    }
    static hasCallTo(node, calleeName) {
      if (!node || !calleeName) return false;
      let hasCall = false;
      node.walk((curr) => {
        if (curr.type === NODE_TYPES.CALL_EXPRESSION) {
          if (curr.callee === calleeName || curr.callee?.endsWith("." + calleeName)) {
            hasCall = true;
          }
        }
      });
      return hasCall;
    }
    static isInsideConditional(node) {
      let p = node.parent;
      while (p) {
        if (p.type === NODE_TYPES.IF_STATEMENT) return true;
        p = p.parent;
      }
      return false;
    }
  };

  // src/engine/analyzers/backtrackingAnalyzer.js
  var BacktrackingAnalyzer = class {
    static analyze(astRoot) {
      let hasBacktracking = false;
      let isPermutation = false;
      let isSubset = false;
      const patterns = [];
      const breakdowns = [];
      const functionNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.FUNCTION_DECLARATION
      );
      for (const fn of functionNodes) {
        if (!fn.name || fn.name === "main_or_snippet") continue;
        const isRecursive = ASTUtils.hasCallTo(fn, fn.name);
        if (!isRecursive) continue;
        const body = fn.rawBody || "";
        const hasPushPop = /\.push(?:_back)?\(/.test(body) && /\.pop(?:_back)?\(/.test(body) || /swap\s*\(/.test(body) || /visited\[.*?\]\s*=\s*true/.test(body) && /visited\[.*?\]\s*=\s*false/.test(body);
        const hasLoop = fn.findChildren(NODE_TYPES.FOR_STATEMENT).length > 0 || fn.findChildren(NODE_TYPES.WHILE_STATEMENT).length > 0;
        if (hasPushPop && hasLoop) {
          hasBacktracking = true;
          isPermutation = true;
          break;
        } else if (hasPushPop) {
          hasBacktracking = true;
          isSubset = true;
          break;
        }
      }
      if (hasBacktracking) {
        if (isPermutation) {
          patterns.push("backtracking", "permutations", "factorial-complexity");
          breakdowns.push("Backtracking state mutation pattern inside iteration loop detected \u2192 O(n!) search complexity.");
          return {
            hasBacktracking: true,
            timeComplexity: ComplexityExpression.factorial("n"),
            spaceComplexity: SpaceExpression.linear("Backtracking recursion path depth is bounded by O(n)."),
            patterns,
            breakdowns
          };
        }
        patterns.push("backtracking", "subsets", "exponential-complexity");
        breakdowns.push("Include/exclude backtracking subset generation pattern detected \u2192 O(2^n) search complexity.");
        return {
          hasBacktracking: true,
          timeComplexity: ComplexityExpression.exponential(2),
          spaceComplexity: SpaceExpression.linear("Recursion path stack depth is bounded by O(n)."),
          patterns,
          breakdowns
        };
      }
      return {
        hasBacktracking: false,
        timeComplexity: null,
        spaceComplexity: null,
        patterns: [],
        breakdowns: []
      };
    }
  };

  // src/engine/analyzers/dpAnalyzer.js
  var DpAnalyzer = class {
    static analyze(astRoot) {
      let hasMemoization = false;
      let hasTabulation = false;
      let is2D = false;
      const patterns = [];
      const breakdowns = [];
      astRoot.walk((node) => {
        if (node.type === NODE_TYPES.FUNCTION_DECLARATION) {
          const body = node.rawBody || "";
          if (/\b(?:memo|cache|dp)\s*\[/.test(body) || /\b(?:memo|cache)\.count\b|\b(?:memo|cache)\.find\b/.test(body) || /\bin\s+(?:memo|cache)\b/.test(body)) {
            hasMemoization = true;
          }
        }
        if (node.type === NODE_TYPES.VARIABLE_DECLARATION) {
          if (node.containerType === CONTAINER_TYPES.MATRIX_2D) {
            hasTabulation = true;
            is2D = true;
          }
          if (node.name && /\b(?:dp|memo|table)\b/i.test(node.name)) {
            hasTabulation = true;
          }
        }
      });
      if (hasMemoization) {
        patterns.push("dynamic-programming", "memoization");
        breakdowns.push("Memoization cache lookup detected \u2014 avoids duplicate subproblem evaluation.");
      }
      if (hasTabulation) {
        patterns.push("dynamic-programming", is2D ? "2d-tabulation" : "1d-tabulation");
        breakdowns.push(
          is2D ? "2D dynamic programming grid table detected \u2192 O(n\xB2) time and space." : "1D dynamic programming tabulation detected \u2192 O(n) time and space."
        );
      }
      return {
        hasMemoization,
        hasTabulation,
        is2D,
        patterns,
        breakdowns
      };
    }
  };

  // src/engine/rules/spaceRules.js
  var SpaceRules = class {
    static evaluateContainerSpace(containerType, isFixedSize = false) {
      if (isFixedSize) {
        return SpaceExpression.constant("Fixed-size constant buffer (e.g., character array of 26/256 entries) \u2192 O(1) space.");
      }
      switch (containerType) {
        case CONTAINER_TYPES.MATRIX_2D:
          return SpaceExpression.quadratic("2D table or matrix buffer allocated for state computation \u2192 O(n\xB2) space.");
        case CONTAINER_TYPES.HASH_MAP:
          return SpaceExpression.linear("Auxiliary hash map allocated to store elements and provide lookups \u2192 O(n) space.");
        case CONTAINER_TYPES.HASH_SET:
        case CONTAINER_TYPES.TREE_MAP:
        case CONTAINER_TYPES.LINEAR_ARRAY:
        case CONTAINER_TYPES.STACK_QUEUE:
          return SpaceExpression.linear("Auxiliary dynamic collection / array proportional to input size \u2192 O(n) space.");
        case CONTAINER_TYPES.GRAPH_ADJ:
          return SpaceExpression.graphVE("Graph adjacency list representation \u2192 O(V + E) auxiliary space.");
        default:
          return SpaceExpression.constant();
      }
    }
  };

  // src/engine/analyzers/dataStructureAnalyzer.js
  var DataStructureAnalyzer = class {
    static analyze(astRoot) {
      const declNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.VARIABLE_DECLARATION && n.containerType
      );
      const patterns = [];
      const breakdowns = [];
      let spaceComplexity = SpaceExpression.constant();
      let hasHashMap = false;
      let hasTreeMap = false;
      let hasHashSet = false;
      let hasLinearArray = false;
      let hasMatrix2D = false;
      let hasFixedBuffer = false;
      let hasStackQueueLinear = false;
      let hasStackQueueQuadratic = false;
      let hasStackQueueConstant = false;
      let hasStackQueueLog = false;
      let hasHeuristicBounds = false;
      const stackQueueBreakdowns = [];
      for (const decl of declNodes) {
        if (decl.isFixedSize) {
          hasFixedBuffer = true;
          patterns.push("fixed-buffer");
          continue;
        }
        switch (decl.containerType) {
          case CONTAINER_TYPES.MATRIX_2D:
            hasMatrix2D = true;
            patterns.push("2d-matrix", "dp-table");
            break;
          case CONTAINER_TYPES.HASH_MAP:
            hasHashMap = true;
            patterns.push("hash-map");
            break;
          case CONTAINER_TYPES.TREE_MAP:
            hasTreeMap = true;
            patterns.push("tree-map");
            break;
          case CONTAINER_TYPES.HASH_SET:
            hasHashSet = true;
            patterns.push("hash-set");
            break;
          case CONTAINER_TYPES.LINEAR_ARRAY:
            hasLinearArray = true;
            patterns.push("array-or-vector");
            break;
          case CONTAINER_TYPES.STACK_QUEUE: {
            const sq = this.analyzeStackQueueCapacity(decl, astRoot);
            if (sq.isQuadratic) {
              hasStackQueueQuadratic = true;
            } else if (sq.isLinear) {
              hasStackQueueLinear = true;
            } else if (sq.isLogarithmic) {
              hasStackQueueLog = true;
            } else {
              hasStackQueueConstant = true;
            }
            if (sq.unreliable) {
              hasHeuristicBounds = true;
            }
            if (sq.pattern) patterns.push(sq.pattern);
            if (sq.reason) stackQueueBreakdowns.push(sq.reason);
            break;
          }
        }
      }
      if (hasMatrix2D || hasStackQueueQuadratic) {
        spaceComplexity = SpaceRules.evaluateContainerSpace(CONTAINER_TYPES.MATRIX_2D);
        if (hasMatrix2D) {
          breakdowns.push("2D dynamic programming grid or matrix allocated \u2192 O(n\xB2) auxiliary space.");
        }
        if (hasStackQueueQuadratic) {
          breakdowns.push(...stackQueueBreakdowns.filter((b) => b.includes("O(n\xB2)")));
        }
      } else if (hasHashMap || hasTreeMap || hasHashSet || hasLinearArray || hasStackQueueLinear) {
        spaceComplexity = SpaceRules.evaluateContainerSpace(CONTAINER_TYPES.LINEAR_ARRAY);
        if (hasHashMap) {
          breakdowns.push("Hash map allocated (enables average O(1) key-value lookups) \u2192 O(n) auxiliary space.");
        } else if (hasTreeMap) {
          breakdowns.push("Balanced binary search tree / ordered map allocated (O(log n) lookups) \u2192 O(n) auxiliary space.");
        } else if (hasHashSet) {
          breakdowns.push("Hash set allocated for uniqueness checks \u2192 O(n) auxiliary space.");
        } else if (hasLinearArray) {
          breakdowns.push("Auxiliary collection / vector / array allocated \u2192 O(n) auxiliary space.");
        }
        if (hasStackQueueLinear) {
          breakdowns.push(...stackQueueBreakdowns.filter((b) => b.includes("O(n)")));
        }
      } else if (hasStackQueueLog) {
        spaceComplexity = SpaceExpression.log("Auxiliary container holds logarithmic number of simultaneous elements \u2192 O(log n) space.");
        breakdowns.push(...stackQueueBreakdowns.filter((b) => b.includes("O(log n)")));
      } else if (hasFixedBuffer || hasStackQueueConstant) {
        spaceComplexity = SpaceRules.evaluateContainerSpace(CONTAINER_TYPES.LINEAR_ARRAY, true);
        if (hasFixedBuffer) {
          breakdowns.push("Fixed-size constant buffer / lookup table allocated independent of input size \u2192 O(1) auxiliary space.");
        }
        if (hasStackQueueConstant) {
          breakdowns.push(...stackQueueBreakdowns.filter((b) => b.includes("O(1)")));
        }
      } else {
        breakdowns.push("Only scalar variables or in-place transformations detected \u2192 O(1) auxiliary space.");
      }
      return {
        spaceComplexity,
        hasHashMap,
        hasTreeMap,
        hasHashSet,
        hasLinearArray,
        hasMatrix2D,
        hasFixedBuffer,
        hasStackQueueLinear,
        hasStackQueueQuadratic,
        hasStackQueueConstant,
        hasStackQueueLog,
        hasHeuristicBounds,
        stackQueueBreakdowns,
        patterns: Array.from(new Set(patterns)),
        breakdowns: Array.from(new Set(breakdowns))
      };
    }
    static analyzeStackQueueCapacity(decl, astRoot) {
      const containerName = decl.name;
      const rawKind = decl.containerKind || "container";
      const containerKind = rawKind.toLowerCase();
      const prettyKind = containerKind === "priority_queue" ? "Priority queue" : containerKind === "deque" ? "Deque" : containerKind === "queue" ? "Queue" : containerKind === "stack" ? "Stack" : "Container";
      const declFn = decl.findAncestor((n) => n.type === NODE_TYPES.FUNCTION_DECLARATION);
      const allCalls = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.CALL_EXPRESSION && typeof n.callee === "string"
      ).filter((c) => {
        const callFn = c.findAncestor((n) => n.type === NODE_TYPES.FUNCTION_DECLARATION);
        return callFn === declFn;
      });
      const pushMethods = ["push", "emplace", "push_back", "push_front", "emplace_back", "emplace_front", "add", "offer"];
      const popMethods = ["pop", "pop_back", "pop_front", "poll", "remove"];
      const pushes = allCalls.filter((c) => {
        return pushMethods.some(
          (m) => c.callee === `${containerName}.${m}` || c.callee === `${containerName}->${m}`
        );
      });
      const pops = allCalls.filter((c) => {
        return popMethods.some(
          (m) => c.callee === `${containerName}.${m}` || c.callee === `${containerName}->${m}`
        );
      });
      if (pushes.length === 0) {
        return {
          complexity: "O(1)",
          isConstant: true,
          isLinear: false,
          isQuadratic: false,
          containerKind,
          name: containerName,
          reason: `${prettyKind} '${containerName}' allocated but receives no elements \u2192 O(1) auxiliary space.`,
          pattern: containerKind.replace("_", "-")
        };
      }
      const getLoopsBetween = (node) => {
        const loops = [];
        let curr = node.parent;
        while (curr) {
          if (curr === decl || curr === decl.parent) break;
          let isAncestorOfDecl = false;
          let p = decl.parent;
          while (p) {
            if (p === curr) {
              isAncestorOfDecl = true;
              break;
            }
            p = p.parent;
          }
          if (isAncestorOfDecl) break;
          if (curr.type === NODE_TYPES.FOR_STATEMENT || curr.type === NODE_TYPES.WHILE_STATEMENT || curr.type === NODE_TYPES.DO_WHILE_STATEMENT) {
            loops.push(curr);
          }
          curr = curr.parent;
        }
        return loops;
      };
      const isLoopConstant = (loop) => {
        if (loop.stepType === STEP_TYPES.CONSTANT) return true;
        if (loop.isRangeBased) return false;
        const boundInfo = LoopRules.evaluateLoopBound(
          loop.init,
          loop.test || loop.condition,
          loop.update,
          loop.varName
        );
        return boundInfo.isConstant;
      };
      const isUnconditionalInLoop = (callNode, loopNode) => {
        let curr = callNode.parent;
        while (curr && curr !== loopNode) {
          if (curr.type === NODE_TYPES.IF_STATEMENT) {
            const cond = String(curr.condition || "");
            const isGuard = new RegExp(
              `!\\s*${containerName}\\.empty\\(\\)|${containerName}\\.size\\(\\)\\s*>\\s*0`
            ).test(cond);
            if (!isGuard) return false;
          } else if (curr.type === NODE_TYPES.WHILE_STATEMENT || curr.type === NODE_TYPES.FOR_STATEMENT || curr.type === NODE_TYPES.DO_WHILE_STATEMENT) {
            return false;
          }
          curr = curr.parent;
        }
        return true;
      };
      let maxNonConstLoops = 0;
      let hasLogLoop = false;
      let allLoopPushesBalanced = true;
      for (const push of pushes) {
        const loops = getLoopsBetween(push);
        const nonConstLoops = loops.filter((l) => !isLoopConstant(l));
        if (nonConstLoops.length === 0) {
          continue;
        }
        maxNonConstLoops = Math.max(maxNonConstLoops, nonConstLoops.length);
        if (nonConstLoops.some((l) => l.stepType === STEP_TYPES.LOGARITHMIC)) {
          hasLogLoop = true;
        }
        const innermostLoop = nonConstLoops[0];
        const popsInLoop = pops.filter((pop) => {
          const pLoops = getLoopsBetween(pop);
          return pLoops.length > 0 && pLoops[0] === innermostLoop;
        });
        const unconditionalPops = popsInLoop.filter((p) => isUnconditionalInLoop(p, innermostLoop));
        const pushesInLoop = pushes.filter((p) => {
          const pLoops = getLoopsBetween(p);
          return pLoops.length > 0 && pLoops[0] === innermostLoop;
        });
        const unconditionalPushes = pushesInLoop.filter((p) => isUnconditionalInLoop(p, innermostLoop));
        if (unconditionalPops.length >= unconditionalPushes.length && unconditionalPushes.length > 0) {
        } else {
          allLoopPushesBalanced = false;
        }
      }
      const isBalanced = maxNonConstLoops > 0 && allLoopPushesBalanced;
      if (maxNonConstLoops === 0) {
        return {
          complexity: "O(1)",
          isConstant: true,
          isLinear: false,
          isQuadratic: false,
          containerKind,
          name: containerName,
          reason: `${prettyKind} '${containerName}' maintains at most O(1) simultaneously stored elements (destroyed each iteration or bounded capacity) \u2192 O(1) auxiliary space.`,
          pattern: containerKind.replace("_", "-")
        };
      }
      if (isBalanced) {
        return {
          complexity: "O(1)",
          isConstant: true,
          isLinear: false,
          isQuadratic: false,
          containerKind,
          name: containerName,
          reason: `${prettyKind} '${containerName}' pushes and pops once per iteration (net growth bounded by O(1)) \u2192 O(1) auxiliary space.`,
          pattern: containerKind.replace("_", "-")
        };
      }
      if (maxNonConstLoops === 1) {
        if (hasLogLoop) {
          return {
            complexity: "O(log n)",
            isConstant: false,
            isLinear: false,
            isQuadratic: false,
            isLogarithmic: true,
            containerKind,
            name: containerName,
            reason: `${prettyKind} '${containerName}' accumulates elements across a logarithmic loop \u2192 O(log n) auxiliary space.`,
            pattern: containerKind.replace("_", "-")
          };
        }
        return {
          complexity: "O(n)",
          isConstant: false,
          isLinear: true,
          isQuadratic: false,
          containerKind,
          name: containerName,
          reason: `${prettyKind} '${containerName}' receives elements across loop iteration without immediate balancing pop \u2192 O(n) auxiliary space.`,
          pattern: containerKind.replace("_", "-")
        };
      }
      if (maxNonConstLoops >= 2) {
        return {
          complexity: "O(n\xB2)",
          isConstant: false,
          isLinear: false,
          isQuadratic: true,
          containerKind,
          name: containerName,
          reason: `${prettyKind} '${containerName}' accumulates elements across ${maxNonConstLoops} nested loops without destruction \u2192 O(n\xB2) auxiliary space.`,
          pattern: containerKind.replace("_", "-")
        };
      }
      return {
        complexity: "O(n)",
        isConstant: false,
        isLinear: true,
        isQuadratic: false,
        containerKind,
        name: containerName,
        reason: `${prettyKind} '${containerName}' capacity proportional to input sequence \u2192 O(n) auxiliary space.`,
        pattern: containerKind.replace("_", "-"),
        unreliable: true
      };
    }
  };

  // src/engine/analyzers/functionCallAnalyzer.js
  var FunctionCallAnalyzer = class {
    static analyze(astRoot) {
      const functionNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.FUNCTION_DECLARATION
      );
      const callGraph = /* @__PURE__ */ new Map();
      const functionCosts = /* @__PURE__ */ new Map();
      for (const fn of functionNodes) {
        if (!fn.name) continue;
        const calls = fn.findChildren(NODE_TYPES.CALL_EXPRESSION);
        const callees = calls.map((c) => c.callee).filter(Boolean);
        callGraph.set(fn.name, callees);
      }
      const callNodes = ASTVisitor.findNodes(
        astRoot,
        (n) => n.type === NODE_TYPES.CALL_EXPRESSION
      );
      let maxInlinedLoopComplexity = ComplexityExpression.constant();
      const visited = /* @__PURE__ */ new Set();
      for (const call of callNodes) {
        if (!call.callee) continue;
        const enclosingLoop = ASTUtils.getEnclosingLoop(call);
        if (enclosingLoop) {
          const targetFn = ASTUtils.findFunctionByName(astRoot, call.callee);
          if (targetFn && targetFn !== ASTUtils.findEnclosingFunction(call)) {
            const innerLoops = targetFn.findChildren(NODE_TYPES.FOR_STATEMENT).concat(targetFn.findChildren(NODE_TYPES.WHILE_STATEMENT));
            if (innerLoops.length > 0) {
              maxInlinedLoopComplexity = ComplexityExpression.polynomial(2);
            }
          }
        }
      }
      return {
        callGraph,
        maxInlinedLoopComplexity
      };
    }
  };

  // src/engine/synthesis/timeComplexity.js
  var TimeComplexitySynthesizer = class {
    static synthesize({
      loopResult,
      recursionResult,
      sortingResult,
      searchingResult,
      graphResult,
      backtrackingResult,
      dpResult,
      functionCallResult
    }) {
      let dominantExpr = ComplexityExpression.constant();
      let primaryReason = "Straight-line constant-time execution statements detected.";
      let bestCase = "O(1)";
      let averageCase = "O(1)";
      let worstCase = "O(1)";
      if (graphResult && graphResult.hasGraphPattern && graphResult.timeComplexity) {
        dominantExpr = graphResult.timeComplexity;
        primaryReason = graphResult.breakdowns[0] || "Graph traversal dominates total execution time.";
        if (sortingResult && sortingResult.hasSorting && sortingResult.timeComplexity) {
          dominantExpr = dominantExpr.add(sortingResult.timeComplexity);
        }
      } else {
        if (backtrackingResult && backtrackingResult.hasBacktracking && backtrackingResult.timeComplexity) {
          dominantExpr = dominantExpr.add(backtrackingResult.timeComplexity);
          primaryReason = backtrackingResult.breakdowns[0] || "Backtracking search space dominates execution time.";
        }
        if (recursionResult && recursionResult.hasRecursion && recursionResult.timeComplexity) {
          dominantExpr = dominantExpr.add(recursionResult.timeComplexity);
          primaryReason = recursionResult.breakdowns[0] || "Recursive call-tree invocation dominates execution time.";
        }
        if (sortingResult && sortingResult.hasSorting && sortingResult.timeComplexity) {
          dominantExpr = dominantExpr.add(sortingResult.timeComplexity);
          if (dominantExpr.compare(sortingResult.timeComplexity) === 0) {
            primaryReason = sortingResult.breakdowns[0] || "Standard comparison sort dominates execution time.";
          }
        }
        if (loopResult && loopResult.timeComplexity) {
          const prevDominant = dominantExpr;
          dominantExpr = dominantExpr.add(loopResult.timeComplexity);
          if (dominantExpr.compare(prevDominant) > 0) {
            if (loopResult.maxNestingDepth >= 2) {
              primaryReason = `${loopResult.maxNestingDepth} nested loops detected (inner loop executes for each outer iteration).`;
            } else if (loopResult.timeComplexity.family === "logarithmic") {
              primaryReason = "Logarithmic interval halving step or geometric progression detected.";
            } else if (loopResult.timeComplexity.family === "sqrt") {
              primaryReason = "Square root loop boundary (i * i <= n or sqrt(n)) detected.";
            } else if (loopResult.maxNestingDepth === 1) {
              primaryReason = "Single linear loop traversal iterates through input elements.";
            }
          }
        }
      }
      if (searchingResult && searchingResult.hasBinarySearch) {
        dominantExpr = dominantExpr.add(searchingResult.timeComplexity);
        if (dominantExpr.family === "logarithmic") {
          primaryReason = "Binary search interval halving guarantees logarithmic execution time.";
        }
      }
      if (functionCallResult && functionCallResult.maxInlinedLoopComplexity) {
        dominantExpr = dominantExpr.add(functionCallResult.maxInlinedLoopComplexity);
      }
      const formatted = dominantExpr.format();
      worstCase = formatted;
      averageCase = formatted;
      bestCase = dominantExpr.family === "constant" ? "O(1)" : "O(1) to " + formatted;
      return {
        complexity: formatted,
        expression: dominantExpr,
        confidence: CONFIDENCE_LEVELS.HIGH,
        reason: primaryReason,
        bestCase,
        averageCase,
        worstCase
      };
    }
  };

  // src/engine/synthesis/spaceComplexity.js
  var SpaceComplexitySynthesizer = class {
    static synthesize({ dsResult, recursionResult, graphResult, backtrackingResult }) {
      let dominantSpace = SpaceExpression.constant();
      let primaryReason = "Only constant O(1) auxiliary variables or pointers allocated.";
      if (graphResult && graphResult.hasGraphPattern && graphResult.spaceComplexity) {
        dominantSpace = graphResult.spaceComplexity;
        primaryReason = graphResult.spaceComplexity.reason;
      }
      if (dsResult) {
        if (dsResult.hasMatrix2D) {
          dominantSpace = SpaceExpression.quadratic(
            "2D table or matrix buffer allocated for state computation requires O(n\xB2) auxiliary memory."
          );
          primaryReason = dominantSpace.reason;
        } else if (!graphResult || !graphResult.hasGraphPattern) {
          if (dsResult.hasStackQueueQuadratic) {
            const reason = dsResult.stackQueueBreakdowns && dsResult.stackQueueBreakdowns.find((b) => b.includes("O(n\xB2)")) || "Container storage accumulates across nested loops requiring O(n\xB2) auxiliary memory.";
            dominantSpace = SpaceExpression.quadratic(reason);
            primaryReason = dominantSpace.reason;
          } else if (dsResult.hasHashMap) {
            dominantSpace = SpaceExpression.linear("Auxiliary hash map allocated to store elements and provide fast lookups requires O(n) space.");
            primaryReason = dominantSpace.reason;
          } else if (dsResult.hasLinearArray || dsResult.hasHashSet || dsResult.hasTreeMap || dsResult.hasStackQueueLinear) {
            const reason = dsResult.hasStackQueueLinear && !dsResult.hasLinearArray && !dsResult.hasHashSet && !dsResult.hasTreeMap ? dsResult.stackQueueBreakdowns && dsResult.stackQueueBreakdowns.find((b) => b.includes("O(n)")) || "Auxiliary container storage proportional to input size requires O(n) space." : "Auxiliary collection / vector allocated with capacity proportional to input size requires O(n) space.";
            dominantSpace = SpaceExpression.linear(reason);
            primaryReason = dominantSpace.reason;
          } else if (dsResult.hasStackQueueLog) {
            const reason = dsResult.stackQueueBreakdowns && dsResult.stackQueueBreakdowns.find((b) => b.includes("O(log n)")) || "Auxiliary container storage proportional to log n requires O(log n) space.";
            dominantSpace = SpaceExpression.log(reason);
            primaryReason = dominantSpace.reason;
          } else if ((dsResult.hasFixedBuffer || dsResult.hasStackQueueConstant) && dominantSpace.complexity === "O(1)") {
            const reason = dsResult.hasStackQueueConstant && !dsResult.hasFixedBuffer ? dsResult.stackQueueBreakdowns && dsResult.stackQueueBreakdowns.find((b) => b.includes("O(1)")) || "Auxiliary container maintains at most O(1) simultaneously stored elements." : "Fixed-size auxiliary lookup table / buffer allocated independent of input size requires O(1) space.";
            dominantSpace = SpaceExpression.constant(reason);
            primaryReason = dominantSpace.reason;
          }
        }
      }
      if (recursionResult && recursionResult.hasRecursion && recursionResult.stackSpace && (!graphResult || !graphResult.hasGraphPattern)) {
        const stackStr = typeof recursionResult.stackSpace === "string" ? recursionResult.stackSpace : recursionResult.stackSpace.format();
        const currentStr = dominantSpace.format();
        const combined = maxComplexity(currentStr, stackStr);
        if (combined !== currentStr) {
          dominantSpace = new SpaceExpression(
            combined,
            `Call stack execution frames require ${combined} auxiliary stack space.`
          );
          primaryReason = dominantSpace.reason;
        }
      }
      const confidence = dsResult && dsResult.hasHeuristicBounds ? CONFIDENCE_LEVELS.MEDIUM : CONFIDENCE_LEVELS.HIGH;
      return {
        complexity: dominantSpace.format(),
        expression: dominantSpace,
        confidence,
        reason: primaryReason
      };
    }
  };

  // src/engine/synthesis/confidenceEngine.js
  var ConfidenceEngine = class {
    /**
     * Evaluates overall confidence level and compiles assumptions list
     */
    static evaluate({
      hasSyntaxErrors = false,
      hasUnknownComplexity = false,
      hasHeuristicBounds = false,
      patterns = [],
      language = "C++"
    }) {
      const assumptions = [];
      if (patterns.includes("graph") || patterns.includes("bfs") || patterns.includes("dfs")) {
        assumptions.push("Assumption: V and E denote the number of graph vertices and edges respectively.");
      } else {
        assumptions.push("Assumption: n denotes the primary input size or element collection length.");
      }
      if (patterns.includes("hash-map") || patterns.includes("hash-set")) {
        assumptions.push("Assumption: Hash table insertions and lookups operate with expected O(1) amortized time without degenerate hash collisions.");
      }
      if (patterns.includes("sorting")) {
        assumptions.push("Assumption: Standard sorting utilizes comparison-based sorting with O(n log n) average time.");
      }
      if (hasSyntaxErrors || hasUnknownComplexity) {
        return {
          confidence: CONFIDENCE_LEVELS.LOW,
          assumptions
        };
      }
      if (hasHeuristicBounds) {
        return {
          confidence: CONFIDENCE_LEVELS.MEDIUM,
          assumptions
        };
      }
      return {
        confidence: CONFIDENCE_LEVELS.HIGH,
        assumptions
      };
    }
  };

  // src/engine/optimization/optimizationEngine.js
  var OptimizationEngine = class {
    static generateSuggestions({
      timeComplexity,
      spaceComplexity,
      loopResult,
      recursionResult,
      sortingResult,
      dsResult,
      graphResult,
      backtrackingResult
    }) {
      const suggestions = [];
      if (loopResult && loopResult.maxNestingDepth >= 2 && (!dsResult || !dsResult.hasHashMap) && (timeComplexity === COMPLEXITY_CLASSES.O_N2 || timeComplexity === "O(n\xB2)")) {
        suggestions.push(
          "Nested loop search detected (O(n\xB2)). Consider using a hash map or hash set to reduce lookup from O(n) to expected O(1), achieving O(n) total time."
        );
      }
      if (recursionResult && recursionResult.hasRecursion && (timeComplexity.includes("^n") || timeComplexity === COMPLEXITY_CLASSES.O_2N)) {
        suggestions.push(
          "Branching recursive calls without caching detected (exponential complexity). Consider memoization (top-down) or tabulation (bottom-up DP) to store subproblem solutions in O(n) time."
        );
      }
      if (sortingResult && sortingResult.isInsideLoop) {
        suggestions.push(
          "Sorting operation detected inside an iteration loop. Consider sorting the collection once upfront before iterating, or using a min/max heap (priority queue)."
        );
      }
      if (timeComplexity === COMPLEXITY_CLASSES.O_N_FACT || backtrackingResult && backtrackingResult.isPermutation) {
        suggestions.push(
          "Factorial permutation search space detected (O(n!)). Consider pruning unnecessary search paths early using constraints or bitmasks."
        );
      }
      if (dsResult && dsResult.hasHashMap && loopResult && loopResult.maxNestingDepth === 1 && (timeComplexity === COMPLEXITY_CLASSES.O_N || timeComplexity === "O(n)")) {
        suggestions.push(
          "Optimal hash map lookup pattern detected \u2014 achieves linear O(n) time and O(n) space. Asymptotically optimal."
        );
      }
      if (loopResult && loopResult.patterns.includes("binary-search") || timeComplexity === COMPLEXITY_CLASSES.O_LOG_N || timeComplexity === "O(log n)") {
        suggestions.push(
          "Optimal logarithmic interval search pattern \u2014 halving the remaining search space guarantees O(log n) time."
        );
      }
      if (graphResult && graphResult.hasGraphPattern) {
        suggestions.push(
          "Standard graph traversal detected. Ensure visited states are tracked to prevent redundant edge/vertex cycles."
        );
      }
      if (suggestions.length === 0) {
        suggestions.push(
          "No obvious asymptotic bottleneck detected \u2014 current algorithmic structure appears optimal for this pattern."
        );
      }
      return suggestions;
    }
  };

  // src/engine/ComplexityEngine.js
  var ComplexityEngine = class {
    static analyze(code, language = "C++") {
      const t0 = performance.now();
      if (!code || !code.trim()) {
        return {
          success: false,
          language,
          time: {
            complexity: "\u2014",
            confidence: CONFIDENCE_LEVELS.LOW,
            reason: "No code in editor.",
            bestCase: "\u2014",
            averageCase: "\u2014",
            worstCase: "\u2014"
          },
          space: {
            complexity: "\u2014",
            confidence: CONFIDENCE_LEVELS.LOW,
            reason: "No code in editor."
          },
          timeComplexity: "\u2014",
          spaceComplexity: "\u2014",
          confidence: CONFIDENCE_LEVELS.LOW,
          patterns: [],
          breakdowns: ["Editor is empty or awaiting input."],
          assumptions: [],
          suggestions: ["Type or paste code into the editor to run static analysis."],
          notes: ["Editor is empty or awaiting input."],
          tips: ["Type or paste code into the editor to run static analysis."],
          analysisTimeMs: 0
        };
      }
      const parser = ParserFactory.getParser(language);
      const parseResult = parser.parse(code);
      const ast = parseResult.root;
      const dpResult = DpAnalyzer.analyze(ast);
      const graphResult = GraphAnalyzer.analyze(ast);
      const loopResult = LoopAnalyzer.analyze(ast);
      const recursionResult = RecursionAnalyzer.analyze(ast, dpResult, graphResult);
      const sortingResult = SortingAnalyzer.analyze(ast);
      const searchingResult = SearchingAnalyzer.analyze(ast);
      const backtrackingResult = BacktrackingAnalyzer.analyze(ast);
      const dsResult = DataStructureAnalyzer.analyze(ast);
      const functionCallResult = FunctionCallAnalyzer.analyze(ast);
      const timeRes = TimeComplexitySynthesizer.synthesize({
        loopResult,
        recursionResult,
        sortingResult,
        searchingResult,
        graphResult,
        backtrackingResult,
        dpResult,
        functionCallResult
      });
      const spaceRes = SpaceComplexitySynthesizer.synthesize({
        dsResult,
        recursionResult,
        graphResult,
        backtrackingResult
      });
      const patterns = Array.from(
        /* @__PURE__ */ new Set([
          ...loopResult.patterns,
          ...recursionResult.patterns,
          ...sortingResult.patterns,
          ...searchingResult.patterns,
          ...graphResult.patterns,
          ...backtrackingResult.patterns,
          ...dpResult.patterns,
          ...dsResult.patterns
        ])
      );
      const breakdowns = Array.from(
        /* @__PURE__ */ new Set([
          ...loopResult.breakdowns,
          ...recursionResult.breakdowns,
          ...sortingResult.breakdowns,
          ...searchingResult.breakdowns,
          ...graphResult.breakdowns,
          ...backtrackingResult.breakdowns,
          ...dpResult.breakdowns,
          ...dsResult.breakdowns
        ])
      );
      const confidenceReport = ConfidenceEngine.evaluate({
        hasSyntaxErrors: !parseResult.success,
        hasUnknownComplexity: timeRes.complexity === "Unknown",
        hasHeuristicBounds: false,
        patterns,
        language: parser.language
      });
      const suggestions = OptimizationEngine.generateSuggestions({
        timeComplexity: timeRes.complexity,
        spaceComplexity: spaceRes.complexity,
        loopResult,
        recursionResult,
        sortingResult,
        dsResult,
        graphResult,
        backtrackingResult
      });
      const t1 = performance.now();
      let elapsed = t1 - t0;
      if (elapsed <= 0.08 && code.trim().length > 0) {
        const runs = 5;
        const bt0 = performance.now();
        for (let i = 0; i < runs; i++) {
          parser.parse(code);
        }
        elapsed = (performance.now() - bt0) / runs;
      }
      const analysisTimeMs = Number(Math.max(0.1, elapsed).toFixed(2));
      return {
        success: true,
        language: parser.language,
        time: {
          complexity: timeRes.complexity,
          confidence: confidenceReport.confidence,
          reason: timeRes.reason,
          bestCase: timeRes.bestCase,
          averageCase: timeRes.averageCase,
          worstCase: timeRes.worstCase
        },
        space: {
          complexity: spaceRes.complexity,
          confidence: confidenceReport.confidence,
          reason: spaceRes.reason
        },
        patterns,
        breakdowns,
        assumptions: confidenceReport.assumptions,
        suggestions,
        analysisTimeMs,
        // Backwards-compatibility aliases
        timeComplexity: timeRes.complexity,
        spaceComplexity: spaceRes.complexity,
        confidence: confidenceReport.confidence,
        notes: breakdowns,
        tips: suggestions
      };
    }
  };

  // src/content/languageDetector.js
  var LanguageDetector = class {
    static detectLanguageFromSyntax(code) {
      if (!code || typeof code !== "string") return LANGUAGES.UNKNOWN;
      let cppScore = 0;
      let pyScore = 0;
      let javaScore = 0;
      let jsScore = 0;
      if (/^\s*(def\s+\w+|class\s+\w+(\([^)]*\))?)\s*:/m.test(code)) pyScore += 12;
      if (/\bdef\s+[A-Za-z_]\w*\s*\(/.test(code)) pyScore += 9;
      if (/\bself\b/.test(code)) pyScore += 6;
      if (/\b(elif|None|True|False)\b/.test(code)) pyScore += 7;
      if (/^\s*(import\s+\w+|from\s+\w+\s+import)/m.test(code)) pyScore += 7;
      if (/class\s+Solution\s*\{[\s\S]*?public\s*:/.test(code)) cppScore += 15;
      if (/#include\s*<[a-z_]+>/i.test(code)) cppScore += 12;
      if (/\b(?:std::)?(vector|unordered_map|unordered_set|priority_queue|stack|queue|deque)\s*</.test(code)) cppScore += 12;
      if (/\bstd::|\bcout\s*<<|\bcin\s*>>|\bnullptr\b/.test(code)) cppScore += 10;
      if (/\b(int|void|bool|double|char|long\s+long)\s+[A-Za-z_]\w*\s*\([^)]*\)\s*\{/.test(code)) cppScore += 7;
      if (/\bpublic\s+(static\s+)?(final\s+)?class\b/.test(code)) javaScore += 12;
      if (/\bSystem\.out\.(println|print)\b/.test(code)) javaScore += 12;
      if (/\bnew\s+(int\[|String\[|ArrayList|HashMap|HashSet)/.test(code)) javaScore += 9;
      if (/\b(const|let|var)\s+[A-Za-z_]\w*\s*=/.test(code)) jsScore += 8;
      if (/\bfunction\s*\([A-Za-z_,\s]*\)\s*\{|\bfunction\s+[A-Za-z_]\w*\s*\(/.test(code)) jsScore += 8;
      if (/=>\s*\{|=>\s*[A-Za-z0-9_]/.test(code)) jsScore += 7;
      if (/\bconsole\.(log|error|warn)\b/.test(code)) jsScore += 9;
      const braceCount = (code.match(/\{|\}/g) || []).length;
      const semiCount = (code.match(/;\s*$/gm) || []).length;
      if (braceCount >= 2 && semiCount >= 2) {
        pyScore -= 20;
      }
      const scores = [
        { lang: LANGUAGES.PYTHON, score: pyScore },
        { lang: LANGUAGES.CPP, score: cppScore },
        { lang: LANGUAGES.JAVA, score: javaScore },
        { lang: LANGUAGES.JAVASCRIPT, score: jsScore }
      ];
      scores.sort((a, b) => b.score - a.score);
      if (scores[0].score > 0) return scores[0].lang;
      return LANGUAGES.UNKNOWN;
    }
    static normalize(raw) {
      if (!raw || typeof raw !== "string") return null;
      const s = raw.trim().toLowerCase();
      if (s.includes("c++") || s === "cpp" || s === "cplusplus" || s === "c_cpp" || s === "c" || s.startsWith("c ")) {
        return LANGUAGES.CPP;
      }
      if (s.includes("python") || s === "py" || s === "python3") {
        return LANGUAGES.PYTHON;
      }
      if (s.includes("java") && !s.includes("javascript")) {
        return LANGUAGES.JAVA;
      }
      if (s.includes("javascript") || s.includes("typescript") || s === "js" || s === "ts") {
        return LANGUAGES.JAVASCRIPT;
      }
      return null;
    }
    static detect(adapter, code, explicitHint = null) {
      if (explicitHint) {
        const norm = this.normalize(explicitHint);
        if (norm) return norm;
      }
      const syntaxLang = this.detectLanguageFromSyntax(code);
      if (syntaxLang !== LANGUAGES.UNKNOWN) {
        return syntaxLang;
      }
      if (adapter) {
        const adapterLang = adapter.getLanguage();
        if (adapterLang) {
          const norm = this.normalize(adapterLang);
          if (norm) return norm;
        }
      }
      return LANGUAGES.CPP;
    }
  };

  // src/analyzer/Analyzer.js
  var Analyzer = class {
    static detectLanguageFromSyntax(code) {
      return LanguageDetector.detectLanguageFromSyntax(code);
    }
    static normalizeExplicitLanguage(raw) {
      return LanguageDetector.normalize(raw);
    }
    static analyze(code, explicitLanguage = null, isManual = false) {
      if (!code || !code.trim()) {
        return {
          success: false,
          time: { complexity: "\u2014", confidence: CONFIDENCE_LEVELS.LOW, reason: "No code in editor." },
          space: { complexity: "\u2014", confidence: CONFIDENCE_LEVELS.LOW, reason: "No code in editor." },
          timeComplexity: "\u2014",
          spaceComplexity: "\u2014",
          confidence: CONFIDENCE_LEVELS.LOW,
          patterns: [],
          breakdowns: ["Code is currently incomplete or editor is empty."],
          suggestions: ["Write or paste solution code in the editor to see real-time complexity analysis."],
          analysisTimeMs: 0,
          language: explicitLanguage || "C++",
          notes: ["Code is currently incomplete or editor is empty."],
          tips: ["Write or paste solution code in the editor to see real-time complexity analysis."]
        };
      }
      const normExplicit = this.normalizeExplicitLanguage(explicitLanguage);
      const syntaxLang = this.detectLanguageFromSyntax(code);
      let resolvedLang;
      if (isManual && normExplicit) {
        resolvedLang = normExplicit;
      } else if (syntaxLang !== "Unknown") {
        resolvedLang = syntaxLang;
      } else if (normExplicit) {
        resolvedLang = normExplicit;
      } else {
        resolvedLang = "C++";
      }
      try {
        const res = ComplexityEngine.analyze(code, resolvedLang);
        return {
          ...res,
          timeComplexity: res.time.complexity,
          spaceComplexity: res.space.complexity,
          confidence: res.time.confidence,
          notes: res.breakdowns,
          tips: res.suggestions
        };
      } catch (err) {
        return {
          success: false,
          time: { complexity: "\u2014", confidence: CONFIDENCE_LEVELS.LOW, reason: err.message },
          space: { complexity: "\u2014", confidence: CONFIDENCE_LEVELS.LOW, reason: err.message },
          timeComplexity: "\u2014",
          spaceComplexity: "\u2014",
          confidence: CONFIDENCE_LEVELS.LOW,
          patterns: [],
          breakdowns: ["Waiting for valid code syntax..."],
          suggestions: ["Ensure solution compiles or has complete statement blocks."],
          analysisTimeMs: 0,
          language: resolvedLang,
          notes: ["Waiting for valid code syntax..."],
          tips: ["Ensure solution compiles or has complete statement blocks."],
          error: true
        };
      }
    }
  };
  return __toCommonJS(Analyzer_exports);
})();

if (typeof window !== 'undefined') {
  window.Codelexity = CodelexityModule.Analyzer;
  window.BigOLens = CodelexityModule.Analyzer;
}
if (typeof globalThis !== 'undefined') {
  globalThis.Codelexity = CodelexityModule.Analyzer;
  globalThis.BigOLens = CodelexityModule.Analyzer;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodelexityModule.Analyzer;
}

