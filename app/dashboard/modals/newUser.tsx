"use client";

import SubscriptionForm from "./SubscriptionForm";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import React, { useState, useEffect, useRef } from "react";

import Pricing from "./Pricing";
import { Review } from "./review";

import { AnimatePresence, motion } from "framer-motion";
import { FreeTier } from "./freeTier";
const sendDiscordNotification = async (
  message: string,
  channelId = process.env.NEXT_PUBLIC_ERROR_CHANNEL_ID || ""
) => {
  try {
    await axios.post("/api/sendDiscordMessage", { message, channelId });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
};

export function NewUserModal({ onCompleted }: { onCompleted: () => void }) {
  const { user } = useAuth();
  const [stepsComplete, setStepsComplete] = useState(0);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const numSteps = 4;
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSetStep = async (num: -1 | 1) => {
    const newStep = stepsComplete + num;
    if (newStep < 0 || newStep > numSteps) {
      return;
    }

    setStepsComplete(newStep);
    await sendDiscordNotification(
      `User ${user?.email} moved to step ${newStep} with plan: ${selectedPlan}`,
      process.env.NEXT_PUBLIC_STEP_UPDATE_CHANNEL_ID || ""
    );

    if (newStep === 4) {
      const res = await addUserAppAccess(selectedApp.id);
      if (res?.status === 200) {
        await updateUserSubscription();
        onCompleted();
      }
    }
  };

  async function updateUserSubscription() {
    try {
      const subscriptionTier = selectedPlan.toUpperCase();
      const response = await axios.post("/api/user/setSubscription", {
        userId: user?.id,
        subscriptionTier,
      });
      console.log("Updated user:", response.data);
      await sendDiscordNotification(
        `User ${user?.email} successfully subscribed to ${subscriptionTier} plan.`,
        process.env.NEXT_PUBLIC_SUBSCRIPTION_CHANNEL_ID || ""
      );
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response
        ? `Error updating subscription for user ${user?.email}: ${error.response.data.error}`
        : `Error making request: ${error.message}`;
      await sendDiscordNotification(errorMsg);
      console.error(errorMsg);
    }
  }

  async function addUserAppAccess(appId: string) {
    try {
      const response = await axios.post("/api/apps/setUserAppAccess", {
        userId: user?.id,
        appId,
      });

      console.log("User App Access created:", response);
      await sendDiscordNotification(
        `App access granted to user ${user?.email} for app ID: ${appId}.`,
        process.env.NEXT_PUBLIC_APP_ACCESS_CHANNEL_ID || ""
      );
      return response;
    } catch (error: any) {
      const errorMsg = error.response
        ? `Error granting app access to user ${user?.email}: ${error.response.data.error}`
        : `Request failed: ${error.message}`;
      await sendDiscordNotification(errorMsg);
      console.error(errorMsg);
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="h-full w-full">
        {selectedPlan && stepsComplete === 1 ? (
          selectedPlan === "free" ? (
            (setStepsComplete(2),
            (<FreeTier onSelect={(app) => setSelectedApp(app)} />))
          ) : (
            <CheckoutScreen
              plan={selectedPlan}
              onSuccess={() => window.location.reload()}
            />
          )
        ) : stepsComplete === 0 ? (
          <Pricing setSelectedPlan={setSelectedPlan} />
        ) : stepsComplete === 2 ? (
          <FreeTier onSelect={(app) => setSelectedApp(app)} />
        ) : stepsComplete === 3 ? (
          <Review selectedApp={selectedApp} />
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex gap-4 z-50 justify-end p-4 border-t fixed bottom-0 bg-zinc-50 dark:bg-zinc-950 w-full left-0">
        <Steps numSteps={numSteps} stepsComplete={stepsComplete} />
        <button
          onClick={() => {
            handleSetStep(-1);
            setSelectedApp(null);
            setSelectedPlan(null);
            if (stepsComplete === 2 && selectedPlan === "free") {
              setStepsComplete(0);
            }
          }}
          disabled={
            stepsComplete === 0 ||
            (stepsComplete === 4 && selectedPlan === "free")
          }
          className={`px-2 py-1 text-black dark:text-white border rounded-md text-sm w-28 ${
            stepsComplete === 0 ||
            (stepsComplete === 4 && selectedPlan === "free")
              ? "bg-gray-300 dark:bg-gray-700 border-gray-400"
              : "bg-gray-200 dark:bg-black dark:border-black border-gray-300"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handleSetStep(1)}
          disabled={
            !selectedPlan ||
            (!selectedApp && stepsComplete === 2) ||
            stepsComplete === 1
          }
          className={`text-sm px-2 py-1 rounded-md border w-28 ${
            !selectedPlan ||
            (!selectedApp && stepsComplete === 2) ||
            stepsComplete === 1
              ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-400"
              : "bg-black text-white dark:bg-white dark:text-black border-black"
          }`}
        >
          {stepsComplete === 3 && selectedPlan === "free"
            ? "Confirm App"
            : "Next"}
        </button>
      </div>
    </div>
  );
}

const CheckoutScreen = ({
  plan,
  onSuccess,
}: {
  plan: any;
  onSuccess: () => void;
}) => {
  return (
    <div className="flex flex-col items-center p-8 w-full max-w-xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold text-center w-full">Checkout</h2>
      <p className="text-xl">
        You have selected the <span className="font-semibold">{plan}</span>{" "}
        plan.
      </p>
      {plan === "free" && (
        <p className="text-2xl font-semibold text-indigo-500">Free</p>
      )}
      {plan === "basic" && (
        <p className="text-2xl font-semibold text-indigo-500">$20/month</p>
      )}
      {plan === "pro" && (
        <p className="text-2xl font-semibold text-indigo-500">$40/month</p>
      )}
      <SubscriptionForm plan={plan} onSuccess={onSuccess} />
    </div>
  );
};

const Steps = ({
  numSteps,
  stepsComplete,
}: {
  numSteps: number;
  stepsComplete: number;
}) => {
  const stepArray = Array.from(Array(numSteps).keys());

  return (
    <div className="flex items-center justify-between gap-3">
      {stepArray.map((num) => {
        const stepNum = num + 1;
        const isActive = stepNum <= stepsComplete;
        return (
          <React.Fragment key={stepNum}>
            <Step num={stepNum} isActive={isActive} />
            {stepNum !== stepArray.length && (
              <div className="w-full h-1 rounded-full bg-gray-200 relative">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full"
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ ease: "easeIn", duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step = ({ num, isActive }: { num: number; isActive: boolean }) => {
  return (
    <div className="relative">
      <div
        className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-sm relative z-10 transition-colors duration-300 ${
          isActive
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-gray-300 text-gray-300"
        }`}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.svg
              key="icon-marker-check"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1.6em"
              width="1.6em"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
            </motion.svg>
          ) : (
            <motion.span
              key="icon-marker-num"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <div className="absolute z-0 -inset-1.5 bg-indigo-100 rounded-full animate-pulse" />
      )}
    </div>
  );
};
