import { AchievementBuilder } from 'achievements-engine';

export const courseAchievements = AchievementBuilder.combine([
  AchievementBuilder.createBooleanAchievement('firstLessonCompleted').withAward({
    title: 'First spark',
    description: 'Complete your first lesson.',
    icon: '✦',
  }),
  AchievementBuilder.createBooleanAchievement('twoLessonsCompleted').withAward({
    title: 'Making connections',
    description: 'Complete two lessons.',
    icon: '⌘',
  }),
  AchievementBuilder.createBooleanAchievement('courseCompleted').withAward({
    title: 'Ready to build',
    description: 'Complete the entire course.',
    icon: '◆',
  }),
]);
