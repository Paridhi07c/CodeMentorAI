const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3.6-flash';

export async function streamGeminiChat(messages, onChunk, onDone, onError) {
  if (!GEMINI_API_KEY) {
    onError(new Error('VITE_GEMINI_API_KEY is not configured in your .env file'));
    return () => {};
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{
              text: 'You are CodeMentorAI, an empathetic, highly technical programming tutor. Provide direct answers, actionable explanations, step-by-step code snippets in Markdown, and encourage best practices.'
            }]
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (!jsonStr) continue;
            try {
              const data = JSON.parse(jsonStr);
              const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (textChunk) {
                accumulatedText += textChunk;
                onChunk(accumulatedText);
              }
            } catch {
              // Ignore partial JSON parse chunks
            }
          }
        }
      }

      onDone(accumulatedText);
    } catch (err) {
      if (err.name !== 'AbortError') {
        onError(err);
      }
    }
  })();

  return () => controller.abort();
}

export async function getPracticeHint({ problem, code, language, error, testResults }) {
  if (!GEMINI_API_KEY) {
    return 'Gemini API key is not configured in your .env file.';
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
You are a supportive, insightful coding mentor helping a student solve a problem.

Problem: ${problem?.title || 'Practice Problem'}
Description: ${problem?.description || ''}
Language: ${language}

Student Code:
\`\`\`${language ? language.toLowerCase() : 'text'}
${code}
\`\`\`

Execution Results / Error:
${error ? `Runtime Error: ${error}` : JSON.stringify(testResults, null, 2)}

Instructions:
1. Do NOT write or give away the complete final solution.
2. Identify the logical bug, edge case, or conceptual misunderstanding.
3. Provide a clear, encouraging nudge or 1-2 guiding questions pointing them in the right direction.
4. Keep the explanation under 120 words.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No hint generated. Give it another try!';
  } catch (err) {
    console.error('Gemini Practice Hint Error:', err);
    return 'Unable to fetch hint right now. Double-check your logic or syntax and try again!';
  }
}

export async function analyzeCodeComplexity({ problem, code, language }) {
  if (!GEMINI_API_KEY) {
    return {
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      explanation: 'Gemini API key is not configured in your .env file.',
      optimizationTip: ''
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
Analyze the algorithmic time and space complexity of this solution.

Problem: ${problem?.title || 'Practice Problem'}
Language: ${language}

Code:
\`\`\`${language ? language.toLowerCase() : 'text'}
${code}
\`\`\`

Return a valid JSON object strictly adhering to this schema:
{
  "timeComplexity": "Big-O notation, e.g., O(n) or O(n log n)",
  "spaceComplexity": "Big-O notation, e.g., O(1) or O(n)",
  "explanation": "2-3 concise sentences detailing why this time and space complexity applies.",
  "optimizationTip": "1 concise sentence stating whether this is optimal or how it can be improved."
}
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : rawText;

    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Complexity Analysis Error:', err);
    return {
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      explanation: `Analysis error: ${err.message}`,
      optimizationTip: 'Please check your connection or try again.'
    };
  }
}