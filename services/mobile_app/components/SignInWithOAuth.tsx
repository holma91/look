import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { AppleButton, GoogleButton } from './Buttons';
import { Button } from 'react-native';
// import { useOAuth } from '../hooks/useOAuth';

WebBrowser.maybeCompleteAuthSession();

export const SignInWithGoogle = () => {
  async function onGoogleButtonPress() {
    try {
      // Start the Google Sign-In process
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In error', error);
    }
  }

  return <Button title="Sign in with Google" onPress={onGoogleButtonPress} />;
};

export const SignInWithGoogleOld = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId && setActive) {
        // we have a sessionId, now we just have to make it active
        console.log('createdSessionId', createdSessionId);
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return <GoogleButton label="Sign in with Google" onPress={onPress} />;
};

export const SignInWithApple = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId && setActive) {
        // we have a sessionId, now we just have to make it active
        console.log('createdSessionId', createdSessionId);
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return <AppleButton label="Sign in with Apple" onPress={onPress} />;
};
