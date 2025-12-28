/**
 * Mononoke Garden - Push Notification System
 *
 * Handles push notifications for:
 * - Seasonal event reminders
 * - Streak reminders
 * - Blessing expiration warnings
 * - Community goal progress
 * - Trading offers
 */

export type NotificationType =
  | 'seasonal_event_start'
  | 'seasonal_event_ending'
  | 'streak_reminder'
  | 'blessing_expiring'
  | 'community_goal_progress'
  | 'trade_offer_received'
  | 'offspring_ready'
  | 'friend_activity';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleJa: string;
  body: string;
  bodyJa: string;
  scheduledTime: Date;
  data?: Record<string, any>;
  priority: 'high' | 'normal' | 'low';
}

export interface NotificationPermissions {
  granted: boolean;
  token?: string;
}

// ===== NOTIFICATION SYSTEM =====

class PushNotificationSystem {
  private permissions: NotificationPermissions = { granted: false };
  private scheduledNotifications: Map<string, PushNotification> = new Map();

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[Push] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissions.granted = true;
      await this.registerServiceWorker();
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissions.granted = permission === 'granted';

      if (this.permissions.granted) {
        await this.registerServiceWorker();
      }

      return this.permissions.granted;
    }

    return false;
  }

  /**
   * Register service worker for push notifications
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[Push] Service workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Push] Service worker registered:', registration);

      // Get push subscription (for Firebase Cloud Messaging, OneSignal, etc.)
      // const subscription = await registration.pushManager.subscribe({
      //   userVisibleOnly: true,
      //   applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
      // });

      // this.permissions.token = JSON.stringify(subscription);
    } catch (error) {
      console.error('[Push] Service worker registration failed:', error);
    }
  }

  /**
   * Schedule a notification
   */
  scheduleNotification(notification: PushNotification): void {
    if (!this.permissions.granted) {
      console.warn('[Push] Permissions not granted');
      return;
    }

    this.scheduledNotifications.set(notification.id, notification);

    // Calculate delay
    const delay = notification.scheduledTime.getTime() - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(notification);
      }, delay);
    } else {
      // Send immediately if scheduled time has passed
      this.sendNotification(notification);
    }
  }

  /**
   * Send a notification
   */
  private sendNotification(notification: PushNotification): void {
    const { title, titleJa, body, bodyJa, data } = notification;

    // Use Japanese if locale is ja-JP, otherwise English
    const locale = navigator.language.startsWith('ja') ? 'ja' : 'en';
    const displayTitle = locale === 'ja' ? titleJa : title;
    const displayBody = locale === 'ja' ? bodyJa : body;

    // Send notification
    if (Notification.permission === 'granted') {
      const notif = new Notification(displayTitle, {
        body: displayBody,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: notification.type,
        data,
        requireInteraction: notification.priority === 'high',
      });

      notif.onclick = () => {
        window.focus();
        notif.close();

        // Handle notification click based on type
        this.handleNotificationClick(notification);
      };
    }

    // Remove from scheduled
    this.scheduledNotifications.delete(notification.id);
  }

  /**
   * Handle notification click
   */
  private handleNotificationClick(notification: PushNotification): void {
    switch (notification.type) {
      case 'seasonal_event_start':
      case 'seasonal_event_ending':
        // Navigate to events page
        window.location.href = '/events';
        break;
      case 'streak_reminder':
        // Navigate to sanctuary
        window.location.href = '/sanctuary';
        break;
      case 'blessing_expiring':
        // Navigate to shrine
        window.location.href = '/shrine';
        break;
      case 'trade_offer_received':
        // Navigate to trading
        window.location.href = '/trading';
        break;
      case 'offspring_ready':
        // Navigate to breeding
        window.location.href = '/breeding';
        break;
      default:
        window.location.href = '/';
    }
  }

  /**
   * Cancel a scheduled notification
   */
  cancelNotification(notificationId: string): void {
    this.scheduledNotifications.delete(notificationId);
  }

  /**
   * Cancel all notifications of a type
   */
  cancelNotificationsByType(type: NotificationType): void {
    for (const [id, notification] of this.scheduledNotifications.entries()) {
      if (notification.type === type) {
        this.scheduledNotifications.delete(id);
      }
    }
  }

  /**
   * Get permissions status
   */
  getPermissions(): NotificationPermissions {
    return this.permissions;
  }

  /**
   * Get scheduled notifications
   */
  getScheduledNotifications(): PushNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }
}

// ===== SINGLETON INSTANCE =====

let notificationSystem: PushNotificationSystem | null = null;

/**
 * Get notification system instance
 */
export function getNotificationSystem(): PushNotificationSystem {
  if (!notificationSystem) {
    notificationSystem = new PushNotificationSystem();
  }
  return notificationSystem;
}

// ===== NOTIFICATION TEMPLATES =====

/**
 * Create a seasonal event notification
 */
export function createSeasonalEventNotification(
  seasonName: string,
  seasonNameJa: string,
  eventName: string,
  eventNameJa: string,
  startTime: Date
): PushNotification {
  return {
    id: `seasonal_${seasonName}_${Date.now()}`,
    type: 'seasonal_event_start',
    title: `🌸 ${seasonName} - ${eventName} Begins!`,
    titleJa: `🌸 ${seasonNameJa} - ${eventNameJa}が始まります！`,
    body: `A special seasonal event has started. Join the celebration!`,
    bodyJa: `特別な季節イベントが始まりました。お祝いに参加しましょう！`,
    scheduledTime: startTime,
    data: {
      season_name: seasonName,
      event_name: eventName,
    },
    priority: 'high',
  };
}

/**
 * Create a streak reminder notification
 */
export function createStreakReminderNotification(consecutiveDays: number, scheduledTime: Date): PushNotification {
  return {
    id: `streak_reminder_${Date.now()}`,
    type: 'streak_reminder',
    title: `🔥 Keep your ${consecutiveDays}-day streak alive!`,
    titleJa: `🔥 ${consecutiveDays}日の連続記録を守ろう！`,
    body: `Don't forget to perform your daily ritual with your companion.`,
    bodyJa: `今日も仲間と一緒に儀式を行いましょう。`,
    scheduledTime,
    data: {
      consecutive_days: consecutiveDays,
    },
    priority: 'normal',
  };
}

/**
 * Create a blessing expiring notification
 */
export function createBlessingExpiringNotification(
  blessingName: string,
  blessingNameJa: string,
  expiryTime: Date
): PushNotification {
  return {
    id: `blessing_expiring_${Date.now()}`,
    type: 'blessing_expiring',
    title: `⛩️ Your shrine blessing is expiring soon!`,
    titleJa: `⛩️ 神社の祝福がまもなく切れます！`,
    body: `${blessingName} will expire in 1 hour. Make the most of it!`,
    bodyJa: `${blessingNameJa}があと1時間で切れます。有効活用しましょう！`,
    scheduledTime: new Date(expiryTime.getTime() - 60 * 60 * 1000), // 1 hour before
    data: {
      blessing_name: blessingName,
    },
    priority: 'normal',
  };
}

/**
 * Create a community goal notification
 */
export function createCommunityGoalNotification(
  eventName: string,
  eventNameJa: string,
  progress: number,
  scheduledTime: Date
): PushNotification {
  return {
    id: `community_goal_${Date.now()}`,
    type: 'community_goal_progress',
    title: `🎋 Community Goal Progress: ${progress}%`,
    titleJa: `🎋 コミュニティ目標進捗: ${progress}%`,
    body: `The ${eventName} community goal is almost complete! Contribute now!`,
    bodyJa: `${eventNameJa}のコミュニティ目標がもうすぐ達成！今すぐ貢献しよう！`,
    scheduledTime,
    data: {
      event_name: eventName,
      progress,
    },
    priority: 'normal',
  };
}

/**
 * Create a trade offer notification
 */
export function createTradeOfferNotification(traderName: string, scheduledTime: Date): PushNotification {
  return {
    id: `trade_offer_${Date.now()}`,
    type: 'trade_offer_received',
    title: `🤝 New trade offer from ${traderName}`,
    titleJa: `🤝 ${traderName}から新しい取引オファー`,
    body: `Someone wants to trade companions with you!`,
    bodyJa: `誰かがあなたと仲間を交換したがっています！`,
    scheduledTime,
    data: {
      trader_name: traderName,
    },
    priority: 'high',
  };
}

/**
 * Create an offspring ready notification
 */
export function createOffspringReadyNotification(scheduledTime: Date): PushNotification {
  return {
    id: `offspring_ready_${Date.now()}`,
    type: 'offspring_ready',
    title: `👶 Your companion offspring is ready!`,
    titleJa: `👶 仲間の子孫が孵化しました！`,
    body: `The incubation is complete. Meet your new companion!`,
    bodyJa: `孵化が完了しました。新しい仲間に会いましょう！`,
    scheduledTime,
    data: {},
    priority: 'high',
  };
}
