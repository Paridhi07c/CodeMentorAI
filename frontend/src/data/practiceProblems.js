export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
export const LANGUAGES = ['Python', 'JavaScript', 'SQL']

export const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    language: 'JavaScript',
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists',
    ],
    functionName: 'twoSum',
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: 'nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expected: [1, 2] },
      { input: 'nums = [3, 3], target = 6', args: [[3, 3], 6], expected: [0, 1] },
    ],
    templates: {
      JavaScript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      Python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      SQL: `-- Not applicable for this problem`,
    },
  },
  {
    id: 'two-sum-py',
    title: 'Two Sum',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Given a list of integers and a target value, return the indices of the two numbers that add up to the target.\n\nEach input has exactly one solution.',
    constraints: [
      '2 ≤ len(nums) ≤ 10⁴',
      'Each input has exactly one solution',
    ],
    functionName: 'two_sum',
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: 'nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expected: [1, 2] },
    ],
    templates: {
      Python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      JavaScript: `function twoSum(nums, target) {\n  \n}`,
      SQL: `-- Not applicable`,
    },
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Write a function that returns a list of strings from 1 to n where:\n- Multiples of 3 → "Fizz"\n- Multiples of 5 → "Buzz"\n- Multiples of both → "FizzBuzz"\n- Otherwise → the number as a string',
    constraints: ['1 ≤ n ≤ 100'],
    functionName: 'fizzbuzz',
    testCases: [
      { input: 'n = 5', args: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
      { input: 'n = 3', args: [3], expected: ['1', '2', 'Fizz'] },
    ],
    templates: {
      Python: `def fizzbuzz(n):
    # Write your solution here
    pass`,
      JavaScript: `function fizzbuzz(n) {\n  \n}`,
      SQL: `-- Not applicable`,
    },
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    language: 'JavaScript',
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this in-place with O(1) extra memory.',
    constraints: [
      '1 ≤ s.length ≤ 10⁵',
      's[i] is a printable ASCII character',
    ],
    functionName: 'reverseString',
    testCases: [
      { input: 's = ["h","e","l","l","o"]', args: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: 's = ["H","a","n","a","h"]', args: [['H', 'a', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'a', 'H'] },
    ],
    templates: {
      JavaScript: `function reverseString(s) {
  // Modify s in-place
  // Write your solution here
  
}`,
      Python: `def reverse_string(s):\n    pass`,
      SQL: `-- Not applicable`,
    },
  },
  {
    id: 'select-employees',
    title: 'Select Employee Names',
    difficulty: 'Easy',
    language: 'SQL',
    description: 'Write a SQL query to select the names of all employees who work in the **Engineering** department, ordered alphabetically.',
    constraints: [
      'Table: employees (id, name, department, salary)',
      'Return only the name column',
    ],
    functionName: null,
    schemaSql: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
      INSERT INTO employees (id, name, department, salary) VALUES
        (1, 'Alice', 'Engineering', 80000),
        (2, 'Bob', 'Engineering', 70000),
        (3, 'Charlie', 'HR', 50000),
        (4, 'Carol', 'Engineering', 75000),
        (5, 'David', 'Marketing', 60000);
    `,
    testCases: [
      { 
        input: "department = 'Engineering' ORDER BY name", 
        expected: [['Alice'], ['Bob'], ['Carol']] 
      }
    ],
    templates: {
      SQL: `-- Table: employees (id, name, department, salary)
SELECT name
FROM employees
WHERE department = 'Engineering'
ORDER BY name;`,
      JavaScript: `-- SQL problem`,
      Python: `-- SQL problem`,
    },
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    language: 'JavaScript',
    description: 'Given the head of a singly linked list, reverse the list and return the reversed list.\n\nA linked list node is represented as `{ val, next }`.',
    constraints: [
      'The number of nodes is in the range [0, 5000]',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    functionName: 'reverseList',
    testCases: [
      { input: 'head = [1,2,3,4,5]', args: [{ val: 1, next: { val: 2, next: { val: 3, next: null } } }], expected: 'reversed' },
      { input: 'head = [1,2]', args: [{ val: 1, next: { val: 2, next: null } }], expected: 'reversed' },
    ],
    templates: {
      JavaScript: `function reverseList(head) {
  // Write your solution here
  
}`,
      Python: `def reverse_list(head):\n    pass`,
      SQL: `-- Not applicable`,
    },
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type in the correct order.',
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only',
    ],
    functionName: 'is_valid',
    testCases: [
      { input: 's = "()"', args: ['()'], expected: true },
      { input: 's = "()[]{}"', args: ['()[]{}'], expected: true },
      { input: 's = "(]"', args: ['(]'], expected: false },
    ],
    templates: {
      Python: `def is_valid(s):
    # Write your solution here
    pass`,
      JavaScript: `function isValid(s) {\n  \n}`,
      SQL: `-- Not applicable`,
    },
  },
  {
    id: 'department-averages',
    title: 'Department Salary Averages',
    difficulty: 'Medium',
    language: 'SQL',
    description: 'Write a SQL query to find the average salary for each department, showing departments with an average salary greater than **50000**.',
    constraints: [
      'Table: employees (id, name, department, salary)',
      'Return department and avg_salary columns',
      'Order by avg_salary descending',
    ],
    functionName: null,
    schemaSql: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER
      );
      INSERT INTO employees (id, name, department, salary) VALUES
        (1, 'Alice', 'Engineering', 90000),
        (2, 'Bob', 'Engineering', 60000),
        (3, 'Charlie', 'Sales', 62000),
        (4, 'David', 'HR', 45000);
    `,
    testCases: [
      { 
        input: 'AVG(salary) > 50000 ORDER BY avg_salary DESC', 
        expected: [['Engineering', 75000.0], ['Sales', 62000.0]] 
      }
    ],
    templates: {
      SQL: `-- Table: employees (id, name, department, salary)
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;`,
      JavaScript: `-- SQL problem`,
      Python: `-- SQL problem`,
    },
  },
  {
    id: 'median-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    language: 'JavaScript',
    description: 'Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
    constraints: [
      'nums1.length == m, nums2.length == n',
      '0 ≤ m, n ≤ 1000',
      '1 ≤ m + n ≤ 2000',
    ],
    functionName: 'findMedianSortedArrays',
    testCases: [
      { input: 'nums1 = [1,3], nums2 = [2]', args: [[1, 3], [2]], expected: 2.0 },
      { input: 'nums1 = [1,2], nums2 = [3,4]', args: [[1, 2], [3, 4]], expected: 2.5 },
    ],
    templates: {
      JavaScript: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}`,
      Python: `def find_median_sorted_arrays(nums1, nums2):\n    pass`,
      SQL: `-- Not applicable`,
    },
  },
]

export function getProblemById(id) {
  return PROBLEMS.find(p => p.id === id)
}