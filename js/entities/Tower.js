class Tower {
    constructor(scene, gridX, gridY, type) {
        this.scene = scene;
        this.gridX = gridX;
        this.gridY = gridY;
        this.type = type;
        this.config = gameConfig.towerTypes[type];
        
        this.x = gridX * gameConfig.tileSize + gameConfig.tileSize / 2;
        this.y = gridY * gameConfig.tileSize + gameConfig.tileSize / 2;
        
        this.lastFireTime = 0;
        this.target = null;
        
        this.createVisuals();
    }
    
    createVisuals() {
        // Tower base
        this.base = this.scene.add.circle(this.x, this.y, 22, 0x666666);
        
        // Tower body
        this.sprite = this.scene.add.circle(this.x, this.y, 18, this.config.color);
        
        // Tower top (turret)
        this.turret = this.scene.add.rectangle(this.x, this.y - 12, 8, 16, this.config.color);
        this.turret.setOrigin(0.5, 1);
        
        // Add glow effect
        this.glow = this.scene.add.circle(this.x, this.y, 20, this.config.color, 0.3);
        
        // Pulsing animation for glow
        this.scene.tweens.add({
            targets: this.glow,
            scale: 1.2,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    update(time, delta, enemies) {
        // Find target
        if (!this.target || this.target.isDead || !this.isInRange(this.target)) {
            this.target = this.findTarget(enemies);
        }
        
        // Aim at target
        if (this.target) {
            const angle = Phaser.Math.Angle.Between(
                this.x, this.y,
                this.target.x, this.target.y
            );
            
            // Smooth rotation using tweens for smooth animation
            this.scene.tweens.add({
                targets: this.turret,
                rotation: angle + Math.PI / 2,
                duration: 100,
                ease: 'Sine.easeOut'
            });
            
            // Fire projectile
            if (time - this.lastFireTime > this.config.fireRate) {
                this.fire();
                this.lastFireTime = time;
            }
        }
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let maxProgress = -1;
        
        for (let enemy of enemies) {
            if (this.isInRange(enemy) && enemy.pathProgress > maxProgress) {
                maxProgress = enemy.pathProgress;
                closestEnemy = enemy;
            }
        }
        
        return closestEnemy;
    }
    
    isInRange(enemy) {
        const dist = Phaser.Math.Distance.Between(
            this.x, this.y,
            enemy.x, enemy.y
        );
        return dist <= this.config.range;
    }
    
    fire() {
        if (!this.target) return;
        
        // Create firing animation - turret recoil
        this.scene.tweens.add({
            targets: this.turret,
            scaleY: 0.7,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
        
        // Flash effect
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 1.5,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
        
        // Create projectile
        const projectile = new Projectile(
            this.scene,
            this.x,
            this.y,
            this.target,
            this.config
        );
        this.scene.projectiles.push(projectile);
    }
    
    destroy() {
        this.base.destroy();
        this.sprite.destroy();
        this.turret.destroy();
        this.glow.destroy();
    }
}
