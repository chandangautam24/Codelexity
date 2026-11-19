/**
 * Codelexity — Comprehensive Automated Test Suite & SRS Verification Report
 * Validates compliance with Codelexity Software Requirements Specification (SRS v1.0)
 */

const fs = require('fs');
const path = require('path');

// Load analysis engine
const analyzerCode = fs.readFileSync(path.join(__dirname, 'analyzer.js'), 'utf8');
eval(analyzerCode);

console.log("=================================================================");
console.log("    CODELEXITY — AUTOMATED SRS TEST REPORT (v1.0.0)");
console.log("=================================================================\n");

let totalTests = 0;
let passedTests = 0;

function runTest(category, name, code, explicitLang, expected) {
  totalTests++;
  const t0 = process.hrtime.bigint();
  const res = Codelexity.analyze(code, explicitLang);
  const t1 = process.hrtime.bigint();
  const elapsedMs = Number(t1 - t0) / 1e6;

  const actualTime = typeof res.time === 'object' ? res.time?.complexity : (res.timeComplexity || res.time);
  const actualSpace = typeof res.space === 'object' ? res.space?.complexity : (res.spaceComplexity || res.space);

  const norm = (s) => (s ? String(s).replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\s+/g, ' ').trim() : s);

  const langMatch = !expected.language || res.language === expected.language;
  const timeMatch = !expected.time || norm(actualTime) === norm(expected.time);
  const spaceMatch = !expected.space || norm(actualSpace) === norm(expected.space);
  const passed = langMatch && timeMatch && spaceMatch;

  if (passed) passedTests++;

  console.log(`${passed ? "  [PASS] ✅" : "  [FAIL] ❌"} ${category}: ${name} (${elapsedMs.toFixed(2)} ms)`);
  if (!passed) {
    console.log(`         Expected -> Lang: ${expected.language || "N/A"}, Time: ${expected.time || "N/A"}, Space: ${expected.space || "N/A"}`);
    console.log(`         Actual   -> Lang: ${res.language}, Time: ${actualTime}, Space: ${actualSpace}`);
  }
}

// -------------------------------------------------------------
// PART 1: SRS SECTION 13 TESTING REQUIREMENTS (Mandatory Tests)
// -------------------------------------------------------------
console.log("--- PART 1: SRS SECTION 13 MANDATORY TEST CASES ---");

runTest("SRS-13.1", "Constant Time Statement",
  "int x = 10; cout << x;", "C++",
  { time: "O(1)", space: "O(1)", language: "C++" });

runTest("SRS-13.2", "Linear Single Loop",
  "for(int i = 0; i < n; i++) cout << i;", "C++",
  { time: "O(n)", space: "O(1)", language: "C++" });

runTest("SRS-13.3", "Two Nested Loops",
  "for(int i = 0; i < n; i++) { for(int j = 0; j < n; j++) { cout << i << j; } }", "C++",
  { time: "O(n^2)", space: "O(1)", language: "C++" });

runTest("SRS-13.4", "Standard Sorting Operation",
  "sort(arr.begin(), arr.end());", "C++",
  { time: "O(n log n)", space: "O(1)", language: "C++" });

runTest("SRS-13.5", "Linear Recursion Depth",
  "void solve(int n) { if(n <= 0) return; solve(n - 1); }", "C++",
  { time: "O(n)", space: "O(n)", language: "C++" });


// -------------------------------------------------------------
// PART 2: FR-03 LANGUAGE DETECTION (Automatic Identification)
// -------------------------------------------------------------
console.log("\n--- PART 2: FR-03 LANGUAGE DETECTION (Auto-detection) ---");

runTest("FR-03.1", "C++ Two Sum (LeetCode Solution)",
`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) return {map[complement], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`, null,
  { language: "C++", time: "O(n)", space: "O(n)" });

runTest("FR-03.2", "Python Two Sum (LeetCode Solution)",
`class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []`, null,
  { language: "Python", time: "O(n)", space: "O(n)" });

runTest("FR-03.3", "Java Two Sum (LeetCode Solution)",
`class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[] { map.get(complement), i };
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`, null,
  { language: "Java", time: "O(n)", space: "O(n)" });

runTest("FR-03.4", "JavaScript Two Sum (LeetCode Solution)",
`var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
};`, null,
  { language: "JavaScript", time: "O(n)", space: "O(n)" });

runTest("FR-03.5", "Strict 'C' to 'C++' Normalization",
  "int x = 10; vector<int> v;", "C",
  { language: "C++", time: "O(1)", space: "O(n)" });

runTest("FR-03.6", "C++ Syntax Overrides Stale 'Python' Platform Dropdown",
`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        return {};
    }
};`, "Python",
  { language: "C++", time: "O(1)", space: "O(n)" });


// -------------------------------------------------------------
// PART 3: ADVANCED ALGORITHMIC PATTERNS & COMPLEXITY CLASSES
// -------------------------------------------------------------
console.log("\n--- PART 3: ADVANCED ALGORITHMIC PATTERNS & COMPLEXITY CLASSES ---");

runTest("FR-10.1", "Binary Search (O(log n) Time, O(1) Space)",
`class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
};`, "C++",
  { time: "O(log n)", space: "O(1)" });

runTest("FR-10.2", "Branching Binary Recursion - Fibonacci (O(2^n) Time)",
`class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        return self.fib(n - 1) + self.fib(n - 2)`, "Python",
  { time: "O(2^n)", space: "O(n)" });

runTest("FR-10.3", "Three Nested Loops (Cubic O(n^3) Time)",
`void tripleLoop(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                cout << i + j + k;
            }
        }
    }
}`, "C++",
  { time: "O(n^3)", space: "O(1)" });

runTest("FR-11.1", "2D Dynamic Programming Table (O(n^2) Space)",
`int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    return dp[m-1][n-1];
}`, "C++",
  { space: "O(n^2)" });

runTest("FR-10.4", "Permutations / Backtracking (O(n!) Time)",
`void backtrack(vector<int>& nums, int start) {
    if (start == nums.size()) return;
    for (int i = start; i < nums.size(); i++) {
        swap(nums[start], nums[i]);
        backtrack(nums, start + 1);
        swap(nums[start], nums[i]);
    }
}`, "C++",
  { time: "O(n!)" });


// -------------------------------------------------------------
// SUMMARY REPORT
// -------------------------------------------------------------
console.log("\n=================================================================");
console.log(`    FINAL RESULT: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log("=================================================================");

if (passedTests === totalTests) {
  console.log("✅ ALL REQUIREMENTS FROM SRS (v1.0) SUCCESSFULLY SATISFIED!");
  process.exit(0);
} else {
  console.error("❌ SOME TESTS FAILED.");
  process.exit(1);
}
