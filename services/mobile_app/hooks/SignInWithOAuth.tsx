import React from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button } from 'react-native';

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
