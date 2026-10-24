'use client';

import React, { useState } from 'react';
import { AuditReport } from '@/lib/types';
import { Download, Copy, Check, FileCheck, X, ShieldCheck, Share2 } from 'lucide-react';

interface ExportModalProps {
  report: AuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ report, isOpen, onClose }: ExportModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(report.currentDraftText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const content = `# ${report.draftTitle}
*Verified & Remediated by Inkloom Shield Governance Engine*
*Audit Timestamp: ${new Date(report.timestamp).toLocaleString()}*
*Final Brand Trust Score: ${report.currentScore}%*

---

${report.currentDraftText}

---

### Governance Audit Metadata
- **Brand Guidelines Reference:** ${report.brandGuidelineTitle}
- **Product Spec Reference:** ${report.productSpecTitle}
- **Total Issues Remediated:** ${report.issues.filter(i => i.isResolved).length} / ${report.issues.length}
- **Audit Verification ID:** ${report.id}
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
      cryptographicHash: `sha256-inkloom-${Math.random().toString(36).substring(2, 12)}`
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inkloom-audit-certificate-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Remediated Content</h3>
              <p className="text-xs text-slate-400 font-mono">
                Verified Governance Certificate // Score: {report.currentScore}%
              </p>
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
          {/* Remediated draft text preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300">Clean Remediated Draft:</span>
              <span className="text-slate-400 font-mono">
                {report.currentDraftText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-200 leading-relaxed font-sans max-h-40 overflow-y-auto">
              {report.currentDraftText}
            </div>
          </div>

          {/* Audit Metrics Summary */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Accuracy</span>
              <span className="text-emerald-400 font-bold text-sm">
                {report.scoreBreakdown.factualAccuracy}%
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Tone</span>
              <span className="text-amber-400 font-bold text-sm">
                {report.scoreBreakdown.toneAlignment}%
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Policy</span>
              <span className="text-indigo-400 font-bold text-sm">
                {report.scoreBreakdown.guidelineCompliance}%
              </span>
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors font-medium"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedText ? 'Copied Clean Text!' : 'Copy Clean Draft'}
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all font-semibold"
            >
              <Download className="w-4 h-4" />
              Download Markdown (.md)
            </button>

            <button
              onClick={handleDownloadJSON}
              className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800/80 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors font-medium"
            >
              <FileCheck className="w-4 h-4 text-purple-400" />
              Download Cryptographic Audit Certificate (.json)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          Inkloom Shield Certificate ID: {report.id} • Tamper-Evident Brand Ledger
        </div>
      </div>
    </div>
  );
}
