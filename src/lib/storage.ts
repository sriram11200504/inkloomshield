import { AuditReport } from './types';
import { TECHCORP_REPORT } from './demoData';

const STORAGE_KEY = 'inkloom_shield_active_report';
const SETTINGS_KEY = 'inkloom_shield_user_settings';

export interface UserSettings {
  apiKey: string;
  provider: 'gemini' | 'anthropic';
  autoScrollHighlight: boolean;
  hapticFeedback: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  apiKey: '',
  provider: 'gemini',
  autoScrollHighlight: true,
  hapticFeedback: true,
};

export function getStoredReport(): AuditReport {
  if (typeof window === 'undefined') return TECHCORP_REPORT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return TECHCORP_REPORT;
    return JSON.parse(raw);
  } catch (e) {
    return TECHCORP_REPORT;
  }
}

export function saveStoredReport(report: AuditReport): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  } catch (e) {
    console.warn('Failed to save report to localStorage:', e);
  }
}

export function getStoredSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
