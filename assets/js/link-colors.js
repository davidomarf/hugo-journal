(function() {
  // Define hues for internal and external links
  const INTERNAL_HUE = 190;  // Cyan for internal links
  const EXTERNAL_HUE = 10;   // Red for external links

  // Function to check if a link is internal
  function isInternalLink(link) {
    const href = link.getAttribute('href');
    if (!href) return true; // Default to internal if no href
    
    // Check if it's a relative URL
    if (href.startsWith('/') || 
        href.startsWith('#') || 
        href.startsWith('.') ||
        !href.includes('://')) {
      return true;
    }
    
    // Check if it's the same domain (without hardcoding)
    try {
      const linkUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      return linkUrl.hostname === currentUrl.hostname;
    } catch (e) {
      // If URL parsing fails, assume internal
      return true;
    }
  }

  // Function to assign color based on link type
  function assignLinkColor(link) {
    const hue = isInternalLink(link) ? INTERNAL_HUE : EXTERNAL_HUE;
    link.style.setProperty('--link-hue', hue);
  }

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Get all links
    const links = document.querySelectorAll('a');
    
    // Assign colors to each link
    links.forEach(link => {
      assignLinkColor(link);
    });
  });

  // Also handle dynamically added links (if any)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'A') {
            assignLinkColor(node);
          }
          // Also check for links inside the added node
          const innerLinks = node.querySelectorAll('a');
          innerLinks.forEach(link => {
            assignLinkColor(link);
          });
        }
      });
    });
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
