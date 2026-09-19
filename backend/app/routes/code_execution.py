from fastapi import APIRouter, HTTPException
from app.models.code_execution import CodeRunRequest, CodeRunResponse
from app.services.code_execution import CodeExecutionService

router = APIRouter(prefix="/api", tags=["code-execution"])


@router.post("/run-code", response_model=CodeRunResponse)
async def run_code(payload: CodeRunRequest):
    """
    Execute code and run test cases.

    Supports Python and SQL execution with comprehensive error handling.
    """
    try:
        language = payload.language.lower()

        if language == "sql":
            results, logs = CodeExecutionService.execute_sql(
                code=payload.code,
                schema_sql=payload.schema_sql,
                test_cases=payload.test_cases
            )
        elif language == "python":
            results, logs = CodeExecutionService.execute_python(
                code=payload.code,
                function_name=payload.function_name,
                test_cases=payload.test_cases
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported language: {language}. Supported languages: python, sql"
            )

        # Calculate summary
        passed_count = sum(1 for r in results if r.passed)
        total_count = len(results)

        summary = {
            "passed": passed_count,
            "total": total_count,
            "allPassed": passed_count == total_count and total_count > 0
        }

        return CodeRunResponse(
            results=results,
            logs=logs,
            summary=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Code execution failed: {str(e)}"
        )


@router.post("/run-python", response_model=CodeRunResponse)
async def run_python_code(payload: CodeRunRequest):
    """Execute Python code specifically."""
    if payload.language.lower() != "python":
        raise HTTPException(
            status_code=400,
            detail="This endpoint only supports Python code"
        )

    try:
        results, logs = CodeExecutionService.execute_python(
            code=payload.code,
            function_name=payload.function_name,
            test_cases=payload.test_cases
        )

        passed_count = sum(1 for r in results if r.passed)
        total_count = len(results)

        summary = {
            "passed": passed_count,
            "total": total_count,
            "allPassed": passed_count == total_count and total_count > 0
        }

        return CodeRunResponse(
            results=results,
            logs=logs,
            summary=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Python execution failed: {str(e)}"
        )


@router.post("/run-sql", response_model=CodeRunResponse)
async def run_sql_code(payload: CodeRunRequest):
    """Execute SQL code specifically."""
    if payload.language.lower() != "sql":
        raise HTTPException(
            status_code=400,
            detail="This endpoint only supports SQL code"
        )

    try:
        results, logs = CodeExecutionService.execute_sql(
            code=payload.code,
            schema_sql=payload.schema_sql,
            test_cases=payload.test_cases
        )

        passed_count = sum(1 for r in results if r.passed)
        total_count = len(results)

        summary = {
            "passed": passed_count,
            "total": total_count,
            "allPassed": passed_count == total_count and total_count > 0
        }

        return CodeRunResponse(
            results=results,
            logs=logs,
            summary=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"SQL execution failed: {str(e)}"
        )
