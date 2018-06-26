var width = $(window).width();
var height = $(window).height();

function setup() {
	createCanvas(width, height);
	frameRate(30);
}

function draw() {

}

var img;
	function preload() {
		img = loadImage('images/backdrop.jpg');
	}
	function setup() {
		image(img, 0, 0);
	}
