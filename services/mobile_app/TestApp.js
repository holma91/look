import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '235523866766-6iu83a0o351tcnfko0ahboeim8o5jsqu.apps.googleusercontent.com',
});

function GoogleSignIn() {
  async function signIn() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return <Button title="Google Sign-In" onPress={signIn} />;
}

export default function TestApp() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, setEmail] = useState(''); // State for the email input
  const [password, setPassword] = useState(''); // State for the password input
  const [errorMessage, setErrorMessage] = useState('');

  const user2 = auth().currentUser;

  function onAuthStateChanged(user) {
    console.log('setting user', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  function handleCreateUser() {
    createUserWithEmailAndPassword();
    // Reset the inputs and error message
    setEmail('');
    setPassword('');
    setErrorMessage('');
  }

  function createUserWithEmailAndPassword() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('That email address is invalid!');
        } else {
          setErrorMessage(error.message);
        }
      });
  }

  function signInUserWithEmailAndPassword() {
    auth()
      .signInWithEmailAndPassword(
        'john.doe@example.com',
        'SuperSecretPassword!'
      )
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  function logOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  useEffect(() => {
    const f = () => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      console.log('subscriber', subscriber);
      return subscriber; // unsubscribe on unmount
    };

    f();
  }, []);

  if (initializing) return null;

  console.log('user', user);
  console.log('user2', user2);

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text>Register</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <Button title="Create Account" onPress={handleCreateUser} />
          <View style={styles.spacer} />
          <GoogleSignIn />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View>
      <SafeAreaView>
        <Text>Welcome {user?.email}</Text>
        <Button title="Log Out" onPress={logOut} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  spacer: {
    height: 20, // Adjust as needed
  },
});
