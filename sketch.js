

var blob;
function between (x, min, max) {
  return x >= min && x <= max;
}
var blobs = [];
var zoom = 1;

function setup () {
  createCanvas(600, 600);
  blob = new Blob(0, 0, 64);
  for (var i = 0; i < 200; i++) {
    var x = random(-width, width);
    var y = random(-height, height);
    blobs[i] = new Blob(x, y, 16);
  }
  // frameRate(5)
}

function draw () {
  background(0);
  if (blob.near.every(r => r == undefined)) { blob.pos.x = 0; blob.pos.y = 0 }
  translate(width / 2, height / 2);
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  blob.think()
  blob.getDistance(blobs)
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
    if (blob.eats(blobs[i])) {
      blobs.splice(i, 1);
    }
  }


  blob.show();
  blob.update();
  text('x ' + blob.speedX, blob.pos.x, blob.pos.y - 20)
  text('y ' + blob.speedY, blob.pos.x, blob.pos.y)
}