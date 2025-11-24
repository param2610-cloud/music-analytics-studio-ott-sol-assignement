import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { loadCSV } from '../utils/csvLoader';
import Table from '../components/Table';
import LazyIframe from '../components/LazyIframe';

const callerTuneEmbeds = [
  { title: 'Top Tracks Table', src: '/html/top_tracks_table.html' },
  { title: 'Top Artists Table', src: '/html/top_artists_table.html' },
];

const CallerTuneReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await loadCSV('/data/top_tracks.csv');
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

  const heroTracks = useMemo(() => data.slice(0, 5), [data]);

  return (
    <div className="space-y-10 text-white">
      <section className="glass-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Reports · Caller Tune</p>
        <h1 className="mt-3 text-3xl font-semibold">Caller Tune Conversion + Repertoire Heatmap</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Visualize PNG-based trend lines, HTML exports, and CSV-powered charts to understand which tracks dominate ringtone conversions.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200">PNG Chart</p>
            <h2 className="text-2xl font-semibold">Top 15 Caller Tune Artists</h2>
          </div>
          <img src="/images/top_15_artists.png" alt="Top caller tune artists" className="w-full" loading="lazy" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-5"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hotline Movers</p>
          <div className="mt-4 space-y-4">
            {heroTracks.map((track, idx) => (
              <div key={`${track.Track || idx}-caller`} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-sm font-semibold">{track.Track || track.Song || `Track ${idx + 1}`}</p>
                <p className="text-xs text-slate-400">{track.Artist || track.artist || 'Unknown artist'}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{track.Streams || track.Stream_Count || track.Downloads || '—'}</p>
                {track.Change && <p className={`text-sm ${track.Change.includes('-') ? 'text-rose-400' : 'text-emerald-400'}`}>{track.Change}</p>}
              </div>
            ))}
            {!heroTracks.length && <p className="text-sm text-slate-400">Waiting for CSV data…</p>}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {callerTuneEmbeds.map((embed) => (
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
                Live
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
              <div key={`caller-skel-${idx}`} className="h-4 rounded bg-white/10" />
            ))}
          </div>
        </div>
      ) : (
        <Table data={data} columns={columns} title="Top Tracks" downloadFileName="top_tracks.csv" />
      )}
    </div>
  );
};

export default CallerTuneReport;