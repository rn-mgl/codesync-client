"use client";

import { DateTime } from "luxon";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const LEVELS = [
  "bg-neutral-200",
  "bg-success/20",
  "bg-success/40",
  "bg-success/70",
  "bg-success",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const getLevel = (count: number): number => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
};

const HeatmapCalendar = (props: { activity?: Record<string, number> }) => {
  const activity = props.activity ?? {};
  const [currentMonth, setCurrentMonth] = React.useState(0);

  const [today] = React.useState(() => DateTime.now().startOf("day"));

  const months = React.useMemo(() => {
    return Array.from({ length: today.month }, (_, i) =>
      today.startOf("month").set({ month: i + 1 }),
    );
  }, [today]);

  const yearMonths = React.useMemo(() => {
    return Array.from(
      { length: 12 },
      (_, i) => today.startOf("month").set({ month: i + 1 }),
    );
  }, [today]);

  const yearPrefix = `${today.year}-`;

  const yearActivity = Object.entries(activity).reduce<Record<string, number>>(
    (acc, [key, count]) => {
      if (key.startsWith(yearPrefix)) {
        acc[key] = count;
      }

      return acc;
    },
    {},
  );

  const totalSubmissions = Object.values(yearActivity).reduce(
    (sum, count) => sum + count,
    0,
  );
  const activeDays = Object.keys(yearActivity).length;

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => Math.max(0, prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => Math.min(months.length - 1, prev + 1));
  };

  const mappedWeekdays = WEEKDAYS.map((label, index) => {
    return (
      <p key={index} className="text-center text-[10px] text-neutral-400">
        {label}
      </p>
    );
  });

  const mappedYearMonths = yearMonths.map((month) => {
    const first = month.startOf("month");
    const offset = first.weekday % 7;
    const days = month.daysInMonth ?? 0;
    const mappedDays = Array.from({ length: days }, (_, index) => {
      const day = first.plus({ days: index });
      const key = day.toFormat("yyyy-LL-dd");
      const count = activity[key] ?? 0;

      return (
        <div
          key={key}
          title={`${count} submission${count === 1 ? "" : "s"} on ${day.toFormat("DDD")}`}
          className={`aspect-square w-full rounded-[3px] ${LEVELS[getLevel(count)]}`}
        />
      );
    });
    const mappedBlanks = Array.from({ length: offset }, (_, index) => {
      return <div key={`blank-${index}`} className="aspect-square w-full" />;
    });

    return (
      <div
        key={month.toFormat("yyyy-LL")}
        className="w-full flex flex-col gap-1"
      >
        <p className="text-[11px] font-bold text-neutral-500 capitalize">
          {month.toFormat("LLL")}
        </p>

        <div className="w-full grid grid-cols-7 gap-0.5">
          {mappedWeekdays}
          {mappedBlanks}
          {mappedDays}
        </div>
      </div>
    );
  });

  const mappedMonths = months.map((month) => {
    const first = month.startOf("month");
    const offset = first.weekday % 7;
    const days = month.daysInMonth ?? 0;
    const mappedDays = Array.from({ length: days }, (_, index) => {
      const day = first.plus({ days: index });
      const key = day.toFormat("yyyy-LL-dd");
      const count = activity[key] ?? 0;

      return (
        <div
          key={key}
          title={`${count} submission${count === 1 ? "" : "s"} on ${day.toFormat("DDD")}`}
          className={`h-4 w-4 rounded-sm ${LEVELS[getLevel(count)]}`}
        />
      );
    });
    const mappedBlanks = Array.from({ length: offset }, (_, index) => {
      return <div key={`blank-${index}`} className="h-4 w-4" />;
    });

    return (
      <div
        key={month.toFormat("yyyy-LL")}
        className="w-full flex flex-col items-center"
      >
        <div className="w-fit grid grid-cols-7 gap-1">
          {mappedWeekdays}
          {mappedBlanks}
          {mappedDays}
        </div>
      </div>
    );
  });

  const mappedLegend = LEVELS.map((level, index) => {
    return <div key={index} className={`h-2.5 w-2.5 rounded-[3px] ${level}`} />;
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="font-bold">Contribution heatmap</p>

        <p className="text-sm text-neutral-500">
          {totalSubmissions} submissions across {activeDays} active days
        </p>
      </div>

      <div className="hidden t:flex flex-col gap-3">
        <div className="w-full grid grid-cols-4 l-s:grid-cols-6 l-l:grid-cols-6 gap-4">
          {mappedYearMonths}
        </div>
      </div>

      <div className="flex t:hidden flex-col items-center gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            disabled={currentMonth === 0}
            className="p-2 rounded-full text-neutral-600 hover:text-primary"
          >
            <FaChevronLeft />
          </button>

          <p className="text-sm font-bold capitalize">
            {months[currentMonth]?.toFormat("LLLL yyyy")}
          </p>

          <button
            onClick={handleNextMonth}
            disabled={currentMonth === months.length - 1}
            className="p-2 rounded-full text-neutral-600 hover:text-primary"
          >
            <FaChevronRight />
          </button>
        </div>

        {mappedMonths[currentMonth]}
      </div>

      <div className="w-full flex flex-row items-center gap-2 text-xs text-neutral-500">
        <span>Less</span>

        {mappedLegend}

        <span>More</span>
      </div>
    </div>
  );
};

export default HeatmapCalendar;
