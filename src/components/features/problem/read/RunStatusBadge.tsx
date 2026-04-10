const RunStatusBadge = (props: { passed: number; total: number }) => {
  return (
    <div
      className={`w-full flex items-center justify-center rounded-md
                ${props.passed === props.total ? "bg-green-300" : "bg-red-300"} `}
    >
      <p className="p-2 rounded-md text-xs font-bold">
        {props.passed} / {props.total} Test Cases Passed
      </p>
    </div>
  );
};

export default RunStatusBadge;
