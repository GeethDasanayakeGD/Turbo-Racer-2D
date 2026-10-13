const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const finalScoreEl = document.getElementById("finalScore");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// Game State
let isPlaying = false;
let score = 0;
let highScore = localStorage.getItem("turboHighScore") || 0;
highScoreEl.textContent = highScore;

let gameSpeed = 5;
let roadOffset = 0;

// Player Car
let car = {
    x: 190,
    y: 510,
    width: 46,
    height: 85,
    speed: 6,
    color: "#00f2fe"
};

// Controls
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    KeyA: false,
    KeyD: false
};

let obstacles = [];
let particles = [];

// Audio Context for sound effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioCtx) return;
    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'crash') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } else if (type === 'score') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    } catch (e) {
        // Ignore audio errors if blocked
    }
}

// Event Listeners
window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
    initAudio();
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    
    // Reset variables
    score = 0;
    scoreEl.textContent = score;
    gameSpeed = 5;
    obstacles = [];
    particles = [];
    car.x = 190;
    isPlaying = true;
    
    loop();
}

function gameOver() {
    isPlaying = false;
    playSound('crash');
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("turboHighScore", highScore);
        highScoreEl.textContent = highScore;
    }
    
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove("hidden");
}

// Spawn Obstacle Cars
function spawnObstacle() {
    if (Math.random() < 0.022) {
        let lanes = [65, 175, 285, 395]; // X coordinates for lanes
        let laneWidth = 46;
        let randomLaneX = lanes[Math.floor(Math.random() * 3)]; // Keep within road boundaries
        
        let colors = ["#ff416c", "#ff9900", "#7f00ff", "#00ffcc"];
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        obstacles.push({
            x: randomLaneX,
            y: -100,
            width: 46,
            height: 85,
            speed: gameSpeed * 0.6,
            color: randomColor
        });
    }
}

// Update game logic
function update() {
    if (!isPlaying) return;

    // Increase difficulty gradually
    gameSpeed += 0.001;
    roadOffset += gameSpeed;
    if (roadOffset > 40) roadOffset = 0;

    // Player movement
    let roadLeftBoundary = 40;
    let roadRightBoundary = canvas.width - 40 - car.width;

    if ((keys.ArrowLeft || keys.KeyA) && car.x > roadLeftBoundary) {
        car.x -= car.speed;
        addParticle(car.x + car.width/2, car.y + car.height);
    }
    if ((keys.ArrowRight || keys.KeyD) && car.x < roadRightBoundary) {
        car.x += car.speed;
        addParticle(car.x + car.width/2, car.y + car.height);
    }

    // Spawn obstacles
    spawnObstacle();

    // Update Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.y += gameSpeed - obs.speed; // Relative speed

        // Collision Check (AABB)
        if (
            car.x < obs.x + obs.width &&
            car.x + car.width > obs.x &&
            car.y < obs.y + obs.height &&
            car.y + car.height > obs.y
        ) {
            gameOver();
            return;
        }

        // Off screen check
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreEl.textContent = score;
            if (score % 50 === 0) playSound('score');
        }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.y += gameSpeed;
        p.alpha -= 0.05;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

function addParticle(x, y) {
    particles.push({
        x: x + (Math.random() * 10 - 5),
        y: y,
        radius: Math.random() * 3 + 1,
        alpha: 0.6
    });
}

// Drawing Functions
function drawCar(x, y, width, height, color, isPlayer = false) {
    ctx.save();
    
    // Car Body Shadow
    ctx.shadowColor = color;
    ctx.shadowBlur = isPlayer ? 15 : 5;

    // Main Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();

    // Windshield
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 6, y + 20, width - 12, 18);
    
    // Rear window
    ctx.fillRect(x + 8, y + 55, width - 16, 12);

    // Headlights / Taillights
    if (isPlayer) {
        ctx.fillStyle = "#00ffff"; // Headlights
        ctx.fillRect(x + 4, y, 8, 4);
        ctx.fillRect(x + width - 12, y, 8, 4);
    } else {
        ctx.fillStyle = "#ff0055"; // Taillights
        ctx.fillRect(x + 4, y, 8, 4);
        ctx.fillRect(x + width - 12, y, 8, 4);
    }

    // Wheels
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 5, y + 12, 5, 18);
    ctx.fillRect(x + width, y + 12, 5, 18);
    ctx.fillRect(x - 5, y + 55, 5, 18);
    ctx.fillRect(x + width, y + 55, 5, 18);

    ctx.restore();
}

function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grass / Side Background
    ctx.fillStyle = "#1b4d3e";
    ctx.fillRect(0, 0, 40, canvas.height);
    ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);

    // Draw Road
    ctx.fillStyle = "#222";
    ctx.fillRect(40, 0, canvas.width - 80, canvas.height);

    // Road side borders (Red & White stripes)
    let stripeHeight = 30;
    let totalStripes = canvas.height / stripeHeight + 2;
    for (let i = -1; i < totalStripes; i++) {
        let stripeY = (i * stripeHeight) + (roadOffset % stripeHeight);
        ctx.fillStyle = (i % 2 === 0) ? "#fff" : "#ff3333";
        ctx.fillRect(35, stripeY, 5, stripeHeight);
        ctx.fillRect(canvas.width - 40, stripeY, 5, stripeHeight);
    }

    // Center Dashed Lanes
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 4;
    ctx.setLineDash([25, 25]);
    ctx.lineDashOffset = -roadOffset;

    // Lane divider 1
    ctx.beginPath();
    ctx.moveTo(156, 0);
    ctx.lineTo(156, canvas.height);
    ctx.stroke();

    // Lane divider 2
    ctx.beginPath();
    ctx.moveTo(293, 0);
    ctx.lineTo(293, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]); // Reset

    // Draw Particles (Dust)
    for (let p of particles) {
        ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Obstacles
    for (let obs of obstacles) {
        drawCar(obs.x, obs.y, obs.width, obs.height, obs.color, false);
    }

    // Draw Player Car
    drawCar(car.x, car.y, car.width, car.height, car.color, true);
}

// Game Loop
function loop() {
    update();
    draw();
    if (isPlaying) {
        requestAnimationFrame(loop);
    }
}