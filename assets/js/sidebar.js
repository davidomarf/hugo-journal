(() => {
  /**
   * Check if the current element is above the negative received margin
   *
   * The threshold used is the innerHeight of the window minus the margin
   * @param {HTMLElement} elem
   * @param {number} bottomMargin
   */
  const isVisibleOrAbove = (elem, bottomMargin) => {
    var bounding = elem.getBoundingClientRect();
    return (
      bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) -
        bottomMargin
    );
  };

  // Reverse it so when you try to find elements in it, you'll
  // find the last one
  const h2Elements = [...document.getElementsByTagName("h2")].reverse();

  if (h2Elements.length > 0) {
    const tableOfContents = document.getElementById("TableOfContents");

    // Reverse it so `h2Elements` and this, correspond in indices
    const tableOfContentsList = [
      ...tableOfContents.getElementsByTagName("li")
    ].reverse();

    window.addEventListener(
      "scroll",
      () => {
        // Get the index of the first (last, since reversed) item that
        // is above a margin of 50 in the window.
        const lastVisible = h2Elements.findIndex((e) =>
          isVisibleOrAbove(e, 50)
        );

        // Add the 'active' class to the lastVisible item and remove it from
        // everyone else
        tableOfContentsList.map((e, i) =>
          i === lastVisible
            ? e.classList.add("active")
            : e.classList.remove("active")
        );

        // This will add the named class only when there is not a lastVisible
        // item (no one has been reached), and the user hasn't scrolled more than
        // 200px (so the TOC is visible at the start)
        if (!(lastVisible < 0 && window.scrollY < 200)) {
          tableOfContents.classList.add("is-content-hidden");
        } else {
          tableOfContents.classList.remove("is-content-hidden");
        }
      },
      false
    );
  }
})();
