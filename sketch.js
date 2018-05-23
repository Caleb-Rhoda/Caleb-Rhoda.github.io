var groundSprites;
var GROUND_SPRITE_WIDTH = 50;
var GROUND_SPRITE_HEIGHT = 50;
var GRAVITY = 1.0;
var JUMP = -20;
var numGroundSprites;
var coinSprites;
var player;
var obstacleSprites;
var isGameOver;
var score;
var backgroundImage;
var coinImage;
var obstacleImage;
var obstacleSprite;
var playerImage;
var groundImage;
var numTaps = 0;
  
function setup() {
    isGameOver = false;
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    backgroundImage = loadImage ("picture.png");
    coinImage = loadImage("coin.png");
    obstacleImage = loadImage("meteor.png");
    playerImage = loadImage("AOL_BOI.png");
    groundImage = loadImage("minecraft_blook.png")
    score = 0;
    
    background(150, 200, 250);
    groundSprites = new Group();
    numGroundSprites = width/GROUND_SPRITE_WIDTH + 1;
    for (var n = 0; n < numGroundSprites; n++) {
        var groundSprite = createSprite(n*50, height-25, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT);
        groundSprites.add(groundSprite);
        groundSprite.scale = GROUND_SPRITE_HEIGHT / 400.0;
        groundSprite.addImage(groundImage);
        
    }
    obstacleSprites = new Group();
    coinSprites = new Group();
    
    player = createSprite(100, height-100, 50, 50);
    
}

function draw() {
    if (isGameOver) {
        background(0);
        fill(255)
        textAlign(CENTER);
        text("Your score was: " + score, camera.position.x, camera.position.y - 20);
        text("Game Over! Click anywhere to restart", camera.position.x, camera.position.y);
    }   
    else {
        background(150, 200, 250);
        image(backgroundImage, camera.position.x - (width / 2), 0, width, height);
        player.velocity.y = player.velocity.y + GRAVITY;
        if (keyDown(DOWN_ARROW)) {
            GRAVITY += 5;
            numTaps += 1;
        } else if (keyDown(UP_ARROW)) {
            GRAVITY -= 15;
            numTaps += 1;
        }
        if (GRAVITY < 1.0) {
            GRAVITY = 1.0;
        }
        if (groundSprites.overlap(player)) {
            player.position.y = (height-50) - (player.height/2);
            player.velocity.y = 0;
            if (keyDown(UP_ARROW)) {
                player.velocity.y = JUMP;
            }
        }

        player.position.x = player.position.x + 20;
        camera.position.x = player.position.x + (width/4);
        var firstGroundSprite = groundSprites[0];
        if (firstGroundSprite.position.x <= camera.position.x - (width/2)) {
            groundSprites.remove(firstGroundSprite);
            firstGroundSprite.position.x = firstGroundSprite.position.x + numGroundSprites*GROUND_SPRITE_WIDTH + 1;
            groundSprites.add(firstGroundSprite);
            player.addImage(playerImage);
            player.scale = 0.15;
            
        }
        if (random() > 0.95) {
            var obstacle = createSprite(camera.position.x + width, random(0, (height-50)-15), 30, 30);
            obstacle.velocity.x = -2;
            obstacle.velocity.y = 2;
            obstacleSprites.add(obstacle);
            obstacle.addImage(obstacleImage);
            obstacle.scale = 0.1;
        }

        if (obstacleSprites.length > 0) {
            var firstObstacle = obstacleSprites[0];
            if (firstObstacle.position.x <= camera.position.x - (width/2 + firstObstacle.width/2)) {
                removeSprite(firstObstacle)
            }   
            obstacleSprites.overlap(player, endGame);
               
        }
        
        var collidedObstacleSprites = [];
        for (var i = 0; i < obstacleSprites.length; i++) {
            var obstacle = obstacleSprites[i];
            obstacle.overlap(groundSprites, function() {
                collidedObstacleSprites.push(obstacle);
            });
        }
        for (var i = 0; i < collidedObstacleSprites.length; i++) {
            removeSprite(collidedObstacleSprites[i]);
        }

        
        updateCoinSprites()
        
        if (random() > 0.95) {
            var coin = createSprite(camera.position.x + width, random(0, (height-50)-15), 30, 30);
            coin.addImage(coinImage);
            coin.scale = 0.25;
            coinSprites.add(coin);
            
        }

        obstacleSprites.overlap(player, endGame);

        drawSprites();
        
        fill(255, 0, 0);
        score = score + 1;
        textAlign(CENTER)
        text("score: " + score, camera.position.x, 10);
        text("numTaps: " + numTaps, camera.position.x, 20);
    }
}

function updateCoinSprites() {
    if (coinSprites.length > 0) {
        var firstCoin = coinSprites[0];
        if (firstCoin.position.x <= camera.position.x - (width/2 + firstCoin.width/2)) {
            removeSprite(firstCoin);
        }
        var collidedSprites = [];
        for (var i = 0; i < coinSprites.length; i++) {
            // Get the item in the coinSprites list at index i
            var coinSprite = coinSprites[i];
            coinSprite.overlap(player, function() {
                score += 100;
                collidedSprites.push(coinSprite);
            });
        }
        for (var i = 0; i < collidedSprites.length; i++) {
            removeSprite(collidedSprites[i]);
        }
    }
}
    

function endGame() {
    isGameOver = true;    
}

function mouseClicked() {
    if (isGameOver) {
        isGameOver = false;
        
        // Put all ground sprites in the place that they were at start
        for (var n = 0; n < numGroundSprites; n++) {
            var groundSprite = groundSprites[n];
            groundSprite.position.x = n*50;
        }

        // Also set the player to the start position
        player.position.x = 100;
        player.position.y = height-75;

        score = 0;
        numTaps = 0;
        obstacleSprites.removeSprites();
            
    }    
}