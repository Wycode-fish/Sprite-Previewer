// CONSTANTS
var sheetWidth = 500;
var spriteSize = 32;
var showSizeFactor = 10;
var showPositionX;
var showPositionY;
var selectSizeFactor = 2;
var isSameImg = false;
var fps = 10;
var fpsRatio = 6;


// GLOBAL VARIABLES
var bkgColor = '#00000050';
var sheet;
var clips = [];
var frameList;
var selectedFrames = [];
var modal;
var selectedIdxs = [];
var mainPage;
var frameIdx = 0;


// // BUTTOM INITIALIZATION
// $('.fps-button').prop('disabled', true);
// $('.select-frame-button').prop('disabled', true);

let main = function(p) {


	p.preload = function() {
		$('.save-frame-button').prop('disabled', true);
		$('.select-frame-button').prop('disabled', true);
	}

	p.setup = function() {
		var canvas = p.createCanvas(sheetWidth, sheetWidth);
		p.background(bkgColor);
		canvas.parent('canvas-container');

		if ($(".fps-input").val()){
			console.log("setup fps set.");
			p.frameRate($(".fps-input").val());
		}

	}


	p.draw = function() {

		if (p.frameCount%fpsRatio == 0){

			if(sheet) {
				clips = getClips();
			}

			if (selectedFrames.length!=0) {
				p.clear();
				p.background(bkgColor);
				showSizeFactor = $('.preview-size-select').val();

				initShowPosition();

				let currentFrame = selectedFrames[frameIdx];

				currentFrame.resize( spriteSize*showSizeFactor, spriteSize*showSizeFactor );
				p.image(currentFrame, showPositionX, showPositionY);

				frameIdx += 1;
				frameIdx = frameIdx % selectedFrames.length;
			}
		}
	}
}

mainPage = new p5(main, 'canvas-container');




// MODAL BUILD
function initFrameList() {

	if(isSameImg) {
		console.log("NO NEED TO RE-INITIALIZE MODAL.");
	}
	else{
			modal = function(p) {

			var canvas;

			p.preload = function() {}

			p.setup = function() {
				canvas = p.createCanvas(1600, spriteSize*selectSizeFactor);
				p.background(255, 255, 255);
				// canvas.parent('canvas-container');
				console.log(clips.length);
				if (sheet) {
					if (clips.length!=0){
						for (let i=0; i<clips.length; i++) {
							let curr = clips[i];
							curr.resize(spriteSize*selectSizeFactor, spriteSize*selectSizeFactor);
							p.image(curr, i*spriteSize*selectSizeFactor, 0);
						}
					}
				}
			}

			p.draw = function() {

				// let onIdx = p.mouseX / spriteSize;
				// if (p.)
				// p.rect(onIdx*spriteSize, 0, spriteSize, spriteSize, 10, 10);

				// canvas.mouseOver(function() {
				// 	let onIdx = Math.round(p.mouseX / spriteSize);
				// 	console.log(onIdx);
				// 	p.stroke('#fae');
				// 	p.strokeWeight(2);
				// 	p.noFill();
				// 	p.rect(onIdx*spriteSize, 0, spriteSize, spriteSize, 10, 10);
			
				// });


				// canvas.mouseOut(function() {
				// 	p.stroke(255,204,0,5);
				// 	p.strokeWeight(2);
				// 	p.noFill();
				// 	p.rect(onIdx*spriteSize, 0, spriteSize, spriteSize, 10, 10);

				// })

				canvas.mouseClicked(function() {
					if (p.mouseX <= 1600 && p.mouseX >= 0 && 
						p.mouseY>=0 && p.mouseY<=2*spriteSize) {

						let onIdx = Math.round(p.mouseX / (spriteSize*2));
						selectedIdxs.push(onIdx);

						p.stroke(255,204,0,150);
						p.strokeWeight(3);
						p.noFill();
						p.rect(onIdx*spriteSize*selectSizeFactor, 0, 
								spriteSize*selectSizeFactor, spriteSize*selectSizeFactor, 
								10, 10);
					}
				});
			}

			// function mouseMoved() {
			// 	if (p.mouseX <= 800 && p.mouseX >= 0 && 
			// 			p.mouseY>=0 && p.mouseY<=spriteSize) {
			// 		let onIdx = Math.round(p.mouseX / spriteSize);
			// 		temp.push(onIdx);
			// 		p.stroke(255,204,0,5);
			// 		p.strokeWeight(2);
			// 		p.noFill();
			// 		p.rect(onIdx*spriteSize, 0, spriteSize, spriteSize, 10, 10);
			// 	}
			// }

		}

		frameList = new p5(modal, 'frame-list');
		isSameImg = true;
	}
	

}


function clearFrames() {
	frameList.background(255, 255, 255);
	frameIdx = 0;
	if (clips.length!=0){
		for (let i=0; i<clips.length; i++) {
			let curr = clips[i];
			curr.resize(spriteSize*selectSizeFactor, spriteSize*selectSizeFactor);
			frameList.image(curr, i*spriteSize*selectSizeFactor, 0);
		}
	}

	selectedIdxs = [];
}


function submitSelected () {

	console.log("submit selected, selectedIdxs's length:"+selectedIdxs.length);
	console.log("submit selected, clips's length:"+clips.length);
	selectedFrames = [];
	frameIdx = 0;
	for (var i=0; i<clips.length; i++) {
		for (var j=0; j<selectedIdxs.length; j++) {
			if (i == selectedIdxs[j]) {
				console.log("hit idx: "+i);
				//let resized = clips[i].resize(320, 320);
				selectedFrames.push(clips[i]);
			}
		}
	}
	$('.save-frame-button').prop('disabled', false);

	clearFrames();
}


function getClips () {

	let w = sheet.width;
	// if sheet width smaller than unit size, why make clips?
	if (w<=spriteSize) return [sheet];

	let spriteList = [];

	for (let i=0; i<w; i+=spriteSize) {
		for (let j=0; j<w; j+=spriteSize) {
			let clip = sheet.get(i, j, spriteSize, spriteSize);
			spriteList.push(clip);
		}
	}
	return spriteList;
}


function getSpriteSize() {
	spriteSize = $('.sprite-size-input').val();
	mainPage.clear();
	mainPage.background(bkgColor);
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
        	mainPage.clear();
        	mainPage.background(bkgColor);
        	console.log("reader");
        	sheet = mainPage.loadImage(e.target.result);
        	isSameImg = false;
            $('.thumb').attr('src', e.target.result);
            $('.select-frame-button').prop('disabled', false);
        }
        reader.readAsDataURL(input.files[0]);
    }
}


function setFPS () {
	console.log("set frameRate: "+$('.fps-input').val());
	fps = $('.fps-input').val();
	fpsRatio = 60/fps;
}

function saveFrames () {

	for (var i=0; i<selectedFrames.length; i++) {
		let timestamp = Math.floor(Date.now()/1000);
		let filename = "clip_"+timestamp+"_"+i+".png";
		console.log("filename:"+ filename);
		mainPage.save(selectedFrames[i], filename);
	}
}

function initShowPosition () {
	showPositionX = (sheetWidth - spriteSize*showSizeFactor)/2;
	showPositionY = showPositionX;
}


function setBkgColor () {
	console.log("set color: "+ $('.bkg-color-input').val());
	bkgColor = $('.bkg-color-input').val();
}

function resetBkgColor () {
	bkgColor = '#FFFFFF';
}
