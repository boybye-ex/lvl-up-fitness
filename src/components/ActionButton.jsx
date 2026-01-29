import { useState, useRef, useCallback } from 'react';
import { mediumHaptic, successHaptic } from '../utils/haptics';

/**
 * Neumorphic "Press-to-Confirm" Action Button
 * Prevents accidental taps with a satisfying hold-to-confirm interaction
 */
export default function ActionButton({ 
  label, 
  onClick, 
  holdDuration = 800,
  icon: Icon = null,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  disabled = false,
  className = '',
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const startTime = useRef(null);

  const variantStyles = {
    primary: {
      bg: 'bg-zinc-800',
      fill: 'bg-blue-600',
      text: 'text-white',
      holdText: 'text-white',
    },
    secondary: {
      bg: 'bg-zinc-900 border border-zinc-700',
      fill: 'bg-zinc-600',
      text: 'text-zinc-300',
      holdText: 'text-white',
    },
    danger: {
      bg: 'bg-zinc-800',
      fill: 'bg-red-600',
      text: 'text-red-400',
      holdText: 'text-white',
    },
    success: {
      bg: 'bg-zinc-800',
      fill: 'bg-green-600',
      text: 'text-green-400',
      holdText: 'text-white',
    },
  };

  const styles = variantStyles[variant] || variantStyles.primary;

  const startHold = useCallback(() => {
    if (disabled) return;
    
    mediumHaptic();
    setIsHolding(true);
    startTime.current = Date.now();

    // Animate progress
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(newProgress);
    }, 16);

    // Trigger action after hold duration
    holdTimer.current = setTimeout(() => {
      successHaptic();
      setIsHolding(false);
      setProgress(0);
      clearInterval(progressTimer.current);
      onClick?.();
    }, holdDuration);
  }, [disabled, holdDuration, onClick]);

  const cancelHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, []);

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      disabled={disabled}
      className={`
        relative w-full py-5 rounded-2xl overflow-hidden 
        active:scale-[0.98] transition-transform duration-150
        ${styles.bg}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Progress fill */}
      <div 
        className={`absolute inset-0 ${styles.fill} transition-none`}
        style={{ 
          width: `${progress}%`,
          transition: isHolding ? 'none' : 'width 150ms ease-out',
        }}
      />
      
      {/* Content */}
      <div className={`relative z-10 flex items-center justify-center gap-3 ${isHolding ? styles.holdText : styles.text}`}>
        {Icon && <Icon size={20} strokeWidth={2.5} />}
        <span className="font-black italic uppercase tracking-tighter text-lg">
          {isHolding ? "Hold to Confirm..." : label}
        </span>
      </div>

      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] pointer-events-none" />
    </button>
  );
}

/**
 * Quick Action Button - no hold required, just enhanced tactile feedback
 */
export function QuickActionButton({
  label,
  onClick,
  icon: Icon = null,
  variant = 'primary',
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const sizeStyles = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-3 px-6 text-sm',
    lg: 'py-4 px-8 text-base',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30',
  };

  const handleClick = () => {
    if (disabled) return;
    mediumHaptic();
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider
        active:scale-95 transition-all duration-150
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {label}
    </button>
  );
}
