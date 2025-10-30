class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background gradient
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Title with glow effect
        const title = this.add.text(width / 2, height / 3, 'ELEMENTAL', {
            fontSize: '72px',
            fontStyle: 'bold',
            fill: '#ffffff',
            stroke: '#4444ff',
            strokeThickness: 4
        });
        title.setOrigin(0.5);
        
        const subtitle = this.add.text(width / 2, height / 3 + 70, 'TOWER DEFENSE', {
            fontSize: '48px',
            fontStyle: 'bold',
            fill: '#ffffff',
            stroke: '#ff4444',
            strokeThickness: 3
        });
        subtitle.setOrigin(0.5);
        
        // Animate title
        this.tweens.add({
            targets: title,
            scale: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Elemental icons with animations
        this.createElementalIcons(width, height);
        
        // Play button
        const playButton = this.add.text(width / 2, height * 0.65, 'PLAY GAME', {
            fontSize: '36px',
            fontStyle: 'bold',
            fill: '#44ff44',
            backgroundColor: '#222222',
            padding: { x: 30, y: 15 }
        });
        playButton.setOrigin(0.5);
        playButton.setInteractive({ useHandCursor: true });
        
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
            this.tweens.add({
                targets: playButton,
                angle: 2,
                duration: 100,
                yoyo: true,
                repeat: 0
            });
        });
        
        playButton.on('pointerout', () => {
            playButton.setScale(1);
            playButton.angle = 0;
        });
        
        playButton.on('pointerdown', () => {
            // Scale down animation
            this.tweens.add({
                targets: playButton,
                scale: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('GameScene');
                }
            });
        });
        
        // Instructions
        const instructions = this.add.text(width / 2, height * 0.85, 
            'Click to place towers • Defend against waves of enemies', {
            fontSize: '16px',
            fill: '#aaaaaa',
            align: 'center'
        });
        instructions.setOrigin(0.5);
    }
    
    createElementalIcons(width, height) {
        const elements = [
            { color: 0xff4444, x: width * 0.2, label: 'FIRE' },
            { color: 0x4444ff, x: width * 0.4, label: 'WATER' },
            { color: 0x88aa44, x: width * 0.6, label: 'EARTH' },
            { color: 0xaaaaff, x: width * 0.8, label: 'AIR' }
        ];
        
        elements.forEach((element, index) => {
            const circle = this.add.circle(element.x, height * 0.5, 25, element.color, 0.8);
            
            // Pulsing animation with staggered timing
            this.tweens.add({
                targets: circle,
                scale: 1.3,
                alpha: 1,
                duration: 1000,
                delay: index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            const label = this.add.text(element.x, height * 0.5 + 40, element.label, {
                fontSize: '14px',
                fill: '#ffffff'
            });
            label.setOrigin(0.5);
        });
    }
}
