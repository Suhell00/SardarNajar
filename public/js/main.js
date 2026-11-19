/**
 * Sky Tower Luxury Hotel (Erbil) - Main Client JavaScript (entry point)
 * Pure Vanilla JavaScript (ES modules, no frameworks)
 */
import { loadIncludes } from './modules/includes.js';
import { setupDatesDefault } from './modules/dates.js';
import { setupLanguageSwitcher } from './modules/language.js';
import { setupFilterTabs } from './modules/filters.js';
import { setupAvailabilityForm } from './modules/availability.js';
import { setupModals } from './modules/modals.js';
import { fetchRoomsFromBackend } from './modules/rooms.js';
import './modules/navigation.js';

async function init() {
  await loadIncludes();
  setupDatesDefault();
  setupLanguageSwitcher();
  setupFilterTabs();
  setupAvailabilityForm();
  setupModals();
  fetchRoomsFromBackend();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
