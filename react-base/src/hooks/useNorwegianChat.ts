import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatMessage, CoachResponse, Scenario } from '@/types';

const SESSION_TIMEOUT_MS = 60_000;

export function useNorwegianChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimedOut(false);
    timeoutRef.current = setTimeout(() => setTimedOut(true), SESSION_TIMEOUT_MS);
  }, []);

  const startSession = useCallback(
    (scenario: Scenario) => {
      setSelectedScenario(scenario);
      setTimedOut(false);
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          reply: scenario.openingLine,
          timestamp: Date.now(),
        },
      ]);
      resetTimer();
    },
    [resetTimer],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedScenario || !text.trim()) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        userText: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      resetTimer();

      // Build conversation history for the edge function (exclude opening assistant message)
      const history = messages
        .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.reply))
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          content: m.role === 'user' ? (m.userText ?? '') : (m.reply ?? ''),
        }));

      try {
        const { data, error } = await supabase.functions.invoke<CoachResponse>('chat_handler', {
          body: {
            userMessage: text.trim(),
            scenario: selectedScenario.label,
            characterName: selectedScenario.characterName,
            conversationHistory: history,
          },
        });

        if (error) throw error;
        if (!data) throw new Error('Empty response from edge function');

        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMsg.id ? { ...m, feedback: data.feedback } : m,
          ).concat({
            id: crypto.randomUUID(),
            role: 'assistant',
            reply: data.conversation_reply,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        console.error('sendMessage error:', err);
        setMessages((prev) =>
          prev.concat({
            id: crypto.randomUUID(),
            role: 'assistant',
            reply: 'Beklager, noe gikk galt. Prøv igjen. (Sorry, something went wrong.)',
            timestamp: Date.now(),
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedScenario, messages, resetTimer],
  );

  const resetSession = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessages([]);
    setSelectedScenario(null);
    setTimedOut(false);
  }, []);

  return { messages, isLoading, selectedScenario, timedOut, startSession, sendMessage, resetSession };
}
