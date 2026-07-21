// TODO(Giai đoạn 2 - payment): replace with real react-native-iap wiring.
// Deferred deliberately (see plan: payment is done last, it's the area that
// crashed production in the old app's failed upgrade attempt). Stubbed here
// so IAPActions.js/ShopActions.js can still import something and the JS
// bundle doesn't break, without pulling in react-native-iap's native pods
// (its current Nitro/Swift-based "openiap" pod failed to compile and isn't
// needed yet).
export async function getProducts() {
  console.warn('RNIap.getProducts (stub): react-native-iap not wired up yet');
  return [];
}
