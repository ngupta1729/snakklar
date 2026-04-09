---
# Norwegian Language Coach - PRD

## Product Name
Norwegian Language Coach

## Goal
Enable learners to practice Norwegian in realistic scenarios with strict, high-quality feedback and immersive conversation.

## Vision
Provide an authentic Norwegian learning experience that combines scenario-based conversation, immediate strict feedback on grammar, vocabulary, and tone, and native-like phrasing suggestions, with adaptive learning in later phases.

## Target Audience
- Norwegian language learners (Bokmål)
- Beginner to intermediate (A1-B2), scalable to advanced (C1)
- Learners seeking immersive conversation and strict guidance

## User Stories
| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US1 | Practice conversation in realistic scenarios | User can describe a scenario and receive a roleplay response |
| US2 | Receive strict feedback | User sees corrections, better alternatives, native phrasing |
| US3 | Continue dialogue | Character in scenario asks follow-up questions |
| US4 | Adaptive feedback based on mistakes (Phase 2+) | Recurring errors are tracked and influence feedback |
| US5 | Session summaries | End-of-session summary shows top mistakes and improvement tips |

## Features
1. **Scenario-Based Conversation**: User-defined events, system roleplays characters
2. **Strict Feedback**: Grammar, vocabulary, tone corrections, structured output
3. **Memory & Personalization (Phase 2+)**: Track recurring mistakes, adaptive feedback
4. **Structured JSON Output**: For front-end rendering of corrections + replies
5. **Session Management**: Short-term chat history, 1-minute timeout, session summaries

## Architecture & System Design
- **Frontend**: Chat UI displaying user input, feedback, alternatives, native phrasing, and character replies
- **Edge Function (Phase 1)**: Orchestrates LLM calls and response composition
- **LLM Layer**: Norwegian-capable model for both feedback and conversation
- **Memory Service**: Only required in later phases for persistent/adaptive feedback
- **Response Composer**: Combines feedback + conversation for frontend

### Flow Diagram
```
User Input -> Edge Function -> [Feedback LLM + Conversation LLM] -> Response Composer -> Frontend UI
```

## Example Interaction
**Scenario:** Ordering coffee

**User Input:** "Jeg vil ha kaffe"

**Feedback LLM Output:**
- Correction: "Jeg vil ha en kaffe"
- Better alternative: "Kan jeg få en kaffe?"
- Native version: "Kan jeg få en kaffe?"
- Explanation: "You missed the article 'en'."

**Conversation Engine Output:**
"Selvfølgelig! Vil du ha melk eller sukker i kaffen din?"

**Frontend Display:**
- Shows feedback corrections, alternatives, native phrasing, and character reply.

## Technical Considerations
- LLM integration: Two calls per input (feedback + conversation)
- Edge function handles orchestration
- No persistent memory in Phase 1
- Structured JSON output enables modular front-end

## Future Enhancements
- Voice-based Norwegian practice
- CEFR-level adaptive difficulty
- Scenario branching
- Progress analytics dashboard
- Multi-dialect support

---

