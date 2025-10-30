class Projectile {
    constructor(scene, x, y, target, towerConfig) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = target;
        this.config = towerConfig;
        this.shouldRemove = false;
        this.currentTime = 0;
        
        this.speed = this.config.projectileSpeed;
        
        this.createVisuals();
    }
    
    createVisuals() {
        // Main projectile
        this.sprite = this.scene.add.circle(this.x, this.y, 5, this.config.projectileColor);
        
        // Projectile trail/glow
        this.trail = this.scene.add.circle(this.x, this.y, 7, this.config.projectileColor, 0.5);
        
        // Pulsing animation for projectile
        this.scene.tweens.add({
            targets: this.trail,
            scale: 1.3,
            alpha: 0.2,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    update(time, delta) {
        if (this.shouldRemove) return;
        
        this.currentTime = time;
        
        // Check if target is still valid
        if (!this.target || this.target.isDead) {
            this.shouldRemove = true;
            this.destroy();
            return;
        }
        
        // Move toward target
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            // Hit target
            this.hitTarget();
            return;
        }
        
        // Calculate movement with smooth interpolation
        const moveDistance = (this.speed * delta) / 1000;
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
        
        // Update visuals smoothly
        this.sprite.setPosition(this.x, this.y);
        this.trail.setPosition(this.x, this.y);
        
        // Rotate sprite based on direction for visual effect
        const angle = Math.atan2(dy, dx);
        this.sprite.rotation = angle;
    }
    
    hitTarget() {
        // Deal damage
        const slowEffect = this.config.slowEffect || 0;
        const slowDuration = slowEffect > 0 ? 2000 : 0;
        this.target.takeDamage(this.config.damage, slowEffect, slowDuration, this.currentTime);
        
        // Create impact effect
        this.createImpactEffect();
        
        // Remove projectile
        this.shouldRemove = true;
        this.destroy();
    }
    
    createImpactEffect() {
        // Impact flash
        const flash = this.scene.add.circle(this.x, this.y, 15, this.config.projectileColor, 0.8);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => flash.destroy()
        });
        
        // Particle burst
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const particle = this.scene.add.circle(this.x, this.y, 3, this.config.projectileColor);
            
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * 20,
                y: this.y + Math.sin(angle) * 20,
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Quad.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.trail) {
            this.trail.destroy();
            this.trail = null;
        }
    }
}
