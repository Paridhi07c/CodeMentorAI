from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import sys
import io
import sqlite3

app = FastAPI(title="CodeMentorAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestCase(BaseModel):
    input: str
    expected: Any
    args: Optional[List[Any]] = None

class CodeRunRequest(BaseModel):
    code: str
    language: str
    function_name: Optional[str] = None
    test_cases: List[TestCase] = []
    schema_sql: Optional[str] = None

@app.get("/")
def read_root():
    return {"status": "CodeMentorAI API is running"}

@app.post("/api/run-python")
def run_python_code(payload: CodeRunRequest):
    results = []
    logs = []

    sandbox_scope = {}
    old_stdout = sys.stdout
    redirected_output = sys.stdout = io.StringIO()

    try:
        exec(payload.code, sandbox_scope)
        user_stdout = redirected_output.getvalue()
        if user_stdout:
            logs.append(user_stdout.strip())
    except Exception as e:
        sys.stdout = old_stdout
        err_msg = f"{type(e).__name__}: {str(e)}"
        logs.append(err_msg)
        for tc in payload.test_cases:
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": None,
                "passed": False,
                "error": err_msg
            })
        return {
            "results": results,
            "logs": logs,
            "summary": {"passed": 0, "total": len(payload.test_cases), "allPassed": False}
        }
    finally:
        sys.stdout = old_stdout

    fn = sandbox_scope.get(payload.function_name) if payload.function_name else None

    for tc in payload.test_cases:
        if not fn or not callable(fn):
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": None,
                "passed": False,
                "error": f"Function '{payload.function_name}' was not defined"
            })
            continue

        try:
            args = tc.args if tc.args is not None else []
            actual = fn(*args)
            passed = actual == tc.expected
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": actual,
                "passed": passed,
                "error": None
            })
        except Exception as err:
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": None,
                "passed": False,
                "error": f"{type(err).__name__}: {str(err)}"
            })

    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)

    return {
        "results": results,
        "logs": logs,
        "summary": {
            "passed": passed_count,
            "total": total_count,
            "allPassed": passed_count == total_count and total_count > 0
        }
    }

@app.post("/api/run-sql")
def run_sql_code(payload: CodeRunRequest):
    results = []
    logs = []

    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    try:
        if payload.schema_sql:
            cursor.executescript(payload.schema_sql)

        cursor.execute(payload.code)
        raw_rows = cursor.fetchall()
        actual_rows = [list(row) for row in raw_rows]
        logs.append(f"Query returned {len(actual_rows)} rows.")

        for tc in payload.test_cases:
            passed = (actual_rows == tc.expected) or (str(actual_rows) == str(tc.expected))
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": actual_rows,
                "passed": passed,
                "error": None
            })
    except Exception as e:
        err_msg = f"{type(e).__name__}: {str(e)}"
        logs.append(err_msg)
        for tc in payload.test_cases:
            results.append({
                "input": tc.input,
                "expected": tc.expected,
                "actual": None,
                "passed": False,
                "error": err_msg
            })
    finally:
        conn.close()

    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)

    return {
        "results": results,
        "logs": logs,
        "summary": {
            "passed": passed_count,
            "total": total_count,
            "allPassed": passed_count == total_count and total_count > 0
        }
    }

@app.post("/api/run-code")
def run_code(payload: CodeRunRequest):
    if payload.language.lower() == "sql":
        return run_sql_code(payload)
    return run_python_code(payload)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)