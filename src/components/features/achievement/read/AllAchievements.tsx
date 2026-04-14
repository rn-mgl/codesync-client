"use client";

import React from "react";

const AllAchievements = () => {
  const getAchievements = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/achievement`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve = await response.json();

      console.log(resolve);
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  return <div>AllAchievements</div>;
};

export default AllAchievements;
