import { SubmissionStatistics } from "@/src/interfaces/submission.interface";
import { Bar } from "react-chartjs-2";
import "@/lib/Chart";

const RunStatistics = (props: {
  statistics: SubmissionStatistics;
  activeChart: "runtime" | "memory";
}) => {
  const runtimeData = [...props.statistics.runtime].sort((a, b) => a.ms - b.ms);
  const memoryData = [...props.statistics.memory].sort((a, b) => a.mb - b.mb);

  return (
    <div className="w-full aspect-video p-2 rounded-md bg-neutral-200">
      <Bar
        data={{
          labels:
            props.activeChart === "runtime"
              ? runtimeData.map((stat) => `${stat.ms} ms`)
              : memoryData.map((stat) => `${stat.mb} mb`),
          datasets: [
            {
              label:
                props.activeChart === "runtime"
                  ? "Runtime Complexity"
                  : "Memory Complexity",
              data:
                props.activeChart === "runtime"
                  ? runtimeData.map((stat) => stat.percentage)
                  : memoryData.map((stat) => stat.percentage),
              backgroundColor: [
                props.activeChart === "runtime" ? "#ff8970" : "#839fff",
              ],
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
