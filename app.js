document.addEventListener('DOMContentLoaded', ( ) => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const updateThemeIcon = (isDark) => {
        themeIcon.innerText = isDark ? '☀️' : '🌙';
    };

    // Initialize theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        htmlElement.classList.remove('dark');
        localStorage.theme = 'light';
        updateThemeIcon(false);
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
            updateThemeIcon(false);
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
            updateThemeIcon(true);
        }
    });

    // Data Rendering Logic
    const categories = [
        { id: 'toxic-list', file: 'data/toxic.json' },
        { id: 'modding-list', file: 'data/modding.json' },
        { id: 'griefing-list', file: 'data/griefing.json' }
    ];

    const createCard = (item) => {
        const isOwnReport = item.reportType === 'my-own';
        const iconPath = isOwnReport ? './Text.png' : './Verified.png';
        const iconAlt = isOwnReport ? 'Official' : 'Community';

        return `
            <div class="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <img src="${iconPath}" alt="${iconAlt}" class="w-50 h-8 rounded shadow-sm">
                        <div>
                            <h4 class="font-bold text-lg leading-tight text-gray-900 dark:text-white">${item.name}</h4>
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">${item.platform}</span>
                        </div>
                    </div>
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold rounded uppercase text-gray-600 dark:text-gray-400">
                        ${isOwnReport ? 'Offical' : 'Community'}
                    </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    ${item.description}
                </p>
                <div class="pt-4 border-t border-gray-50 dark:border-gray-800 flex flex-col space-y-2">
                    <div class="flex items-center text-[11px] text-gray-500">
                        <span class="mr-2">🕒</span>
                        <span>${item.context}</span>
                    </div>
                    ${item.evidence ? `
                        <a href="${item.evidence}" target="_blank" class="text-[11px] text-red-500 hover:underline flex items-center">
                            <span class="mr-2">🔗</span>
                            Look at Evidence
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const loadData = async (categoryId, filePath) => {
        const container = document.getElementById(categoryId);
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            if (data.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center py-12 text-gray-500 italic">Noch keine Einträge vorhanden.</p>';
                return;
            }

            container.innerHTML = data.map(item => createCard(item)).join('');
        } catch (error) {
            console.error(`Could not load ${filePath}:`, error);
            container.innerHTML = '<p class="col-span-full text-center py-12 text-red-500">No Data available, try submitting.</p>';
        }
    };

    // Load all categories
    categories.forEach(cat => loadData(cat.id, cat.file));
});
