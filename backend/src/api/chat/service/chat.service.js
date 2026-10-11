import db from '../../../../db/db.config.js';
import { GoogleGenAI } from '@google/genai';  

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';  

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });  


export const getRecentConversationRows = async (limit = 5) => {
  const normalizedLimit = Number.parseInt(limit, 10);
  const safeLimit = Number.isNaN(normalizedLimit) || normalizedLimit <= 0 ? 20 : normalizedLimit;

  const [rows] = await db.execute(
    `SELECT id, role, content, created_at
     FROM conversations
     ORDER BY id DESC
     LIMIT ${safeLimit}`
  );

  return rows.reverse();
};

const generateAssistantAnswer = async ({ historyRows, question }) => {
  // Format history for Gemini
  const formattedHistory = historyRows.map(row => ({
    role: row.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: row.content }],
  }));


  const chat = geminiClient.chats.create({
    model: GEMINI_MODEL,
    history: formattedHistory,
    config: {  
      maxOutputTokens: 1024,
      systemInstruction: `You are a programming expert AI assistant. Your role is to ONLY answer questions related to:

1. Programming Languages (Python, JavaScript, Java, C++, Go, Rust, etc.)
2. Web Development (Frontend, Backend, Full-stack)
3. Mobile Development (iOS, Android, React Native, Flutter)
4. Database Design & SQL
5. Cloud Computing (AWS, Google Cloud, Azure)
6. DevOps & CI/CD
7. Software Architecture & Design Patterns
8. API Design & REST/GraphQL
9. Testing & Debugging
10. Version Control (Git)
11. Data Structures & Algorithms
12. Machine Learning & AI (technical implementation)
13. Open Source & Community Tools
14. Code Optimization & Performance

IMPORTANT RULES:
- If someone asks a question NOT related to programming or software development, politely decline and say: "I can only help with programming and software development related questions. Please ask something about coding, web development, databases, or similar technical topics."
- Do NOT answer questions about: politics, sports, cooking, entertainment, general knowledge, etc.
- Stay focused and professional
- Provide code examples when relevant
- Explain concepts clearly`
    }
  });

  
  const result = await chat.sendMessage({
    message: question
  });

  
  const totalTokenCount = result.usageMetadata?.totalTokenCount || 0;
  
  console.log('Total Tokens:', totalTokenCount);
  

  return {
    text: result.text,
    totalTokenCount: totalTokenCount,
  };
};

const getMessageById = async (messageId) => {
  const [rows] = await db.execute(
    'SELECT id, role, content, token_count, created_at FROM conversations WHERE id = ? LIMIT 1',
    [messageId]
  );

  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    role: rows[0].role,
    content: rows[0].content,
    tokenCount: Number(rows[0].token_count || 0),
    createdAt: rows[0].created_at,
  };
};

export async function createConversationService(question) {
  try {
    // validation
    if (!question.trim()) {
      const error = new Error('Question is required');
      error.status = 400;
      throw error;
    }

    // get recent conversations
    const historyRows = await getRecentConversationRows(5);

    // insert user message
    const [userResult] = await db.execute(
      'INSERT INTO conversations (role, content) VALUES (?, ?)',
      ['user', question]
    );

    // generate assistant answer
    const { text, totalTokenCount } = await generateAssistantAnswer({ historyRows, question });

    // insert assistant answer
    const [assistantResult] = await db.execute(
      'INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)',
      ['assistant', text, totalTokenCount]
    );

    // get both messages
    const userConversation = await getMessageById(userResult.insertId);
    const assistantConversation = await getMessageById(assistantResult.insertId);

    return {
      userConversation,
      assistantConversation,
    };
  } catch (err) {
    console.error('Conversation Service Error:', err);
    throw err;
  }
}