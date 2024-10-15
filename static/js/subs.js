var _slan_msg_clear_timer; // holds a reference to current message timoout
const _SLAN_CONFIG = { MSG_TIMEOUT: 10000 };

function _slan(slan_container) {
  this._ID = '_slan';
  this.slan_container = slan_container;
  this.message_container = document.createElement('div');
  this.message_container.setAttribute('id', '_slan_message_container');
  this.message_container.setAttribute('class', 'message_container');
  this.message_container.addEventListener('click', _slan_util_msg_hide);
  this.message_panel = document.createElement('div');
  this.message_panel.setAttribute('id', '_slan_message');
  this.message_container.appendChild(this.message_panel);
  this.slan_container.appendChild(this.message_container);
  this.message_container.style.display = "none"; // for the subs not to appear at the beginning
  
}
// var currentCanvas = null;
var videoElem = document.getElementById('current_video');
var slan_container = document.getElementById('slan_container');
var slan = new _slan(slan_container);
var playing = false;
var plusText = document.getElementById('addTextRow');
var plusGesture = document.getElementById('addHandshapeRow');
var beginningWindow = document.getElementById("quicktips");
var saveButton = document.getElementById("textValueSave");
// resize = (currentCanvas, leftPosition, rightPosition) => {
//   currentCav
// }

var segmentSelected = 'Segment selected. Use  <span class="key">l</span> or <span class="key">k</span> to expand and <span class="key">shift</span> <span class="pls">+</span> <span class="key">l</span> or <span class="key">shift</span> <span class="pls">+</span> <span class="key">k</span> to shrink the segment. Press <span class="key">delete</span> to delete.';

window.onkeydown = function (event) {
  console.log(event.key)
  if (event.key === " ") {
    (!playing) ? videoElem.play() : videoElem.pause();
    playing = !playing;

    event.preventDefault();
  }
  // if (event.key == "l") {
  //   if currentCanvas !== null {
  //     resize(currentCanvas, l - 1, r);
  //   }
  //   event.preventDefault();
  // }

  // var elem = e.target.type;
  // console.log(elem);
  // if (elem !== 'text') {
  //   return !(e.keyCode == 13);
  // }
}


//_slan_util_msg_show('page_demo_instructions');
//_slan_util_msg_show('press <span class="key">space</span> to play');

beginningWindow.addEventListener("click", () => {
  _slan_util_msg_show('press <span class="key">space</span> to play');
})

videoElem.addEventListener("pause", function () {
  console.log("clicked")
  _slan_util_msg_show('Paused. Press <span class="addRowPlus">+</span> to add new row.');
})

videoElem.addEventListener("play", function () {
  console.log("clicked")
  _slan_util_msg_show('press <span class="key">space</span> to pause');
})

plusText.addEventListener("click", function () {
  _slan_util_msg_show('New text row added. Double click to add a segment');
})

plusGesture.addEventListener("click", function () {
  _slan_util_msg_show('New gesture row added. Double click to add a segment');
}) 

saveButton.addEventListener("click", function () {
  console.log("save clicked")
  _slan_util_msg_show('Segment selected. Use  <span class="key">l</span> or <span class="key">k</span> to expand and <span class="key">shift</span> <span class="pls">+</span> <span class="key">l</span> or <span class="key">shift</span> <span class="pls">+</span> <span class="key">k</span> to shrink the segment. Press <span class="key">delete</span> to delete.');
})

export function _slan_util_msg_show(msg, sticky) {

  var container = document.getElementById('_slan_message_container');
  var content = document.getElementById('_slan_message');
  if (container && content) {
    if (_slan_msg_clear_timer) {
      clearTimeout(_slan_msg_clear_timer);
    }
    if (typeof (sticky) === 'undefined' ||
      sticky === false
    ) {
      _slan_msg_clear_timer = setTimeout(function () {
        document.getElementById('_slan_message_container').style.display = 'none';
      }, _SLAN_CONFIG.MSG_TIMEOUT);
    }

    content.innerHTML = msg + '<span class="message_panel_close_button">&times;</span>';
    container.style.display = 'block';
  }
}


function _slan_util_msg_hide() {
  document.getElementById('_slan_message_container').style.display = 'none';
  if (_slan_msg_clear_timer) {
    clearTimeout(_slan_msg_clear_timer);
  }
}



//**************--TOOLTIP JS--******************//
const opentip = document.querySelectorAll(".open-tooltip");
opentip.forEach((i) => {
  i.title = 'Open SLAN Project'
});

const savetip = document.querySelectorAll(".save-tooltip");
savetip.forEach((i) => {
  i.title = 'Save Project'
});

const importtip = document.querySelectorAll(".import-tooltip");
importtip.forEach((i) => {
  i.title = 'Import SLAN Project'
});

const algotip = document.querySelectorAll(".algo-tooltip");
algotip.forEach((i) => {
  i.title = 'Annotate'
});

const looptip = document.querySelectorAll(".loop-tooltip");
looptip.forEach((i) => {
  i.title = 'Loop'
});

const playtip = document.querySelectorAll(".play-tooltip");
playtip.forEach((i) => {
  i.title = 'Play/Pause'
});

const prevFrametip = document.querySelectorAll(".f1-tooltip");
prevFrametip.forEach((i) => {
  i.title = 'Previous Frame'
});

const nextFrametip = document.querySelectorAll(".f2-tooltip");
nextFrametip.forEach((i) => {
  i.title = 'Next Frame'
});

const quarttip = document.querySelectorAll(".quarter-speed-tooltip");
quarttip.forEach((i) => {
  i.title = '0.25x Playback Speed'
});

const halftip = document.querySelectorAll(".half-speed-tooltip");
halftip.forEach((i) => {
  i.title = '0.5x Playback Speed'
});

const normtip = document.querySelectorAll(".normal-speed-tooltip");
normtip.forEach((i) => {
  i.title = 'Normal Playback Speed'
});

const addRowtip = document.querySelectorAll(".add-row-tooltip");
addRowtip.forEach((i) => {
  i.title = 'Add New Row'
});
