document.getElementById('year').textContent=new Date().getFullYear();
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');

// 初始化：根据系统或保存的主题设置
if (localStorage.theme === 'dark' ||
   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
  toggle.textContent = '◑';
} else {
  toggle.textContent = '◐';
}

// 点击切换主题 + 图标
toggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.theme = isDark ? 'dark' : 'light';
  toggle.textContent = isDark ? '◑' : '◐';
});

const p=location.pathname.split('/').pop();
// Check if we're in a project detail page (projects/ subfolder)
const isProjectPage = location.pathname.includes('/projects/') && p !== 'projects.html';
if(p.includes('about'))document.getElementById('nav-about')?.classList.add('active');
else if(p.includes('projects') && !isProjectPage)document.getElementById('nav-projects')?.classList.add('active');
else if(p.includes('contact'))document.getElementById('nav-contact')?.classList.add('active');
else if(p === 'index.html' || p === '' || location.pathname === '/')document.getElementById('nav-home')?.classList.add('active');

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('.mobile-navlink').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });

  // Highlight active mobile nav link
  const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-navlink');
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (p.includes('about') && href.includes('about')) link.classList.add('active');
    else if (p.includes('projects') && !isProjectPage && href.includes('projects')) link.classList.add('active');
    else if (p.includes('contact') && href.includes('contact')) link.classList.add('active');
    else if ((p === 'index.html' || p === '' || location.pathname === '/') && href.includes('index')) link.classList.add('active');
  });
}

// Navbar scroll effect - change background from gray to white
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  if(window.scrollY>50){
    nav.classList.add('scrolled');
  }else{
    nav.classList.remove('scrolled');
  }
});

// Intersection Observer for fade-in animations
const fadeInSections = document.querySelectorAll('.fade-in-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeInSections.forEach(section => {
  observer.observe(section);
});

// Typewriter-style reveal text character by character on scroll
function wrapCharacters() {
  const revealTexts = document.querySelectorAll('.reveal-text');

  revealTexts.forEach(element => {
    const text = element.getAttribute('data-text');
    if (!text) return;

    const words = text.split(' ');
    element.innerHTML = '';

    words.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.style.marginRight = '0.35em';

      [...word].forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        // Double layer structure: absolute positioned light char + variable opacity dark char
        charSpan.innerHTML = `<span class="char-inner">${char}</span><span class="char-visible">${char}</span>`;
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);
    });
  });
}

// Dynamic reveal based on scroll position - calculate opacity per character
function revealCharactersOnScroll() {
  const revealTexts = document.querySelectorAll('.reveal-text');

  revealTexts.forEach(textElement => {
    const rect = textElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate element's position in viewport
    const elementTop = rect.top;
    const elementBottom = rect.bottom;

    // Only process if element is in viewport
    if (elementBottom < 0 || elementTop > windowHeight) {
      return;
    }

    const chars = textElement.querySelectorAll('.char');
    const totalChars = chars.length;

    // Define animation zone
    // Start revealing when element is at 70% of viewport (bottom)
    // Finish revealing when element is at 30% of viewport (top)
    const startThreshold = windowHeight * 0.7;
    const endThreshold = windowHeight * 0.3;

    // Calculate overall progress (0 to 1)
    const elementCenter = elementTop + rect.height / 2;
    let overallProgress = 0;

    if (elementCenter <= endThreshold) {
      overallProgress = 1; // Fully revealed
    } else if (elementCenter >= startThreshold) {
      overallProgress = 0; // Not started
    } else {
      // In the animation zone
      overallProgress = (startThreshold - elementCenter) / (startThreshold - endThreshold);
    }

    // Apply opacity to each character based on overall progress
    chars.forEach((char, index) => {
      const charVisibleSpan = char.querySelector('.char-visible');
      if (!charVisibleSpan) return;

      // Calculate this character's reveal threshold (0 to 1)
      const charThreshold = index / totalChars;

      // Calculate opacity for this character
      let opacity;
      if (overallProgress >= 1) {
        // All revealed
        opacity = 1;
      } else if (overallProgress <= charThreshold) {
        // Not yet revealed
        opacity = 0;
      } else {
        // In transition - smooth fade in over a small range
        const fadeRange = 0.05; // 5% of total progress for each char fade
        const charProgress = (overallProgress - charThreshold) / fadeRange;
        opacity = Math.min(1, Math.max(0, charProgress));
      }

      charVisibleSpan.style.opacity = opacity;
    });
  });
}

// Initialize character wrapping
wrapCharacters();

// Add scroll listener for reveal animation - real-time update
window.addEventListener('scroll', () => {
  revealCharactersOnScroll();
}, { passive: true });

// Initial check
revealCharactersOnScroll();

// FAQ accordion effect - close others when one opens
const faqItems = document.querySelectorAll('.faq');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      // Close all other FAQ items when this one opens
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    }
  });
});

// Project filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
  // Function to filter projects
  function filterProjects(filterValue) {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-filter="${filterValue}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Filter projects with smooth animation
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filterValue === 'all' || category === filterValue) {
        card.style.display = '';
        // Fade in animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Fade out animation
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Check URL parameter on page load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    filterProjects(filterParam);
  }

  // Add click event listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      filterProjects(filterValue);
    });
  });
}

// TOC scroll highlighting for project pages
const tocLinks = document.querySelectorAll('.toc-link');
if (tocLinks.length > 0) {
  const observerOptions = {
    rootMargin: '-20% 0px -75% 0px',
    threshold: 0
  };

  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        tocLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding link
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  // Observe all sections and headings with IDs
  document.querySelectorAll('section[id], h2[id]').forEach(element => {
    tocObserver.observe(element);
  });

  // Smooth scroll for TOC links
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const offset = 100; // Account for fixed header
        const targetPosition = targetSection.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Custom Cursor Effect */
(function() {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  cursor.innerHTML = '<svg width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg"><path class="cursor-fill" d="M2 1 L19 9.5 L11.5 12 L9 20 Z"/></svg><span class="cursor-label"></span>';
  document.body.appendChild(cursor);
  document.body.classList.add('custom-cursor');

  const label = cursor.querySelector('.cursor-label');

  // Track mouse movement - update position directly for responsiveness
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Nav link labels by id
  const navLabels = {
    'nav-home':     '← Back home',
    'nav-about':    'Who am I?',
    'nav-projects': 'My work',
    'nav-contact':  'Say hi ✦',
  };

  // Determine label text based on element type
  function getLabelText(el) {
    // Project cards
    if (el.closest('.project-card') || el.closest('.featured-card')) return 'View Project';

    // Theme toggle — show what it will switch TO
    if (el.id === 'themeToggle' || el.closest('#themeToggle')) {
      return document.documentElement.classList.contains('dark')
        ? 'Switch to light mode'
        : 'Switch to dark mode';
    }

    // Nav links by id
    for (const [id, text] of Object.entries(navLabels)) {
      if (el.id === id || el.closest('#' + id)) return text;
    }

    // General links
    if (el.matches('a[href]') || el.closest('a[href]')) {
      const a = el.matches('a') ? el : el.closest('a');
      const href = a.getAttribute('href') || '';
      if (href.startsWith('mailto:')) return 'Email me';
      if (href.startsWith('http') || href.startsWith('//')) return 'Open ↗';
      if (href.startsWith('#')) return ''; // anchor / TOC links — no label
      return 'View';
    }
    return '';
  }

  // Hover effect on interactive elements
  const interactiveElements = 'a, button, .project-card, .featured-card, .faq, .filter-btn, .btn-primary, .btn-outline, input, textarea';

  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      const text = getLabelText(el);
      label.textContent = text;
      if (text) cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
})();