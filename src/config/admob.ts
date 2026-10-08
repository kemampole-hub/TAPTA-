export interface AdMobConfig {
  appId: string;
  rewardedAdUnitId: string;
  isTestMode: boolean;
  testAppId: string;
  testRewardedAdUnitId: string;
}

export const ADMOB_CONFIG: AdMobConfig = {
  // Production IDs
  appId: 'ca-app-pub-7613129142115500~9163524169',
  rewardedAdUnitId: 'ca-app-pub-7613129142115500/6407342198',

  // Official Google AdMob Test IDs
  testAppId: 'ca-app-pub-3940256099942544~3347511713',
  testRewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',

  // Development test mode (switchable in settings)
  isTestMode: true,
};

export function getActiveAdMobAppId(isTestMode: boolean): string {
  return isTestMode ? ADMOB_CONFIG.testAppId : ADMOB_CONFIG.appId;
}

export function getActiveRewardedUnitId(isTestMode: boolean): string {
  return isTestMode ? ADMOB_CONFIG.testRewardedAdUnitId : ADMOB_CONFIG.rewardedAdUnitId;
}
