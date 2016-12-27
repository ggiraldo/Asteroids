function GameLevel(level) {

    this.level = level || 0;
    this.ship = new Ship(width / 2, height / 2);
    this.turn = 0;
    this.thrust = 0;

    this.asteroids = [];
    this.initialAsteroids = 5 + 2*this.level;
    for (var i = 0; i < this.initialAsteroids; i++) {
        this.asteroids.push(new Asteroid());
        var speed = 1.0 + random() * this.level / 5.0;
        this.asteroids[i].particle.vel.mult(speed);
    }

    this.lasers = [];

    this.score = 0;
    this.gameOver = false;
    this.levelCleared = false;

    this.update = function () {

        this.asteroids.forEach(function (asteroid) {
            asteroid.update();
        });

        this.lasers.forEach(function (laser) {
            laser.update();
        });

        this.ship.turn(this.turn);
        this.ship.thrust(this.thrust);
        this.ship.update();

        this.laserCollision();
        this.shipCollision();

        if(this.asteroids.length == 0) {
            console.log("LEVEL " + this.level + " CLEARED");
            this.levelCleared = true;
        }
    }

    this.render = function () {
        background(0);

        this.asteroids.forEach(function (asteroid) {
            asteroid.render();
        });

        this.lasers.forEach(function (laser) {
            laser.render();
        });

        this.ship.render();

        this.renderHUD();
    }

    this.renderHUD = function () {
        push();
        textSize(30);
        fill(255);
        text("LEVEL: " + this.level, 20, 30);
        text("SCORE: " + this.score, width - 250, 30);
        textSize(20);
        text("HELP:", 20, height - 80);
        text("WASD to move,", 20, height - 50);
        text("SPACEBAR to fire.", 20, height - 20);
        if(this.gameOver) {
            textSize(40);
            fill('green');
            text("GAME OVER", width/2 - 100, height/2);
            text("PRESS FIRE TO RESTART", width/2 - 225, height/2 + 50);
        }
        pop();
    }

    this.laserCollision = function () {
        for (var i = this.lasers.length - 1; i >= 0; i--) {
            // Laser leaving screen
            if (this.lasers[i].particle.pos.x < 0 ||
                this.lasers[i].particle.pos.x > width ||
                this.lasers[i].particle.pos.y < 0 ||
                this.lasers[i].particle.pos.y > height) {
                    this.lasers.splice(i, 1);
                    continue;
            }
            // Laser - Asteroids collisions
            for (var j = this.asteroids.length - 1; j >= 0; j--) {
                if (this.lasers[i].hit(this.asteroids[j])) {
                    // Laser hits asteroid
                    this.score += 100 - this.asteroids[j].r;
                    console.log("Score: " + this.score);
                    var childs = this.asteroids[j].split();
                    this.asteroids = this.asteroids.concat(childs);
                    this.asteroids.splice(j, 1);
                    this.lasers.splice(i, 1);
                    break;
                }
            }
        }
    }

    this.shipCollision = function () {
        // Ship - Asteroid collisions
        for (var i = 0; i < this.asteroids.length; i++) {
            if (this.ship.hit(this.asteroids[i])) {
                // Game Over
                console.log("GAME OVER");
                this.gameOver = true;
            }
        }
    }

    this.fire = function () {
        this.lasers.push(new Laser(this.ship.particle.pos.x, 
                                   this.ship.particle.pos.y, 
                                   this.ship.theta));
    }

    this.keyPressed = function(key) {

        if (key == 'D') {
            this.turn = 1;
        } if (key == 'A') {
            this.turn = -1;
        } if (key == 'W') {
            this.thrust = 1;
        } if (key == 'S') {
            this.thrust = -1;
        } if (key == ' ') {
            this.fire();
        }
    }

    this.keyReleased = function() {
        this.turn = 0;
        this.thrust = 0;
    }
}