import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { loadCSV } from '../utils/csvLoader';
import Table from '../components/Table';
import LazyIframe from '../components/LazyIframe';

const htmlEmbeds = [
  { title: 'DSP KPI Cards', src: '/html/kpi_cards.html' },
  { title: 'Revenue Deep Dive', src: '/html/dsp_revenue.html' },
];

const DSPReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await loadCSV('/data/platform_performance_summary.csv');
        const clean = csvData.filter((row) => Object.keys(row).length > 0);
        setData(clean);
        if (clean.length > 0) {
          const cols = Object.keys(clean[0]).map((key) => ({ key, label: key }));
          setColumns(cols);
        }
      } catch (error) {
        console.error('Error loading CSV:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const spotlight = useMemo(() => data.slice(0, 3), [data]);

  return (
    <div className="space-y-10 text-white">
      <section className="glass-card p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Reports · DSP</p>
            <h1 className="mt-3 text-3xl font-semibold">Digital Service Provider Intelligence</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Blend KPI cards, PNG trend charts, and CSV tables to audit partner momentum in a single full-screen surface.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Report Mode</p>
            <p className="text-lg font-semibold">DSP Focus</p>
            <p className="text-sm text-slate-300">Auto refreshed • static assets</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">PNG Chart</p>
            <h2 className="text-2xl font-semibold">Platform Performance Dashboard</h2>
          </div>
          <img src="/images/platform_performance_dashboard.png" alt="Platform performance" className="w-full" loading="lazy" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-5"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top Movers</p>
          <div className="mt-4 space-y-4">
            {spotlight.map((row, idx) => (
              <div key={`${row.DSP || row.dsp || idx}-highlight`} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-sm font-semibold">{row.DSP || row.dsp || `DSP ${idx + 1}`}</p>
                <p className="text-xs text-slate-400">{row.Region || row.region || 'Global'}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{row.Revenue || row.revenue || row.Streams || '—'}</p>
                {row.Change && <p className={`text-sm ${row.Change.includes('-') ? 'text-rose-400' : 'text-emerald-400'}`}>{row.Change}</p>}
              </div>
            ))}
            {!spotlight.length && <p className="text-sm text-slate-400">Awaiting CSV insight…</p>}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {htmlEmbeds.map((embed) => (
          <motion.div
            key={embed.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HTML Embed</p>
                <h3 className="text-lg font-semibold">{embed.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                Inline
              </span>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <LazyIframe title={embed.title} src={embed.src} wrapperClassName="h-[360px] w-full" />
            </div>
          </motion.div>
        ))}
      </section>

      {loading ? (
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div key={`dsp-skel-${idx}`} className="h-4 rounded bg-white/10" />
            ))}
          </div>
        </div>
      ) : (
        <Table data={data} columns={columns} title="Platform Performance Summary" downloadFileName="platform_performance_summary.csv" />
      )}
    </div>
  );
};

export default DSPReport;