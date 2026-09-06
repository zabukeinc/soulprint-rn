const { withAppBuildGradle } = require('@expo/config-plugins');

const DEFAULT_PROGUARD_PATTERN = /getDefaultProguardFile\(["']proguard-android\.txt["']\)/g;
const OPTIMIZED_PROGUARD = 'getDefaultProguardFile("proguard-android-optimize.txt")';

function optimizeReleaseProguard(source) {
  if (source.includes('proguard-android-optimize.txt')) return source;
  if (!DEFAULT_PROGUARD_PATTERN.test(source)) {
    throw new Error('Could not find the Android release ProGuard configuration.');
  }

  DEFAULT_PROGUARD_PATTERN.lastIndex = 0;
  return source.replace(DEFAULT_PROGUARD_PATTERN, OPTIMIZED_PROGUARD);
}

function withAndroidReleaseOptimization(config) {
  return withAppBuildGradle(config, (nextConfig) => {
    if (nextConfig.modResults.language !== 'groovy') {
      throw new Error('Android release optimization requires a Groovy app build.gradle file.');
    }

    nextConfig.modResults.contents = optimizeReleaseProguard(nextConfig.modResults.contents);
    return nextConfig;
  });
}

module.exports = withAndroidReleaseOptimization;
module.exports.optimizeReleaseProguard = optimizeReleaseProguard;
