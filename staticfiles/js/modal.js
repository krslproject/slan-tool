// 1ST PAGE:
const nextBtnOne = document.getElementById('next-one');
const playTwo = document.getElementById('pageTwoVideo');

nextBtnOne.addEventListener("click", function () {
   $('#welcomingOne').modal('hide');
   $('#welcomingTwo').modal('show');
   
  
   playTwo.autoplay = true;
   playTwo.load();
   // same as playTwo.play();

});



// 2ND PAGE:
const backBtnTwo = document.getElementById('back-two');
const playThree = document.getElementById('pageThreeVideo');


backBtnTwo.addEventListener("click", function () {
   $('#welcomingTwo').modal('hide');
   $('#welcomingOne').modal('show');
});


const nextBtnTwo = document.getElementById('next-two');

nextBtnTwo.addEventListener("click", function () {
   $('#welcomingTwo').modal('hide');
   $('#welcomingThree').modal('show');

   playThree.play();
});



// 3RD PAGE:
const backBtnThree = document.getElementById('back-three');
const playFour = document.getElementById('pageFourVideo');

backBtnThree.addEventListener("click", function () {
   $('#welcomingThree').modal('hide');
   $('#welcomingTwo').modal('show');
});


const nextBtnThree = document.getElementById('next-three');

nextBtnThree.addEventListener("click", function () {
   $('#welcomingThree').modal('hide');
   $('#welcomingFour').modal('show');

   playFour.play();
});




// 4TH PAGE:
const backBtnFour = document.getElementById('back-four');
const playFive = document.getElementById('pageFiveVideo');

backBtnFour.addEventListener("click", function () {
   $('#welcomingFour').modal('hide');
   $('#welcomingThree').modal('show');
});

const nextBtnFour = document.getElementById('next-four');

nextBtnFour.addEventListener("click", function () {
   $('#welcomingFour').modal('hide');
   $('#welcomingFive').modal('show');

   playFive.play();
});


// 5TH PAGE:
const backBtnFive = document.getElementById('back-five');

backBtnFive.addEventListener("click", function () {
   $('#welcomingFive').modal('hide');
   $('#welcomingFour').modal('show');
});