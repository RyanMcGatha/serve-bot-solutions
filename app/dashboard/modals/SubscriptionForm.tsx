import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { BubbleButton } from "@/app/components/buttons/BubbleButton";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const sendDiscordNotification = async (
  message: string,
  channelId: string = process.env.NEXT_PUBLIC_ERROR_CHANNEL_ID || ""
) => {
  try {
    await axios.post("/api/sendDiscordMessage", { message, channelId });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
};

const SubscriptionForm = ({
  plan,
  onSuccess,
}: {
  plan: any;
  onSuccess: () => void;
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const priceId =
    plan === "basic"
      ? process.env.NEXT_PUBLIC_BASIC_PRICE_ID
      : process.env.NEXT_PUBLIC_PRO_PRICE_ID;

  async function updateUserSubscription() {
    try {
      const subscriptionTier = plan.toUpperCase();
      const response = await axios.post("/api/user/setSubscription", {
        userId: user?.id,
        subscriptionTier,
      });
      console.log("Updated user:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response
        ? `Error updating subscription: ${error.response.data.error}`
        : `Error making request: ${error.message}`;
      await sendDiscordNotification(errorMsg);
      console.error(errorMsg);
    }
  }

  async function grantAllAppAccess() {
    try {
      const response = await axios.post("/api/apps/grantAllAppAccess", {
        userId: user?.id,
      });
      console.log("Granted all app access:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMsg = `Error granting all app access: ${error.message}`;
      await sendDiscordNotification(errorMsg);
      console.error(errorMsg);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
      await sendDiscordNotification(
        `Subscription attempt started for user: ${email} with plan: ${plan}`,
        process.env.NEXT_PUBLIC_SUBSCRIPTION_CHANNEL_ID || ""
      );

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: { email },
      });

      if (error) {
        setErrorMessage(error.message!);
        await sendDiscordNotification(
          `Subscription failed for user: ${email}. Error: ${error.message}`,
          process.env.NEXT_PUBLIC_ERROR_CHANNEL_ID || ""
        );
        return;
      }

      const response = await axios.post("/api/create-subscription", {
        email,
        paymentMethodId: paymentMethod!.id,
        priceId,
      });

      if (response.data.success) {
        setSuccessMessage(
          "Subscription successful! Welcome to the " + plan + " plan."
        );
        await updateUserSubscription();
        await grantAllAppAccess();
        onSuccess();

        await sendDiscordNotification(
          `Subscription successful for user: ${email}. Plan: ${plan}`,
          process.env.NEXT_PUBLIC_SUBSCRIPTION_CHANNEL_ID || ""
        );
      } else {
        const errorMsg = `Subscription process failed for user: ${email}.`;
        setErrorMessage("Subscription failed. Please try again.");
        await sendDiscordNotification(
          errorMsg,
          process.env.NEXT_PUBLIC_ERROR_CHANNEL_ID || ""
        );
      }
    } catch (error: any) {
      const errorMsg = `Subscription error for user: ${email}. Error: ${error.message}`;
      setErrorMessage(error.message);
      await sendDiscordNotification(
        errorMsg,
        process.env.NEXT_PUBLIC_ERROR_CHANNEL_ID || ""
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-zinc-700 dark:text-zinc-300 p-5 border border-zinc-700 dark:border-zinc-400 rounded-lg shadow-md w-full"
    >
      <h2 className="mb-6 text-4xl font-semibold">Subscribe to {plan} Plan</h2>

      <div className="mb-3">
        <label htmlFor="email-input" className="mb-1.5 block ">
          Email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="email"
          required
          id="email-input"
          type="email"
          placeholder="jon_doe@example.com"
          className="w-full rounded-md border px-3 py-2 placeholder-zinc-600 border-zinc-700 dark:border-zinc-400 dark:bg-dorkz bg-creamy-11 dark:placeholder-zinc-400 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-zinc-600 dark:focus:ring-zinc-100"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="card-element" className="mb-1.5 block ">
          Card Details
        </label>
        <div className="border border-zinc-700 dark:border-zinc-400 rounded-md p-3">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>
      </div>

      <BubbleButton
        type="submit"
        className="flex w-full justify-center py-3"
        disabled={!stripe}
      >
        Subscribe
      </BubbleButton>

      {errorMessage && <div className="text-red-500 mt-3">{errorMessage}</div>}
      {successMessage && (
        <div className="text-green-500 mt-3">{successMessage}</div>
      )}
    </form>
  );
};

const StripeSubscription = ({
  plan,
  onSuccess,
}: {
  plan: any;
  onSuccess: () => void;
}) => (
  <Elements stripe={stripePromise}>
    <SubscriptionForm plan={plan} onSuccess={onSuccess} />
  </Elements>
);

export default StripeSubscription;
