import sys
import io
import sqlite3
import traceback
from typing import List, Optional, Any
from app.models.code_execution import TestCase, TestResult


class CodeExecutionService:
    """Service for executing code safely and returning results."""

    @staticmethod
    def execute_python(
        code: str,
        function_name: Optional[str] = None,
        test_cases: List[TestCase] = []
    ) -> tuple[List[TestResult], List[str]]:
        """Execute Python code and run test cases."""
        results = []
        logs = []

        # Create a restricted execution environment
        sandbox_scope = {
            '__builtins__': {
                'print': print,
                'len': len,
                'range': range,
                'int': int,
                'float': float,
                'str': str,
                'list': list,
                'dict': dict,
                'set': set,
                'tuple': tuple,
                'bool': bool,
                'abs': abs,
                'min': min,
                'max': max,
                'sum': sum,
                'sorted': sorted,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'any': any,
                'all': all,
            }
        }

        # Capture stdout
        old_stdout = sys.stdout
        redirected_output = sys.stdout = io.StringIO()

        try:
            # Execute the user's code
            exec(code, sandbox_scope)
            user_stdout = redirected_output.getvalue()
            if user_stdout:
                logs.append(user_stdout.strip())

        except Exception as e:
            sys.stdout = old_stdout
            error_msg = f"{type(e).__name__}: {str(e)}"
            error_traceback = traceback.format_exc()
            logs.append(error_msg)
            logs.append(error_traceback)

            # Return failed results for all test cases
            for tc in test_cases:
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=None,
                    passed=False,
                    error=error_msg
                ))
            return results, logs

        finally:
            sys.stdout = old_stdout

        # Get the function to test
        fn = sandbox_scope.get(function_name) if function_name else None

        # Run test cases
        for tc in test_cases:
            if not fn or not callable(fn):
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=None,
                    passed=False,
                    error=f"Function '{function_name}' was not defined"
                ))
                continue

            try:
                args = tc.args if tc.args is not None else []
                actual = fn(*args)
                passed = actual == tc.expected
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=actual,
                    passed=passed,
                    error=None
                ))
            except Exception as err:
                error_msg = f"{type(err).__name__}: {str(err)}"
                error_traceback = traceback.format_exc()
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=None,
                    passed=False,
                    error=error_msg
                ))
                logs.append(f"Test case failed: {error_msg}")
                logs.append(error_traceback)

        return results, logs

    @staticmethod
    def execute_sql(
        code: str,
        schema_sql: Optional[str] = None,
        test_cases: List[TestCase] = []
    ) -> tuple[List[TestResult], List[str]]:
        """Execute SQL code and run test cases."""
        results = []
        logs = []

        # Create in-memory database
        conn = sqlite3.connect(":memory:")
        cursor = conn.cursor()

        try:
            # Set up schema if provided
            if schema_sql:
                cursor.executescript(schema_sql)
                conn.commit()
                logs.append("Database schema created successfully.")

            # Execute the user's SQL query
            cursor.execute(code)
            raw_rows = cursor.fetchall()
            actual_rows = [list(row) for row in raw_rows]
            logs.append(f"Query returned {len(actual_rows)} rows.")

            # Run test cases
            for tc in test_cases:
                passed = (actual_rows == tc.expected) or (str(actual_rows) == str(tc.expected))
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=actual_rows,
                    passed=passed,
                    error=None
                ))

        except Exception as e:
            error_msg = f"{type(e).__name__}: {str(e)}"
            error_traceback = traceback.format_exc()
            logs.append(error_msg)
            logs.append(error_traceback)

            # Return failed results for all test cases
            for tc in test_cases:
                results.append(TestResult(
                    input=tc.input,
                    expected=tc.expected,
                    actual=None,
                    passed=False,
                    error=error_msg
                ))

        finally:
            conn.close()

        return results, logs
