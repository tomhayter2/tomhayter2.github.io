let gameUnlocked = false;

// Define showDesktopMessage in the global scope
function showDesktopMessage() {
    console.log('Showing desktop message');
    // Hide the Laylo gate and game canvas
    const layloGate = document.getElementById('layloGate');
    if (layloGate) layloGate.style.display = 'none';

    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) gameCanvas.style.display = 'none';

    // Create and display the desktop message
    const desktopMessage = document.createElement('div');
    desktopMessage.id = 'desktopMessage';
    desktopMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1E90FF;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 24px;
        text-align: center;
        padding: 20px;
        z-index: 9999;
    `;
    desktopMessage.textContent = 'This game is only playable on mobile devices.';
    document.body.appendChild(desktopMessage);

    console.log('Desktop message should be displayed now');
}

function isMobileDevice() {
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    console.log('Is mobile device?', isMobileDevice());
    if (!isMobileDevice()) {
        console.log('Not a mobile device, showing desktop message');
        showDesktopMessage();
        return;
    }

    const layloGate = document.getElementById('layloGate');
    const layloForm = document.getElementById('layloForm');
    const skipButton = document.querySelector('.skip-signup');  // Changed this line

    layloForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('layloEmail').value;
        subscribeToLaylo(email);
    });

    skipButton.addEventListener('click', function(e) {  // Added 'e' parameter
        e.preventDefault();  // Added this line
        console.log('Skipped Laylo form (for testing)');
        unlockGame();
    });

    function subscribeToLaylo(email) {
        fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // Handle successful subscription (e.g., unlock game)
            unlockGame();
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle the error (e.g., show an error message to the user)
            alert('Failed to subscribe: ' + (error.error || error.message || 'Unknown error'));
        });
    }

    function unlockGame() {
        gameUnlocked = true;
        layloGate.style.display = 'none';
        initGame();
    }
});

function removeClickableAreas() {
    const clickableAreas = document.querySelectorAll('a[style*="position: absolute"]');
    clickableAreas.forEach(area => area.remove());
}

function initGame() {
    console.log('initGame called');
    if (!isMobileDevice()) {
        console.log('Not a mobile device, showing desktop message from initGame');
        showDesktopMessage();
        return;
    }

    if (!gameUnlocked) {
        console.log('Game is locked. Please sign up to play.');
        return;
    }

    console.log('Initializing game');
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    if (!isMobileDevice()) {
        drawDesktopMessage();
        return;
    }
    
    // Rest of the initGame function...
}

// Modify the existing initGame function
function initGame() {
    console.log('initGame called');
    if (!isMobileDevice()) {
        console.log('Not a mobile device, showing desktop message from initGame');
        showDesktopMessage();
        return;
    }

    if (!gameUnlocked) {
        console.log('Game is locked. Please sign up to play.');
        return;
    }

    console.log('Initializing game');
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    if (!isMobileDevice()) {
        drawDesktopMessage();
        return;
    }
    
    // Rest of the initGame function...
}

// Remove or comment out this line if it exists
// document.addEventListener('DOMContentLoaded', initGame);

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message, source, lineno, colno, error);
    alert('An error occurred: ' + message);
    return true;
};

// Constants
const BASE_WIDTH = 360, BASE_HEIGHT = 640, PADDING = 20;
const SPEED_INCREASE_INTERVAL = 2.5, SPEED_INCREASE_AMOUNT = 0.12;
const MAX_GAME_SPEED = 10.0; // Add this line
const MAX_COINS = 4; // Reduced from 10 to 8
const MAX_CLOUDS = 4; // Reduced from 6 to 5
const MAX_LIVES = 3;
const COIN_SPAWN_INTERVAL = 5, CLOUD_SPAWN_INTERVAL = 15;
const PLAYER_ACCELERATION = 600, MAX_PLAYER_SPEED = 300;
const COIN_SPEED = 80, CLOUD_SPEED = 40, INVINCIBLE_DURATION = 2000;
const FONT_SIZES = { LARGE: 30, MEDIUM: 24, SMALL: 18 };
const COIN_SPAWN_DELAY = 10; // in milliseconds
const CLOUD_SPAWN_DELAY = 3000; // in milliseconds
const SOUND_VOLUMES = {
    BACKGROUND_MUSIC: 0.6,
    COLLECT: 0.3,
    CLOUD_HIT: 0.5,
    GAME_OVER: 0.3
};
const BUTTON_STYLE = {
    FILL: '#84b5f9',  // Light blue
    STROKE: 'black',
    TEXT: 'white',
    FONT: 'GameFont',
    PADDING: {
        X: 10,
        Y: 5  // Half of the horizontal padding
    },
    CORNER_RADIUS: 2
};

// Add this constant near the top of your file with other constants
const UI_VERTICAL_OFFSET = 40; // Adjust this value to move the UI up or down

// Asset path
const assetPath = './assets/';

// Global variables
let isFirstPlay = true;
let tutorialShown = false;
let startScreenShown = false;
let canvas, ctx, SCALE_FACTOR = 1, OFFSET_X = 0, OFFSET_Y = 0;
let player, coins = [], clouds = [], score = 0, highScore = 0;
let playerImg, coinImg, cloudImages, heartImg, collectSound, gameOverSound, cloudHitSound;
let gameSpeed = 0.7, gameTime = 0, playerVelocityX = 0, lives = MAX_LIVES, invincibleTime = 0;
let lastTimestamp = 0, lastCoinSpawnTime = 0, lastCloudSpawnTime = 0;
let fontLoaded = false, touchStartX = 0;
let backgroundMusic = { audio: null, playing: false };
let cameraY = 0;
const CAMERA_LERP = 0.1; // Adjust this value to change how quickly the camera follows the player


// Add these near the top of your file with other global variables
let totalAssets = 0;
let loadedAssets = 0;
let loadingProgress = 0;
let DEBUG_HITBOXES = false; // Set to false to hide hitboxes
let backgroundMusicStarted = false;
let freefallLink = null;
let submitHighScoreLink = null;

// Asset sources
const imageSources = {
    player: `${assetPath}images/player.png`,
    coin: `${assetPath}images/coin.png`,
    cloud1: `${assetPath}images/cloud1.png`,
    cloud2: `${assetPath}images/cloud2.png`,
    cloud3: `${assetPath}images/cloud3.png`,
    cloud4: `${assetPath}images/cloud4.png`,
    heart: `${assetPath}images/heart.png`,
    logo: `${assetPath}images/logo.png`
};

const audioSources = {
    collect: `${assetPath}sounds/collect.mp3`,
    gameOver: `${assetPath}sounds/game_over.mp3`,
    cloudHit: `${assetPath}sounds/cloud_hit.mp3`,
    backgroundMusic: `${assetPath}sounds/background_music.mp3`
};

const POOL_SIZE = 50;
const coinPool = [];
const cloudPool = [];

// Define the assets object at the top of your file with other global variables
let assets = {};

const audioElements = {};

const AudioEngine = {
    context: null,
    buffers: {},
    sources: {},

    init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch(e) {
            console.warn('Web Audio API is not supported in this browser');
        }
    },

    loadSound(name, url) {
        return new Promise((resolve, reject) => {
            if (!this.context) {
                console.warn('AudioContext not initialized. Skipping sound loading.');
                resolve();
                return;
            }
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    this.buffers[name] = audioBuffer;
                    resolve();
                })
                .catch(error => {
                    console.error(`Error loading sound ${name}:`, error);
                    reject(error);
                });
        });
    },

    playSound(name, loop = false) {
        if (this.buffers[name] && this.context) {
            const source = this.context.createBufferSource();
            source.buffer = this.buffers[name];
            source.connect(this.context.destination);
            source.loop = loop;
            source.start(0);
            this.sources[name] = source;
        }
    },

    stopSound(name) {
        if (this.sources[name]) {
            this.sources[name].stop();
            delete this.sources[name];
        }
    },

    setVolume(name, volume) {
        if (this.sources[name] && this.context) {
            const gainNode = this.context.createGain();
            this.sources[name].disconnect();
            this.sources[name].connect(gainNode);
            gainNode.connect(this.context.destination);
            gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        }
    }
};

function initObjectPools() {
    for (let i = 0; i < POOL_SIZE; i++) {
        coinPool.push(createCoin());
        cloudPool.push(createCloud());
    }
}

function getFromPool(pool, createFunc) {
    if (pool.length > 0) {
        return pool.pop();
    }
    return createFunc();
}

function returnToPool(pool, object) {
    if (pool.length < POOL_SIZE) {
        pool.push(object);
    }
}

function createCoin() {
    const coinScale = 0.12; // Adjust this value to change coin size
    const coinSize = BASE_WIDTH * coinScale;
    return {
        x: 0,
        y: 0,
        width: coinSize,
        height: coinSize,
        active: false,
        type: 'coin'
    };
}

function createCloud() {
    const baseCloudScale = 0.42; // Adjust this value to change base cloud size
    const sizeVariation = Math.random() * 0.4 + 0.8; // This will give a size between 80% and 120% of the base size
    const cloudScale = baseCloudScale * sizeVariation;
    const image = cloudImages[Math.floor(Math.random() * cloudImages.length)];
    const cloudWidth = BASE_WIDTH * cloudScale;
    const aspectRatio = image.height / image.width;
    const cloudHeight = cloudWidth * aspectRatio;

    return {
        x: 0,
        y: 0,
        width: cloudWidth,
        height: cloudHeight,
        speed: CLOUD_SPEED * (0.8 + Math.random() * 0.4) * 2, // Double the speed
        horizontalSpeed: (Math.random() - 0.5) * 40, // Increase horizontal speed
        image: image,
        active: false,
        type: 'cloud'
    };
}

const GameState = {
    LOADING: 'loading',
    START: 'start',
    TUTORIAL: 'tutorial',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    ERROR: 'error'
};

let currentState = GameState.LOADING;

function setState(newState) {
    console.log(`Game state changing from ${currentState} to: ${newState}`);
    
    if (newState === GameState.PLAYING) {
        removeGameOverLinks();
        startGame();
    }
    
    currentState = newState;
}

// Initialize the game
document.addEventListener('DOMContentLoaded', initGame);

function initGame() {
    console.log('initGame called');
    if (!isMobileDevice()) {
        console.log('Not a mobile device, showing desktop message from initGame');
        showDesktopMessage();
        return;
    }

    if (!gameUnlocked) {
        console.log('Game is locked. Please sign up to play.');
        return;
    }

    console.log('Initializing game');
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    if (!isMobileDevice()) {
        drawDesktopMessage();
        return // Exit the function early for non-mobile devices
    }
    
    // Load high score
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
    
    resizeCanvas();
    addEventListeners();

    // Show initial loading screen
    drawLoadingScreen();

    // Initialize AudioEngine
    AudioEngine.init();

    loadAssets()
        .then(({ assets: loadedAssets, allLoaded }) => {
            console.log('Assets loaded, some may have failed');
            assignLoadedAssets(loadedAssets);
            initializeGameObjects();
            if (allLoaded) {
                setState(isFirstPlay ? GameState.START : GameState.PLAYING);
            } else {
                console.warn('Some non-critical assets failed to load. Starting game anyway.');
                setState(isFirstPlay ? GameState.START : GameState.PLAYING);
            }
            requestAnimationFrame(gameLoop);
        })
        .catch(error => {
            console.error("Critical error during game initialization:", error);
            setState(GameState.ERROR);
            drawErrorScreen("Failed to load critical game assets. Please refresh and try again.");
        });

    // Add a start button or use an existing UI element
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startBackgroundMusic();
        preloadSounds();
        setState(GameState.PLAYING);
    });

    // Load sounds
    loadSounds();
}

function loadSounds() {
    const soundPromises = [
        AudioEngine.loadSound('collect', `${assetPath}sounds/collect.mp3`),
        AudioEngine.loadSound('gameOver', `${assetPath}sounds/game_over.mp3`),
        AudioEngine.loadSound('cloudHit', `${assetPath}sounds/cloud_hit.mp3`),
        AudioEngine.loadSound('backgroundMusic', `${assetPath}sounds/background_music.mp3`)
    ];

    Promise.all(soundPromises)
        .then(() => console.log('All sounds loaded successfully'))
        .catch(error => console.error('Error loading sounds:', error));
}

function checkRequiredAssets() {
    const requiredAssets = ['player', 'coin', 'cloud1', 'collect', 'gameOver'];
    return requiredAssets.every(asset => assets[asset]);
}

function loadHighScore() {
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
}

function saveHighScore() {
    localStorage.setItem('highScore', highScore.toString());
}

function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = BASE_WIDTH / BASE_HEIGHT;

    let newWidth, newHeight, scale;

    if (windowRatio > gameRatio) {
        // Window is wider than the game ratio
        newHeight = windowHeight;
        newWidth = newHeight * gameRatio;
        scale = newHeight / BASE_HEIGHT;
    } else {
        // Window is taller than the game ratio
        newWidth = windowWidth;
        newHeight = newWidth / gameRatio;
        scale = newWidth / BASE_WIDTH;
    }

    canvas.width = windowWidth;
    canvas.height = windowHeight;
    canvas.style.width = `${windowWidth}px`;
    canvas.style.height = `${windowHeight}px`;

    SCALE_FACTOR = Math.min(newWidth / BASE_WIDTH, newHeight / BASE_HEIGHT);
    OFFSET_X = (windowWidth - newWidth) / 2;
    OFFSET_Y = (windowHeight - newHeight) / 2;

    console.log('Canvas resized:', canvas.width, canvas.height, SCALE_FACTOR, OFFSET_X, OFFSET_Y);

    ctx.imageSmoothingEnabled = false;
}

function addEventListeners() {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    // Remove the touchmove listener if you had it before
    // canvas.addEventListener('touchmove', handleTouchMove);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'h' || event.key === 'H') {
            DEBUG_HITBOXES = !DEBUG_HITBOXES;
            console.log("Hitboxes " + (DEBUG_HITBOXES ? "enabled" : "disabled"));
        }
    });
}

function loadAssetWithTimeout(src, type, timeout = 30000, retries = 2) {
    return new Promise((resolve, reject) => {
        const attemptLoad = (attemptsLeft) => {
            console.log(`Attempting to load ${type}: ${src}, attempts left: ${attemptsLeft}`);
            Promise.race([
                loadAsset(src, type),
                new Promise((_, timeoutReject) => 
                    setTimeout(() => {
                        console.error(`Timeout loading ${type}: ${src}`);
                        timeoutReject(new Error(`Timeout loading ${type}: ${src}`));
                    }, timeout)
                )
            ]).then(resolve).catch((error) => {
                if (attemptsLeft > 0) {
                    console.log(`Retrying to load ${type}: ${src}. Attempts left: ${attemptsLeft - 1}`);
                    attemptLoad(attemptsLeft - 1);
                } else {
                    console.error(`Failed to load ${type} after ${retries} attempts: ${src}`);
                    if (type === 'audio') {
                        console.log(`Continuing without audio asset: ${src}`);
                        resolve(null);  // Resolve with null for audio assets
                    } else {
                        reject(error);
                    }
                }
            });
        };
        attemptLoad(retries);
    });
}

function loadAsset(src, type) {
    return new Promise((resolve, reject) => {
        if (type === 'image') {
            const asset = new Image();
            asset.onload = () => {
                console.log(`Image loaded successfully: ${src}`);
                resolve(asset);
            };
            asset.onerror = (e) => {
                console.error(`Failed to load image: ${src}`, e);
                reject(new Error(`Failed to load image: ${src}`));
            };
            asset.src = src;
        } else if (type === 'audio') {
            const asset = new Audio();
            asset.oncanplaythrough = () => {
                console.log(`Audio loaded successfully: ${src}`);
                resolve(asset);
            };
            asset.onerror = (e) => {
                console.error(`Failed to load audio: ${src}`, e);
                reject(new Error(`Failed to load audio: ${src}`));
            };
            asset.src = src;
            // Preload audio without playing
            asset.load();
        } else if (type === 'font') {
            return new FontFace('GameFont', `url(${src})`)
                .load()
                .then(font => {
                    console.log(`Font loaded successfully: ${src}`);
                    document.fonts.add(font);
                    resolve(font);
                });
        }
    });
}

async function loadAssets() {
    const assets = {};
    const failedAssets = [];
    totalAssets = Object.values(imageSources).length + Object.values(audioSources).length + 1; // +1 for the font
    loadedAssets = 0;

    async function loadAssetGroup(sources, type) {
        for (const [key, src] of Object.entries(sources)) {
            try {
                console.log(`Starting to load ${type} asset: ${key} from ${src}`);
                const asset = await loadAssetWithTimeout(src, type);
                console.log(`Successfully loaded ${type} asset: ${key}`);
                assets[key] = asset;
                updateLoadingProgress(key, true);
            } catch (error) {
                console.error(`Error loading ${type} asset ${key}: ${error.message}`);
                failedAssets.push(key);
                updateLoadingProgress(key, false);
            }
        }
    }

    // Load font
    try {
        await loadAssetWithTimeout(`${assetPath}fonts/GameFont.ttf`, 'font');
        console.log('Font loaded successfully');
        updateLoadingProgress('GameFont', true);
    } catch (error) {
        console.error(`Error loading font: ${error.message}`);
        updateLoadingProgress('GameFont', false);
    }

    // Load images
    await loadAssetGroup(imageSources, 'image');

    // Load audio
    await loadAssetGroup(audioSources, 'audio');

    if (failedAssets.length > 0) {
        console.warn(`Failed to load some assets: ${failedAssets.join(', ')}`);
    }
    return { assets, allLoaded: failedAssets.length === 0 };
}



function assignLoadedAssets(loadedAssets) {
    playerImg = loadedAssets.player;
    coinImg = loadedAssets.coin;
    cloudImages = [loadedAssets.cloud1, loadedAssets.cloud2, loadedAssets.cloud3, loadedAssets.cloud4];
    heartImg = loadedAssets.heart;
    logoImg = loadedAssets.logo;

    // No need to set volumes here, as we'll use AudioEngine to play sounds
}

function initializeGameObjects() {
    console.log('Initializing game objects');
    const playerWidth = BASE_WIDTH * 0.2;
    const playerAspectRatio = playerImg.height / playerImg.width;
    const playerHeight = playerWidth * playerAspectRatio;
    player = {
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 3,
        width: playerWidth,
        height: playerHeight,
        velocityX: 0,
        targetX: BASE_WIDTH / 2,
        hitbox: {
            xOffset: playerWidth * 0.3,
            yOffset: playerHeight * 0.4,
            width: playerWidth * 0.35,
            height: playerHeight * 0.6
        }
    };
    initObjectPools();
    spawnInitialObjects();
}

function spawnInitialObjects() {
    // We're not spawning any coins or clouds initially
    // They will appear after their respective delays
}

let lastFrameTime = 0;
const MAX_DELTA_TIME = 1 / 30; // Cap delta time at 1/30th of a second

function gameLoop(timestamp) {
    if (!isMobileDevice()) return; // Exit early for non-mobile devices

    const deltaTime = Math.min((timestamp - lastFrameTime) / 1000, MAX_DELTA_TIME);
    lastFrameTime = timestamp;

    if (currentState === GameState.PLAYING) {
        updateGamePlay(deltaTime);
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

function drawScreen(state) {
    const screens = {
        loading: { text: 'Loading...', color: 'black' },
        start: { text: 'Tap to Start', color: 'white' },
        gameOver: { text: 'Game Over', color: 'white' },
        error: { text: 'Error loading game assets', color: 'red' }
    };

    const { text, color } = screens[state];
    drawTextWithStroke(text, BASE_WIDTH / 2, BASE_HEIGHT / 2, 30, color, 'black');
}

function updateGame(deltaTime) {
    switch (currentState) {
        case GameState.PLAYING:
            updateGamePlay(deltaTime);
            break;
        case GameState.PAUSED:
            // Handle paused state
            break;
        // Add other state updates as needed
    }
}

let coinSpawnTimer = 0;
let cloudSpawnTimer = 0;

function updateGamePlay(deltaTime) {
    gameTime += deltaTime;
    coinSpawnTimer += deltaTime * 1000;
    cloudSpawnTimer += deltaTime * 1000;

    // Increase speed more frequently and by a larger amount
    if (gameTime >= lastSpeedIncreaseTime + SPEED_INCREASE_INTERVAL) {
        gameSpeed = Math.min(gameSpeed + SPEED_INCREASE_AMOUNT, MAX_GAME_SPEED);
        lastSpeedIncreaseTime = gameTime;
    }

    updatePlayer(deltaTime);
    updateCamera(deltaTime);
    
    updateCoins(deltaTime);
    updateClouds(deltaTime);
    
    updateCollisions();

    invincibleTime = Math.max(0, invincibleTime - deltaTime * 1000);
}
function updateCamera(deltaTime) {
    const targetCameraY = player.y - BASE_HEIGHT / 3;
    cameraY += (targetCameraY - cameraY) * CAMERA_LERP;
}

const PLAYER_MOVE_SPEED = 300; // Adjust this value to change the player's movement speed
const PLAYER_DECELERATION = 0.8;

function updatePlayer(deltaTime) {
    if (player.velocityX !== 0) {
        // Accelerate
        player.velocityX += (player.velocityX > 0 ? PLAYER_ACCELERATION : -PLAYER_ACCELERATION) * deltaTime;
    } else {
        // Decelerate
        player.velocityX *= Math.pow(PLAYER_DECELERATION, deltaTime * 60);
    }

    // Cap the velocity
    player.velocityX = Math.min(Math.max(player.velocityX, -PLAYER_MOVE_SPEED), PLAYER_MOVE_SPEED);

    player.x += player.velocityX * deltaTime;
    player.x = Math.max(0, Math.min(player.x, BASE_WIDTH - player.width));
}

function updateCoins(deltaTime) {
    const removeList = [];
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y -= COIN_SPEED * gameSpeed * deltaTime;
        if (coin.y + coin.height <= cameraY - BASE_HEIGHT / 2) {
            removeList.push(i);
        }
    }

    // Remove coins in reverse order
    for (let i = removeList.length - 1; i >= 0; i--) {
        const index = removeList[i];
        const coin = coins[index];
        coin.active = false;
        returnToPool(coinPool, coin);
        coins.splice(index, 1);
    }

    // Spawn a new coin if needed and enough time has passed
    if (coins.length < MAX_COINS && coinSpawnTimer >= COIN_SPAWN_DELAY) {
        spawnCoin();
        coinSpawnTimer = 0; // Reset the timer after spawning
    }
}

function updateClouds(deltaTime) {
    clouds = clouds.filter(cloud => {
        cloud.y -= cloud.speed * gameSpeed * deltaTime;
        cloud.x += cloud.horizontalSpeed * deltaTime;
        if (cloud.x + cloud.width < 0) cloud.x = BASE_WIDTH;
        if (cloud.x > BASE_WIDTH) cloud.x = -cloud.width;
        return cloud.y + cloud.height > cameraY - BASE_HEIGHT;
    });

    // Spawn a new cloud if needed and enough time has passed
    if (clouds.length < MAX_CLOUDS && cloudSpawnTimer >= CLOUD_SPAWN_DELAY) {
        spawnCloud();
        cloudSpawnTimer = 0; // Reset the timer after spawning
    }
}

function drawGame() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGradientBackground();

    switch (currentState) {
        case GameState.LOADING:
            drawLoadingScreen();
            break;
        case GameState.START:
            drawStartScreen();
            break;
        case GameState.TUTORIAL:
            drawTutorialScreen();
            break;
        case GameState.PLAYING:
            ctx.save();
            ctx.setTransform(SCALE_FACTOR, 0, 0, SCALE_FACTOR, OFFSET_X, OFFSET_Y - cameraY * SCALE_FACTOR);
            drawClouds();
            drawCoins();
            drawPlayer();
            drawHitboxes(); // Add this line
            ctx.restore();
            drawUI();
            break;
        case GameState.GAME_OVER:
            drawGameOverScreen();
            break;
    }
}

function drawClouds() {
    for (let cloud of clouds) {
        if (cloud.active) {
            ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
        }
    }
}

function drawCoins() {
    for (let coin of coins) {
        if (coin.active) {
            ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
        }
    }
}

function drawPlayer() {
    if (!(invincibleTime > 0 && Math.floor(gameTime * 10) % 2 === 0)) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }
}

function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1E90FF');  // Dodger Blue (deeper blue) at the top
    gradient.addColorStop(1, '#E0F6FF');  // Light blue at the bottom
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawUI() {
    drawLives();
    drawScore();
    drawHighScore();
}

function drawLives() {
    const heartSize = 30 * SCALE_FACTOR;
    const heartSpacing = 5 * SCALE_FACTOR;
    const startX = 10 * SCALE_FACTOR;
    const startY = 10 * SCALE_FACTOR;
    
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImg, startX + i * (heartSize + heartSpacing), startY, heartSize, heartSize);
    }
}

function drawScore() {
    const scoreX = canvas.width - (10 * SCALE_FACTOR);
    const scoreY = 25 * SCALE_FACTOR;
    drawTextWithStroke(`Score: ${score}`, scoreX, scoreY, FONT_SIZES.SMALL, 'white', 'black', 'right');
}

function drawHighScore() {
    const highScoreX = canvas.width - (10 * SCALE_FACTOR);
    const highScoreY = 55 * SCALE_FACTOR;
    drawTextWithStroke(`High Score: ${highScore}`, highScoreX, highScoreY, FONT_SIZES.SMALL, 'gold', 'black', 'right');
}

function spawnCoin() {
    const coin = getFromPool(coinPool, createCoin);
    coin.x = Math.random() * (BASE_WIDTH - coin.width);
    coin.y = cameraY + BASE_HEIGHT + Math.random() * BASE_HEIGHT * 1.5;
    coin.active = true;
    coins.push(coin);
}

function spawnCloud() {
    const cloud = getFromPool(cloudPool, createCloud);
    cloud.x = Math.random() * (BASE_WIDTH - cloud.width);
    cloud.y = cameraY + BASE_HEIGHT + Math.random() * BASE_HEIGHT * 1.5;
    cloud.active = true;
    clouds.push(cloud);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function drawTextWithStroke(text, x, y, fontSize, fillStyle, strokeStyle, align = 'center') {
    const scaledFontSize = fontSize * SCALE_FACTOR;
    ctx.font = `${scaledFontSize}px GameFont`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = scaledFontSize / 8;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
}

let touchIdentifier = null;

function handleTouchStart(event) {
    event.preventDefault();
    switch (currentState) {
        case GameState.START:
            setState(GameState.TUTORIAL);
            break;
        case GameState.TUTORIAL:
            setState(GameState.PLAYING);
            break;
        case GameState.PLAYING:
            // Existing game controls
            if (touchIdentifier === null) {
                const touch = event.changedTouches[0];
                touchIdentifier = touch.identifier;
                updatePlayerMovement(touch);
            }
            break;
        case GameState.GAME_OVER:
            const touch = event.changedTouches[0];
            const touchX = touch.clientX - canvas.getBoundingClientRect().left;
            const touchY = touch.clientY - canvas.getBoundingClientRect().top;

            if (isPointInRect(touchX, touchY, gameOverButtons.restart)) {
                setState(GameState.PLAYING);
            } else if (isPointInRect(touchX, touchY, gameOverButtons.freefall)) {
                showDialog(
                    "Do you want to open the Freefall page?",
                    () => {
                        if (freefallLink) {
                            window.open(freefallLink.href, '_blank');
                        }
                    },
                    () => {
                        // User cancelled, do nothing
                    }
                );
            }
            break;
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        if (touch.identifier === touchIdentifier) {
            touchIdentifier = null;
            stopPlayerMovement();

            if (currentState === GameState.GAME_OVER) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                
                const touchX = (touch.clientX - rect.left) * scaleX;
                const touchY = (touch.clientY - rect.top) * scaleY;

                if (isPointInRect(touchX, touchY, gameOverButtons.restart)) {
                    setState(GameState.PLAYING);
                } else if (isPointInRect(touchX, touchY, gameOverButtons.freefall)) {
                    showDialog(
                        "Do you want to open the Freefall page?",
                        () => {
                            if (freefallLink) {
                                window.open(freefallLink.href, '_blank');
                            }
                        },
                        () => {
                            // User cancelled, do nothing
                        }
                    );
                } else if (isPointInRect(touchX, touchY, gameOverButtons.submitHighScore)) {
                    showDialog(
                        "Do you want to submit your high score?",
                        () => {
                            if (submitHighScoreLink) {
                                window.open(submitHighScoreLink.href, '_blank');
                            }
                        },
                        () => {
                            // User cancelled, do nothing
                        }
                    );
                }
            }

            break;
        }
    }
}

function updatePlayerMovement(touch) {
    if (!player) return; // Add this check to prevent errors when player is not defined
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const screenMiddle = canvas.width / 2;

    if (touchX < screenMiddle) {
        // Move left
        player.velocityX = -PLAYER_MOVE_SPEED;
    } else {
        // Move right
        player.velocityX = PLAYER_MOVE_SPEED;
    }
}

function stopPlayerMovement() {
    if (!player) return;
    player.velocityX = 0;
}

function startGame() {
    console.log('Starting game');
    isFirstPlay = false;
    score = 0;
    lives = MAX_LIVES;
    gameSpeed = 0.7;
    gameTime = 0;
    lastSpeedIncreaseTime = 0;
    lastTimestamp = performance.now();
    coins = [];
    clouds = [];
    coinSpawnTimer = 0;
    cloudSpawnTimer = 0;
    startBackgroundMusic();
}

function endGame() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    setState(GameState.GAME_OVER);
    AudioEngine.stopSound('backgroundMusic');
    AudioEngine.playSound('gameOver');
}

function playSound(name) {
    AudioEngine.playSound(name);
}

function startBackgroundMusic() {
    AudioEngine.playSound('backgroundMusic', true);
    AudioEngine.setVolume('backgroundMusic', SOUND_VOLUMES.BACKGROUND_MUSIC);
}

function stopBackgroundMusic() {
    AudioEngine.stopSound('backgroundMusic');
}

function updateDebugOverlay(deltaTime) {
    const debugOverlay = document.getElementById('debugOverlay');
    if (debugOverlay) {
        const fps = Math.round(1 / deltaTime);
        debugOverlay.innerHTML = `
            FPS: ${fps}
            Score: ${score}
            Lives: ${lives}
            Game Speed: ${gameSpeed.toFixed(2)}
            Coins: ${coins.length}
            Clouds: ${clouds.length}
            Offset: (${OFFSET_X}, ${OFFSET_Y})<br>
            Player: (${player ? player.x.toFixed(2) : 'N/A'}, ${player ? player.y.toFixed(2) : 'N/A'})<br>
        `;
    }
}

// Additional utility functions

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const playerHitbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

function updateCollisions() {
    playerHitbox.x = player.x + player.hitbox.xOffset;
    playerHitbox.y = player.y + player.hitbox.yOffset;
    playerHitbox.width = player.hitbox.width;
    playerHitbox.height = player.hitbox.height;

    // Check coin collisions
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (coin.active && checkCollision(playerHitbox, coin)) {
            score++;
            AudioEngine.playSound('collect');
            AudioEngine.setVolume('collect', SOUND_VOLUMES.COLLECT);
            coin.active = false;
            returnToPool(coinPool, coin);
            coins.splice(i, 1);
        }
    }

    // Check cloud collisions only if not invincible
    if (invincibleTime <= 0) {
        for (let i = 0; i < clouds.length; i++) {
            const cloud = clouds[i];
            if (cloud.active && checkCollision(playerHitbox, cloud)) {
                AudioEngine.playSound('cloudHit');
                AudioEngine.setVolume('cloudHit', SOUND_VOLUMES.CLOUD_HIT);
                lives--;
                invincibleTime = INVINCIBLE_DURATION;
                if (lives <= 0) {
                    AudioEngine.playSound('gameOver');
                    AudioEngine.setVolume('gameOver', SOUND_VOLUMES.GAME_OVER);
                    endGame();
                }
                break;  // Only collide with one cloud per frame
            }
        }
    }
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message, source, lineno, colno, error);
    // You can add code here to display an error message to the user
    return true;
};

let lastSpeedIncreaseTime = 0;

// Update the BUTTON_STYLE constant


// ... existing code ...

function drawButton(text, x, y, width, height, color = BUTTON_STYLE.FILL, url = null) {
    // Draw button background
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    // Draw button border
    ctx.strokeStyle = BUTTON_STYLE.BORDER;
    ctx.lineWidth = 2 * SCALE_FACTOR;
    ctx.strokeRect(x, y, width, height);

    // Prepare text drawing
    ctx.fillStyle = BUTTON_STYLE.TEXT;
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate maximum font size that fits the button
    const maxWidth = width - 20 * SCALE_FACTOR;
    const maxHeight = height - 20 * SCALE_FACTOR;
    let fontSize = FONT_SIZES.MEDIUM * SCALE_FACTOR;
    let lines = [];
    let textFits = false;

    while (!textFits && fontSize > 10 * SCALE_FACTOR) {
        ctx.font = `${fontSize}px ${BUTTON_STYLE.FONT}`;
        lines = getWrappedText(text, maxWidth);
        const totalTextHeight = lines.length * (fontSize + 4 * SCALE_FACTOR);
        
        if (totalTextHeight <= maxHeight && lines.every(line => ctx.measureText(line).width <= maxWidth)) {
            textFits = true;
        } else {
            fontSize--;
        }
    }

    // Draw text
    const lineHeight = fontSize + 4 * SCALE_FACTOR;
    const totalTextHeight = lines.length * lineHeight;
    const textY = y + (height - totalTextHeight) / 2 + fontSize / 2;

    ctx.lineWidth = fontSize / 8;
    lines.forEach((line, index) => {
        const lineY = textY + index * lineHeight;
        ctx.strokeText(line, x + width / 2, lineY);
        ctx.fillText(line, x + width / 2, lineY);
    });

    // If a URL is provided, create a clickable area
    if (url) {
        const clickableArea = document.createElement('a');
        clickableArea.href = url;
        clickableArea.target = '_blank'; // Open in a new tab
        clickableArea.style.position = 'absolute';
        clickableArea.style.left = `${x / SCALE_FACTOR + OFFSET_X}px`;
        clickableArea.style.top = `${y / SCALE_FACTOR + OFFSET_Y}px`;
        clickableArea.style.width = `${width / SCALE_FACTOR}px`;
        clickableArea.style.height = `${height / SCALE_FACTOR}px`;
        clickableArea.style.zIndex = '1000';
        document.body.appendChild(clickableArea);
    }
}

function getWrappedText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function drawStartScreen() {
    // Draw background
    drawGradientBackground();

    // Draw the game logo
    const logoWidth = canvas.width * 0.9; // Adjust this value to change the logo size
    const logoHeight = logoWidth * (logoImg.height / logoImg.width); // Maintain aspect ratio
    const logoX = (canvas.width - logoWidth) / 2;
    const logoY = canvas.height * 0.4; // Position the logo at 30% of the screen height

    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

    // Draw the button
    const buttonWidth = 220;
    const buttonHeight = 70;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height * 0.7; // Position the button at 70% of the screen height

    drawButton('Tap to Start', buttonX, buttonY, buttonWidth, buttonHeight);
}

function drawTutorialScreen() {
    // Draw background
    drawGradientBackground();

    const centerX = canvas.width / 2;
    const titleY = canvas.height * 0.2;
    const instructionStartY = canvas.height * 0.35;
    const instructionSpacing = canvas.height * 0.15;

    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';

    // Title
    ctx.font = `${FONT_SIZES.LARGE * SCALE_FACTOR}px GameFont`;
    ctx.lineWidth = 4 * SCALE_FACTOR;
    ctx.strokeText('How to Play', centerX, titleY);
    ctx.fillStyle = 'gold';
    ctx.fillText('How to Play', centerX, titleY);
    ctx.fillStyle = 'white'; // Reset fill style for subsequent text
    
    ctx.font = `${FONT_SIZES.MEDIUM * SCALE_FACTOR}px GameFont`;
    ctx.lineWidth = 3 * SCALE_FACTOR;

    // Tap to move instruction
    const moveY = instructionStartY;
    ctx.strokeText('Tap left or right', centerX, moveY);
    ctx.fillText('Tap left or right', centerX, moveY);

    // Collect coins instruction with coin image
    const coinY = moveY + instructionSpacing;
    const coinSize = FONT_SIZES.MEDIUM * 1.2 * SCALE_FACTOR;
    const coinOffsetX = 10 * SCALE_FACTOR; // Move 20px to the right
    if (coinImg && coinImg.complete) {
        ctx.drawImage(coinImg, centerX - 190 + coinOffsetX, coinY - coinSize / 2, coinSize, coinSize);
    }
    ctx.strokeText('Collect coins', centerX + coinOffsetX, coinY);
    ctx.fillText('Collect coins', centerX + coinOffsetX, coinY);

    // Avoid clouds instruction with cloud image
    const cloudY = coinY + instructionSpacing;
    const cloudSize = FONT_SIZES.MEDIUM * 1.5 * SCALE_FACTOR;
    const cloudOffsetX = 10 * SCALE_FACTOR; // Move 20px to the right
    if (cloudImages && cloudImages.length > 0 && cloudImages[0].complete) {
        ctx.drawImage(cloudImages[0], centerX - 190 + cloudOffsetX, cloudY - cloudSize / 2, cloudSize, cloudSize);
    }
    ctx.strokeText('Avoid clouds', centerX + cloudOffsetX, cloudY);
    ctx.fillText('Avoid clouds', centerX + cloudOffsetX, cloudY);
    
    // Draw the button
    const buttonWidth = 220;
    const buttonHeight = 70;
    const buttonX = centerX - buttonWidth / 2;
    const buttonY = canvas.height * 0.8;

    drawButton('Tap to Play', buttonX, buttonY, buttonWidth, buttonHeight);
}

function drawGameOverScreen() {
    // Background
    drawGradientBackground();

    const centerY = canvas.height * 0.3; // Moved up further
    const spacing = FONT_SIZES.LARGE * 1.8 * SCALE_FACTOR; // Reduced spacing for top text

    // Game Over text
    ctx.font = `${FONT_SIZES.LARGE * 1.5 * SCALE_FACTOR}px GameFont`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5 * SCALE_FACTOR;
    ctx.strokeText('Game Over', canvas.width / 2, centerY - spacing * 2);
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2, centerY - spacing * 2);
    
    // Score
    ctx.font = `${FONT_SIZES.MEDIUM * SCALE_FACTOR}px GameFont`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3 * SCALE_FACTOR;
    ctx.strokeText(`Score: ${score}`, canvas.width / 2, centerY - spacing);
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, centerY - spacing);
    
    // High Score
    ctx.fillStyle = 'gold';
    if (score > highScore) {
        ctx.strokeText('New High Score!', canvas.width / 2, centerY);
        ctx.fillText('New High Score!', canvas.width / 2, centerY);
    } else {
        ctx.strokeText(`High Score: ${highScore}`, canvas.width / 2, centerY);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, centerY);
    }
    
    const buttonWidth = 220;
    const buttonHeight = 70;
    const buttonX = (canvas.width - buttonWidth) / 2;

    const specialButtonWidth = buttonWidth + 70;
    const specialButtonHeight = buttonHeight + 30;
    const specialButtonX = (canvas.width - specialButtonWidth) / 2;
    
    // Draw "Submit High Score" button
    const submitButtonY = centerY + spacing * 2;
    drawButton('Submit Your\n  High Score', specialButtonX, submitButtonY, specialButtonWidth, specialButtonHeight, '#50e9ce');
    
    // Draw "Add Freefall" button
    const freefallButtonY = submitButtonY + specialButtonHeight + 40; // Increased gap to 40px
    drawButton('Add Freefall\nto your library', specialButtonX, freefallButtonY, specialButtonWidth, specialButtonHeight, 'orange');

    const restartButtonY = freefallButtonY + specialButtonHeight + 40; // Increased gap to 40px
    drawButton('Tap to Restart', buttonX, restartButtonY, buttonWidth, buttonHeight);

    // Update gameOverButtons with correct positions
    gameOverButtons = {
        restart: { 
            x: buttonX, 
            y: restartButtonY, 
            width: buttonWidth, 
            height: buttonHeight 
        },
        freefall: { 
            x: specialButtonX, 
            y: freefallButtonY, 
            width: specialButtonWidth, 
            height: specialButtonHeight 
        },
        submitHighScore: {
            x: specialButtonX,
            y: submitButtonY,
            width: specialButtonWidth,
            height: specialButtonHeight
        }
    };

    // Update Submit High Score link position and size
    if (!submitHighScoreLink) {
        submitHighScoreLink = document.createElement('a');
        submitHighScoreLink.href = 'https://airtable.com/appX7Y7htfIY69xpj/pago0ZYVvRa0iBfop/form';
        submitHighScoreLink.target = '_blank';
        submitHighScoreLink.style.position = 'absolute';
        submitHighScoreLink.style.zIndex = '1000';
        document.body.appendChild(submitHighScoreLink);
    }
    const extraPadding = 10 * SCALE_FACTOR;
    submitHighScoreLink.style.left = `${(specialButtonX - extraPadding) / SCALE_FACTOR + OFFSET_X + 30}px`;
    submitHighScoreLink.style.top = `${(submitButtonY - extraPadding) / SCALE_FACTOR + OFFSET_Y + 50}px`;
    submitHighScoreLink.style.width = `${(specialButtonWidth + extraPadding * 2) / SCALE_FACTOR}px`;
    submitHighScoreLink.style.height = `${(specialButtonHeight + extraPadding * 2) / SCALE_FACTOR}px`;

    // Update Freefall link position and size
    if (!freefallLink) {
        freefallLink = document.createElement('a');
        freefallLink.href = 'https://armada.lnk.to/Freefall';
        freefallLink.target = '_blank';
        freefallLink.style.position = 'absolute';
        freefallLink.style.zIndex = '1000';
        document.body.appendChild(freefallLink);
    }
    freefallLink.style.left = `${(specialButtonX - extraPadding) / SCALE_FACTOR + OFFSET_X + 30}px`;
    freefallLink.style.top = `${(freefallButtonY - extraPadding) / SCALE_FACTOR + OFFSET_Y + 60}px`;
    freefallLink.style.width = `${(specialButtonWidth + extraPadding * 2) / SCALE_FACTOR}px`;
    freefallLink.style.height = `${(specialButtonHeight + extraPadding * 2) / SCALE_FACTOR}px`;
}

function drawLoadingScreen() {
    // Draw the gradient background
    drawGradientBackground();

    // Set up text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${FONT_SIZES.LARGE * SCALE_FACTOR}px GameFont`;

    // Calculate center positions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw "Loading" text with stroke
    const loadingText = 'Loading';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = FONT_SIZES.LARGE * SCALE_FACTOR / 8;
    ctx.strokeText(loadingText, centerX, centerY - FONT_SIZES.LARGE * SCALE_FACTOR);
    ctx.fillStyle = 'white';
    ctx.fillText(loadingText, centerX, centerY - FONT_SIZES.LARGE * SCALE_FACTOR);

    // Draw loading bar
    const barWidth = canvas.width * 0.7;
    const barHeight = FONT_SIZES.MEDIUM * SCALE_FACTOR;
    const barX = centerX - barWidth / 2;
    const barY = centerY + FONT_SIZES.LARGE * SCALE_FACTOR / 2;

    // Draw bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Draw progress
    ctx.fillStyle = 'white';
    ctx.fillRect(barX, barY, barWidth * (loadingProgress / 100), barHeight);

    // Draw bar border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2 * SCALE_FACTOR;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawErrorScreen(errorMessage) {
    ctx.fillStyle = 'white';
    ctx.font = `${FONT_SIZES.MEDIUM * SCALE_FACTOR}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Error loading game assets', canvas.width / 2, canvas.height / 2 - 40 * SCALE_FACTOR);
    ctx.font = `${FONT_SIZES.SMALL * SCALE_FACTOR}px Arial`;
    ctx.fillText(errorMessage, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Please check your internet connection and refresh the page', canvas.width / 2, canvas.height / 2 + 40 * SCALE_FACTOR);
}

function updateLoadingProgress(assetName, success) {
    loadedAssets++;
    loadingProgress = (loadedAssets / totalAssets) * 100;
    console.log(`${success ? 'Loaded' : 'Failed to load'} asset: ${assetName}. Progress: ${loadingProgress.toFixed(2)}%`);
    drawLoadingScreen();
}

function initializeAudio() {
    Object.keys(audioElements).forEach(key => {
        if (key.endsWith('Src')) {
            const audioKey = key.replace('Src', '');
            audioElements[audioKey].src = audioElements[key];
        }
    });

    // Set properties for background music
    audioElements.backgroundMusic.loop = true;
    audioElements.backgroundMusic.volume = 0.6;

    // Set volumes for other sounds
    audioElements.collect.volume = 0.1;
    audioElements.cloudHit.volume = 0.7;
}

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
});

function checkSounds() {
    console.log("Collect sound:", collectSound, collectSound ? collectSound.readyState : 'N/A');
    console.log("Game over sound:", gameOverSound, gameOverSound ? gameOverSound.readyState : 'N/A');
    console.log("Cloud hit sound:", cloudHitSound, cloudHitSound ? cloudHitSound.readyState : 'N/A');
    console.log("Background music:", backgroundMusic, backgroundMusic ? backgroundMusic.readyState : 'N/A');
}

function preloadSounds() {
    const sounds = [collectSound, cloudHitSound, gameOverSound];
    sounds.forEach(sound => {
        if (sound) {
            sound.load();
        }
    });
}

function addSoundListeners() {
    Object.keys(AudioEngine.buffers).forEach(key => {
        const sound = AudioEngine.buffers[key];
        console.log(`Sound ${key} is ready to play`);
    });
}

// Call this in your initGame function
addSoundListeners();
document.addEventListener('keydown', (event) => {
    if (event.key === 'm' || event.key === 'M') {
        AudioEngine.setMute(!AudioEngine.muted);
        console.log("Sound muted:", AudioEngine.muted);
    }
});

function isMobileDevice() {
    return true;
}

function drawDesktopMessage() {
    ctx.fillStyle = '#1E90FF'; // Match your game's background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '24px GameFont';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const message = 'This game is only playable on mobile devices.';
    const messageLines = message.split(' ').reduce((acc, word) => {
        if (!acc.length || (acc[acc.length - 1] + ' ' + word).length > 30) {
            acc.push(word);
        } else {
            acc[acc.length - 1] += ' ' + word;
        }
        return acc;
    }, []);
    
    messageLines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index - messageLines.length / 2 + 0.5) * 30);
    });
}

function drawHitboxes() {
    if (!DEBUG_HITBOXES) return;

    // Draw player hitbox
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        player.x + player.hitbox.xOffset,
        player.y + player.hitbox.yOffset,
        player.hitbox.width,
        player.hitbox.height
    );

    // Draw cloud hitboxes
    ctx.strokeStyle = 'blue';
    for (let cloud of clouds) {
        if (cloud.active) {
            ctx.strokeRect(cloud.x, cloud.y, cloud.width, cloud.height);
        }
    }
}

// Helper function to check if a point is inside a rectangle
function isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
}

// Add this variable to store button dimensions
let gameOverButtons = {};

// Start the game loop
requestAnimationFrame(gameLoop);
function removeGameOverLinks() {
    if (freefallLink) {
        freefallLink.remove();
        freefallLink = null;
    }
    if (submitHighScoreLink) {
        submitHighScoreLink.remove();
        submitHighScoreLink = null;
    }
}
