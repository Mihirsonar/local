import webpush from "web-push";
import "dotenv/config";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "BNqC-aYYDiZ3s4aWnmn4cLvDSnrniVoXBOU9_Z93t-IrZiFEob_ofUcdF8FPcbY4mjbM-W1Qkn9Ld0xGmf65Cz8";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "X2CqXWNtYZwC9gUT5-llhDzjQ-th7fJOVrDW6jaZEMw";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:support@kiranaplus.com";

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

export const sendPushNotification = async (subscription, payload) => {
  try {
    const stringPayload = typeof payload === "string" ? payload : JSON.stringify(payload);
    await webpush.sendNotification(subscription, stringPayload);
    return { success: true };
  } catch (err) {
    console.error("Failed to send push notification:", err.statusCode || err.message);
    if (err.statusCode === 404 || err.statusCode === 410) {
      return { expired: true };
    }
    return { success: false, error: err.message };
  }
};

export { vapidPublicKey, vapidPrivateKey, vapidSubject };
export default webpush;
