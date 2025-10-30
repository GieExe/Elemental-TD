class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading text
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
            fontSize: '32px',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Create a progress bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 + 50, 320, 30);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x44ff44, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 55, 300 * value, 20);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
        
        // Here we would load assets, but for now we'll generate graphics programmatically
        // This ensures smooth rendering
    }

    create() {
        // Smooth rendering settings
        this.game.renderer.antialias = true;
        
        // Move to main menu
        this.scene.start('MainMenuScene');
    }
}
