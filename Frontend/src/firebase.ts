import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';

// Copy and paste this into your JavaScript code to initialize the Firebase SDK.
// You will also need to load the Firebase SDK.
// See https://firebase.google.com/docs/web/setup for more details.

const firebaseConfig = {
  apiKey: "*******",
  authDomain: "*******.firebaseapp.com",
  projectId: "*******",
  storageBucket: "*******.appspot.com",
  messagingSenderId: "*******",
  appId: "*******"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
// This function will generate the token along with inform the user if Web Push Notificaiton is enalbe on Brower or not
const getFBToken:any = async (setTokenFound:any, setDeviceToken:any) => {
  return await getToken(messaging, {vapidKey: process.env.REACT_APP_GENERATED_MESSAGING_KEY}).then((currentToken:any) => {
    if (currentToken) {
      setDeviceToken(currentToken);
      setTokenFound(true);
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err:any) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}


const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});


export { getFBToken, onMessageListener };