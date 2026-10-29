import { AchievementBuilder } from 'achievements-engine';

export const finalArcadeAward = {
  title: 'Star pilot',
  description: 'Survive all three waves.',
  icon: '★',
};

export const arcadeAchievements = AchievementBuilder.combine([
  AchievementBuilder.createScoreAchievement(100).withAward({
    title: 'First contact',
    description: 'Destroy your first scout. Earn 100 points.',
    icon: '✦',
  }),
  AchievementBuilder.createScoreAchievement(500).withAward({
    title: 'Sharpshooter',
    description: 'Earn 500 points in one run.',
    icon: '⌖',
  }),
  AchievementBuilder.createLevelAchievement(2).withAward({
    title: 'Wave rider',
    description: 'Make it through the first wave.',
    icon: '≈',
  }),
  AchievementBuilder.createBooleanAchievement('comboThree').withAward({
    title: 'Hot streak',
    description: 'Destroy three scouts with less than 3 seconds between hits.',
    icon: 'ϟ',
  }),
  AchievementBuilder.createBooleanAchievement('missionComplete').withAward(finalArcadeAward),
]);
