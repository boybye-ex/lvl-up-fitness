import { useState, useEffect, useCallback } from 'react';

/**
 * Kinetic Scroll Indicator
 * Shows scroll progress as a tactical "Speed Bar" on the side
 */
export default function ScrollIndicator({ 
  containerRef,
  position = 'right', // 'right' | 'left'
  showLabels = false,
  labels = { start: 'START', end: 'NOW' },
  accentColor = 'bg-blue-500',
}) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const percent = (scrollTop / maxScroll) * 100;
    setScrollPercent(Math.min(100, Math.max(0, percent)));
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  if (!isVisible) return null;

  const positionStyles = position === 'right' 
    ? 'right-2' 
    : 'left-2';

  return (
    <div 
      className={`fixed ${positionStyles} top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-40 transition-opacity duration-300`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {showLabels && (
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
          {labels.end}
        </span>
      )}
      
      <div className="h-32 w-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`w-full ${accentColor} rounded-full transition-all duration-150 ease-out`}
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      {showLabels && (
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
          {labels.start}
        </span>
      )}
    </div>
  );
}

/**
 * Inline Progress Bar - for use within scroll containers
 */
export function InlineScrollProgress({
  containerRef,
  className = '',
}) {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return;

    const percent = (scrollTop / maxScroll) * 100;
    setScrollPercent(Math.min(100, Math.max(0, percent)));
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  return (
    <div className={`h-0.5 bg-zinc-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 rounded-full transition-all duration-75"
        style={{ width: `${scrollPercent}%` }}
      />
    </div>
  );
}
