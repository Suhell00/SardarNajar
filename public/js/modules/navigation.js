
// Global hook for the header "Book Now" CTA button
window.scrollToBookingBar = function () {
  const bar = document.getElementById('availabilityBar');
  if (bar) {
    bar.scrollIntoView({ behavior: 'smooth' });
  } else {
    const rooms = document.getElementById('rooms');
    if (rooms) rooms.scrollIntoView({ behavior: 'smooth' });
  }
};
