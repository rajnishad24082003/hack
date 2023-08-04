document.querySelectorAll("ul.treeRoot li span").forEach(function (span) {
  span.addEventListener("click", function () {
    if (this.parentElement.classList.contains("hasSubMenu")) {
      if (
        this.parentElement
          .querySelector("ul")
          .classList.contains("activeSubMenu")
      ) {
        this.parentElement
          .querySelector("ul")
          .classList.remove("activeSubMenu");
      } else {
        this.parentElement.querySelector("ul").classList.add("activeSubMenu");
      }
    }
  });
});
