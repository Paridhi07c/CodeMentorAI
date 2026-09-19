const API_BASE_URL = 'http://localhost:8000/api'

/**
 * Execute code against the backend API
 * @param {Object} params - Execution parameters
 * @param {string} params.code - The code to execute
 * @param {string} params.language - Programming language (python, sql)
 * @param {string} [params.function_name] - Function name to test (for Python)
 * @param {Array} [params.test_cases] - Test cases to run
 * @param {string} [params.schema_sql] - Database schema (for SQL)
 * @returns {Promise<Object>} Execution results
 */
export async function executeCode({
  code,
  language,
  function_name = null,
  test_cases = [],
  schema_sql = null
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/run-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        function_name,
        test_cases,
        schema_sql
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Code execution failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Code execution error:', error)
    throw error
  }
}

/**
 * Execute Python code specifically
 */
export async function executePythonCode(params) {
  return executeCode({ ...params, language: 'python' })
}

/**
 * Execute SQL code specifically
 */
export async function executeSQLCode(params) {
  return executeCode({ ...params, language: 'sql' })
}
