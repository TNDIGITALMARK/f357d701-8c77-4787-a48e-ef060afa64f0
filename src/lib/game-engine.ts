/**
 * ORBITAL SNAKES - GAME ENGINE
 * Core game logic for slither.io-style multiplayer snake game
 */

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  position: Position;
  segments: Position[];
  length: number;
  score: number;
  eliminationCount: number;
  speed: number;
  angle: number;
  isAlive: boolean;
}

export interface FoodPellet {
  id: string;
  position: Position;
  value: number;
  isSpecial: boolean;
  color: string;
}

export interface Particle {
  id: string;
  position: Position;
  velocity: Position;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  players: Map<string, Player>;
  food: FoodPellet[];
  particles: Particle[];
  canvasWidth: number;
  canvasHeight: number;
  lastUpdate: number;
  gameOver: boolean;
  winner: Player | null;
}

export const GAME_CONFIG = {
  BASE_SPEED: 0.9,  // Further reduced from 1.2 to 0.9 for slower, more strategic gameplay
  BOOST_SPEED: 1.8,  // Reduced from 2.4 to 1.8 for safer boost speed
  SEGMENT_DISTANCE: 8,
  INITIAL_LENGTH: 10,
  FOOD_COUNT: 500,  // Increased from 400 to 500 for more food availability
  SPECIAL_FOOD_INTERVAL: 30000, // 30 seconds
  COLLISION_DISTANCE: 8,  // Reduced from 10 to 8 for more forgiving collisions
  GROWTH_PER_FOOD: 1,
  CANVAS_PADDING: 50,
  SNAKE_COLORS: [
    '#00d9ff', // Cyan
    '#ff00aa', // Magenta
    '#d4ff00', // Yellow
    '#00ff88', // Green
    '#ff6b00', // Orange
    '#8b5cf6', // Purple
    '#ff0066', // Hot Pink
    '#00ffff', // Aqua
    '#ff9900', // Amber
    '#66ff00', // Lime
    '#9933ff', // Violet
    '#ff3366', // Rose
  ],
};

export class GameEngine {
  private gameState: GameState;
  private animationId: number | null = null;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.gameState = {
      players: new Map(),
      food: [],
      particles: [],
      canvasWidth,
      canvasHeight,
      lastUpdate: Date.now(),
      gameOver: false,
      winner: null,
    };
    this.initializeFood();
    this.initializeBots();
  }

  private initializeBots() {
    const botNames = [
      'NeonViper', 'PixelPython', 'CosmicCrusher', 'ElectricEel',
      'GalacticGlider', 'TurboSerpent', 'OrbitMaster', 'StarStrike',
      'VoidReaper', 'NovaBlitz', 'QuantumSlither', 'EchoStorm',
      'PhaseShifter', 'SolarFang', 'NightCrawler', 'VortexKing',
      'AstralRider', 'CyberSerpent', 'NebulaNinja', 'PhotonPhantom',
      'PlasmaKnight', 'StellarSlayer', 'TitanTail', 'UltraVenom',
      'WarpWorm', 'XenonX', 'ZephyrZen', 'ApexAdder'
    ];

    // Add 24-28 bot players for much longer gameplay (3-5+ minute matches)
    const botCount = 24 + Math.floor(Math.random() * 5);
    for (let i = 0; i < botCount; i++) {
      const botName = botNames[i % botNames.length];
      this.createPlayer(`bot-${i}`, `${botName}${i > botNames.length - 1 ? i : ''}`);
    }
  }

  private initializeFood() {
    for (let i = 0; i < GAME_CONFIG.FOOD_COUNT; i++) {
      this.gameState.food.push(this.createFoodPellet());
    }
  }

  private createFoodPellet(isSpecial: boolean = false): FoodPellet {
    const colors = ['#00d9ff', '#ff00aa', '#d4ff00', '#00ff88', '#ff6b00'];
    return {
      id: `food-${Date.now()}-${Math.random()}`,
      position: {
        x: Math.random() * (this.gameState.canvasWidth - 100) + 50,
        y: Math.random() * (this.gameState.canvasHeight - 100) + 50,
      },
      value: isSpecial ? 10 : Math.floor(Math.random() * 3) + 1,
      isSpecial,
      color: isSpecial ? '#ffff00' : colors[Math.floor(Math.random() * colors.length)],
    };
  }

  createPlayer(id: string, name: string, customColor?: string): Player {
    const color = customColor || GAME_CONFIG.SNAKE_COLORS[
      this.gameState.players.size % GAME_CONFIG.SNAKE_COLORS.length
    ];

    const startX = Math.random() * (this.gameState.canvasWidth - 200) + 100;
    const startY = Math.random() * (this.gameState.canvasHeight - 200) + 100;

    const segments: Position[] = [];
    for (let i = 0; i < GAME_CONFIG.INITIAL_LENGTH; i++) {
      segments.push({ x: startX - i * GAME_CONFIG.SEGMENT_DISTANCE, y: startY });
    }

    const player: Player = {
      id,
      name,
      color,
      position: { x: startX, y: startY },
      segments,
      length: GAME_CONFIG.INITIAL_LENGTH,
      score: 0,
      eliminationCount: 0,
      speed: GAME_CONFIG.BASE_SPEED,
      angle: 0,
      isAlive: true,
    };

    this.gameState.players.set(id, player);
    return player;
  }

  updatePlayerDirection(playerId: string, mouseX: number, mouseY: number) {
    const player = this.gameState.players.get(playerId);
    if (!player || !player.isAlive) return;

    const dx = mouseX - player.position.x;
    const dy = mouseY - player.position.y;
    player.angle = Math.atan2(dy, dx);
  }

  updatePlayerSpeed(playerId: string, isBoosting: boolean) {
    const player = this.gameState.players.get(playerId);
    if (!player || !player.isAlive) return;

    player.speed = isBoosting ? GAME_CONFIG.BOOST_SPEED : GAME_CONFIG.BASE_SPEED;
  }

  update(deltaTime: number) {
    const now = Date.now();

    // Update all players
    this.gameState.players.forEach(player => {
      if (!player.isAlive) return;

      // Bot AI: move towards nearest food or away from danger
      if (player.id.startsWith('bot-')) {
        this.updateBotBehavior(player);
      }

      // Move player
      player.position.x += Math.cos(player.angle) * player.speed;
      player.position.y += Math.sin(player.angle) * player.speed;

      // Wrap around canvas edges
      if (player.position.x < 0) player.position.x = this.gameState.canvasWidth;
      if (player.position.x > this.gameState.canvasWidth) player.position.x = 0;
      if (player.position.y < 0) player.position.y = this.gameState.canvasHeight;
      if (player.position.y > this.gameState.canvasHeight) player.position.y = 0;

      // Update segments
      player.segments.unshift({ ...player.position });
      if (player.segments.length > player.length) {
        player.segments.pop();
      }

      // Check food collision
      this.checkFoodCollision(player);

      // Check self collision
      this.checkSelfCollision(player);

      // Check other player collisions
      this.checkPlayerCollisions(player);
    });

    // Update particles
    this.gameState.particles = this.gameState.particles.filter(particle => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.life -= deltaTime;
      return particle.life > 0;
    });

    this.gameState.lastUpdate = now;
  }

  private checkFoodCollision(player: Player) {
    for (let i = this.gameState.food.length - 1; i >= 0; i--) {
      const food = this.gameState.food[i];
      const distance = Math.hypot(
        player.position.x - food.position.x,
        player.position.y - food.position.y
      );

      if (distance < 15) {
        // Player ate the food
        player.length += GAME_CONFIG.GROWTH_PER_FOOD;
        player.score += food.value;
        this.createParticles(food.position, food.color);

        // Remove food and create new one
        this.gameState.food.splice(i, 1);
        this.gameState.food.push(this.createFoodPellet());
      }
    }
  }

  private checkSelfCollision(player: Player) {
    const head = player.position;

    // Check collision with own body (skip first few segments)
    for (let i = 10; i < player.segments.length; i++) {
      const segment = player.segments[i];
      const distance = Math.hypot(head.x - segment.x, head.y - segment.y);

      if (distance < GAME_CONFIG.COLLISION_DISTANCE) {
        this.eliminatePlayer(player);
        return;
      }
    }
  }

  private checkPlayerCollisions(player: Player) {
    const head = player.position;

    this.gameState.players.forEach(otherPlayer => {
      if (otherPlayer.id === player.id || !otherPlayer.isAlive) return;

      // Check collision with other player's body
      otherPlayer.segments.forEach((segment, index) => {
        if (index === 0) return; // Skip head-to-head collision

        const distance = Math.hypot(head.x - segment.x, head.y - segment.y);

        if (distance < GAME_CONFIG.COLLISION_DISTANCE) {
          this.eliminatePlayer(player);
          otherPlayer.eliminationCount++;
          otherPlayer.score += Math.floor(player.length / 2);
        }
      });
    });
  }

  private eliminatePlayer(player: Player) {
    player.isAlive = false;

    // Create food from player's body
    player.segments.forEach((segment, index) => {
      if (index % 3 === 0) {
        this.gameState.food.push({
          id: `food-death-${Date.now()}-${index}`,
          position: { ...segment },
          value: 1,
          isSpecial: false,
          color: player.color,
        });
      }
    });

    // Create explosion particles
    this.createExplosionParticles(player.position, player.color);

    // Check for victory condition - only one player left alive
    this.checkVictoryCondition();

    // Don't respawn bots - last man standing mode
    // Bots that are eliminated stay eliminated for true battle royale gameplay
  }

  private checkVictoryCondition() {
    const alivePlayers = Array.from(this.gameState.players.values()).filter(p => p.isAlive);

    if (alivePlayers.length === 1) {
      // We have a winner!
      this.gameState.gameOver = true;
      this.gameState.winner = alivePlayers[0];
    } else if (alivePlayers.length === 0) {
      // Everyone died (shouldn't happen but just in case)
      this.gameState.gameOver = true;
      this.gameState.winner = null;
    }
  }

  private createParticles(position: Position, color: string) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      this.gameState.particles.push({
        id: `particle-${Date.now()}-${i}`,
        position: { ...position },
        velocity: {
          x: Math.cos(angle) * 2,
          y: Math.sin(angle) * 2,
        },
        life: 500,
        maxLife: 500,
        color,
        size: 3,
      });
    }
  }

  private createExplosionParticles(position: Position, color: string) {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 3 + Math.random() * 3;
      this.gameState.particles.push({
        id: `explosion-${Date.now()}-${i}`,
        position: { ...position },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        life: 1000,
        maxLife: 1000,
        color,
        size: 5,
      });
    }
  }

  private updateBotBehavior(bot: Player) {
    // Simple AI: find nearest food and move towards it
    let nearestFood: FoodPellet | null = null;
    let nearestDistance = Infinity;

    this.gameState.food.forEach(food => {
      const distance = Math.hypot(
        bot.position.x - food.position.x,
        bot.position.y - food.position.y
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestFood = food;
      }
    });

    if (nearestFood) {
      // Move towards nearest food with some randomness
      const targetAngle = Math.atan2(
        nearestFood.position.y - bot.position.y,
        nearestFood.position.x - bot.position.x
      );

      // Add some randomness to make movement less robotic
      const randomness = (Math.random() - 0.5) * 0.3;
      bot.angle = targetAngle + randomness;
    } else {
      // Random wandering if no food nearby
      if (Math.random() < 0.02) {
        bot.angle += (Math.random() - 0.5) * 0.5;
      }
    }

    // Very rarely boost (reduced to 0.1%) and return to normal more often
    // This makes bots much more cautious and reduces collision deaths dramatically
    if (Math.random() < 0.001) {
      bot.speed = GAME_CONFIG.BOOST_SPEED;
    } else if (Math.random() < 0.02) {
      bot.speed = GAME_CONFIG.BASE_SPEED;
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getLeaderboard(): Array<{ name: string; score: number; length: number }> {
    return Array.from(this.gameState.players.values())
      .filter(p => p.isAlive)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        score: p.score,
        length: p.length,
      }));
  }

  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
