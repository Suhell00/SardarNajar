import { state } from '../state.js';
import { renderRoomCards } from './rooms.js';

export function setupFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      state.activeCategoryFilter = tab.getAttribute('data-filter') || 'all';
      renderRoomCards();
    });
  });
}
