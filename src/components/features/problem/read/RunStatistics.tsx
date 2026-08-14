import { SubmissionStatistics } from "@/src/interfaces/submission.interface";
import { Bar } from "react-chartjs-2";
import "@/lib/Chart";

// Bar chart of the current solution's performance versus all submissions,
// toggled between runtime and memory.
const RunStatistics = (props: {
  statistics: SubmissionStatistics;
  activeChart: "runtime" | "memory";
}) => {
  const runtimeData = [...props.statistics.runtime].sort((a, b) => a.ms - b.ms);
  const memoryData = [...props.statistics.memory].sort((a, b) => a.mb - b.mb);

  const isRuntime = props.activeChart === "runtime";

  return (
    <div className="w-full aspect-video p-2 rounded-md bg-neutral-200">
      <Bar
        data={{
          labels: isRuntime
            ? runtimeData.map((stat) => `${stat.ms} ms`)
            : memoryData.map((stat) => `${stat.mb} mb`),
          datasets: [
            {
              label: isRuntime ? "Runtime Complexity" : "Memory Complexity",
              data: isRuntime
                ? runtimeData.map((stat) => stat.percentage)
                : memoryData.map((stat) => stat.percentage),
              backgroundColor: [isRuntime ? "#ff8970" : "#839fff"],
              borderRadius: 9,
              borderSkipped: false,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              beginAtZero: true,
              ticks: {
                autoSkip: true,
              },
            },
          },
          responsive: true,
          maintainAspectRatio: true,
          resizeDelay: 1,
        }}
      />
    </div>
  );
};

export default RunStatistics;
