function loadPage(slug: string, category: string) {
  // Make overlay appear
  const pageOverlay = document.getElementById("page-overlay-outer")!;
  pageOverlay.classList.add("page-overlay-outer-active");
  pageOverlay.classList.add(`category-${category}`);

  const sourceContainer = document.getElementById(`subpage-item-${slug}`)!;

  // Remove existing overlay header
  const headerContainer = document.getElementById("page-overlay-header")!;
  while (headerContainer.firstChild) {
    headerContainer.removeChild(headerContainer.lastChild!); // Remove existing contents
  }
  // Create a new header node
  const header = sourceContainer.querySelector("#header")!.cloneNode(
    /* recursive = */ true,
  ) as HTMLElement;
  // Remove the description
  const description = header.querySelector("#description")!;
  description.parentElement!.removeChild(description);
  // Add it to the header
  headerContainer.appendChild(header);

  // TODO: Populate contents
}
