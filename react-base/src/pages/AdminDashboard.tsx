import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  scenario_label: string;
  character_name: string;
  created_at: string;
  ended_at: string | null;
  messages: Message[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  user_text: string | null;
  reply: string | null;
  feedback: {
    correction: string;
    better_alternative: string;
    native_version: string;
    explanation: string;
  } | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('sessions')
        .select('*, messages(*)')
        .order('created_at', { ascending: false });
      setSessions((data as Session[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.filter(m => m.role === 'user').length, 0);

  return (
    <div
      className="min-h-[100dvh] bg-[#F8F7F4] px-5 py-12"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold bg-violet-100 text-violet-700 ring-1 ring-violet-200">
              Admin Dashboard
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[#111]">
              Conversations
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-xs border-[#ddd] text-[#666] hover:text-[#111] mt-1"
          >
            Sign out
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Total sessions', value: sessions.length },
            { label: 'Total messages', value: totalMessages },
          ].map(({ label, value }) => (
            <div key={label} className="p-[2px] rounded-2xl bg-[#edeae4]">
              <div className="rounded-[calc(1rem-2px)] bg-white px-6 py-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#bbb] font-semibold">{label}</p>
                <p className="mt-1 text-3xl font-extrabold text-[#111] tracking-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Session list */}
        <div className="mt-8 space-y-3">
          {loading && (
            <p className="text-sm text-[#999] text-center py-8">Loading…</p>
          )}

          {!loading && sessions.length === 0 && (
            <p className="text-sm text-[#999] text-center py-8">No sessions yet.</p>
          )}

          {sessions.map((session) => {
            const userMessages = session.messages.filter(m => m.role === 'user');
            const isOpen = expanded === session.id;

            return (
              <div key={session.id} className="p-[2px] rounded-2xl bg-[#edeae4]">
                <div className="rounded-[calc(1rem-2px)] bg-white overflow-hidden">

                  {/* Session row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : session.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111] truncate">{session.scenario_label}</p>
                      <p className="text-[11px] text-[#999] mt-0.5">
                        with {session.character_name} · {userMessages.length} message{userMessages.length !== 1 ? 's' : ''} · {new Date(session.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[#ccc] text-lg shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded messages */}
                  {isOpen && (
                    <div className="border-t border-[#f0ece4] px-6 py-4 space-y-5">
                      {session.messages
                        .filter(m => m.role === 'user')
                        .map((msg, i) => (
                          <div key={msg.id}>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-[#bbb] font-semibold mb-1">
                              Message {i + 1}
                            </p>
                            <p className="text-sm font-medium text-[#111] bg-violet-50 rounded-xl px-4 py-2.5 inline-block">
                              {msg.user_text}
                            </p>

                            {msg.feedback && (
                              <div className={cn(
                                'mt-2 rounded-xl border px-4 py-3 text-sm space-y-1.5',
                                msg.feedback.explanation.toLowerCase().startsWith('perfect')
                                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                                  : 'border-[#ede9fe] bg-[#faf8ff]'
                              )}>
                                {msg.feedback.explanation.toLowerCase().startsWith('perfect') ? (
                                  <p className="font-medium">✓ {msg.feedback.explanation}</p>
                                ) : (
                                  <>
                                    <FeedbackRow icon="✏" label="Correction" value={msg.feedback.correction} />
                                    <FeedbackRow icon="💡" label="Better" value={msg.feedback.better_alternative} />
                                    <FeedbackRow icon="🗣" label="Native" value={msg.feedback.native_version} />
                                    <p className="text-[#666] italic pt-1 border-t border-[#ede9fe]">
                                      ℹ {msg.feedback.explanation}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeedbackRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-[#999]">{icon}</span>
      <div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#aaa] font-semibold">{label} </span>
        <span className="text-[#444]">{value}</span>
      </div>
    </div>
  );
}
