const canvas = document.getElementById('canvas');

const canvasContext = canvas.getContext('2d');
let frames = 0
var sprite = new Image()
sprite.src = "img/sprite.png"
const Score_S = new Audio
Score_S.src = 'audio/sfx_point.wav'
const Swoosh = new Audio
Swoosh.src = 'audio/sfx_swooshing.wav'
const Hit = new Audio
Hit.src = 'audio/sfx_hit.wav'
const Die = new Audio
Die.src = 'audio/sfx_die.wav'
const Flap = new Audio
Flap.src = 'audio/sfx_flap.wav'
//control game 
const state = {
    current : 0,
    getReady : 0,
    game :1, 
    gameOver : 2
}
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
}
const score = {
    best: parseInt(localStorage.getItem('best')) || 0,
    value: 0,
    draw: function(){
        canvasContext.fillStyle = '#FFF',
        canvasContext.strokeStyle = '#000'
        if ( state.current === state.game) {
            canvasContext.lineWidth = 2
            canvasContext.font = '35px Teko';
            canvasContext.fillText(this.value, canvas.width/2, 50)
            canvasContext.strokeText(this.value, canvas.width/2, 50)
        }else if (state.current === state.gameOver) {
            canvasContext.font = '25px Teko';
            //score
            canvasContext.fillText(this.value, 225, 186)
            canvasContext.strokeText(this.value, 225, 186)
            //best
            canvasContext.fillText(this.best, 225, 228)
            canvasContext.strokeText(this.best, 225, 228)
        }
    },
    reset : function() {
        this.value = 0
    }
}
const degree = Math.PI/180;
document.addEventListener('click', function(e){
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            Swoosh.play()
            break;
        case state.game:
            bird.flap();
            Flap.play()
            break;
        case state.gameOver:
            let rect = canvas.getBoundingClientRect();
            let clickX = e.clientX - rect.left
            let clickY = e.clientY - rect.top
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w 
                && clickY >= startBtn.y && clickY < startBtn.y + startBtn.h 
                ) {
                    state.current = state.getReady
                    pipes.reset()
                    bird.speedReset()
                    score.reset()


                }
            break;
    }
})
const bg = {
    sx:0,
    sy:0,
    w:275,
    h:226,
    x:0,
    y:canvas.height - 226,

    draw: function() {
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x , this.y, this.w, this.h)
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x + this. w, this.y, this.w, this.h)
    }
    
}
const fg = {
    sx:276,
    sy:0,
    w:224,
    h:112,
    x:0,
    y:canvas.height - 112,

    dx: 2,
    update: function() {
if (state.current == state.game) {
    this.x = (this.x - this.dx ) % (this.w / 2)
}
    },

    draw: function() {
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h)
        
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x + this. w, this.y, this.w, this.h)
    }
    
}

const pipes = {
    bottom : {
        sx: 502,
        sy: 0
    },
    top : {
        sx: 553,
        sy: 0
    },
    w: 53,
    h: 400,
    gap: 85,
    dx: 2,
    position: [],
    maxYPos : -150,
    update: function() {
        if (state.current !== state.game) return;
        if(frames % 100 == 0) {
            this.position.push(
                {
                    x: canvas.width,
                    y: this.maxYPos * (Math.random() + 1)
                })

        }
        for( let i = 0; i < this.position.length; i++){
            let p = this.position[i]
            p.x -= this.dx
            let bottomYPos = p.y + this.h + this.gap

            if (bird.x  + bird.radius > p.x && bird.x - bird.radius < p.x + this.w
                && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h
                ) {
                    state.current = state.gameOver
                    Hit.play()
                }
            if (bird.x  + bird.radius > p.x && bird.x - bird.radius < p.x + this.w
                && bird.y + bird.radius > bottomYPos && bird.y - bird.radius < bottomYPos + this.h
                ) {
                    state.current = state.gameOver
                    Hit.play()
                }
            if(p.x + this.w <= 0) {
                this.position.shift() 
                score.value += 1

                score.best = Math.max(score.value, score.best)
                localStorage.setItem('best', score.best)
                Score_S.play()
            }
        }
        

    },
    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i]
            let topYPos = p.y
            let bottomYPos = p.y + this.h + this.gap
            canvasContext.drawImage(sprite, this.top.sx, this.top.sy, this.w, this.h, p.x , topYPos, this.w, this.h)
            canvasContext.drawImage(sprite, this.bottom.sx, this.bottom.sy, this.w, this.h, p.x , bottomYPos, this.w, this.h)

        }
    },
    reset : function() {
        this.position = []
    }
}

const bird = {
    

    animation : [
        {sX:276, sY:112},
        {sX:276, sY:139},
        {sX:276, sY:164},
        {sX:276, sY:139}
    ],
    x: 50, 
    y: 250,
    w: 34,
    h: 26,

    frame : 0,
    radius: 12,
    speed : 0,
    gravity : 0.25,
    jump : 4.6,
    rotation : 0,

    draw : function() {
        let bird = this.animation[this.frame]
        
        canvasContext.save();
        
        canvasContext.translate(this.x, this.y)
        
        canvasContext.rotate(this.rotation)
        
        canvasContext.drawImage(sprite, bird.sX, bird.sY, this.w, this.h , - this.w/2, - this.h/2 , this.w, this.h)

        canvasContext.restore()
    },
    update : function() {
        
        this.period = state.current == state.getReady ? 10 : 5

        this.frame += frames%this.period == 0 ? 1 : 0

        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady) {
            this.y = 150
            this.rotation = 0 * degree
        }else {
            this.speed += this.gravity;
            this.y += this.speed

            if ( this.y + this.h/2 >= canvas.height - fg.h ) {
                this.y = canvas.height - fg.h - this.h/2
                if(state.current == state.game) {
    
                    state.current = state.gameOver
                    Die.play()
                }
            }
            if (this.speed >= this.jump) {
                this.rotation = 90 * degree
                this.frame = 1
            }else {
                this.rotation = -25 * degree
            }
        }
        // console.log(fg.h)
        // console.log(canvas.height -fg.h)
    },
    flap : function() {
        this.speed =- this.jump
    },
    speedReset : function() {
        this.speed = 0
    }
}

const getReady = {
    sx: 0,
    sy: 228,
    w: 174,
    h: 152,
    x: canvas.width/2 - 173/2,
    y: 60,

    draw : function() {
        if(state.current === state.getReady) {
            canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h , this.x, this.y, this.w, this.h)

        }

    }
}
const gameOver = {
    sx: 175,
    sy: 228,
    w: 225,
    h: 202,
    x: canvas.width/2 - 225/2,
    y: 90,

    draw : function() {
        if(state.current === state.gameOver) {
            canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h , this.x, this.y, this.w, this.h)

        }

    }
}

function draw() {
    // canvasContext.drawImage(bg, 0,0)
    canvasContext.fillStyle = '#70c5ce'
    canvasContext.fillRect(0,0, canvas.width, canvas.height)

    bg.draw()
    pipes.draw()
    fg.draw()
    bird.draw()
    getReady.draw()
    gameOver.draw()
    score.draw()
}
function update() {
    bird.update()
    fg.update();
    pipes.update()
}
function loop() {
    update()
    frames++
    draw()
    requestAnimationFrame(loop)
}

loop();