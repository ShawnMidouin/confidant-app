# Confidant — AI Companion App (Prototype)

⚠️ **Status: Early Prototype — Not a finished product.** This is a UI/UX prototype built to demonstrate the concept and flow. It is **not connected to a real AI model** — all chat responses are pre-written, hardcoded sample replies used to simulate what a real conversation might feel like.

## What This Is

Confidant is a concept for an AI companion app designed to support personal growth — not to replace therapy. The prototype demonstrates the core user experience: choosing a companion "personality," picking a voice, chatting, tracking goals/habits, and checking in on mood.

## Tech Stack

- **React** (functional components + hooks: `useState`, `useEffect`, `useRef`)
- **[lucide-react](https://lucide.dev/)** — icon library
- **[Recharts](https://recharts.org/)** — for the weekly mood chart (`AreaChart`)
- Plain CSS (injected via a `<style>` block, no external CSS framework)

## Features in the Prototype

- **Onboarding flow** — pick a companion personality (Best Friend, Mentor, Fitness Coach, Christian Mentor, Business Mentor, Dating Coach) and a voice
- **Home dashboard** — daily mood check-in, goal progress bars, habit checklist, mood trend chart
- **Chat screen** — simulated conversation using a fixed bank of canned responses per personality (`REPLY_BANK`)
- **Basic crisis-keyword detection** — if certain keywords are typed (e.g. related to self-harm), the app surfaces crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line) instead of a normal reply
- **Voice call screen (UI only)** — simulated listening/speaking animation; no real voice AI or audio is connected
- **Goals & Habits screen** — mock progress tracking
- **Profile / Memory screen** — shows a static list of "remembered" facts (not dynamically generated)

## What's NOT Real (Important)

- ❌ No real AI model is connected — responses come from a fixed array of pre-written lines, cycled in order
- ❌ No backend, database, or persistent storage — all data resets on refresh (mock data only)
- ❌ Voice call screen is a visual simulation only — no actual speech recognition or text-to-speech
- ❌ "Memory" shown in the profile is hardcoded, not generated from real conversations
- ❌ Crisis detection is a simple keyword match, not a real safety system — not suitable for production use as-is

## Why I Built It This Way

This prototype exists to prove out the **user experience and interface** before investing in real AI integration, a backend, and proper safety infrastructure. The next step is connecting it to a real AI API and building out actual data persistence.

## Roadmap / Next Steps

- [ ] Connect real AI responses via an API (e.g. Claude or GPT)
- [ ] Add a backend + database for real user data and persistent memory
- [ ] Real voice integration (speech-to-text / text-to-speech)
- [ ] Proper crisis-detection safety layer, not just keyword matching
- [ ] User authentication

---
*This project is a personal learning project and portfolio piece. Not intended for real-world mental health use in its current form.*
