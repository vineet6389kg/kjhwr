import { useDecisionHour } from '../context/DecisionHourContext'

const HOURS = [6, 8, 10, 12, 14, 16]

export default function DecisionHourSelect() {
  const { hour, setHour } = useDecisionHour()
  return (
    <label className="text-sm">
      <span className="mb-1 block text-muted">Decision time (day before, UTC)</span>
      <select
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        className="rounded-xl border border-border-strong bg-surface px-3 py-2"
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
        ))}
      </select>
    </label>
  )
}