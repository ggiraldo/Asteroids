function Asteroid(x, y, r) {

    this.rMin = 15;
    this.rMax = 120;
    this.r = r || floor(random(this.rMin, this.rMax));
    this.particle = new Particle(width/2, height/2);

    // Avoid asteroids from spawning at center,
    // so no initial collission happens.
    var d = dist(width/2, height/2, this.particle.pos.x, this.particle.pos.y);
    var dMin = 1.2*(this.r + 50);
    if(x && y) {
        this.particle.pos.x = x;
        this.particle.pos.y = y;
    } else {
        while(d < dMin) {
            this.particle.pos.x = random(width);
            this.particle.pos.y = random(height);
            d = dist(width/2, height/2, this.particle.pos.x, this.particle.pos.y);
        }
    }

    this.particle.vel = p5.Vector.random2D();
    this.corners = floor(random(5,9));
    
    this.radii = [];
    for(var i = 0; i < this.corners; i++) {
        this.radii.push(random(0.8*this.r, 1.2*this.r));
    }

    this.update = function() {
        this.particle.update();
        this.particle.edges();
    }

    this.render = function() {
        push();
        stroke(255);
        fill(51);
        translate(this.particle.pos.x, this.particle.pos.y);
        beginShape();
        for(var i = 0; i < this.corners; i++) {
            var angle = map(i, 0, this.corners, 0, TWO_PI);
            var radius = this.radii[i];
            var x = radius * cos(angle);
            var y = radius * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        // Draw collision circle
        // noFill();
        // ellipse(0, 0, 2*this.r);
        pop();
    }

    this.split = function() {
        var childs = [];
        var rNew = floor(this.r / 2);
        var vNew = this.particle.vel.mag() * 2.0; // factor between 2.0 and 4.0

        if(rNew > this.rMin){
            childs.push(new Asteroid(this.particle.pos.x, this.particle.pos.y, rNew));
            childs.push(new Asteroid(this.particle.pos.x, this.particle.pos.y, rNew));
            childs[0].particle.vel.setMag(vNew);
            childs[1].particle.vel.setMag(vNew);
        }
        return childs;
    }
}