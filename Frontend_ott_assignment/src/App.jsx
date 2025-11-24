import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './layouts/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DSPReport = lazy(() => import('./pages/DSPReport'));
const CallerTuneReport = lazy(() => import('./pages/CallerTuneReport'));
const ArtistRepertoire = lazy(() => import('./pages/ArtistRepertoire'));
const AlbumRepertoire = lazy(() => import('./pages/AlbumRepertoire'));
const TrackRepertoire = lazy(() => import('./pages/TrackRepertoire'));
// const Account = lazy(() => import('./pages/Account'));

const App = () => (
  <BrowserRouter>
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <div className="animate-pulse text-xs uppercase tracking-[0.4em] text-slate-400">Loading workspace…</div>
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports/dsp" element={<DSPReport />} />
          <Route path="/reports/caller-tune" element={<CallerTuneReport />} />
          <Route path="/repertoire/artist" element={<ArtistRepertoire />} />
          <Route path="/repertoire/album" element={<AlbumRepertoire />} />
          <Route path="/repertoire/track" element={<TrackRepertoire />} />
          {/* <Route path="/account" element={<Account />} /> */}
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
