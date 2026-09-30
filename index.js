(function wireDevRepMenu() {
    const M = typeof window !== 'undefined' ? window.MonacoEditorSettings : null;
    if (!M) return;
    window.switchSettingsTab = (id) => M.switchSettingsTab(id);
    window.updateSetting = (k, v) => M.updateSetting(k, v);
})();

const THEME_STORAGE_KEY = 'cyber-refactor-theme';

function getStoredTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
}

function applyAppTheme(theme) {
    document.documentElement.classList.add('theme-switching');

    const isDark = theme === 'dark';
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (typeof monaco !== 'undefined' && monaco.editor) {
        monaco.editor.setTheme(isDark ? 'terminal-dark' : 'terminal-light');
    }

    const btn = document.getElementById('btn-toggle-theme');
    const icon = btn?.querySelector('i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (btn) {
        btn.title = isDark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw';
    }

    void window.getComputedStyle(document.documentElement).cssText;

    setTimeout(() => {
        document.documentElement.classList.remove('theme-switching');
    }, 50);
}

function setupThemeToggle() {
    applyAppTheme(getStoredTheme());

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
        applyAppTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
    });
}

setupThemeToggle();

function buildExportStreamDocumentHtml(content, count, filterMode) {
    const currentTheme = getStoredTheme();
    return `<!DOCTYPE html>
<html lang="pl" data-theme="${currentTheme}" theme="${currentTheme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="icon" type="image/svg+xml"
        href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect x='4' y='4' width='40' height='40' rx='8' fill='%23181818' stroke='%23f36c00' stroke-width='3.5'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='16' font-weight='800' font-family='JetBrains Mono,monospace' fill='%23f36c00'%3EEXP%3C/text%3E%3C/svg%3E">
    <title>OXY_OS // EXPORT_STREAM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        /* Tymczasowe blokowanie animacji przy zmianie motywu */
        :root.theme-switching,
        :root.theme-switching *,
        :root.theme-switching *::before,
        :root.theme-switching *::after {
            transition: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
        }

        /* --- THEME SYSTEM (PURE CSS VARIABLES) --- */
        :root,
        :root[data-theme="light"],
        :root[theme="light"] {
            --padding: 0.125rem;
            --gap: 0.125rem;
            --bg-color: #f8f9fa;
            --highlight-color: #f36c00;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --border-color: #dee2e6;
            --border-color-hover: #e0e0e0;
            --panel-bg: #f8f9fa;
            --card-bg: #ffffff;
            --input-bg: #f5f5f5;
            --bg: #f8f9fa;
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --bg-tertiary: #ffffff;
            --text-color: #212529;
            --text-primary: #212529;
            --text-muted: #6c757d;
            --hover-bg: #eee;
            --stripe-accent: rgba(0, 0, 0, 0.06);
            --bg-stripe-pattern: linear-gradient(135deg,
            transparent 0%,
            transparent 25%,
            var(--stripe-accent) 25%,
            var(--stripe-accent) 50%,
            transparent 50%,
            transparent 75%,
            var(--stripe-accent) 75%,
            var(--stripe-accent) 100%);
            --shadow-drop: rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgba(78, 78, 78, 0.185) 0px 2px 6px 2px;
            --shadow-inset: inset rgba(78, 78, 78, 0.185) 0px 2px 6px 2px, inset rgba(0, 0, 0, 0.3) 0px 1px 2px 0px;
            --shadow-hover: rgba(32, 32, 32, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.325) 0px 2px 3px -0.5px, rgba(255, 255, 255, 0.04) 0px 0.5px 0px inset;
            --val-accent: #b45309;
        }

        :root[data-theme="dark"],
        :root[theme="dark"] {
            --padding: 0.125rem;
            --gap: 0.125rem;
            --bg-color: #1a1a1a;
            --bg: #121212;
            --bg-primary: #1e1e1e;
            --bg-secondary: #252526;
            --bg-tertiary: #2e2e2e;
            --border-color: #2a2a2a;
            --border-color-hover: #444;
            --panel-bg: #2a2a2a;
            --card-bg: #303030;
            --input-bg: #2d2d30;
            --text-color: #e0e0e0;
            --text-primary: #e0e0e0;
            --text-muted: #858585;
            --hover-bg: #3c3c3c;
            --highlight-color: #f36c00;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --stripe-accent: rgba(255, 255, 255, 0.04);
            --bg-stripe-pattern: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-tertiary) 25%, var(--stripe-accent) 25%, var(--stripe-accent) 50%, var(--bg-tertiary) 50%, var(--bg-tertiary) 75%, var(--stripe-accent) 75%, var(--stripe-accent) 100%);
            --shadow-drop: rgba(32, 32, 32, 0.4) 0px 0px 0px 2px, rgba(0, 0, 0, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
            --shadow-inset: inset 0px 0px 0px 2px rgba(32, 32, 32, 0.4), inset 0px 4px 6px -1px rgba(0, 0, 0, 0.65), inset 0px 1px 0px rgba(255, 255, 255, 0.08);
            --shadow-hover: rgba(32, 32, 32, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.325) 0px 2px 3px -0.5px, rgba(255, 255, 255, 0.04) 0px 0.5px 0px inset;
            --val-accent: #eeff00;
        }

        * {
            box-sizing: border-box;
            border-radius: 0 !important;
            cursor: crosshair;
            user-select: none;
            scrollbar-width: none;
        }

        .btn-bg {
            display: inline-flex;
            justify-content: center;
            align-items: stretch;
            margin: 0;
            box-shadow: var(--shadow-inset);
            padding: var(--padding);
            gap: var(--gap);
            position: relative;
            overflow: hidden;
            width: fit-content;
            border: 1px solid var(--border-color);
            background: var(--card-bg);
            user-select: none;
            box-sizing: border-box;
            flex-direction: column;
            transition: all 0.2s;
        }

        .btn-bg:hover {
            border-color: var(--border-color-hover);
        }

        body {
            background-color: var(--bg-tertiary);
            background-image: var(--bg-stripe-pattern);
            background-size: 20px 20px;
            background-attachment: fixed;
            color: var(--text-primary);
            font-family: "JetBrains Mono", monaco, courier, monospace;
            padding: 10px;
            margin: 0;
            font-size: 13px;
            line-height: 1.45;
            user-select: text;
            scrollbar-width: thin;
            scrollbar-color: var(--highlight-color) var(--bg-secondary);
            min-height: 100vh;
        }

        .header {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-drop);
            padding: 2px 15px;
            font-weight: 700;
            letter-spacing: 1.5px;
            font-size: 12px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            position: relative;
        }

        .header-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .hl-dim { color: var(--text-muted); margin: 0 4px; user-select: none; }
        .label-text { color: var(--text-muted); }
        .data-val { color: var(--val-accent); text-shadow: 0 0 6px rgba(238, 255, 0, 0.35); font-weight: 800; }
        .state-val { color: var(--highlight-color); text-shadow: 0 0 6px rgba(243, 108, 0, 0.35); font-weight: 800; }

        .action-btn-small {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            font-family: "JetBrains Mono", monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
            padding: 4px 10px;
            text-transform: uppercase;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-drop);
            height: 28px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            text-decoration: none;
        }

        .action-btn-small:hover {
            background: var(--hover-bg);
            color: var(--text-color);
        }

        .action-btn-small:active {
            box-shadow: var(--shadow-inset);
        }

        .output-wrapper {
            position: relative;
            padding: 12px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            margin-top: 12px;
            box-shadow: var(--shadow-drop);
        }

        .corner {
            position: absolute;
            width: 10px;
            height: 10px;
            border: 2px solid var(--highlight-color);
            pointer-events: none;
            z-index: 10;
        }
        .c-tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
        .c-tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
        .c-bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
        .c-br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }

        .output-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(502px, 1fr));
            gap: 0.125rem;
            min-height: 100px;
        }

        .dump-row-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
        }

        .dump-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            transition: all 0.15s ease;
            font-size: 12px;
            box-shadow: var(--shadow-drop);
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }

        .dump-row:hover {
            background: var(--hover-bg);
        }

        .tag {
            color: var(--highlight-color);
            font-weight: 700;
            user-select: none;
            flex-shrink: 0;
            font-size: 11px;
        }

        .stream-link {
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.15s ease;
            user-select: text;
        }

        .stream-link:visited,
        .stream-link.clicked {
            color: var(--text-muted) !important;
            opacity: 0.6 !important;
        }

        .stream-link:hover,
        .stream-link:focus {
            color: var(--highlight-color) !important;
            background: var(--hover-bg);
            outline: none;
            opacity: 1 !important;
        }

        .raw-val {
            color: inherit;
            user-select: text;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .footer-note {
            margin-top: 14px;
            font-size: 10px;
            color: var(--text-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed var(--highlight-color);
            padding-top: 8px;
            user-select: none;
        }

        ::selection {
            background: var(--highlight-color);
            color: #000;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="corner c-tl"></div>
        <div class="corner c-tr"></div>
        <div class="corner c-bl"></div>
        <div class="corner c-br"></div>

        <div class="header-meta">
            <span class="state-val">OXY_OS</span>
            <span class="hl-dim">|</span> EXTRACTED_STREAM_DUMP
            <span class="hl-dim">|</span> <span class="label-text">COUNT:</span> <span class="data-val">${count}</span>
            <span class="hl-dim">|</span> <span class="label-text">STREAM_MODE:</span> <span class="state-val">${filterMode.toUpperCase()}</span>
        </div>

        <div class="header-actions">
            <div class="btn-bg">
                <button id="dump-copy-btn" class="action-btn-small" title="Kopiuj zawartość do schowka">
                    <i class="fas fa-copy"></i> COPY ALL
                </button>
            </div>
            <div class="btn-bg">
                <button id="dump-dl-btn" class="action-btn-small" title="Pobierz plik tekstowy">
                    <i class="fas fa-download"></i> DOWNLOAD
                </button>
            </div>
            <div class="btn-bg">
                <button id="dump-theme-btn" class="action-btn-small" title="Przełącz motyw">
                    <i class="fas fa-adjust"></i> THEME
                </button>
            </div>
        </div>
    </div>

    <div class="output-wrapper">
        <div class="corner c-tl"></div>
        <div class="corner c-tr"></div>
        <div class="corner c-bl"></div>
        <div class="corner c-br"></div>
        <div class="output-container">${content}</div>
        <div class="footer-note">
            <span>TERMINAL DESERIALIZER | UTF-8 STREAM</span>
            <span>END OF DUMP</span>
        </div>
    </div>

    <script>
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.stream-link');
            if (link) {
                link.classList.add('clicked');
            }
        });

        document.getElementById('dump-copy-btn')?.addEventListener('click', function() {
            const rows = Array.from(document.querySelectorAll('.output-container .dump-row'));
            const text = rows.map(r => r.innerText.replace(/^\\[[A-Z]+\\]\\s*/, '')).join('\\n');
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('dump-copy-btn');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> COPIED!';
                setTimeout(() => btn.innerHTML = orig, 1000);
            });
        });

        document.getElementById('dump-dl-btn')?.addEventListener('click', function() {
            const htmlContent = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'OXY_OS_STREAM_DUMP.html';
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('dump-theme-btn')?.addEventListener('click', function() {
            const root = document.documentElement;
            root.classList.add('theme-switching');
            const isDark = root.getAttribute('data-theme') === 'dark';
            const next = isDark ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            root.setAttribute('theme', next);
            void window.getComputedStyle(root).cssText;
            setTimeout(() => {
                root.classList.remove('theme-switching');
            }, 50);
        });
    <\/script>
</body>
</html>`;
}

function openExportStreamTab(html) {
    const newTab = window.open('', '_blank');
    if (!newTab) return;

    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    newTab.location.href = url;
    newTab.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
}

function setupDevRepSettingsPanel(editor) {
    const M = window.MonacoEditorSettings;
    const btnOpen = document.getElementById('btn-open-settings');
    if (!M) {
        btnOpen?.addEventListener('click', () => {
            console.warn('Nie załadowano menu.js (MonacoEditorSettings).');
        });
        return;
    }

    M.setEditors(editor, null);

    const overlay = document.getElementById('settingsOverlay');
    const sidebar = document.getElementById('settingsSidebar');

    function setAria(open) {
        const v = open ? 'false' : 'true';
        overlay?.setAttribute('aria-hidden', v);
        sidebar?.setAttribute('aria-hidden', v);
    }

    function closePanel() {
        M.closeSettings();
        setAria(false);
    }

    btnOpen.addEventListener('click', () => {
        M.showSettings();
        setAria(true);
    });

    document.getElementById('btn-close-settings').addEventListener('click', closePanel);
    overlay?.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
            closePanel();
        }
    });

    sidebar?.addEventListener('click', (e) => e.stopPropagation());
}

require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    if (typeof window.defineMonacoThemes === 'function') {
        window.defineMonacoThemes();
    }

    const editorContainer = document.getElementById('editorContainer');

    if (window.MonacoEditorSettings) {
        window.MonacoEditorSettings.loadSettings();
    }

    const defaultValue =
        "// OXY_OS_TEST_DATA\n// Contact: admin@oxy-os.net\n// Docs: https://oxy-os.net/v3/docs\n// Ref: 9928347721-00x\n// SYSTEM KERNEL v3.11\n\nconst connectionUrl = 'https://api.oxy-os.net/v1/auth';\nlet node_id = 44215;\nlet secure_key = 'x882-9910-aa21';\nlet dev_email = 'dev_support@oxy-os.net';";

    // POBIERANIE ZAPISANEGO BUFORA
    const savedBuffer = localStorage.getItem('oxy_os_editor_buffer');
    const initialValue = savedBuffer !== null ? savedBuffer : defaultValue;

    const menuOpts = window.MonacoEditorSettings ? window.MonacoEditorSettings.getEditorOptions() : {};
    const monacoTheme = getStoredTheme() === 'dark' ? 'terminal-dark' : 'terminal-light';

    window.oxyEditor = monaco.editor.create(editorContainer, {
        ...menuOpts,
        value: initialValue, // Wstrzyknięcie pamięci lub domyślnych danych
        language: 'javascript',
        theme: monacoTheme,
        scrollbar: {
            verticalScrollbarSize: 4,
            horizontalScrollbarSize: 4,
            useShadows: false
        },
        padding: { top: 20, bottom: 20 }
    });

    setupDevRepSettingsPanel(window.oxyEditor);

    window.addEventListener('resize', () => {
        window.oxyEditor.layout();
    });

    const resultsGrid = document.getElementById('resultsGrid');
    const matchCount = document.getElementById('matchCount');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const btnExtract = document.getElementById('btn-extract');
    const btnWipe = document.getElementById('btn-wipe');
    const bufferStat = document.getElementById('buffer-stat');
    const btnCopyAll = document.getElementById('btn-copy-all');
    const btnOpenTab = document.getElementById('btn-open-tab');

    let currentFilter = 'all';
    let currentExtracts = [];

    const patterns = {
        links: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
        emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
        numbers: /\b\d{5,}\b/g
    };

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.type;
            extractData();
        });
    });

    btnExtract.addEventListener('click', extractData);

    btnWipe.addEventListener('click', () => {
        window.oxyEditor.setValue('');
        resultsGrid.innerHTML = '';
        currentExtracts = [];
        matchCount.innerText = '0';
        updateBuffer();
    });

    btnCopyAll.addEventListener('click', () => {
        if (currentExtracts.length === 0) return;

        const textToCopy = currentExtracts.map(item => item.val).join('\n');

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btnCopyAll.innerText;
            btnCopyAll.innerText = 'COPIED!';
            btnCopyAll.classList.add('copied');

            setTimeout(() => {
                btnCopyAll.innerText = originalText;
                btnCopyAll.classList.remove('copied');
                btnCopyAll.innerHTML = '<i class="fas fa-copy"></i> COPY';
            }, 800);
        });
    });

    function getItemIconHtml(type) {
        if (type === 'LIN') return '<i class="fas fa-link"></i>';
        if (type === 'EMA') return '<i class="fas fa-envelope"></i>';
        if (type === 'NUM') return '<i class="fas fa-hashtag"></i>';
        return '<i class="fas fa-code"></i>';
    }

    btnOpenTab.addEventListener('click', () => {
        if (currentExtracts.length === 0) return;

        const content = currentExtracts.map((item) => {
            const iconHtml = getItemIconHtml(item.type);
            if (item.type === 'LIN') {
                const url = item.val.startsWith('http://') || item.val.startsWith('https://') ? item.val : `https://${item.val}`;
                return `<div class="btn-bg dump-row-wrapper"><a href="${url}" target="_blank" rel="noopener noreferrer" class="dump-row stream-link"><span class="tag">${iconHtml}</span> <span class="raw-val">${item.val}</span></a></div>`;
            }
            if (item.type === 'EMA') {
                return `<div class="btn-bg dump-row-wrapper"><a href="mailto:${item.val}" class="dump-row stream-link"><span class="tag">${iconHtml}</span> <span class="raw-val">${item.val}</span></a></div>`;
            }
            return `<div class="btn-bg dump-row-wrapper"><div class="dump-row"><span class="tag">${iconHtml}</span> <span class="raw-val">${item.val}</span></div></div>`;
        }).join('\n');

        openExportStreamTab(
            buildExportStreamDocumentHtml(content, currentExtracts.length, currentFilter)
        );
    });

    function updateBuffer() {
        const size = (new TextEncoder().encode(window.oxyEditor.getValue()).length / 1024).toFixed(2);
        bufferStat.innerText = `${size} KB`;
    }

    function extractData() {
        const text = window.oxyEditor.getValue();
        resultsGrid.innerHTML = '';
        currentExtracts = [];

        if (currentFilter === 'all') {
            Object.keys(patterns).forEach((key) => {
                const found = text.match(patterns[key]) || [];
                found.forEach((val) => currentExtracts.push({ val, type: key.toUpperCase().slice(0, 3) }));
            });
        } else {
            const found = text.match(patterns[currentFilter]) || [];
            found.forEach((val) => currentExtracts.push({ val, type: currentFilter.toUpperCase().slice(0, 3) }));
        }

        matchCount.innerText = currentExtracts.length;
        updateBuffer();

        currentExtracts.forEach((item) => {
            const iconHtml = getItemIconHtml(item.type);
            const div = document.createElement('div');
            div.className = 'extracted-item';
            div.innerHTML = `<span class="type-tag">${iconHtml}</span>${item.val}`;
            div.onclick = () => {
                navigator.clipboard.writeText(item.val);
                if (item.type === 'LIN') {
                    const url = item.val.startsWith('http://') || item.val.startsWith('https://') ? item.val : `https://${item.val}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else if (item.type === 'EMA') {
                    window.open(`mailto:${item.val}`, '_blank');
                }
                div.style.backgroundColor = 'rgba(243, 108, 0, 0.4)';
                div.style.borderColor = '#f36c00';
                setTimeout(() => {
                    div.style.backgroundColor = 'rgba(255,255,255,0.03)';
                    div.style.borderColor = 'transparent';
                }, 400);
            };
            resultsGrid.appendChild(div);
        });
    }

    window.oxyEditor.onDidChangeModelContent(() => {
        updateBuffer();
        // ZAPISYWANIE BUFORA NA BIEŻĄCO DO LOCALSTORAGE
        localStorage.setItem('oxy_os_editor_buffer', window.oxyEditor.getValue());
    });

    extractData();
});