"use client";
import SubscriptionForm from "./SubscriptionForm";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../components/animated-modal";
import Pricing from "./Pricing";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { FreeTier } from "./freeTier";

export function NewUserModal() {
  const [stepsComplete, setStepsComplete] = useState(0);

  const numSteps = 4;
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSetStep = (num: -1 | 1) => {
    // Calculate the new step
    const newStep = stepsComplete + num;

    // Boundary check to prevent going below 0 or above numSteps
    if (newStep < 0 || newStep > numSteps) {
      return;
    }

    // Set stepsComplete to the calculated newStep
    setStepsComplete(newStep);
  };
  console.log(stepsComplete);

  return (
    <div className="py-40 flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Book your flight
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            ✈️
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            {selectedPlan && stepsComplete === 1 && (
              <CheckoutScreen
                plan={selectedPlan}
                onSuccess={() => handleSetStep(1)}
              />
            )}
            {stepsComplete === 0 && (
              <Pricing setSelectedPlan={(plan: any) => setSelectedPlan(plan)} />
            )}
            {stepsComplete === 2 && <FreeTier />}
          </ModalContent>
          <ModalFooter className="gap-4">
            <Steps numSteps={numSteps} stepsComplete={stepsComplete} />

            <button
              onClick={() => {
                handleSetStep(-1);
              }}
              disabled={stepsComplete === 0}
              className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
            >
              Previous
            </button>
            <button
              onClick={() => handleSetStep(1)}
              disabled={selectedPlan === null}
              className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
            >
              Next
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
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
