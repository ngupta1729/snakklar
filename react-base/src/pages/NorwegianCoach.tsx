import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useNorwegianChat } from '@/hooks/useNorwegianChat';
import type { ChatMessage, FeedbackResult, Scenario } from '@/types';

// ── Predefined scenarios ──────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 'coffee',
    label: 'Ordering coffee',
    description: 'At a café counter',
    characterName: 'Barista',
    openingLine: 'Hei! Hva kan jeg hjelpe deg med i dag?',
  },
  {
    id: 'directions',
    label: 'Asking for directions',
    description: 'Lost in the city',
    characterName: 'Pedestrian',
    openingLine: 'Hei! Er det noe jeg kan hjelpe deg med?',
  },
  {
    id: 'grocery',
    label: 'Grocery shopping',
    description: 'At the supermarket',
    characterName: 'Shop assistant',
    openingLine: 'God dag! Finner du det du leter etter?',
  },
  {
    id: 'hotel',
    label: 'Booking a hotel',
    description: 'At the reception desk',
    characterName: 'Receptionist',
    openingLine: 'Velkommen! Har du en reservasjon, eller ønsker du å bestille rom?',
  },
  {
    id: 'colleague',
    label: 'Meeting a colleague',
    description: 'First day at the office',
    characterName: 'Colleague',
    openingLine: 'Hei! Er du ny her? Hyggelig å møte deg!',
  },
  {
    id: 'doctor',
    label: "Doctor's visit",
    description: 'At the clinic',
    characterName: 'Doctor',
    openingLine: 'Hei, kom inn. Hva kan jeg hjelpe deg med i dag?',
  },
];

// ── Scenario Picker ───────────────────────────────────────────────────────────

function ScenarioPicker({ onSelect }: { onSelect: (s: Scenario) => void }) {
  return (
    <div
      className="min-h-[100dvh] bg-[#F8F7F4] flex flex-col items-center px-5 py-16"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-2xl">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold bg-violet-100 text-violet-700 ring-1 ring-violet-200">
          Norwegian Language Coach
        </span>

        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#111] leading-tight">
          Øv norsk i<br />
          <span className="text-violet-600">virkelige situasjoner.</span>
        </h1>

        <p className="mt-4 text-[#666] text-base leading-relaxed max-w-md">
          Pick a scenario and start speaking Norwegian. You'll get strict feedback on every message
          and a reply from your conversation partner.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className="group text-left p-[2px] rounded-[1.25rem] bg-[#edeae4] hover:bg-gradient-to-br hover:from-violet-200 hover:to-purple-100 transition-all duration-300"
            >
              <div className="rounded-[calc(1.25rem-2px)] bg-white px-6 py-5 h-full transition-colors duration-300 group-hover:bg-white/90">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#bbb] mb-2">
                  {scenario.description}
                </p>
                <p className="text-base font-bold text-[#111] tracking-tight">{scenario.label}</p>
                <p className="text-xs text-[#999] mt-1">with {scenario.characterName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Feedback Card ─────────────────────────────────────────────────────────────

function FeedbackCard({ correction, better_alternative, native_version, explanation }: FeedbackResult) {
  const isPerfect = explanation.toLowerCase().startsWith('perfect');

  if (isPerfect) {
    return (
      <div className="mt-2 ml-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">
        ✓ {explanation}
      </div>
    );
  }

  return (
    <div className="mt-2 ml-4 rounded-xl border border-[#ede9fe] bg-[#faf8ff] px-4 py-3 space-y-2 text-sm">
      <Row icon="✏" label="Correction" value={correction} bold />
      <Row icon="💡" label="Better" value={better_alternative} />
      <Row icon="🗣" label="Native" value={native_version} />
      <div className="flex gap-2 pt-1 border-t border-[#ede9fe]">
        <span className="shrink-0 text-[#999]">ℹ</span>
        <p className="text-[#666] italic">{explanation}</p>
      </div>
    </div>
  );
}

function Row({ icon, label, value, bold }: { icon: string; label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-[#999]">{icon}</span>
      <div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#aaa] font-semibold">{label}</span>
        <p className={cn('mt-0.5', bold ? 'text-[#111] font-medium' : 'text-[#444]')}>{value}</p>
      </div>
    </div>
  );
}

// ── Message list ──────────────────────────────────────────────────────────────

function MessageList({
  messages,
  isLoading,
  characterInitial,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  characterInitial: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'assistant' && msg.reply && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {characterInitial}
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-[#111] text-sm shadow-sm border border-[#ede9e3] max-w-[80%]">
                  {msg.reply}
                </div>
              </div>
            )}

            {msg.role === 'user' && (
              <div className="flex flex-col items-end">
                <div className="bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">
                  {msg.userText}
                </div>
                {msg.feedback && <FeedbackCard {...msg.feedback} />}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
              {characterInitial}
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#ede9e3]">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#ccc] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

// ── Chat View ─────────────────────────────────────────────────────────────────

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  timedOut: boolean;
  selectedScenario: Scenario;
  onSend: (text: string) => void;
  onReset: () => void;
}

function ChatView({ messages, isLoading, timedOut, selectedScenario, onSend, onReset }: ChatViewProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col h-[100dvh] bg-[#F8F7F4]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e5de] bg-[#F8F7F4]/80 backdrop-blur shrink-0">
        <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-bold text-[#111]">{selectedScenario.label}</p>
          <p className="text-[11px] text-[#999]">with {selectedScenario.characterName}</p>
        </div>
      </div>

      {/* Timeout banner */}
      {timedOut && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-sm text-amber-800 shrink-0">
          <span>Session timed out. Start a new scenario?</span>
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-100"
          >
            New scenario
          </Button>
        </div>
      )}

      <MessageList
        messages={messages}
        isLoading={isLoading}
        characterInitial={selectedScenario.characterName.charAt(0)}
      />

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-[#e8e5de] bg-[#F8F7F4]">
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv på norsk… (Type in Norwegian…)"
            className={cn(
              'resize-none min-h-[44px] max-h-[120px] rounded-xl border-[#ddd] bg-white text-sm',
              'focus-visible:ring-violet-400',
            )}
            rows={1}
            disabled={isLoading || timedOut}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || timedOut}
            size="icon"
            className="h-11 w-11 rounded-xl bg-violet-600 hover:bg-violet-700 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-[#bbb] mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function NorwegianCoach() {
  const { messages, isLoading, selectedScenario, timedOut, startSession, sendMessage, resetSession } =
    useNorwegianChat();

  if (!selectedScenario) {
    return <ScenarioPicker onSelect={startSession} />;
  }

  return (
    <ChatView
      messages={messages}
      isLoading={isLoading}
      timedOut={timedOut}
      selectedScenario={selectedScenario}
      onSend={sendMessage}
      onReset={resetSession}
    />
  );
}
