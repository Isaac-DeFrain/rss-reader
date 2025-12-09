export class ThemeManager {
    private themeToggle: HTMLButtonElement | null;
    private isDarkMode: boolean;

    constructor(toggleElementId: string = 'theme-toggle') {
        this.themeToggle = document.getElementById(toggleElementId) as HTMLButtonElement | null;
        this.isDarkMode = this.loadThemePreference();
        this.init();
    }

    private init(): void {
        // Set initial theme
        this.applyTheme(this.isDarkMode);

        // Event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    private toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme(this.isDarkMode);
        this.saveThemePreference();
    }

    private applyTheme(darkMode: boolean): void {
        const html = document.documentElement;
        if (darkMode) {
            html.classList.add('dark-mode');
            if (this.themeToggle) {
                this.themeToggle.textContent = '☀️';
            }
        } else {
            html.classList.remove('dark-mode');
            if (this.themeToggle) {
                this.themeToggle.textContent = '🌙';
            }
        }
    }

    private saveThemePreference(): void {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    private loadThemePreference(): boolean {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    public isDark(): boolean {
        return this.isDarkMode;
    }
}
