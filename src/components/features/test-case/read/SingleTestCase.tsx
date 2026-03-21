"use client";

import { useParams } from "next/navigation";
import React from "react";

const SingleTestCase = () => {
  const params = useParams();

  const getTestCase = React.useCallback(async () => {
    try {
      if (!params || !params.id) return;

      const response = await fetch(`/api/test-case/${params.id}`, {
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
  }, [params]);

  return <div>SingleTestCase</div>;
};

export default SingleTestCase;
