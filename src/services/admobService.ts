import { ADMOB_CONFIG, getActiveAdMobAppId, getActiveRewardedUnitId } from '../config/admob';

export type AdRewardType = 'continue' | 'slot' | 'level' | 'bonus_stars' | 'bonus_coins' | 'bonus_gems' | 'bonus_gift';

export interface AdRewardInfo {
  type: AdRewardType;
  title: string;
  description: string;
  icon: string;
  amount?: number;
  targetId?: number; // slot number or level id
  adStep?: number; // 1, 2, or 3 for multi-ad bonus
  maxAds?: number; // 3
}

class AdMobService {
  private isLoaded: boolean = true;
  private isLoading: boolean = false;
  private loadError: string | null = null;

  constructor() {
    this.preloadAd();
  }

  // Preload next rewarded ad in background
  public async preloadAd(): Promise<boolean> {
    if (this.isLoading) return false;
    this.isLoading = true;
    this.loadError = null;

    try {
      // Simulate network / native SDK preloading
      await new Promise((resolve) => setTimeout(resolve, 600));
      this.isLoaded = true;
      this.isLoading = false;
      return true;
    } catch (err) {
      this.isLoaded = false;
      this.isLoading = false;
      this.loadError = 'Erreur de chargement AdMob';
      return false;
    }
  }

  // Check if rewarded ad is currently ready
  public isReady(): boolean {
    return this.isLoaded;
  }

  // Check if ads can be loaded
  public getStatus() {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      hasError: Boolean(this.loadError),
      errorMessage: this.loadError,
    };
  }

  // Mark ad as consumed after watching and preload next
  public consumeAd() {
    this.isLoaded = false;
    setTimeout(() => {
      this.preloadAd();
    }, 1200);
  }

  // Get details for 3-ad progressive rewards
  public getMultiAdReward(step: 1 | 2 | 3): AdRewardInfo {
    switch (step) {
      case 1:
        return {
          type: 'bonus_coins',
          title: 'Récompense 1/3 : Pièces & Étoile',
          description: '+100 🪙 Pièces & +1 ⭐ Étoile bonus',
          icon: '🪙',
          amount: 100,
          adStep: 1,
          maxAds: 3,
        };
      case 2:
        return {
          type: 'bonus_gems',
          title: 'Récompense 2/3 : Diamants & Pièces',
          description: '+15 💎 Diamants & +100 🪙 Pièces',
          icon: '💎',
          amount: 15,
          adStep: 2,
          maxAds: 3,
        };
      case 3:
      default:
        return {
          type: 'bonus_gift',
          title: 'Récompense 3/3 : Coffre Mystère & Diamants',
          description: '+1 🎁 Coffre Cadeau Mystère & +25 💎 Diamants',
          icon: '🎁',
          amount: 1,
          adStep: 3,
          maxAds: 3,
        };
    }
  }

  // Return active App ID & Unit ID for native export / display
  public getActiveIds(isTestMode: boolean) {
    return {
      appId: getActiveAdMobAppId(isTestMode),
      rewardedUnitId: getActiveRewardedUnitId(isTestMode),
      isTestMode,
    };
  }
}

export const adMobService = new AdMobService();
