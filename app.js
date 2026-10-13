/**
 * 桃園市立楊梅高級中學語音電話分機一覽表 - 互動核心應用程式
 */

(function () {
  'use strict';

  // --- 1. 擬真 Web Audio API 音效引擎 ---
  const SoundEngine = {
    audioCtx: null,
    enabled: true,

    init() {
      // 讀取使用者音效偏好
      const saved = localStorage.getItem('ymsh_sound_enabled');
      this.enabled = saved !== null ? saved === 'true' : true;

      // 監聽第一次使用者互動時激活 AudioContext
      const unlockAudio = () => {
        if (!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.audioCtx = new AudioContext();
          }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      };
      document.addEventListener('click', unlockAudio);
      document.addEventListener('keydown', unlockAudio);
    },

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('ymsh_sound_enabled', this.enabled);
      if (this.enabled) {
        this.playSuccessChime();
      }
      return this.enabled;
    },

    ensureContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    },

    // 真實雙音多頻 (DTMF) 電話按鍵音
    playDtmf(key) {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const dtmfFreqs = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };

      const freqs = dtmfFreqs[key] || [697, 1209];
      const now = ctx.currentTime;
      const duration = 0.16;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.frequency.setValueAtTime(freqs[1], now);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    },

    // 複製成功 / 操作確認輕快和弦音
    playSuccessChime() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.06, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    },

    // 按鍵點擊音
    playClick() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    },

    // 電話響鈴音效 (撥號模擬)
    playRingback() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [440, 480]; // 標準響鈴頻率
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // 模擬兩聲嘟...嘟...
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.05, now + 0.05);
        gain.gain.setValueAtTime(0.05, now + 0.45);
        gain.gain.setValueAtTime(0, now + 0.5);

        gain.gain.setValueAtTime(0.05, now + 0.7);
        gain.gain.setValueAtTime(0.05, now + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.25);
      });
    }
  };

  // --- 2. 處室主題色與圖示映射配置 ---
  const CATEGORY_CONFIG = {
    '校長室': {
      color1: '#d97706',
      color2: '#b45309',
      accent: '#f59e0b',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    },
    '協力組織': {
      color1: '#475569',
      color2: '#334155',
      accent: '#64748b',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    },
    '人事室': {
      color1: '#7c3aed',
      color2: '#6d28d9',
      accent: '#8b5cf6',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
    },
    '會計室': {
      color1: '#059669',
      color2: '#047857',
      accent: '#10b981',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
    },
    '教務處': {
      color1: '#0284c7',
      color2: '#0369a1',
      accent: '#38bdf8',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
    },
    '總務處': {
      color1: '#16a34a',
      color2: '#15803d',
      accent: '#4ade80',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
    },
    '員生社': {
      color1: '#ea580c',
      color2: '#c2410c',
      accent: '#fb923c',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
    },
    '導師辦公室': {
      color1: '#65a30d',
      color2: '#4d7c0f',
      accent: '#a3e635',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path></svg>'
    },
    '專任教師辦公室': {
      color1: '#0d9488',
      color2: '#0f766e',
      accent: '#2dd4bf',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
    },
    '實驗室': {
      color1: '#4f46e5',
      color2: '#4338ca',
      accent: '#818cf8',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.35 19.3A2 2 0 0 0 6.06 22h11.88a2 2 0 0 0 1.71-2.7L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line></svg>'
    },
    '專科教室': {
      color1: '#2563eb',
      color2: '#1d4ed8',
      accent: '#60a5fa',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>'
    },
    '日新樓專科教室': {
      color1: '#0891b2',
      color2: '#0e7490',
      accent: '#22d3ee',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
    },
    '御風樓': {
      color1: '#ca8a04',
      color2: '#a16207',
      accent: '#facc15',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
    },
    '生科大樓': {
      color1: '#15803d',
      color2: '#166534',
      accent: '#86efac',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'
    },
    '實習處': {
      color1: '#c2410c',
      color2: '#9a3412',
      accent: '#fb923c',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>'
    },
    '學務處': {
      color1: '#e11d48',
      color2: '#be123c',
      accent: '#fb7185',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
    },
    '校安中心': {
      color1: '#dc2626',
      color2: '#991b1b',
      accent: '#f87171',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'
    },
    '輔導室': {
      color1: '#9333ea',
      color2: '#7e22ce',
      accent: '#c084fc',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
    },
    '圖書館': {
      color1: '#0284c7',
      color2: '#0369a1',
      accent: '#38bdf8',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
    }
  };

  // --- 3. 狀態管理 ---
  const AppState = {
    allEntries: [],
    meta: {},
    searchQuery: '',
    currentCategory: 'ALL', // 'ALL', 'FAV', or specific category name
    viewMode: 'cards', // 'cards' or 'table'
    fontSize: 'font-normal', // 'font-normal', 'font-large', 'font-xlarge'
    favorites: new Set(),
    dialpadBuffer: ''
  };

  // --- 4. 初始化 ---
  function initApp() {
    SoundEngine.init();

    // 載入資料
    if (window.SCHOOL_DIRECTORY_DATA) {
      AppState.allEntries = window.SCHOOL_DIRECTORY_DATA.entries || [];
      AppState.meta = window.SCHOOL_DIRECTORY_DATA.meta || {};
    } else {
      console.error('未找到 SCHOOL_DIRECTORY_DATA 資料集！');
    }

    // 讀取常用收藏
    try {
      const savedFavs = JSON.parse(localStorage.getItem('ymsh_favorites') || '[]');
      AppState.favorites = new Set(savedFavs);
    } catch (e) {
      AppState.favorites = new Set();
    }

    // 讀取字體大小設定
    const savedFont = localStorage.getItem('ymsh_font_size');
    if (savedFont) {
      AppState.fontSize = savedFont;
      document.body.className = savedFont;
    }

    // 綁定事件監聽
    setupEventListeners();

    // 繪製分類過濾標籤列
    renderFilterTags();

    // 渲染分機清單
    renderDirectory();

    // 更新音效按鈕狀態
    updateSoundButton();
  }

  // --- 5. DOM 事件監聽 ---
  function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const fontToggleBtn = document.getElementById('font-toggle-btn');
    const dialpadToggleBtn = document.getElementById('dialpad-toggle-btn');
    const floatDialBtn = document.getElementById('float-dial-btn');
    const printBtn = document.getElementById('print-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const viewCardsBtn = document.getElementById('view-cards-btn');
    const viewTableBtn = document.getElementById('view-table-btn');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    // 搜尋輸入
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value.trim().toLowerCase();
        if (searchClearBtn) {
          searchClearBtn.style.display = AppState.searchQuery ? 'flex' : 'none';
        }
        renderDirectory();
      });

      // 快速鍵 '/' 聚焦搜尋
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        } else if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.value = '';
          AppState.searchQuery = '';
          searchClearBtn.style.display = 'none';
          renderDirectory();
        }
      });
    }

    // 清除搜尋
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        AppState.searchQuery = '';
        searchClearBtn.style.display = 'none';
        renderDirectory();
      });
    }

    // 音效切換
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const isEnabled = SoundEngine.toggle();
        updateSoundButton();
        showToast(isEnabled ? '🔊 音效已開啟' : '🔇 音效已靜音');
      });
    }

    // 字體大小切換
    if (fontToggleBtn) {
      fontToggleBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        toggleFontSize();
      });
    }

    // 撥號盤開啟
    const openDialpad = () => {
      SoundEngine.playClick();
      openDialpadModal();
    };
    if (dialpadToggleBtn) dialpadToggleBtn.addEventListener('click', openDialpad);
    if (floatDialBtn) floatDialBtn.addEventListener('click', openDialpad);

    // 列印
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        window.print();
      });
    }

    // 匯出 CSV
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        SoundEngine.playSuccessChime();
        exportToCsv();
      });
    }

    // 檢視模式切換 (卡片 / 表格)
    if (viewCardsBtn && viewTableBtn) {
      viewCardsBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        AppState.viewMode = 'cards';
        viewCardsBtn.classList.add('active');
        viewTableBtn.classList.remove('active');
        renderDirectory();
      });
      viewTableBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        AppState.viewMode = 'table';
        viewTableBtn.classList.add('active');
        viewCardsBtn.classList.remove('active');
        renderDirectory();
      });
    }

    // 回到頂部按鈕
    window.addEventListener('scroll', () => {
      if (backToTopBtn) {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 撥號盤內按鍵綁定
    setupDialpadEvents();
  }

  // --- 6. 字體大小調節器 ---
  function toggleFontSize() {
    const fontBtn = document.getElementById('font-toggle-btn');
    if (AppState.fontSize === 'font-normal') {
      AppState.fontSize = 'font-large';
      showToast('🔠 字體已切換為：放大 (115%)');
    } else if (AppState.fontSize === 'font-large') {
      AppState.fontSize = 'font-xlarge';
      showToast('🔠 字體已切換為：特大 (130%)');
    } else {
      AppState.fontSize = 'font-normal';
      showToast('🔠 字體已切換為：標準 (100%)');
    }

    document.body.className = AppState.fontSize;
    localStorage.setItem('ymsh_font_size', AppState.fontSize);
  }

  // --- 7. 更新音效開關 UI ---
  function updateSoundButton() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;
    if (SoundEngine.enabled) {
      btn.classList.add('active');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <span>音效：開</span>
      `;
    } else {
      btn.classList.remove('active');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
        <span>音效：關</span>
      `;
    }
  }

  // --- 8. 篩選標籤列渲染 ---
  function renderFilterTags() {
    const container = document.getElementById('filter-tags');
    if (!container) return;

    // 取得所有分類清單
    const categories = Array.from(new Set(AppState.allEntries.map(e => e.category)));

    let html = `
      <button class="tag-btn ${AppState.currentCategory === 'ALL' ? 'active' : ''}" data-category="ALL">
        <span>全部處室與分機</span>
        <span class="tag-badge">${AppState.allEntries.length}</span>
      </button>
      <button class="tag-btn ${AppState.currentCategory === 'FAV' ? 'active' : ''}" data-category="FAV">
        <span>⭐ 常用分機</span>
        <span class="tag-badge" id="fav-count-badge">${AppState.favorites.size}</span>
      </button>
    `;

    categories.forEach(cat => {
      const count = AppState.allEntries.filter(e => e.category === cat).length;
      const isActive = AppState.currentCategory === cat ? 'active' : '';
      html += `
        <button class="tag-btn ${isActive}" data-category="${cat}">
          <span>${cat}</span>
          <span class="tag-badge">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    // 綁定點擊事件
    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundEngine.playClick();
        AppState.currentCategory = btn.getAttribute('data-category');
        renderFilterTags();
        renderDirectory();
      });
    });
  }

  // --- 9. 核心渲染分機清單 ---
  function renderDirectory() {
    const container = document.getElementById('directory-content');
    const resultsCountEl = document.getElementById('results-count');
    if (!container) return;

    // 1. 依分類及收藏進行過濾
    let filtered = AppState.allEntries;
    if (AppState.currentCategory === 'FAV') {
      filtered = filtered.filter(item => {
        const id = getEntryId(item);
        return AppState.favorites.has(id);
      });
    } else if (AppState.currentCategory !== 'ALL') {
      filtered = filtered.filter(item => item.category === AppState.currentCategory);
    }

    // 2. 依搜尋關鍵字進行檢索
    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      filtered = filtered.filter(item => {
        return (
          item.category.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.ext.toLowerCase().includes(q) ||
          item.direct.toLowerCase().includes(q) ||
          item.building.toLowerCase().includes(q) ||
          (item.search_str && item.search_str.includes(q))
        );
      });
    }

    // 更新筆數顯示
    if (resultsCountEl) {
      resultsCountEl.innerHTML = `共 <span>${filtered.length}</span> 筆分機資料`;
    }

    // 無結果提示
    if (filtered.length === 0) {
      if (AppState.currentCategory === 'FAV') {
        container.innerHTML = `
          <div class="no-results-box">
            <div class="no-results-icon">⭐</div>
            <div class="no-results-title">尚未收藏任何常用分機</div>
            <div class="no-results-desc">點擊分機卡片右上角的星星圖示，即可將常撥分機加入此頁面，方便隨時快速查找！</div>
            <button class="tag-btn active" style="margin: 0 auto;" onclick="document.querySelector('[data-category=ALL]').click()">瀏覽全部分機</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="no-results-box">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-title">找不到符合「${escapeHtml(AppState.searchQuery)}」的分機</div>
            <div class="no-results-desc">請嘗試搜尋不同關鍵字（例如：「教務處」、「1101」、「李主任」、「導師」、「健康中心」等）。</div>
            <button class="tag-btn active" style="margin: 0 auto;" onclick="document.getElementById('search-clear-btn').click()">清除搜尋條件</button>
          </div>
        `;
      }
      return;
    }

    // 依處室群組分組
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    // 渲染卡片或表格
    if (AppState.viewMode === 'cards') {
      container.innerHTML = renderCardsView(groups);
    } else {
      container.innerHTML = renderTableView(groups);
    }

    // 綁定分機卡片互動事件 (複製、撥打、收藏)
    bindCardInteractions(container);
  }

  // --- 10. 產生卡片視圖 HTML ---
  function renderCardsView(groups) {
    let html = '';

    for (const [catName, items] of Object.entries(groups)) {
      const config = CATEGORY_CONFIG[catName] || {
        color1: '#2563eb',
        color2: '#1d4ed8',
        accent: '#3b82f6',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'
      };

      // 提取該處室專線與傳真
      const directLines = items.filter(it => it.direct && it.direct.length >= 7);

      html += `
        <div class="category-section" style="--cat-color-1: ${config.color1}; --cat-color-2: ${config.color2};">
          <div class="category-header">
            <div class="cat-title-group">
              <div class="cat-icon">${config.icon}</div>
              <div class="cat-name">${escapeHtml(catName)}</div>
              <span class="cat-badge">${items.length} 項</span>
            </div>
            ${renderDirectLinePills(directLines)}
          </div>
          <div class="cards-grid">
            ${items.map(item => renderSingleCard(item, config)).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  // 渲染處室標題列的專線膠囊
  function renderDirectLinePills(directLines) {
    if (!directLines || directLines.length === 0) return '';
    return `
      <div class="cat-direct-lines">
        ${directLines.map(line => {
          const isFax = line.role.includes('傳真') || line.note.includes('傳真');
          const type = isFax ? '傳真' : '直撥專線';
          return `
            <div class="direct-line-pill ${isFax ? 'fax' : ''}" 
                 data-copy="${line.direct}" 
                 data-number="${line.direct}"
                 title="點擊撥打或複製${type}">
              <span class="pill-tag">${type}</span>
              <span>${formatPhoneNumber(line.direct)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 渲染單張卡片
  function renderSingleCard(item, config) {
    const id = getEntryId(item);
    const isFav = AppState.favorites.has(id);
    const roleHtml = highlightText(item.role, AppState.searchQuery);
    const nameHtml = item.name ? highlightText(item.name, AppState.searchQuery) : '';
    const buildingHtml = highlightText(item.building || '', AppState.searchQuery);

    let numberHtml = '';
    if (item.ext) {
      const exts = item.ext.split(',').map(s => s.trim());
      numberHtml = exts.map(ex => `
        <span class="ext-badge" data-ext="${ex}" title="點擊試撥分機 ${ex}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          ${highlightText(ex, AppState.searchQuery)}
        </span>
      `).join('');
    } else if (item.direct) {
      numberHtml = `
        <span class="ext-badge direct-badge" data-direct="${item.direct}" title="點擊複製直撥專線">
          ${item.role.includes('傳真') ? '📠' : '📞'} ${highlightText(formatPhoneNumber(item.direct), AppState.searchQuery)}
        </span>
      `;
    }

    return `
      <div class="contact-card" style="--card-accent: ${config.accent};" data-id="${id}">
        <div class="card-top">
          <div class="card-info">
            <div class="card-role">${roleHtml}</div>
            ${nameHtml ? `<div class="card-name">👤 ${nameHtml}</div>` : ''}
            ${buildingHtml ? `
              <div class="card-building">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                ${buildingHtml} ${item.note ? `· ${escapeHtml(item.note)}` : ''}
              </div>
            ` : ''}
          </div>
          <button class="card-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${id}" title="${isFav ? '取消常用' : '加入常用'}">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
        <div class="card-bottom">
          <div class="ext-badge-group">
            ${numberHtml}
          </div>
          <div class="card-action-btns">
            <button class="act-btn copy-btn" data-copy="${item.ext || item.direct}" title="一鍵複製分機">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="act-btn call-btn" data-dial="${item.ext || item.direct}" data-name="${escapeHtml(item.role + ' ' + (item.name || ''))}" title="模擬撥號 / 快速通話">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- 11. 產生表格視圖 HTML ---
  function renderTableView(groups) {
    let html = '';

    for (const [catName, items] of Object.entries(groups)) {
      const config = CATEGORY_CONFIG[catName] || { color1: '#2563eb', color2: '#1d4ed8' };

      html += `
        <div class="category-section" style="--cat-color-1: ${config.color1}; --cat-color-2: ${config.color2};">
          <div class="category-header">
            <div class="cat-title-group">
              <div class="cat-name">${escapeHtml(catName)}</div>
              <span class="cat-badge">${items.length} 筆</span>
            </div>
          </div>
          <div class="table-view-container">
            <table class="directory-table">
              <thead>
                <tr>
                  <th style="width: 50px;">常用</th>
                  <th>單位 / 職稱</th>
                  <th>人員姓名</th>
                  <th>分機號碼</th>
                  <th>大樓地點 / 備註</th>
                  <th style="width: 120px;">快速操作</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => {
                  const id = getEntryId(item);
                  const isFav = AppState.favorites.has(id);
                  return `
                    <tr data-id="${id}">
                      <td style="text-align: center;">
                        <button class="card-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${id}">
                          ${isFav ? '★' : '☆'}
                        </button>
                      </td>
                      <td><strong>${highlightText(item.role, AppState.searchQuery)}</strong></td>
                      <td>${item.name ? highlightText(item.name, AppState.searchQuery) : '<span style="color:#94a3b8;">-</span>'}</td>
                      <td class="ext-cell">
                        ${item.ext ? highlightText(item.ext, AppState.searchQuery) : (item.direct ? '📞 ' + highlightText(formatPhoneNumber(item.direct), AppState.searchQuery) : '-')}
                      </td>
                      <td>
                        ${item.building || ''} ${item.note ? `(${escapeHtml(item.note)})` : ''}
                      </td>
                      <td>
                        <div class="card-action-btns">
                          <button class="act-btn copy-btn" data-copy="${item.ext || item.direct}" title="複製號碼">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </button>
                          <button class="act-btn call-btn" data-dial="${item.ext || item.direct}" data-name="${escapeHtml(item.role + ' ' + (item.name || ''))}" title="撥號">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return html;
  }

  // --- 12. 綁定卡片點擊與互動 ---
  function bindCardInteractions(root) {
    // 收藏點擊
    root.querySelectorAll('.card-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundEngine.playClick();
        const id = btn.getAttribute('data-fav-id');
        if (AppState.favorites.has(id)) {
          AppState.favorites.delete(id);
          showToast('已自常用分機移除');
        } else {
          AppState.favorites.add(id);
          SoundEngine.playSuccessChime();
          showToast('⭐ 已加入常用分機！');
        }
        localStorage.setItem('ymsh_favorites', JSON.stringify(Array.from(AppState.favorites)));
        renderFilterTags();
        renderDirectory();
      });
    });

    // 複製點擊
    root.querySelectorAll('.copy-btn, .direct-line-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-copy');
        if (text) {
          copyToClipboard(text);
        }
      });
    });

    // 分機號碼點擊 -> 播放撥號音並提示複製或試撥
    root.querySelectorAll('.ext-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const ext = badge.getAttribute('data-ext');
        if (ext) {
          SoundEngine.playDtmf(ext[0] || '1');
          copyToClipboard(ext, `分機 ${ext} 已複製`);
        }
      });
    });

    // 撥打按鈕點擊
    root.querySelectorAll('.call-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.getAttribute('data-dial');
        const name = btn.getAttribute('data-name');
        handleCallAction(target, name);
      });
    });
  }

  // --- 13. 通話或模擬通話動作處理 ---
  function handleCallAction(number, name) {
    SoundEngine.playRingback();

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (isMobile) {
      // 在手機上：若為分機，嘗試使用語音撥號格式 034789618,分機
      if (number.length <= 4) {
        const telUrl = `tel:034789618,${number}`;
        window.location.href = telUrl;
      } else {
        const cleanNum = number.replace(/\D/g, '');
        window.location.href = `tel:${cleanNum.startsWith('03') ? cleanNum : '03' + cleanNum}`;
      }
    } else {
      // 在電腦上：彈出撥號模擬通知
      showToast(`📞 正在模擬撥號中：${name} (${number})`);
      // 同步開啟撥號盤並填入號碼
      openDialpadModal(number);
    }
  }

  // --- 14. 虛擬撥號盤互動邏輯 ---
  function setupDialpadEvents() {
    const modal = document.getElementById('dialpad-modal');
    const closeBtn = document.getElementById('dialpad-close-btn');
    const displayNum = document.getElementById('dialpad-number');
    const previewMatch = document.getElementById('dialpad-match');
    const clearBtn = document.getElementById('dial-clear-btn');
    const callBtn = document.getElementById('dial-call-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        closeDialpadModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeDialpadModal();
        }
      });
    }

    // 數字鍵點擊 (0-9, *, #)
    document.querySelectorAll('.dial-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const digit = btn.getAttribute('data-digit');
        if (digit) {
          SoundEngine.playDtmf(digit);
          if (AppState.dialpadBuffer.length < 10) {
            AppState.dialpadBuffer += digit;
            updateDialpadDisplay();
          }
        }
      });
    });

    // 清除按鍵
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        SoundEngine.playClick();
        if (AppState.dialpadBuffer.length > 0) {
          AppState.dialpadBuffer = AppState.dialpadBuffer.slice(0, -1);
        } else {
          AppState.dialpadBuffer = '';
        }
        updateDialpadDisplay();
      });
    }

    // 撥出按鍵
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        if (!AppState.dialpadBuffer) {
          showToast('請先輸入分機或電話號碼');
          return;
        }
        SoundEngine.playRingback();
        showToast(`📞 撥出號碼：${AppState.dialpadBuffer}`);
      });
    }

    // 鍵盤輸入監聽 (在撥號盤開啟時支援實體數字鍵)
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('dialpad-modal');
      if (modal && modal.classList.contains('active')) {
        if ('0123456789*#'.includes(e.key)) {
          SoundEngine.playDtmf(e.key);
          AppState.dialpadBuffer += e.key;
          updateDialpadDisplay();
        } else if (e.key === 'Backspace') {
          SoundEngine.playClick();
          AppState.dialpadBuffer = AppState.dialpadBuffer.slice(0, -1);
          updateDialpadDisplay();
        } else if (e.key === 'Escape') {
          closeDialpadModal();
        }
      }
    });
  }

  function openDialpadModal(initialDigits = '') {
    const modal = document.getElementById('dialpad-modal');
    if (!modal) return;
    AppState.dialpadBuffer = initialDigits || '';
    updateDialpadDisplay();
    modal.classList.add('active');
  }

  function closeDialpadModal() {
    const modal = document.getElementById('dialpad-modal');
    if (!modal) return;
    modal.classList.remove('active');
  }

  function updateDialpadDisplay() {
    const displayNum = document.getElementById('dialpad-number');
    const previewMatch = document.getElementById('dialpad-match');
    if (!displayNum || !previewMatch) return;

    displayNum.textContent = AppState.dialpadBuffer || '---';

    if (!AppState.dialpadBuffer) {
      previewMatch.textContent = '輸入分機號碼即時比對';
      return;
    }

    // 比對分機
    const match = AppState.allEntries.find(e => {
      if (e.ext && e.ext.split(',').some(x => x.trim() === AppState.dialpadBuffer)) {
        return true;
      }
      if (e.direct && e.direct.replace(/\D/g, '') === AppState.dialpadBuffer) {
        return true;
      }
      return false;
    });

    if (match) {
      previewMatch.innerHTML = `✅ <strong style="color:#38bdf8;">${match.category}</strong> - ${match.role} ${match.name ? `(${match.name})` : ''}`;
    } else {
      // 模糊前綴比對
      const partials = AppState.allEntries.filter(e => e.ext && e.ext.includes(AppState.dialpadBuffer));
      if (partials.length > 0) {
        previewMatch.textContent = `找到 ${partials.length} 筆可能分機 (如 ${partials[0].role} ${partials[0].name || ''})`;
      } else {
        previewMatch.textContent = '無完全相符分機';
      }
    }
  }

  // --- 15. 剪貼簿複製 ---
  function copyToClipboard(text, customMessage) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      SoundEngine.playSuccessChime();
      showToast(customMessage || `📋 已複製：${text}`);
    }).catch(err => {
      console.warn('Clipboard API 失敗，使用備用方案', err);
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      SoundEngine.playSuccessChime();
      showToast(customMessage || `📋 已複製：${text}`);
    });
  }

  // --- 16. Toast 提示通知 ---
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 清除舊的 toast
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✨</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 2800);
  }

  // --- 17. 匯出 CSV 一覽表 ---
  function exportToCsv() {
    const headers = ['處室/分類', '大樓/位置', '單位職稱', '人員姓名', '分機號碼', '直撥專線', '備註說明'];
    const rows = AppState.allEntries.map(e => [
      e.category,
      e.building,
      e.role,
      e.name,
      e.ext,
      e.direct,
      e.note || ''
    ]);

    // 加入 BOM 確保 Excel 開啟時繁體中文不亂碼
    let csvContent = '\uFEFF';
    csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';

    rows.forEach(row => {
      csvContent += row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `楊梅高中分機一覽表_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📊 分機一覽表 CSV 已成功匯出！');
  }

  // --- 18. 輔助函式 ---
  function getEntryId(item) {
    return `${item.category}_${item.role}_${item.name}_${item.ext}_${item.direct}`.replace(/\s+/g, '');
  }

  function formatPhoneNumber(num) {
    if (!num) return '';
    if (num.length === 7) {
      return `${num.slice(0, 3)}-${num.slice(3)}`;
    }
    return num;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightText(text, query) {
    if (!text) return '';
    if (!query) return escapeHtml(text);

    const safeText = escapeHtml(text);
    const safeQuery = escapeHtml(query);
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return safeText.replace(regex, '<mark class="highlight">$1</mark>');
  }

  // 頁面載入就緒時啟動應用
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
