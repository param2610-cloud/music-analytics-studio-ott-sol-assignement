import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { loadCSV } from '../utils/csvLoader';
import Table from '../components/Table';
import LazyIframe from '../components/LazyIframe';

const TrackRepertoire = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [imageError, setImageError] = useState(false);

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
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Repertoire · Tracks</p>
        <h1 className="mt-3 text-3xl font-semibold">Song Momentum & Placement</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">Track the velocity of each hit—from playlist pickups to conversions. Pair static PNGs with your CSV-driven drill downs.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden"
        >
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">PNG Chart</p>
            <h2 className="text-2xl font-semibold">Top Tracks by Streams</h2>
          </div>
          {imageError ? (
            <div className="flex h-64 items-center justify-center bg-white/5 text-slate-400">
              <p className="text-sm">Chart image not available</p>
            </div>
          ) : (
            <img
              src="/images/top_50_tracks.png"
              alt="Top tracks"
              className="w-full"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="glass-card p-5"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hot Rotations</p>
          <div className="mt-4 space-y-3">
            {heroTracks.map((track, idx) => (
              <div key={`${track.Track || track.Title || idx}-hero`} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{track.Track || track.Title || `Track ${idx + 1}`}</p>
                  <p className="text-xs text-slate-400">{track.Artist || track.Performer || 'Unknown Artist'}</p>
                </div>
                <p className="text-base font-semibold">{track.Streams || track.Conversions || '—'}</p>
              </div>
            ))}
            {!heroTracks.length && <p className="text-sm text-slate-400">Waiting for track data…</p>}
          </div>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HTML Embed</p>
            <h3 className="text-lg font-semibold">Top Tracks Table</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
            Data Room
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <LazyIframe title="Top Tracks Table" src="/html/top_tracks_table.html" wrapperClassName="h-[360px] w-full" />
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(8)].map((_, idx) => (
              <div key={`track-skel-${idx}`} className="h-4 rounded bg-white/10" />
            ))}
          </div>
        </div>
      ) : (
        <Table data={data} columns={columns} title="Top Tracks" downloadFileName="top_tracks.csv" />
      )}
    </div>
  );
};

export default TrackRepertoire;