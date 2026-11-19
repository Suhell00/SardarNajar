import { state } from '../state.js';
import { renderRoomCards } from './rooms.js';

export function setupAvailabilityForm() {
  const checkBtn = document.getElementById('checkAvailabilityBtn');
  if (!checkBtn) return;

  checkBtn.addEventListener('click', e => {
    e.preventDefault();

    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const roomType = document.getElementById('roomTypeSelect').value;
    const guests = document.getElementById('guestsSelect').value;

    // Filter rooms matching selection
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (roomType && roomType !== 'all') {
      state.activeCategoryFilter = roomType;
      const tabs = document.querySelectorAll('.filter-tab');
      tabs.forEach(t => {
        if (t.getAttribute('data-filter') === roomType) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });
    } else {
      state.activeCategoryFilter = 'all';
    }

    renderRoomCards();

    // Visual feedback on button
    const originalText = checkBtn.textContent;
    checkBtn.textContent = '✓ Available!';
    checkBtn.style.backgroundColor = '#10B981';

    setTimeout(() => {
      checkBtn.textContent = originalText;
      checkBtn.style.backgroundColor = '';
    }, 1800);
  });
}
