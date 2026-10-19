import { useState } from 'react';
import { useRepairs } from './hooks/useRepairs';
import { RepairForm } from './features/reporting/RepairForm';
import { JobList } from './features/jobs/JobList';
import { JobDetail } from './features/jobs/JobDetail';

export default function App() {
  const repairs = useRepairs();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ message: '', sequence: 0 });
  const selected = repairs.jobs.find(job => job.id === selectedId) ?? repairs.jobs[0];
  function announce(message: string) { setFeedback(previous => ({ message, sequence: previous.sequence + 1 })); }
  return <>
    <a className="skip-link" href="#main">Skip to repairs</a>
    <header className="site-header"><div className="header-inner">
      <div><p className="eyebrow">MEADOW HOUSE</p><h1>Repairs, kept together.</h1>
        <p>Report an issue. Follow the work. See what was done.</p></div>
      <span className="demo-label">Hackathon demo · fictional data only</span>
    </div></header>
    <main id="main" className="page" tabIndex={-1}>
      <div className="notice" role="status" aria-live="polite" aria-atomic="true">
        {feedback.message ? <span key={feedback.sequence}>{feedback.message}</span> : 'Repairs save in this browser. Use fictional names and repair details.'}
      </div>
      {repairs.storageError && <p className="error panel" role="alert">{repairs.storageError}</p>}
      <div className="workspace">
        <div className="sidebar"><RepairForm onCreate={repairs.createRepair} onSaved={job => {
          setSelectedId(job.id); announce('Repair reported and saved. Status: New.');
        }} /><JobList jobs={repairs.jobs} selectedId={selected?.id ?? null} onSelect={id => {
          setSelectedId(id); announce('Repair selected. Its details and history are below the repair jobs list on mobile.');
        }} /></div>
        {selected ? <JobDetail key={selected.id} job={selected} onStart={repairs.startRepair}
          onProgress={repairs.addProgressNote} onComplete={repairs.completeRepair} onSaved={announce} />
          : <section className="panel welcome"><p className="eyebrow">YOUR REPAIR RECORD</p>
            <h2>A clear history, from report to repair.</h2><p>Once you report a repair, its details, progress notes and completion history will appear here.</p>
            <ol><li>Report what needs attention</li><li>Start the repair and save progress</li><li>Complete it with an explanation</li></ol></section>}
      </div>
      <footer>Meadow House Repairs · Omega Digital university hackathon · Stored on this device</footer>
    </main>
  </>;
}
