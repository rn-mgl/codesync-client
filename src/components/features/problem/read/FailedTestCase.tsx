import { BaseTestCase } from "@/src/interfaces/test-case.interface";

const FailedTestCase = (props: { testCase: BaseTestCase; output: unknown }) => {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-2">
      <p className="text-xs mt-2">Input</p>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        {Object.entries(props.testCase.input).map(([param, value]) => {
          const parsedValue = JSON.stringify(value, null, 2);

          return (
            <div
              key={param}
              className="p-4 rounded-md bg-neutral-300 text-sm w-full"
            >
              <p className="font-medium text-xs opacity-80">{param}=</p>
              <p className="font-medium mt-1">{parsedValue}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-2">Expected Output</p>
      <div className="p-4 rounded-md bg-neutral-300 text-sm w-full">
        <p className="font-medium ">
          {JSON.stringify(props.testCase.expected_output, null, 2)}
        </p>
      </div>

      <p className="text-xs mt-2">Submission Output</p>
      <div className="p-4 rounded-md bg-red-300 text-red-900 text-sm w-full">
        <p className="font-medium">{JSON.stringify(props.output, null, 2)}</p>
      </div>
    </div>
  );
};

export default FailedTestCase;
