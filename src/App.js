import FaultEquationCalculator from "./fault_equation_calculator";
import { Routes, Route, HashRouter } from "react-router-dom";
import React, { Suspense } from "react";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="./"
              element={<FaultEquationCalculator />}
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
}

export default App;
