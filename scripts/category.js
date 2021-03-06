/* Start with welcome pane welcomePaneShowing. */
/* If the welcome pane is not showing we don't want any hints*/
var welcomePaneShowing = true;

window.onload = initPage;

/* Keep behaviour and content separate. We don't want things like
onclick = "showTab()". Event handlers are assigned programatically.*/
/* Multiple event handlers:
addEventListener() lets us assign more than one event handler to an event.*/

function initPage() {
  var tabs = document.getElementById("tabs")
                      .getElementsByTagName("a");
  for (var i = 0; i < tabs.length; i++) {
    var currentTab = tabs[i];
    currentTab.onmouseover = showHint;
    currentTab.onmouseout = hideHint;
    currentTab.onclick = showTab;
  }

/* For the event mouseover handlers are : showHint, buttonOver */
/* For the event mouseout handlers are : hideHint, buttonOut */
  var buttons =
    document.getElementById("navigation").getElementsByTagName("a");
    for (var i = 0; i<buttons.length; i++) {
      var currentBtn = buttons[i];
      currentBtn.addEventListener("mouseover", showHint, false);
      currentBtn.addEventListener("mouseout", hideHint, false);
      currentBtn.onclick = showTab;
      currentBtn.addEventListener("mouseover", buttonOver, false);            
      currentBtn.addEventListener("mouseout", buttonOut, false);
    }
}

/* Show hints only in cases when welcome tab is selected. If a category is
selected no hints should appear. In that case, HTML fragement returned
from the ajax request will be shown. */
function showHint(e) {
  console.log("in showHint()");
  if (!welcomePaneShowing) {
    return;
  }
  switch (e.target.title) { /*target is the object the event e occured on*/
    case "B":
      var hintText = "Car";
      break;
    case "C":
      var hintText = "Truck"
      break;
    case "CE":
      var hintText = "Truck with trailer";
      break;
    default:
      var hintText = "Click a tab to display category desription";
  }
  var contentPane = document.getElementById("content");
  contentPane.innerHTML = "<h3>" + hintText + "</h3>";
}

function hideHint(e) {
  console.log("in hideHint()");
  if (welcomePaneShowing) {
    var contentPane = document.getElementById("content");
    contentPane.innerHTML =
      "<h3>Click a tab to display category desription </h3>";
  }
}


/* Function sets each tab active or inactive. */
/* selectedTab sets global variable welcomePaneShowing to true or false. */
/* Function sends request requiring welcome.html or B.html or C.html
or CE.html page. Uses request object to get HTML fragment. */
/* selectedTab determines name of the requested page. */
function showTab(e) {
  console.log("inside showTab()");
  /* element na koji je kliknuto, pa njegov title, moze biti welcome, B, C, CE*/
  /* kliknuti elem moze biti iz navigation ili iz tabs*/
  var selectedTab = e.target.title;
  console.log(selectedTab);

  if (selectedTab == "welcome") {
    welcomePaneShowing = true;
    console.log(" welcome tab selected");
    document.getElementById("content").innerHTML =
      "<h3>Click a tab to display category desription</h3>"; /* mixing content with behaviour*/
  } else {
    welcomePaneShowing = false;
  }

// set each tab's CSS class
  var tabs = document.getElementById("tabs").getElementsByTagName("a");
  for (var i=0; i<tabs.length; i++) {
    var currentTab = tabs[i];
    if (currentTab.title == selectedTab) {
      currentTab.className = "active";
    } else {
      currentTab.className = "inactive";
    }
  }

  var request = createRequest();
  if (request==null) {
    alert("Unable to create request");
    return;
  }
  request.onreadystatechange = showCategory;
  request.open("GET", selectedTab + ".html", true);
  request.send(null);
}

/* This is callback function: called when request returns.*/
/* Sets content pane's innerHTML to the returned page*/
function showCategory() {
  console.log("inside showCategory()");
  if (request.readyState == 4) {
    if (request.status == 200) {
      console.log("about to show category description");
      document.getElementById("content").innerHTML =
        request.responseText ;
    }
  }
}

/* Shows active version of car, truck,..*/
function buttonOver(e) {
  console.log("inside buttonOver()");
  e.target.className = "active";
}

/* Removes active class  for car, truck,. ..images.*/
function buttonOut(e) {
  console.log("inside buttonOut()");
  e.target.className = "";
}
