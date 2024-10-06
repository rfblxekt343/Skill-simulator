import LogInForm from "../components/LogInForm"; // Uncomment if needed
import TimeManagement from "../components/Tests/TimeManagement"; // Uncomment if needed
import HandlingPressureTest from "../components/Tests/HandlingPressure"; // Uncomment if needed
import InterceptorManagementTest from "../components/Tests/InterceptorManagement"; // Uncomment if needed
import Game from "../components/Game"; // Uncomment if needed
import Map from "../components/Map"; // Uncomment if needed
import SimulatorPage from "./sadirLogin/page"; // Uncomment if needed

import { metadata } from './metadata'; // Importing metadata

// Exporting metadata so it can be used by Next.js for page-level settings
export { metadata };

// Main component for the home page
export default function Home() {
  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center">
      {/* Uncomment the components you want to display */}
      {/* <SimulatorPage /> */}
      {/* <Map /> */}
      <LogInForm />
      {/* <Drag /> */}
      {/* <TimeManagement /> */}
      {/* <HandlingPressureTest/> */}
      {/* <InterceptorManagementTest/> */}
      {/* <Game /> */}
    </div>
  );
}
