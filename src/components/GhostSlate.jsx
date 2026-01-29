import { Plus } from 'lucide-react';
import { lightHaptic } from '../utils/haptics';

/**
 * Ghost Slate - Empty State Component
 * Shows a faded outline of what *could* be there, motivating the user to fill it
 * Never show blank screens - always show potential
 */
export default function GhostSlate({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = 'default', // 'default' | 'workout' | 'nutrition' | 'history'
}) {
  const variantStyles = {
    default: {
      border: 'border-zinc-800',
      iconBg: 'bg-zinc-800/50',
      iconColor: 'text-zinc-600',
      titleColor: 'text-zinc-500',
      subtitleColor: 'text-zinc-600',
    },
    workout: {
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500/50',
      titleColor: 'text-blue-400/70',
      subtitleColor: 'text-zinc-600',
    },
    nutrition: {
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500/50',
      titleColor: 'text-green-400/70',
      subtitleColor: 'text-zinc-600',
    },
    history: {
      border: 'border-yellow-500/20',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500/50',
      titleColor: 'text-yellow-400/70',
      subtitleColor: 'text-zinc-600',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  const handleAction = () => {
    lightHaptic();
    onAction?.();
  };

  return (
    <div 
      className={`
        relative border-2 border-dashed ${styles.border} rounded-2xl p-8
        flex flex-col items-center justify-center text-center
        bg-linear-to-b from-zinc-900/50 to-transparent
        min-h-[200px]
      `}
    >
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent animate-shimmer" />
      </div>

      {/* Icon */}
      {Icon && (
        <div className={`${styles.iconBg} p-4 rounded-2xl mb-4`}>
          <Icon size={32} className={styles.iconColor} strokeWidth={1.5} />
        </div>
      )}

      {/* Title */}
      <h3 className={`text-lg font-black italic uppercase tracking-tighter ${styles.titleColor} mb-2`}>
        {title}
      </h3>

      {/* Subtitle */}
      <p className={`text-sm ${styles.subtitleColor} max-w-[200px] mb-6`}>
        {subtitle}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={handleAction}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl
            bg-zinc-800 hover:bg-zinc-700 
            text-white text-xs font-bold uppercase tracking-widest
            transition-all duration-200 active:scale-95
            border border-zinc-700 hover:border-zinc-500
          `}
        >
          <Plus size={14} strokeWidth={3} />
          {actionLabel}
        </button>
      )}

      {/* Corner decorations for tactical feel */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-zinc-700 rounded-tl" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-zinc-700 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-zinc-700 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-zinc-700 rounded-br" />
    </div>
  );
}

/**
 * Compact Ghost Slate - for smaller inline empty states
 */
export function GhostSlateCompact({
  icon: Icon,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="bg-zinc-800/50 p-2 rounded-lg">
            <Icon size={18} className="text-zinc-600" />
          </div>
        )}
        <span className="text-sm text-zinc-500">{message}</span>
      </div>
      
      {actionLabel && onAction && (
        <button
          onClick={() => {
            lightHaptic();
            onAction();
          }}
          className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
