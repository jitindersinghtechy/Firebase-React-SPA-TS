import React, { useState } from 'react';
import { clsx } from 'clsx';
import { getFBToken } from './firebase';
import { onMessageListener } from './firebase';
import apiInstance from './apiInstance';

interface NotificationType {
  title: string;
  body: string;
}

var closeAlertBox:ReturnType<typeof setTimeout>

function App() {
  // State for Different Purpose
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [isTokenFound, setTokenFound] = useState<boolean>(false);
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [notification, setNotification] = useState<NotificationType>({ title: '', body: '' });
  const [responseOfButton, setResponseOfButton] = useState<number|null>(null)

  getFBToken(setTokenFound, setDeviceToken);
  // This is the firebase inbuild function to listen the incoming message
  onMessageListener().then((payload: any) => {
    setShowNotification(true);
    setNotification({ title: payload.notification.title, body: payload.notification.body })
    setResponseOfButton(parseInt(payload?.data?.buttonType, 10))
    closeAlertBox = setTimeout(() => {
      setShowNotification(false)
      setResponseOfButton(null)
    }, 2000)
  }).catch(err => console.log('failed: ', err));

  // This function will trigger the Web Push Notification for the Same Device
  const sendNotification = async (buttonType: number) => {
    try {
      await apiInstance({url: `send-notification/${buttonType}`, method: "POST", data:{ deviceToken }});
    } catch (err) {
      alert('Something Went Wrong')
    }
  }

  // This function will disable the Alert Div and Resotore the Button CSS into its previous state
  const closeNotificationAlert = () =>{
    clearTimeout(closeAlertBox);
    setShowNotification(false)
    setResponseOfButton(null)
  }

  return (
    <div>
      {/* This Code Display message whether user enable web push notification or not */}
      <div className='flex justify-center mt-6'>
        {isTokenFound && <>Notification permission enabled 👍🏻</>}
        {!isTokenFound && <>Need notification permission ❗️</>}
      </div>
      
      {/* This div will be shown to user when user received the Web Push Notification */}
      {showNotification ? (<div  className='flex justify-center mt-6'>
        <div className="alert w-6/12">
          <span className="closebtn" onClick={()=>closeNotificationAlert()}>&#9989;</span> 
          <strong>{notification?.title}!</strong> {notification?.body}
        </div>
      </div>):<></>}
      {/* Three Different Button Type */}
      <div className='flex justify-center space-x-4 mt-6'>
        <div>
          <button onClick={() => { sendNotification(1) }} className={clsx({ activeOnMsgReceived:responseOfButton===1 }, { 'bg-blue-500 hover:bg-blue-700':responseOfButton != 1 }, {commonForAllBtn:true})}>Send 1 Message {responseOfButton===1?<span>&#9989;</span>:<></>}</button>
        </div>
        <div>
          <button onClick={() => { sendNotification(2) }} className={clsx({ activeOnMsgReceived:responseOfButton===2 }, { 'bg-green-500 hover:bg-green-700':responseOfButton != 2 },{commonForAllBtn:true})}>Send 2 Message {responseOfButton===2?<span>&#9989;</span>:<></>}</button>
        </div>
        <div>
          <button onClick={() => { sendNotification(3) }} className={clsx({ activeOnMsgReceived:responseOfButton===3 }, { 'bg-cyan-500 hover:bg-cyan-700':responseOfButton != 3 },{commonForAllBtn:true})}>Send 3 Message {responseOfButton===3?<span>&#9989;</span>:<></>}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
