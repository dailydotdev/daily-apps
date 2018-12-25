export const themes: string[] = ['darcula', 'bright'];

export const defaultTheme: string = themes[0];

export function applyTheme(document: Document, newTheme: string, currentTheme: string | null): void {
    if (currentTheme === newTheme || !document.documentElement) {
        return;
    }

    if (currentTheme) {
        document.documentElement.classList.add('theming');
        document.documentElement.addEventListener('transitionend', () => {
            if (document.documentElement) {
                document.documentElement.classList.remove('theming');
            }
        }, {once: true});

        if (currentTheme !== defaultTheme) {
            document.documentElement.classList.remove(currentTheme);
        }
    }

    if (newTheme !== defaultTheme) {
        document.documentElement.classList.add(newTheme);
    }
}
