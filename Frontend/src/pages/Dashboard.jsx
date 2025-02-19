import React, { useState, useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]); // Ensure it's always an array

  useEffect(() => {
    setIsLoading(true);

    // Simulating API call with timeout
    setTimeout(() => {
      setData([
        {
          id: 1,
          start: new Date(), // Start time (Date object or ISO string)
          end: new Date(new Date().getTime() + 60 * 60 * 1000), // End time
          title: "Meeting", // Title of the event
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h2>Scheduler</h2>
      <Scheduler
        isLoading={isLoading}
        data={Array.isArray(data) ? data : []} // Ensure data is always an array
        onItemClick={(clickedItem) => console.log(clickedItem)}
        onFilterData={() => {
          // Handle filtering logic
        }}
        onClearFilterData={() => {
          // Handle clearing filters
        }}
        config={{
          filterButtonState: 0,
          zoom: 0,
          lang: "en",
          maxRecordsPerPage: 20,
        }}
      />
    </div>
  );
}
