header = document.getElementById("stickyheader");

var offsetHt = 40;
if (document.title === "Vijay Krishna Palepu") {
	offsetHt = window.innerHeight;
}

var myScrollFunc = function() {
  var y = window.scrollY;

  if (y >= offsetHt) {
    header.style.display = "block";
  } else {
    header.style.display = "none";
  }
};

window.addEventListener("scroll", myScrollFunc);