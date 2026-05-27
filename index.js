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
}

function setupThemeToggle() {
    applyAppTheme(getStoredTheme());

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
        applyAppTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
    });
}

setupThemeToggle();

function buildExportStreamDocumentHtml(content, count, filterMode) {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>OXY_OS // EXPORT_STREAM</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;500;800&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #121212;
            background-image:
               repeating-linear-gradient(45deg,
            transparent,
            transparent 10px,
            rgba(243, 108, 0, 0.05) 10px,
            rgba(243, 108, 0, 0.05) 11px);
            background-size: 100% 100%, 20px 20px, 20px 20px;
            background-attachment: fixed;
            color: #ffffff;
            font-family: "JetBrains Mono", monaco, courier, monospace;
            padding: 25px;
            margin: 0;
            font-weight: 800;
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.2;
            user-select: none;
            scrollbar-width: none;
        }

        .header {
            color: #f36c00;
            border-bottom: 1px solid #333;
            padding-bottom: 12px;
            margin-bottom: 20px;
            font-weight: 700;
            letter-spacing: 2px;
            font-size: 14px;
            text-transform: uppercase;
            background: #121212;
        }

        .hl-dim { color: #ccc; margin: 0 6px; }
        .label-text { color: #ccc; }
        .data-val { color: #eeff00; text-shadow: 0 0 4px rgba(255,255,255,0.3); }
        .state-val { color: #f36c00; text-shadow: 0 0 4px rgba(243,108,0,0.3); }

        .output-wrapper {
            position: relative;
            padding: 10px;
            background: #212121;
            border: 1px solid #333;
            border-radius: 0;
        }

        .corner {
            position: absolute;
            width: 10px;
            height: 10px;
            border: 2px solid #f36c00;
        }
        .c-tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
        .c-tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
        .c-bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
        .c-br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }

        .tag {
            color: #f36c00;
            font-weight: 700;
            user-select: none;
        }
        .stream-link {
            color: #ffffff;
            text-decoration: none;
            border-bottom: 1px dashed #555555;
            transition: all 0.2s ease;
            user-select: text;
        }
        .stream-link:visited,
        .stream-link.clicked {
            color: #ccc !important;
            border-bottom-color: #333333 !important;
            opacity: 0.6 !important;
        }
        .stream-link:hover,
        .stream-link:focus {
            color: #f36c00 !important;
            border-bottom-color: #f36c00 !important;
            background: rgba(243, 108, 0, 0.1);
            outline: none;
            opacity: 1 !important;
        }
        .raw-val {
            color: #ffffff;
            user-select: text;
        }
        ::selection {
            background: #f36c00;
            color: #000;
        }

        .output-container {
            position: relative;
            top: -50px;
        }
    </style>
</head>
<body>
    <div class="header"><span class="state-val">OXY_OS</span> <span class="hl-dim">|</span> EXTRACTED_STREAM_DUMP <span class="hl-dim">|</span> <span class="label-text">COUNT:</span> <span class="data-val">${count}</span> <span class="hl-dim">|</span> <span class="label-text">STREAM_MODE:</span> <span class="state-val">${filterMode.toUpperCase()}</span></div>

    <div class="output-wrapper">
        <div class="corner c-tl"></div>
        <div class="corner c-tr"></div>
        <div class="corner c-bl"></div>
        <div class="corner c-br"></div>
        <div class="output-container">${content}</div>
    </div>

    <script>
        document.body.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('stream-link')) {
                e.target.classList.add('clicked');
            }
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

    btnOpenTab.addEventListener('click', () => {
        if (currentExtracts.length === 0) return;

        const content = currentExtracts.map((item) => {
            if (item.type === 'LIN') {
                return `<span class="tag">[LIN]</span> <a href="${item.val}" target="_blank" class="stream-link">${item.val}</a>`;
            }
            if (item.type === 'EMA') {
                return `<span class="tag">[EMA]</span> <a href="mailto:${item.val}" class="stream-link">${item.val}</a>`;
            }
            return `<span class="tag">[${item.type}]</span> <span class="raw-val">${item.val}</span>`;
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
            const div = document.createElement('div');
            div.className = 'extracted-item';
            div.innerHTML = `<span class="type-tag">[${item.type}]</span>${item.val}`;
            div.onclick = () => {
                navigator.clipboard.writeText(item.val);
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