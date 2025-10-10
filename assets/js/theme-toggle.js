(function() {
  // Theme toggle functionality
  const STORAGE_KEY = 'davidomar-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';
  
  // Get saved theme or use system preference
  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    
    return THEME_LIGHT;
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButton(theme);
  }
  
  // Update toggle button appearance
  function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-label', `Switch to ${theme === THEME_DARK ? 'light' : 'dark'} theme`);
      button.setAttribute('data-theme-state', theme);
      
      // Simple text toggle with line breaks
      if (theme === THEME_DARK) {
        button.innerHTML = '<span>turn</span><span><strong>on</strong></span><span>the</span><span>lights</span>';
      } else {
        button.innerHTML = '<span>turn</span><span><strong>off</strong></span><span>the</span><span>lights</span>';
      }
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    
    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }
  
  // Initialize theme on page load
  function initTheme() {
    const theme = getSavedTheme();
    applyTheme(theme);
    
    // Create toggle button
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle';
    button.addEventListener('click', toggleTheme);
    
    // Add button directly to body, outside of any container
    document.body.appendChild(button);
    
    // Now update the button content
    updateToggleButton(theme);
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only apply if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  }
  
  // Listen for theme changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTheme(e.newValue);
    }
  });
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
