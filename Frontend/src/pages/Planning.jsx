import React, { useState, useEffect } from "react";
import { Scheduler } from "@y0u5s3f/custom-react-scheduler";
import "@y0u5s3f/custom-react-scheduler/dist/style.css";
import dayjs from "dayjs";

export default function SimpleCalendar() {
  const [schedulerData, setSchedulerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/label/labels/?stream=true");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Helper function to transform each streamed item
        const transformItem = (item) => {
          const transformEvent = (event) => {
            const formatDate = (dateString) =>
              dateString ? dayjs(dateString).format("YYYY-MM-DDTHH:mm:ss") : null;
            return {
              ...event,
              startDate: formatDate(event.startDate),
              endDate: formatDate(event.endDate),
              title: dayjs(event.startDate).format("HH:mm"),
              subtitle: dayjs(event.endDate).format("HH:mm"),
              description: (event.pauseIn || event.pauseOut)
              ? `${event.pauseIn ? event.pauseIn : ""}${(event.pauseIn && event.pauseOut) ? "-" : ""}${event.pauseOut ? event.pauseOut : ""}`
              : "pas de pause",
              bg_color: event.bg_color || "#4CAF50",
            };
          };

          return {
            id: item.id,
            label: { title: item.title, subtitle: item.subtitle },
            data: item.data.map(transformEvent),
          };
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); // Save last incomplete line
          for (const line of lines) {
            if (line.trim()) {
              try {
                const item = JSON.parse(line);
                const transformedItem = transformItem(item);
                // Append the new item to schedulerData
                setSchedulerData(prevData => [...prevData, transformedItem]);
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
        // Handle any remaining buffered content.
        if (buffer.trim()) {
          try {
            const item = JSON.parse(buffer);
            const transformedItem = transformItem(item);
            setSchedulerData(prevData => [...prevData, transformedItem]);
          } catch (e) {
            console.error("Error parsing final JSON:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchLabels();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Scheduler
        isLoading={isLoading}
        data={schedulerData}
        onItemClick={(item) => console.log("Item clicked:", item)}
        onTileClick={(tile) => console.log("Tile clicked:", tile)}
        config={{
          zoom: 1,
          maxRecordsPerPage: 14,
          maxRecordsPerTile: 3,
          filterButtonState: false,
          defaultTheme: "dark",
          initialDate: new Date(), // Starts on today's date
        }}
      />
    </div>
  );
}
