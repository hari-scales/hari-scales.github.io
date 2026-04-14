const fs = require('fs');
const file = 'c:/Users/Admin/Documents/SUDHAN HARD/hari_scales_FINAL_v3.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove body { cursor: none; }
content = content.replace(/body\s*\{[^}]*cursor:\s*none;[^}]*\}/g, match => {
    return match.replace(/cursor:\s*none;?\s*/, '');
});

// 2. Remove .cursor and .cursor-ring css
content = content.replace(/\/\*\s*CUSTOM CURSOR\s*\*\/[\s\S]*?\/\*\s*END CUSTOM CURSOR\s*\*\//g, '');
content = content.replace(/\/\*\s*CUSTOM CURSOR\s*\*\/[\s\S]*?z-index:\s*9999;\s*\}/, '');
content = content.replace(/\.cursor-ring\s*\{[\s\S]*?z-index:\s*9998;\s*\}/, '');

// 3. Remove html elements
content = content.replace(/<div class="cursor"[^>]*><\/div>\s*/g, '');
content = content.replace(/<div class="cursor-ring"[^>]*><\/div>\s*/g, '');

// 4. Remove JS
content = content.replace(/\/\/\s*----\s*CUSTOM CURSOR\s*----[\s\S]*?el\.addEventListener\('mouseleave'[\s\S]*?\}\);\s*\}\);/g, '');

// 5. Add mobile menu CSS
const mobileCss = `
  /* ========= MOBILE MENU ========= */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 100;
  }
  .mobile-menu-btn span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--white-smoke);
    margin: 5px 0;
    transition: all 0.3s ease;
  }
  .mobile-menu-btn.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .mobile-menu-btn.open span:nth-child(2) {
    opacity: 0;
  }
  .mobile-menu-btn.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(10px);
    z-index: 95;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .mobile-menu-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-menu-overlay a {
    color: var(--white-smoke);
    font-family: 'DM Sans', sans-serif;
    font-size: 24px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    margin: 20px 0;
    letter-spacing: 0.15em;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }
  .mobile-menu-overlay.active a {
    opacity: 1;
    transform: translateY(0);
  }
  .mobile-menu-overlay.active a:nth-child(1) { transition-delay: 0.1s; }
  .mobile-menu-overlay.active a:nth-child(2) { transition-delay: 0.15s; }
  .mobile-menu-overlay.active a:nth-child(3) { transition-delay: 0.2s; }
  .mobile-menu-overlay.active a:nth-child(4) { transition-delay: 0.25s; }
  .mobile-menu-overlay.active a:nth-child(5) { transition-delay: 0.3s; }

  /* ========= HERO SCROLL ARROW ========= */
  .hero-scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    color: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: bounceFade 2s infinite ease-in-out;
  }
  .hero-scroll-indicator svg {
    width: 28px;
    height: 28px;
  }
  @keyframes bounceFade {
    0%, 100% { transform: translate(-50%, 0); opacity: 0.3; }
    50% { transform: translate(-50%, 10px); opacity: 1; }
  }
`;

content = content.replace(/\/\*\s*=========\s*RESPONSIVE\s*=========\s*\*\//, mobileCss + '\n  /* ========= RESPONSIVE ========= */');

const additionalMobileCss = `
  nav ul { display: none !important; }
  .mobile-menu-btn { display: block !important; }
  .hero-title {
    font-size: clamp(32px, 12vw, 60px) !important;
    white-space: nowrap !important;
  }
`;

content = content.replace(/@media \(max-width: 960px\) \{/, '@media (max-width: 960px) {\n' + additionalMobileCss);

// 6. Update HTML in #hero
const menuHtml = `
  <button class="mobile-menu-btn" id="mobileMenuBtn">
    <span></span><span></span><span></span>
  </button>
  <div class="mobile-menu-overlay" id="mobileMenuOverlay">
    <a href="#skills" class="mobile-link">Skills</a>
    <a href="#experience" class="mobile-link">Experience</a>
    <a href="#who" class="mobile-link">Who I Am</a>
    <a href="#services" class="mobile-link">Services</a>
    <a href="#contact" class="mobile-link">Contact</a>
  </div>
`;
content = content.replace(/<nav>/, '<nav>\n' + menuHtml);

const arrowHtml = `
  <div class="hero-scroll-indicator">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
`;
content = content.replace(/(<h1 class="hero-title">.*?<\/h1>\s*<\/div>)/, '$1\n  ' + arrowHtml);

// 7. Add Menu JS
const menuJs = `
// ---- MOBILE MENU ----
const btn = document.getElementById('mobileMenuBtn');
const overlay = document.getElementById('mobileMenuOverlay');
const links = document.querySelectorAll('.mobile-link');

if (btn && overlay) {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      overlay.classList.remove('active');
    });
  });
}
`;
content = content.replace(/(<\/script>\s*<\/body>)/, menuJs + '\n$1');

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete.');
