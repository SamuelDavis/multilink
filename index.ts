function onClick() {
  let tracking = false;

  let selectionBox = document.createElement("div");
  selectionBox.style.boxSizing = "content-box";
  selectionBox.style.backgroundColor = "rgba(0,0,0,0)";
  selectionBox.style.borderWidth = "3px";
  selectionBox.style.borderStyle = "solid";
  selectionBox.style.borderColor = "black";
  selectionBox.style.position = "absolute";
  selectionBox.style.zIndex = "9999";

  let p1 = [0, 0];
  let p2 = [0, 0];

  function getPageBoundingBox(el: HTMLElement) {
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
    return {
      top: offsetTop,
      right: offsetWidth - offsetLeft,
      bottom: offsetHeight - offsetTop,
      left: offsetLeft,
    };
  }

  function sizeEl() {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const top = Math.min(y1, y2);
    const right = Math.max(x1, x2);
    const bottom = Math.max(y1, y2);
    const left = Math.min(x1, x2);

    selectionBox.style.top = `${top}px`;
    selectionBox.style.left = `${left}px`;
    selectionBox.style.width = `${right - left}px`;
    selectionBox.style.height = `${bottom - top}px`;
  }

  function onDown(e: MouseEvent) {
    tracking = true;
    p1 = [e.pageX, e.pageY];
    p2 = [e.pageX, e.pageY];
    sizeEl();
    document.body.appendChild(selectionBox);
  }

  function onUp() {
    tracking = false;
    const {
      top: t1,
      right: r1,
      bottom: b1,
      left: l1,
    } = getPageBoundingBox(selectionBox);
    let selected = [];
    document.querySelectorAll("a").forEach((anchor) => {
      const {
        top: t2,
        right: r2,
        bottom: b2,
        left: l2,
      } = getPageBoundingBox(anchor);

      if (t2 < b1 && l2 < r1 && b2 > t1 && r2 > l1)
        selected.push(anchor.getAttribute("href"));
    });
    document.body.removeChild(selectionBox);

    if (selected.length === 0) {
      console.error("no-selection");
    } else if (confirm("Open " + selected.length + " links?")) {
      selected.map((url) => window.open(url, "_blank"));
      console.log(selected);
    } else {
      console.error("canceled");
    }

    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("mousemove", onMove);
  }

  function onMove(e: MouseEvent) {
    if (!tracking) return;
    p2 = [e.pageX, e.pageY];
    sizeEl();
  }

  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("mousemove", onMove);
}
