'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sparkles, Sliders, ExternalLink, Activity } from 'lucide-react';
import { AuditReport } from '@/lib/types';

interface NavbarProps {
  currentReport?: AuditReport | null;
  onOpenSettings?: () => void;
  onLoadJudgePreset?: () => void;
}

export function Navbar({ currentReport, onOpenSettings, onLoadJudgePreset }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  INKLOOM<span className="text-indigo-400">SHIELD</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  FIREWALL v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider hidden sm:block">
                INTELLIGENT BRAND-GOVERNANCE ENGINE
              </p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-white bg-slate-800/80'
                  : 'hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Audit Launcher
            </Link>
            <Link
              href="/workspace"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/workspace'
                  ? 'text-white bg-slate-800/80'
                  : 'hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>Remediation Workspace</span>
              {currentReport && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  currentReport.currentScore >= 85 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {currentReport.currentScore}%
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onLoadJudgePreset && (
            <button
              onClick={onLoadJudgePreset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 hover:border-amber-400 hover:text-amber-200 shadow-sm transition-all"
              title="Loads the realistic pre-configured judge draft with intentional errors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">⚡ 1-Click Judge Demo Preset</span>
              <span className="sm:hidden">Judge Demo</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
              title="Configure AI Engine / API Keys"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
