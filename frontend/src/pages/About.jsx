import { FiDatabase, FiClock, FiBarChart2, FiAlertTriangle } from 'react-icons/fi'

const sections = [
  {
    icon: FiDatabase,
    title: 'Data',
    body: 'National-level wind generation from Elexon BMRS only. Actuals come from the FUELHH dataset (fuel type WIND), and forecasts come from the WINDFOR dataset. Coverage: purchase decisions for delivery in January 2026.',
  },
  {
    icon: FiClock,
    title: 'Which forecast does a trader see?',
    body: 'Day-ahead purchases for a delivery day are decided on the day before. Many forecasts are published for each time slot, so for every slot we use the latest forecast published before the decision time. The default is 12:00 UTC on the day before delivery, and you can change it on the Dashboard and Analytics pages. Forecasts published after that time are ignored, because the trader could not have seen them.',
  },
  {
    icon: FiBarChart2,
    title: 'Accuracy metrics',
    body: null,
    list: [
      ['Error', 'forecast − actual. Positive means the forecast was too high.'],
      ['MAE', 'average size of the error, in MW.'],
      ['RMSE', 'like MAE, but large misses count more, so it shows risk.'],
      ['MAPE', 'average error as a percentage of actual generation (hours with zero actual are skipped).'],
      ['Bias', 'average signed error. Positive means over-forecasting, so there is a risk of buying too little in the day-ahead market.'],
    ],
  },
  {
    icon: FiAlertTriangle,
    title: 'Assumptions and limitations',
    body: null,
    list: [
      ['Decision time', 'the 12:00 UTC default is an assumption, not a market rule. Check it against the real gate closure for your trading process.'],
      ['Scope', 'wind only, national level, January 2026. Solar, demand and prices are not included.'],
      ['Time zone', 'all times are UTC, which equals UK time in January.'],
    ],
  },
]

export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-sm text-muted">
          WindWatch helps day-ahead traders judge how much to trust wind forecasts when deciding how much power to buy.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map(({ icon: Icon, title, body, list }) => (
          <section key={title} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary-text">
                <Icon />
              </span>
              <h2 className="font-semibold">{title}</h2>
            </div>
            {body && <p className="text-sm leading-relaxed text-muted">{body}</p>}
            {list && (
              <dl className="space-y-2 text-sm">
                {list.map(([term, text]) => (
                  <div key={term}>
                    <dt className="inline font-medium">{term}: </dt>
                    <dd className="inline text-muted">{text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
      </div>

      <p className="text-xs text-muted">
        Built with React, Tailwind CSS, Recharts, FastAPI and pandas. AI tools (Claude) were used to assist development.
      </p>
    </div>
  )
} 