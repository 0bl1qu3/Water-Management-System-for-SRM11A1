import React from "react";

const UsageMonitor = () => {
  // Sample data for accommodations with total reservoir capacity
  const accommodations = [
    {
      name: "Horizon",
      waterLevel: 75, // Percentage of water left
      totalCapacity: 10000, // Total liters in reservoir
      dailyConsumption: 1200, // Liters
      leakReports: 2,
      conservationTip: "Turn off taps while brushing teeth to save water.",
    },
    {
      name: "Kilimanjaro",
      waterLevel: 45, // Percentage
      totalCapacity: 10000, // Total liters in reservoir
      dailyConsumption: 1500, // Liters
      leakReports: 5,
      conservationTip: "Fix leaks promptly to reduce water loss.",
    },
    {
      name: "Ndlovukazi",
      waterLevel: 20, // Percentage
      totalCapacity: 10000, // Total liters in reservoir
      dailyConsumption: 800, // Liters
      leakReports: 3,
      conservationTip: "Use a broom instead of a hose to clean driveways.",
    },
  ];

  // Campus-wide data (including residences and other buildings)
  const campusData = {
    name: "Entire Campus",
    totalCapacity: accommodations.reduce((sum, acc) => sum + acc.totalCapacity, 0) + 20000, // Adding 20,000L for other buildings
    dailyConsumption: accommodations.reduce((sum, acc) => sum + acc.dailyConsumption, 0) + 3000, // Adding 3,000L for other buildings
    leakReports: accommodations.reduce((sum, acc) => sum + acc.leakReports, 0) + 4, // Adding 4 leaks for other buildings
    conservationTip: "Implement rainwater harvesting to supplement campus water supply.",
  };
  // Calculate total remaining liters and water level for campus
  const campusRemainingLiters = accommodations.reduce(
    (sum, acc) => sum + (acc.waterLevel / 100) * acc.totalCapacity,
    0
  ) + 10000; // Assuming other buildings have 10,000L remaining
  const campusWaterLevel = Math.round((campusRemainingLiters / campusData.totalCapacity) * 100);

  // Function to determine color based on water level
  const getWaterLevelColor = (percentage) => {
    if (percentage >= 70) return "text-green-500"; // High water level
    if (percentage >= 30) return "text-orange-500"; // Medium water level
    return "text-red-500"; // Low water level
  };

  // Function to calculate stroke dasharray for circular progress
  const getStrokeDasharray = (percentage) => {
    const circumference = 2 * Math.PI * 45; // Radius of 45px
    const strokeDash = (percentage / 100) * circumference;
    return `${strokeDash} ${circumference - strokeDash}`;
  };

  // Function to calculate remaining liters
  const calculateRemainingLiters = (waterLevel, totalCapacity) => {
    return Math.round((waterLevel / 100) * totalCapacity);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Water Usage Monitor
        </h2>
        {/* Campus-wide Statistics Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col items-center transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {campusData.name}
          </h3>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={campusWaterLevel >= 70 ? "#22c55e" : campusWaterLevel >= 30 ? "#f97316" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={getStrokeDasharray(campusWaterLevel)}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy=".3em"
                className={`text-2xl font-bold ${getWaterLevelColor(campusWaterLevel)}`}
              >
                {campusWaterLevel}%
              </text>
            </svg>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Total Capacity:</span>{" "}
              {campusData.totalCapacity} L
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Remaining:</span>{" "}
              {campusRemainingLiters} L
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Daily Consumption:</span>{" "}
              {campusData.dailyConsumption} L
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Active Leak Reports:</span>{" "}
              {campusData.leakReports}
            </p>
            <p className="text-gray-600 italic">
              <span className="font-medium">Conservation Tip:</span>{" "}
              {campusData.conservationTip}
            </p>
          </div>
        </div>
        {/* Residences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accommodations.map((accommodation, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {accommodation.name}
              </h3>
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={accommodation.waterLevel >= 70 ? "#22c55e" : accommodation.waterLevel >= 30 ? "#f97316" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={getStrokeDasharray(accommodation.waterLevel)}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dy=".3em"
                    className={`text-2xl font-bold ${getWaterLevelColor(accommodation.waterLevel)}`}
                  >
                    {accommodation.waterLevel}%
                  </text>
                </svg>
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Total Capacity:</span>{" "}
                  {accommodation.totalCapacity} L
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Remaining:</span>{" "}
                  {calculateRemainingLiters(accommodation.waterLevel, accommodation.totalCapacity)} L
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Daily Consumption:</span>{" "}
                  {accommodation.dailyConsumption} L
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Active Leak Reports:</span>{" "}
                  {accommodation.leakReports}
                </p>
                <p className="text-gray-600 italic">
                  <span className="font-medium">Conservation Tip:</span>{" "}
                  {accommodation.conservationTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageMonitor;