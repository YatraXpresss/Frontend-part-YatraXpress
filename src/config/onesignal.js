// OneSignal configuration
export const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';

export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(() => {
    OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
    });

    // Handle notification subscription changes
    OneSignal.on('subscriptionChange', function (isSubscribed) {
      if (isSubscribed) {
        OneSignal.getUserId().then((userId) => {
          // Send the OneSignal User ID to your backend
          updateUserNotificationToken(userId);
        });
      }
    });
  });
};

// Function to update user's notification token in the backend
const updateUserNotificationToken = async (token) => {
  try {
    const response = await fetch('/api/user/notification-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ onesignal_token: token }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification token');
    }
  } catch (error) {
    console.error('Error updating notification token:', error);
  }
};