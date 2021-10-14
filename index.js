/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
} from '@datadog/mobile-react-native';

async function enableDD() {
  const config = new DdSdkReactNativeConfiguration(
    'pub2f866049acdde5cce3d6a99d939e647e',
    'alakarte-dev',
    'b644452b-c0f2-4e2d-b12b-972154d93aef',
    true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
    true, // track XHR Resources
    true, // track Errors
  );
  // Optional: Select your Datadog website (one of "US", "EU" or "GOV")
  config.site = 'US';
  // Optional: enable or disable native crash reports
  config.nativeCrashReportEnabled = true;
  // Optional: sample RUM sessions (here, 80% of session will be sent to Datadog. Default = 100%)
  config.sampleRate = 100;

  await DdSdkReactNative.initialize(config);

  // Once SDK is initialized you need to setup view tracking to be able to see data in the RUM Dashboard.
}
enableDD();
AppRegistry.registerComponent(appName, () => App);
