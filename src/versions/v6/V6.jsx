import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, whatsappWith } from "../content";
import { external, usePage } from "../shared";
import { GREETING, createContext, respond } from "./brain";
import { SpeechRec, blip, speak, splitSentences } from "./speech";
import Orb from "./Orb";
import Card from "./Cards";
import ReadMode from "./ReadMode";
import "./v6.css";

// The room changes with the subject: background, ink, orb.
const THEMES = {
  idle: { bg: "#060607", fg: "#f2f0ea", orb: "#d4ff3a" },
  work: { bg: "#2b12ff", fg: "#ffffff", orb: "#d4ff3a" },
  pricing: { bg: "#d4ff3a", fg: "#0a0a0a", orb: "#0a0a0a" },
  about: { bg: "#ff4b1f", fg: "#0a0a0a", orb: "#fff4e6" },
  process: { bg: "#f2f0ea", fg: "#0a0a0a", orb: "#2b12ff" },
  ai: { bg: "#120025", fg: "#efe6ff", orb: "#b583ff" },
  contact: { bg: "#00c566", fg: "#04130b", orb: "#04130b" },
};

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const TOPIC_NAMES = { work: "His work", pricing: "Pricing", about: "About Youssef", process: "How projects run", ai: "AI and this agent", contact: "Getting in touch" };

function Ring({ onAccept, onDecline }) {
  return (
    <div className="c-ring">
      <h1 className="c-ring-title">Don&rsquo;t read<br />my portfolio.<br /><em>Answer it.</em></h1>
      <div className="c-ring-bottom">
        <div className="c-caller">
          <img src={profile.photo} alt="" />
          <div><p>Incoming call</p><strong>{profile.name}&rsquo;s agent</strong></div>
        </div>
        <div className="c-ring-btns">
          <div><button className="c-round c-decline" onClick={onDecline} aria-label="Decline the call and read the portfolio instead"><span>✕</span></button><small>Just read it</small></div>
          <div><button className="c-round c-accept" onClick={onAccept} aria-label="Answer the call" autoFocus><span>✆</span></button><small>Answer</small></div>
        </div>
        <p className="c-ring-note">Sound on. Talk or type. Runs in your browser.</p>
      </div>
    </div>
  );
}

function Report({ log, seconds, topics, interests, onAgain, onRead, readLabel = "Read everything" }) {
  const turns = log.filter((l) => l.who === "you").length;
  const message = interests.length
    ? `Hi Youssef, I just talked to your agent for ${fmt(seconds)}. I'm interested in: ${interests.join(", ")}.`
    : `Hi Youssef, I just talked to your agent for ${fmt(seconds)} and I'd like to talk.`;
  return (
    <div className="c-report">
      <div className="c-report-in" data-lenis-prevent>
        <p className="c-mono">Call ended · Post-call report</p>
        <h2>That was {fmt(seconds)}.<br /><em>Here&rsquo;s what I&rsquo;d tell Youssef.</em></h2>
        <dl className="c-report-stats">
          <div><dt>Duration</dt><dd>{fmt(seconds)}</dd></div>
          <div><dt>Your turns</dt><dd>{turns}</dd></div>
          <div><dt>Topics</dt><dd>{topics.length}</dd></div>
        </dl>
        <div className="c-report-cols">
          <div>
            <h3 className="c-mono">You asked about</h3>
            {topics.length ? <ul className="c-report-topics">{topics.map((t) => <li key={t}>{TOPIC_NAMES[t] || t}</li>)}</ul> : <p>Nothing yet. A short call.</p>}
            {interests.length > 0 && <><h3 className="c-mono">Interested in</h3><ul className="c-report-topics">{interests.map((t) => <li key={t}>{t}</li>)}</ul></>}
            <h3 className="c-mono">Next action</h3>
            <p>Send Youssef this note. Nothing is sent until you press send in WhatsApp.</p>
            <blockquote>{message}</blockquote>
            <div className="c-report-actions">
              <a className="c-cta" href={whatsappWith(message)} {...external}>Send on WhatsApp ↗</a>
              <button className="c-ghost" onClick={onAgain}>Call again</button>
              <button className="c-ghost" onClick={onRead}>{readLabel}</button>
            </div>
          </div>
          <div>
            <h3 className="c-mono">Transcript</h3>
            <div className="c-transcript">{log.map((l, i) => <p key={i} className={`is-${l.who}`}><b>{l.who === "you" ? "You" : "Agent"}</b>{l.text}</p>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Call({ onEnd, onRead, orbState, readLabel = "Read instead" }) {
  const ctx = useRef(createContext());
  const [theme, setTheme] = useState("idle");
  const [flood, setFlood] = useState(null);
  const [turn, setTurn] = useState(null);
  const [sentence, setSentence] = useState(0);
  const [word, setWord] = useState(-1);
  const [card, setCard] = useState(null);
  const [chips, setChips] = useState(GREETING.chips);
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [trace, setTrace] = useState([]);
  const [traceOpen, setTraceOpen] = useState(() => window.innerWidth >= 1100);
  const [micError, setMicError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const log = useRef([]);
  const stopSpeech = useRef(() => {});
  const recognizer = useRef(null);
  const handsFree = useRef(false);
  const mutedRef = useRef(false);
  const secondsRef = useRef(0);
  const startedAt = useRef(Date.now());
  const inputRef = useRef(null);
  const endingRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => { secondsRef.current = Math.floor((Date.now() - startedAt.current) / 1000); setSeconds(secondsRef.current); }, 500);
    return () => clearInterval(id);
  }, []);

  const addTrace = useCallback((lines) => setTrace((t) => [...t, ...lines].slice(-14)), []);

  const finish = useCallback(() => {
    if (endingRef.current) return;
    endingRef.current = true;
    stopSpeech.current();
    recognizer.current?.abort?.();
    blip("end");
    orbState.current.energy = 0;
    onEnd({ log: log.current, seconds: secondsRef.current, topics: [...ctx.current.topics], interests: [...ctx.current.interests] });
  }, [onEnd, orbState]);

  const changeRoom = useCallback((topic) => {
    const next = THEMES[topic] ? topic : "idle";
    orbState.current.color = THEMES[next].orb;
    setTheme((prev) => {
      if (prev !== next) { setFlood(next); setTimeout(() => setFlood((f) => (f === next ? null : f)), 950); }
      return next;
    });
  }, [orbState]);

  const startListening = useRef(() => {});

  const deliver = useCallback((reply) => {
    stopSpeech.current();
    const sentences = splitSentences(reply.say);
    setTurn({ say: reply.say, sentences });
    setSentence(0); setWord(-1);
    setCard(reply.card || null);
    if (reply.chips) setChips(reply.chips);
    changeRoom(reply.topic);
    log.current.push({ who: "agent", text: reply.say });
    setSpeaking(true);
    const t0 = performance.now();
    addTrace([{ k: "tts", v: mutedRef.current ? "captions only (voice muted)" : `speaking, ${reply.say.split(/\s+/).length} words` }]);
    stopSpeech.current = speak(reply.say, {
      muted: () => mutedRef.current,
      onSentence: (i) => { setSentence(i); setWord(-1); },
      onWord: (_, w) => setWord(w),
      onEnergy: (e) => { orbState.current.energy = e; },
      onEnd: () => {
        setSpeaking(false);
        orbState.current.energy = 0;
        setWord(1e4);
        addTrace([{ k: "tts", v: `done in ${((performance.now() - t0) / 1000).toFixed(1)}s` }]);
        if (reply.action === "end") { setTimeout(finish, 400); return; }
        if (handsFree.current) setTimeout(() => startListening.current(), 280);
      },
    });
  }, [addTrace, changeRoom, finish, orbState]);

  const ask = useCallback((raw, source = "typed") => {
    const q = raw.trim();
    if (!q) return;
    log.current.push({ who: "you", text: q });
    setText(""); setInterim("");
    if (source !== "voice") handsFree.current = false;
    const t0 = performance.now();
    const reply = respond(q, ctx.current);
    const ms = Math.max(.1, performance.now() - t0).toFixed(1);
    const lines = [
      { k: source === "voice" ? "stt" : "txt", v: `"${q.length > 44 ? `${q.slice(0, 44)}…` : q}"` },
      { k: "nlu", v: `${reply.intent} · conf ${reply.confidence.toFixed(2)} · ${ms}ms` },
    ];
    if (reply.tool) lines.push({ k: "fn", v: `${reply.tool.name}(${Object.values(reply.tool.args).join(", ")}) → ${reply.tool.result}` });
    addTrace(lines);
    deliver(reply);
  }, [addTrace, deliver]);

  useEffect(() => {
    startListening.current = () => {
      if (!SpeechRec || endingRef.current) return;
      stopSpeech.current();
      setSpeaking(false);
      const rec = new SpeechRec();
      rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
      recognizer.current = rec;
      let finalText = "";
      rec.onstart = () => { setListening(true); setMicError(""); orbState.current.energy = .16; };
      rec.onresult = (e) => {
        let live = "";
        for (let i = e.resultIndex; i < e.results.length; i += 1) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else live += e.results[i][0].transcript;
        }
        setInterim(live || finalText);
        orbState.current.energy = .35 + Math.random() * .3;
      };
      rec.onerror = (e) => {
        handsFree.current = false;
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setMicError("Microphone blocked. You can type instead.");
        else if (e.error !== "no-speech" && e.error !== "aborted") setMicError("I couldn't hear that. Try again, or type.");
      };
      rec.onend = () => {
        setListening(false); setInterim(""); orbState.current.energy = 0;
        if (finalText.trim()) { handsFree.current = true; ask(finalText, "voice"); }
      };
      try { rec.start(); } catch { setListening(false); }
    };
  }, [ask, orbState]);

  const toggleMic = () => {
    if (listening) { handsFree.current = false; recognizer.current?.stop(); return; }
    startListening.current();
  };

  // Answering the call: the greeting is the first thing the agent does.
  useEffect(() => {
    orbState.current.ringing = 0;
    orbState.current.color = THEMES.idle.orb;
    addTrace([{ k: "sys", v: "call connected · no server, no recording" }]);
    const t = setTimeout(() => deliver(GREETING), 450);
    return () => { clearTimeout(t); stopSpeech.current(); recognizer.current?.abort?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const words = useMemo(() => (turn ? turn.sentences[Math.min(sentence, turn.sentences.length - 1)].split(/\s+/) : []), [turn, sentence]);
  const palette = THEMES[theme];
  const big = words.length <= 7 ? "is-xl" : words.length <= 16 ? "is-l" : "is-m";
  const canTalk = Boolean(SpeechRec);

  return (
    <div className="c-call" style={{ "--bg": palette.bg, "--fg": palette.fg }}>
      <div className="c-bg" style={{ background: flood ? THEMES[flood].bg : palette.bg }} />
      {flood && <div key={flood} className="c-flood" style={{ background: THEMES[flood].bg }} />}
      <div className="c-call-orb"><Orb state={orbState} /></div>

      <header className="c-top">
        <div className="c-status"><i className={speaking ? "is-talk" : listening ? "is-listen" : ""} /><strong>{fmt(seconds)}</strong><span>{listening ? "Listening" : speaking ? "Speaking" : "Your turn"}</span></div>
        <div className="c-top-actions">
          <button onClick={() => { mutedRef.current = !muted; setMuted(!muted); if (!muted) window.speechSynthesis?.cancel(); }} aria-pressed={muted}>{muted ? "Voice off" : "Voice on"}</button>
          <button onClick={() => { stopSpeech.current(); onRead(); }}>{readLabel}</button>
        </div>
      </header>

      <div className="c-stage">
        <div className="c-caption-wrap">
          <p className={`c-caption ${big}`} aria-hidden key={`${turn?.say?.length || 0}-${sentence}`}>
            {words.map((w, i) => <span key={i} className={i <= word ? "is-said" : ""}>{w} </span>)}
          </p>
          <p className="sr-only" aria-live="polite">{turn?.say}</p>
          {card && <aside key={JSON.stringify(card.kind) + (card.project?.id || card.offer?.id || card.faq?.id || "")} className="c-card" aria-label="Details"><Card card={card} onAsk={ask} /></aside>}
        </div>
      </div>

      <div className={`c-trace${traceOpen ? " is-open" : ""}`}>
        <button onClick={() => setTraceOpen(!traceOpen)} aria-expanded={traceOpen}>Trace {traceOpen ? "–" : "+"}</button>
        {traceOpen && <div className="c-trace-lines">{trace.slice(-7).map((l, i) => <p key={i}><b>{l.k}</b>{l.v}</p>)}</div>}
      </div>

      <footer className="c-controls">
        {interim && <p className="c-interim">{interim}</p>}
        {micError && <p className="c-interim">{micError}</p>}
        <div className="c-chips">{chips.map((c) => <button key={c} onClick={() => ask(c)}>{c}</button>)}</div>
        <form className="c-input" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
          {canTalk && (
            <button type="button" className={`c-mic${listening ? " is-on" : ""}`} onClick={toggleMic} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Talk to the agent"} title="Speech recognition is handled by your browser's speech service">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path fill="currentColor" d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 0 0-7 0v6A3.5 3.5 0 0 0 12 15Zm6-4a1 1 0 1 0-2 0v.5a4 4 0 0 1-8 0V11a1 1 0 1 0-2 0v.5a6 6 0 0 0 5 5.9V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.6a6 6 0 0 0 5-5.9V11Z" /></svg>
            </button>
          )}
          <label htmlFor="c-ask" className="sr-only">Ask the agent</label>
          <input id="c-ask" ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder={canTalk ? "Tap the mic, or type here…" : "Type your question…"} autoComplete="off" />
          <button type="submit" className="c-send" disabled={!text.trim()} aria-label="Send">↑</button>
          <button type="button" className="c-hang" onClick={finish} aria-label="End the call">End</button>
        </form>
      </footer>
    </div>
  );
}

const FONTS = "family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=DM+Mono:wght@400;500";

/** The call on its own, opened on top of another page. `origin` is where the colour floods out from. */
export function CallOverlay({ origin, onClose }) {
  const [report, setReport] = useState(null);
  const orbState = useRef({ energy: 0, ringing: 0, color: THEMES.idle.orb });
  const root = useRef(null);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${FONTS}&display=swap`;
    document.head.appendChild(link);
    const back = document.activeElement;
    root.current?.focus();
    blip("connect");
    window.speechSynthesis?.resume();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { link.remove(); window.removeEventListener("keydown", onKey); back?.focus?.(); };
  }, [onClose]);
  const again = () => { orbState.current = { energy: 0, ringing: 0, color: THEMES.idle.orb }; blip("connect"); setReport(null); };
  return (
    <div ref={root} tabIndex={-1} className="vroot callv c-overlay" role="dialog" aria-modal="true" aria-label={`Call with ${profile.name}'s agent`} data-lenis-prevent style={{ "--ox": `${origin?.x ?? window.innerWidth / 2}px`, "--oy": `${origin?.y ?? window.innerHeight / 2}px` }}>
      {report
        ? <Report {...report} onAgain={again} onRead={onClose} readLabel="Back to the site" />
        : <Call orbState={orbState} onRead={onClose} readLabel="Back to the site" onEnd={setReport} />}
    </div>
  );
}

export default function V6() {
  usePage({ title: "Youssef Degachi — The Call", bg: "#060607", fonts: FONTS });
  const initial = useMemo(() => (new URLSearchParams(window.location.search).has("read") ? "read" : "ring"), []);
  const [mode, setMode] = useState(initial);
  const [report, setReport] = useState(null);
  const orbState = useRef({ energy: 0, ringing: 1, color: THEMES.idle.orb });

  useEffect(() => { document.documentElement.classList.toggle("c-lock", mode === "ring" || mode === "call"); return () => document.documentElement.classList.remove("c-lock"); }, [mode]);

  const accept = () => { blip("connect"); window.speechSynthesis?.resume(); setMode("call"); };
  const call = () => { orbState.current = { energy: 0, ringing: 1, color: THEMES.idle.orb }; setReport(null); accept(); };

  return (
    <div className={`vroot callv mode-${mode}`}>
      {mode === "ring" && (
        <>
          <div className="c-ring-orb"><Orb state={orbState} /></div>
          <Ring onAccept={accept} onDecline={() => setMode("read")} />
        </>
      )}
      {mode === "call" && <Call orbState={orbState} onRead={() => setMode("read")} onEnd={(r) => { setReport(r); setMode("report"); }} />}
      {mode === "report" && report && <Report {...report} onAgain={call} onRead={() => setMode("read")} />}
      {mode === "read" && <ReadMode onCall={call} />}
    </div>
  );
}
