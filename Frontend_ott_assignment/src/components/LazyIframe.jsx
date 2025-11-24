import { useEffect, useRef, useState } from 'react';

const LazyIframe = ({
  src,
  title,
  wrapperClassName = '',
  iframeClassName = '',
  placeholderLabel = 'Loading embed…',
}) => {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${wrapperClassName}`}>
      {!shouldLoad && (
        <div className="flex h-full min-h-[200px] items-center justify-center bg-white/5">
          <span className="animate-pulse text-[11px] uppercase tracking-[0.3em] text-slate-400">{placeholderLabel}</span>
        </div>
      )}
      {shouldLoad && (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          className={`h-full w-full border-0 bg-white ${iframeClassName}`.trim()}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

export default LazyIframe;