

function Blob (x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);

    this.brain = new NeuralNetwork(6, 16, 2)
    this.near = []

    this.speedX = 0
    this.speedY = 0
    this.update = function () {
        // var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        // newvel.setMag(3);
        // this.vel.lerp(newvel, 0.2);
        // this.pos.add(this.vel);
        // console.log(newvel);

        this.pos.x += this.speedX
        this.pos.y += this.speedY
    }

    this.move = function (x, y) {

        this.speedX = map(x, 0, 1, -1, 1, true);
        this.speedY = map(y, 0, 1, -1, 1, true);
    }

    this.mutate = function () {
        function fn (x) {
            if (random(1) < 0.05) {
                let offset = randomGaussian() * 0.5;
                let newx = x + offset;
                return newx;
            }
            return x;
        }

        let ih = this.brain.input_weights.dataSync().map(fn);
        let ih_shape = this.brain.input_weights.shape;
        this.brain.input_weights.dispose();
        this.brain.input_weights = tf.tensor(ih, ih_shape);

        let ho = this.brain.output_weights.dataSync().map(fn);
        let ho_shape = this.brain.output_weights.shape;
        this.brain.output_weights.dispose();
        this.brain.output_weights = tf.tensor(ho, ho_shape);
    }
    this.eats = function (other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        this.mutate()
        if (d < this.r + other.r) {
            var sum = PI * this.r * this.r + PI * other.r * other.r;
            // this.r = sqrt(sum / PI);
            //this.r += other.r;
            return true;
        } else {
            return false;
        }
    }
    this.getDistance = function (other) {
        let near = []
        // console.log(x, y);
        stroke(255, 0, 0)

        let data = blobs.filter((a) => dist(a.pos.x, a.pos.y, this.pos.x, this.pos.y) < this.r * 2 + 50)
        data = [data[0], data[1], data[2]]
        near.push(data[0], data[1])
        data.forEach(r => {
            if (r) {
                const { x, y } = r.pos
                line(this.pos.x, this.pos.y, x, y)

            }
        });
        this.near = near
    }
    this.show = function () {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    this.think = function () {
        let near1 = this.near[0]
        let near2 = this.near[1]
        if (!near1) {
            near1 = { pos: { x: -1, y: -1 } }
        } if (!near2) {
            near2 = { pos: { x: -1, y: -1 } }
        }


        let inputs = [
            this.pos.x / width,
            this.pos.y / height,
            near1.pos.x / width,
            near1.pos.y / height,
            near1.pos.x / width,
            near1.pos.y / height,

        ]
        let output = this.brain.predict(inputs)
        this.move(...output)

    }
}