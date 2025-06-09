document.addEventListener('DOMContentLoaded', () => {
    const extensionsGrid = document.getElementById('extensions-grid');
    const filterControls = document.getElementById('filter-controls');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    let extensions = [];
    let currentFilter = 'all';

    // --- DATA FETCHING AND RENDERING ---

    async function fetchExtensions() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            extensions = data;
            renderExtensions();
        } catch (error) {
            console.error("Could not fetch extensions:", error);
            extensionsGrid.innerHTML = '<p class="error">Failed to load extensions. Please try again later.</p>';
        }
    }

    function renderExtensions() {
        extensionsGrid.innerHTML = '';

        const filteredExtensions = extensions.filter(ext => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return ext.isActive;
            if (currentFilter === 'inactive') return !ext.isActive;
        });

        if (filteredExtensions.length === 0) {
            extensionsGrid.innerHTML = `<p class="no-results">No ${currentFilter} extensions found.</p>`;
            return;
        }

        filteredExtensions.forEach(ext => {
            const card = document.createElement('div');
            card.className = 'extension-card';
            card.dataset.id = ext.id;

            card.innerHTML = `
                <div class="card-header">
                    <img src="${ext.logo}" alt="" class="card-icon" width="50" height="50">
                    <div class="card-info">
                        <h3>${ext.name}</h3>
                        <p>${ext.description}</p>
                    </div>
                </div>
                <div>
                    <hr class="card-divider">
                    <div class="card-actions">
                        <button class="remove-btn" data-action="remove">Remove</button>
                        <label class="toggle-switch">
                            <input type="checkbox" ${ext.isActive ? 'checked' : ''} data-action="toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            `;
            extensionsGrid.appendChild(card);
        });
    }

    // --- EVENT HANDLERS ---

    function handleGridActions(e) {
        const target = e.target;
        const card = target.closest('.extension-card');
        if (!card) return;

        const id = parseInt(card.dataset.id);
        const action = target.dataset.action;

        if (action === 'remove') {
            // Remove from the array and re-render
            extensions = extensions.filter(ext => ext.id !== id);
            renderExtensions();
        }

        if (action === 'toggle') {
            // Find the extension, update its state, and re-render if filter is active
            const extension = extensions.find(ext => ext.id === id);
            if (extension) {
                extension.isActive = !extension.isActive;
                // If we are on a filtered view, the card might disappear, so we must re-render
                if (currentFilter !== 'all') {
                    renderExtensions();
                }
            }
        }
    }

    function handleFilterChange(e) {
        const target = e.target;
        if (!target.classList.contains('filter-btn')) return;

        // Update active button style
        document.querySelector('.filter-btn.active').classList.remove('active');
        target.classList.add('active');

        // Update filter and re-render
        currentFilter = target.dataset.filter;
        renderExtensions();
    }
    
    function toggleTheme() {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        
        // Optional: Save theme preference to localStorage
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    }
    
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
    }


    // --- INITIALIZATION ---

    loadTheme();
    fetchExtensions();

    extensionsGrid.addEventListener('click', handleGridActions);
    filterControls.addEventListener('click', handleFilterChange);
    themeToggle.addEventListener('click', toggleTheme);
});