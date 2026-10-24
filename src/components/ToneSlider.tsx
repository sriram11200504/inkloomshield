'use client';

import React from 'react';
import { ToneStyle } from '@/lib/types';
import { Flame, Scale, Landmark, Sparkles } from 'lucide-react';

interface ToneSliderProps {
  selectedTone: ToneStyle;
  onSelectTone: (tone: ToneStyle) => void;
  fixes: {
    hook: string;
    balanced: string;
    strict: string;
  };
  disabled?: boolean;
}

export function ToneSlider({ selectedTone, onSelectTone, fixes, disabled = false }: ToneSliderProps) {
  const options: { id: ToneStyle; label: string; icon: any; tag: string; desc: string }[] = [
    {
      id: 'hook',
      label: 'Persuasive Hook',
      icon: Flame,
      tag: 'High Conversion',
      desc: 'Punchy, engaging marketing phrasing that preserves sales energy while remaining strictly truthful.',
    },
    {
      id: 'balanced',
      label: 'Balanced Brand',
      icon: Scale,
      tag: 'Brand Signature',
      desc: 'Modern, empowering, professional baseline adhering faithfully to company brand tone principles.',
    },
    {
      id: 'strict',
      label: 'Strict Corporate',
      icon: Landmark,
      tag: 'Legally Airtight',
      desc: 'Risk-averse, formal phrasing crafted for investor reports, legal disclosures, and technical compliance.',
    },
  ];

  const currentFix = fixes[selectedTone] || fixes.balanced;

  return (
    <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Intent-Preserving Tone Slider</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono uppercase">Select Preferred Posture</span>
      </div>

      {/* 3-way toggle bar */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
        {options.map((opt) => {
          const isSelected = selectedTone === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTone(opt.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live tone rewrite preview box */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-amber-400/90 font-medium">
            Active Rewrite [{options.find((o) => o.id === selectedTone)?.label}]:
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            {options.find((o) => o.id === selectedTone)?.tag}
          </span>
        </div>
        <p className="text-emerald-300 font-medium leading-relaxed bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
          &ldquo;{currentFix}&rdquo;
        </p>
        <p className="text-[11px] text-slate-400 leading-tight">
          {options.find((o) => o.id === selectedTone)?.desc}
        </p>
      </div>
    </div>
  );
}
