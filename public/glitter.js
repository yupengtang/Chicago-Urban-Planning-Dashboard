// Taken from bgaard.dk

particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0
};

particles={
    THICKNESS : Math.pow(110, 2),
    BASENUMPARTICLES: 30,
    NUM_PARTICLES: 0,
    OFFSET: 50,
    DRAG: 0.9,
    EASE: 0.1,
    list : [],
    mx: -100,
    my: -100,
    SPACING: 90,
    BASERGB: [5,5,5],
    RANDOMSWITCHRGB: [90,255,90],
    ALPHA: 255,
    running: false,

    init: function(containerId) {
        container = document.getElementById(containerId);
        if (container.childElementCount > 0){
            container.removeChild(container.children[0])
            return
        }
        
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        man = false;
        tog = true;
        
        container.appendChild(canvas);
        particles.recalculate();
        running = true;
        particles.step();

        window.addEventListener("mousemove", particles.mouseMove);
        window.addEventListener("resize",  particles.recalculate);
        w = canvas.width = Math.floor(container.offsetWidth);
        h = canvas.height = Math.floor(container.offsetHeight);
    },
    recalculate: function(){
        w = canvas.width = Math.floor(container.offsetWidth);
        h = canvas.height = Math.floor(container.offsetHeight);
        particles.NUM_PARTICLES = (w + h) * particles.BASENUMPARTICLES;
        list = []
        for (i = 0; i < particles.NUM_PARTICLES; i++) {
            p = Object.create(particle);
            p.x = p.ox = Math.floor(Math.random() * (w + 1));
            p.y = p.oy = Math.floor(Math.random() * (h + 1));
            index =  i;
            list[index] = p;
        }
        console.log(particles.NUM_PARTICLES)
    },
    step: function(){
            if ( canvas.height != Math.floor(container.offsetHeight ||
                 canvas.width  != Math.floor(container.offsetWidth))){
                this.recalculate();
            }

            if (tog = !tog) {
              for (i = 0; i < particles.NUM_PARTICLES; i++) {
                p = list[i];
                d = (dx = particles.mx - p.x) * dx + (dy = particles.my - p.y) * dy;
                f = -particles.THICKNESS / d;
                if (d < particles.THICKNESS) {
                  t = Math.atan2(dy, dx);
                  p.vx += f * Math.cos(t);
                  p.vy += f * Math.sin(t);
                }
                p.x += (p.vx *= particles.DRAG) + (p.ox - p.x) * particles.EASE;
                p.y += (p.vy *= particles.DRAG) + (p.oy - p.y) * particles.EASE;
              }
            } else {
              b = (a = ctx.createImageData(w, h)).data;
              for (i = 0; i < particles.NUM_PARTICLES; i++) {
                p = list[i];
                n = (~~p.x + ~~p.y * w) * 4;
        
                b[n]        = this.getColour.r(); // r
                b[n + 1]    = this.getColour.g(); // g
                b[n + 2]    = this.getColour.b(); // b
                b[n + 3]    = 255; // this.getColour.alph(); // alpha
              }
              ctx.putImageData(a, 0, 0);
            }
            requestAnimationFrame(function(){particles.step()});
        
    },
    mouseMove: function(e){
        bounds = container.getBoundingClientRect();
        particles.mx = e.clientX - bounds.left;
        particles.my = e.clientY - bounds.top;
    },
    getColour:{
        r: function(){
            return particles.BASERGB[0] + Math.floor(Math.random() * particles.RANDOMSWITCHRGB[0]);
        },
        g: function(){
            return particles.BASERGB[1] + Math.floor(Math.random() * particles.RANDOMSWITCHRGB[1]);
        },
        b: function(){
            return particles.BASERGB[2] + Math.floor(Math.random() * particles.RANDOMSWITCHRGB[2]);
        },
        alph: function(){
            return particles.ALPHA;
        }
    },
    shutdown: function(){
        window.removeEventListener("resize",  particles.recalculate);
        window.removeEventListener("mousemove",  particles.mouseMove);
        container.removeChild(canvas);
        running= false;
        app.clearScripts();
    }
};
