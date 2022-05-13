/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";
import { useState } from "react";

export default function Message({ children }) {
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="mx-auto my-5 max-w-2xl">
      {showMessage && (
        <div className="flex bg-green-50 p-4 rounded-md">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{children}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={setShowMessage.bind(null, false)}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
