// $('document').ready(function(){

var moreButtons = document.getElementsByName('moreKeyboardButton');
for (var i = 0; i < moreButtons.length; i++){
  moreButtons[i].addEventListener('click', function(){
    console.log(this);
    var idName = this.value;
    this.parentNode.style.display="none";
    var moreDivs = document.getElementsByName(idName);
    for (var j = 0; j < moreDivs.length; j++){
      moreDivs[j].style.display = 'block';
    }
  }, false);
}

var lessButtons = document.getElementsByName('lessKeyboardButton');
for (var i = 0; i < lessButtons.length; i++){
  lessButtons[i].addEventListener('click', function(){
    console.log(this);
    var idName = this.value;
    var moreDivs = document.getElementsByName(idName);
    for (var j = 0; j < moreDivs.length; j++){
      moreDivs[j].style.display = 'none';
    }
    document.getElementById(idName).parentNode.style.display = "block";
  }, false);
}





// });
