const MOCK_RESPONSES = {
  explain: `Great question! Let me break this down step by step.

**What this code does:**
This function uses **recursion** to calculate a value by calling itself with a smaller input until it hits a base case.

**Key concepts:**
1. **Base case** — stops the recursion (prevents infinite loops)
2. **Recursive case** — breaks the problem into a smaller sub-problem
3. **Return value** — combines results as the stack unwinds

Here's a cleaner iterative version:

\`\`\`python
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
\`\`\`

The iterative approach uses **O(n)** time and **O(1)** space — often preferred for production code.`,

  debug: `I found a few issues in your code. Here's my analysis:

**Problem 1: State mutation**
You're modifying state directly instead of using the setter function. In React, always create a new object/array.

**Problem 2: Missing dependency**
Your \`useEffect\` hook is missing \`userId\` in its dependency array, which can cause stale data.

Here's the corrected version:

\`\`\`javascript
useEffect(() => {
  const fetchUser = async () => {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    setUser(data);
  };
  fetchUser();
}, [userId]);
\`\`\`

**Tip:** Enable ESLint's \`react-hooks/exhaustive-deps\` rule to catch these automatically.`,

  python: `Here's a Python script that reads a CSV file and prints summary statistics:

\`\`\`python
import csv
from collections import Counter

def analyze_csv(filepath):
    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Total rows: {len(rows)}")
    if rows:
        columns = rows[0].keys()
        for col in columns:
            values = [row[col] for row in rows if row[col]]
            print(f"  {col}: {len(values)} non-empty values")

if __name__ == "__main__":
    analyze_csv("data.csv")
\`\`\`

**Features:**
- Uses \`csv.DictReader\` for clean column access
- Handles empty values gracefully
- Easy to extend with filtering or aggregation`,

  default: `I'm your AI coding mentor! I can help you with:

- **Explaining code** — break down complex logic step by step
- **Debugging** — find bugs and suggest fixes
- **Writing code** — generate scripts, functions, and boilerplate
- **Best practices** — patterns, performance, and clean code

Feel free to paste a code snippet or describe what you're working on. I'll give you clear, actionable guidance!

\`\`\`javascript
// Example: ask me to explain this
const sum = arr => arr.reduce((a, b) => a + b, 0);
\`\`\`

What would you like to explore?`,
}

export function getMockResponse(prompt) {
  const lower = prompt.toLowerCase()

  if (lower.includes('explain') || lower.includes('what does')) {
    return MOCK_RESPONSES.explain
  }
  if (lower.includes('bug') || lower.includes('debug') || lower.includes('fix') || lower.includes('error')) {
    return MOCK_RESPONSES.debug
  }
  if (lower.includes('python') || lower.includes('script') || lower.includes('write')) {
    return MOCK_RESPONSES.python
  }

  return MOCK_RESPONSES.default
}

export function streamMockResponse(fullText, onChunk, onComplete) {
  let index = 0

  const interval = setInterval(() => {
    const chunkSize = Math.floor(Math.random() * 4) + 2
    index = Math.min(index + chunkSize, fullText.length)
    onChunk(fullText.slice(0, index))

    if (index >= fullText.length) {
      clearInterval(interval)
      onComplete?.()
    }
  }, 30)

  return () => clearInterval(interval)
}
