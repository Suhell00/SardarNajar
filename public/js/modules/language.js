import { translations } from '../i18n/translations.js';
import { state } from '../state.js';
import { renderRoomCards } from './rooms.js';

export function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang) {
        changeLanguage(selectedLang);
      }
    });
  });

  // Apply default language
  changeLanguage(state.currentLang);
}

export function changeLanguage(lang) {
  if (!translations[lang]) return;
  state.currentLang = lang;

  // 1. Toggle RTL / LTR document direction
  if (lang === 'ku' || lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lang;
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }

  // 2. Update active style on language switcher buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 3. Replace all static elements with data-i18n attribute
  const translatableElements = document.querySelectorAll('[data-i18n]');
  translatableElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // 4. Replace placeholder attributes where applicable
  const placeholderElements = document.querySelectorAll('[data-i18n-ph]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  // 5. Re-render dynamic room cards to match current language
  renderRoomCards();
}
