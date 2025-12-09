import { ThemeManager } from './theme';

interface RSSItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

interface RSSFeed {
    title: string;
    items: RSSItem[];
}

class RSSReader {
    private loadFeedBtn: HTMLButtonElement | null;
    private feedUrl: HTMLInputElement | null;
    private feedsList: HTMLElement | null;
    private feedMessage: HTMLElement | null;
    private themeManager: ThemeManager;

    constructor() {
        this.loadFeedBtn = document.getElementById('load-feed') as HTMLButtonElement;
        this.feedUrl = document.getElementById('feed-url') as HTMLInputElement;
        this.feedsList = document.getElementById('feeds-list');
        this.feedMessage = document.getElementById('feed-message');
        this.themeManager = new ThemeManager();
        this.init();
    }

    private init(): void {
        // Event listeners
        if (this.loadFeedBtn) {
            this.loadFeedBtn.addEventListener('click', () => this.handleLoadFeed());
        }

        if (this.feedUrl) {
            this.feedUrl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLoadFeed();
                }
            });
        }
    }

    private async handleLoadFeed(): Promise<void> {
        const url = this.feedUrl?.value.trim();
        if (!url) {
            this.showMessage('Please enter a feed URL', 'error');
            return;
        }

        this.showMessage('Loading feed...', 'loading');
        this.feedsList!.innerHTML = '';

        try {
            const feed = await this.fetchAndParseFeed(url);
            this.displayFeed(feed);
        } catch (error) {
            this.showMessage(`Error loading feed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    }

    private async fetchAndParseFeed(url: string): Promise<RSSFeed> {
        // Use CORS proxy for cross-origin requests
        const corsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        const response = await fetch(corsUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const data = await response.json() as { contents: string };
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid RSS feed format');
        }

        const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || 'Unknown Feed';
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            link: item.querySelector('link')?.textContent || '#',
            description: item.querySelector('description')?.textContent || 'No description',
            pubDate: item.querySelector('pubDate')?.textContent || ''
        }));

        return { title: feedTitle, items };
    }

    private displayFeed(feed: RSSFeed): void {
        this.feedMessage!.innerHTML = '';

        if (feed.items.length === 0) {
            this.showMessage('No items found in feed', 'error');
            return;
        }

        const html = feed.items.slice(0, 20).map(item => `
            <div class="feed-item">
                <h3>${this.escapeHtml(item.title)}</h3>
                <p>${this.escapeHtml(item.description.substring(0, 200))}${item.description.length > 200 ? '...' : ''}</p>
                ${item.pubDate ? `<p style="font-size: 0.8rem; color: var(--text-secondary);">${new Date(item.pubDate).toLocaleDateString()}</p>` : ''}
                <a href="${this.escapeHtml(item.link)}" target="_blank">Read more →</a>
            </div>
        `).join('');

        this.feedsList!.innerHTML = html;
    }

    private showMessage(message: string, type: 'loading' | 'error' | 'success' = 'success'): void {
        const className = type === 'loading' ? 'loading' : type === 'error' ? 'error' : '';
        this.feedMessage!.className = className;
        this.feedMessage!.textContent = message;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

new RSSReader();
