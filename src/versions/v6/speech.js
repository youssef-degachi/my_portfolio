/**
 * Browser speech, with a silent fallback: captions and the orb always follow a timer,
 * so the call works the same with the voice muted or on browsers with no synthesis.
 */
const synth = () => (typeof window !== "undefined" ? window.speechSynthesis : null);

export const SpeechRec = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

let cachedVoice = null;
function chooseVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = synth()?.getVoices() || [];
  const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
  const preferred = [/natural/i, /online/i, /google uk english male/i, /daniel/i, /alex/i, /google us english/i, /samantha/i];
  for (const re of preferred) { const hit = en.find((v) => re.test(v.name)); if (hit) { cachedVoice = hit; return hit; } }
  cachedVoice = en[0] || voices[0] || null;
  return cachedVoice;
}

export const splitSentences = (text) => text.match(/[^.?!]+[.?!]+(\s|$)|[^.?!]+$/g)?.map((s) => s.trim()).filter(Boolean) || [text];

/**
 * Speaks a reply sentence by sentence (long utterances get cut off in Chrome).
 * Callbacks: onSentence(i), onWord(sentenceIndex, wordIndex), onEnergy(0..1), onEnd().
 */
export function speak(text, { muted, onSentence, onWord, onEnergy, onEnd }) {
  const sentences = splitSentences(text);
  let cancelled = false;
  let timer = 0;
  let index = 0;
  const s = synth();
  const finish = () => { if (!cancelled) { cancelled = true; onEnergy?.(0); onEnd?.(); } };

  const runTimer = (words, sentence, done) => {
    let w = 0;
    const tick = () => {
      if (cancelled) return;
      onWord?.(sentence, w);
      onEnergy?.(.55 + Math.random() * .45);
      w += 1;
      if (w >= words.length) { timer = setTimeout(() => { onEnergy?.(.1); done(); }, 240); return; }
      timer = setTimeout(tick, 120 + words[w - 1].length * 34);
    };
    tick();
  };

  const next = () => {
    if (cancelled) return;
    if (index >= sentences.length) { finish(); return; }
    const sentence = index; const line = sentences[index];
    index += 1;
    onSentence?.(sentence);
    const words = line.split(/\s+/);
    if (muted() || !s) { runTimer(words, sentence, next); return; }
    const u = new SpeechSynthesisUtterance(line);
    const voice = chooseVoice();
    if (voice) u.voice = voice;
    u.rate = 1.04; u.pitch = 1; u.lang = voice?.lang || "en-US";
    let started = false; let settled = false; let boundary = false;
    const settle = () => { if (!settled) { settled = true; clearTimeout(timer); next(); } };
    // An engine that fails (no voices, blocked) must not skip the caption: pace it silently instead.
    const failed = () => { if (!settled && !cancelled) { settled = true; clearTimeout(timer); runTimer(words, sentence, next); } };
    u.onstart = () => {
      started = true;
      // Some voices never fire word boundaries: pace captions ourselves, and let `onend` advance.
      timer = setTimeout(() => { if (!boundary && !settled) { runTimer(words, sentence, () => {}); } }, 300);
    };
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      boundary = true;
      const upto = line.slice(0, e.charIndex + 1).trim().split(/\s+/).length - 1;
      onWord?.(sentence, Math.max(0, upto));
      onEnergy?.(.6 + Math.random() * .4);
    };
    u.onend = settle;
    u.onerror = failed;
    s.cancel();
    s.speak(u);
    // A voice that never starts (no engine, blocked) falls back to silent pacing.
    setTimeout(() => { if (!started) { s.cancel(); failed(); } }, 900);
  };
  next();

  return () => { cancelled = true; clearTimeout(timer); s?.cancel(); onEnergy?.(0); };
}

export function blip(kind) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const seq = kind === "connect" ? [[660, 0], [880, .11]] : [[440, 0], [330, .14], [220, .28]];
    seq.forEach(([f, at]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = f; o.type = "sine";
      g.gain.setValueAtTime(0, ctx.currentTime + at);
      g.gain.linearRampToValueAtTime(.09, ctx.currentTime + at + .02);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + at + .13);
      o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + .15);
    });
    setTimeout(() => ctx.close(), 900);
  } catch { /* audio is decoration */ }
}
