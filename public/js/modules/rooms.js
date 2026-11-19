import { translations } from '../i18n/translations.js';
import { state } from '../state.js';

export async function fetchRoomsFromBackend() {
  const roomsContainer = document.getElementById('roomsContainer');
  if (roomsContainer) {
    roomsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #E0DCFE; border-top-color: #5E4AE3; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 16px; color: #64748B; font-weight: 600;">Loading luxury suites from Sky Tower...</p>
      </div>
    `;
  }

  try {
    const response = await fetch('/api/v1/rooms');
    const data = await response.json();

    if (data.status === 'success' && data.data && data.data.rooms) {
      state.allRoomsData = data.data.rooms;
      renderRoomCards();
    } else {
      console.warn('API returned fallback format', data);
      state.allRoomsData = [];
    }
  } catch (error) {
    console.error('Failed to fetch rooms from backend:', error);
  }
}

// =============================================================================
// 6. Dynamic Room Card Rendering
// =============================================================================
export function renderRoomCards() {
  const roomsContainer = document.getElementById('roomsContainer');
  if (!roomsContainer) return;

  // Filter based on active category
  let filteredRooms = state.allRoomsData;
  if (state.activeCategoryFilter !== 'all') {
    if (state.activeCategoryFilter === 'suites') {
      filteredRooms = state.allRoomsData.filter(r => r.roomType === 'deluxe' || r.roomType === 'panoramic' || r.roomType === 'executive');
    } else if (state.activeCategoryFilter === 'penthouses') {
      filteredRooms = state.allRoomsData.filter(r => r.roomType === 'penthouse' || r.roomType === 'presidential');
    } else if (state.activeCategoryFilter === 'deluxe') {
      filteredRooms = state.allRoomsData.filter(r => r.roomType === 'deluxe');
    }
  }

  if (filteredRooms.length === 0) {
    roomsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #FFFFFF; border-radius: 20px;">
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No rooms found in this category</h3>
        <p style="color: #64748B;">Please select another category or check back later.</p>
      </div>
    `;
    return;
  }

  const t = translations[state.currentLang];
  let html = '';

  filteredRooms.forEach(room => {
    // Choose localized strings
    let roomName = room.name;
    let roomSummary = room.summary;
    let roomBadge = room.badge;

    if (state.currentLang === 'ku') {
      if (room.nameKu) roomName = room.nameKu;
      if (room.summaryKu) roomSummary = room.summaryKu;
      if (room.badgeKu) roomBadge = room.badgeKu;
    } else if (state.currentLang === 'ar') {
      if (room.nameAr) roomName = room.nameAr;
      if (room.summaryAr) roomSummary = room.summaryAr;
      if (room.badgeAr) roomBadge = room.badgeAr;
    }

    const roomId = room.id || room._id;
    const coverImage = room.imageCover || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';

    html += `
      <article class="room-card" data-room-id="${roomId}">
        <div class="room-card-image-box">
          <img src="${coverImage}" alt="${roomName}" class="room-card-img" loading="lazy" />
          <span class="badge-pill room-badge-pill">${roomBadge}</span>
          <div class="room-rating-pill">
            <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span>${room.ratingsAverage.toFixed(1)}</span>
          </div>
        </div>

        <div class="room-card-body">
          <h3 class="room-title">${roomName}</h3>
          <p class="room-summary">${roomSummary}</p>

          <div class="room-specs-row">
            <div class="spec-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
              <span>${room.beds || 1} ${t.beds}</span>
            </div>
            <div class="spec-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h6M10 14V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6M4 14h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/></svg>
              <span>${room.baths || 1} ${t.baths}</span>
            </div>
            <div class="spec-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <span>${room.size || 60} ${t.sqm}</span>
            </div>
          </div>

          <div class="room-card-footer">
            <div class="price-box">
              <span class="price-amount">$${room.price}</span>
              <span class="price-period">${t.perNight}</span>
            </div>

            <button type="button" class="btn-primary btn-view-details" onclick="openRoomDetailsModal('${roomId}')">
              ${t.viewDetailsBtn}
            </button>
          </div>
        </div>
      </article>
    `;
  });

  roomsContainer.innerHTML = html;
}
