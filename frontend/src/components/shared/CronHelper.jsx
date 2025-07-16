import { useState } from "react";

const CronHelper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const examples = [
    { expression: "* * * * *", description: "Every minute" },
    { expression: "*/5 * * * *", description: "Every 5 minutes" },
    { expression: "0 * * * *", description: "Every hour" },
    { expression: "0 0 * * *", description: "Daily at midnight" },
    { expression: "0 3 * * *", description: "Daily at 3 AM" },
    { expression: "0 9 * * 1", description: "Weekly on Monday at 9 AM" },
  ];

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        Cron Expression Help
        {isOpen ? (
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 mb-2">
            Cron format: minute hour day month day-of-week
          </p>
          <div className="space-y-1">
            {examples.map((example, index) => (
              <div key={index} className="flex justify-between text-xs">
                <code className="bg-gray-200 px-2 py-1 rounded font-mono">
                  {example.expression}
                </code>
                <span className="text-gray-600">{example.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CronHelper;
