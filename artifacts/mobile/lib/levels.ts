export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export type ObjectiveType = 'reach-tile' | 'score' | 'merges';

export interface LevelObjective {
  type: ObjectiveType;
  target: number;
}

export interface Level {
  id: number;
  difficulty: Difficulty;
  objective: LevelObjective;
  moveLimit: number;
  starThresholds: {
    two: number;
    three: number;
  };
}

export const LEVELS: Level[] = Array.from({ length: 200 }, (_, i) => {
  const id = i + 1;

  // Star factors get progressively harder as level increases
  const progress = (id - 1) / 199; // 0 at level 1, 1 at level 200
  const threeStarFactor = 0.55 + progress * 0.22; // 0.55 → 0.77
  const twoStarFactor   = 0.76 + progress * 0.16; // 0.76 → 0.92

  let difficulty: Difficulty;
  let objective: LevelObjective;
  let moveLimit: number;

  if (id <= 33) {
    // ── Easy ──────────────────────────────────────────────────────────────
    difficulty = 'easy';
    if (id % 2 !== 0) {
      const target = id < 10 ? 16 : id < 20 ? 32 : 64;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 10 ? 5 : id < 20 ? 10 : 15;
      objective = { type: 'merges', target };
    }
    moveLimit = Math.max(50, 83 - id); // 82 → 50

  } else if (id <= 66) {
    // ── Medium ────────────────────────────────────────────────────────────
    difficulty = 'medium';
    const n = id - 33;
    if (id % 2 !== 0) {
      const target = id < 45 ? 128 : id < 55 ? 256 : 512;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 45 ? 500 : id < 55 ? 1000 : id < 60 ? 2000 : 4000;
      objective = { type: 'score', target };
    }
    moveLimit = Math.max(40, Math.floor(59 - (n - 1) * 0.6));

  } else if (id <= 100) {
    // ── Hard ──────────────────────────────────────────────────────────────
    difficulty = 'hard';
    const n = id - 66;
    if (id % 2 !== 0) {
      const target = id < 85 ? 1024 : 2048;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 75 ? 8000 : id < 85 ? 16000 : 32000;
      objective = { type: 'score', target };
    }
    moveLimit = Math.max(30, Math.floor(49 - (n - 1) * 0.6));

  } else if (id <= 150) {
    // ── Expert ────────────────────────────────────────────────────────────
    difficulty = 'expert';
    const n = id - 100; // 1-50
    const mod = n % 3;
    if (mod === 1) {
      // reach-tile with escalating targets
      const target = n <= 10 ? 64 : n <= 20 ? 128 : n <= 35 ? 256 : n <= 45 ? 512 : 1024;
      objective = { type: 'reach-tile', target };
    } else if (mod === 2) {
      // merges — larger counts
      const target = n <= 10 ? 20 : n <= 20 ? 30 : n <= 35 ? 45 : n <= 45 ? 60 : 80;
      objective = { type: 'merges', target };
    } else {
      // score — bigger numbers
      const target = n <= 10 ? 6000 : n <= 20 ? 15000 : n <= 35 ? 30000 : 55000;
      objective = { type: 'score', target };
    }
    moveLimit = Math.max(32, Math.floor(72 - (n - 1) * 0.8)); // 72 → 32

  } else {
    // ── Master ────────────────────────────────────────────────────────────
    difficulty = 'master';
    const n = id - 150; // 1-50
    const mod = n % 3;
    if (mod === 1) {
      // Massive scores
      const target = n <= 10 ? 70000 : n <= 20 ? 110000 : n <= 35 ? 160000 : 220000;
      objective = { type: 'score', target };
    } else if (mod === 2) {
      // Reach top tiles
      const target = n <= 10 ? 512 : n <= 25 ? 1024 : 2048;
      objective = { type: 'reach-tile', target };
    } else {
      // Many merges
      const target = n <= 10 ? 90 : n <= 25 ? 110 : n <= 40 ? 135 : 160;
      objective = { type: 'merges', target };
    }
    moveLimit = Math.max(25, Math.floor(52 - (n - 1) * 0.55)); // 52 → 25
  }

  return {
    id,
    difficulty,
    objective,
    moveLimit,
    starThresholds: {
      two:   Math.floor(moveLimit * twoStarFactor),
      three: Math.floor(moveLimit * threeStarFactor),
    },
  };
});
