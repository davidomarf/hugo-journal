(() => {
  let lastActive = 0;

  const isInViewport = (elem) => {
    var bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const h2Elements = [...document.getElementsByTagName("h2")];
  const tableOfContentsList = [
    ...document.getElementById("TableOfContents").getElementsByTagName("li")
  ];

  window.addEventListener(
    "scroll",
    () => {
      h2Elements.map((e, i) => {
        if (isInViewport(e)) {
          tableOfContentsList[i].classList.add("active");
          lastActive = i;
        } else {
          lastActive !== i && tableOfContentsList[i].classList.remove("active");
        }
      });
    },
    false
  );
})();
