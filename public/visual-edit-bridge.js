// Agregar al inicio del bridge
let isVisualEditActive = false;
let eventListenersAttached = false;

// Prevenir todos los clicks cuando Visual Edit está activo
function preventDefaultBehavior(event) {
  if (isVisualEditActive) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

// Activar modo Visual Edit
function activateVisualEditMode() {
  if (eventListenersAttached) return;
  
  isVisualEditActive = true;
  
  // Prevenir clicks en toda la página
  document.addEventListener('click', preventDefaultBehavior, true);
  document.addEventListener('mousedown', preventDefaultBehavior, true);
  document.addEventListener('mouseup', preventDefaultBehavior, true);
  
  // Prevenir navegación
  document.addEventListener('submit', preventDefaultBehavior, true);
  
  // Prevenir drag and drop
  document.addEventListener('dragstart', preventDefaultBehavior, true);
  
  // Cambiar cursor
  document.body.style.cursor = 'crosshair';
  document.body.style.userSelect = 'none';
  
  eventListenersAttached = true;
  console.log('🎨 Visual Edit Mode ACTIVATED - All interactions blocked');
}

// Desactivar modo Visual Edit
function deactivateVisualEditMode() {
  if (!eventListenersAttached) return;
  
  isVisualEditActive = false;
  
  document.removeEventListener('click', preventDefaultBehavior, true);
  document.removeEventListener('mousedown', preventDefaultBehavior, true);
  document.removeEventListener('mouseup', preventDefaultBehavior, true);
  document.removeEventListener('submit', preventDefaultBehavior, true);
  document.removeEventListener('dragstart', preventDefaultBehavior, true);
  
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  
  eventListenersAttached = false;
  console.log('🎨 Visual Edit Mode DEACTIVATED - Interactions restored');
}

// En el listener de mensajes, agregar:
case 'VISUAL_EDIT_MODE_ACTIVATE':
  activateVisualEditMode();
  break;

case 'VISUAL_EDIT_MODE_DEACTIVATE':
  deactivateVisualEditMode();
  clearHighlight();
  break;

// Visual Edit Bridge - Bidirectional communication
(function() {
  console.log('🎨 Visual Edit Bridge initialized');

  let highlightOverlay = null;

  // Create highlight overlay element
  function createHighlightOverlay() {
    if (highlightOverlay) return highlightOverlay;
    
    highlightOverlay = document.createElement('div');
    highlightOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      z-index: 999999;
      transition: all 0.15s ease;
    `;
    document.body.appendChild(highlightOverlay);
    return highlightOverlay;
  }

  // Highlight element
  function highlightElement(selector) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn('Element not found for highlighting:', selector);
        return;
      }

      const rect = element.getBoundingClientRect();
      const overlay = createHighlightOverlay();
      
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.display = 'block';
    } catch (error) {
      console.error('Error highlighting element:', error);
    }
  }

  // Clear highlight
  function clearHighlight() {
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
  }

  // Generate unique CSS selector for element
  function generateSelector(element) {
    if (!element || element === document.body) return 'body';
    
    // Try ID first
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }

    // Build path using escaped classes
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      // Add escaped classes (limit to first 2 for brevity)
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c);
        if (classes.length > 0) {
          const escapedClasses = classes.slice(0, 2).map(c => CSS.escape(c)).join('.');
          selector += '.' + escapedClasses;
        }
      }

      // Add nth-child for uniqueness
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);
      current = parent;
    }

    return path.join(' > ');
  }

  // Get element info
  function getElementInfo(selector) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn('Element not found:', selector);
        return null;
      }

      const computedStyles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        selector,
        tagName: element.tagName,
        className: element.className,
        textContent: element.textContent?.trim() || '',
        computedStyles: {
          color: computedStyles.color,
          backgroundColor: computedStyles.backgroundColor,
          fontSize: computedStyles.fontSize,
          padding: computedStyles.padding,
          margin: computedStyles.margin,
          width: computedStyles.width,
          height: computedStyles.height,
        },
        boundingRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        sourceFile: element.getAttribute('data-source-file'),
        sourceLine: element.getAttribute('data-source-line'),
      };
    } catch (error) {
      console.error('Error getting element info:', error);
      return null;
    }
  }

  // Listen for messages from parent
  window.addEventListener('message', (event) => {
    const { type, selector, x, y, action } = event.data;

    switch (type) {
      case 'VISUAL_EDIT_DETECT_ELEMENT':
        console.log('[VisualEdit Bridge] Detecting element at', x, y, 'action:', action);
        try {
          const element = document.elementFromPoint(x, y);
          
          if (!element || element === document.body || element === document.documentElement) {
            window.parent.postMessage({
              type: 'NO_ELEMENT_DETECTED',
              action
            }, '*');
            return;
          }

          const generatedSelector = generateSelector(element);
          console.log('[VisualEdit Bridge] Generated selector:', generatedSelector);

          // Test if selector is valid
          try {
            document.querySelector(generatedSelector);
          } catch (e) {
            console.error('[VisualEdit Bridge] Generated invalid selector:', generatedSelector, e);
            window.parent.postMessage({
              type: 'NO_ELEMENT_DETECTED',
              action
            }, '*');
            return;
          }

          if (action === 'hover') {
            window.parent.postMessage({
              type: 'ELEMENT_HOVERED',
              selector: generatedSelector
            }, '*');
          } else if (action === 'click') {
            window.parent.postMessage({
              type: 'ELEMENT_CLICKED',
              selector: generatedSelector
            }, '*');
          }
        } catch (error) {
          console.error('[VisualEdit Bridge] Error detecting element:', error);
          window.parent.postMessage({
            type: 'NO_ELEMENT_DETECTED',
            action
          }, '*');
        }
        break;

      case 'VISUAL_EDIT_HIGHLIGHT':
        highlightElement(selector);
        break;

      case 'VISUAL_EDIT_CLEAR_HIGHLIGHT':
        clearHighlight();
        break;

      case 'VISUAL_EDIT_REQUEST_INFO':
        const info = getElementInfo(selector);
        if (info) {
          window.parent.postMessage({
            type: 'ELEMENT_INFO',
            data: info,
          }, '*');
        }
        break;
    }
  });
})();
