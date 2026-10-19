import { useEffect, useRef, useState } from 'react';
import { useRepairs } from './hooks/useRepairs';
import { RepairForm } from './features/reporting/RepairForm';
import { CompletedRepairs, JobList } from './features/jobs/JobList';
import { JobDetail } from './features/jobs/JobDetail';

export default function App() {
  const repairs = useRepairs();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ message: '', sequence: 0 });
  const [focusRequest, setFocusRequest] = useState(0);
  const detailRef = useRef<HTMLElement>(null);
  const selected = repairs.jobs.find(job => job.id === selectedId);
  useEffect(() => {
    if (focusRequest) detailRef.current?.focus();
  }, [focusRequest]);
  function announce(message: string) { setFeedback(previous => ({ message, sequence: previous.sequence + 1 })); }
  function openRepair(id: string) {
    setSelectedId(id); announce(''); setFocusRequest(value => value + 1);
  }
  return <>
    <a className="skip-link" href="#main">Skip to repairs</a>
    <header className="site-header"><div className="header-inner">
      <div className="brand"><img src="/brand/omega-digital-logo.png" alt="Omega Digital" width="265" height="58" /></div>
      <nav className="header-actions" aria-label="Repair workflow">
        <a href="#report-repair">Report a repair</a><a href="#repair-jobs">Repair jobs</a><a href="#repair-record">Repair record <span aria-hidden="true">↓</span></a>
      </nav>
    </div></header>
    <main id="main" className="page" tabIndex={-1}>
      <section className="page-intro" aria-labelledby="page-title">
        <p className="eyebrow">REPAIRS &amp; MAINTENANCE</p><h1 id="page-title">Meadow House <span>Repairs.</span></h1>
      </section>
      <div className={feedback.message ? 'notice' : 'sr-only'} role="status" aria-live="polite" aria-atomic="true">
        {feedback.message && <span key={feedback.sequence}>{feedback.message}</span>}
      </div>
      {repairs.storageError && <p className="error panel" role="alert">{repairs.storageError}</p>}
      <div className="workspace">
        <RepairForm onCreate={repairs.createRepair} onSaved={job => {
          setSelectedId(job.id); announce('Repair reported and saved. Status: New.'); setFocusRequest(value => value + 1);
        }} /><JobList jobs={repairs.jobs} selectedId={selected?.id ?? null} onSelect={openRepair} />
      </div>
      <CompletedRepairs jobs={repairs.jobs} selectedId={selected?.id ?? null} onSelect={openRepair} />
      {selected && <JobDetail key={selected.id} job={selected} panelRef={detailRef}
        onUpdate={repairs.saveRepairUpdate} onSaved={announce} onClose={() => {
          setSelectedId(null); announce(''); document.getElementById('repair-jobs')?.focus();
        }} />}
      <footer><span className="footer-brand">OMEGA DIGITAL<span>Meadow House Repairs</span></span><span>Meadow House · Repairs &amp; maintenance</span></footer>
    </main>
  </>;
}
