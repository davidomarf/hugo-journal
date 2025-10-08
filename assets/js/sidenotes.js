(function() {
  // Configuration
  const SIDENOTE_WIDTH = 250;
  const SIDENOTE_MARGIN = 20;
  const MIN_SCREEN_WIDTH = 1200; // Minimum width to show sidenotes

  // Check if we should use sidenotes
  function shouldUseSidenotes() {
    // Try multiple selectors for content area
    const content = document.querySelector('article.post') || 
                   document.querySelector('.content') || 
                   document.querySelector('main') ||
                   document.querySelector('article');
    
    if (!content) return false;
    
    const contentWidth = content.offsetWidth;
    const windowWidth = window.innerWidth;
    const availableSpace = (windowWidth - contentWidth) / 2;
    
    return windowWidth >= MIN_SCREEN_WIDTH && availableSpace >= (SIDENOTE_WIDTH + SIDENOTE_MARGIN);
  }

  // Convert footnotes to sidenotes
  function convertToSidenotes() {
    // Find all footnote references - Hugo uses this structure
    const footnoteRefs = document.querySelectorAll('sup[id^="fnref:"] a.footnote-ref');
    const footnotesSection = document.querySelector('.footnotes');
    
    if (!footnotesSection || footnoteRefs.length === 0) return;
    
    // Add class to body for CSS targeting
    document.body.classList.add('has-sidenotes');
    
    // Hide the original footnotes section
    footnotesSection.style.display = 'none';
    
    // Get all footnote items
    const footnoteItems = footnotesSection.querySelectorAll('li[id^="fn:"]');
    const footnoteMap = {};
    
    // Create a map of footnote content
    footnoteItems.forEach(item => {
      const id = item.getAttribute('id');
      if (id) {
        // Clone the node to avoid modifying the original
        const clone = item.cloneNode(true);
        // Remove the back-reference link
        const backref = clone.querySelector('.footnote-backref');
        if (backref) backref.remove();
        footnoteMap[id] = clone.innerHTML.trim();
      }
    });
    
    // Process each footnote reference
    footnoteRefs.forEach(ref => {
      const href = ref.getAttribute('href');
      const id = href ? href.substring(1) : null; // Remove the #
      
      if (id && footnoteMap[id]) {
        const sup = ref.closest('sup');
        const refParent = sup ? sup.parentElement : null;
        
        if (!refParent) return;
        
        // Create sidenote element
        const sidenote = document.createElement('aside');
        sidenote.className = 'sidenote';
        sidenote.innerHTML = `<span class="sidenote-number">${ref.textContent}</span>${footnoteMap[id]}`;
        
        // Position the sidenote relative to parent paragraph
        refParent.style.position = 'relative';
        
        // Insert sidenote after the sup element
        sup.insertAdjacentElement('afterend', sidenote);
        
        // Store reference for responsive handling
        ref.setAttribute('data-sidenote-id', id);
        sidenote.setAttribute('data-sidenote-for', id);
      }
    });
  }

  // Convert to inline footnotes for mobile
  function convertToInline() {
    // Remove any existing sidenotes first
    const existingSidenotes = document.querySelectorAll('.sidenote');
    existingSidenotes.forEach(sidenote => sidenote.remove());
    
    // Find all footnote references
    const footnoteRefs = document.querySelectorAll('sup[id^="fnref:"] a.footnote-ref');
    const footnotesSection = document.querySelector('.footnotes');
    
    if (!footnotesSection || footnoteRefs.length === 0) return;
    
    // Keep the original footnotes section hidden
    footnotesSection.style.display = 'none';
    
    // Get all footnote items
    const footnoteItems = footnotesSection.querySelectorAll('li[id^="fn:"]');
    const footnoteMap = {};
    
    // Create a map of footnote content
    footnoteItems.forEach(item => {
      const id = item.getAttribute('id');
      if (id) {
        const clone = item.cloneNode(true);
        const backref = clone.querySelector('.footnote-backref');
        if (backref) backref.remove();
        footnoteMap[id] = clone.innerHTML.trim();
      }
    });
    
    // Process each footnote reference
    footnoteRefs.forEach(ref => {
      const href = ref.getAttribute('href');
      const id = href ? href.substring(1) : null;
      
      if (id && footnoteMap[id]) {
        const sup = ref.closest('sup');
        const paragraph = sup ? sup.closest('p, li') : null;
        
        if (!paragraph) return;
        
        // Create inline footnote element
        const inlineNote = document.createElement('aside');
        inlineNote.className = 'sidenote sidenote-inline';
        inlineNote.innerHTML = `<span class="sidenote-number">${ref.textContent}</span>${footnoteMap[id]}`;
        
        // Insert after the paragraph
        paragraph.insertAdjacentElement('afterend', inlineNote);
      }
    });
    
    // Add class to body for CSS targeting
    document.body.classList.add('has-inline-footnotes');
    document.body.classList.remove('has-sidenotes');
  }

  // Clean up all footnote displays
  function cleanupAllFootnotes() {
    // Remove all sidenotes (both margin and inline)
    const allSidenotes = document.querySelectorAll('.sidenote');
    allSidenotes.forEach(sidenote => sidenote.remove());
    
    // Remove body classes
    document.body.classList.remove('has-sidenotes', 'has-inline-footnotes');
    
    // Hide original footnotes section
    const footnotesSection = document.querySelector('.footnotes');
    if (footnotesSection) {
      footnotesSection.style.display = 'none';
    }
  }
  
  // Handle responsive behavior
  function handleResponsive() {
    // Clean up everything first
    cleanupAllFootnotes();
    
    // Then apply the appropriate display mode
    if (shouldUseSidenotes()) {
      convertToSidenotes();
    } else {
      convertToInline();
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    handleResponsive();
    
    // Re-check on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResponsive, 250);
    });
  });
})();
