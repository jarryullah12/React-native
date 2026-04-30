export type Difficulty = 'easy' | 'medium' | 'hard';

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

export const LEVELS: Level[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  let difficulty: Difficulty;
  let objective: LevelObjective;
  let moveLimit: number;
  let twoStarFactor: number;
  let threeStarFactor: number;

  if (id <= 33) {
    difficulty = 'easy';
    const isReachTile = id % 2 !== 0;
    if (isReachTile) {
      const target = id < 10 ? 16 : id < 20 ? 32 : 64;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 10 ? 5 : id < 20 ? 10 : 15;
      objective = { type: 'merges', target };
    }
    moveLimit = Math.floor(50 + (33 - id) * 1); // 50 to 82
    twoStarFactor = 0.8;
    threeStarFactor = 0.6;
  } else if (id <= 66) {
    difficulty = 'medium';
    const isReachTile = id % 2 !== 0;
    if (isReachTile) {
      const target = id < 45 ? 128 : id < 55 ? 256 : 512;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 45 ? 500 : id < 55 ? 1000 : id < 60 ? 2000 : 4000;
      objective = { type: 'score', target };
    }
    moveLimit = Math.floor(40 + (66 - id) * 0.6); // 40 to 59
    twoStarFactor = 0.85;
    threeStarFactor = 0.7;
  } else {
    difficulty = 'hard';
    const isReachTile = id % 2 !== 0;
    if (isReachTile) {
      const target = id < 85 ? 1024 : 2048;
      objective = { type: 'reach-tile', target };
    } else {
      const target = id < 75 ? 8000 : id < 85 ? 16000 : 32000;
      objective = { type: 'score', target };
    }
    moveLimit = Math.floor(30 + (100 - id) * 0.6); // 30 to 49
    twoStarFactor = 0.9;
    threeStarFactor = 0.8;
  }

  return {
    id,
    difficulty,
    objective,
    moveLimit,
    starThresholds: {
      two: Math.floor(moveLimit * twoStarFactor),
      three: Math.floor(moveLimit * threeStarFactor),
    }
  };
});
