import { useRef, useState, type FormEvent } from 'react';
import type { FieldErrors, Priority, Repair, ReportInput, Result } from '../../domain/types';
import './reporting.css';

const commonRepairs = ['Garden fence damaged', 'Kitchen light not working', 'Leaking tap', 'Door or lock not closing', 'Heating not working', 'Window damaged'];

interface Props {
  onCreate: (input: ReportInput) => Result<Repair>;
  onSaved: (job: Repair) => void;
}

export function RepairForm({ onCreate, onSaved }: Props) {
  const [description, setDescription] = useState('');
  const [reporter, setReporter] = useState('');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [commonRepair, setCommonRepair] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const reporterRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = onCreate({ description, reporter, priority });
    if (!result.ok) {
      setErrors(result.errors);
      if (result.errors.description) descriptionRef.current?.focus();
      else if (result.errors.reporter) reporterRef.current?.focus();
      return;
    }
    setDescription(''); setReporter(''); setPriority('Normal'); setCommonRepair(''); setErrors({});
    onSaved(result.value);
  }

  return <section id="report-repair" className="panel report-panel" aria-labelledby="report-heading">
    <div className="panel-top"><span className="section-number">01</span><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18a2.1 2.1 0 0 0 3 3l5.3-5.3a5 5 0 0 0 6.4-6.4L14.5 12l-2.5-2.5 2.7-3.2Z" /></svg></div>
    <h2 id="report-heading">Report a repair</h2>
    <form onSubmit={submit} noValidate>
      <div className="description-toolbar"><label htmlFor="description">What needs repairing? <span className="required">(required)</span></label>
        <select className="common-repair-picker" aria-label="Common repairs (optional)" value={commonRepair} onChange={event => {
          const value = event.target.value;
          setCommonRepair(value);
          if (value) { setDescription(value); descriptionRef.current?.focus(); }
        }}>
          <option value="">Choose a common repair</option>
          {commonRepairs.map(item => <option key={item} value={item}>{item}</option>)}
        </select></div>
      <textarea id="description" ref={descriptionRef} rows={4} value={description}
        onChange={e => { setDescription(e.target.value); setCommonRepair(''); }} aria-required="true"
        aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} />
      {errors.description && <p className="error" id="description-error">{errors.description}</p>}
      <div className="form-row"><div><label htmlFor="reporter">Reporter name <span className="required">(required)</span></label>
      <input id="reporter" ref={reporterRef} value={reporter} onChange={e => setReporter(e.target.value)}
        autoComplete="name" aria-required="true" aria-invalid={!!errors.reporter}
        aria-describedby={errors.reporter ? 'reporter-error' : undefined} />
      {errors.reporter && <p className="error" id="reporter-error">{errors.reporter}</p>}
      </div><fieldset className="priority-field"><legend>Priority</legend>
        <div className="priority-options">{(['Normal', 'Urgent'] as const).map(value =>
          <label className={`priority-option priority-${value.toLowerCase()}`} key={value}>
            <input type="radio" name="priority" value={value} checked={priority === value} onChange={() => setPriority(value)} />
            <span>{value}</span>
          </label>)}</div>
      </fieldset></div>
      {errors.general && <p className="error" role="alert">{errors.general}</p>}
      <button type="submit" className="primary">Report repair</button>
    </form>
  </section>;
}
