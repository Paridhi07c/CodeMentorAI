const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const cloneArgs = (args) => {
  try {
    return structuredClone(args)
  } catch {
    return JSON.parse(JSON.stringify(args))
  }
}

const listToLinkedList = (arr) => {
  if (!arr || arr.length === 0) return null
  const head = { val: arr[0], next: null }
  let current = head
  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null }
    current = current.next
  }
  return head
}

const linkedListToArray = (head) => {
  const result = []
  let node = head
  while (node) {
    result.push(node.val)
    node = node.next
  }
  return result
}

function runJavaScript(problem, code) {
  const logs = []
  const results = []
  const startTime = performance.now()

  try {
    const fn = new Function(`
      ${code}
      if (typeof ${problem.functionName} !== 'function') {
        throw new Error('Function "${problem.functionName}" not found. Make sure it is defined.');
      }
      return ${problem.functionName};
    `)()

    for (const testCase of problem.testCases) {
      if (!testCase.args) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: 'No executable args for this test',
        })
        continue
      }

      try {
        let actual

        if (problem.id === 'reverse-linked-list') {
          const freshArgs = cloneArgs(testCase.args)
          const args = freshArgs.map(arg => {
            if (arg && typeof arg === 'object' && 'val' in arg) {
              const arr = linkedListToArray(arg)
              return listToLinkedList(arr)
            }
            return arg
          })
          const result = fn(...args)
          actual = linkedListToArray(result)
          const inputArr = linkedListToArray(testCase.args[0])
          const expected = [...inputArr].reverse()
          const passed = deepEqual(actual, expected)
          results.push({ input: testCase.input, expected, actual, passed, error: null })
        } else {
          const safeArgs = cloneArgs(testCase.args)
          actual = fn(...safeArgs)
          const passed = deepEqual(actual, testCase.expected)
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual,
            passed,
            error: null,
          })
        }
      } catch (err) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: err.message,
        })
      }
    }
  } catch (err) {
    logs.push(`Error: ${err.message}`)
    for (const testCase of problem.testCases) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        passed: false,
        error: err.message,
      })
    }
  }

  const executionTime = (performance.now() - startTime).toFixed(1)
  const passed = results.filter(r => r.passed).length
  const total = results.length

  return {
    results,
    logs,
    summary: {
      passed,
      total,
      allPassed: passed === total && total > 0,
      runtime: `${executionTime} ms`,
    },
  }
}

async function runPythonBackend(problem, code) {
  const BACKEND_URL = 'http://localhost:8000/api'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  const startTime = performance.now()

  try {
    const response = await fetch(`${BACKEND_URL}/run-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        code: code,
        language: 'python',
        function_name: problem.functionName || 'two_sum',
        test_cases: (problem.testCases || []).map(tc => ({
          input: String(tc.input ?? ''),
          expected: tc.expected,
          args: tc.args || [],
        })),
      }),
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Server returned status ${response.status}`)
    }

    const data = await response.json()
    const duration = (performance.now() - startTime).toFixed(0)
    if (data.summary) {
      data.summary.runtime = `${duration} ms`
    }
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    const duration = (performance.now() - startTime).toFixed(0)
    return {
      results: (problem.testCases || []).map(tc => ({
        input: String(tc.input ?? ''),
        expected: tc.expected,
        actual: null,
        passed: false,
        error: error.name === 'AbortError'
          ? 'Execution timed out (10s limit).'
          : `Server unreachable: ${error.message}`,
      })),
      logs: [`Could not connect to Python runner: ${error.message}`],
      summary: {
        passed: 0,
        total: problem.testCases?.length || 0,
        allPassed: false,
        runtime: `${duration} ms`,
      },
    }
  }
}

async function runSQLBackend(problem, code) {
  const BACKEND_URL = 'http://localhost:8000/api'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  const startTime = performance.now()

  try {
    const response = await fetch(`${BACKEND_URL}/run-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        code: code,
        language: 'sql',
        schema_sql: problem.schemaSql || null,
        test_cases: (problem.testCases || []).map(tc => ({
          input: String(tc.input ?? ''),
          expected: tc.expected,
          args: null,
        })),
      }),
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Server returned status ${response.status}`)
    }

    const data = await response.json()
    const duration = (performance.now() - startTime).toFixed(0)
    if (data.summary) {
      data.summary.runtime = `${duration} ms`
    }
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    const duration = (performance.now() - startTime).toFixed(0)
    return {
      results: (problem.testCases || []).map(tc => ({
        input: String(tc.input ?? ''),
        expected: tc.expected,
        actual: null,
        passed: false,
        error: error.name === 'AbortError'
          ? 'Execution timed out (10s limit).'
          : `SQL runner error: ${error.message}`,
      })),
      logs: [`Backend connection error: ${error.message}`],
      summary: {
        passed: 0,
        total: problem.testCases?.length || 0,
        allPassed: false,
        runtime: `${duration} ms`,
      },
    }
  }
}

export async function runCode(problem, code, language) {
  if (language === 'JavaScript' && problem.functionName) {
    return runJavaScript(problem, code)
  } else if (language === 'Python') {
    return await runPythonBackend(problem, code)
  } else if (language === 'SQL') {
    return await runSQLBackend(problem, code)
  } else {
    return {
      results: (problem.testCases || []).map(tc => ({
        input: String(tc.input ?? ''),
        expected: tc.expected,
        actual: null,
        passed: false,
        error: `Language "${language}" is not supported for this problem`,
      })),
      logs: [`Language "${language}" is not supported for this problem.`],
      summary: {
        passed: 0,
        total: problem.testCases?.length || 0,
        allPassed: false,
        runtime: '0 ms',
      },
    }
  }
}