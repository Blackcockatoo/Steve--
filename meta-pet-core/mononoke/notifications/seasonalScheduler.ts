/**
 * Mononoke Garden - Seasonal Event Notification Scheduler
 *
 * Automatically schedules push notifications for:
 * - Seasonal event starts
 * - Seasonal event endings (24h warning)
 * - Community goal milestones
 * - Daily streak reminders
 */

import { SEASONS, getCurrentSeason, getNextSeason, type Season } from '../../../mononoke-garden-core/seasons/calendar';
import {
  getNotificationSystem,
  createSeasonalEventNotification,
  createStreakReminderNotification,
  createCommunityGoalNotification,
} from './pushNotifications';

export interface SchedulerConfig {
  enableSeasonalReminders: boolean;
  enableStreakReminders: boolean;
  enableCommunityGoalReminders: boolean;
  streakReminderTime: string; // HH:MM format (e.g., '20:00')
  timezone: string; // IANA timezone (e.g., 'Asia/Tokyo')
}

class SeasonalNotificationScheduler {
  private config: SchedulerConfig;
  private notificationSystem = getNotificationSystem();
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: SchedulerConfig) {
    this.config = config;
  }

  /**
   * Initialize scheduler and schedule all upcoming events
   */
  async initialize(): Promise<void> {
    console.log('[Scheduler] Initializing seasonal notification scheduler');

    // Request notification permissions
    const granted = await this.notificationSystem.requestPermission();
    if (!granted) {
      console.warn('[Scheduler] Notification permissions not granted');
      return;
    }

    // Schedule seasonal events
    if (this.config.enableSeasonalReminders) {
      this.scheduleSeasonalEvents();
    }

    // Schedule daily streak reminders
    if (this.config.enableStreakReminders) {
      this.scheduleStreakReminders();
    }

    console.log('[Scheduler] Initialized successfully');
  }

  /**
   * Schedule notifications for all 7 seasons
   */
  private scheduleSeasonalEvents(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (const season of Object.values(SEASONS)) {
      // Schedule for this year
      this.scheduleSeasonEvent(season, currentYear);

      // Schedule for next year
      this.scheduleSeasonEvent(season, currentYear + 1);
    }
  }

  /**
   * Schedule notifications for a specific season
   */
  private scheduleSeasonEvent(season: Season, year: number): void {
    const seasonStart = new Date(year, season.startMonth - 1, season.startDay, 9, 0, 0); // 9 AM

    // Don't schedule past events
    if (seasonStart < new Date()) {
      return;
    }

    // Schedule season start notification (if has special event)
    if (season.specialEvent) {
      const notification = createSeasonalEventNotification(
        season.nameEN,
        season.nameJP,
        season.specialEvent.nameEN,
        season.specialEvent.nameJP,
        seasonStart
      );

      this.notificationSystem.scheduleNotification(notification);
      console.log(`[Scheduler] Scheduled notification for ${season.nameEN} on ${seasonStart.toISOString()}`);

      // Schedule event ending reminder (24h before event ends)
      const eventEnd = new Date(seasonStart);
      eventEnd.setDate(eventEnd.getDate() + season.specialEvent.durationDays);

      const eventEndingReminder = new Date(eventEnd);
      eventEndingReminder.setHours(eventEndingReminder.getHours() - 24); // 24h before

      if (eventEndingReminder > new Date()) {
        const endingNotification = createSeasonalEventNotification(
          season.nameEN,
          season.nameJP,
          season.specialEvent.nameEN + ' Ending Soon!',
          season.specialEvent.nameJP + 'まもなく終了！',
          eventEndingReminder
        );

        this.notificationSystem.scheduleNotification(endingNotification);
        console.log(`[Scheduler] Scheduled ending reminder for ${season.nameEN} on ${eventEndingReminder.toISOString()}`);
      }
    }
  }

  /**
   * Schedule daily streak reminder
   */
  private scheduleStreakReminders(): void {
    // Parse reminder time
    const [hours, minutes] = this.config.streakReminderTime.split(':').map(Number);

    // Schedule for next 30 days
    for (let day = 0; day < 30; day++) {
      const reminderTime = new Date();
      reminderTime.setDate(reminderTime.getDate() + day);
      reminderTime.setHours(hours, minutes, 0, 0);

      // Don't schedule past times
      if (reminderTime < new Date()) {
        continue;
      }

      // Get current streak (would come from user data in production)
      const consecutiveDays = 1; // Placeholder

      const notification = createStreakReminderNotification(consecutiveDays, reminderTime);
      this.notificationSystem.scheduleNotification(notification);
    }

    console.log(`[Scheduler] Scheduled daily streak reminders at ${this.config.streakReminderTime}`);
  }

  /**
   * Schedule community goal progress notification
   */
  scheduleC ommunityGoalNotification(eventName: string, eventNameJa: string, progress: number): void {
    if (!this.config.enableCommunityGoalReminders) {
      return;
    }

    // Only notify at certain milestones: 50%, 75%, 90%, 95%
    const milestones = [50, 75, 90, 95];
    if (!milestones.includes(progress)) {
      return;
    }

    const notification = createCommunityGoalNotification(eventName, eventNameJa, progress, new Date());
    this.notificationSystem.scheduleNotification(notification);

    console.log(`[Scheduler] Scheduled community goal notification for ${eventName} at ${progress}%`);
  }

  /**
   * Update scheduler config
   */
  updateConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };

    // Re-initialize if needed
    if (config.enableSeasonalReminders !== undefined || config.enableStreakReminders !== undefined) {
      this.initialize();
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAll(): void {
    for (const job of this.scheduledJobs.values()) {
      clearTimeout(job);
    }
    this.scheduledJobs.clear();

    console.log('[Scheduler] Cancelled all scheduled notifications');
  }

  /**
   * Get upcoming notifications (next 7 days)
   */
  getUpcomingNotifications(): Array<{ date: Date; seasonName: string; eventName: string }> {
    const upcoming: Array<{ date: Date; seasonName: string; eventName: string }> = [];
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    for (const season of Object.values(SEASONS)) {
      const seasonStart = new Date(now.getFullYear(), season.startMonth - 1, season.startDay);

      // Check next year too
      if (seasonStart < now) {
        seasonStart.setFullYear(seasonStart.getFullYear() + 1);
      }

      if (seasonStart <= sevenDaysFromNow && season.specialEvent) {
        upcoming.push({
          date: seasonStart,
          seasonName: season.nameEN,
          eventName: season.specialEvent.nameEN,
        });
      }
    }

    return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

// ===== SINGLETON INSTANCE =====

let schedulerInstance: SeasonalNotificationScheduler | null = null;

/**
 * Initialize seasonal notification scheduler
 */
export function initializeSeasonalScheduler(config: SchedulerConfig): SeasonalNotificationScheduler {
  if (schedulerInstance) {
    console.warn('[Scheduler] Already initialized');
    return schedulerInstance;
  }

  schedulerInstance = new SeasonalNotificationScheduler(config);
  schedulerInstance.initialize();

  return schedulerInstance;
}

/**
 * Get scheduler instance
 */
export function getSeasonalScheduler(): SeasonalNotificationScheduler {
  if (!schedulerInstance) {
    throw new Error('[Scheduler] Not initialized. Call initializeSeasonalScheduler() first.');
  }

  return schedulerInstance;
}

/**
 * Create default scheduler config
 */
export function createDefaultSchedulerConfig(): SchedulerConfig {
  return {
    enableSeasonalReminders: true,
    enableStreakReminders: true,
    enableCommunityGoalReminders: true,
    streakReminderTime: '20:00', // 8 PM
    timezone: 'Asia/Tokyo',
  };
}
