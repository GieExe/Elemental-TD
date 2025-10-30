class Enemy {
    constructor(scene, health, speed, reward) {
        this.scene = scene;
        this.maxHealth = health;
        this.health = health;
        this.baseSpeed = speed;
        this.speed = speed;
        this.reward = reward;
        
        this.pathIndex = 0;
        this.pathProgress = 0;
        this.isDead = false;
        this.reachedEnd = false;
        
        this.slowEffect = 1; // Speed multiplier for slow effects
        this.slowEndTime = 0; // Game time when slow effect ends
        
        // Start at first waypoint
        const startPos = this.scene.pathCoords[0];
        this.x = startPos.x;
        this.y = startPos.y;
        
        this.createVisuals();
    }
    
    createVisuals() {
        // Enemy body
        this.sprite = this.scene.add.circle(this.x, this.y, 12, 0xff0000);
        
        // Enemy outline
        this.outline = this.scene.add.circle(this.x, this.y, 14, 0x000000, 0.5);
        
        // Health bar background
        this.healthBarBg = this.scene.add.rectangle(this.x, this.y - 20, 24, 4, 0x000000);
        
        // Health bar
        this.healthBar = this.scene.add.rectangle(this.x - 12, this.y - 20, 24, 4, 0x00ff00);
        this.healthBar.setOrigin(0, 0.5);
        
        // Add spawn animation
        this.sprite.setScale(0);
        this.scene.tweens.add({
            targets: [this.sprite, this.outline],
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
    
    update(time, delta) {
        if (this.isDead || this.reachedEnd) return;
        
        // Update slow effect
        if (time > this.slowEndTime) {
            this.slowEffect = 1;
            this.speed = this.baseSpeed;
        }
        
        // Move along path
        const targetPos = this.scene.pathCoords[this.pathIndex + 1];
        if (!targetPos) {
            this.reachedEnd = true;
            this.destroy();
            return;
        }
        
        const dx = targetPos.x - this.x;
        const dy = targetPos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
            // Reached waypoint, move to next
            this.pathIndex++;
            this.pathProgress = this.pathIndex;
            
            if (this.pathIndex >= this.scene.pathCoords.length - 1) {
                this.reachedEnd = true;
                this.destroy();
                return;
            }
        } else {
            // Move toward target
            const moveDistance = (this.speed * delta) / 1000;
            this.x += (dx / distance) * moveDistance;
            this.y += (dy / distance) * moveDistance;
            this.pathProgress = this.pathIndex + (1 - distance / Phaser.Math.Distance.Between(
                this.scene.pathCoords[this.pathIndex].x,
                this.scene.pathCoords[this.pathIndex].y,
                targetPos.x,
                targetPos.y
            ));
        }
        
        // Update visuals smoothly
        this.updateVisuals();
    }
    
    updateVisuals() {
        this.sprite.setPosition(this.x, this.y);
        this.outline.setPosition(this.x, this.y);
        this.healthBarBg.setPosition(this.x, this.y - 20);
        this.healthBar.setPosition(this.x - 12, this.y - 20);
        
        // Update health bar
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.width = 24 * healthPercent;
        
        // Color health bar based on health
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xffff00);
        } else {
            this.healthBar.setFillStyle(0xff0000);
        }
        
        // Show slow effect
        if (this.slowEffect < 1) {
            this.sprite.setFillStyle(0x8888ff);
        } else {
            this.sprite.setFillStyle(0xff0000);
        }
    }
    
    takeDamage(damage, slowEffect = 0, slowDuration = 0, currentTime = 0) {
        this.health -= damage;
        
        // Apply slow effect
        if (slowEffect > 0) {
            this.slowEffect = slowEffect;
            this.speed = this.baseSpeed * slowEffect;
            this.slowEndTime = currentTime + slowDuration;
        }
        
        // Damage flash animation
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 1.3,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isDead = true;
        
        // Death animation
        this.scene.tweens.add({
            targets: [this.sprite, this.outline],
            scale: 0,
            alpha: 0,
            duration: 200,
            ease: 'Back.easeIn',
            onComplete: () => this.destroy()
        });
        
        // Create explosion effect
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = this.scene.add.circle(this.x, this.y, 4, 0xff0000);
            
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * 30,
                y: this.y + Math.sin(angle) * 30,
                alpha: 0,
                scale: 0,
                duration: 300,
                ease: 'Quad.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.outline) this.outline.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
    }
}
