
export function setupDatesDefault() {
  const checkInInput = document.getElementById('checkInDate');
  const checkOutInput = document.getElementById('checkOutDate');
  const modalCheckIn = document.getElementById('modalCheckIn');
  const modalCheckOut = document.getElementById('modalCheckOut');

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 2);

  const formatDate = d => d.toISOString().split('T')[0];

  if (checkInInput) checkInInput.value = formatDate(today);
  if (checkOutInput) checkOutInput.value = formatDate(tomorrow);
  if (modalCheckIn) modalCheckIn.value = formatDate(today);
  if (modalCheckOut) modalCheckOut.value = formatDate(tomorrow);
}
