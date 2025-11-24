import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { loadCSV } from '../utils/csvLoader';
import LazyIframe from '../components/LazyIframe';

const spotlightCharts = [
  {
    title: 'Monthly Revenue Trend',
    description: 'MoM trajectory across all channels',
    src: '/images/monthly_revenue_trend.png',
  },
  {
    title: 'DSP Revenue Share',
    description: 'Breakdown of revenue contribution per DSP partner',
    src: '/images/dsp_revenue_share.png',
  },
  {
    title: 'Platform Performance Dashboard',
    description: 'Engagement + payout parity overview',
    src: '/images/platform_performance_dashboard.png',
  },
  {
    title: 'Platform Revenue Comparison',
    description: 'Ad-supported vs subscription mix',
    src: '/images/platform_revenue_comparison.png',
  },
  {
    title: 'Streaming Mix',
    description: 'Consumption split by stream type',
    src: '/images/stream_type_share.png',
  },
  {
    title: 'Revenue by Country',
    description: 'Geo-level contribution and volatility',
    src: '/images/revenue_by_country.png',
  },
];

const tableEmbeds = [
  { title: 'Top Artists Table', src: '/html/top_artists_table.html' },
  { title: 'Top Albums Table', src: '/html/top_albums_table.html' },
  { title: 'Top Tracks Table', src: '/html/top_tracks_table.html' },
  { title: 'DSP KPI Cards', src: '/html/kpi_cards.html' },
  { title: 'Revenue Deep Dive', src: '/html/dsp_revenue.html' },
];

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const rows = await loadCSV('/data/key_metrics_summary.csv');
        setMetrics(rows.filter((row) => Object.keys(row).length > 0));
      } catch (error) {
        console.error('Unable to load metrics csv', error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  const metricCards = useMemo(() => {
    if (!metrics.length) return [];
    return metrics.slice(0, 4).map((row, idx) => ({
      title: row.Metric || row.metric || `KPI ${idx + 1}`,
      value: row.Value || row.value || row.Score || row.score || '—',
      delta: row.Change || row.change || row.Delta || row.delta || null,
    }));
  }, [metrics]);

  return (
    <div className="space-y-10 text-white">
      <section className="glass-card p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Executive Overview</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">
              Music monetization dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Full-screen workspace that brings month-wise revenue, DSP quality, repertoire performance, and caller tune adoption together—powered entirely by static CSV + PNG assets for recruiter-ready demos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-indigo-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400">
              Export Snapshot
            </button>
            <button
              onClick={() => document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Jump to Reports
            </button>
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Key KPIs</h2>
          <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Live CSV</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingMetrics &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="animate-pulse rounded-2xl bg-white/5 p-4">
                <div className="h-3 w-1/3 rounded bg-white/10" />
                <div className="mt-4 h-6 w-2/3 rounded bg-white/20" />
              </div>
            ))}
          {!isLoadingMetrics &&
            metricCards.map((metric) => (
              <motion.div
                key={metric.title}
                whileHover={{ translateY: -4 }}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.title}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{metric.value || '—'}</p>
                {metric.delta && (
                  <p className={`mt-2 text-sm ${metric.delta.includes('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {metric.delta}
                  </p>
                )}
              </motion.div>
            ))}
        </div>
      </section>

      <section className="space-y-6" id="reports-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Visual Reporting Suite</h2>
          <p className="text-sm text-slate-300">PNG charts render instantly inside card layouts with hover parallax + smooth entrance animations.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {spotlightCharts.map((chart, idx) => (
            <motion.div
              key={chart.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden"
            >
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">{chart.description}</p>
                <h3 className="mt-1 text-lg font-semibold">{chart.title}</h3>
              </div>
              <div className="relative">
                <img src={chart.src} alt={chart.title} className="w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Embedded HTML Reports</h2>
          <p className="text-sm text-slate-300">Each iframe consumes the static HTML exported from the BI report—no backend required.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {tableEmbeds.map((embed) => (
            <motion.div
              key={embed.title}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              viewport={{ once: true }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HTML Embed</p>
                  <h3 className="text-lg font-semibold text-white">{embed.title}</h3>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                  Live
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <LazyIframe
                  title={embed.title}
                  src={embed.src}
                  wrapperClassName="h-[420px] w-full"
                  iframeClassName="fade-edge"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;