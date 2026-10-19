import type { HistoryEntry } from '../../domain/types';

export function JobHistory({ entries }: { entries: HistoryEntry[] }) {
  return <section aria-labelledby="history-heading" className="history-section">
    <h3 id="history-heading">Repair history</h3>
    <ol className="history">{entries.map(entry => <li key={entry.id}>
      <div className="history-top"><strong>{entry.status}</strong>
        <time dateTime={entry.at}>{new Date(entry.at).toLocaleString('en-GB')}</time></div>
      <p className="plain-text">{entry.note}</p>
    </li>)}</ol>
  </section>;
}
