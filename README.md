# Elemental Tower Defense

A tower defense game built with Phaser 3 featuring smooth animations and elemental tower types.

## Features

- **4 Elemental Tower Types:**
  - 🔥 **Fire Tower**: High damage, medium range
  - 💧 **Water Tower**: Medium damage, long range, slows enemies
  - 🌍 **Earth Tower**: Very high damage, short range, slow fire rate
  - 💨 **Air Tower**: Low damage, longest range, fast fire rate

- **Smooth Animations:**
  - Tower placement with scaling effect
  - Projectile tracking with trail effects
  - Enemy death explosions
  - UI button hover effects
  - Tower turret rotation
  - Impact effects on hit

- **Wave-based Gameplay:**
  - 5 waves of increasing difficulty
  - Enemies get stronger with each wave
  - Strategic tower placement required

## How to Play

1. Install dependencies: `npm install`
2. Start the game server: `npm start`
3. Open your browser to `http://localhost:8080`
4. Click "PLAY GAME" to start
5. Select a tower type from the bottom menu
6. Click on the grid to place towers
7. Defend against waves of enemies
8. Don't let enemies reach the end of the path!

## Controls

- **Mouse Click**: Place selected tower
- **Tower Buttons**: Select tower type to place

## Game Mechanics

- **Gold**: Earn gold by defeating enemies, spend it to build towers
- **Lives**: Lose lives when enemies reach the end
- **Towers**: Each tower type has unique strengths
- **Strategy**: Place towers strategically along the path

## Technical Details

- Built with Phaser 3.70.0
- Pure JavaScript (no bundler required)
- Smooth animations using Phaser's tween system
- Efficient sprite management and updates
- Responsive design with proper scaling

## Development

The game uses a simple structure:
- `js/config.js` - Game configuration and balance
- `js/scenes/` - Game scenes (Boot, MainMenu, Game)
- `js/entities/` - Game entities (Tower, Enemy, Projectile)
- `js/main.js` - Game initialization

All animations are implemented using Phaser's built-in tween system for smooth, hardware-accelerated performance.
