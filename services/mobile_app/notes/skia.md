The Canvas component is the root of our Skia drawing. We can treat it as a regular React Native view, and we can assign it a view style.

````md
Okay so Firebase and Skia doesn't work together with the version of Skia that gets installed with `npx expo install @shopify/react-native-skia`. However if you go around that and just installs the latest Skia package directly (v0.1.203), then it does work. The problem is discussed at depth here https://github.com/Shopify/react-native-skia/issues/652 and it's mentioned that a solution was merged in v0.1.183. The only problem now is that get the following when running `expo doctor`:

```txt
[stderr]
Some dependencies are incompatible with the installed expo version:
[stderr]
@shopify/react-native-skia@0.1.203 - expected version: 0.1.172
```
````

````

I guess it's not a big deal, since the application seems to work now with both firebase and skia, atleast when I'm running the dev client. @chrfalch

```
````
