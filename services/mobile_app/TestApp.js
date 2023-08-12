import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
// import auth from '@react-native-firebase/auth';

export default function TestApp() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  /*
  function onAuthStateChanged(user) {
    console.log('setting user', user);
    setUser(user);
    if (initializing) setInitializing(false);
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

  function createUserWithEmailAndPassword() {
    auth()
      .createUserWithEmailAndPassword(
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

    // createUserWithEmail();
    f();
  }, []);

  if (initializing) return null;

  console.log('initializing', initializing);
  console.log('user', user);

  if (!user) {
    return (
      <SafeAreaView>
        <View>
          <Text>Login</Text>
        </View>
      </SafeAreaView>
    );
  }

  */

  return (
    <View>
      <SafeAreaView>
        <Text>Welcome</Text>
      </SafeAreaView>
    </View>
  );
}
