import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;
    this.setTheme(saved || 'light');
  }

  setTheme(theme: 'light' | 'dark') {
    const root = document.documentElement.classList;
    root.remove('light', 'dark');
    root.add(`${theme}`);
    localStorage.setItem(this.THEME_KEY, theme);
    this.currentTheme.set(theme);
  }

  toggleTheme() {
    const next = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}