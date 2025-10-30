// Game configuration
const gameConfig = {
    tileSize: 64,
    gridWidth: 12,
    gridHeight: 10,
    
    // Tower types with their properties
    towerTypes: {
        fire: {
            name: 'Fire Tower',
            damage: 25,
            range: 150,
            fireRate: 1000,
            cost: 100,
            color: 0xff4444,
            projectileColor: 0xff6600,
            projectileSpeed: 300
        },
        water: {
            name: 'Water Tower',
            damage: 15,
            range: 180,
            fireRate: 800,
            cost: 120,
            color: 0x4444ff,
            projectileColor: 0x6699ff,
            projectileSpeed: 350,
            slowEffect: 0.5 // Slows enemies to 50% speed
        },
        earth: {
            name: 'Earth Tower',
            damage: 40,
            range: 120,
            fireRate: 1500,
            cost: 150,
            color: 0x88aa44,
            projectileColor: 0xaa8844,
            projectileSpeed: 250
        },
        air: {
            name: 'Air Tower',
            damage: 10,
            range: 200,
            fireRate: 600,
            cost: 90,
            color: 0xaaaaff,
            projectileColor: 0xddddff,
            projectileSpeed: 400
        }
    },
    
    // Enemy wave configuration
    waves: [
        { count: 5, health: 100, speed: 50, reward: 10 },
        { count: 8, health: 120, speed: 55, reward: 12 },
        { count: 10, health: 150, speed: 60, reward: 15 },
        { count: 12, health: 180, speed: 65, reward: 18 },
        { count: 15, health: 220, speed: 70, reward: 20 }
    ],
    
    // Path waypoints (will be set relative to grid)
    pathWaypoints: [
        { x: 0, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 2 },
        { x: 6, y: 2 },
        { x: 6, y: 7 },
        { x: 9, y: 7 },
        { x: 9, y: 4 },
        { x: 12, y: 4 }
    ],
    
    startingGold: 250,
    startingLives: 20
};
