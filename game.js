// Canvas 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 변수
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let animationId;

// 헬리콥터 설정
const helicopter = {
    x: 100,
    y: canvas.height / 2,
    width: 60,
    height: 30,
    velocity: 0,
    gravity: 0.4,
    lift: -8,
    rotation: 0
};

// 장애물 배열
let obstacles = [];
const obstacleWidth = 80;
const obstacleGap = 200;
const obstacleSpeed = 3;

// 게임 상태
let frameCount = 0;

// UI 요소
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// 최고 점수 표시
highScoreElement.textContent = highScore;

// 이벤트 리스너
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        helicopter.velocity = helicopter.lift;
    }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// 헬리콥터 그리기
function drawHelicopter() {
    ctx.save();
    ctx.translate(helicopter.x + helicopter.width / 2, helicopter.y + helicopter.height / 2);

    // 회전 효과 (속도에 따라)
    const rotation = Math.min(Math.max(helicopter.velocity * 0.05, -0.5), 0.5);
    ctx.rotate(rotation);

    // 헬리콥터 몸체
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-helicopter.width / 2, -helicopter.height / 2, helicopter.width, helicopter.height);

    // 헬리콥터 창문
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(-helicopter.width / 2 + 10, -helicopter.height / 2 + 5, 25, 20);

    // 헬리콥터 꼬리
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(helicopter.width / 2 - 10, -5, 20, 10);

    // 프로펠러
    const propellerSpeed = gameRunning ? frameCount * 0.5 : 0;
    ctx.save();
    ctx.translate(0, -helicopter.height / 2 - 5);
    ctx.rotate(propellerSpeed);
    ctx.fillStyle = '#333';
    ctx.fillRect(-30, -2, 60, 4);
    ctx.fillRect(-2, -30, 4, 60);
    ctx.restore();

    ctx.restore();
}

// 장애물 생성
function createObstacle() {
    const minHeight = 50;
    const maxHeight = canvas.height - obstacleGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    obstacles.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + obstacleGap,
        bottomHeight: canvas.height - (topHeight + obstacleGap),
        passed: false
    });
}

// 장애물 그리기
function drawObstacles() {
    obstacles.forEach(obstacle => {
        // 위쪽 종유석
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(obstacle.x, 0);
        ctx.lineTo(obstacle.x + obstacleWidth, 0);
        ctx.lineTo(obstacle.x + obstacleWidth, obstacle.topHeight - 10);
        ctx.lineTo(obstacle.x + obstacleWidth / 2, obstacle.topHeight);
        ctx.lineTo(obstacle.x, obstacle.topHeight - 10);
        ctx.closePath();
        ctx.fill();

        // 위쪽 종유석 디테일
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < 3; i++) {
            const x = obstacle.x + (obstacleWidth / 4) * (i + 0.5);
            ctx.fillRect(x, 0, 5, obstacle.topHeight * 0.7);
        }

        // 아래쪽 석순
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(obstacle.x, canvas.height);
        ctx.lineTo(obstacle.x + obstacleWidth, canvas.height);
        ctx.lineTo(obstacle.x + obstacleWidth, obstacle.bottomY + 10);
        ctx.lineTo(obstacle.x + obstacleWidth / 2, obstacle.bottomY);
        ctx.lineTo(obstacle.x, obstacle.bottomY + 10);
        ctx.closePath();
        ctx.fill();

        // 아래쪽 석순 디테일
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < 3; i++) {
            const x = obstacle.x + (obstacleWidth / 4) * (i + 0.5);
            ctx.fillRect(x, obstacle.bottomY + obstacle.bottomHeight * 0.3, 5, obstacle.bottomHeight * 0.7);
        }
    });
}

// 장애물 업데이트
function updateObstacles() {
    if (frameCount % 90 === 0) {
        createObstacle();
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;

        // 점수 증가
        if (!obstacle.passed && obstacle.x + obstacleWidth < helicopter.x) {
            obstacle.passed = true;
            score++;
            scoreElement.textContent = score;
        }
    });

    // 화면 밖으로 나간 장애물 제거
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);
}

// 충돌 감지
function checkCollision() {
    // 천장과 바닥 충돌
    if (helicopter.y <= 0 || helicopter.y + helicopter.height >= canvas.height) {
        return true;
    }

    // 장애물 충돌
    for (let obstacle of obstacles) {
        if (helicopter.x + helicopter.width > obstacle.x &&
            helicopter.x < obstacle.x + obstacleWidth) {
            if (helicopter.y < obstacle.topHeight ||
                helicopter.y + helicopter.height > obstacle.bottomY) {
                return true;
            }
        }
    }

    return false;
}

// 헬리콥터 업데이트
function updateHelicopter() {
    helicopter.velocity += helicopter.gravity;
    helicopter.y += helicopter.velocity;
}

// 배경 그리기
function drawBackground() {
    // 하늘
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 구름
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const cloudOffset = (frameCount * 0.5) % (canvas.width + 200);
    drawCloud(cloudOffset - 200, 100);
    drawCloud(cloudOffset + 200, 180);
    drawCloud(cloudOffset + 600, 120);
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.fill();
}

// 게임 루프
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    updateHelicopter();
    updateObstacles();
    drawObstacles();
    drawHelicopter();

    // 충돌 체크
    if (checkCollision()) {
        gameOver();
        return;
    }

    frameCount++;
    animationId = requestAnimationFrame(gameLoop);
}

// 게임 시작
function startGame() {
    gameRunning = true;
    score = 0;
    frameCount = 0;
    obstacles = [];
    helicopter.y = canvas.height / 2;
    helicopter.velocity = 0;

    scoreElement.textContent = score;
    document.querySelector('.instructions').style.display = 'none';

    gameLoop();
}

// 게임 재시작
function restartGame() {
    gameOverElement.classList.remove('show');
    startGame();
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    // 최고 점수 업데이트
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }

    finalScoreElement.textContent = score;
    gameOverElement.classList.add('show');
}

// 초기 화면 그리기
drawBackground();
drawHelicopter();
