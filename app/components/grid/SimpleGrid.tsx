import React from "react";
import {
  FiCalendar,
  FiCheck,
  FiCloud,
  FiDollarSign,
  FiMoon,
  FiWatch,
} from "react-icons/fi";
import { IconType } from "react-icons";

export const SimpleGrid = () => (
  <div className="relative z-10 grid grid-cols-2 gap-9 px-3 md:grid-cols-3 md:gap-12 md:px-6">
    <Item
      Icon={FiCalendar}
      title="Automate Scheduling"
      subtitle="Effortlessly manage staff schedules with AI-driven recommendations based on business needs."
    />
    <Item
      Icon={FiWatch}
      title="Save Time"
      subtitle="Reduce hours spent on repetitive tasks and focus on creating the perfect dining experience."
    />
    <Item
      Icon={FiMoon}
      title="Stress-Free Operations"
      subtitle="Let AI handle the details so you can rest easy, knowing your restaurant runs smoothly."
    />
    <Item
      Icon={FiDollarSign}
      title="Increase Profitability"
      subtitle="Optimize costs by efficiently managing inventory, staff, and resources, saving thousands."
    />
    <Item
      Icon={FiCloud}
      title="Cloud-Based Control"
      subtitle="Access and manage your restaurant from anywhere with our secure, cloud-hosted platform."
    />
    <Item
      Icon={FiCheck}
      title="Comprehensive Solution"
      subtitle="From menu personalization to analytics, we provide everything you need to thrive."
    />
  </div>
);

const Item = ({
  Icon,
  title,
  subtitle,
}: {
  Icon: IconType;
  title: string;
  subtitle: string;
}) => {
  return (
    <div>
      <h4 className="mb-1.5 flex items-start text-lg font-medium md:text-xl">
        <Icon className="mr-1.5 h-[26px] text-violet-600" />
        {title}
      </h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 md:text-base">
        {subtitle}
      </p>
    </div>
  );
};
