'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  breakdown: {
    factualAccuracy: number;
    toneAlignment: number;
    guidelineCompliance: number;
  };
  totalIssues: number;
  resolvedIssues: number;
}

export function ScoreGauge({ score, breakdown, totalIssues, resolvedIssues }: ScoreGaugeProps) {
  // SVG circular geometry
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#f43f5e'; // rose-500
  let badgeText = 'HIGH RISK';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  let Icon = ShieldAlert;

  if (score >= 85) {
    strokeColor = '#10b981'; // emerald-500
    badgeText = score === 100 ? 'PUBLICATION READY' : 'BRAND COMPLIANT';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    Icon = ShieldCheck;
  } else if (score >= 60) {
    strokeColor = '#f59e0b'; // amber-500
    badgeText = 'MODERATE RISK';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    Icon = AlertTriangle;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Governance Firewall</span>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            Brand Trust Score
          </h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          {badgeText}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial Circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Dynamic gauge fill */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-white transition-all duration-300">
              {score}
              <span className="text-base font-normal text-slate-400">%</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              {resolvedIssues}/{totalIssues} Cleared
            </span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Factual Accuracy
              </span>
              <span className="font-mono text-slate-200">{breakdown.factualAccuracy}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${breakdown.factualAccuracy}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Tone & Voice Alignment
              </span>
              <span className="font-mono text-slate-200">{breakdown.toneAlignment}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${breakdown.toneAlignment}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Policy & Legal Compliance
              </span>
              <span className="font-mono text-slate-200">{breakdown.guidelineCompliance}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all duration-500"
                style={{ width: `${breakdown.guidelineCompliance}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {score === 100 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            All compliance gates unlocked. Safe for distribution.
          </span>
          <span className="font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            PASSED
          </span>
        </div>
      )}
    </div>
  );
}
