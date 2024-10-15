var video = document.getElementById('current_video');

var controls = import("/static/js/videoControls.js");
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


var loop = document.getElementById('loop');

drawTotalProgressBar();
drawSubprogressBar();

loop.addEventListener('click', function(){
  var video_source = document.getElementById('source-video');
  console.log(video_source.src);
  if (loop.value == "loop"){
    loop.value = "once";
    loop.setAttribute("style", "border:none; width:4%; background-color:rgb(200,200,200); margin-bottom:5px; border-radius: 3px;");
  } else {
    loop.value = "loop";
    loop.setAttribute("style", "border:none; width:4%; background-color:white; margin-bottom:5px; border-radius: 3px;");
  }
}, false);


// var socket = io('http://localhost:5000');
// var socket = io('http://surdobot.kz:5000');
// var socket = io('http://78.40.108.4:8000');
// socket.on('connect', function(){
//   socket.on('aaa', function(data){
//     console.log(data);
//   });
//   socket.on('client_message', function(data){
//     console.log(data);
//   });
//   // socket.on('disconnect', function(){});
// });


$(document).on("change", ".custom-file-input", function(evt) {
  document.body.innerHTML = originalDOM;
  var $source = $('#source-video');
  video_file = this.files[0];
  // const savefile = async () => {
  //   console.log(video_file);
  //   ffmpeg.FS('writeFile', video_file_name, video_file);
  // };

  // savefile();
  // const { name } = this.files[0];
  // video_file_name = name;
  console.log(video_file);
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
    console.log(data);
    ranges = data['value'];
    console.log(ranges);
});
  //beacuse on load metadata working
});

$(document).on("change", ".import-file", function(evt) {

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
});
  //beacuse on load metadata working
});


var saveProject = document.getElementById('saveProject');
saveProject.addEventListener('click', function(){
  console.log("start downloading");
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
    // console.log(key);
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
  console.log(prettifyXml(etfContent));
  exportTimeXML.href = "data:text/xml;charset=utf-8," + prettifyXml(etfContent);
  exportTimeXML.download = "project.xml";
});

var exportTimeJson = document.getElementById('exportTimeJson');
exportTimeJson.addEventListener("click", function(){
  var doc = document.implementation.createDocument("", "", null);
  var jsonString = "{'TIERS':[";
  // var annotation_document = doc.createElement("ANNOTATION_DOCUMENT");
  for ( var key in ranges) {
    var tierJsonString = "{'TIER' : {";
    // console.log(key);
    tierJsonString += "'TIER_ID': '" + key + "',";
    tierJsonString += "'ANNOTATIONS': [";

    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      var curr_range = ranges[key]['ranges'][i];

      tierJsonString += "{'ANNOTATION_ID': '" + curr_range['id'] + "',";
      tierJsonString += "'BEGIN_TIME': '" + Math.floor((curr_range['range'][0]*video.duration*1000)) + "',";
      tierJsonString += "'END_TIME': '" + Math.floor((curr_range['range'][1]*video.duration*1000)) + "',";
      tierJsonString += "'VALUE': '" + curr_range['value'] + "'},";

    }
    tierJsonString += "]}},";
    jsonString += tierJsonString;
  }

  jsonString += "]}";
  exportTimeJson.href = "data:text/json;charset=utf-8," + jsonString;
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
  console.log("frameCOunt");
  console.log(frameCount);
  var cranges = {};
  for ( var key in ranges) {
    cranges[key] = []
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      // console.log(curr_range);
      var curr_range = ranges[key]['ranges'][i];
      cranges[key].push({
        'id': curr_range['id'],
        'range0': curr_range['range'][0],
        'range1': curr_range['range'][1],
        'value': curr_range['value'],
      });
      // console.log(cranges[key]);
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
        // console.log(cranges[key][j]);
        // console.log(step);
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
  // console.log(prettifyXml(xmlContent));
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
  console.log("frameCOunt");
  console.log(frameCount);
  var cranges = {};
  for ( var key in ranges) {
    cranges[key] = []
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      // console.log(curr_range);
      var curr_range = ranges[key]['ranges'][i];
      cranges[key].push({
        'id': curr_range['id'],
        'range0': curr_range['range'][0],
        'range1': curr_range['range'][1],
        'value': curr_range['value'],
      });
      // console.log(cranges[key]);
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
        // console.log(cranges[key][j]);
        // console.log(step);
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
  console.log("appendding...")

  var time_order = doc.createElement("TIME_ORDER");
  var ling_type = doc.createElement("LINGUISTIC_TYPE");
  ling_type.setAttribute("GRAPHIC_REFERENCES", "false");
  ling_type.setAttribute("LINGUISTIC_TYPE_ID", "default-lt");
  ling_type.setAttribute("TIME_ALIGNABLE", "true");

  var aid = 0;
  var ts = 0;
  for ( var key in ranges) {
    // console.log(key);
    var tier = doc.createElement("TIER");
    tier.setAttribute("TIER_ID", key);
    tier.setAttribute("LINGUISTIC_TYPE_REF", "default-lt");
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      var curr_range = ranges[key]['ranges'][i];
      // console.log(Math.floor((curr_range['range'][0]*video.duration*100)));
      // console.log(Math.floor((curr_range['range'][1]*video.duration*100)));
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
  console.log(prettifyXml(etfContent));
  etfexport.href = "data:text/xml;charset=utf-8," + prettifyXml(etfContent);
  etfexport.download = "project.eaf";
  // etfexport.click();
  // window.open(encodedUri);
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


function textValueSaveFunctionInitial(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
      var curr_range = getActiveRange();
      var text_field = document.getElementById('inlineTextValue');
      // var additional_visualization = document.getElementById('additionalVisualization');
      // var keyboard_div = document.getElementById('keyboard');
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
// console.log(savebutton);
handshapeValueSave.addEventListener("click", function (event){
  var curr_value = document.getElementById('hand-value');
  var curr_range = getActiveRange();
  // console.log(this.src);
  if (curr_value.src === "http://slan-tool.com/media/select.png"){
    alert("Value cannot be saved!");
  } else {
    curr_range['value'] = curr_value.src;
    handshapeValueSave.innerHTML = "Saved!"
  }

});

var savebutton = document.getElementById('saveOptions');

savebutton.addEventListener("click", function (){
  console.log("This is it");
  // console.log(ranges);
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


async function parse_results(filename){
  var results = 0;
  var form_data = new FormData();
  form_data.append("filename", filename);
  while (results === 0){
    $.ajax({
    		url: '/parse_results/', // point to server-side URL
    		dataType: 'json', // what to expect back from server
    		// cache: false,
    		// contentType: false,
    		// processData: false,
    		data: {"filename" : filename},
    		type: 'get',
    		success: function (response) { // display success response
          console.log(response);
          if (response['status'] !== 'null'){
            results = 1;
          }
          // video_uuid = response['filename'];
          // console.log(response['filename']);
          // parse_results(response['filename'])
    		},
    		// error: function (response) {
    		// 	$('#msg').html(response.message); // display error response
    		// }
  	});
    await sleep(3000);
  }
}

function uploadVideo(type){
  var form_data = new FormData();
  // console.log(video_file)
	form_data.append("files", video_file);

  var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
	console.log(csrf_token);
  form_data.append("type", type);
	form_data.append('csrfmiddlewaretoken', csrf_token);

	$.ajax({
  		url: '/upload/', // point to server-side URL
  		dataType: 'json', // what to expect back from server
  		cache: false,
  		contentType: false,
  		processData: false,
  		//data: {'data': form_data, 'csrfmiddlewaretoken': csrf_token},
  		data: form_data,
  		type: 'post',
  		success: function (response) { // display success response
        console.log(response);
        // video_uuid = response['filename'];
        console.log(response['filename']);
        parse_results(response['filename'])
  		},
  		// error: function (response) {
  		// 	$('#msg').html(response.message); // display error response
  		// }
	});
}

function addNewRow(segment_name){
  if (segment_name in ranges){
    console.log("Already exists");
    console.log(ranges);
  } else {

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
        console.log(ranges);
        var curcanvas = document.getElementById(segment_name);
        document.getElementById('metadata_timeline').removeChild(curcanvas);
        var curname = document.getElementById(segment_name + "_rowname");
        console.log(curname);
        metadata_name.removeChild(curname);
        var additionalName = document.getElementById("addValueName" + segment_name);
        var additionalValue = document.getElementById("addValue" + segment_name);
        var addDiv = document.getElementById('additionalVisualizationRow');
        addDiv.removeChild(additionalName);
        addDiv.removeChild(additionalValue);

      } else {
        // Do nothing!
        console.log('Cancelled');
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
}

var scissorsButton = document.getElementById('scissorsButton');

scissorsButton.addEventListener("click", async function (){

  // uploadVideo("handshape");
  // ranges["Signing"] = {
    // "canvas": {},
    // "ctx": {},
    // "totalDuration": 10,
    // "startDuration": 1.6273584905660377,
    // "endDuration": 1.4150943396226414,
    // "currentPosition": 0,
    // "draggable": false,
    // "mouseX": 605,
    // "mouseY": 19,
    // "padding": 0,
    // "ranges": [
    //     {
    //         "range_pix": [
    //             52,
    //             102
    //         ],
    //         "range": [
    //             0.06132075471698113,
    //             0.14150943396226415
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "8uqaYu"
    //     },
    //     {
    //         "range_pix": [
    //             168,
    //             218
    //         ],
    //         "range": [
    //             0.16273584905660377,
    //             0.31839622641509435
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "bQnDZI"
    //     },
    //     {
    //         "range_pix": [
    //             319,
    //             369
    //         ],
    //         "range": [
    //             0.3761792452830189,
    //             0.42924528301886794
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "jviPC5"
    //     },
    //     {
    //         "range_pix": [
    //             380,
    //             430
    //         ],
    //         "range": [
    //             0.4481132075471698,
    //             0.4893867924528302
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "8mzsgw"
    //     },
    //     {
    //         "range_pix": [
    //             443,
    //             493
    //         ],
    //         "range": [
    //             0.5224056603773585,
    //             0.6804245283018868
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "b6zjQL"
    //     },
    //     {
    //         "range_pix": [
    //             650,
    //             700
    //         ],
    //         "range": [
    //             0.722877358490566,
    //             0.8997641509433962
    //         ],
    //         "type": "text",
    //         "value": "",
    //         "id": "npRhTL"
    //     }
    // ],
    // "cw": 848,
    // "ch": 40,
    // "width": 848,
    // "currentProgress": 0.14150943396226415
    // };
  document.getElementById('scissorsButton').innerHTML = "Загружаем."
  await sleep(1000);
  document.getElementById('scissorsButton').innerHTML = "Загружаем.."
  await sleep(1000);
  document.getElementById('scissorsButton').innerHTML = "Запускаем..."
  await sleep(1000);
  document.getElementById('scissorsButton').innerHTML = "Запускаем."
  await sleep(1000);
  document.getElementById('scissorsButton').innerHTML = "Запускаем.."
  await sleep(1000);
  document.getElementById('scissorsButton').innerHTML = "Запустить"
  addNewRow("Signing");

}, false);

var handshapesButton = document.getElementById('handshapesButton');

function disableHandshapeButton() {
  // var handshapesButton = document.getElementById('handshapesButton');
  document.getElementById('handshapeWarning').style.display = 'block';
  handshapesButton.style.backgroundColor = 'grey';
  handshapesButton.style.border = "none";
  // handshapesButton.disabled = true;
  // handshapesButton.addEventListener("click", function (){
  //   console.log("shit yourself")
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
    console.log("unactive");
  } else {
    document.getElementById('handshapesButton').innerHTML = "Загружаем."
    await sleep(1000);
    document.getElementById('handshapesButton').innerHTML = "Загружаем.."
    await sleep(1000);
    document.getElementById('handshapesButton').innerHTML = "Запускаем..."
    await sleep(1000);
    document.getElementById('handshapesButton').innerHTML = "Запускаем."
    await sleep(1000);
    document.getElementById('handshapesButton').innerHTML = "Запускаем.."
    await sleep(1000);
    document.getElementById('handshapesButton').innerHTML = "Запустить"
    var curr_range = getActiveRange();
    // console.log()
    // console.log(curr_range['range'][1]*getVideoDuration(video.duration));
    console.log(getVideoDuration(video.duration)*(curr_range['range'][1]-curr_range['range'][0])*1000);


    if ("Right hand" in ranges){
      ranges['Right hand']['ranges'].push(
        {
          "range_pix": [
              curr_range['range_pix'][0],
              curr_range['range_pix'][1]
          ],
          "range": [
              curr_range['range'][0],
              curr_range['range'][1]
          ],
          "type": "handshapes",
          "value": "http://slan-tool.com/media/flathand15.png",
          "id": makeid(6)
      });

    } else {
      ranges['Right hand'] = {
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
                  curr_range['range_pix'][0],
                  curr_range['range_pix'][1]
              ],
              "range": [
                  curr_range['range'][0],
                  curr_range['range'][1]
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
      rowNameDiv.setAttribute("id", "Right hand_rowname");
      rowNameDiv.setAttribute("style", "padding: 8px; height: 40px; z-index: 0;");
      var rowName = document.createElement("a");
      rowName.innerHTML = "Right hand";
      var rowDeleteIcon = document.createElement("i");

      rowDeleteIcon.setAttribute("class", "bi bi-x deleteRow");
      rowDeleteIcon.addEventListener('click', function(){
        if (confirm('Are you sure you want to remove row ' + "Right hand" + "?" )) {
          delete ranges["Right hand"];
          console.log(ranges);
          var curcanvas = document.getElementById("Right hand");
          document.getElementById('metadata_timeline').removeChild(curcanvas);
          var curname = document.getElementById("Right hand" + "_rowname");
          console.log(curname);
          metadata_name.removeChild(curname);
          var additionalName = document.getElementById("addValueName" + "Right hand");
          var additionalValue = document.getElementById("addValue" + "Right hand");
          var addDiv = document.getElementById('additionalVisualizationRow');
          addDiv.removeChild(additionalName);
          addDiv.removeChild(additionalValue);

        } else {
          // Do nothing!
          console.log('Cancelled');
        }

      }, false);

      rowNameDiv.appendChild(rowName);
      rowNameDiv.appendChild(rowDeleteIcon);
      document.getElementById('metadata_name').appendChild(rowNameDiv);

      var currcanvas = document.createElement("canvas");
      currcanvas.setAttribute("id", "Right hand");
      currcanvas.setAttribute("padding-top", "-10px");
      currcanvas.setAttribute("z-index", "0");
      currcanvas.setAttribute("position", "absolute");
      document.getElementById('metadata_timeline').appendChild(currcanvas);
      customRangeSlider.init(10, "Right hand", 'handshape', "Right hand");

      //additionalVisualization
      var addColName = document.createElement("div");
      addColName.setAttribute("class", "col-6");
      addColName.setAttribute("style", "height:80px;");
      var addColValue = document.createElement("div");
      addColValue.setAttribute("class", "col-6");
      addColValue.setAttribute("id", "addValueRight hand");
      var addName = document.createElement("a");
      addName.innerHTML = "Right hand";
      addColName.append(addName);

      var addDiv = document.getElementById('additionalVisualizationRow');

      addDiv.append(document.createElement("hr"));
      addDiv.append(addColName);
      addDiv.append(addColValue);
    }
    alert("New range created!");
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
  // console.log(toSearch);
  var rowname = document.getElementById(toSearch);
  // console.log(rowname);
  if (rowname != null){
    rowname.setAttribute("style", "padding: 8px; height: 40px; z-index: 0; background-color: rgb(166, 221, 255);");
  }// rowname.style.background = "rgb(138, 210, 255);";
}

function uncolorActive(rs, id){
  rs.canvas.style="background-color: rgba(200,200,200, 0);";
  var toSearch = id + "_rowname";
  // console.log(toSearch);
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
    // console.log($('#metadata_timeline').width());
    canvasToResize.width = $('#metadata_timeline').width();
    if ('draw' in ranges[key]) {
      ranges[key].draw();
    }
  }

}
resizeCanvas();

function zoomCanvas(zoomValue, type){
  // console.log(e.wheelDeltaX);
  var timeline_canvas = document.getElementById('metadata_timeline'); //metadata_timeline
  var progress = document.getElementById('subprogressbar');
  var progress_pointer = document.getElementById('subprogressbar_pointer'); //metadata_timeline
  // console.log("progress");
  // console.log(progress.width);
  var curr_width = $('#metadata_timeline').width();
  // console.log(curr_width);
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
              rs.ctx.strokeStyle = "rgb(247, 172, 59)";
            } else {
              if ("text" == rs['ranges'][i]['type']){
                rs.ctx.strokeStyle = "rgb(64, 159, 255)";
              } else {
                rs.ctx.strokeStyle = "rgb(64, 159, 255)";
              }

            }


            rs.ctx.lineWidth = 25;
            rs.ctx.stroke();
            rs.ctx.closePath();

          // rs.ctx.clip();
            rs.ctx.fillStyle = "rgb(220,220,220)";
            rs.ctx.font = "14px Arial";
            rs.ctx.fillText(rs['ranges'][i]['value'], rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width+5, 25);

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
            // console.log("ARRRIVA");
            colorActive(rs, rs.canvas.id);
          } else {
            // console.log("no");
            uncolorActive(rs, rs.canvas.id);
          }
        };
        ranges[canvas_id]['mousemove'] = function(e) {
          var rs = ranges[canvas_id];
          var ch = rs.ch;
          var c = rs.canvas;

          rs.draw();
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
          // console.log(rs.mouseX);
          // console.log(rs.mouseY);
          // console.log(e.target.id);
          // console.log(e.targetTouches);
          // console.log(e.targetTouches[0].layerX);
          // console.log(e.layerX);

          if (rs.draggable) {
            //update progress bar
            var pos = e.layerX/rs['canvas'].getBoundingClientRect().width;
            video.currentTime = pos * video.duration;
            for (var i=0; i < rs['ranges'].length; i++){
              if (active === rs['ranges'][i]['id']){
                //RangeEnd
                var distance = rs.getDistance(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);
                // console.log("this is ch, padding, click and distance")
                console.log(distance);
                // // console.log(rs.padding);
                // console.log(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width);
                // console.log(rs.getDistance(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding));
                //if distance< r1+r2 boom !
                if (distance <= 10) {
                  // active = rs['ranges'][i]['id'];
                  rs.update(rs.mouseX, false, i);
                  console.log("This is end cursor move");
                  return;
                }

                //RangeStart
                var distance = rs.getDistance(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width, ch - rs.padding);
                //if distance< r1+r2 boom !
                console.log(distance);
                if (distance <= 10) {
                  // active = rs['ranges'][i]['id'];
                  rs.update(rs.mouseX, true, i);
                  console.log("This is start cursor move");
                  return;
                }

              }


            }

          }

        };
        ranges[canvas_id]['getDistance'] = function(px, py) {

          var rs = ranges[canvas_id];
          // console.log(canvas_id);
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
              for (var i=0; i < rs['ranges'].length; i++){
                //RangeStart
                if (event.layerX > rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width
                && event.layerX < rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width) {

                  console.log(event.layerX);
                  console.log(rs['ranges'][i]['range'][0]*rs['canvas'].getBoundingClientRect().width);
                  console.log(rs['ranges'][i]['range'][1]*rs['canvas'].getBoundingClientRect().width);
                  // console.log();
                  console.log("keyboard");
                  document.getElementById('additionalVisualization').style.display = 'none';
                  document.getElementById('keyboard').style.display = 'block';
                  document.getElementById('automaticAnnotation').style.display = 'none';

                  if (curr_range['type'] == "text"){
                    document.getElementById('textValueDiv').style.display = 'block';
                    document.getElementById('handshapeValueDiv').style.display = 'none';
                    document.getElementById('textValue').autofocus = true;
                    document.getElementById('textValue').value = curr_range['value'];

                  } else {
                    handshapeValueSave.innerHTML = "Save";
                    document.getElementById('textValueDiv').style.display = 'none';
                    document.getElementById('handshapeValueDiv').style.display = 'block';
                    var curr_value = document.getElementById('hand-value');
                    console.log(curr_range['value']);
                    curr_value.src = curr_range['value'].includes("http") ? curr_range['value'] : '/media/select.png';
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
          console.log("Keys currently pressed:" + keysArray);
            if(lastDownTarget ==rs['canvas']) {
              // if (event.key === "a") {
              //   console.log("a pressed");
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
                console.log("] pressed");
                console.log(ranges);
                // code for enter
              } else if (event.key === " ") {
                if (video.paused){

                  var curr_range = getActiveRange();
                  if (active != ""){
                    video.currentTime = curr_range['range'][0]*video.duration;
                  }
                  video.play();

                } else {
                  video.pause();
                }

                // code for enter
              } else if (keysArray.toString() === '76'){
                var curr_range = getActiveRange();
                console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][1] = (curr_range['range'][1]*video.duration + 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '16,76'){
                var curr_range = getActiveRange();
                console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][1] = (curr_range['range'][1]*video.duration - 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '75'){
                var curr_range = getActiveRange();
                console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][0] = (curr_range['range'][0]*video.duration - 0.08)/video.duration;
                rs.draw();
              } else if (keysArray.toString() === '16,75'){
                var curr_range = getActiveRange();
                console.log(curr_range['range'][1]*video.duration);
                curr_range['range'][0] = (curr_range['range'][0]*video.duration + 0.08)/video.duration;
                rs.draw();
              }
            }
        }, false);

        document.addEventListener('keyup', function(e){
                keys[e.keyCode] = false;
                // console.log("Keys currently pressed: " + getNumberArray(keys));
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
            console.log('event.target');
            var pad = event.target.getBoundingClientRect().top + 10;
            console.log(pad);
            // console.log(event.target.top);
            // console.log(event.clientY);
            // console.log(event.target);

            startpoint = event.layerX;
            startpoint_per = event.layerX/rs['canvas'].getBoundingClientRect().width;
            endpoint_per = (event.layerX+50)/rs['canvas'].getBoundingClientRect().width;
            var id = makeid(6);
            rs['ranges'].push({'range_pix' : [startpoint, startpoint+50], 'range': [startpoint_per, endpoint_per], "type": rs['tier_type'], "value": "", "id": id});
            active = id;
            // $('#optionsModal').modal('show');
            rs.draw();



            if (rs['tier_type'] == "text"){
              // document.getElementById('textValueDiv').style.display = 'block';
              // document.getElementById('handshapeValueDiv').style.display = 'none';
              // document.getElementById('textValue').focus();
              //Adding input in canvas
              var input = document.createElement('input');
              input.type = 'text';
              input.id = 'inlineTextValue';
              input.style.position = 'fixed';
              input.style.left = (event.clientX + 2) + 'px';
              input.style.width = '50px';
              input.style.height = '24px';
              input.style.border = 'none';
              input.style.top = (pad - 2) + 'px';
              input.onkeydown = textValueSaveFunctionInitial;
              document.body.appendChild(input);
              input.focus();


            } else {
              document.getElementById('additionalVisualization').style.display = 'none';
              document.getElementById('keyboard').style.display = 'block';
              document.getElementById('automaticAnnotation').style.display = 'none';

              document.getElementById('textValueDiv').style.display = 'none';
              document.getElementById('handshapeValueDiv').style.display = 'block';
              handshapeValueSave.innerHTML = "Save";
              document.getElementById('hand-value').src = '/media/select.png';
            }
          }




        });

        rs.canvas.addEventListener(startEvent, function mousedown(e) {
            rs.draggable = true;

            active = "";
            document.getElementById('additionalVisualization').style.display = 'block';
            document.getElementById('keyboard').style.display = 'none';
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
            //   console.log("active range");
            // } else {
            console.log("not active");
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

function addRowFunction(tier_type){
  console.log("Goddamn")
  if (tier_type === "text") {
    var row_name = "Новый ряд";//document.getElementById('text_row_name');
  } else {
    var row_name = "Новый ряд";// document.getElementById('handshapes_row_name');
  }
  var row_id = makeid(4);
  console.log(row_name);
  // var tierType = document.getElementById('tierType');
  // var tier_type = tierType.value;
  // console.log(tier_type);
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
  rowName.setAttribute("style", "border: none !important;")
  rowName.addEventListener("keydown", function(e){
      // Enter pressed
      if (e.keyCode == 13)
      {
          //method to prevent from default behaviour
          e.preventDefault();
      }
  });
  var rowDeleteIcon = document.createElement("i");

  rowDeleteIcon.setAttribute("class", "bi bi-x deleteRow");
  rowDeleteIcon.addEventListener('click', function(){
    if (confirm('Are you sure you want to remove row ' + row_id + "?" )) {
      delete ranges[row_id];
      console.log(ranges);
      var curcanvas = document.getElementById(row_id);
      document.getElementById('metadata_timeline').removeChild(curcanvas);
      var curname = document.getElementById(row_id + "_rowname");
      console.log(curname);
      metadata_name.removeChild(curname);
      var additionalName = document.getElementById("addValueName" + row_id);
      var additionalValue = document.getElementById("addValue" + row_id);
      var addDiv = document.getElementById('additionalVisualizationRow');
      addDiv.removeChild(additionalName);
      addDiv.removeChild(additionalValue);

    } else {
      // Do nothing!
      console.log('Cancelled');
    }

  }, false);

  rowNameDiv.appendChild(rowName);
  rowNameDiv.appendChild(rowDeleteIcon);
  var metadata_name = document.getElementById('metadata_name');
  if (tier_type === "text") {
    var beforeNode = document.getElementById('handshapes_rows');
    metadata_name.insertBefore(rowNameDiv, beforeNode);
  } else {
    // var beforeNode = document.getElementById('handshapes_rows');
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
  // if (event.keyCode === 13) {
    addRowFunction("text");
    // }
}, false);

document.getElementById('addHandshapeRow').addEventListener('click', function(){
  // if (event.keyCode === 13) {
        addRowFunction("handshape");
    // }
}, false);

// document.getElementById('add_row').onclick = function(){
//   addRowFunction();
// }

function changeValue(){
  var value = document.getElementById('hand-value');
  value.src = this.src;

}

var keys = document.querySelectorAll('.hand-keyboard');
keys.forEach(item => {
  item.addEventListener('click', changeValue, false);
});

video.addEventListener('timeupdate', function(event){
  var videopos = video.currentTime/video.duration;
  for ( var key in ranges) {
    for (var i = 0; i < ranges[key]['ranges'].length; i++){
      if (ranges[key]['ranges'][i]['range'][0] < videopos && ranges[key]['ranges'][i]['range'][1] > videopos){
        // ranges[key]['ranges'][i]['value'] = value;
        // console.log('addValue' + key);
        var curr_range = document.getElementById('addValue' + key);
        if (ranges[key]['ranges'][i]['type'] === "text"){
          curr_range.innerHTML = ranges[key]['ranges'][i]['value'];
        } else {
          console.log("clear curr range");
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

window.onkeydown = function(e) {
    var elem = e.target.type;
    console.log(elem);
    if( elem !== 'text') {
        return !(e.keyCode == 32);
    }
};

function drawTotalProgressBar() {
  var cutpadding = 0;
  tpb.width = timeline_metadata.getBoundingClientRect().width-10;
  tpb.height = 20;
  console.log("HOLA!");
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
    console.log(event.layerX);
    var curr_range = getActiveRange();
    var currtime = parseFloat(((event.layerX/tpb.getBoundingClientRect().width)*video.duration + "0").substring(0, 8));
    video.currentTime = currtime;
    console.log(currtime);
  });

  do {
    tpbctx.moveTo(cutpadding,0);
    tpbctx.lineTo(cutpadding, 5);
    tpbctx.strokeStyle = "rgb(200,200,200)";
    tpbctx.lineWidth = 2;
    tpbctx.stroke();
    var cutperc = cutpadding/tpb.getBoundingClientRect().width;
    console.log(video.duration);
    var cuttime = cutperc*video.duration;
    // if (isInt(video.duration)){
    //   cuttime = cutperc*video.duration/60;
    //   console.log(video.duration/60);
    // } else {
    //   cuttime = cutperc*video.duration;
    //   console.log(video.duration);
    // }
    console.log(cuttime);
    console.log(tpb.getBoundingClientRect().width);
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
    console.log(event.layerX);
    var curr_range = getActiveRange();
    var currtime = parseFloat(((event.layerX/spb.getBoundingClientRect().width)*video.duration + "0").substring(0, 8));
    video.currentTime = currtime;
    console.log(currtime);
  });
}
drawSubprogressPointer();

video.addEventListener('timeupdate', function(event){
  // console.log(video.duration);
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
  console.log(progress_overflow.scrollLeft);
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
      console.log(speed);
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

// async function loadFFmpeg () {
//   message.innerHTML = 'Loading ffmpeg-core.js';
//   await ffmpeg.load();
// }
//FFMPEG TRIMMING
// const { createFFmpeg, fetchFile } = FFmpeg;
// const ffmpeg = createFFmpeg({ log: true });
// loadFFmpeg();
//
// const trim = async () => {
//   const message = document.getElementById('message');
//   // const { name } = video_file; //s[0];
//   // console.log(video_file);
//   message.innerHTML = 'Start trimming';
//   // ffmpeg.FS('writeFile', video_file_name, video_file); //await fetchFile(video_file));
//   await ffmpeg.run('-i', video_file_name, '-ss', '1', '-to', '2', 'output.mp4');
//   message.innerHTML = 'Complete trimming';
//   const data = ffmpeg.FS('readFile', 'output.mp4');
//
//   video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
//
// }

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
  console.log(selectFrom);
  console.log(parseInt(selectTo));
  console.log(video.duration);
  console.log(parseInt(selectTo) > video.duraiton);
  console.log(parseFloat(selectTo) > parseFloat(video.duraiton));
  var from = selectFrom/video.duration;
  console.log(from);
  var to = selectTo/video.duration;
  console.log(to);
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
        console.log(ranges);
        var curcanvas = document.getElementById("Left hand");
        document.getElementById('metadata_timeline').removeChild(curcanvas);
        var curname = document.getElementById("Left hand" + "_rowname");
        console.log(curname);
        metadata_name.removeChild(curname);
        var additionalName = document.getElementById("addValueName" + "Left hand");
        var additionalValue = document.getElementById("addValue" + "Left hand");
        var addDiv = document.getElementById('additionalVisualizationRow');
        addDiv.removeChild(additionalName);
        addDiv.removeChild(additionalValue);

      } else {
        // Do nothing!
        console.log('Cancelled');
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


}//end of init functions
//
//
video.addEventListener("loadedmetadata", function() {
  console.log("new video loaded");
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
    $('#quicktips').modal('show');
});


// console.log("cammon");
// initTimeline();
