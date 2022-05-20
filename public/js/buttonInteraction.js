// Interact with the button for editing the message. 
function changeEditable(editable, contentID) {
    var elem = document.getElementById(contentID);
    if (editable == 'true') {
      elem.disabled = !editable
      elem.style.backgroundColor = "rgba(112, 112, 112, 0.2)";
    }
    else {
      elem.disabled = editable
      elem.style.backgroundColor = "#FFFFFF";
    }  
}

// Change to dark mode. 
function changeDarkmode() {
  var currElement = document.body;
  console.log(currElement.classList);
  if (currElement.classList.contains('darkmode')) {
    currElement.classList.remove('darkmode');
  }
  else {
    currElement.classList.add('darkmode');
  }
}


