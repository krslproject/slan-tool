//added on 20/12/2022

let efRight = true; // initially we see ext Finger orientations only for the right hand

// const efRight = document.getElementById('ef-rlbtn-right');
// const efLeft = document.getElementById('ef-rlbtn-left');

$('#ef-rlbtn-left').click(function() { // on clicking 'Left' btn when in ext Finger keyboard, 
   if (efRight === true) { // if before it was showing right hands
      $(this).toggleClass('rl-o-btn rl-btn'); // switch to left hand
      $('#ef-rlbtn-right').toggleClass('rl-btn rl-o-btn');
      efRight = false; // now, the 'Left' mode is on, so right=false

      //since the keyboard of ef-right hand is by default shown, 
      //now we want to hide it and display keyboard for the left hand:
      $('#ef-rh-div').hide(); // makes keyboard of ef-right hand display: none;
      $('#ef-lh-div').show(); // makes keyboard of ef-left hand display: block;
   }
});

$('#ef-rlbtn-right').click(function() { // on clicking 'Right' btn when in ext Finger keyboard, 
   if (efRight === false) { // if before it was showing left hands
      $(this).toggleClass('rl-o-btn rl-btn'); // switch to right hand
      $('#ef-rlbtn-left').toggleClass('rl-btn rl-o-btn');
      efRight = true; // now, the 'Right' mode is on, so right=true

      $('#ef-lh-div').hide(); // similiarly as above
      $('#ef-rh-div').show();
   }
});


// same for palm orientation keyboard:

let palmRight = true;

$('#palm-rlbtn-left').click(function() {
   if (palmRight === true) {
      $(this).toggleClass('rl-o-btn rl-btn');
      $('#palm-rlbtn-right').toggleClass('rl-btn rl-o-btn');
      palmRight = false;

      $('#palm-rh-div').hide();
      $('#palm-lh-div').show();
   }
});

$('#palm-rlbtn-right').click(function() {
   if (palmRight === false) {
      $(this).toggleClass('rl-o-btn rl-btn');
      $('#palm-rlbtn-left').toggleClass('rl-btn rl-o-btn');
      palmRight = true;

      $('#palm-lh-div').hide();
      $('#palm-rh-div').show();
   }
});
