from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import code_execution

app = FastAPI(title="CodeMentorAI API", version="1.0.0")

# Configure CORS with both localhost and 127.0.0.1 addresses
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under the /api prefix
app.include_router(code_execution.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to CodeMentorAI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)