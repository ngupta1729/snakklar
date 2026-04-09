---
# Norwegian Language Coach - Implementation Plan

## Phase 1: MVP (No Persistent Memory)
**Goal:** Build a minimal system for scenario-based conversation with strict feedback.

### Tasks
1. **Supabase Edge Function (`chat_handler`)**
   - Accepts user input + scenario
   - Calls Feedback LLM for strict corrections
   - Calls Conversation LLM for roleplay reply
   - Combines outputs into structured JSON

2. **Frontend**
   - Chat interface to send input and display:
     - Corrections
     - Better alternatives
     - Native phrasing
     - Character reply

3. **Session Management**
   - Short-term in-memory session for current user input (optional)
   - 1-minute timeout per session

4. **Testing**
   - Validate Norwegian corrections
   - Check natural flow of conversation replies

### Example Flow
**User Input:** "Jeg vil ha kaffe"

**Edge Function:**
- Feedback LLM call: returns correction, better phrasing, explanation
- Conversation LLM call: returns character reply
- Response Composer merges both

**JSON Response to Frontend:**
```json
{
  "feedback": {
    "correction": "Jeg vil ha en kaffe",
    "better_alternative": "Kan jeg få en kaffe?",
    "native_version": "Kan jeg få en kaffe?",
    "explanation": "You missed the article 'en'."
  },
  "conversation_reply": "Selvfølgelig! Vil du ha melk eller sukker i kaffen din?"
}
```

**Frontend Displays:**
- Shows corrections, better phrasing, native version, and character reply

---

## Phase 2: Adaptive Memory (Future)
- Introduce memory service to track recurring mistakes
- Inject previous mistakes into Feedback LLM call for personalized guidance
- Store session history and user memory in DB

## Phase 3: Scenarios & Roleplay Expansion (Future)
- Predefined and user-defined scenarios
- Context-aware follow-up questions

## Phase 4: Session Summaries (Future)
- Summary of mistakes, phrases learned, tips for improvement

## Phase 5: Scaling & Optimization (Future)
- Optimize LLM calls
- Consider serverless or edge functions for concurrency
- Voice input/output and CEFR-level adaptation

