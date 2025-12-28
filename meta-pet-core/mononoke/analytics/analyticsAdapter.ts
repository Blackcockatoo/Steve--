/**
 * Mononoke Garden - Analytics Adapter
 *
 * Universal adapter for Mixpanel, Amplitude, and Firebase Analytics.
 * Provides a single interface for all analytics providers.
 */

import type { AnalyticsEvent, UserProperties } from './events';

// ===== ANALYTICS PROVIDER TYPES =====

export type AnalyticsProvider = 'mixpanel' | 'amplitude' | 'firebase' | 'console';

export interface AnalyticsConfig {
  providers: AnalyticsProvider[];
  mixpanelToken?: string;
  amplitudeApiKey?: string;
  firebaseConfig?: any;
  debug?: boolean;
}

// ===== ANALYTICS ADAPTER =====

class AnalyticsAdapter {
  private config: AnalyticsConfig;
  private mixpanel: any = null;
  private amplitude: any = null;
  private firebase: any = null;
  private initialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  /**
   * Initialize analytics providers
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[Analytics] Already initialized');
      return;
    }

    for (const provider of this.config.providers) {
      try {
        switch (provider) {
          case 'mixpanel':
            await this.initializeMixpanel();
            break;
          case 'amplitude':
            await this.initializeAmplitude();
            break;
          case 'firebase':
            await this.initializeFirebase();
            break;
          case 'console':
            console.log('[Analytics] Console logging enabled');
            break;
        }
      } catch (error) {
        console.error(`[Analytics] Failed to initialize ${provider}:`, error);
      }
    }

    this.initialized = true;
    console.log('[Analytics] Initialized with providers:', this.config.providers);
  }

  /**
   * Initialize Mixpanel
   */
  private async initializeMixpanel(): Promise<void> {
    if (!this.config.mixpanelToken) {
      throw new Error('Mixpanel token not provided');
    }

    // In production, import Mixpanel SDK
    // import mixpanel from 'mixpanel-browser';
    // mixpanel.init(this.config.mixpanelToken, {
    //   debug: this.config.debug,
    //   track_pageview: true,
    //   persistence: 'localStorage',
    // });
    // this.mixpanel = mixpanel;

    // Mock for development
    this.mixpanel = {
      track: (event: string, properties?: any) => {
        if (this.config.debug) {
          console.log('[Mixpanel]', event, properties);
        }
      },
      identify: (userId: string) => {
        if (this.config.debug) {
          console.log('[Mixpanel] Identify:', userId);
        }
      },
      people: {
        set: (properties: any) => {
          if (this.config.debug) {
            console.log('[Mixpanel] User properties:', properties);
          }
        },
      },
      register: (properties: any) => {
        if (this.config.debug) {
          console.log('[Mixpanel] Register super properties:', properties);
        }
      },
    };

    console.log('[Analytics] Mixpanel initialized');
  }

  /**
   * Initialize Amplitude
   */
  private async initializeAmplitude(): Promise<void> {
    if (!this.config.amplitudeApiKey) {
      throw new Error('Amplitude API key not provided');
    }

    // In production, import Amplitude SDK
    // import * as amplitude from '@amplitude/analytics-browser';
    // amplitude.init(this.config.amplitudeApiKey, {
    //   defaultTracking: {
    //     sessions: true,
    //     pageViews: true,
    //     formInteractions: true,
    //     fileDownloads: true,
    //   },
    // });
    // this.amplitude = amplitude;

    // Mock for development
    this.amplitude = {
      track: (event: string, properties?: any) => {
        if (this.config.debug) {
          console.log('[Amplitude]', event, properties);
        }
      },
      setUserId: (userId: string) => {
        if (this.config.debug) {
          console.log('[Amplitude] Set user ID:', userId);
        }
      },
      identify: (identify: any) => {
        if (this.config.debug) {
          console.log('[Amplitude] Identify:', identify);
        }
      },
    };

    console.log('[Analytics] Amplitude initialized');
  }

  /**
   * Initialize Firebase Analytics
   */
  private async initializeFirebase(): Promise<void> {
    if (!this.config.firebaseConfig) {
      throw new Error('Firebase config not provided');
    }

    // In production, import Firebase
    // import { initializeApp } from 'firebase/app';
    // import { getAnalytics, logEvent } from 'firebase/analytics';
    // const app = initializeApp(this.config.firebaseConfig);
    // this.firebase = getAnalytics(app);

    // Mock for development
    this.firebase = {
      logEvent: (event: string, properties?: any) => {
        if (this.config.debug) {
          console.log('[Firebase]', event, properties);
        }
      },
      setUserId: (userId: string) => {
        if (this.config.debug) {
          console.log('[Firebase] Set user ID:', userId);
        }
      },
      setUserProperties: (properties: any) => {
        if (this.config.debug) {
          console.log('[Firebase] User properties:', properties);
        }
      },
    };

    console.log('[Analytics] Firebase initialized');
  }

  /**
   * Track an event
   */
  track(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, skipping event:', event.name);
      return;
    }

    const { name, category, properties = {} } = event;

    // Add category to properties
    const enrichedProperties = {
      ...properties,
      category,
    };

    // Track to all providers
    if (this.mixpanel) {
      this.mixpanel.track(name, enrichedProperties);
    }

    if (this.amplitude) {
      this.amplitude.track(name, enrichedProperties);
    }

    if (this.firebase) {
      // Firebase has event name length limit of 40 chars
      const firebaseEventName = name.substring(0, 40);
      this.firebase.logEvent(firebaseEventName, enrichedProperties);
    }

    if (this.config.providers.includes('console') || this.config.debug) {
      console.log('[Analytics]', name, enrichedProperties);
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, properties?: UserProperties): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, skipping identify');
      return;
    }

    // Mixpanel
    if (this.mixpanel) {
      this.mixpanel.identify(userId);
      if (properties) {
        this.mixpanel.people.set(properties);
      }
    }

    // Amplitude
    if (this.amplitude) {
      this.amplitude.setUserId(userId);
      if (properties) {
        // In production, use Amplitude's Identify API
        // const identify = new amplitude.Identify();
        // Object.entries(properties).forEach(([key, value]) => {
        //   identify.set(key, value);
        // });
        // this.amplitude.identify(identify);
      }
    }

    // Firebase
    if (this.firebase) {
      this.firebase.setUserId(userId);
      if (properties) {
        this.firebase.setUserProperties(properties);
      }
    }

    if (this.config.debug) {
      console.log('[Analytics] Identified user:', userId, properties);
    }
  }

  /**
   * Set user properties (without changing user ID)
   */
  setUserProperties(properties: Partial<UserProperties>): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, skipping user properties');
      return;
    }

    if (this.mixpanel) {
      this.mixpanel.people.set(properties);
    }

    if (this.amplitude) {
      // Use Amplitude's Identify API
    }

    if (this.firebase) {
      this.firebase.setUserProperties(properties);
    }

    if (this.config.debug) {
      console.log('[Analytics] Set user properties:', properties);
    }
  }

  /**
   * Set super properties (sent with every event)
   */
  setSuperProperties(properties: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, skipping super properties');
      return;
    }

    if (this.mixpanel) {
      this.mixpanel.register(properties);
    }

    // Amplitude handles this via user properties

    if (this.config.debug) {
      console.log('[Analytics] Set super properties:', properties);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>): void {
    this.track({
      name: 'page_viewed',
      category: 'retention',
      properties: {
        page_name: pageName,
        ...properties,
      },
    });
  }

  /**
   * Track revenue
   */
  trackRevenue(revenue: number, properties?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, skipping revenue');
      return;
    }

    // Mixpanel revenue tracking
    if (this.mixpanel) {
      this.mixpanel.people.track_charge(revenue, properties);
    }

    // Amplitude revenue tracking
    if (this.amplitude) {
      // In production:
      // const revenue = new amplitude.Revenue()
      //   .setPrice(revenue)
      //   .setEventProperties(properties);
      // this.amplitude.revenue(revenue);
    }

    if (this.config.debug) {
      console.log('[Analytics] Revenue:', revenue, properties);
    }
  }

  /**
   * Reset analytics (e.g., on logout)
   */
  reset(): void {
    if (this.mixpanel) {
      this.mixpanel.reset();
    }

    if (this.amplitude) {
      this.amplitude.reset();
    }

    if (this.config.debug) {
      console.log('[Analytics] Reset');
    }
  }
}

// ===== SINGLETON INSTANCE =====

let analyticsInstance: AnalyticsAdapter | null = null;

/**
 * Initialize analytics
 */
export function initializeAnalytics(config: AnalyticsConfig): AnalyticsAdapter {
  if (analyticsInstance) {
    console.warn('[Analytics] Already initialized');
    return analyticsInstance;
  }

  analyticsInstance = new AnalyticsAdapter(config);
  analyticsInstance.initialize();

  return analyticsInstance;
}

/**
 * Get analytics instance
 */
export function getAnalytics(): AnalyticsAdapter {
  if (!analyticsInstance) {
    throw new Error('[Analytics] Not initialized. Call initializeAnalytics() first.');
  }

  return analyticsInstance;
}

/**
 * Convenience function to track events
 */
export function trackEvent(event: AnalyticsEvent): void {
  const analytics = getAnalytics();
  analytics.track(event);
}

/**
 * Convenience function to identify users
 */
export function identifyUser(userId: string, properties?: UserProperties): void {
  const analytics = getAnalytics();
  analytics.identify(userId, properties);
}

/**
 * Convenience function to set user properties
 */
export function setUserProperties(properties: Partial<UserProperties>): void {
  const analytics = getAnalytics();
  analytics.setUserProperties(properties);
}
