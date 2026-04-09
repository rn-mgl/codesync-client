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
    <div className="w-full aspect-video p-2 rounded-md bg-primary">
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
                  ? runtimeData.map((stat) => `${stat.percentage}`)
                  : memoryData.map((stat) => `${stat.percentage}`),
              backgroundColor: [
                props.activeChart === "runtime"
                  ? "oklch(78.9% 0.154 211.53)"
                  : "oklch(76.5% 0.177 163.223)",
              ],
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
