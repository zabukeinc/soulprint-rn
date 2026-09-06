const assert = require('node:assert/strict');
const test = require('node:test');

const { optimizeReleaseProguard } = require('./with-android-release-optimization');

test('enables the optimized Android release ProGuard configuration', () => {
  const source = 'proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"';

  assert.equal(
    optimizeReleaseProguard(source),
    'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"',
  );
});

test('is idempotent', () => {
  const source = 'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"';

  assert.equal(optimizeReleaseProguard(source), source);
});

test('fails when the Expo Android template no longer matches', () => {
  assert.throws(
    () => optimizeReleaseProguard('release { minifyEnabled true }'),
    /Could not find the Android release ProGuard configuration/,
  );
});
