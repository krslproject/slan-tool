var rangeSlider = {
    totalDuration: 0,
    startDuration: 0,
    endDuration: 0,
    currentPosition: 0,
    width: 0,
    padding: 30,
    startPosition: 0,
    endPosition: 0,
    cw: 0,
    ch: 0,

    init: function(totalDuration) {
        var rs = this;

        rs.canvas = document.createElement("canvas");
        // rs.canvas = document.getElementById('parameter_canvas');
        // rs.canvas.id = "parameter_canvas";
        rs.canvas.width = 600;
        rs.canvas.height = 40;
        document.getElementById('metadata_timeline').appendChild(rs.canvas);
        rs.ctx = rs.canvas.getContext('2d');
        rs.draggable = false;
        rs.mouseX = 0;
        rs.mouseY = 0;

        rs.totalDuration = totalDuration;
        rs.cw = rs.ctx.canvas.width;
        rs.ch = rs.ctx.canvas.height;
        rs.width = this.cw - (rs.padding);
        rs.startPosition = rs.padding;
        rs.endPosition = rs.width;
        console.log(rs.width);
        console.log(rs.padding);
        console.log(rs.startPosition);
        console.log(rs.endPosition);

        //detect touch and then automatically assign events
        var isTouchSupported = 'ontouchstart' in window;
        var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
        var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
        var endEvent = isTouchSupported ? 'touchend' : 'mouseup';

        //add the canvas listeners and functions
        rs.canvas.addEventListener(startEvent, function mousedown(e) {

            rs.draggable = true;
        }, false);
        rs.canvas.addEventListener(endEvent, function mouseup(e) {
            rs.draggable = false;
        }, false);
        rs.canvas.addEventListener(moveEvent, rangeSlider.mousemove.bind(this), false);

        rs.draw();
    },
    update: function(mouseX, cursor) {

        var rs = this;
        var cw = this.cw;
        var totalDuration = this.totalDuration;

        if (cursor) {

            rs.startPosition = Math.min(mouseX, rs.endPosition);
            rs.startPosition = Math.max(rs.startPosition, rs.padding);

            rs.currentProgress = (rs.startPosition - rs.padding) / (rs.width - rs.padding);
            rs.startDuration = totalDuration * ((rs.startPosition - rs.padding) / rs.width);

        } else {
            rs.endPosition = Math.min(mouseX, rs.width);
            rs.endPosition = Math.max(rs.endPosition, rs.startPosition);

            rs.currentProgress = (rs.endPosition - rs.padding) / (rs.width - rs.padding);
            rs.endDuration = totalDuration * ((rs.endPosition - rs.padding) / rs.width);
        }

    },
    draw: function() {
        var rs = this;
        var currentPosition = rs.currentPosition;
        var ch = this.ch;

        this.clearCanvas();

        //draw track
        rs.ctx.beginPath();
        rs.ctx.moveTo(rs.padding, ch - rs.padding);
        rs.ctx.lineTo(rs.width, ch - rs.padding);
        rs.ctx.closePath();
        rs.ctx.strokeStyle = "rgb(200,200,200)";
        rs.ctx.lineWidth = 3;
        rs.ctx.stroke();
        rs.ctx.closePath();

        //Draw selected segment
        rs.ctx.beginPath();
        rs.ctx.moveTo(rs.startPosition, ch - rs.padding);
        rs.ctx.lineTo(rs.endPosition, ch - rs.padding);
        rs.ctx.closePath();
        rs.ctx.strokeStyle = "rgb(0,200,255)";
        rs.ctx.lineWidth = 3;
        rs.ctx.stroke();
        rs.ctx.closePath();

        //cursor
        rs.ctx.beginPath();
        rs.ctx.arc(rs.startPosition, ch - rs.padding, 10, 0, 2 * Math.PI, true);
        rs.ctx.stroke();
        rs.ctx.beginPath();
        rs.ctx.arc(rs.endPosition, ch - rs.padding, 10, 0, 2 * Math.PI, true);
        rs.ctx.stroke();

    },
    mousemove: function(e) {

        var rs = this;
        var ch = rs.ch;
        var c = rs.canvas;

        rs.draw();
        console.log("this is e");
        console.log(e);
        e.stopPropagation();
        e.preventDefault();

        rs.mouseX = e.layerX;
        rs.mouseY = e.layerY;

        rs.mouseX = (e.targetTouches) ? e.targetTouches[0].layerX - c.offsetLeft : e.layerX - c.offsetLeft;
        rs.mouseY = (e.targetTouches) ? e.targetTouches[0].layerY - c.offsetTop : e.layerY - c.offsetTop;


        if (rs.draggable) {

            //RangeStart
            var distance = rs.getDistance(rs.startPosition, ch - rs.padding);
            //if distance< r1+r2 boom !
            if (distance <= 70) {
                rs.update(rs.mouseX, true);
                return;
            }

            //RangeEnd
            var distance = rs.getDistance(rs.endPosition, ch - rs.padding);
            //if distance< r1+r2 boom !
            if (distance <= 70) {
                rs.update(rs.mouseX, false);
                return;
            }
        }
    },
    getDistance: function(px, py) {

        var rs = this;

        //get the distance
        var xs = 0;
        var ys = 0;

        xs = px - rs.mouseX;
        xs = xs * xs;

        ys = py - rs.mouseY;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },
    clearCanvas: function() {

        var rs = this;

        // Store the current transformation matrix
        // rs.ctx.save();

        // Use the identity matrix while clearing the canvas
        rs.ctx.setTransform(1, 0, 0, 1, 0, 0);
        rs.ctx.clearRect(0, 0, this.cw, this.ch);

        // Restore the transform
        // rs.ctx.restore();

    }
}

var ranges = {};
function initCanvas(totalDuration, canvas_id) {

    // rs.canvas = document.createElement("canvas");
    if (!(canvas_id in ranges)){
      ranges[canvas_id] = {};
      ranges[canvas_id]['canvas'] = document.getElementById(canvas_id);
      ranges[canvas_id]['ctx'] = document.createElement("canvas").getContext('2d');
      ranges[canvas_id]['totalDuration'] = totalDuration;
      ranges[canvas_id]['startDuration'] = 0;
      ranges[canvas_id]['endDuration'] = 0;
      ranges[canvas_id]['currentPosition'] = 0;
      ranges[canvas_id]['draggable'] = false;
      ranges[canvas_id]['mouseX'] = 0;
      ranges[canvas_id]['mouseY'] = 0;
      ranges[canvas_id]['padding'] = 30;
      ranges[canvas_id]['ranges'] = [];
      ranges[canvas_id]['cw'] = ranges[canvas_id]['ctx'].canvas.width;
      ranges[canvas_id]['ch'] = ranges[canvas_id]['ctx'].canvas.height;
      ranges[canvas_id]['width'] = ranges[canvas_id]['cw'] - ranges[canvas_id]['padding'];
      // ranges[canvas_id]['mousemove'] =;
    }

    console.log(canvas_id);
    var rs = ranges[canvas_id];


    // rs.canvas.id = "parameter_canvas";
    rs['canvas'].width = 1100;
    rs['canvas'].height = 40;
    // document.getElementById('metadata_timeline').appendChild(rs.canvas);

    rs['ranges'].push([rs.padding, 100]);
    // rs.endPosition = 100;

    //detect touch and then automatically assign events
    var isTouchSupported = 'ontouchstart' in window;
    var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
    var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
    var endEvent = isTouchSupported ? 'touchend' : 'mouseup';

    //add the canvas listeners and functions
    rs['canvas'].addEventListener(startEvent, function mousedown(e) {
      // console.log("mousedown");
        rs['draggable'] = true;
    }, false);
    rs['canvas'].addEventListener(endEvent, function mouseup(e) {
        rs['draggable'] = false;
    }, false);
    rs['canvas'].addEventListener(moveEvent, mousemove.bind(this), false);

    draw(rs);
}
function updateCanvas(mouseX, cursor, rangeIndex) {

    var rs = this;
    var cw = this.cw;
    var totalDuration = this.totalDuration;

    if (cursor) {

        ranges[rs.canvas.id][rangeIndex][0] = Math.min(mouseX, ranges[rs.canvas.id][rangeIndex][1]);
        ranges[rs.canvas.id][rangeIndex][0] = Math.max(ranges[rs.canvas.id][rangeIndex][0], rs.padding);

        rs.currentProgress = (ranges[rs.canvas.id][rangeIndex][0] - rs.padding) / (rs.width - rs.padding);
        rs.startDuration = totalDuration * ((ranges[rs.canvas.id][rangeIndex][0] - rs.padding) / rs.width);

    } else {
        ranges[rs.canvas.id][rangeIndex][1] = Math.min(mouseX, rs.width);
        ranges[rs.canvas.id][rangeIndex][1] = Math.max(ranges[rs.canvas.id][rangeIndex][1], ranges[rs.canvas.id][rangeIndex][0]);

        rs.currentProgress = (ranges[rs.canvas.id][rangeIndex][1] - rs.padding) / (rs.width - rs.padding);
        rs.endDuration = totalDuration * ((ranges[rs.canvas.id][rangeIndex][1] - rs.padding) / rs.width);
    }

}
function draw(rs) {
    // var rs = this;
    var currentPosition = rs.currentPosition;
    var ch = rs.ch;

    this.clearCanvas();

    //draw track
    rs.ctx.beginPath();
    rs.ctx.moveTo(rs.padding, ch - rs.padding);
    rs.ctx.lineTo(rs.width, ch - rs.padding);
    rs.ctx.closePath();
    rs.ctx.strokeStyle = "rgb(200,200,200)";
    rs.ctx.lineWidth = 3;
    rs.ctx.stroke();
    rs.ctx.closePath();
    //Draw selected segment;
    for (var i=0; i < ranges[rs.canvas.id].length; i++){

      rs.ctx.beginPath();
      rs.ctx.moveTo(ranges[rs.canvas.id][i][0], ch - rs.padding);
      rs.ctx.lineTo(ranges[rs.canvas.id][i][1], ch - rs.padding);
      rs.ctx.closePath();
      rs.ctx.strokeStyle = "rgb(0,200,255)";
      rs.ctx.lineWidth = 3;
      rs.ctx.stroke();
      rs.ctx.closePath();

      //cursor
      rs.ctx.beginPath();
      rs.ctx.arc(ranges[rs.canvas.id][i][0], ch - rs.padding, 10, 0, 2 * Math.PI, true);
      rs.ctx.stroke();
      rs.ctx.beginPath();
      rs.ctx.arc(ranges[rs.canvas.id][i][1], ch - rs.padding, 10, 0, 2 * Math.PI, true);
      rs.ctx.stroke();
    }


}
function mousemove(e) {

    // var rs = this;
    // var ch = rs['ch'];
    // var c = rs['canvas'];
    console.log("this is e");
    console.log(e);

    // draw();
    e.stopPropagation();
    e.preventDefault();

    rs.mouseX = e.layerX;
    rs.mouseY = e.layerY;

    rs.mouseX = (e.targetTouches) ? e.targetTouches[0].layerX - c.offsetLeft : e.layerX - c.offsetLeft;
    rs.mouseY = (e.targetTouches) ? e.targetTouches[0].layerY - c.offsetTop : e.layerY - c.offsetTop;



    if (rs.draggable) {
        for (var i=0; i < ranges[rs.canvas.id].length; i++){
          //RangeStart
          var distance = rs.getDistance(ranges[rs.canvas.id][i][0], ch - rs.padding);
          //if distance< r1+r2 boom !
          if (distance <= 70) {
            rs.update(rs.mouseX, true, i);
            return;
          }

          //RangeEnd
          var distance = rs.getDistance(ranges[rs.canvas.id][i][1], ch - rs.padding);
          //if distance< r1+r2 boom !
          if (distance <= 70) {
            rs.update(rs.mouseX, false, i);
            return;
          }

        }
    }
}
function getDistance(px, py) {

    var rs = this;

    //get the distance
    var xs = 0;
    var ys = 0;

    xs = px - rs.mouseX;
    xs = xs * xs;

    ys = py - rs.mouseY;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}
function clearCanvas() {

    var rs = this;

    // Store the current transformation matrix
    // rs.ctx.save();

    // Use the identity matrix while clearing the canvas
    rs.ctx.setTransform(1, 0, 0, 1, 0, 0);
    rs.ctx.clearRect(0, 0, this.cw, this.ch);

    // Restore the transform
    // rs.ctx.restore();

}

var customRangeSlider = {
    totalDuration: 0,
    startDuration: 0,
    endDuration: 0,
    currentPosition: 0,
    width: 0,
    padding: 30,
    // ranges: [],
    // startPosition: 0,
    // endPosition: 0,
    canvas: "",
    cw: 0,
    ch: 0,

    init: function(totalDuration, canvas_id) {

        // rs.canvas = document.createElement("canvas");
        if (!(canvas_id in ranges)){
          ranges[canvas_id] = {};
          ranges[canvas_id]['canvas'] = document.createElement("canvas");
          ranges[canvas_id]['ctx'] = document.createElement("canvas").getContext('2d');
          ranges[canvas_id]['totalDuration'] = 0;
          ranges[canvas_id]['startDuration'] = 0;
          ranges[canvas_id]['endDuration'] = 0;
          ranges[canvas_id]['currentPosition'] = 0;
          ranges[canvas_id]['width'] = 0;
          ranges[canvas_id]['padding'] = 30;
          ranges[canvas_id]['ranges'] = [];
          ranges[canvas_id]['cw'] = 0;
          ranges[canvas_id]['ch'] = 0;
        }
        var rs = ranges[canvas_id];

        console.log(canvas_id);
        ranges[canvas_id]['canvas'] = document.getElementById(canvas_id);
        // rs.canvas.id = "parameter_canvas";
        ranges[canvas_id]['canvas'].width = 1100;
        ranges[canvas_id]['canvas'].height = 40;
        // document.getElementById('metadata_timeline').appendChild(rs.canvas);
        rs.ctx = rs.canvas.getContext('2d');
        rs.draggable = false;
        rs.mouseX = 0;
        rs.mouseY = 0;

        rs.totalDuration = totalDuration;
        rs.cw = rs.ctx.canvas.width;
        rs.ch = rs.ctx.canvas.height;
        rs.width = this.cw - (rs.padding);

        ranges[canvas_id]['range'].push([rs.padding, 100]);
        // rs.endPosition = 100;

        //detect touch and then automatically assign events
        var isTouchSupported = 'ontouchstart' in window;
        var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
        var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
        var endEvent = isTouchSupported ? 'touchend' : 'mouseup';

        //add the canvas listeners and functions
        rs.canvas.addEventListener(startEvent, function mousedown(e) {
          // console.log("mousedown");
            rs.draggable = true;
        }, false);
        rs.canvas.addEventListener(endEvent, function mouseup(e) {
            rs.draggable = false;
        }, false);
        rs.canvas.addEventListener(moveEvent, customRangeSlider.mousemove.bind(this), false);

        rs.draw();
    },
    update: function(mouseX, cursor, rangeIndex) {

        var rs = this;
        var cw = this.cw;
        var totalDuration = this.totalDuration;

        if (cursor) {

            ranges[rs.canvas.id][rangeIndex][0] = Math.min(mouseX, ranges[rs.canvas.id][rangeIndex][1]);
            ranges[rs.canvas.id][rangeIndex][0] = Math.max(ranges[rs.canvas.id][rangeIndex][0], rs.padding);

            rs.currentProgress = (ranges[rs.canvas.id][rangeIndex][0] - rs.padding) / (rs.width - rs.padding);
            rs.startDuration = totalDuration * ((ranges[rs.canvas.id][rangeIndex][0] - rs.padding) / rs.width);

        } else {
            ranges[rs.canvas.id][rangeIndex][1] = Math.min(mouseX, rs.width);
            ranges[rs.canvas.id][rangeIndex][1] = Math.max(ranges[rs.canvas.id][rangeIndex][1], ranges[rs.canvas.id][rangeIndex][0]);

            rs.currentProgress = (ranges[rs.canvas.id][rangeIndex][1] - rs.padding) / (rs.width - rs.padding);
            rs.endDuration = totalDuration * ((ranges[rs.canvas.id][rangeIndex][1] - rs.padding) / rs.width);
        }

    },
    draw: function() {
        var rs = this;
        var currentPosition = rs.currentPosition;
        var ch = this.ch;

        this.clearCanvas();

        //draw track
        rs.ctx.beginPath();
        rs.ctx.moveTo(rs.padding, ch - rs.padding);
        rs.ctx.lineTo(rs.width, ch - rs.padding);
        rs.ctx.closePath();
        rs.ctx.strokeStyle = "rgb(200,200,200)";
        rs.ctx.lineWidth = 3;
        rs.ctx.stroke();
        rs.ctx.closePath();
        //Draw selected segment;
        for (var i=0; i < ranges[rs.canvas.id].length; i++){

          rs.ctx.beginPath();
          rs.ctx.moveTo(ranges[rs.canvas.id][i][0], ch - rs.padding);
          rs.ctx.lineTo(ranges[rs.canvas.id][i][1], ch - rs.padding);
          rs.ctx.closePath();
          rs.ctx.strokeStyle = "rgb(0,200,255)";
          rs.ctx.lineWidth = 3;
          rs.ctx.stroke();
          rs.ctx.closePath();

          //cursor
          rs.ctx.beginPath();
          rs.ctx.arc(ranges[rs.canvas.id][i][0], ch - rs.padding, 10, 0, 2 * Math.PI, true);
          rs.ctx.stroke();
          rs.ctx.beginPath();
          rs.ctx.arc(ranges[rs.canvas.id][i][1], ch - rs.padding, 10, 0, 2 * Math.PI, true);
          rs.ctx.stroke();
        }


    },
    mousemove: function(e) {

        var rs = this;
        var ch = rs.ch;
        var c = rs.canvas;
        // console.log("is draggable");

        rs.draw();
        e.stopPropagation();
        e.preventDefault();

        rs.mouseX = e.layerX;
        rs.mouseY = e.layerY;

        rs.mouseX = (e.targetTouches) ? e.targetTouches[0].layerX - c.offsetLeft : e.layerX - c.offsetLeft;
        rs.mouseY = (e.targetTouches) ? e.targetTouches[0].layerY - c.offsetTop : e.layerY - c.offsetTop;



        if (rs.draggable) {
            for (var i=0; i < ranges[rs.canvas.id].length; i++){
              //RangeStart
              var distance = rs.getDistance(ranges[rs.canvas.id][i][0], ch - rs.padding);
              //if distance< r1+r2 boom !
              if (distance <= 70) {
                rs.update(rs.mouseX, true, i);
                return;
              }

              //RangeEnd
              var distance = rs.getDistance(ranges[rs.canvas.id][i][1], ch - rs.padding);
              //if distance< r1+r2 boom !
              if (distance <= 70) {
                rs.update(rs.mouseX, false, i);
                return;
              }

            }
        }
    },
    getDistance: function(px, py) {

        var rs = this;

        //get the distance
        var xs = 0;
        var ys = 0;

        xs = px - rs.mouseX;
        xs = xs * xs;

        ys = py - rs.mouseY;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },
    clearCanvas: function() {

        var rs = this;

        // Store the current transformation matrix
        // rs.ctx.save();

        // Use the identity matrix while clearing the canvas
        rs.ctx.setTransform(1, 0, 0, 1, 0, 0);
        rs.ctx.clearRect(0, 0, this.cw, this.ch);

        // Restore the transform
        // rs.ctx.restore();

    }
}

document.getElementById('add_row').onclick = function(e){
  // customRangeSlider.init(10);
  // <div class="" style="height:40px; padding: 8px">
  //    <a>Parameter</a>
  // </div>

  var row_name = document.getElementById('row_name');
  console.log(row_name.value);

  var rowNameDiv = document.createElement("div");
  rowNameDiv.setAttribute("style", "padding: 8px; height: 40px");
  // rowNameDiv.setAttribute("height", '40px');
  var rowName = document.createElement("a");
  rowName.innerHTML = row_name.value;
  rowNameDiv.appendChild(rowName);

  var rowAddRange = document.createElement("button");
  rowAddRange.setAttribute("id", "add_range");
  rowAddRange.innerHTML = "add range";
  rowAddRange.onclick = function(e){
    initCanvas(10, rowName.innerHTML);
    // rangeSlider.init(10);
  }
  document.getElementById('metadata_name').appendChild(rowNameDiv);
  document.getElementById('metadata_name').appendChild(rowAddRange);

  // <button id="add_range">add range</button>

  var currcanvas = document.createElement("canvas");
  currcanvas.setAttribute("id", row_name.value);
  // currcanvas.setAttribute("width", "100%");
  row_name.value = "";
  document.getElementById('metadata_timeline').appendChild(currcanvas);
}
