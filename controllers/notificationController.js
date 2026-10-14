import User from "../models/User.js";
import { vapidPublicKey, sendPushNotification } from "../config/webpush.js";

export const getVapidPublicKey = (req, res) => {
  return res.status(200).json({ publicKey: vapidPublicKey });
};

export const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ message: "Invalid subscription data" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.pushSubscriptions) {
      user.pushSubscriptions = [];
    }

    const existingIndex = user.pushSubscriptions.findIndex(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (existingIndex > -1) {
      user.pushSubscriptions[existingIndex] = {
        ...subscription,
        createdAt: new Date(),
      };
    } else {
      user.pushSubscriptions.push(subscription);
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Push notification subscription saved successfully",
    });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return res.status(500).json({ message: "Server error saving push subscription" });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ message: "Subscription endpoint required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pushSubscriptions = (user.pushSubscriptions || []).filter(
      (sub) => sub.endpoint !== endpoint
    );

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Unsubscribed from push notifications",
    });
  } catch (error) {
    console.error("Error removing push subscription:", error);
    return res.status(500).json({ message: "Server error removing push subscription" });
  }
};

export const testNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      return res.status(400).json({
        message: "No active push subscriptions found. Please enable notifications first.",
      });
    }

    const payload = {
      title: "Kirana+ Notification",
      body: "Push notifications are active for your Kirana+ account!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/favicon-32x32.png",
      data: { url: "/myorders" },
    };

    const staleEndpoints = [];
    const results = await Promise.all(
      user.pushSubscriptions.map(async (sub) => {
        const result = await sendPushNotification(sub, payload);
        if (result.expired) {
          staleEndpoints.push(sub.endpoint);
        }
        return result;
      })
    );

    if (staleEndpoints.length > 0) {
      user.pushSubscriptions = user.pushSubscriptions.filter(
        (sub) => !staleEndpoints.includes(sub.endpoint)
      );
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Test push notification sent",
      results,
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return res.status(500).json({ message: "Server error sending notification" });
  }
};

export const notifyUser = async (userId, payload) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      return;
    }

    const staleEndpoints = [];
    await Promise.all(
      user.pushSubscriptions.map(async (sub) => {
        const result = await sendPushNotification(sub, payload);
        if (result.expired) {
          staleEndpoints.push(sub.endpoint);
        }
      })
    );

    if (staleEndpoints.length > 0) {
      user.pushSubscriptions = user.pushSubscriptions.filter(
        (sub) => !staleEndpoints.includes(sub.endpoint)
      );
      await user.save();
    }
  } catch (err) {
    console.error("Error sending user push notification:", err);
  }
};
