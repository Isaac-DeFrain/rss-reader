import { ThemeManager } from './theme';

class PageController {
    private themeManager: ThemeManager;

    constructor() {
        this.themeManager = new ThemeManager();
    }
}

new PageController();
