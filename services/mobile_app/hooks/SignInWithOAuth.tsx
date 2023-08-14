import React from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button, Alert } from 'react-native';

import { URL } from '../api/index';

async function createUser(id: string) {
  const response = await fetch(`${URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
}

export const SignInWithGoogle = () => {
  async function onGoogleButtonPress() {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      if (userCredential.additionalUserInfo?.isNewUser) {
        try {
          const uid = userCredential.user.uid;
          await createUser(uid);
        } catch (serverError) {
          // Server sync failed. Undo the account creation and sign out the user.
          await auth().currentUser?.delete();
          throw serverError;
        }
      }

      return userCredential;
    } catch (error) {
      console.error('Google Sign-In error', error);
      Alert.alert(
        'Error',
        'An error occurred during sign in. Please try again.'
      );
    }
  }

  return <Button title="Sign in with Google" onPress={onGoogleButtonPress} />;
};
