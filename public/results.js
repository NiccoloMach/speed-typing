export function resultSummary(state) {
  const errorLabel = state.errors === 1 ? 'error' : 'errors';
  return `${state.wpm} WPM · ${state.accuracy}% accuracy · ${state.errors} ${errorLabel} · ${state.correct} correct characters · ${state.elapsed.toFixed(1)} seconds`;
}
