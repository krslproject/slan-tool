var video = document.getElementById('current_video');



//1810 LINE COMMENTED
var segmentSelected = 'Segment selected. Use  <span class="key">l</span> or <span class="key">k</span> to expand and <span class="key">shift</span> <span class="pls">+</span> <span class="key">l</span> or <span class="key">shift</span> <span class="pls">+</span> <span class="key">k</span> to shrink the segment. Press <span class="key">delete</span> to delete.';

var controls = import("/static/js/videoControls.js");
import { _slan_util_msg_show } from "/static/js/subs.js";
// var timeline = document.getElementById('timeline_parent');
// var timeline_for_tip = document.getElementById('timeline_metadata'); //metadata_timeline
// // var tipCanvas = document.createElement("canvas");
// var pointer = document.getElementById('total_progressbar_pointer');
// var tpb = document.getElementById('total_progressbar');
// var tpbctx = tpb.getContext('2d');
// var pointerctx = pointer.getContext('2d');
//
// var subpointer = document.getElementById('subprogressbar_pointer');
// var spb = document.getElementById('subprogressbar');
// var subpointerctx = subpointer.getContext('2d');
// var spbctx = spb.getContext('2d');
//
// var zoomIn = document.getElementById('zoomIn');
// var zoomOut = document.getElementById('zoomOut');
var video_file;
var video_uuid = "";
var active = "";
var activeParam = "";
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

var originalDOM=document.body.innerHTML;

function initTimeline(){

var annotateLabelButton = document.getElementById('annotateButton');

annotateLabelButton.addEventListener('click', function(){
  document.getElementById('additionalVisualization').style.display = 'none';
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('keyboard2').style.display = 'none';
  document.getElementById('keyboard3').style.display = 'none';
  document.getElementById('automaticAnnotation').style.display = 'block';

});


var videoContainer = document.getElementById('videoContainer');
// var video = document.getElementById('current_video');
var videoControls = document.getElementById('video-controls');

// Hide the default controls
// video.controls = false;

// Display the user defined video controls
videoControls.setAttribute('data-state', 'visible');

// Obtain handles to buttons and other elements
var playpause = document.getElementById('playpause');
var loop = document.getElementById('loop');
var stop = document.getElementById('stop');
var mute = document.getElementById('mute');
var volinc = document.getElementById('volinc');
var voldec = document.getElementById('voldec');
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var fullscreen = document.getElementById('fs');
var quarterspeed = document.getElementById('025speed');
var halfspeed = document.getElementById('05speed');
var fullspeed = document.getElementById('1speed');

buildControls();
var ranges = {};

var timeline = document.getElementById('timeline_parent');
var timeline_for_tip = document.getElementById('timeline_metadata'); //metadata_timeline
// var tipCanvas = document.createElement("canvas");
var pointer = document.getElementById('total_progressbar_pointer');
var tpb = document.getElementById('total_progressbar');
var tpbctx = tpb.getContext('2d');
var pointerctx = pointer.getContext('2d');
var metadata_pointer = document.getElementById('metadata_pointer_line');
var metadata_pointer_ctx = metadata_pointer.getContext('2d');


var subpointer = document.getElementById('subprogressbar_pointer');
var spb = document.getElementById('subprogressbar');
var subpointerctx = subpointer.getContext('2d');
var spbctx = spb.getContext('2d');

var zoomIn = document.getElementById('zoomIn');
var zoomOut = document.getElementById('zoomOut');

var backFrame = document.getElementById('back1frame');
var forwardFrame = document.getElementById('forward1frame');

backFrame.addEventListener('click', function(){
  var toChange = video.currentTime - 0.08;
  video.currentTime = toChange + "";
});

forwardFrame.addEventListener('click', function(){
  var toChange = video.currentTime + 0.08;
  video.currentTime = toChange + "";
});

// var bro = document.getElementById(ranges[row_id]); // Tuta

var loop = document.getElementById('loop');

drawTotalProgressBar();
drawSubprogressBar();

loop.addEventListener('click', function(){
  var video_source = document.getElementById('source-video');
  //console.log(video_source.src);
  if (loop.value == "loop"){
    loop.value = "once";
    loop.setAttribute("style", "border:none; width:4%; background-color:rgb(200,200,200); margin-bottom:5px; border-radius: 3px;");
  } else {
    loop.value = "loop";
    loop.setAttribute("style", "border:none; width:4%; background-color:white; margin-bottom:5px; border-radius: 3px;");
  }
}, false);


$(document).on("change", ".custom-file-input", function(evt) {
  document.body.innerHTML = originalDOM;
  var $source = $('#source-video');
  video_file = this.files[0];
  // const savefile = async () => {
  //   //console.log(video_file);
  //   ffmpeg.FS('writeFile', video_file_name, video_file);
  // };

  // savefile();
  // const { name } = this.files[0];
  // video_file_name = name;
  //console.log(video_file);
  $source[0].src = URL.createObjectURL(this.files[0]);
  // const trimvideo = document.getElementById('trim-video');
  // trimvideo.src = URL.createObjectURL(this.files[0]);
  $source.parent()[0].load();
  setTimeout(function(){
    video = document.getElementById('current_video');
    initTimeline();
  }, 3000);
  ranges = {};
  var controls = import("/static/js/videoControls.js");
  //beacuse on load metadata working
});

function clearTheTimeline() {
  var elementsToRemove = document.getElementById('metadata_name').querySelectorAll("[id*='_rowname']");
  for (var i = 0; i < elementsToRemove.length; i++) {
    elementsToRemove[i].remove();
  }
  var elementsToRemove2 = document.getElementById('metadata_timeline').querySelectorAll("[id]");

  // Loop over the matching elements and remove them from the div
  for (var i = 0; i < elementsToRemove2.length; i++) {
    if (elementsToRemove2[i].id.length === 4) {
      elementsToRemove2[i].remove();
    }
  }
}

$(document).on("change", ".open-project", function(evt) {

  function readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
              callback(rawFile.responseText);
          }
      }
      rawFile.send(null);
  }
  //usage:
  readTextFile(URL.createObjectURL(this.files[0]), function(text){
      var data = JSON.parse(text);
      //console.log(data);
      ranges = data['value'];
      // Display a confirmation dialog box with a message and OK and Cancel buttons
      var result = confirm("Current project will be cleared. Please, make sure the project is saved.");

      // Check the value of the result variable to see whether the user clicked OK or Cancel
      if (result) {
        //Clearing the project
        clearTheTimeline();

        for (const range in ranges) {
          addRowFunction(ranges[range]['tier_type'], ranges[range]['tier_name'], range);
        }
      } else {
        //console.log("Import/Open project cancelled.");
      }
      return null;
  });
});

$(document).on("change", ".import-file", function(evt) {

  function updateRangesFromJson(jsonData, videoDuration) {
    ranges = {};

    if (jsonData.hasOwnProperty('TIERS')) {
      jsonData.TIERS.forEach(function(tierObj) {
        var tier = tierObj.TIER;
        var tierId = tier.TIER_ID;

        ranges[tierId] = {
          'canvas': {},
          'ctx': {},
          'totalDuration': videoDuration,
          'startDuration': 0,
          'endDuration': 0,
          'currentPosition': 0,
          'draggable': false,
          'mouseX': 0,
          'mouseY': 0,
          'padding': 0,
          'ranges': [],
          'cw': 782,
          'ch': 40,
          'width': 782,
          'tier_type': tier.TIER_TYPE || '',
          'tier_name': tier.TIER_NAME || ''
        };

        tier.ANNOTATIONS.forEach(function(annotation) {
          var rangeObj = {
            'range_pix': [
              Math.floor((annotation.BEGIN_TIME / (videoDuration * 1000)) * 782),
              Math.floor((annotation.END_TIME / (videoDuration * 1000)) * 782)
            ],
            'range': [
              parseFloat((annotation.BEGIN_TIME / (videoDuration * 1000)).toFixed(6)),
              parseFloat((annotation.END_TIME / (videoDuration * 1000)).toFixed(6))
            ],
            'type': annotation.TYPE || '',
            'value': annotation.VALUE,
            'id': annotation.ANNOTATION_ID
          };

          if (annotation.VALUE_ICON) {
            rangeObj.value_icon = annotation.VALUE_ICON;
          }

          ranges[tierId]['ranges'].push(rangeObj);
        });
      });
    }
    //console.log(ranges);
    return ranges;
  }

  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
        //console.log(e)
        return false;
      }
      return true;
  }

  function isXml(str) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "application/xml");
      return xmlDoc.getElementsByTagName("parsererror").length === 0;
  }

  const input = evt.target;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const content = e.target.result;
      if (isJson(content)) {
        const jsonContent = JSON.parse(content);
        updateRangesFromJson(jsonContent, video.duration);
        for (const range in ranges) {
          addRowFunction(ranges[range]['tier_type'], ranges[range]['tier_name'], range);
        }
        //console.log("JSON content:", jsonContent);
      } else if (isXml(content)) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "application/xml");
        // Process XML content here
        //console.log("XML content:", xmlDoc);
      } else {
        //console.log(content);  
        //console.error("Invalid file format. Please upload a JSON or XML file.");
      }
    };

    reader.readAsText(file);
  }
});


var saveProject = document.getElementById('saveProject');
saveProject.addEventListener('click', function(){
  //console.log("start downloading");
  var res = {};
  // res["source"] = url.;
  res["value"] = ranges;
  this.href = "data:text/plain;charset=utf-8," +JSON.stringify(res);
  this.download = "savedProject.txt";
});

var exportTimeXML = document.getElementById('exportTimeXML');
exportTimeXML.addEventListener("click", function(){
  var doc = document.implementation.createDocument("", "", null);
  var annotation_document = doc.createElement("ANNOTATION_DOCUMENT");
  for ( var key in ranges) {
    // //console.log(key);
    var tier = doc.createElement("TIER");
    tier.setAttribute("TIER_ID", key);

    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      var curr_range = ranges[key]['ranges'][i];

      var annotation = doc.createElement("ANNOTATION");
      annotation.setAttribute("ANNOTATION_ID", curr_range['id']);
      annotation.setAttribute("BEGIN_TIME", Math.floor((curr_range['range'][0]*video.duration*1000)));
      annotation.setAttribute("END_TIME", Math.floor((curr_range['range'][1]*video.duration*1000)));
      var alignable_anootation = doc.createElement("ALIGNABLE_ANNOTATION");

      var annotation_value = doc.createElement("ANNOTATION_VALUE");
      annotation_value.innerHTML = curr_range['value'];
      annotation.appendChild(annotation_value);
      tier.appendChild(annotation);
    }
    annotation_document.appendChild(tier);
  }
  doc.appendChild(annotation_document);

  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(doc);
  var etfContent = '<?xml version="1.0" encoding="UTF-8"?>' + xmlStr;
  // var encodedUri = encodeURI(prettifyXml(xmlStr));
  //console.log(prettifyXml(etfContent));
  exportTimeXML.href = "data:text/xml;charset=utf-8," + prettifyXml(etfContent);
  exportTimeXML.download = "project.xml";
});

var exportTimeJson = document.getElementById('exportTimeJson');
exportTimeJson.addEventListener("click", function() {
  var doc = document.implementation.createDocument("", "", null);
  var jsonData = { 'TIERS': [] };

  for (var key in ranges) {
    var tierData = {
      'TIER_ID': key,
      'TIER_TYPE': ranges[key]['tier_type'],
      'TIER_NAME': ranges[key]['tier_name'],
      'ANNOTATIONS': []
    };

    for (var i = 0; i < ranges[key]['ranges'].length; i++) {
      var curr_range = ranges[key]['ranges'][i];

      var annotationData = {
        'ANNOTATION_ID': curr_range['id'],
        'BEGIN_TIME': Math.floor((curr_range['range'][0] * video.duration * 1000)),
        'END_TIME': Math.floor((curr_range['range'][1] * video.duration * 1000)),
        'VALUE': curr_range['value'],
        'VALUE_ICON': curr_range['value_icon'],
        'TYPE': ranges[key]['tier_type'],
      };

      tierData.ANNOTATIONS.push(annotationData);
    }

    jsonData.TIERS.push({ 'TIER': tierData });
  }

  var jsonString = JSON.stringify(jsonData);
  exportTimeJson.href = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
  exportTimeJson.download = "project.json";
});


var exportFrameXML = document.getElementById('exportFrameXML');
exportFrameXML.addEventListener("click", function(){
  var q = video.duration
  var rs_width;
  for ( var key in ranges) {
    if (ranges[key] != null){
      rs_width = ranges[key]['canvas'].getBoundingClientRect().width;
      break;
    }
  }

  var step = 0.04/video.duration;
  var frameCount = Math.floor(video.duration/0.04);
  //console.log("frameCOunt");
  //console.log(frameCount);
  var cranges = {};
  for ( var key in ranges) {
    cranges[key] = []
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      // //console.log(curr_range);
      var curr_range = ranges[key]['ranges'][i];
      cranges[key].push({
        'id': curr_range['id'],
        'range0': curr_range['range'][0],
        'range1': curr_range['range'][1],
        'value': curr_range['value'],
      });
      // //console.log(cranges[key]);
    }
  }

  var doc = document.implementation.createDocument("", "", null);
  var frames = doc.createElement("FRAMES");

  for (var i = 0; i < frameCount; i++ ){
    var frame = doc.createElement("FRAME");
    frame.setAttribute("FRAME_NUMBER", i);

    for (var key in cranges) {
      var annotation = doc.createElement("ANNOTATION");
      annotation.setAttribute("ANNOTATION_ID", key);
      var value = doc.createElement("VALUE");
      for (var j in cranges[key]){
        // //console.log(cranges[key][j]);
        // //console.log(step);
        if ( step > cranges[key][j]['range0'] && step < cranges[key][j]['range1'] ){
          value.innerHTML = cranges[key][j]['value'];
          break;
        }
      }
      annotation.appendChild(value);
      frame.appendChild(annotation);
    }
    step += 0.04/video.duration;
    frames.appendChild(frame)
  }

  doc.appendChild(frames);
  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(doc);
  var xmlContent = '<?xml version="1.0" encoding="UTF-8"?>' + xmlStr;
  // var encodedUri = encodeURI(prettifyXml(xmlStr));
  // //console.log(prettifyXml(xmlContent));
  exportFrameXML.href = "data:text/xml;charset=utf-8," + prettifyXml(xmlContent);
  exportFrameXML.download = "project.xml";
});

var exportFrameJson = document.getElementById('exportFrameJson');
exportFrameJson.addEventListener("click", function(){
  var q = video.duration
  var rs_width;
  for ( var key in ranges) {
    if (ranges[key] != null){
      rs_width = ranges[key]['canvas'].getBoundingClientRect().width;
      break;
    }
  }

  var step = 0.04/video.duration;
  var frameCount = Math.floor(video.duration/0.04);
  //console.log("frameCOunt");
  //console.log(frameCount);
  var cranges = {};
  for ( var key in ranges) {
    cranges[key] = []
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      // //console.log(curr_range);
      var curr_range = ranges[key]['ranges'][i];
      cranges[key].push({
        'id': curr_range['id'],
        'range0': curr_range['range'][0],
        'range1': curr_range['range'][1],
        'value': curr_range['value'],
      });
      // //console.log(cranges[key]);
    }
  }

  // var doc = document.implementation.createDocument("", "", null);
  // var frames = doc.createElement("FRAMES");
  var jsonString = '{"FRAMES": [';
  for (var i = 0; i < frameCount; i++ ){
    jsonString += '{"FRAME_NUMBER" : ' + i + ",";
    // var frame = doc.createElement("FRAME");
    // frame.setAttribute("FRAME_NUMBER", i);
    jsonString += '"ANNOTATIONS" : [';
    for (var key in cranges) {
      // var annotation = doc.createElement("ANNOTATION");
      // annotation.setAttribute("ANNOTATION_ID", key);
      jsonString += '{"ANNOTATION_ID": ' + key + ', "VALUE":' ;
      for (var j in cranges[key]){
        // //console.log(cranges[key][j]);
        // //console.log(step);
        if ( step > cranges[key][j]['range0'] && step < cranges[key][j]['range1'] ){
          jsonString += cranges[key][j]['value'];
          break;
        }
      }

      jsonString += "]},";
    }
    step += 0.04/video.duration;
    jsonString += "},";

  }

  jsonString += "]}";
  exportFrameJson.href = "data:text/json;charset=utf-8," + jsonString;
  exportFrameJson.download = "project.json";
});

var prettifyXml = function(sourceXml){
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};

var etfexport = document.getElementById('etfexport');

etfexport.addEventListener('click', function(){
  var doc = document.implementation.createDocument("", "", null);
  var annotation_document = doc.createElement("ANNOTATION_DOCUMENT");
  annotation_document.setAttribute('AUTHOR', "");
  annotation_document.setAttribute('DATE', "2021-07-08T16:51:56+06:00");
  annotation_document.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
  annotation_document.setAttribute('xsi:noNamespaceSchemaLocation', "http://www.mpi.nl/tools/elan/EAFv3.0.xsd");

  var header = doc.createElement("HEADER");
  var media_descriptor = doc.createElement("MEDIA_DESCRIPTOR");
  media_descriptor.setAttribute("MEDIA_URL", "");
  media_descriptor.setAttribute("MIME_TYPE", "");
  media_descriptor.setAttribute("RELATIVE_MEDIA_URL", "");
  header.appendChild(media_descriptor);
  annotation_document.appendChild(header);
  //console.log("appendding...")

  var time_order = doc.createElement("TIME_ORDER");
  var ling_type = doc.createElement("LINGUISTIC_TYPE");
  ling_type.setAttribute("GRAPHIC_REFERENCES", "false");
  ling_type.setAttribute("LINGUISTIC_TYPE_ID", "default-lt");
  ling_type.setAttribute("TIME_ALIGNABLE", "true");

  var aid = 0;
  var ts = 0;
  for ( var key in ranges) {
    // //console.log(key);
    var tier = doc.createElement("TIER");
    tier.setAttribute("TIER_ID", key);
    tier.setAttribute("LINGUISTIC_TYPE_REF", "default-lt");
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      var curr_range = ranges[key]['ranges'][i];
      // //console.log(Math.floor((curr_range['range'][0]*video.duration*100)));
      // //console.log(Math.floor((curr_range['range'][1]*video.duration*100)));
      var time_slot1 = doc.createElement("TIME_SLOT");
      ts++;
      time_slot1.setAttribute("TIME_SLOT_ID", "ts" + ts);
      time_slot1.setAttribute("TIME_VALUE", Math.floor((curr_range['range'][0]*video.duration*100)));
      var time_slot2 = doc.createElement("TIME_SLOT");
      ts++;
      time_slot2.setAttribute("TIME_SLOT_ID", "ts" + ts);
      time_slot2.setAttribute("TIME_VALUE", Math.floor((curr_range['range'][1]*video.duration*100)));
      time_order.appendChild(time_slot1);
      time_order.appendChild(time_slot2);
      var annotation = doc.createElement("ANNOTATION");
      var alignable_anootation = doc.createElement("ALIGNABLE_ANNOTATION");
      aid++;
      alignable_anootation.setAttribute("ANNOTATION_ID", "a"+aid);
      alignable_anootation.setAttribute("TIME_SLOT_REF1", "ts" + (ts-1));
      alignable_anootation.setAttribute("TIME_SLOT_REF2", "ts" + ts);
      var annotation_value = doc.createElement("ANNOTATION_VALUE");
      annotation_value.innerHTML = curr_range['value'];
      alignable_anootation.appendChild(annotation_value);
      annotation.appendChild(alignable_anootation);
      tier.appendChild(annotation);

    }
    annotation_document.appendChild(tier);
  }
  annotation_document.appendChild(time_order);
  annotation_document.appendChild(ling_type);
  doc.appendChild(annotation_document);

  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(doc);
  var etfContent = '<?xml version="1.0" encoding="UTF-8"?>' + xmlStr;
  // var encodedUri = encodeURI(prettifyXml(xmlStr));
  //console.log(prettifyXml(etfContent));
  etfexport.href = "data:text/xml;charset=utf-8," + prettifyXml(etfContent);
  etfexport.download = "project.eaf";
  // etfexport.click();
  // window.open(encodedUri);
});

document.getElementById('shareButton').addEventListener("click", function (event){
  var form_data = new FormData();

  var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
 
  form_data.append('ranges', JSON.stringify(ranges));
  var result = 'null';
  $.ajax({
      url: '/share/', // point to server-side URL
      dataType: 'json', // what to expect back from server
      cache: false,
      async: false,
      contentType: false,
      processData: false,
      //data: {'data': form_data, 'csrfmiddlewaretoken': csrf_token},
      data: form_data,
      type: 'post',
      success: function (response) { // display success
        // //console.log(response['filename']);
        // return response['filename'];
        //console.log(response['url'])
        result = response['url'];
        var generated_url = '127.0.0.1:8000/share/?key=' + response['url'];
        // alert("URL to share copied to the clipboard!");
        // navigator.clipboard.writeText(generated_url);

        navigator.clipboard.writeText(generated_url).then(function(x) {
          alert("Link copied to clipboard!");
        });
      },
      // error: function (response) {
      //  $('#msg').html(response.message); // display error response
      // }
  });
});

function updateCanvas(){
  for ( var key in ranges) {
    ranges[key].draw();
  }
}

function textValueSaveFunction(){
  var curr_range = getActiveRange();
  var text_field = document.getElementById('textValue');
  var additional_visualization = document.getElementById('additionalVisualization');
  var keyboard_div = document.getElementById('keyboard');
  curr_range['value'] = text_field.value;
  additional_visualization.style.display = 'block';
  keyboard_div.style.display = 'none';
  text_field.value = '';
  updateCanvas()
}

document.getElementById('textValue').addEventListener("input", function(){
  var curr_range = getActiveRange();
  curr_range['value'] = this.value;
  updateCanvas();
});   


function textValueSaveFunctionInitial(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
      var curr_range = getActiveRange();
      var text_field = document.getElementById('inlineTextValue');
      // var additional_visualization = document.getElementById('additionalVisualization');
      // var keyboard_div = document.getElementById('keyboard');
      _slan_util_msg_show(segmentSelected);
      curr_range['value'] = text_field.value;
      // additional_visualization.style.display = 'block';
      // keyboard_div.style.display = 'none';
      text_field.value = '';
      document.body.removeChild(this);
      updateCanvas()
    }
}


document.getElementById('textValueSave').addEventListener("click", function (event){
  textValueSaveFunction();
});

document.getElementById('textValue').addEventListener('keyup', function(){
  if (event.keyCode === 13) {
    textValueSaveFunction();
  }
}, false);


var handshapeValueSave = document.getElementById('handshapeValueSave');
// //console.log(savebutton);
handshapeValueSave.addEventListener("click", function (event){
  var curr_value = document.getElementById('hand-value');
  //console.log(curr_value)
  var curr_range = getActiveRange();

  if (curr_value.src === "http://slan-tool.com/media/select.png"){
    alert("Value cannot be saved!");
  } else {
    curr_range['value'] = curr_value.src;
    curr_range['value_icon'] = curr_value.title;

    handshapeValueSave.innerHTML = "Saved!"
  }

});

// for extended finger: ********************

var extFingerValueSave = document.getElementById('extended-finger-value-save');

extFingerValueSave.addEventListener("click", function (event){
  var curr_value = document.getElementById('extended-finger-value');
  // //console.log(curr_value)
  var curr_range = getActiveRange();


  if (curr_value.src === "http://slan-tool.com/media/select.png"){
    alert("Value cannot be saved!");
  } else {
    curr_range['value'] = curr_value.src;
    curr_range['value_icon'] = curr_value.title;

    extFingerValueSave.innerHTML = "Saved!"
  }

});
/************************************** */


// for palm: ********************

var palmValueSave = document.getElementById('palmValueSave');

palmValueSave.addEventListener("click", function (event){
  var curr_value = document.getElementById('palm-value');
  // //console.log(curr_value)
  var curr_range = getActiveRange();


  if (curr_value.src === "http://slan-tool.com/media/select.png"){
    alert("Value cannot be saved!");
  } else {
    curr_range['value'] = curr_value.src;
    curr_range['value_icon'] = curr_value.title;

    palmValueSave.innerHTML = "Saved!"
  }

});
/************************************** */



var savebutton = document.getElementById('saveOptions');

savebutton.addEventListener("click", function (){
  //console.log("This is it");
  // //console.log(ranges);
  // var value = document.getElementById('modalValue').value;
  var typeRadios = document.getElementsByName("typeRadios");
  var type;
  for (var i = 0; i < typeRadios.length; i++){
    if (typeRadios[i].checked){
      type = typeRadios[i].value;
      break;
    }
  }
  var curr_range = getActiveRange();
  curr_range['type'] = type;

  document.getElementById('additionalVisualization').style.display = 'none';
  //console.log("Hahahhaah")
  document.getElementById('keyboard').style.display = 'block';
  document.getElementById('automaticAnnotation').style.display = 'none';

  if (type == "text"){
    document.getElementById('textValueDiv').style.display = 'block';
    document.getElementById('handshapeValueDiv').style.display = 'none';
    document.getElementById('textValue').autofocus = true;

  } else {
    document.getElementById('textValueDiv').style.display = 'none';
    document.getElementById('handshapeValueDiv').style.display = 'block';
    handshapeValueSave.innerHTML = "Save";
    document.getElementById('hand-value').src = '/media/select.png';
  }
}, false);

var importButton = document.getElementById('importButton');

importButton.addEventListener("click", function (){


}, false);

var result_range;
async function parse_results(filename){
  //console.log("parsing results");
  var stopParsing = 0;
  var form_data = new FormData();
  form_data.append("filename", filename);
  while (stopParsing === 0){
    $.ajax({
    		url: '/parse_results/?filename='+filename, // point to server-side URL
    		dataType: 'json', // what to expect back from server
    		// cache: false,
    		// contentType: false,
    		// processData: false,
    		// data: {"filename", filename},
    		type: 'get',
    		success: function (response) { // display success response
          //console.log(response);
          //console.log(response['results']);
          if (response['status'] == 'active'){
            stopParsing = 1;
            result_range = response['results'];
          }
          // video_uuid = response['filename'];
          // //console.log(response['filename']);
          // parse_results(response['filename'])
    		},
    		// error: function (response) {
    		// 	$('#msg').html(response.message); // display error response
    		// }
  	});
    await sleep(3000);
  }
}

function uploadVideo(type, time_range){
  var form_data = new FormData();
  // //console.log(video_file)
	form_data.append("files", video_file);

  var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
	//console.log(csrf_token);
  form_data.append("type", type);
  form_data.append("time_start", time_range['start']);
  form_data.append("time_end", time_range['end']);
	form_data.append('csrfmiddlewaretoken', csrf_token);
  var result = 'null';
	$.ajax({
  		url: '/upload/', // point to server-side URL
  		dataType: 'json', // what to expect back from server
  		cache: false,
      async: false,
  		contentType: false,
  		processData: false,
  		//data: {'data': form_data, 'csrfmiddlewaretoken': csrf_token},
  		data: form_data,
  		type: 'post',
  		success: function (response) { // display success
        // //console.log(response['filename']);
        // return response['filename'];
        result = response['filename'];
  		},
  		// error: function (response) {
  		// 	$('#msg').html(response.message); // display error response
  		// }
	});
  return result;
}

function addNewRow(segment_name){
  // if (segment_name in ranges){
  //   //console.log("Already exists");
  //   //console.log(ranges);
  // } else {

    var rowNameDiv = document.createElement("div");
    rowNameDiv.setAttribute("id", segment_name + "_rowname");
    rowNameDiv.setAttribute("style", "padding: 8px; height: 40px; z-index: 0;");
    var rowName = document.createElement("a");
    rowName.innerHTML = segment_name;

    var rowDeleteIcon = document.createElement("i");

    rowDeleteIcon.setAttribute("class", "bi bi-x deleteRow");
    rowDeleteIcon.addEventListener('click', function(){
      if (confirm('Are you sure you want to remove row ' + segment_name + "?" )) {
        delete ranges[segment_name];
        //console.log(ranges);
        var curcanvas = document.getElementById(segment_name);
        document.getElementById('metadata_timeline').removeChild(curcanvas);
        var curname = document.getElementById(segment_name + "_rowname");
        //console.log(curname);
        metadata_name.removeChild(curname);
        var additionalName = document.getElementById("addValueName" + segment_name);
        var additionalValue = document.getElementById("addValue" + segment_name);
        var addDiv = document.getElementById('additionalVisualizationRow');
        addDiv.removeChild(additionalName);
        addDiv.removeChild(additionalValue);

      } else {
        // Do nothing!
        //console.log('Cancelled');
      }

    }, false);

    rowNameDiv.appendChild(rowName);
    rowNameDiv.appendChild(rowDeleteIcon);

    document.getElementById('metadata_name').appendChild(rowNameDiv);

    var currcanvas = document.createElement("canvas");
    currcanvas.setAttribute("id", segment_name);
    currcanvas.setAttribute("padding-top", "-10px");
    currcanvas.setAttribute("z-index", "0");
    currcanvas.setAttribute("position", "absolute");
    document.getElementById('metadata_timeline').appendChild(currcanvas);
    customRangeSlider.init(10, segment_name, 'segment', segment_name);
    //additionalVisualization
    var addColName = document.createElement("div");
    addColName.setAttribute("class", "col-6");
    addColName.setAttribute("style", "height:80px;");
    var addColValue = document.createElement("div");
    addColValue.setAttribute("class", "col-6");
    addColValue.setAttribute("id", "addValue" + segment_name);
    var addName = document.createElement("a");
    addName.innerHTML = segment_name;
    addColName.append(addName);

    var addDiv = document.getElementById('additionalVisualizationRow');
    addDiv.append(addColName);
    addDiv.append(addColValue);
}

var scissorsButton = document.getElementById('scissorsButton');

scissorsButton.addEventListener("click", async function (){
  var curr_range = getActiveRange();
  document.getElementById('scissorsButton').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> Uploading';
  var filename_uuid = uploadVideo('segmentation', {'start': 0, 'end': 1});
  //console.log(filename_uuid);
  document.getElementById('scissorsButton').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> Running';
  await parse_results(filename_uuid);
  var results;
  //console.log("I want results here");
  //console.log(result_range);
  alert("Signing area recognition is finished! Annotations will be created in Text tier and will be called \"Signing\"");
  document.getElementById('scissorsButton').innerHTML = 'Run';
  var temp_id = addRowFunction("text", "Signing");
  await sleep(1000);
  ranges[temp_id]['ranges'] = result_range;

}, false);

var handshapesButton = document.getElementById('handshapesButton');

function disableHandshapeButton() {
  // var handshapesButton = document.getElementById('handshapesButton');
  document.getElementById('handshapeWarning').style.display = 'block';
  handshapesButton.style.backgroundColor = 'grey';
  handshapesButton.style.border = "none";
  // handshapesButton.disabled = true;
  // handshapesButton.addEventListener("click", function (){
  //   //console.log("shit yourself")
  // });
}

function activateHandshapeButton(){
  // var handshapesButton = document.getElementById('handshapesButton');
  document.getElementById('handshapeWarning').style.display = 'none';
  handshapesButton.style.backgroundColor = "rgb(64, 159, 255)";
  // handshapesButton.disabled = false;

}
const sleep = ms => new Promise(res => setTimeout(res, ms));

handshapesButton.addEventListener("click", async function (){
  if (this.style.backgroundColor == 'grey') {
    //console.log("unactive");
  } else {
    var curr_range = getActiveRange();
    document.getElementById('handshapesButton').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> Uploading';
    
    var filename_uuid = uploadVideo('mp_handshapes', {'start': curr_range['range'][0], 'end': curr_range['range'][1]});
    //console.log(filename_uuid);
    document.getElementById('handshapesButton').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> Running';
    await parse_results(filename_uuid);
    var results;
    //console.log("I want results here");
    //console.log(result_range);
    alert("Handshapes recognition is finished! Annotations will be created in Handshape tier and will be called \"Right hand\"");
    document.getElementById('handshapesButton').innerHTML = 'Run';
    var temp_id = addRowFunction("handshape", "Right hand");
    await sleep(1000);
    ranges[temp_id]['ranges'] = result_range;
  }
}, false);


// var runAutamicRecognitionButton = document.getElementById('runAutamicRecognition');
//
// runAutamicRecognition.addEventListener("click", function(){
//   var value = document.getElementById('hand-value');
//   value.src = "http://slan-tool.com/media/fourspread20.png";
// });

function colorActive(rs, id){
  rs.canvas.style="background-color: rgb(138, 210, 255);";
  var toSearch = id + "_rowname";
  // //console.log(toSearch);
  var rowname = document.getElementById(toSearch);
  // //console.log(rowname);
  if (rowname != null){
    rowname.setAttribute("style", "padding: 8px; height: 40px; z-index: 0; background-color: rgb(166, 221, 255);");
  }// rowname.style.background = "rgb(138, 210, 255);";
}

function uncolorActive(rs, id){
  rs.canvas.style="background-color: rgba(200,200,200, 0);";
  var toSearch = id + "_rowname";
  // //console.log(toSearch);
  var rowname = document.getElementById(toSearch);
  if (rowname != null){

    rowname.setAttribute("style", "padding: 8px; height: 40px; z-index: 0; background-color: rgb(255, 255, 255);");
  }

  // rowname.style.background = "rgb(255, 255, 255);";
}

function getActiveRange(){
  var range = null;
  for ( var key in ranges) {
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      if (ranges[key]['ranges'][i]['id'] == active){
        // ranges[key]['ranges'][i]['value'] = value;
        range = ranges[key]['ranges'][i];
      }
    }
  }
  return range;
}

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  var timeline = document.getElementById('metadata_timeline');
  for ( var key in ranges) {
    var canvasToResize = ranges[key]['canvas'];
    // //console.log($('#metadata_timeline').width());
    canvasToResize.width = $('#metadata_timeline').width();
    if ('draw' in ranges[key]) {
      ranges[key].draw();
    }
  }

}
resizeCanvas();

function zoomCanvas(zoomValue, type){
  // //console.log(e.wheelDeltaX);
  var timeline_canvas = document.getElementById('metadata_timeline'); //metadata_timeline
  var progress = document.getElementById('subprogressbar');
  var progress_pointer = document.getElementById('subprogressbar_pointer'); //metadata_timeline
  // //console.log("progress");
  // //console.log(progress.width);
  var curr_width = $('#metadata_timeline').width();
  // //console.log(curr_width);
  if (zoomValue < -20) {
    if (type == "wheel"){
      timeline_canvas.style.width = curr_width + 10;
      progress.width = curr_width + 10;
      progress_pointer.width = curr_width + 10;
    } else {
      timeline_canvas.style.width = curr_width + 50;
      progress.width = curr_width + 50;
      progress_pointer.width = curr_width + 50;
    }

  } else if (zoomValue > 20) {
    if (type == "wheel"){
      timeline_canvas.style.width = curr_width - 10;
      progress.width = curr_width - 10;
      progress_pointer.width = curr_width - 10;
    } else {
      timeline_canvas.style.width = curr_width - 50;
      progress.width = curr_width - 50;
      progress_pointer.width = curr_width - 50;
    }
  }
  resizeCanvas();
  drawSubprogressBar();
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

var customRangeSlider = {
    canvas: "",
    init: function(totalDuration, row_name, tier_type, canvas_id) {
        this.canvas = canvas_id;
        if (!(canvas_id in ranges)){
          ranges[canvas_id] = {};
          ranges[canvas_id]['canvas'] = document.getElementById(canvas_id);
          ranges[canvas_id]['ctx'] = ranges[canvas_id]['canvas'].getContext('2d');
          ranges[canvas_id]['totalDuration'] = totalDuration;
          ranges[canvas_id]['startDuration'] = 0;
          ranges[canvas_id]['endDuration'] = 0;
          ranges[canvas_id]['currentPosition'] = 0;
          ranges[canvas_id]['draggable'] = false;
          ranges[canvas_id]['mouseX'] = 0;
          ranges[canvas_id]['mouseY'] = 0;
          ranges[canvas_id]['padding'] = 0;
          ranges[canvas_id]['ranges'] = [];
          resizeCanvas();
          ranges[canvas_id]['canvas'].height = 40;
          ranges[canvas_id]['cw'] = ranges[canvas_id]['ctx'].canvas.getBoundingClientRect().width;
          ranges[canvas_id]['ch'] = ranges[canvas_id]['ctx'].canvas.height;
          ranges[canvas_id]['width'] = ranges[canvas_id]['cw'] - ranges[canvas_id]['padding'];

        } else {
          ranges[canvas_id]['canvas'] = document.getElementById(canvas_id);
          ranges[canvas_id]['ctx'] = ranges[canvas_id]['canvas'].getContext('2d');
          ranges[canvas_id]['totalDuration'] = totalDuration;
          ranges[canvas_id]['startDuration'] = 0;
          ranges[canvas_id]['endDuration'] = 0;
          ranges[canvas_id]['currentPosition'] = 0;
          ranges[canvas_id]['draggable'] = false;
          ranges[canvas_id]['mouseX'] = 0;
          ranges[canvas_id]['mouseY'] = 0;
          ranges[canvas_id]['padding'] = 0;
          resizeCanvas();
          ranges[canvas_id]['canvas'].height = 40;
          ranges[canvas_id]['cw'] = ranges[canvas_id]['ctx'].canvas.getBoundingClientRect().width;
          ranges[canvas_id]['ch'] = ranges[canvas_id]['ctx'].canvas.height;
          ranges[canvas_id]['width'] = ranges[canvas_id]['cw'] - ranges[canvas_id]['padding'];
        }
        ranges[canvas_id]['tier_type'] = tier_type;
        ranges[canvas_id]['tier_name'] = row_name;
        var rs = ranges[canvas_id];
        ranges[canvas_id]['update'] = function(mouseX, cursor, rangeIndex) {

          var rs = ranges[canvas_id];
          var cw = rs['cw'];
          var totalDuration = rs['totalDuration'];

          if (cursor) {

            rs['ranges'][rangeIndex]['range'][0] = Math.min(mouseX, rs['ranges'][rangeIndex]['range'][1]*rs['canvas'].getBoundingClientRect().width)/rs['canvas'].getBoundingClientRect().width;
            rs['ranges'][rangeIndex]['range'][0] = Math.max(rs['ranges'][rangeIndex]['range'][0]*rs['canvas'].getBoundingClientRect().width, rs.padding)/rs['canvas'].getBoundingClientRect().width;

            rs.currentProgress = (rs['ranges'][rangeIndex]['range'][0]*rs['canvas'].getBoundingClientRect().width - rs.padding) / (rs['canvas'].getBoundingClientRect().width - rs.padding);
            rs.startDuration = totalDuration * ((rs['ranges'][rangeIndex]['range'][0]*rs['canvas'].getBoundingClientRect().width - rs.padding) / rs['canvas'].getBoundingClientRect().width);

          } else {
            rs['ranges'][rangeIndex]['range'][1] = Math.min(mouseX, rs.width)/rs['canvas'].getBoundingClientRect().width;
            rs['ranges'][rangeIndex]['range'][1] = Math.max(rs['ranges'][rangeIndex]['range'][1]*rs['canvas'].getBoundingClientRect().width, rs['ranges'][rangeIndex]['range'][0])/rs['canvas'].getBoundingClientRect().width;

            rs.currentProgress = (rs['ranges'][rangeIndex]['range'][1]*rs['canvas'].getBoundingClientRect().width - rs.padding) / (rs['canvas'].getBoundingClientRect().width - rs.padding);
            rs.endDuration = totalDuration * ((rs['ranges'][rangeIndex]['range'][1]*rs['canvas'].getBoundingClientRect().width - rs.padding) / rs['canvas'].getBoundingClientRect().width);

          }

          // if (rs['ranges'][rangeIndex]['range'][0] > rs['ranges'][rangeIndex]['range'][1]) {
          //   var temp = rs['ranges'][rangeIndex]['range'][1];
          //   rs['ranges'][rangeIndex]['range'][1] = rs['ranges'][rangeIndex]['range'][0];
          //   rs['ranges'][rangeIndex]['range'][0] = temp;
          // }

        };
        ranges[canvas_id]['draw'] = function() {
          var rs = ranges[canvas_id];
          var currentPosition = rs['currentPosition'];
          var ch = rs['ch'];
          rs.clearCanvas();


          rs['ctx'].beginPath();
          var pad = (ch - rs.padding)/2
          rs['ctx'].moveTo(rs.padding, pad);
          rs['ctx'].lineTo(rs['canvas'].getBoundingClientRect().width, pad);
          rs['ctx'].closePath();
          rs['ctx'].strokeStyle =  "rgb(220,220,220)";
          rs['ctx'].lineWidth = 25;
          rs['ctx'].stroke();
          rs['ctx'].closePath();
          //Draw selected segment;
          for (var i=0; i < rs['ranges'].length; i++){
            if (rs['ranges'][i]['range'][0] > rs['ranges'][i]['range'][1] && !ranges[canvas_id]['draggable']){
              var curr_value = rs['ranges'][i]['range'][0];
              rs['ranges'][i]['range'][0] = rs['ranges'][i]['range'][1];
              rs['ranges'][i]['range'][1] = curr_value;
            }
            
            rs.ctx.save();
            rs.ctx.beginPath();
            rs.ctx.moveTo(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, pad); //ch - rs.padding
            rs.ctx.lineTo(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, pad);
            rs.ctx.closePath();

            if (active == rs['ranges'][i]['id']){
              rs.ctx.strokeStyle = "rgb(232, 152, 30)";
              
            } else {
              var current_color="rgb(64, 159, 255)"
              if (i % 2 == 0){
                current_color = "rgb(44, 131, 219)"
              }
              if ("text" == rs['ranges'][i]['type']){
                rs.ctx.strokeStyle = current_color; //"rgb(64, 159, 255)";
              } else {
                rs.ctx.strokeStyle = current_color; //"rgb(64, 159, 255)";
              }

            }


            rs.ctx.lineWidth = 25;
            rs.ctx.stroke();
            rs.ctx.closePath();

          // rs.ctx.clip();
            if (rs['ranges'][i]['type'] === "text"){
              rs.ctx.fillStyle = "rgb(220,220,220)";
              rs.ctx.font = "14px Arial";
              rs.ctx.fillText(rs['ranges'][i]['value'], rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width+5, 25);
            } else {
              var icon = new Image();
              icon.src = rs['ranges'][i]['value_icon'];
              // //console.log(offset)
              var offset = rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width;
              // //console.log(rs['ranges'][i])
              if (rs['ranges'][i]['value_icon']){
                icon.onload = (async function(offset, c_icon){
                  while (!icon.complete) {
                    await delay(50);
                  }
                  // //console.log(c_icon.complete, offset);
                  rs.ctx.drawImage(c_icon, offset+5, 10, 20, 20);
                })(offset, icon);
              } else {
                // //console.log("it's undefined");
              }

            }

            // rs.ctx.fillStyle = "rgb(220,220,220)";
            // rs.ctx.fillRect(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, 7, rs['canvas'].width, 25);

            // cursor
            rs.ctx.beginPath();
            rs.ctx.moveTo(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, pad - 16);
            rs.ctx.lineTo(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, pad + 16);
            rs.ctx.strokeStyle = (active == rs['ranges'][i]['id'] ? "rgb(199, 131, 28)" : "rgb(36, 118, 201)");
        
            rs.ctx.lineWidth = 2;
            rs.ctx.stroke();
            rs.ctx.closePath();

            rs.ctx.beginPath();
            rs.ctx.moveTo(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, pad - 16);
            rs.ctx.lineTo(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, pad + 16);
            // rs.ctx.strokeStyle = "rgb(36, 118, 201)";
            rs.ctx.lineWidth = 2;
            rs.ctx.stroke();
            rs.ctx.closePath();

            rs.ctx.restore();
          }


          //Active param
          if (activeParam == rs.canvas.id){
            // //console.log("ARRRIVA");
            colorActive(rs, rs.canvas.id);
          } else {
            // //console.log("no");
            uncolorActive(rs, rs.canvas.id);
          }
        };
        ranges[canvas_id]['mousemove'] = function(e) {
          var rs = ranges[canvas_id];
          var ch = rs.ch;
          var c = rs.canvas;

          rs.draw();
          // <-- change of cursor to "resize" near borders of the segment:
          for (var i=0; i < rs['ranges'].length; i++) {
            //RangeEnd
            var distance = rs.getDistance(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);

            if (distance <= 5) {
              rs.canvas.style.cursor = "ew-resize";
            }

            //RangeStart
            var distance = rs.getDistance(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);

            if (distance <= 5) {
              rs.canvas.style.cursor = "ew-resize";
            }
          }
          // -->

          e.stopPropagation();
          e.preventDefault();


          rs.mouseX = e.layerX;
          rs.mouseY = e.layerY;
          // var ex = e.clientX - rs['canvas'].getBoundingClientRect().left;
          // var ey = e.clientY - rs['canvas'].getBoundingClientRect().top;
          // rs.mouseX = (e.targetTouches) ? e.targetTouches[0].layerX - c.offsetLeft : e.layerX - c.offsetLeft;
          // rs.mouseY = (e.targetTouches) ? e.targetTouches[0].layerY - c.offsetTop : e.layerY - c.offsetTop;
          rs.mouseX = Math.round(e.clientX - rs['canvas'].getBoundingClientRect().left);
          rs.mouseY = Math.round(e.clientY - rs['canvas'].getBoundingClientRect().top);
          // //console.log(rs.mouseX);
          // //console.log(rs.mouseY);
          // //console.log(e.target.id);
          // //console.log(e.targetTouches);
          // //console.log(e.targetTouches[0].layerX);
          // //console.log(e.layerX);

          if (rs.draggable) {
            //update progress bar
            var pos = e.layerX/rs['canvas'].getBoundingClientRect().width;
            video.currentTime = pos * video.duration;
            for (var i=0; i < rs['ranges'].length; i++){
              if (active === rs['ranges'][i]['id']){
                //RangeEnd
                
                
                var distance = rs.getDistance(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);
                
                // //console.log("this is ch, padding, click and distance")
                // //console.log(distance);
                // // //console.log(rs.padding);
                // //console.log(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width);
                // //console.log(rs.getDistance(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding));
                //if distance< r1+r2 boom !
                

                if (distance <= 10) {
                  
                  // rs['ranges'].classList.add("test");
                  
                  //console.log(rs['ranges']);
                  // active = rs['ranges'][i]['id'];

                  rs.update(rs.mouseX, false, i);
                  //console.log("This is end cursor move");
                  return;
                }

                //RangeStart
                var distance = rs.getDistance(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);
                //if distance< r1+r2 boom !
                //console.log(distance);
                if (distance <= 10) {
                  // active = rs['ranges'][i]['id'];

                  rs.update(rs.mouseX, true, i);
                  //console.log("This is start cursor move");
                  return;
                }

              }


            }

          }

        };
        ranges[canvas_id]['getDistance'] = function(px, py) {

          var rs = ranges[canvas_id];
          // //console.log(canvas_id);
          //get the distance
          var xs = 0;
          var ys = 0;

          xs = px - rs.mouseX;
          // xs = xs * xs;
          //
          // ys = py - rs.mouseY;
          // ys = ys * ys;
          return Math.sqrt(xs * xs);
          // return Math.sqrt(xs + ys);
        };
        ranges[canvas_id]['clearCanvas'] = function() {

          var rs = ranges[canvas_id];

          // Store the current transformation matrix
          rs.ctx.save();

          // Use the identity matrix while clearing the canvas
          rs.ctx.setTransform(1, 0, 0, 1, 0, 0);
          rs.ctx.clearRect(0, 0, this.cw, this.ch);

          // Restore the transform
          rs.ctx.restore();

        };

        //detect touch and then automatically assign events
        var isTouchSupported = 'ontouchstart' in window;
        var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
        var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
        var endEvent = isTouchSupported ? 'touchend' : 'mouseup';

        var lastDownTarget, canvas;
        var startpoint, startpoint_per, endpoint_per;
        document.addEventListener('mousedown', function(event) {
            lastDownTarget = event.target;

            activeParam = lastDownTarget.id;
            if (getActiveRange() != null){
              activateHandshapeButton();
            } else {
              disableHandshapeButton();
            }

            var curr_range = getActiveRange();



            if (lastDownTarget.tagName === "CANVAS") {
              if (curr_range != null) {
                _slan_util_msg_show(segmentSelected);
        
              }

              for (var i=0; i < rs['ranges'].length; i++){
                //RangeStart
                
                if (event.layerX > rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width
                && event.layerX < rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width) {

                  // //console.log(event.layerX);
                  // //console.log(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width);
                  // //console.log(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width);


                  document.getElementById('additionalVisualization').style.display = 'none';
                  // document.getElementById('keyboard').style.display = 'block';
                  document.getElementById('automaticAnnotation').style.display = 'none';

                  //console.log(curr_range['type'])
                  if (curr_range['type'] == "text") {
                    document.getElementById('keyboard').style.display = 'block';
                    document.getElementById('textValueDiv').style.display = 'block';
                    document.getElementById('handshapeValueDiv').style.display = 'none';
                    document.getElementById('textValue').autofocus = true;
                    document.getElementById('textValue').value = curr_range['value'];

                  } else if (curr_range['type'] == "handshape") {
                    handshapeValueSave.innerHTML = "Save";
                    document.getElementById('keyboard').style.display = 'block';
                    document.getElementById('textValueDiv').style.display = 'none';
                    document.getElementById('handshapeValueDiv').style.display = 'block';
                    document.getElementById('keyboard2').style.display = 'none';
                    document.getElementById('keyboard3').style.display = 'none';

                    var curr_value = document.getElementById('hand-value');
                    curr_value.src = curr_range['value'].includes("http") ? curr_range['value'] : '/media/select.png';

                  } else if (curr_range['type'] == "extended-finger") {
// *********** the changes are related to sth here::: ASK ARMAN :D
                    extFingerValueSave.innerHTML = "Save";
                    document.getElementById('keyboard2').style.display = 'block';
                    document.getElementById('textValueDiv').style.display = 'none';
                    document.getElementById('handshapeValueDiv').style.display = 'none';
                    document.getElementById('keyboard').style.display = 'none';
                    
                    document.getElementById('keyboard3').style.display = 'none';

                    
                    var curr_value = document.getElementById('extended-finger-value');
                    curr_value.src = curr_range['value'].includes("http") ? curr_range['value'] : '/media/extended_finger/select-ef.png';

                  } else {
                    palmValueSave.innerHTML = "Save";
                    document.getElementById('keyboard3').style.display = 'block';
                    document.getElementById('textValueDiv').style.display = 'none';
                    document.getElementById('handshapeValueDiv').style.display = 'none';
                    document.getElementById('keyboard').style.display = 'none';
                    document.getElementById('keyboard2').style.display = 'none';
                    

                    
                    var curr_value = document.getElementById('palm-value');
                    curr_value.src = curr_range['value'].includes("http") ? curr_range['value'] : '/media/palms_labeled/select.png';
                    
                  }
                }
              }
            }

            rs.draw();


        }, false);

        function getNumberArray(arr){
              var newArr = new Array();
              for(var i = 0; i < arr.length; i++){
                  if(typeof arr[i] == "number"){
                      newArr[newArr.length] = arr[i];
                  }
              }
              return newArr;
        }
        var keys = [];
        document.addEventListener('keydown', function(event) {
          keys[event.keyCode] = event.keyCode;
          var keysArray = getNumberArray(keys);
          //console.log("Keys currently pressed:" + keysArray);
            //_slan_util_msg_show('Segment selected. Use  <span class="key">l</span>  to expand the segment to the right');
            if(lastDownTarget ==rs['canvas']) {
              //_slan_util_msg_show("HERER");
              // if (event.key === "a") {
              //   //console.log("a pressed");
              //   var id = makeid(6);
              //   rs['ranges'].push({'range_pix' : [startpoint, startpoint+50], 'range': [startpoint_per, endpoint_per], "type": "null", "value": "", "id": id});
              //   active = id;
              //   var modal = document.getElementById("optionsModal");
              //   // modal.modal('show')
              //   $('#optionsModal').modal('show');
              //   rs.draw();
              //   // code for enter
              // } else
              if (keysArray.toString() === '46' || keysArray.toString() === '8' ){
                for (var key in ranges) {
                  for (var i = 0; i < ranges[key]['ranges'].length; i++){
                    if (ranges[key]['ranges'][i]['id'] == active){
                      ranges[key]['ranges'].splice(i, 1);
                      // tipCanvas.setAttribute("style", "position:absolute; margin-left: -1000px");
                      rs.draw();
                    }
                  }
                }
              } else if (event.key === "]") {
                //console.log("] pressed");
                //console.log(ranges);
                // code for enter
              } else if (event.key === " ") {
                if (event.target.tagName.toUpperCase() !== 'INPUT'){
                  event.preventDefault();
                  if (video.paused){

                    var curr_range = getActiveRange();
                    if (active != ""){
                      video.currentTime = curr_range['range'][0]*video.duration;
                    }
                    video.play();

                  } else {
                    video.pause();
                  }
                }

                // code for enter
              } else if (keysArray.toString() === '76' && !$('#textValue').is(':focus')){
                var curr_range = getActiveRange();
                //console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][1] = (curr_range['range'][1]*video.duration + 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '16,76' && !$('#textValue').is(':focus')){
                var curr_range = getActiveRange();
                //console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][1] = (curr_range['range'][1]*video.duration - 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '75' && !$('#textValue').is(':focus')){
                var curr_range = getActiveRange();
                //console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][0] = (curr_range['range'][0]*video.duration - 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '16,75' && !$('#textValue').is(':focus')){
                var curr_range = getActiveRange();
                //console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][0] = (curr_range['range'][0]*video.duration + 0.08)/video.duration;
                rs.draw();
              }
            }
        }, false);

        document.addEventListener('keyup', function(e){
                keys[e.keyCode] = false;
                // //console.log("Keys currently pressed: " + getNumberArray(keys));
            }, false);

        video.addEventListener('play', function(){
          if (active != ""){
            var curr_range = getActiveRange();
            video.currentTime = curr_range['range'][0]*video.duration;
          }
        }, false);



        video.addEventListener('timeupdate', function(event){
          if (active != ""){
            var curr_range = getActiveRange();
            // video.currentTime = curr_range['range'][0]*video.duration;
            if (video.currentTime >= curr_range['range'][1]*video.duration) {
              if (loop.value == "loop"){
                video.currentTime = curr_range['range'][0]*video.duration;
                video.play();
              }
            }
          }
        });

        
        
        //add the canvas listeners and functions
        rs.canvas.addEventListener("dblclick", function (){
          var curr_range = getActiveRange();
          if (curr_range == null){
            //console.log('event.target');
            var pad = event.target.getBoundingClientRect().top + 10;
            //console.log(pad);
            // //console.log(event.target.top);
            // //console.log(event.clientY);
            // //console.log(event.target);

            startpoint = event.layerX;
            startpoint_per = event.layerX/rs['canvas'].getBoundingClientRect().width;
            endpoint_per = (event.layerX+50)/rs['canvas'].getBoundingClientRect().width;
            var id = makeid(6);
            rs['ranges'].push({'range_pix' : [startpoint, startpoint+50], 'range': [startpoint_per, endpoint_per], "type": rs['tier_type'], "value": "", "id": id});
            active = id;
            // $('#optionsModal').modal('show');
            rs.draw();

        

            if (rs['tier_type'] == "text") {
              document.getElementById('textValueDiv').style.display = 'block';
              document.getElementById('additionalVisualization').style.display = 'none';
              document.getElementById('keyboard').style.display = 'block';
              document.getElementById('keyboard2').style.display = 'none';
              document.getElementById('keyboard3').style.display = 'none';
              document.getElementById('handshapeValueDiv').style.display = 'none';
              document.getElementById('textValue').focus();


            } else if (rs['tier_type'] == "handshape") {
              document.getElementById('additionalVisualization').style.display = 'none';
              document.getElementById('keyboard').style.display = 'block';
              document.getElementById('keyboard2').style.display = 'none';
              document.getElementById('keyboard3').style.display = 'none';
              document.getElementById('automaticAnnotation').style.display = 'none';

              document.getElementById('textValueDiv').style.display = 'none';
              document.getElementById('handshapeValueDiv').style.display = 'block'; 

              handshapeValueSave.innerHTML = "Save";
              document.getElementById('hand-value').src = '/media/select.png';

            } else if (rs['tier_type'] == "extended-finger") {
              document.getElementById('additionalVisualization').style.display = 'none';
              document.getElementById('keyboard').style.display = 'none';
              document.getElementById('keyboard2').style.display = 'block';
              document.getElementById('keyboard3').style.display = 'none';
              document.getElementById('automaticAnnotation').style.display = 'none';

              document.getElementById('textValueDiv').style.display = 'none';
              document.getElementById('handshapeValueDiv').style.display = 'none';

              extFingerValueSave.innerHTML = "Save";
              document.getElementById('extended-finger-value').src = '/media/extended_finger/select-ef.png';

            } else {
              document.getElementById('additionalVisualization').style.display = 'none';
              document.getElementById('keyboard').style.display = 'none';
              document.getElementById('keyboard2').style.display = 'none';
              document.getElementById('keyboard3').style.display = 'block';
              document.getElementById('automaticAnnotation').style.display = 'none';

              document.getElementById('textValueDiv').style.display = 'none';
              document.getElementById('handshapeValueDiv').style.display = 'none';
              // document.getElementById('palmValueDiv').style.display = 'block';

              palmValueSave.innerHTML = "Save";
              document.getElementById('palm-value').src = '/media/palms_labeled/select.png';
              
            }
          }

        


        });



        rs.canvas.addEventListener(startEvent, function mousedown(e) {
            rs.draggable = true;

        
            // rs.canvas.classList.add("test"); // <- no need

            active = "";
            document.getElementById('additionalVisualization').style.display = 'block';
            document.getElementById('keyboard').style.display = 'none';
            document.getElementById('keyboard2').style.display = 'none'; // added 07/09
            document.getElementById('keyboard3').style.display = 'none'; // added 
            document.getElementById('automaticAnnotation').style.display = 'none';

            for (var i=0; i < rs['ranges'].length; i++){
              //RangeStart
              if (event.layerX > rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width && event.layerX < rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width) {
                active = rs['ranges'][i]['id'];
              }
              
            }

            // if (active != ""){
            //   var curr_range = getActiveRange();
            //   video.currentTime = curr_range['range'][0] * video.duration;
            //   //console.log("active range");
            // } else {
            //console.log("not active");
            var pos = event.layerX/rs['canvas'].getBoundingClientRect().width;
            video.currentTime = pos * video.duration;
            // }

            rs.draw();
            


        }, false);
        rs.canvas.addEventListener(endEvent, function mouseup(e) {
            rs.draggable = false;
        }, false);
        rs.canvas.addEventListener(moveEvent, rs.mousemove.bind(this), false);
        
        rs.draw();
    },

}

function addRowFunction(tier_type, handedness, passed_id = null) { //add row name
  if (handedness == null) {
    var row_name = "New row";//document.getElementById('text_row_name');
  } else {
    var row_name = handedness;// document.getElementById('handshapes_row_name');
  }

  if (passed_id == null) {
    var row_id = makeid(4);
    if (tier_type == "text") {
      row_id += "T";
    } else if (tier_type == "handshape") {
      row_id += "H";
    } else if (tier_type == "extended-finger") {
      row_id += "E";
    } else if (tier_type == "palm") {
      row_id += "P";
    } 
  } else {
    var row_id = passed_id;
  }
  //console.log(row_name);
  // var tierType = document.getElementById('tierType');
  // var tier_type = tierType.value;
  // //console.log(tier_type);
  if (tier_type === null || tier_type === ""){
    alert("Choose tier type!");
    return false;
  }
  // if (row_name.value === ""){
  //   alert("Name the tier");
  //   return false;
  // }
  if (row_name in ranges){
    alert("Already in use!");
    return false;
  }
  // var newRowName = row_name.value;
  var rowNameDiv = document.createElement("div");
  rowNameDiv.setAttribute("style", "padding: 8px; padding-left:16px; height: 40px; z-index: 0; ");
  rowNameDiv.setAttribute("id", row_id + "_rowname");
  // rowNameDiv.setAttribute("height", '40px');
  var rowName = document.createElement("a");
  rowName.innerHTML = row_name;
  rowName.setAttribute("contentEditable", true);
  rowName.setAttribute("style", "border: none !important;");
  rowName.addEventListener("keydown", function(e) {
    // Enter pressed
    if (e.keyCode == 13) {
        //method to prevent from default behaviour
        e.preventDefault();
    }
  });
  rowName.addEventListener("input", function(event) {
    //console.log("sving the chsnge", rowName.innerHTML);
    ranges[row_id]['tier_name'] = rowName.innerHTML;
  });
  

  var rowDeleteIcon = document.createElement("i");

  rowDeleteIcon.setAttribute("class", "bi bi-x deleteRow");
  rowDeleteIcon.addEventListener('click', function(){
    if (confirm('Are you sure you want to remove row ' + row_id + "?" )) {
      delete ranges[row_id];
      //console.log(ranges);
      var curcanvas = document.getElementById(row_id);
      document.getElementById('metadata_timeline').removeChild(curcanvas);
      var curname = document.getElementById(row_id + "_rowname");
      //console.log(curname);
      metadata_name.removeChild(curname);
      var additionalName = document.getElementById("addValueName" + row_id);
      var additionalValue = document.getElementById("addValue" + row_id);
      var addDiv = document.getElementById('additionalVisualizationRow');
      addDiv.removeChild(additionalName);
      addDiv.removeChild(additionalValue);

    } else {
      // Do nothing!
      //console.log('Cancelled');
    }

  }, false);

  rowNameDiv.appendChild(rowName);
  rowNameDiv.appendChild(rowDeleteIcon);
  var metadata_name = document.getElementById('metadata_name');
  if (tier_type === "text") {
    var beforeNode = document.getElementById('handshapes_rows');
    metadata_name.insertBefore(rowNameDiv, beforeNode);

  } else if (tier_type === "handshape") {
    var beforeNode = document.getElementById('extended_finger_rows');
    metadata_name.insertBefore(rowNameDiv, beforeNode);

  } else if (tier_type === "extended-finger") {
    var beforeNode = document.getElementById('palm_rows');
    metadata_name.insertBefore(rowNameDiv, beforeNode);

  } else {
    metadata_name.appendChild(rowNameDiv, beforeNode);
  }


  var currcanvas = document.createElement("canvas");
  currcanvas.setAttribute("id", row_id);
  currcanvas.setAttribute("padding-top", "-10px");
  currcanvas.setAttribute("z-index", "0");
  currcanvas.setAttribute("position", "absolute");
  // row_name.value = "";
  if (tier_type === "text") {
    var beforeNode = document.getElementById('handshape_label_canvas');
    document.getElementById('metadata_timeline').insertBefore(currcanvas, beforeNode);

  } else if (tier_type === "handshape") {
    var beforeNode = document.getElementById('extended_finger_label_canvas');
    document.getElementById('metadata_timeline').insertBefore(currcanvas, beforeNode);

  } else if (tier_type === "extended-finger") {
    var beforeNode = document.getElementById('palm_label_canvas');
    document.getElementById('metadata_timeline').insertBefore(currcanvas, beforeNode);
    
  } else {
    document.getElementById('metadata_timeline').appendChild(currcanvas);
  }



  customRangeSlider.init(10, rowName.innerHTML, tier_type, row_id);


  //additionalVisualization
  // var addColName = document.createElement("div");
  // addColName.setAttribute("class", "col-6");
  // addColName.setAttribute("id", "addValueName" + rowName.innerHTML);
  // addColName.setAttribute("style", "height:80px;");
  // var addColValue = document.createElement("div");
  // addColValue.setAttribute("class", "col-6");
  // addColValue.setAttribute("id", "addValue" + rowName.innerHTML);
  // var addName = document.createElement("a");
  // addName.innerHTML = rowName.innerHTML;
  // addColName.append(addName);
  //
  // var addDiv = document.getElementById('additionalVisualizationRow');
  // addDiv.append(addColName);
  // addDiv.append(addColValue);
}


document.getElementById('addTextRow').addEventListener('click', function(){

  addRowFunction("text", "New row");

}, false);

document.getElementById('addHandshapeRow').addEventListener('click', function(){

  addRowFunction("handshape", "New row");
  // addRowFunction("handshape", "Left");

  document.getElementById('additionalVisualization').style.display = 'none';
  document.getElementById('keyboard').style.display = 'block';
  document.getElementById('keyboard2').style.display = 'none';
  document.getElementById('keyboard3').style.display = 'none';
  document.getElementById('automaticAnnotation').style.display = 'none';

  document.getElementById('textValueDiv').style.display = 'none';
  document.getElementById('handshapeValueDiv').style.display = 'block';

}, false);

document.getElementById('add-extended-finger-row').addEventListener('click', function() {
  addRowFunction("extended-finger", "New row");
  // addRowFunction("extended-finger", "Left");

  document.getElementById('additionalVisualization').style.display = 'none';
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('keyboard2').style.display = 'block';
  document.getElementById('keyboard3').style.display = 'none';
  document.getElementById('automaticAnnotation').style.display = 'none';

  document.getElementById('textValueDiv').style.display = 'none';
  document.getElementById('handshapeValueDiv').style.display = 'none';
}, false);

document.getElementById('add-palm-row').addEventListener('click', function() {
  addRowFunction("palm", "New row");
  // addRowFunction("palm", "Left");

  document.getElementById('additionalVisualization').style.display = 'none';
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('keyboard2').style.display = 'none';
  document.getElementById('keyboard3').style.display = 'block';
  document.getElementById('automaticAnnotation').style.display = 'none';

  document.getElementById('textValueDiv').style.display = 'none';
  document.getElementById('handshapeValueDiv').style.display = 'none';
}, false);



function changeValue(){
  var value = document.getElementById('hand-value');
  value.src = this.src;
  value.title = this.title;
}

var keys = document.querySelectorAll('.hand-keyboard');
keys.forEach(item => {
  item.addEventListener('click', changeValue, false);
});

// *************

function changeValue2(){
  var value = document.getElementById('extended-finger-value');
  value.src = this.src;
  value.title = this.title;
}

var keys2 = document.querySelectorAll('.extended-finger-key');
keys2.forEach(item => {
  item.addEventListener('click', changeValue2, false);
});

// ***************

function changeValue3(){
  var value = document.getElementById('palm-value');
  value.src = this.src;
  value.title = this.title;
}

var keys3 = document.querySelectorAll('.palm-key');
keys3.forEach(item => {
  item.addEventListener('click', changeValue3, false);
});

// *******************

video.addEventListener('timeupdate', function(event){
  var videopos = video.currentTime/video.duration;
  for ( var key in ranges) {
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      if (ranges[key]['ranges'][i]['range'][0] < videopos && ranges[key]['ranges'][i]['range'][1] > videopos){
        // ranges[key]['ranges'][i]['value'] = value;
        // //console.log('addValue' + key);
        var curr_range = document.getElementById('addValue' + key);
        if (ranges[key]['ranges'][i]['type'] === "text"){
          curr_range.innerHTML = ranges[key]['ranges'][i]['value'];
          ranges[key]['ranges'][i].style.cursor = 'ew-resize';
        } else {
          //console.log("clear curr range");
          curr_range.innerHTML = "";
          var imgdiv = document.createElement('img');
          imgdiv.src = ranges[key]['ranges'][i]['value'];
          imgdiv.id = "hand-value";
          curr_range.append(imgdiv);
        }
        break;
      } else {
        var curr_range = document.getElementById('addValue' + key);
        curr_range.innerHTML = "";
      }
    }
  }

});

function getFormattedVideoTime(seconds) {
  // seconds = getVideoDuration(seconds);
  // var seconds = video.currentTime;
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = seconds % 60;
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  var toCheck = seconds+"";
  seconds = seconds + "";
  // if (toCheck.length > 5){
  return minutes + ":" + seconds.substring(0,7);
  // } else {
  //   return minutes + ":" + seconds;
  // }

}


function drawTotalProgressBar() {
  var cutpadding = 0;
  tpb.width = timeline_metadata.getBoundingClientRect().width-10;
  tpb.height = 20;
  //console.log("HOLA!");
  // pointer.setAttribute("style", "width: " + tpb.getBoundingClientRect().width + "px; height: 20px;");
  pointer.width = tpb.getBoundingClientRect().width;
  pointer.height = 25;
  pointerctx.beginPath();
  pointerctx.moveTo(0, 18);
  pointerctx.lineTo(5, 25);
  pointerctx.lineTo(10, 18);
  pointerctx.fillStyle = "rgb(42,148,255)";
  pointerctx.fill();

  tpbctx.moveTo(0,0);
  tpbctx.lineTo(tpb.getBoundingClientRect().width, 0);
  tpbctx.closePath();
  tpbctx.strokeStyle = "rgb(200,200,200)";
  tpbctx.lineWidth = 2;
  tpbctx.stroke();
  cutpadding = 0;

  tpb.addEventListener("mousedown", function(event){
    //console.log(event.layerX);
    var curr_range = getActiveRange();
    var currtime = parseFloat(((event.layerX/tpb.getBoundingClientRect().width)*video.duration + "0").substring(0, 8));
    video.currentTime = currtime;
    //console.log(currtime);
  });

  do {
    tpbctx.moveTo(cutpadding,0);
    tpbctx.lineTo(cutpadding, 5);
    tpbctx.strokeStyle = "rgb(200,200,200)";
    tpbctx.lineWidth = 2;
    tpbctx.stroke();
    var cutperc = cutpadding/tpb.getBoundingClientRect().width;
    // //console.log(video.duration);
    var cuttime = cutperc*video.duration;
    // if (isInt(video.duration)){
    //   cuttime = cutperc*video.duration/60;
    //   //console.log(video.duration/60);
    // } else {
    //   cuttime = cutperc*video.duration;
    //   //console.log(video.duration);
    // }
    // //console.log(cuttime);
    // //console.log(tpb.getBoundingClientRect().width);
    tpbctx.font = "11px Arial";
    tpbctx.fillText(getFormattedVideoTime(cuttime), cutpadding + 5, 15);
    cutpadding += 100;

  } while (tpb.getBoundingClientRect().width-200 > cutpadding);

  tpbctx.moveTo(tpb.getBoundingClientRect().width-11, 0);
  tpbctx.lineTo(tpb.getBoundingClientRect().width-11, 5);
  tpbctx.lineWidth = 1;
  tpbctx.stroke();
  tpbctx.fillText(getFormattedVideoTime(video.duration), tpb.getBoundingClientRect().width - 75, 15);

}

// drawTotalProgressBar();

function drawSubprogressBar(){
  var subpointerctx = subpointer.getContext('2d');
  subpointerctx.save();
  subpointerctx.setTransform(1, 0, 0, 1, 0, 0);
  subpointerctx.clearRect(0, 0, subpointer.width, subpointer.height);
  subpointerctx.restore();
  subpointerctx.beginPath();
  subpointerctx.moveTo(0, 8);
  subpointerctx.lineTo(5, 15);
  subpointerctx.lineTo(10, 8);
  subpointerctx.fillStyle = "rgb(42,148,255)";
  subpointerctx.fill();
  var spbctx = spb.getContext('2d');
  spbctx.moveTo(0,0);
  spbctx.lineTo(spb.getBoundingClientRect().width, 0);
  spbctx.closePath();
  spbctx.strokeStyle = "rgb(200,200,200)";
  spbctx.lineWidth = 2;
  spbctx.stroke();
  metadata_pointer.width = $('#metadata_timeline').width();
  metadata_pointer.height = $('#metadata_timeline').height();
  metadata_pointer_ctx.beginPath();
  metadata_pointer_ctx.moveTo(0, 0);
  metadata_pointer_ctx.lineTo(0, $('#metadata_timeline').height());
  metadata_pointer_ctx.strokeStyle = "rgb(42,148,255)";
  metadata_pointer_ctx.lineWidth = 1;
  metadata_pointer_ctx.stroke();
}

function drawSubprogressPointer(){
  spb.width = $('#metadata_timeline').width()-10;
  spb.height = 10;
  // pointer.setAttribute("style", "width: " + tpb.getBoundingClientRect().width + "px; height: 20px;");
  subpointer.width = spb.getBoundingClientRect().width;
  subpointer.height = 15 //15
  //triangle
  // subpointerctx.beginPath();
  // subpointerctx.moveTo(0, 8);
  // subpointerctx.lineTo(5, 15);
  // subpointerctx.lineTo(10, 8);
  // subpointerctx.fillStyle = "rgb(42,148,255)";
  // subpointerctx.fill();
  //line
  subpointerctx.beginPath();
  subpointerctx.moveTo(0, 8);
  subpointerctx.lineTo(5, 15);
  subpointerctx.lineTo(10, 8);
  subpointerctx.fillStyle = "rgb(42,148,255)";
  subpointerctx.fill();

  spbctx.moveTo(0,0);
  spbctx.lineTo(spb.getBoundingClientRect().width, 0);
  spbctx.closePath();
  spbctx.strokeStyle = "rgb(200,200,200)";
  spbctx.lineWidth = 2;
  spbctx.stroke();

  metadata_pointer.width = $('#metadata_timeline').width();
  metadata_pointer.height = $('#metadata_timeline').height();
  metadata_pointer_ctx.beginPath();
  metadata_pointer_ctx.moveTo(0, 0);
  metadata_pointer_ctx.lineTo(0, $('#metadata_timeline').height());
  metadata_pointer_ctx.strokeStyle = "rgb(42,148,255)";
  metadata_pointer_ctx.lineWidth = 1;
  metadata_pointer_ctx.stroke();

  spb.addEventListener("mousedown", function(event){
    //console.log(event.layerX);
    var curr_range = getActiveRange();
    var currtime = parseFloat(((event.layerX/spb.getBoundingClientRect().width)*video.duration + "0").substring(0, 8));
    video.currentTime = currtime;
    //console.log(currtime);
  });
}
drawSubprogressPointer();

video.addEventListener('timeupdate', function(event){
  // //console.log(video.duration);
  var curr_percent = video.currentTime/video.duration;
  var pointer_padding = curr_percent*(pointer.width-10);
  // Store the current transformation matrix
  pointerctx.save();

  // Use the identity matrix while clearing the canvas
  pointerctx.setTransform(1, 0, 0, 1, 0, 0);
  pointerctx.clearRect(0, 0, pointer.width, pointer.height);

  // Restore the transform
  pointerctx.restore();
  pointerctx.beginPath();
  pointerctx.moveTo(pointer_padding, 18);
  pointerctx.lineTo(pointer_padding+5, 25);
  pointerctx.lineTo(pointer_padding+10, 18);
  pointerctx.fill();
  // pointerctx.moveTo(pointer_padding + 20, 10);

  pointerctx.font = "14px Arial";
  if (curr_percent > 0.84){
    pointerctx.fillText(getFormattedVideoTime(video.currentTime), pointer_padding - 90, 21);

  } else {
    pointerctx.fillText(getFormattedVideoTime(video.currentTime), pointer_padding + 15, 21);
  }

  var subpointer_padding = curr_percent*(subpointer.width-10);
  subpointerctx.save();
  subpointerctx.setTransform(1, 0, 0, 1, 0, 0);
  subpointerctx.clearRect(0, 0, subpointer.width, subpointer.height);
  subpointerctx.restore();
  subpointerctx.beginPath();
  subpointerctx.moveTo(subpointer_padding, 8);
  subpointerctx.lineTo(subpointer_padding+5, 15);
  subpointerctx.lineTo(subpointer_padding+10, 8);
  subpointerctx.fill();

  metadata_pointer.width = $('#metadata_timeline').width();
  metadata_pointer.height = $('#metadata_timeline').height();
  metadata_pointer_ctx.beginPath();
  metadata_pointer_ctx.moveTo(subpointer_padding+5, 0);
  metadata_pointer_ctx.lineTo(subpointer_padding+5, $('#metadata_timeline').height());
  metadata_pointer_ctx.strokeStyle = "rgb(42,148,255)";
  metadata_pointer_ctx.lineWidth = 1;
  metadata_pointer_ctx.stroke();

  var totalTimer = document.getElementById('total_timer');
  totalTimer.innerHTML = getFormattedVideoTime(video.currentTime);
});

timeline.onscroll = function() {
  var progress_overflow = document.getElementById('progress_overflow');
  //console.log(progress_overflow.scrollLeft);
  progress_overflow.scrollLeft = timeline.scrollLeft;
  // subpointer.scrollLeft = timeline.scrollLeft;
}

spb.addEventListener("wheel", function(e){
  zoomCanvas(e.wheelDeltaX, "wheel");
}, false);

subpointer.addEventListener("wheel", function(e){
  zoomCanvas(e.wheelDeltaX, "wheel");
}, false);

zoomIn.addEventListener('click', function(){
  zoomCanvas(-40, "not")
}, false);
zoomOut.addEventListener('click', function(){
  zoomCanvas(40, "not")
}, false);

var dura = document.getElementById('metaduration');
var fps = document.getElementById('metafps');
var reso = document.getElementById('metareso');

dura.innerHTML = getFormattedVideoTime(video.duration);
fps.innerHTML = '25';
reso.innerHTML = video.videoHeight + " x " + video.videoWidth;

    

function buildControls(){
  // Does the browser actually support the video element?
  var supportsVideo = !!document.createElement('video').canPlayType;

  //console.log("101")

  if (supportsVideo) {
    // Obtain handles to main elements
    // var videoContainer = document.getElementById('videoContainer');
    // // var video = document.getElementById('current_video');
    // var videoControls = document.getElementById('video-controls');
    //
    // // Hide the default controls
    // // video.controls = false;
    //
    // // Display the user defined video controls
    // videoControls.setAttribute('data-state', 'visible');
    //
    // // Obtain handles to buttons and other elements
    // var playpause = document.getElementById('playpause');
    // var loop = document.getElementById('loop');
    // var stop = document.getElementById('stop');
    // var mute = document.getElementById('mute');
    // var volinc = document.getElementById('volinc');
    // var voldec = document.getElementById('voldec');
    // var progress = document.getElementById('progress');
    // var progressBar = document.getElementById('progress-bar');
    // var fullscreen = document.getElementById('fs');
    // var quarterspeed = document.getElementById('025speed');
    // var halfspeed = document.getElementById('05speed');
    // var fullspeed = document.getElementById('1speed');

    checkSpeed();

    function checkSpeed(){
      var speed = video.playbackRate;
      //console.log(speed);
      if (speed == 0.25){
        quarterspeed.style.background = "rgb(200,200,200)";
        halfspeed.style.background = "white";
        fullspeed.style.background = "white";
      } else if (speed == 0.5) {
        halfspeed.style.background = "rgb(200,200,200)";
        quarterspeed.style.background = "white";
        fullspeed.style.background = "white";
      } else {
        fullspeed.style.background = "rgb(200,200,200)";
        halfspeed.style.background = "white";
        quarterspeed.style.background = "white";
      }
    }
    quarterspeed.addEventListener("click", function(){
      video.playbackRate = 0.25;
      checkSpeed();
    });
    halfspeed.addEventListener("click", function(){
      video.playbackRate = 0.5;
      checkSpeed();
    });
    fullspeed.addEventListener("click", function(){
      video.playbackRate = 1;
      checkSpeed();
    });
    // If the browser doesn't support the progress element, set its state for some different styling
    var supportsProgress = (document.createElement('progress').max !== undefined);
    if (!supportsProgress) progress.setAttribute('data-state', 'fake');

    // Check if the browser supports the Fullscreen API
    var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
    // If the browser doesn't support the Fulscreen API then hide the fullscreen button
    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }

    // Check the volume
    var checkVolume = function(dir) {
      if (dir) {
        var currentVolume = Math.floor(video.volume * 10) / 10;
        if (dir === '+') {
          if (currentVolume < 1) video.volume += 0.1;
        }
        else if (dir === '-') {
          if (currentVolume > 0) video.volume -= 0.1;
        }
        // If the volume has been turned off, also set it as muted
        // Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
        if (currentVolume <= 0) video.muted = true;
        else video.muted = false;
      }
      changeButtonState('mute');
    }

    // Change the volume
    var alterVolume = function(dir) {
      checkVolume(dir);
    }

    // Set the video container's fullscreen state
    var setFullscreenData = function(state) {
      videoContainer.setAttribute('data-fullscreen', !!state);
      // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
      fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
    }

    // Checks if the document is currently in fullscreen mode
    var isFullScreen = function() {
      return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }

    // Fullscreen
    var handleFullscreen = function() {
      // If fullscreen mode is active...
      if (isFullScreen()) {
          // ...exit fullscreen mode
          // (Note: this can only be called on document)
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
          setFullscreenData(false);
        }
        else {
          // ...otherwise enter fullscreen mode
          // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
          if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
          else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
          else if (videoContainer.webkitRequestFullScreen) {
            // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
            // ensures that our custom controls are visible:
            // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
            // figure[data-fullscreen=true] .controls { z-index:2147483647; }
            video.webkitRequestFullScreen();
          }
          else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
          setFullscreenData(true);
        }
      }

    // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
    if (document.addEventListener) {
      // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
      // video.addEventListener('loadedmetadata', function() {
      // 	progress.setAttribute('max', video.duration);
      // });

      // Changes the button state of certain button's so the correct visuals can be displayed with CSS
      var changeButtonState = function(type) {
        // Play/Pause button
        if (type == 'playpause') {
          if (video.paused || video.ended) { //
            playpause.setAttribute('data-state', 'play');
            playpause.innerHTML = "<i class='bi bi-play-fill'>";
          }
          else {
            playpause.setAttribute('data-state', 'pause');
            playpause.innerHTML = "<i class='bi bi-pause-fill'>";

          }
        }
        // Mute button
        else if (type == 'mute') {
          mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
        }
      }

      // Add event listeners for video specific events
      video.addEventListener('play', function() {
        changeButtonState('playpause');
      }, false);
      video.addEventListener('pause', function() {
        changeButtonState('playpause');
      }, false);
      video.addEventListener('volumechange', function() {
        checkVolume();
      }, false);

      // Add events for all buttons
      playpause.addEventListener('click', function(e) {
        var curr_action;
        if (video.paused || video.ended) {
          curr_action = "play";
        } else {
          curr_action = "pause";
        }
        if (curr_action === "play") {
          video.play();
        } else {
          // video.pause();
        }
      });

      // The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
      stop.addEventListener('click', function(e) {
        video.pause();
        video.currentTime = 0;
        progress.value = 0;
        // Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
        changeButtonState('playpause');
      });
      mute.addEventListener('click', function(e) {
        video.muted = !video.muted;
        changeButtonState('mute');
      });
      volinc.addEventListener('click', function(e) {
        alterVolume('+');
      });
      voldec.addEventListener('click', function(e) {
        alterVolume('-');
      });
      fs.addEventListener('click', function(e) {
        handleFullscreen();
      });

      // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
      document.addEventListener('fullscreenchange', function(e) {
        setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
      });
      document.addEventListener('webkitfullscreenchange', function() {
        setFullscreenData(!!document.webkitIsFullScreen);
      });
      document.addEventListener('mozfullscreenchange', function() {
        setFullscreenData(!!document.mozFullScreen);
      });
      document.addEventListener('msfullscreenchange', function() {
        setFullscreenData(!!document.msFullscreenElement);
      });
    }
   }
}


const trimVideoButton = document.getElementById('trimVideoButton');

trimVideoButton.addEventListener('click', async function(){
  this.innerHTML = "Running."
  await sleep(1000);
  this.innerHTML = "Running.."
  await sleep(1000);
  this.innerHTML = "Running..."
  await sleep(1000);
  this.innerHTML = "Running."
  await sleep(1000);
  this.innerHTML = "Running.."
  await sleep(1000);
  this.innerHTML = "Annotate selected range"

  var selectFrom = document.getElementById('select-from').value;
  var selectTo = document.getElementById('select-to').value;
  //console.log(selectFrom);
  //console.log(parseInt(selectTo));
  //console.log(video.duration);
  //console.log(parseInt(selectTo) > video.duraiton);
  //console.log(parseFloat(selectTo) > parseFloat(video.duraiton));
  var from = selectFrom/video.duration;
  //console.log(from);
  var to = selectTo/video.duration;
  //console.log(to);
  if (selectTo-selectFrom > 30) {
    alert("Range too big. Plese, select range no more than 30 seconds");
    return false;
  }

  if (parseInt(selectTo) > video.duraiton) {
    alert("Unacceptable value. Video duration is " + video.duration);
    return false;
  }
  if ("Left hand" in ranges){
    ranges['Left hand']['ranges'].push(
      {
        "range_pix": [
          from,
          to
        ],
        "range": [
            from,
            to
        ],
        "type": "handshapes",
        "value": "http://slan-tool.com/media/flathand15.png",
        "id": makeid(6)
    });

  } else {
    ranges['Left hand'] = {
    "canvas": {},
    "ctx": {},
    "totalDuration": 10,
    "startDuration": 7.5,
    "endDuration": 8.997641509433961,
    "currentPosition": 0,
    "draggable": false,
    "mouseX": 598,
    "mouseY": 38,
    "padding": 0,
    "ranges": [
        {
            "range_pix": [
              from,
              to
            ],
            "range": [
              from,
              to
            ],
            "type": "handshapes",
            "value": "http://slan-tool.com/media/flathand15.png",
            "id": makeid(6)
        }
    ],
    "cw": 848,
    "ch": 40,
    "width": 848,
    "currentProgress": 0.75
    };

    var rowNameDiv = document.createElement("div");
    rowNameDiv.setAttribute("id", "Left hand_rowname");
    rowNameDiv.setAttribute("style", "padding: 8px; height: 40px; z-index: 0;");
    var rowName = document.createElement("a");
    rowName.innerHTML = "Left hand";
    var rowDeleteIcon = document.createElement("i");

    rowDeleteIcon.setAttribute("class", "bi bi-x deleteRow");
    rowDeleteIcon.addEventListener('click', function(){
      if (confirm('Are you sure you want to remove row ' + "Left hand" + "?" )) {
        delete ranges["Left hand"];
        //console.log(ranges);
        var curcanvas = document.getElementById("Left hand");
        document.getElementById('metadata_timeline').removeChild(curcanvas);
        var curname = document.getElementById("Left hand" + "_rowname");
        //console.log(curname);
        metadata_name.removeChild(curname);
        var additionalName = document.getElementById("addValueName" + "Left hand");
        var additionalValue = document.getElementById("addValue" + "Left hand");
        var addDiv = document.getElementById('additionalVisualizationRow');
        addDiv.removeChild(additionalName);
        addDiv.removeChild(additionalValue);

      } else {
        // Do nothing!
        //console.log('Cancelled');
      }

    }, false);

    rowNameDiv.appendChild(rowName);
    rowNameDiv.appendChild(rowDeleteIcon);
    document.getElementById('metadata_name').appendChild(rowNameDiv);

    var currcanvas = document.createElement("canvas");
    currcanvas.setAttribute("id", "Left hand");
    currcanvas.setAttribute("padding-top", "-10px");
    currcanvas.setAttribute("z-index", "0");
    currcanvas.setAttribute("position", "absolute");
    document.getElementById('metadata_timeline').appendChild(currcanvas);
    customRangeSlider.init(10, "Left hand", "handshape", "Left hand");

    //additionalVisualization
    var addColName = document.createElement("div");
    addColName.setAttribute("class", "col-6");
    addColName.setAttribute("style", "height:80px;");
    var addColValue = document.createElement("div");
    addColValue.setAttribute("class", "col-6");
    addColValue.setAttribute("id", "addValueLeft hand");
    var addName = document.createElement("a");
    addName.innerHTML = "Left hand";
    addColName.append(addName);

    var addDiv = document.getElementById('additionalVisualizationRow');

    addDiv.append(document.createElement("hr"));
    addDiv.append(addColName);
    addDiv.append(addColValue);
  }
  $('#trimvideo').modal('toggle');
  alert("New range created!");
});

var sharedRange = JSON.parse(document.getElementById('ranges').textContent);
if (sharedRange !== ""){
  ranges = JSON.parse(sharedRange);
  //console.log("from back");
  //console.log(ranges);
  for (const range in ranges) {
    addRowFunction(ranges[range]['tier_type'], ranges[range]['tier_name'], range);
  }
}

// var savedStateRanges = JSON.parse(document.getElementById('ranges').textContent);
// if (savedStateRanges !== ""){
//   ranges = JSON.parse(savedStateRanges);
//   //console.log("from back");
//   //console.log(ranges);
//   for (const range in ranges) {
//     addRowFunction(ranges[range]['tier_type'], ranges[range]['tier_name'], range);
//   }
// }

function getTokenFromCookies() {
  const matches = document.cookie.match(/state_token=([^;]+)/);
  return matches ? matches[1] : null;
}

function saveState() {
  let token = getTokenFromCookies();
  if (!token) {
      token = makeid(20);
      document.cookie = `state_token=${token}; path=/`;

  }
  var form_data = new FormData();
  var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
  form_data.append('state_data', JSON.stringify(ranges));
  form_data.append('token', token);

  $.ajax({
      url: '/state/', // point to server-side URL
      dataType: 'json', // what to expect back from server
      cache: false,
      async: false,
      contentType: false,
      processData: false,
      data: form_data,
      type: 'post',
      success: function (response) { // display success
        //console.log("State saved:", response.token);
      },
  });
}

function loadState(token, callback) {
  $.ajax({
      url: '/state/', // point to server-side URL
      dataType: 'json', // what to expect back from server
      //data: {'data': form_data, 'csrfmiddlewaretoken': csrf_token},
      data: { 'token': token },
      type: 'get',
      success: function (response) { // display success
        if (response.state_data) {
          var curr_ranges = JSON.parse(response.state_data);

          //console.log("cuur ranges going to create");
          //console.log(curr_ranges);
          ranges = curr_ranges;
          for (const range in curr_ranges) {
            //console.log("probably loop", range);
            addRowFunction(curr_ranges[range]['tier_type'], curr_ranges[range]['tier_name'], range);
          }
          updateCanvas();
        } else {
            //console.error("Error loading state:", response.error);
        }
      },
  });

}

var stateLoaded = false;
const token = getTokenFromCookies();
if (token) {
  if (!stateLoaded){
    loadState(token, (stateData) => {
        // Process and apply the loaded state data to your application here
        //console.log("Loaded state data:", stateData);
    });
    stateLoaded = true;
  }
} else {
    //console.log("No state token found in cookies.");
}

let oldRanges = null;

function checkRangesAndUpdate() {
  //console.log("checking state ...");
  if (JSON.stringify(oldRanges) !== JSON.stringify(ranges)) {
      oldRanges = JSON.parse(JSON.stringify(ranges));
      saveState(JSON.stringify(ranges));
  }
}

// Call the checkRangesAndUpdate function every 5 seconds (5000 milliseconds)
setInterval(checkRangesAndUpdate, 5000);

}//end of init functions
//
//
video.addEventListener("loadedmetadata", function() {
  //console.log("new video loaded");
  initTimeline();
});

const returnDefaultAddVisual = document.getElementById("returnDefaultAddVisual");
returnDefaultAddVisual.addEventListener("click", function(){
  document.getElementById('additionalVisualization').style.display = 'block';
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('automaticAnnotation').style.display = 'none';
});


function isInt(n) {
  return n % 1 === 0;
}

function getVideoDuration(originalDuration){
  if (isInt(originalDuration)){
    return originalDuration/60;
  } else {
    return originalDuration;
  }
}

$(window).on('load', function() {
  $('#welcomingOne').modal('show');
});

