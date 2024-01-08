let loadedPageBox: HTMLElement | null = null;
let clonedBox: HTMLElement | null = null;

function loadPage(slug: string, category: string) {
  // Make overlay appear
  const pageOverlay = document.getElementById("page-overlay")!;
  pageOverlay.classList.value = "";
  pageOverlay.classList.add("active");
  pageOverlay.classList.add(`category-${category}`);

  // Clone a copy of the page box into the overlay
  loadedPageBox = document.getElementById(`subpage-item-${slug}`)!;
  clonedBox = loadedPageBox.cloneNode(true) as HTMLElement;
  pageOverlay.appendChild(clonedBox);

  // Place this page box in the same location, but in the overlay
  placeOverLoadedPageBox();
  // Remove hover/click behaviour
  clonedBox.onclick = null;
  clonedBox.classList.remove("hoverable");

  // Trigger the entry animation (this has to be one frame after the elements are actually created,
  // otherwise the CSS animations won't play)
  requestAnimationFrame(() => pageOverlay.classList.add("expanded"));

  // TODO: Populate contents
  const container = pageOverlay.querySelector("#page-content")!;
  fetch(`/${slug}`)
    .then((response: Response) => response.text())
    .then((text: string) => container.innerHTML = text);
}

function closeOverlay() {
  // Close overlay
  const pageOverlay = document.getElementById("page-overlay")!;
  pageOverlay.classList.remove("page-overlay-outer-active");
  pageOverlay.classList.remove("expanded");
  pageOverlay.classList.add("contracting");
  placeOverLoadedPageBox();

  // Reset everything once the animation is over
  setTimeout(() => {
    pageOverlay.removeChild(clonedBox!);
    pageOverlay.classList.value = "";

    clonedBox = null;
    loadedPageBox = null;
  }, 1250);
}

function placeOverLoadedPageBox() {
  if (clonedBox == null) return;

  const rootHtmlElement = document.documentElement;
  const rect = loadedPageBox!.getBoundingClientRect();
  clonedBox.style.left = `${rect.left}px`;
  clonedBox.style.top = `${rect.top}px`;
  clonedBox.style.right = `${rootHtmlElement.clientWidth - rect.right}px`;
  clonedBox.style.bottom = `${rootHtmlElement.clientHeight - rect.bottom}px`;
}
