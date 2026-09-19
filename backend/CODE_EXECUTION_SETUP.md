# Code Execution Setup Documentation

## Backend API Endpoints

### POST /api/run-code
Execute code and run test cases. Supports Python and SQL.

**Request Body:**
```json
{
  "code": "def add(a, b):\n    return a + b",
  "language": "python",
  "function_name": "add",
  "test_cases": [
    {
      "input": "1, 2",
      "expected": 3,
      "args": [1, 2]
    }
  ],
  "schema_sql": null
}
```

**Response:**
```json
{
  "results": [
    {
      "input": "1, 2",
      "expected": 3,
      "actual": 3,
      "passed": true,
      "error": null
    }
  ],
  "logs": [],
  "summary": {
    "passed": 1,
    "total": 1,
    "allPassed": true
  }
}
```

### POST /api/run-python
Python-specific code execution endpoint.

### POST /api/run-sql
SQL-specific code execution endpoint.

## Frontend Integration

The frontend `mockCodeRunner.js` has been updated to call the real backend API for Python and SQL execution:

- **Python**: Calls `/api/run-code` with `language: "python"`
- **SQL**: Calls `/api/run-code` with `language: "sql"` and optional `schema_sql`
- **JavaScript**: Still executes in-browser for security and speed

## Security Features

### Python Execution
- Restricted execution environment with limited built-ins
- Captures stdout and stderr
- Full traceback logging for debugging
- Timeout protection (10 seconds in frontend)

### SQL Execution
- In-memory SQLite database
- Schema isolation per request
- Automatic cleanup after execution
- Full error reporting

## Error Handling

The backend provides detailed error information:
- Runtime errors with full tracebacks
- Function not found errors
- SQL syntax errors
- Execution timeout errors

## Testing

### Test Python Execution
```bash
curl -X POST http://localhost:8000/api/run-python \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def add(a, b):\n    return a + b",
    "language": "python",
    "function_name": "add",
    "test_cases": [{"input": "1, 2", "expected": 3, "args": [1, 2]}]
  }'
```

### Test SQL Execution
```bash
curl -X POST http://localhost:8000/api/run-sql \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SELECT * FROM users",
    "language": "sql",
    "schema_sql": "CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, \"Alice\");",
    "test_cases": []
  }'
```

## File Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app with router registration
│   ├── models/
│   │   ├── __init__.py
│   │   └── code_execution.py      # Pydantic models for API
│   ├── routes/
│   │   ├── __init__.py
│   │   └── code_execution.py      # API route handlers
│   └── services/
│       ├── __init__.py
│       └── code_execution.py      # Business logic for code execution
├── main.py                        # Legacy root file (can be removed)
└── requirements.txt
```

## Running the Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000
Interactive docs at http://localhost:8000/docs
