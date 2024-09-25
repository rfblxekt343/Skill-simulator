// pages/index.jsx or wherever you use it
import Drag from "../components/Tests/Drag";
import LogInForm from "../components/LogInForm"; // Uncomment if needed
import TimeManagement from "../components/Tests/TimeManagement";
import HandlingPressureTest from "../components/Tests/HandlingPressure";
import InterceptorManagementTest from "../components/Tests/InterceptorManagement";
import Game from "../components/Game";

export default function Home() {

  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center">
      <LogInForm />
      {/* <Drag /> */}
      {/* <TimeManagement /> */}
      {/* <HandlingPressureTest/> */}
      {/* <InterceptorManagementTest/> */}
      {/* <Game /> */}
      
    </div>
  );
}
