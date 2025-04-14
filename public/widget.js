(function() {
    // Check if script was already loaded
    if (window.chatbotLoaded) return;
    window.chatbotLoaded = true;
    
    // Load script function
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    
    // Load stylesheet
    function loadStylesheet(href) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
    
    // Initialize chatbot with configuration
    window.initChatbot = function(config) {
      // Store configuration for the React app to use
      window._chatbotConfig = config || {
        siteId: 'themarketinglads',
        position: 'bottom-right',
        primaryColor: '#4a69bd',
        title: 'Chat with us'
      };
      
      // Get base URL from current script
      const scripts = document.getElementsByTagName('script');
      const currentScript = scripts[scripts.length - 1];
      const scriptSrc = currentScript.src;
      const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
      
      // Create container for the chatbot
      const chatbotContainer = document.createElement('div');
      chatbotContainer.id = 'chatbot-container';
      document.body.appendChild(chatbotContainer);
      
      // Load React app styles and scripts
      loadStylesheet(`${baseUrl}assets/index.css`);
      
      // Load main JS bundle - Vite uses 'assets' folder and has different filenames
      loadScript(`${baseUrl}assets/index.js`);
    };
  })();
  