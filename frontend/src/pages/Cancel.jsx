import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-base-100">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-error/20 p-4">
            <XCircle className="w-16 h-16 text-error" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Payment Cancelled</h1>

        <p className="text-gray-500">
          The payment process was cancelled and no charges were made. If this was a mistake, you can try again from the premium page.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate("/premium")}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost w-full"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
