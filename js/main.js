// Main game initialization
const config = {
    type: Phaser.AUTO,
    width: gameConfig.gridWidth * gameConfig.tileSize,
    height: gameConfig.gridHeight * gameConfig.tileSize + 100, // Extra space for UI
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [BootScene, MainMenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Create the game instance
const game = new Phaser.Game(config);
