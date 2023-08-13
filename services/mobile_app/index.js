import { registerRootComponent } from 'expo';

import App from './App';
import TestApp from './TestApp';
import AppOld from './AppOld';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppOld);
