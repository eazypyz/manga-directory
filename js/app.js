/**
 * Manga Directory - Main Application
 * Community-driven manga site directory
 * No database - reads directly from JSON files
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        dataFiles: [
            'sites/indonesia.json',
            'sites/english.json',
            'sites/japanese.json',
            'sites/korean.json'
        ],
        newThresholdDays: 7, // Sites added within 7 days are marked as "new"
        cacheDuration: 5 * 60 * 1000, // 5 minutes cache
    };

    // State
    let state = {
        allSites: [],
        filteredSites: [],
        filters: {
            search: '',
            language: '',
            country: '',
            genre: '',
            status: ''
        },
        sortBy: 'name',
        viewMode: 'grid',
        isLoading: true,
        cache: null,
        cacheTime: null
    };

    // DOM Elements
    const elements = {};

    // Initialize
    function init() {
        cacheElements();
        bindEvents();
        loadData();
    }

    function cacheElements() {
        elements.searchInput = document.getElementById('search-input');
        elements.searchClear = document.getElementById('search-clear');
        elements.filterLanguage = document.getElementById('filter-language');
        elements.filterCountry = document.getElementById('filter-country');
        elements.filterGenre = document.getElementById('filter-genre');
        elements.filterStatus = document.getElementById('filter-status');
        elements.sortBy = document.getElementById('sort-by');
        elements.resetFilters = document.getElementById('reset-filters');
        elements.activeFilters = document.getElementById('active-filters');
        elements.resultsCount = document.getElementById('results-count');
        elements.skeletonLoader = document.getElementById('skeleton-loader');
        elements.sitesGrid = document.getElementById('sites-grid');
        elements.emptyState = document.getElementById('empty-state');
        elements.clearSearch = document.getElementById('clear-search');
        elements.viewBtns = document.querySelectorAll('.view-btn');

        // Stats
        elements.statTotal = document.getElementById('stat-total');
        elements.statOnline = document.getElementById('stat-online');
        elements.statOffline = document.getElementById('stat-offline');
        elements.statLanguages = document.getElementById('stat-languages');
        elements.statCountries = document.getElementById('stat-countries');
    }

    function bindEvents() {
        // Search
        elements.searchInput.addEventListener('input', debounce((e) => {
            state.filters.search = e.target.value.toLowerCase().trim();
            elements.searchClear.style.display = state.filters.search ? 'flex' : 'none';
            applyFilters();
        }, 300));

        elements.searchClear.addEventListener('click', () => {
            elements.searchInput.value = '';
            state.filters.search = '';
            elements.searchClear.style.display = 'none';
            applyFilters();
        });

        // Filters
        elements.filterLanguage.addEventListener('change', (e) => {
            state.filters.language = e.target.value;
            applyFilters();
        });

        elements.filterCountry.addEventListener('change', (e) => {
            state.filters.country = e.target.value;
            applyFilters();
        });

        elements.filterGenre.addEventListener('change', (e) => {
            state.filters.genre = e.target.value;
            applyFilters();
        });

        elements.filterStatus.addEventListener('change', (e) => {
            state.filters.status = e.target.value;
            applyFilters();
        });

        // Sort
        elements.sortBy.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            applyFilters();
        });

        // Reset
        elements.resetFilters.addEventListener('click', resetAllFilters);
        elements.clearSearch.addEventListener('click', resetAllFilters);

        // View toggle
        elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                state.viewMode = view;
                elements.viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                elements.sitesGrid.classList.toggle('list-view', view === 'list');
            });
        });
    }

    // Data Loading
    async function loadData() {
        state.isLoading = true;
        showSkeleton();

        // Check cache
        const now = Date.now();
        if (state.cache && state.cacheTime && (now - state.cacheTime < CONFIG.cacheDuration)) {
            state.allSites = state.cache;
            finishLoading();
            return;
        }

        try {
            const fetchPromises = CONFIG.dataFiles.map(file => 
                fetch(file)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to load ${file}`);
                        return res.json();
                    })
                    .catch(err => {
                        console.warn(`Error loading ${file}:`, err);
                        return [];
                    })
            );

            const results = await Promise.all(fetchPromises);
            state.allSites = results.flat();

            // Cache
            state.cache = state.allSites;
            state.cacheTime = Date.now();

            finishLoading();
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Gagal memuat data. Silakan refresh halaman.');
        }
    }

    function finishLoading() {
        state.isLoading = false;
        state.filteredSites = [...state.allSites];

        populateFilterOptions();
        updateStats();
        applyFilters();
        hideSkeleton();
    }

    function showSkeleton() {
        elements.skeletonLoader.style.display = 'grid';
        elements.sitesGrid.style.display = 'none';
        elements.emptyState.style.display = 'none';
    }

    function hideSkeleton() {
        elements.skeletonLoader.style.display = 'none';
        elements.sitesGrid.style.display = 'grid';
    }

    function showError(message) {
        elements.skeletonLoader.style.display = 'none';
        elements.sitesGrid.style.display = 'none';
        elements.emptyState.style.display = 'block';
        elements.emptyState.innerHTML = `
            <div class="empty-icon">⚠️</div>
            <h3>Terjadi Kesalahan</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Refresh Halaman</button>
        `;
    }

    // Populate Filter Options
    function populateFilterOptions() {
        const languages = new Set();
        const countries = new Set();
        const genres = new Set();

        state.allSites.forEach(site => {
            if (site.language) {
                site.language.forEach(lang => languages.add(lang));
            }
            if (site.country) countries.add(site.country);
            if (site.genres) {
                site.genres.forEach(g => genres.add(g));
            }
        });

        fillSelect(elements.filterLanguage, Array.from(languages).sort());
        fillSelect(elements.filterCountry, Array.from(countries).sort());
        fillSelect(elements.filterGenre, Array.from(genres).sort());
    }

    function fillSelect(select, items) {
        const currentValue = select.value;
        // Keep first option
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });

        select.value = currentValue;
    }

    // Filtering & Sorting
    function applyFilters() {
        let result = [...state.allSites];

        // Search
        if (state.filters.search) {
            const query = state.filters.search;
            result = result.filter(site => 
                site.name.toLowerCase().includes(query) ||
                (site.description && site.description.toLowerCase().includes(query)) ||
                (site.url && site.url.toLowerCase().includes(query)) ||
                (site.genres && site.genres.some(g => g.toLowerCase().includes(query)))
            );
        }

        // Language
        if (state.filters.language) {
            result = result.filter(site => 
                site.language && site.language.includes(state.filters.language)
            );
        }

        // Country
        if (state.filters.country) {
            result = result.filter(site => site.country === state.filters.country);
        }

        // Genre
        if (state.filters.genre) {
            result = result.filter(site => 
                site.genres && site.genres.includes(state.filters.genre)
            );
        }

        // Status
        if (state.filters.status) {
            result = result.filter(site => site.status === state.filters.status);
        }

        // Sort
        result = sortSites(result);

        state.filteredSites = result;
        renderSites();
        updateActiveFilters();
        updateResultsCount();
    }

    function sortSites(sites) {
        const sorted = [...sites];

        switch (state.sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                sorted.sort((a, b) => {
                    const dateA = a.added_at ? new Date(a.added_at) : new Date(0);
                    const dateB = b.added_at ? new Date(b.added_at) : new Date(0);
                    return dateB - dateA;
                });
                break;
            case 'popularity':
                sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
        }

        return sorted;
    }

    // Rendering
    function renderSites() {
        if (state.filteredSites.length === 0) {
            elements.sitesGrid.style.display = 'none';
            elements.emptyState.style.display = 'block';
            return;
        }

        elements.sitesGrid.style.display = 'grid';
        elements.emptyState.style.display = 'none';
        elements.sitesGrid.classList.toggle('list-view', state.viewMode === 'list');

        elements.sitesGrid.innerHTML = state.filteredSites.map((site, index) => 
            createSiteCard(site, index)
        ).join('');
    }

    function createSiteCard(site, index) {
        const isNew = isRecentlyAdded(site.added_at);
        const isOffline = site.status === 'offline';
        const primaryLang = site.language ? site.language[0] : 'Unknown';

        const delay = Math.min(index * 0.05, 0.5);

        return `
            <article class="site-card ${isOffline ? 'offline' : ''}" style="animation-delay: ${delay}s">
                <div class="site-card-header">
                    <div class="site-title-group">
                        <h3 class="site-name" title="${escapeHtml(site.name)}">${escapeHtml(site.name)}</h3>
                        <span class="site-url">${escapeHtml(site.url)}</span>
                    </div>
                    <div class="site-badges-top">
                        ${isNew ? '<span class="badge badge-new">Baru</span>' : ''}
                        ${site.nsfw ? '<span class="badge badge-nsfw">NSFW</span>' : ''}
                        ${isOffline ? '<span class="badge badge-offline">Offline</span>' : '<span class="badge badge-online">Online</span>'}
                    </div>
                </div>
                <div class="site-card-body">
                    <p class="site-description">${escapeHtml(site.description || 'Tidak ada deskripsi.')}</p>
                    <div class="site-meta">
                        <span class="site-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            ${escapeHtml(site.country || 'Unknown')}
                        </span>
                        <span class="site-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h15l-1.5 9h-12z"></path><circle cx="7.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
                            ${escapeHtml(primaryLang)}
                        </span>
                    </div>
                    <div class="site-genres">
                        ${(site.genres || []).slice(0, 4).map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join('')}
                        ${(site.genres || []).length > 4 ? `<span class="genre-tag">+${site.genres.length - 4}</span>` : ''}
                    </div>
                </div>
                <div class="site-card-footer">
                    <span class="site-date">${formatDate(site.added_at)}</span>
                    <div class="site-actions">
                        <a href="${escapeHtml(site.url)}" target="_blank" rel="noopener noreferrer" class="btn-visit ${isOffline ? 'offline' : ''}">
                            ${isOffline ? 'Offline' : 'Kunjungi'}
                            ${!isOffline ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>' : ''}
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    // Active Filters Display
    function updateActiveFilters() {
        const filters = [];

        if (state.filters.search) {
            filters.push({ type: 'search', label: `Search: "${state.filters.search}"` });
        }
        if (state.filters.language) {
            filters.push({ type: 'language', label: `Bahasa: ${state.filters.language}` });
        }
        if (state.filters.country) {
            filters.push({ type: 'country', label: `Negara: ${state.filters.country}` });
        }
        if (state.filters.genre) {
            filters.push({ type: 'genre', label: `Genre: ${state.filters.genre}` });
        }
        if (state.filters.status) {
            filters.push({ type: 'status', label: `Status: ${state.filters.status}` });
        }

        if (filters.length === 0) {
            elements.activeFilters.innerHTML = '';
            return;
        }

        elements.activeFilters.innerHTML = filters.map(f => `
            <span class="filter-tag">
                ${escapeHtml(f.label)}
                <button onclick="window.removeFilter('${f.type}')" title="Hapus filter">×</button>
            </span>
        `).join('');
    }

    // Expose removeFilter globally
    window.removeFilter = function(type) {
        switch(type) {
            case 'search':
                state.filters.search = '';
                elements.searchInput.value = '';
                elements.searchClear.style.display = 'none';
                break;
            case 'language':
                state.filters.language = '';
                elements.filterLanguage.value = '';
                break;
            case 'country':
                state.filters.country = '';
                elements.filterCountry.value = '';
                break;
            case 'genre':
                state.filters.genre = '';
                elements.filterGenre.value = '';
                break;
            case 'status':
                state.filters.status = '';
                elements.filterStatus.value = '';
                break;
        }
        applyFilters();
    };

    function resetAllFilters() {
        state.filters = {
            search: '',
            language: '',
            country: '',
            genre: '',
            status: ''
        };

        elements.searchInput.value = '';
        elements.searchClear.style.display = 'none';
        elements.filterLanguage.value = '';
        elements.filterCountry.value = '';
        elements.filterGenre.value = '';
        elements.filterStatus.value = '';

        applyFilters();
    }

    // Stats
    function updateStats() {
        const total = state.allSites.length;
        const online = state.allSites.filter(s => s.status === 'online').length;
        const offline = state.allSites.filter(s => s.status === 'offline').length;

        const languages = new Set();
        const countries = new Set();
        state.allSites.forEach(s => {
            if (s.language) s.language.forEach(l => languages.add(l));
            if (s.country) countries.add(s.country);
        });

        animateNumber(elements.statTotal, total);
        animateNumber(elements.statOnline, online);
        animateNumber(elements.statOffline, offline);
        animateNumber(elements.statLanguages, languages.size);
        animateNumber(elements.statCountries, countries.size);
    }

    function animateNumber(element, target) {
        if (!element) return;
        const duration = 800;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function updateResultsCount() {
        const count = state.filteredSites.length;
        const total = state.allSites.length;

        if (count === total) {
            elements.resultsCount.textContent = `Menampilkan ${count.toLocaleString()} situs`;
        } else {
            elements.resultsCount.textContent = `Menampilkan ${count.toLocaleString()} dari ${total.toLocaleString()} situs`;
        }
    }

    // Utilities
    function isRecentlyAdded(dateStr) {
        if (!dateStr) return false;
        const added = new Date(dateStr);
        const now = new Date();
        const diff = now - added;
        return diff <= CONFIG.newThresholdDays * 24 * 60 * 60 * 1000;
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Tanggal tidak diketahui';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Kemarin';
        if (days < 7) return `${days} hari lalu`;
        if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;

        return date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
