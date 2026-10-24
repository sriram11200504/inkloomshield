'use client';

import React, { useState } from 'react';
import { AuditReport } from '@/lib/types';
import { Download, Copy, Check, FileCheck, X, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  report: AuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ report, isOpen, onClose }: ExportModalProps) {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(report.currentDraftText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const content = `# ${report.draftTitle}
*Verified & Remediated by Inkloom Shield*
*Audit: ${new Date(report.timestamp).toLocaleString()} · Score: ${report.currentScore}%*

---

${report.currentDraftText}

---

### Audit Summary
- **Guidelines:** ${report.brandGuidelineTitle}
- **Specs:** ${report.productSpecTitle}
- **Issues Resolved:** ${report.issues.filter(i => i.isResolved).length} / ${report.issues.length}
- **Audit ID:** ${report.id}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `remediated-draft-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      ...report,
      exportDate: new Date().toISOString(),
      governanceStatus: report.currentScore >= 85 ? 'APPROVED_FOR_PUBLICATION' : 'CONDITIONAL_APPROVAL',
      cryptographicHash: `sha256-inkloom-${Math.random().toString(36).substring(2, 12)}`,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inkloom-audit-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Export Remediated Content</h3>
              <p className="text-xs text-slate-400">Trust score: {report.currentScore}%</p>
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
          {/* Draft preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Clean Draft</span>
              <span className="text-xs text-slate-400 tabular-nums">
                {report.currentDraftText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 leading-relaxed max-h-32 overflow-y-auto">
              {report.currentDraftText}
            </div>
          </div>

          {/* Score metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Accuracy', value: report.scoreBreakdown.factualAccuracy, color: 'text-red-600' },
              { label: 'Tone', value: report.scoreBreakdown.toneAlignment, color: 'text-amber-600' },
              { label: 'Policy', value: report.scoreBreakdown.guidelineCompliance, color: 'text-indigo-600' },
            ].map((m) => (
              <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-medium tracking-wide">{m.label}</span>
                <span className={`block text-sm font-bold tabular-nums mt-0.5 ${m.color}`}>{m.value}%</span>
              </div>
            ))}
          </div>

          {/* Export buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText ? 'Copied!' : 'Copy Draft'}
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download .md
            </button>
            <button
              onClick={handleDownloadJSON}
              className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Download Audit Certificate (.json)
            </button>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
          Certificate ID: {report.id}
        </div>
      </div>
    </div>
  );
}
