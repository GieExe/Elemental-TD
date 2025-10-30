class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize game state
        this.gold = gameConfig.startingGold;
        this.lives = gameConfig.startingLives;
        this.currentWave = 0;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.selectedTowerType = null;
        this.previewTower = null;
        
        // Calculate actual path coordinates
        this.pathCoords = gameConfig.pathWaypoints.map(wp => ({
            x: wp.x * gameConfig.tileSize + gameConfig.tileSize / 2,
            y: wp.y * gameConfig.tileSize + gameConfig.tileSize / 2
        }));
        
        // Create game background and grid
        this.createBackground();
        this.createPath();
        this.createGrid();
        
        // Create UI
        this.createUI();
        
        // Setup input
        this.setupInput();
        
        // Start first wave after a delay
        this.time.delayedCall(2000, () => this.startWave());
    }

    createBackground() {
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a4d1a, 0x1a4d1a, 0x0f3a0f, 0x0f3a0f, 1);
        graphics.fillRect(0, 0, 
            gameConfig.gridWidth * gameConfig.tileSize, 
            gameConfig.gridHeight * gameConfig.tileSize);
    }

    createPath() {
        const graphics = this.add.graphics();
        graphics.lineStyle(gameConfig.tileSize * 0.6, 0x8b7355, 1);
        
        // Draw path
        graphics.beginPath();
        graphics.moveTo(this.pathCoords[0].x, this.pathCoords[0].y);
        
        for (let i = 1; i < this.pathCoords.length; i++) {
            graphics.lineTo(this.pathCoords[i].x, this.pathCoords[i].y);
        }
        
        graphics.strokePath();
        
        // Add decorative path border
        graphics.lineStyle(gameConfig.tileSize * 0.7, 0x6b5d4f, 0.5);
        graphics.beginPath();
        graphics.moveTo(this.pathCoords[0].x, this.pathCoords[0].y);
        
        for (let i = 1; i < this.pathCoords.length; i++) {
            graphics.lineTo(this.pathCoords[i].x, this.pathCoords[i].y);
        }
        
        graphics.strokePath();
    }

    createGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x444444, 0.3);
        
        // Draw grid lines
        for (let x = 0; x <= gameConfig.gridWidth; x++) {
            graphics.moveTo(x * gameConfig.tileSize, 0);
            graphics.lineTo(x * gameConfig.tileSize, gameConfig.gridHeight * gameConfig.tileSize);
        }
        
        for (let y = 0; y <= gameConfig.gridHeight; y++) {
            graphics.moveTo(0, y * gameConfig.tileSize);
            graphics.lineTo(gameConfig.gridWidth * gameConfig.tileSize, y * gameConfig.tileSize);
        }
        
        graphics.strokePath();
    }

    createUI() {
        const uiY = gameConfig.gridHeight * gameConfig.tileSize + 10;
        const uiHeight = 100;
        
        // UI background
        const uiBg = this.add.rectangle(
            0, gameConfig.gridHeight * gameConfig.tileSize,
            gameConfig.gridWidth * gameConfig.tileSize, uiHeight,
            0x222222, 0.9
        );
        uiBg.setOrigin(0, 0);
        
        // Stats display
        this.goldText = this.add.text(20, uiY, `Gold: ${this.gold}`, {
            fontSize: '20px',
            fill: '#ffd700',
            fontStyle: 'bold'
        });
        
        this.livesText = this.add.text(20, uiY + 30, `Lives: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff4444',
            fontStyle: 'bold'
        });
        
        this.waveText = this.add.text(20, uiY + 60, `Wave: ${this.currentWave}`, {
            fontSize: '20px',
            fill: '#44ff44',
            fontStyle: 'bold'
        });
        
        // Tower selection buttons
        this.createTowerButtons(uiY);
    }

    createTowerButtons(uiY) {
        const startX = 250;
        const spacing = 120;
        const towerKeys = Object.keys(gameConfig.towerTypes);
        
        this.towerButtons = [];
        
        towerKeys.forEach((key, index) => {
            const tower = gameConfig.towerTypes[key];
            const x = startX + index * spacing;
            
            // Button background
            const button = this.add.rectangle(x, uiY + 35, 100, 70, 0x333333);
            button.setStrokeStyle(2, tower.color);
            button.setInteractive({ useHandCursor: true });
            
            // Tower icon
            const icon = this.add.circle(x, uiY + 25, 15, tower.color);
            
            // Tower name and cost
            const nameText = this.add.text(x, uiY + 50, tower.name.split(' ')[0], {
                fontSize: '14px',
                fill: '#ffffff'
            });
            nameText.setOrigin(0.5);
            
            const costText = this.add.text(x, uiY + 68, `${tower.cost}g`, {
                fontSize: '12px',
                fill: '#ffd700'
            });
            costText.setOrigin(0.5);
            
            // Button interactions
            button.on('pointerover', () => {
                button.setFillStyle(0x444444);
                this.tweens.add({
                    targets: [button, icon, nameText, costText],
                    scale: 1.1,
                    duration: 100
                });
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(0x333333);
                this.tweens.add({
                    targets: [button, icon, nameText, costText],
                    scale: 1,
                    duration: 100
                });
            });
            
            button.on('pointerdown', () => {
                if (this.gold >= tower.cost) {
                    this.selectedTowerType = key;
                    this.updateButtonSelection();
                }
            });
            
            this.towerButtons.push({ button, icon, nameText, costText, key });
        });
    }

    updateButtonSelection() {
        this.towerButtons.forEach(btn => {
            if (btn.key === this.selectedTowerType) {
                btn.button.setFillStyle(0x555555);
                btn.button.setStrokeStyle(3, 0xffffff);
            } else {
                btn.button.setFillStyle(0x333333);
                const tower = gameConfig.towerTypes[btn.key];
                btn.button.setStrokeStyle(2, tower.color);
            }
        });
    }

    setupInput() {
        this.input.on('pointermove', (pointer) => {
            if (this.selectedTowerType && pointer.y < gameConfig.gridHeight * gameConfig.tileSize) {
                const gridX = Math.floor(pointer.x / gameConfig.tileSize);
                const gridY = Math.floor(pointer.y / gameConfig.tileSize);
                
                if (!this.previewTower) {
                    const tower = gameConfig.towerTypes[this.selectedTowerType];
                    this.previewTower = this.add.circle(0, 0, 20, tower.color, 0.5);
                    this.previewRange = this.add.circle(0, 0, tower.range, tower.color, 0.1);
                    this.previewRange.setStrokeStyle(2, tower.color, 0.3);
                }
                
                this.previewTower.setPosition(
                    gridX * gameConfig.tileSize + gameConfig.tileSize / 2,
                    gridY * gameConfig.tileSize + gameConfig.tileSize / 2
                );
                this.previewRange.setPosition(
                    gridX * gameConfig.tileSize + gameConfig.tileSize / 2,
                    gridY * gameConfig.tileSize + gameConfig.tileSize / 2
                );
                
                // Check if valid placement
                const canPlace = this.canPlaceTower(gridX, gridY);
                this.previewTower.setAlpha(canPlace ? 0.7 : 0.3);
            } else if (this.previewTower) {
                this.previewTower.destroy();
                this.previewRange.destroy();
                this.previewTower = null;
                this.previewRange = null;
            }
        });
        
        this.input.on('pointerdown', (pointer) => {
            if (this.selectedTowerType && pointer.y < gameConfig.gridHeight * gameConfig.tileSize) {
                const gridX = Math.floor(pointer.x / gameConfig.tileSize);
                const gridY = Math.floor(pointer.y / gameConfig.tileSize);
                
                if (this.canPlaceTower(gridX, gridY)) {
                    this.placeTower(gridX, gridY, this.selectedTowerType);
                }
            }
        });
    }

    canPlaceTower(gridX, gridY) {
        // Check if on path
        const x = gridX * gameConfig.tileSize + gameConfig.tileSize / 2;
        const y = gridY * gameConfig.tileSize + gameConfig.tileSize / 2;
        
        for (let i = 0; i < this.pathCoords.length - 1; i++) {
            const dist = this.distanceToLineSegment(
                x, y,
                this.pathCoords[i].x, this.pathCoords[i].y,
                this.pathCoords[i + 1].x, this.pathCoords[i + 1].y
            );
            if (dist < gameConfig.tileSize * 0.5) return false;
        }
        
        // Check if tower already exists
        for (let tower of this.towers) {
            if (tower.gridX === gridX && tower.gridY === gridY) return false;
        }
        
        return true;
    }

    distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        
        if (len2 === 0) return Math.hypot(px - x1, py - y1);
        
        let t = ((px - x1) * dx + (py - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        
        return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }

    placeTower(gridX, gridY, type) {
        const towerConfig = gameConfig.towerTypes[type];
        
        if (this.gold >= towerConfig.cost) {
            this.gold -= towerConfig.cost;
            this.goldText.setText(`Gold: ${this.gold}`);
            
            const tower = new Tower(this, gridX, gridY, type);
            this.towers.push(tower);
            
            // Clear selection
            this.selectedTowerType = null;
            this.updateButtonSelection();
            
            if (this.previewTower) {
                this.previewTower.destroy();
                this.previewRange.destroy();
                this.previewTower = null;
                this.previewRange = null;
            }
            
            // Placement animation
            this.tweens.add({
                targets: tower.sprite,
                scale: { from: 0, to: 1 },
                duration: 300,
                ease: 'Back.easeOut'
            });
        }
    }

    startWave() {
        if (this.currentWave >= gameConfig.waves.length) {
            this.showVictory();
            return;
        }
        
        const wave = gameConfig.waves[this.currentWave];
        this.currentWave++;
        this.waveText.setText(`Wave: ${this.currentWave}`);
        
        // Spawn enemies
        for (let i = 0; i < wave.count; i++) {
            this.time.delayedCall(i * 1000, () => {
                const enemy = new Enemy(this, wave.health, wave.speed, wave.reward);
                this.enemies.push(enemy);
            });
        }
        
        // Show wave notification
        this.showWaveNotification(this.currentWave);
    }

    showWaveNotification(wave) {
        const text = this.add.text(
            gameConfig.gridWidth * gameConfig.tileSize / 2,
            gameConfig.gridHeight * gameConfig.tileSize / 2,
            `Wave ${wave}!`,
            {
                fontSize: '48px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );
        text.setOrigin(0.5);
        text.setAlpha(0);
        
        this.tweens.add({
            targets: text,
            alpha: 1,
            scale: { from: 0.5, to: 1.5 },
            duration: 500,
            yoyo: true,
            onComplete: () => text.destroy()
        });
    }

    showVictory() {
        const text = this.add.text(
            gameConfig.gridWidth * gameConfig.tileSize / 2,
            gameConfig.gridHeight * gameConfig.tileSize / 2,
            'VICTORY!\nAll Waves Defeated!',
            {
                fontSize: '48px',
                fill: '#44ff44',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold',
                align: 'center'
            }
        );
        text.setOrigin(0.5);
        
        this.tweens.add({
            targets: text,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    update(time, delta) {
        // Update towers
        this.towers.forEach(tower => tower.update(time, delta, this.enemies));
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(time, delta);
            
            if (enemy.isDead) {
                this.gold += enemy.reward;
                this.goldText.setText(`Gold: ${this.gold}`);
                this.enemies.splice(i, 1);
            } else if (enemy.reachedEnd) {
                this.lives--;
                this.livesText.setText(`Lives: ${this.lives}`);
                this.enemies.splice(i, 1);
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(time, delta);
            
            if (projectile.shouldRemove) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Check if wave is complete
        if (this.enemies.length === 0 && this.currentWave > 0 && this.currentWave < gameConfig.waves.length) {
            this.time.delayedCall(3000, () => this.startWave());
        }
    }

    gameOver() {
        const overlay = this.add.rectangle(
            0, 0,
            gameConfig.gridWidth * gameConfig.tileSize,
            gameConfig.gridHeight * gameConfig.tileSize,
            0x000000, 0.7
        );
        overlay.setOrigin(0, 0);
        
        const text = this.add.text(
            gameConfig.gridWidth * gameConfig.tileSize / 2,
            gameConfig.gridHeight * gameConfig.tileSize / 2,
            'GAME OVER',
            {
                fontSize: '64px',
                fill: '#ff4444',
                stroke: '#000000',
                strokeThickness: 8,
                fontStyle: 'bold'
            }
        );
        text.setOrigin(0.5);
        
        const restartText = this.add.text(
            gameConfig.gridWidth * gameConfig.tileSize / 2,
            gameConfig.gridHeight * gameConfig.tileSize / 2 + 80,
            'Click to Restart',
            {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: { x: 20, y: 10 }
            }
        );
        restartText.setOrigin(0.5);
        restartText.setInteractive({ useHandCursor: true });
        
        restartText.on('pointerdown', () => {
            this.scene.restart();
        });
        
        this.tweens.add({
            targets: restartText,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
}
