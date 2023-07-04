Recommended library: https://github.com/react-native-webview/react-native-webview
docs: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide
expo-web-browser uses SFSafariViewController
react-native-webview uses WKWebView

We want customization, so we should use react-native-webview.

### Communicating between JS and Native

React Native WebView exposes three different options:

1. React Native -> Web: The injectedJavaScript prop
   runs immediately after the web page loads for the first time. only runs once, even if the page is reloaded or navigated away.
2. React Native -> Web: The injectJavaScript method
   Doesn't necessarily run just once.
3. Web -> React Native: The postMessage method and onMessage prop

### Page navigation gesture and button support

### Our "browser"

Three parts:

1. URL bar

- has no inherent connection to the WebView
- just a basic react input field, with useState
- navigates somewhere in the webView via eventHandlers

2. WebView

- a basic WebView that does what it's told

3. Toolbar

- can be used to go back and forward in the webview
- can be swiped up to take over part of the webview screen
