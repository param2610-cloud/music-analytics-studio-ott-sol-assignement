import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { loadCSV } from '../utils/csvLoader';
import Table from '../components/Table';
import LazyIframe from '../components/LazyIframe';

const AlbumRepertoire = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await loadCSV('/data/top_albums.csv');
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

  const featureDeck = useMemo(() => data.slice(0, 3), [data]);

  return (
    <div className="space-y-10 text-white">
      <section className="glass-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">Repertoire · Albums</p>
        <h1 className="mt-3 text-3xl font-semibold">Catalog Benchmarks</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">Cross-compare album clusters by revenue, plays, and territories. Use the PNG plot for storytelling and the live CSV grid for deep dive QA.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden xl:col-span-2"
        >
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">PNG Chart</p>
            <h2 className="text-2xl font-semibold">Top Performing Albums</h2>
          </div>
          <img src="/images/top_50_albums.png" alt="Top albums" className="w-full" loading="lazy" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="glass-card p-5"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Release Notes</p>
          <div className="mt-4 space-y-4">
            {featureDeck.map((album, idx) => (
              <div key={`${album.Album || album.Title || idx}-album-card`} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-sm font-semibold">{album.Album || album.Title || `Album ${idx + 1}`}</p>
                <p className="text-xs text-slate-400">{album.Artist || 'Various Artists'}</p>
                <p className="mt-3 text-sm text-slate-300">{album.Region || 'Global'}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{album.Streams || album.Revenue || '—'}</p>
              </div>
            ))}
            {!featureDeck.length && <p className="text-sm text-slate-400">Loading highlights…</p>}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HTML Embed</p>
            <h3 className="text-lg font-semibold">Top Albums Table Snapshot</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
            Shareable
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <LazyIframe title="Top Albums Table" src="/html/top_albums_table.html" wrapperClassName="h-[360px] w-full" />
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(8)].map((_, idx) => (
              <div key={`album-skel-${idx}`} className="h-4 rounded bg-white/10" />
            ))}
          </div>
        </div>
      ) : (
        <Table data={data} columns={columns} title="Top Albums" downloadFileName="top_albums.csv" />
      )}
    </div>
  );
};

export default AlbumRepertoire;