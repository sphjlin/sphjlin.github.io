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

const p=location.pathname.split('/').pop();if(p.includes('about'))document.getElementById('nav-about').classList.add('active');else if(p.includes('projects'))document.getElementById('nav-projects').classList.add('active');else if(p.includes('contact'))document.getElementById('nav-contact').classList.add('active');else document.getElementById('nav-home').classList.add('active');

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

// Add scroll listener for reveal animation
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(revealCharactersOnScroll, 10);
});

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