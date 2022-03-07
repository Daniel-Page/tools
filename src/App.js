import FaultEquationCalculator from "./fault_equation_calculator";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="fault_equation_calculator"
              element={<FaultEquationCalculator />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
