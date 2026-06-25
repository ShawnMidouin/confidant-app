import React, { useState, useEffect, useRef } from "react";
import {
  Home, MessageCircle, Mic, Target, User, Send, X, Volume2,
  PhoneOff, MicOff, ChevronLeft, Plus, Trash2, Check, Sparkles,
  Heart, ShieldCheck
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens (see <style> block below for the full system)
// ---------------------------------------------------------------------------

const PERSONALITIES = [
  { id: "bestfriend", name: "Best Friend", icon: "🤝", line: "Hey, what's actually going on with you today?" },
  { id: "mentor", name: "Mentor", icon: "🧭", line: "Let's slow down and look at this clearly together." },
  { id: "fitness", name: "Fitness Coach", icon: "💪", line: "Alright — what are we training for this week?" },
  { id: "christian", name: "Christian Mentor", icon: "✝️", line: "I'm glad you're here. What's on your heart today?" },
  { id: "business", name: "Business Mentor", icon: "📈", line: "Walk me through the decision you're sitting on." },
  { id: "dating", name: "Dating Coach", icon: "❤️", line: "Tell me what happened — no judgment, just strategy." },
];

const VOICES = [
  { id: "maya", name: "Maya", desc: "Warm · 30s · US" },
  { id: "james", name: "James", desc: "Calm · 40s · UK" },
  { id: "aaliyah", name: "Aaliyah", desc: "Upbeat · 20s · US" },
  { id: "diego", name: "Diego", desc: "Grounded · 30s · ES" },
  { id: "noor", name: "Noor", desc: "Steady · 50s · CA" },
];

const REPLY_BANK = {
  bestfriend: [
    "Okay but for real — how are you, underneath the 'I'm fine'?",
    "I hear you. That sounds like a lot to carry by yourself. What would help right now, even a little?",
    "I'm proud of you for even saying that out loud. What's one small thing we could do about it today?",
    "Honestly? That makes a lot of sense given everything you've told me this week.",
  ],
  mentor: [
    "Let's name the actual problem first, before we jump to fixing it. What's true right now?",
    "What would the version of you a year from now want you to do here?",
    "That's a real constraint, not an excuse. Given that, what's one move that's still in your control?",
    "Good — you're thinking clearly about this. What's the next smallest decision in front of you?",
  ],
  fitness: [
    "Consistency beats intensity. What did you actually get done this week, not what you planned?",
    "That's a setback, not a failure — what's the very next session we can lock in?",
    "Let's make this stupid simple: one habit, same time every day, for 14 days. Deal?",
    "You showed up. That's the whole game right now. What's tomorrow's move?",
  ],
  christian: [
    "Thank you for trusting me with that. What's weighing on you most right now?",
    "It's okay to not have it all figured out — what would it look like to take this one day at a time?",
    "That sounds heavy. Want to talk through it, or would it help to just sit with it together for a moment?",
    "I think there's real wisdom in what you just said — what's drawing you toward that?",
  ],
  business: [
    "What's the actual cost of waiting on this decision another month?",
    "Strip the emotion out for a second — what do the numbers actually say?",
    "That's a real opportunity, but what's the downside case if it doesn't work?",
    "Good instinct. What's the smallest version of this you could test before committing fully?",
  ],
  dating: [
    "That reaction makes sense — but what do you actually want to happen next?",
    "Let's separate what you can control here from what you can't.",
    "That took guts to say. How did it feel to be that direct with them?",
    "Worth asking — is this about them, or about how you're showing up?",
  ],
};

const CRISIS_KEYWORDS = ["suicide", "kill myself", "want to die", "end my life", "self harm", "self-harm", "hurting myself"];

function isCrisisMessage(text) {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => t.includes(k));
}

function pickReply(personalityId, counterRef) {
  const pool = REPLY_BANK[personalityId] || REPLY_BANK.mentor;
  const idx = counterRef.current % pool.length;
  counterRef.current += 1;
  return pool[idx];
}

const MOOD_DATA = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 3 },
  { day: "Fri", mood: 4 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 4 },
];

// ---------------------------------------------------------------------------

export default function ConfidantPrototype() {
  const [screen, setScreen] = useState("onboarding");
  const [onboardStep, setOnboardStep] = useState(0); // 0 = personality, 1 = voice
  const [personality, setPersonality] = useState(PERSONALITIES[1]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodToday, setMoodToday] = useState(null);

  const [goals, setGoals] = useState([
    { id: 1, title: "Run a 5K", progress: 60, target: "Aug 30" },
    { id: 2, title: "Save $1,000", progress: 35, target: "Sep 30" },
  ]);
  const [habits, setHabits] = useState([
    { id: 1, title: "Morning walk", done: true },
    { id: 2, title: "Journal", done: false },
    { id: 3, title: "No takeout (weekday)", done: true },
  ]);
  const [memory, setMemory] = useState([
    "Training for a 5K in August",
    "Saving for a house down payment",
    "Has a job interview coming up",
    "Prefers mornings for hard conversations",
  ]);

  return (
    <div className="cf-app">
      <style>{CSS}</style>
      <div className="cf-phone">
        <div className="cf-statusbar">
          <span>9:41</span>
          <span className="cf-statusbar-dot" />
        </div>

        {screen === "onboarding" && (
          <Onboarding
            step={onboardStep}
            setStep={setOnboardStep}
            personality={personality}
            setPersonality={setPersonality}
            voice={voice}
            setVoice={setVoice}
            onFinish={() => setScreen("home")}
          />
        )}

        {screen === "home" && (
          <Home_
            personality={personality}
            goals={goals}
            habits={habits}
            setHabits={setHabits}
            moodToday={moodToday}
            onCheckIn={() => setShowMoodModal(true)}
            onChat={() => setScreen("chat")}
            onVoice={() => setScreen("voice")}
          />
        )}

        {screen === "chat" && (
          <Chat
            personality={personality}
            onBack={() => setScreen("home")}
            onSwitchPersonality={() => setScreen("onboarding")}
          />
        )}

        {screen === "voice" && (
          <VoiceCall
            personality={personality}
            voice={voice}
            onEnd={() => setScreen("home")}
            onSwitchVoice={() => setShowVoicePicker(true)}
          />
        )}

        {screen === "goals" && (
          <Goals goals={goals} habits={habits} setHabits={setHabits} />
        )}

        {screen === "profile" && (
          <Profile
            personality={personality}
            voice={voice}
            memory={memory}
            setMemory={setMemory}
            onChangePersonality={() => setScreen("onboarding")}
          />
        )}

        {screen !== "onboarding" && (
          <nav className="cf-nav">
            <NavBtn icon={<Home size={20} />} label="Home" active={screen === "home"} onClick={() => setScreen("home")} />
            <NavBtn icon={<MessageCircle size={20} />} label="Chat" active={screen === "chat"} onClick={() => setScreen("chat")} />
            <NavBtn icon={<Mic size={20} />} label="Talk" active={screen === "voice"} onClick={() => setScreen("voice")} accent />
            <NavBtn icon={<Target size={20} />} label="Goals" active={screen === "goals"} onClick={() => setScreen("goals")} />
            <NavBtn icon={<User size={20} />} label="You" active={screen === "profile"} onClick={() => setScreen("profile")} />
          </nav>
        )}

        {showVoicePicker && (
          <VoicePickerModal
            voice={voice}
            setVoice={setVoice}
            onClose={() => setShowVoicePicker(false)}
          />
        )}

        {showMoodModal && (
          <MoodModal
            onSave={(m) => {
              setMoodToday(m);
              setShowMoodModal(false);
            }}
            onClose={() => setShowMoodModal(false)}
          />
        )}
      </div>
      <p className="cf-caption">Confidant — interactive prototype · all data on this screen is mock data for demo purposes</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

function NavBtn({ icon, label, active, onClick, accent }) {
  return (
    <button
      className={`cf-navbtn ${active ? "is-active" : ""} ${accent ? "is-accent" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Onboarding({ step, setStep, personality, setPersonality, voice, setVoice, onFinish }) {
  return (
    <div className="cf-screen cf-onboard">
      <div className="cf-onboard-aura" />
      <div className="cf-onboard-head">
        <p className="cf-eyebrow">Welcome</p>
        <h1 className="cf-display">Confidant</h1>
        <p className="cf-sub">The AI in your corner — for growth, not dependency.</p>
      </div>

      {step === 0 && (
        <>
          <p className="cf-section-label">Choose who you'd like to talk to first</p>
          <div className="cf-persona-grid">
            {PERSONALITIES.map((p) => (
              <button
                key={p.id}
                className={`cf-persona-card ${personality.id === p.id ? "is-selected" : ""}`}
                onClick={() => setPersonality(p)}
              >
                <span className="cf-persona-icon">{p.icon}</span>
                <span className="cf-persona-name">{p.name}</span>
              </button>
            ))}
          </div>
          <p className="cf-hint">"{personality.line}"</p>
          <button className="cf-btn-primary" onClick={() => setStep(1)}>Continue</button>
        </>
      )}

      {step === 1 && (
        <>
          <p className="cf-section-label">Pick a voice that feels comfortable</p>
          <div className="cf-voice-list">
            {VOICES.map((v) => (
              <button
                key={v.id}
                className={`cf-voice-row ${voice.id === v.id ? "is-selected" : ""}`}
                onClick={() => setVoice(v)}
              >
                <span className="cf-voice-play"><Volume2 size={15} /></span>
                <span className="cf-voice-text">
                  <strong>{v.name}</strong>
                  <span>{v.desc}</span>
                </span>
                {voice.id === v.id && <Check size={16} />}
              </button>
            ))}
          </div>
          <p className="cf-hint">You can switch your voice or personality anytime.</p>
          <button className="cf-btn-primary" onClick={onFinish}>Enter Confidant</button>
        </>
      )}
    </div>
  );
}

function Home_({ personality, goals, habits, setHabits, moodToday, onCheckIn, onChat, onVoice }) {
  const toggleHabit = (id) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  return (
    <div className="cf-screen cf-home">
      <div className="cf-home-header">
        <div>
          <p className="cf-eyebrow">Good evening</p>
          <h2 className="cf-display-sm">Sarah</h2>
        </div>
        <span className="cf-mood-pill" onClick={onCheckIn}>{moodToday ? moodToday : "🙂"}</span>
      </div>

      <button className="cf-checkin-card" onClick={onCheckIn}>
        <span>How are you feeling today?</span>
        <span className="cf-checkin-cta">Check in →</span>
      </button>

      <div className="cf-card">
        <div className="cf-card-head">
          <Target size={15} />
          <span>Goals</span>
        </div>
        {goals.map((g) => (
          <div className="cf-goal-row" key={g.id}>
            <div className="cf-goal-row-top">
              <span>{g.title}</span>
              <span className="cf-dim">{g.progress}%</span>
            </div>
            <div className="cf-progress-track">
              <div className="cf-progress-fill" style={{ width: `${g.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="cf-card">
        <div className="cf-card-head">
          <Check size={15} />
          <span>Habits today</span>
        </div>
        {habits.map((h) => (
          <button className="cf-habit-row" key={h.id} onClick={() => toggleHabit(h.id)}>
            <span className={`cf-checkbox ${h.done ? "is-checked" : ""}`}>{h.done && <Check size={12} />}</span>
            <span className={h.done ? "cf-strike" : ""}>{h.title}</span>
          </button>
        ))}
      </div>

      <div className="cf-card cf-mood-chart-card">
        <div className="cf-card-head">
          <Heart size={15} />
          <span>Mood this week</span>
        </div>
        <div style={{ width: "100%", height: 70 }}>
          <ResponsiveContainer>
            <AreaChart data={MOOD_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8B374" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#E8B374" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#8FA3A6", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 5]} />
              <Tooltip
                contentStyle={{ background: "#16252A", border: "1px solid rgba(242,239,233,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#F2EFE9" }}
              />
              <Area type="monotone" dataKey="mood" stroke="#E8B374" strokeWidth={2} fill="url(#moodGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="cf-cta-row">
        <button className="cf-btn-secondary" onClick={onChat}><MessageCircle size={16} /> Chat</button>
        <button className="cf-btn-primary cf-btn-flex" onClick={onVoice}><Mic size={16} /> Talk</button>
      </div>
    </div>
  );
}

function Chat({ personality, onBack, onSwitchPersonality }) {
  const counterRef = useRef(0);
  const [messages, setMessages] = useState([
    { from: "ai", text: personality.line },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [crisisMode, setCrisisMode] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    if (isCrisisMessage(text)) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setCrisisMode(true);
      }, 700);
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = pickReply(personality.id, counterRef);
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    }, 900 + Math.random() * 500);
  };

  return (
    <div className="cf-screen cf-chat">
      <div className="cf-chat-header">
        <button className="cf-iconbtn" onClick={onBack}><ChevronLeft size={18} /></button>
        <button className="cf-chat-header-mid" onClick={onSwitchPersonality}>
          <span className="cf-persona-icon-sm">{personality.icon}</span>
          <span>{personality.name}</span>
        </button>
        <span style={{ width: 32 }} />
      </div>

      <div className="cf-chat-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`cf-bubble-row ${m.from === "user" ? "is-user" : ""}`}>
            <div className={`cf-bubble ${m.from === "user" ? "cf-bubble-user" : "cf-bubble-ai"}`}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="cf-bubble-row">
            <div className="cf-bubble cf-bubble-ai cf-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        {crisisMode && (
          <div className="cf-crisis-card">
            <div className="cf-crisis-head"><ShieldCheck size={16} /> I'm really glad you told me this.</div>
            <p>I want to make sure you're safe right now. You don't have to go through this alone.</p>
            <a className="cf-crisis-resource" href="tel:988">📞 Call or text 988 — Suicide & Crisis Lifeline</a>
            <a className="cf-crisis-resource" href="sms:741741">💬 Text HOME to 741741 — Crisis Text Line</a>
            <button className="cf-btn-secondary" style={{ marginTop: 10 }} onClick={() => setCrisisMode(false)}>
              I'm still here if you want to keep talking
            </button>
          </div>
        )}
      </div>

      <div className="cf-chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
        />
        <button className="cf-iconbtn cf-send" onClick={send}><Send size={16} /></button>
      </div>
    </div>
  );
}

function VoiceCall({ personality, voice, onEnd, onSwitchVoice }) {
  const [state, setState] = useState("listening"); // listening | speaking
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => (s === "listening" ? "speaking" : "listening"));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cf-screen cf-voice">
      <div className="cf-voice-top">
        <span className="cf-persona-icon-sm">{personality.icon}</span>
        <span>{personality.name} · {voice.name}</span>
      </div>

      <div className="cf-voice-stage">
        <div className={`cf-voice-aura ${state === "speaking" ? "is-speaking" : "is-listening"}`} />
        <div className="cf-voice-avatar">{personality.icon}</div>
      </div>

      <p className="cf-voice-status">{state === "listening" ? "Listening..." : "Speaking..."}</p>

      <div className="cf-waveform">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`cf-wave-bar ${state === "speaking" ? "is-active" : ""}`}
            style={{ animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>

      <div className="cf-voice-controls">
        <button className={`cf-voice-btn ${muted ? "is-on" : ""}`} onClick={() => setMuted((m) => !m)}>
          <MicOff size={18} />
          <span>{muted ? "Unmute" : "Mute"}</span>
        </button>
        <button className="cf-voice-btn cf-voice-btn-end" onClick={onEnd}>
          <PhoneOff size={18} />
          <span>End</span>
        </button>
        <button className="cf-voice-btn" onClick={onSwitchVoice}>
          <Volume2 size={18} />
          <span>Voice</span>
        </button>
      </div>
      <p className="cf-hint" style={{ marginTop: 14 }}>You can speak anytime — Confidant stops talking the moment you do.</p>
    </div>
  );
}

function Goals({ goals, habits, setHabits }) {
  const toggleHabit = (id) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  return (
    <div className="cf-screen cf-goals">
      <h2 className="cf-display-sm">Goals & habits</h2>
      {goals.map((g) => (
        <div className="cf-card" key={g.id}>
          <div className="cf-goal-row-top">
            <strong>{g.title}</strong>
            <span className="cf-dim">{g.target}</span>
          </div>
          <div className="cf-progress-track">
            <div className="cf-progress-fill" style={{ width: `${g.progress}%` }} />
          </div>
          <span className="cf-dim" style={{ fontSize: 12 }}>{g.progress}% there</span>
        </div>
      ))}

      <div className="cf-card">
        <div className="cf-card-head"><Check size={15} /><span>Daily habits</span></div>
        {habits.map((h) => (
          <button className="cf-habit-row" key={h.id} onClick={() => toggleHabit(h.id)}>
            <span className={`cf-checkbox ${h.done ? "is-checked" : ""}`}>{h.done && <Check size={12} />}</span>
            <span className={h.done ? "cf-strike" : ""}>{h.title}</span>
          </button>
        ))}
        <button className="cf-add-row"><Plus size={14} /> Add habit</button>
      </div>
    </div>
  );
}

function Profile({ personality, voice, memory, setMemory, onChangePersonality }) {
  const removeMemory = (i) => setMemory((m) => m.filter((_, idx) => idx !== i));

  return (
    <div className="cf-screen cf-profile">
      <h2 className="cf-display-sm">You</h2>

      <div className="cf-card">
        <div className="cf-card-head"><Sparkles size={15} /><span>Current setup</span></div>
        <div className="cf-profile-row">
          <span>Personality</span>
          <button className="cf-chip" onClick={onChangePersonality}>{personality.icon} {personality.name}</button>
        </div>
        <div className="cf-profile-row">
          <span>Voice</span>
          <span className="cf-chip">{voice.name}</span>
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-head"><ShieldCheck size={15} /><span>What I remember</span></div>
        {memory.map((m, i) => (
          <div className="cf-memory-row" key={i}>
            <span>{m}</span>
            <button className="cf-iconbtn-ghost" onClick={() => removeMemory(i)}><Trash2 size={14} /></button>
          </div>
        ))}
        <p className="cf-hint" style={{ marginTop: 8 }}>Every fact Confidant remembers is visible here and deletable anytime.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modals
// ---------------------------------------------------------------------------

function VoicePickerModal({ voice, setVoice, onClose }) {
  return (
    <div className="cf-modal-backdrop" onClick={onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cf-modal-head">
          <span>Switch voice</span>
          <button className="cf-iconbtn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cf-voice-list">
          {VOICES.map((v) => (
            <button
              key={v.id}
              className={`cf-voice-row ${voice.id === v.id ? "is-selected" : ""}`}
              onClick={() => { setVoice(v); onClose(); }}
            >
              <span className="cf-voice-play"><Volume2 size={15} /></span>
              <span className="cf-voice-text">
                <strong>{v.name}</strong>
                <span>{v.desc}</span>
              </span>
              {voice.id === v.id && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoodModal({ onSave, onClose }) {
  const opts = ["😞", "🙁", "😐", "🙂", "😄"];
  return (
    <div className="cf-modal-backdrop" onClick={onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cf-modal-head">
          <span>How are you feeling right now?</span>
          <button className="cf-iconbtn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cf-mood-options">
          {opts.map((o) => (
            <button key={o} className="cf-mood-opt" onClick={() => onSave(o)}>{o}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CSS = `
:root {
  --ink: #0F1A1C;
  --surface: #16252A;
  --surface-2: #1D2F35;
  --sand: #E8B374;
  --sand-soft: #F2D9B0;
  --text: #F2EFE9;
  --text-dim: #8FA3A6;
  --green: #7FB69E;
  --line: rgba(242,239,233,0.09);
  --danger-bg: #2A1D1A;
}
.cf-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  padding: 24px 0 40px;
  background: radial-gradient(circle at 50% 0%, #1a2b2f 0%, #0c1416 70%);
  min-height: 100%;
}
.cf-phone {
  width: 360px;
  height: 740px;
  background: var(--ink);
  border-radius: 36px;
  border: 1px solid rgba(242,239,233,0.08);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 6px #060a0b;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text);
}
.cf-statusbar {
  display: flex;
  justify-content: space-between;
  padding: 10px 22px 0;
  font-size: 12px;
  color: var(--text-dim);
  font-family: ui-monospace, monospace;
}
.cf-statusbar-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
.cf-screen { flex: 1; overflow-y: auto; padding: 16px 20px 90px; display: flex; flex-direction: column; gap: 14px; }
.cf-display { font-family: Georgia, "Iowan Old Style", serif; font-size: 38px; margin: 2px 0; letter-spacing: -0.5px; }
.cf-display-sm { font-family: Georgia, serif; font-size: 24px; margin: 0; }
.cf-eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); margin: 0; }
.cf-sub { color: var(--text-dim); font-size: 13px; margin: 4px 0 0; }
.cf-section-label { font-size: 13px; color: var(--text-dim); margin: 4px 0 2px; }
.cf-hint { font-size: 12px; color: var(--text-dim); font-style: italic; margin: 4px 0; }
.cf-dim { color: var(--text-dim); }
.cf-strike { text-decoration: line-through; color: var(--text-dim); }

/* Onboarding */
.cf-onboard { position: relative; padding-top: 28px; }
.cf-onboard-aura {
  position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,179,116,0.25), transparent 70%);
  filter: blur(10px); pointer-events: none;
}
.cf-onboard-head { text-align: center; margin-bottom: 6px; }
.cf-persona-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cf-persona-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
  padding: 14px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: var(--text); cursor: pointer; font-size: 13px; transition: all 0.15s ease;
}
.cf-persona-card.is-selected { border-color: var(--sand); background: var(--surface-2); }
.cf-persona-icon { font-size: 22px; }
.cf-persona-icon-sm { font-size: 16px; }
.cf-persona-name { font-weight: 500; }
.cf-voice-list { display: flex; flex-direction: column; gap: 8px; }
.cf-voice-row {
  display: flex; align-items: center; gap: 10px; background: var(--surface);
  border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; color: var(--text);
  cursor: pointer; text-align: left;
}
.cf-voice-row.is-selected { border-color: var(--sand); }
.cf-voice-play { color: var(--sand); }
.cf-voice-text { display: flex; flex-direction: column; flex: 1; font-size: 13px; }
.cf-voice-text span { color: var(--text-dim); font-size: 11px; }
.cf-btn-primary {
  background: var(--sand); color: #1c130a; border: none; border-radius: 14px;
  padding: 13px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 4px;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.cf-btn-secondary {
  background: var(--surface); color: var(--text); border: 1px solid var(--line);
  border-radius: 14px; padding: 13px; font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.cf-btn-flex { flex: 1; }
.cf-cta-row { display: flex; gap: 10px; margin-top: 4px; }

/* Home */
.cf-home-header { display: flex; justify-content: space-between; align-items: center; }
.cf-mood-pill { font-size: 20px; cursor: pointer; }
.cf-checkin-card {
  background: linear-gradient(135deg, var(--surface-2), var(--surface));
  border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px;
  display: flex; justify-content: space-between; align-items: center; color: var(--text);
  cursor: pointer; font-size: 13px;
}
.cf-checkin-cta { color: var(--sand); font-weight: 600; }
.cf-card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.cf-card-head { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; }
.cf-goal-row { display: flex; flex-direction: column; gap: 4px; }
.cf-goal-row-top { display: flex; justify-content: space-between; font-size: 13px; }
.cf-progress-track { height: 6px; background: rgba(242,239,233,0.08); border-radius: 4px; overflow: hidden; }
.cf-progress-fill { height: 100%; background: var(--sand); border-radius: 4px; }
.cf-habit-row { display: flex; align-items: center; gap: 10px; background: none; border: none; color: var(--text); font-size: 13px; cursor: pointer; padding: 2px 0; text-align: left; }
.cf-checkbox { width: 18px; height: 18px; border-radius: 6px; border: 1px solid var(--text-dim); display: flex; align-items: center; justify-content: center; color: #1c130a; flex-shrink: 0; }
.cf-checkbox.is-checked { background: var(--green); border-color: var(--green); }
.cf-add-row { background: none; border: 1px dashed var(--line); border-radius: 10px; color: var(--text-dim); font-size: 12px; padding: 8px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }

/* Chat */
.cf-chat { padding: 0 0 90px; }
.cf-chat-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--line); }
.cf-chat-header-mid { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text); font-size: 14px; cursor: pointer; }
.cf-iconbtn { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; color: var(--text); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.cf-iconbtn-ghost { background: none; border: none; color: var(--text-dim); cursor: pointer; }
.cf-chat-body { flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
.cf-bubble-row { display: flex; }
.cf-bubble-row.is-user { justify-content: flex-end; }
.cf-bubble { max-width: 78%; padding: 10px 13px; border-radius: 16px; font-size: 13.5px; line-height: 1.4; }
.cf-bubble-ai { background: var(--surface); border: 1px solid var(--line); border-bottom-left-radius: 4px; }
.cf-bubble-user { background: var(--sand); color: #1c130a; border-bottom-right-radius: 4px; }
.cf-typing { display: flex; gap: 4px; padding: 13px; }
.cf-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); animation: cfBlink 1.2s infinite ease-in-out; }
.cf-typing span:nth-child(2) { animation-delay: 0.2s; }
.cf-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes cfBlink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
.cf-chat-input { position: absolute; bottom: 70px; left: 0; right: 0; display: flex; gap: 8px; padding: 10px 14px; background: var(--ink); border-top: 1px solid var(--line); }
.cf-chat-input input { flex: 1; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; color: var(--text); font-size: 13px; outline: none; }
.cf-send { background: var(--sand); border: none; color: #1c130a; }
.cf-crisis-card { background: var(--danger-bg); border: 1px solid rgba(232,179,116,0.3); border-radius: 14px; padding: 14px; font-size: 13px; display: flex; flex-direction: column; gap: 8px; }
.cf-crisis-head { display: flex; align-items: center; gap: 6px; font-weight: 600; color: var(--sand-soft); }
.cf-crisis-resource { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 9px 12px; color: var(--text); text-decoration: none; font-size: 13px; }

/* Voice */
.cf-voice { align-items: center; text-align: center; padding-top: 30px; }
.cf-voice-top { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 13px; }
.cf-voice-stage { position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
.cf-voice-aura { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle, rgba(232,179,116,0.35), transparent 70%); animation: cfBreathe 3.2s infinite ease-in-out; }
.cf-voice-aura.is-speaking { animation-duration: 1.4s; background: radial-gradient(circle, rgba(127,182,158,0.4), transparent 70%); }
@keyframes cfBreathe { 0%, 100% { transform: scale(0.85); opacity: 0.6; } 50% { transform: scale(1.05); opacity: 1; } }
.cf-voice-avatar { width: 96px; height: 96px; border-radius: 50%; background: var(--surface-2); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; font-size: 36px; z-index: 1; }
.cf-voice-status { color: var(--text-dim); font-size: 13px; margin: 0; }
.cf-waveform { display: flex; align-items: center; gap: 3px; height: 30px; margin: 14px 0; }
.cf-wave-bar { width: 3px; height: 6px; background: var(--text-dim); border-radius: 2px; animation: cfWave 1s infinite ease-in-out; }
.cf-wave-bar.is-active { background: var(--sand); animation-duration: 0.6s; }
@keyframes cfWave { 0%, 100% { height: 6px; } 50% { height: 24px; } }
.cf-voice-controls { display: flex; gap: 12px; margin-top: 10px; }
.cf-voice-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px; color: var(--text); font-size: 11px; cursor: pointer; }
.cf-voice-btn.is-on { color: var(--sand); border-color: var(--sand); }
.cf-voice-btn-end { background: #3a1d1d; border-color: #5a2a2a; color: #f2b3b3; }

/* Profile */
.cf-profile-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.cf-chip { background: var(--surface-2); border: 1px solid var(--line); border-radius: 20px; padding: 5px 12px; font-size: 12px; color: var(--text); cursor: pointer; }
.cf-memory-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 6px 0; border-bottom: 1px solid var(--line); }
.cf-memory-row:last-of-type { border-bottom: none; }

/* Nav */
.cf-nav { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; padding: 10px 6px 16px; background: rgba(15,26,28,0.9); backdrop-filter: blur(6px); border-top: 1px solid var(--line); }
.cf-navbtn { background: none; border: none; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 10px; cursor: pointer; }
.cf-navbtn.is-active { color: var(--text); }
.cf-navbtn.is-accent.is-active { color: var(--sand); }

/* Modal */
.cf-modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: flex-end; z-index: 10; }
.cf-modal { width: 100%; background: var(--ink); border-top: 1px solid var(--line); border-radius: 20px 20px 0 0; padding: 16px 18px 28px; display: flex; flex-direction: column; gap: 12px; }
.cf-modal-head { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 600; }
.cf-mood-options { display: flex; justify-content: space-between; }
.cf-mood-opt { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; width: 50px; height: 50px; font-size: 22px; cursor: pointer; }

.cf-caption { color: rgba(242,239,233,0.4); font-size: 11px; font-family: ui-monospace, monospace; }
`;
