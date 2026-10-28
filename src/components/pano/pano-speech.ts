/**
 * Browser Web Speech API narration helper for 360° tour scenes.
 * Splits descriptions into sentences and notifies `sentence(s)` for live captions.
 */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined"
}

/** Call inside the click handler that turns narration on so mobile browsers unlock audio. */
export function primeSpeech() {
  if (!canSpeak()) return
  try {
    window.speechSynthesis.cancel()
    window.speechSynthesis.getVoices()
  } catch {
    /* ignore */
  }
}

export function speakText(
  text: string,
  on: { sentence?: (s: string) => void; end?: () => void } = {},
): () => void {
  const sentences = splitSentences(text)
  if (!sentences.length || !canSpeak()) {
    on.end?.()
    return () => {}
  }

  const synth = window.speechSynthesis
  synth.cancel()
  const voice = pickVoice(synth.getVoices())
  let stopped = false
  let i = 0

  const next = () => {
    if (stopped || i >= sentences.length) {
      if (!stopped) on.end?.()
      return
    }
    const line = sentences[i++]
    on.sentence?.(line)
    const u = new SpeechSynthesisUtterance(line)
    if (voice) u.voice = voice
    u.rate = 0.96
    u.onend = () => {
      if (!stopped) next()
    }
    u.onerror = () => {
      if (!stopped) on.end?.()
    }
    synth.speak(u)
  }

  next()
  return () => {
    stopped = true
    try {
      synth.cancel()
    } catch {
      /* ignore */
    }
  }
}

export const speak = speakText

function splitSentences(text: string): string[] {
  return (
    text
      .trim()
      .match(/[^.!?\n]+[.!?]?/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? []
  )
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang))
  return en.find((v) => /natural|neural|siri|premium/i.test(v.name)) ?? en.find((v) => v.localService) ?? en[0] ?? voices[0]
}
