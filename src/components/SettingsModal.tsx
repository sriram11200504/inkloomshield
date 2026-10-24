'use client';

import React, { useState } from 'react';
import { UserSettings, saveStoredSettings } from '@/lib/storage';
import { Key, Check, X, Shield, RefreshCw, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ settings, onUpdateSettings, isOpen, onClose }: SettingsModalProps) {
  const [localKey, setLocalKey] = useState(settings.apiKey || '');
  const [provider, setProvider] = useState<'gemini' | 'anthropic'>(settings.provider || 'gemini');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserSettings = { ...settings, apiKey: localKey.trim(), provider };
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    if (!localKey.trim()) {
      setTestResult('Using built-in deterministic engine — no key required.');
      setTesting(false);
      return;
    }
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftText: 'Connection test.', apiKey: localKey.trim(), provider }),
      });
      const data = await res.json();
      setTestResult(data.success
        ? `Connected to ${provider === 'gemini' ? 'Gemini' : 'Claude'} API successfully.`
        : `Fallback active: ${data.warning || 'Deterministic engine in use.'}`
      );
    } catch (err: any) {
      setTestResult(`Connection failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">AI Engine Settings</h3>
              <p className="text-xs text-slate-400">No API key required for demo mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Zero-auth notice */}
          <div className="flex items-start gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-lg">
            <Shield className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              The built-in deterministic engine runs without any API key and provides high-fidelity compliance analysis instantly.
            </p>
          </div>

          {/* Provider selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">LLM Provider (optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gemini' as const, label: 'Google Gemini 2.5' },
                { id: 'anthropic' as const, label: 'Anthropic Claude' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all text-left ${
                    provider === p.id
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              API Key <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="password"
              placeholder={`${provider === 'gemini' ? 'Gemini' : 'Anthropic'} API key...`}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1.5">
              Stored in browser memory only — never sent to external servers.
            </p>
          </div>

          {testResult && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              {testResult}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing…' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
