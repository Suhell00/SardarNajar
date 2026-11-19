// Loads HTML partials: <div data-include="/partials/x.html"></div>
export async function loadIncludes() {
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  const htmls = await Promise.all(
    slots.map(async slot => {
      const res = await fetch(slot.getAttribute('data-include'));
      if (!res.ok) throw new Error(`Failed to load ${slot.getAttribute('data-include')}`);
      return res.text();
    })
  );
  slots.forEach((slot, i) => slot.replaceWith(document.createRange().createContextualFragment(htmls[i])));
}
