from pydantic import BaseModel
from typing import List, Optional, Any


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


class TestResult(BaseModel):
    input: str
    expected: Any
    actual: Any = None
    passed: bool
    error: Optional[str] = None


class CodeRunResponse(BaseModel):
    results: List[TestResult]
    logs: List[str]
    summary: dict
