export class TypingTest {
  constructor(passage, duration) {
    if (![15, 30, 60].includes(duration)) throw new Error('Invalid duration');
    this.passage = passage; this.duration = duration; this.text = ''; this.started = null; this.ended = null;
  }
  input(text, now) {
    if (this.snapshot(now).done) return;
    if (this.started === null && text.length) this.started = now;
    this.text = text.slice(0, this.passage.length);
    if (this.text.length === this.passage.length) this.ended = now;
  }
  snapshot(now) {
    const elapsed = this.started === null ? 0 : Math.min(this.duration, Math.max(0, ((this.ended ?? now) - this.started) / 1000));
    const correct = [...this.text].filter((c, i) => c === this.passage[i]).length;
    return {text: this.text, correct, errors: this.text.length - correct, elapsed,
      remaining: Math.ceil(this.duration - elapsed),
      wpm: elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0,
      accuracy: this.text.length ? Math.round(correct / this.text.length * 100) : 100,
      done: this.ended !== null || elapsed >= this.duration};
  }
}
