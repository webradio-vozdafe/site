import React, { useEffect } from 'react';
import { Moon, Clock, X, Check } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { sleepTimerMinutes, sleepTimerRemainingSec, setSleepTimer } = useRadio();

  // ESC key listener & focus management
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const timerOptions = [15, 30, 45, 60, 90, 120];

  const formatRemaining = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Timer de Sono"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          borderRadius: '7px',
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(16, 43, 40, 0.25)',
          color: 'var(--ink)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f2eddf',
                display: 'grid',
                placeItems: 'center',
                color: '#8b7550'
              }}
            >
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7550] block">
                Descanso & Paz
              </span>
              <h3 className="font-serif text-lg font-normal text-[var(--forest)] m-0">
                Timer de Sono
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status if active */}
        {sleepTimerRemainingSec !== null && (
          <div
            style={{
              margin: '14px 0',
              padding: '10px 14px',
              borderRadius: '4px',
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}
          >
            <div className="flex items-center gap-2 text-[#57625a]">
              <Clock className="w-3.5 h-3.5 animate-spin text-[#8b7550]" />
              <span>Desligando em:</span>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--forest)]">
              {formatRemaining(sleepTimerRemainingSec)}
            </span>
          </div>
        )}

        {/* Options grid */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {timerOptions.map((min) => {
            const isSelected = sleepTimerMinutes === min;
            return (
              <button
                key={min}
                onClick={() => setSleepTimer(min)}
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--gold)' : '1px solid var(--line)',
                  background: isSelected ? 'var(--forest)' : 'var(--paper)',
                  color: isSelected ? '#fffefa' : 'var(--ink)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{min} min</span>
                {isSelected && <Check className="w-3 h-3 text-[var(--gold)]" />}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--line)]">
          {sleepTimerMinutes !== null && (
            <button
              onClick={() => {
                setSleepTimer(null);
                onClose();
              }}
              className="flex-1 py-2 rounded text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
            >
              Cancelar Timer
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 button button-gold"
            style={{ minHeight: '36px', fontSize: '11px', padding: '0 12px' }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
