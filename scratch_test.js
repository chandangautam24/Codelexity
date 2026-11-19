const Analyzer = require('./analyzer.js');

const tests = [
  {
    name: '1. A queue receiving n elements: O(n)',
    code: `void solve(int n) {
      queue<int> q;
      for (int i = 0; i < n; i++) {
        q.push(i);
      }
    }`,
    expectedSpace: 'O(n)'
  },
  {
    name: '2. A stack receiving n elements without popping: O(n)',
    code: `void solve(int n) {
      std::stack<int> s;
      for (int i = 0; i < n; i++) {
        s.push(i);
      }
    }`,
    expectedSpace: 'O(n)'
  },
  {
    name: '3. A stack that pushes and pops once per iteration: O(1) container space',
    code: `void solve(int n) {
      stack<int> s;
      for (int i = 0; i < n; i++) {
        s.push(i);
        s.pop();
      }
    }`,
    expectedSpace: 'O(1)'
  },
  {
    name: '4. A queue that pushes and pops once per iteration: O(1) container space',
    code: `void solve(int n) {
      std::queue<int> q;
      for (int i = 0; i < n; i++) {
        q.push(i);
        q.pop();
      }
    }`,
    expectedSpace: 'O(1)'
  },
  {
    name: '5. A container whose maximum size depends on a nested loop: O(n²)',
    code: `void solve(int n) {
      stack<int> s;
      for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
          s.push(i * j);
        }
      }
    }`,
    expectedSpace: 'O(n²)'
  },
  {
    name: '6. A container declared and populated inside a loop, then destroyed each iteration: O(1)',
    code: `void solve(int n) {
      for (int i = 0; i < n; i++) {
        stack<int> s;
        s.push(i);
      }
    }`,
    expectedSpace: 'O(1)'
  },
  {
    name: '7. Deque pushing and popping once per iteration: O(1)',
    code: `void solve(int n) {
      std::deque<int> dq;
      for (int i = 0; i < n; i++) {
        dq.push_back(i);
        dq.pop_front();
      }
    }`,
    expectedSpace: 'O(1)'
  },
  {
    name: '8. Stack O(1) combined with recursion O(n) call stack: O(n)',
    code: `void solve(int n) {
      stack<int> s;
      s.push(n);
      s.pop();
      if (n <= 0) return;
      solve(n - 1);
    }`,
    expectedSpace: 'O(n)'
  }
];

let allPassed = true;
for (const t of tests) {
  const res = Analyzer.analyze(t.code, 'C++', true);
  const ok = res.space.complexity === t.expectedSpace;
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'}: ${t.name}`);
  console.log(`   Expected: ${t.expectedSpace}, Got: ${res.space.complexity}`);
  console.log(`   Reason: ${res.space.reason}`);
  if (!ok) allPassed = false;
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\nAll regression test checks passed perfectly!');
}
