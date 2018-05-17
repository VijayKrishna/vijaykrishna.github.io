header = document.getElementById("stickyheader");

var myScrollFunc = function() {
  var y = window.scrollY;

  if (y >= 40) {
    header.style.display = "block";
  } else {
    header.style.display = "none";
  }
};

window.addEventListener("scroll", myScrollFunc);