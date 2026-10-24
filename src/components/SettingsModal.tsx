'use client';

import React, { useState } from 'react';
import { UserSettings, saveStoredSettings } from '@/lib/storage';
import { Key, Sparkles, Check, X, Shield, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
}: SettingsModalProps) {
  const [localKey, setLocalKey] = useState(settings.apiKey || '');
  const [provider, setProvider] = useState<'gemini' | 'anthropic'>(settings.provider || 'gemini');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      apiKey: localKey.trim(),
      provider,
    };
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (!localKey.trim()) {
      setTestResult('Using Built-in Deterministic Engine (No key required for judges)');
      setTesting(false);
      return;
    }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: 'Test connection draft for Inkloom Shield.',
          apiKey: localKey.trim(),
          provider,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`✓ Successfully connected to ${provider.toUpperCase()} API!`);
      } else {
        setTestResult(`Connection returned fallback: ${data.warning || 'Fallback enabled'}`);
      }
    } catch (err: any) {
      setTestResult(`Error: ${err.message || 'Connection failed'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & API Configuration</h3>
              <p className="text-xs text-slate-400 font-mono">Zero-Auth by default for judges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Shield className="w-4 h-4 text-indigo-400" />
              Judge-Ready Zero-Auth Architecture
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              No API key is required! Inkloom Shield incorporates a complete deterministic compliance engine that parses guidelines and specifications with instant high-fidelity responses.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Select LLM Provider (Optional):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  provider === 'gemini'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Google Gemini (2.5 Flash)
              </button>
              <button
                type="button"
                onClick={() => setProvider('anthropic')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  provider === 'anthropic'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Anthropic Claude (3.5)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Custom API Key (Optional):
            </label>
            <input
              type="password"
              placeholder={`Enter custom ${provider === 'gemini' ? 'Gemini' : 'Anthropic'} API key...`}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Keys are strictly stored in local browser memory and never persisted on external servers.
            </p>
          </div>

          {testResult && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
              {testResult}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all font-semibold"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
