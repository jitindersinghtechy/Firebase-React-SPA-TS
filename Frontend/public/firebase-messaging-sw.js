// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDztPv_tWi4QAylwN3MAM6dXtnns4-Sj7Y",
  authDomain: "react-spa-fb-notificaion.firebaseapp.com",
  projectId: "react-spa-fb-notificaion",
  storageBucket: "react-spa-fb-notificaion.appspot.com",
  messagingSenderId: "528214212413",
  appId: "1:528214212413:web:562717f5b6bd8f265dcf54"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});