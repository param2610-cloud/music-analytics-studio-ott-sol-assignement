import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Artist', path: '/repertoire/artist' },
  { label: 'Album', path: '/repertoire/album' },
  { label: 'Track', path: '/repertoire/track' },
  // { label: 'Account', path: '/account' },
];

const reportLinks = [
  { label: 'DSP Insights', path: '/reports/dsp' },
  { label: 'Caller Tune', path: '/reports/caller-tune' },
];

const Layout = () => {
  const location = useLocation();
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('music-dashboard-theme') === 'dark');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('music-dashboard-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Unable to toggle fullscreen', error);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            Music Analytics Studio
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition hover:text-white ${
                  location.pathname === item.path ? 'text-white' : 'text-slate-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setIsReportsOpen((prev) => !prev)}
                className={`text-sm font-medium transition hover:text-white ${
                  location.pathname.startsWith('/reports') ? 'text-white' : 'text-slate-300'
                }`}
              >
                Reports
              </button>
              <AnimatePresence>
                {isReportsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl"
                  >
                    {reportLinks.map((report) => (
                      <Link
                        key={report.path}
                        to={report.path}
                        className="block rounded-xl px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                        onClick={() => setIsReportsOpen(false)}
                      >
                        {report.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/40 hover:bg-white/10 sm:inline-flex"
            >
              Print
            </button>
            <button
              onClick={toggleFullscreen}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/40 hover:bg-white/10"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/20"
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mx-auto w-full max-w-7xl"
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Music Analytics Dashboard — crafted for immersive insights.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
