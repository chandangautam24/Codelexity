(() => {
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

  // src/shared/messages.js
  var MESSAGE_TYPES = Object.freeze({
    GET_LAST_ANALYSIS: "CODELEXITY_GET_LAST_ANALYSIS",
    SAVE_ANALYSIS: "CODELEXITY_SAVE_ANALYSIS",
    GET_SETTINGS: "CODELEXITY_GET_SETTINGS",
    SET_SETTINGS: "CODELEXITY_SET_SETTINGS",
    PING: "CODELEXITY_PING"
  });

  // src/background/serviceWorker.js
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      chrome.storage.local.set({
        settings: DEFAULT_SETTINGS,
        installedAt: Date.now()
      });
    }
  });
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.type === MESSAGE_TYPES.GET_LAST_ANALYSIS) {
      chrome.storage.local.get("lastAnalysis", ({ lastAnalysis }) => {
        sendResponse(lastAnalysis || null);
      });
      return true;
    }
  });
})();
