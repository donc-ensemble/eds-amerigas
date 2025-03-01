import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

   // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav-remove';
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }
  block.append(nav);
  const extractedData = extractContentFromDOM(block);
  document.getElementById('nav-remove').remove();
  renderExtractedDataToDom(block, extractedData);

  // Add hero section after navigation
  const heroContent = `
    <section class="amerigas-hero">
        <div class="hero-content">
            <h1 class="hero-title">Switch To The Propane Pros</h1>
            <p class="hero-description">Don't take a chance on just any propane company this season. Go with the propane pros at AmeriGas & enjoy a low first-fill price when you switch.</p>
            <p class="button-container">
              <a href="#quote" class="cta-button">Get a Quote and Save Now</a>
            </p>
        </div>
        <div class="hero-image">
            <img src="https://picsum.photos/600/400" alt="Cozy snow-covered house with warm lighting" loading="lazy">
        </div>
    </section>`;

  const parser = new DOMParser();
  const heroElement = parser.parseFromString(heroContent, 'text/html').body.firstChild;
  block.appendChild(heroElement);
}


function extractContentFromDOM(element) {
  const leftNavItems = Array.from(element.querySelectorAll('.section:first-child li')).map(li => li.textContent);
  const rightNavItems = Array.from(element.querySelectorAll('.section:last-child li')).map(li => {
      const link = li.querySelector('a');
      return {
          text: link ? link.textContent : li.textContent,
          href: link ? link.href : null,
          title: link ? link.title : null
      };
  });

  return {
      leftNavItems,
      rightNavItems
  };
}

function renderExtractedDataToDom(block, extractedData) {
  const nav = document.createElement('nav');
  
  const navLeft = document.createElement('div');
  navLeft.className = 'nav-left';
  
  const brandName = document.createElement('div');
  brandName.className = 'brand-name';
  brandName.textContent = 'Amerigas';
  navLeft.appendChild(brandName);

  const leftUl = document.createElement('ul');
  extractedData.leftNavItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.textContent = item;
      leftUl.appendChild(li);
  });
  navLeft.appendChild(leftUl);

  const navRight = document.createElement('div');
  navRight.className = 'nav-right';
  
  const rightUl = document.createElement('ul');
  extractedData.rightNavItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      if (item.href) {
          const a = document.createElement('a');
          a.href = item.href;
          a.title = item.title;
          a.textContent = item.text;
          li.appendChild(a);
      } else {
          li.textContent = item.text;
      }
      rightUl.appendChild(li);
  });
  navRight.appendChild(rightUl);

  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'hamburger-line';
      hamburger.appendChild(line);
  }
  navRight.appendChild(hamburger);

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  const mobileUl = document.createElement('ul');
  extractedData.rightNavItems.forEach(item => {
      const li = document.createElement('li');
      if (item.href) {
          const a = document.createElement('a');
          a.href = item.href;
          a.title = item.title;
          a.textContent = item.text;
          li.appendChild(a);
      } else {
          li.textContent = item.text;
      }
      mobileUl.appendChild(li);
  });
  mobileMenu.appendChild(mobileUl);

  nav.appendChild(navLeft);
  nav.appendChild(navRight);
  block.appendChild(nav);
  block.appendChild(mobileMenu);

  const searchIcon = block.querySelector('img[data-icon-name="search"]');
  if (searchIcon) {
      const optimizedSearchIcon = createOptimizedPicture(searchIcon.src, '', true);
      searchIcon.parentNode.replaceChild(optimizedSearchIcon, searchIcon);
  }

  hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
  });
}