const canvas = document.getElementById('canvas');

const canvasContext = canvas.getContext('2d');
let frames = 0
var sprite = new Image()
sprite.src = "img/sprite.png"

//control game 
const state = {
    current : 0,
    getReady : 0,
    game :1, 
    gameOver : 2
}
document.addEventListener('click', function(e){
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.gameOver:
            state.current = state.getReady
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
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x, this.y, this.x +  this.w + 14, this.y)
    }
    
}
const fg = {
    sx:276,
    sy:0,
    w:224,
    h:275,
    x:0,
    y:canvas.height - 100,

    draw: function() {
        canvasContext.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.x, this.y, this.x +  this.w + 65, this.y)
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

    draw : function() {
        let bird = this.animation[this.frame]
        canvasContext.drawImage(sprite, bird.sX, bird.sY, this.w, this.h , this.x - this.w/2, this.y - this.y/2 , this.w, this.h)

    },
    update : function() {
        this.period = state.current == state.getReady ? 10 : 5

        this.frame += frames%this.period == 0 ? 1 : 0

        this.frame = this.frame%this.animation.length;
    },
    flap : function() {

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
    fg.draw()
    bird.draw()
    getReady.draw()
    gameOver.draw()
}
function update() {
    bird.update()
}
function loop() {
    update()
    frames++
    draw()
    requestAnimationFrame(loop)
}

loop();