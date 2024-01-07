function loadPage(slug: string, category: string) {
  // Make overlay appear
  const pageOverlay = document.getElementById("page-overlay")!;
  pageOverlay.classList.value = "";
  pageOverlay.classList.add("active");
  pageOverlay.classList.add(`category-${category}`);

  // Clone a copy of the page box into the overlay
  const sourceBox = document.getElementById(`subpage-item-${slug}`)!;
  const clonedBox = sourceBox.cloneNode(true) as HTMLElement;
  pageOverlay.appendChild(clonedBox);

  // Place this page box in the same location, but in the overlay
  const rootHtmlElement = document.documentElement;
  const rect = sourceBox.getBoundingClientRect();
  clonedBox.style.left = `${rect.left}px`;
  clonedBox.style.top = `${rect.top}px`;
  clonedBox.style.right = `${rootHtmlElement.clientWidth - rect.right}px`;
  clonedBox.style.bottom = `${rootHtmlElement.clientHeight - rect.bottom}px`;
  // Remove hover/click behaviour
  clonedBox.onclick = null;
  clonedBox.classList.remove("hoverable");

  // Trigger the entry animation (this has to be one frame after the elements are actually created,
  // otherwise the CSS animations won't play)
  requestAnimationFrame(() => pageOverlay.classList.add("expanded"));

  // TODO: Populate contents
  const iframe = pageOverlay.querySelector("iframe")!;
  iframe.src = `/${slug}`;
}

function closeOverlay() {
  // Close overlay
  const pageOverlay = document.getElementById("page-overlay-outer")!;
  pageOverlay.classList.remove("page-overlay-outer-active");
}
