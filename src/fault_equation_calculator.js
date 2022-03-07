// To do:
// negative in time constant still graphs?
// constrain max number of increments
// do max min graph values need to be set?
// use isnumeric to check in handle_graph_update
// handle other errors that could cause graph to not plot
// implement flex box manually (to avoid padding) and make responsive

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
// eslint-disable-next-line
import { Chart } from "chart.js/auto";
import "katex/dist/katex.min.css";
// eslint-disable-next-line
import { InlineMath, BlockMath } from "react-katex";
import { Form, Container, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function FaultEquationCalculator() {
  const [I_ratio, set_I_ratio] = useState(10);
  const [tm, set_tm] = useState(1);
  const [I_ratio_min, set_I_ratio_min] = useState(0);
  const [I_ratio_max, set_I_ratio_max] = useState(15);
  const [I_ratio_increments, set_I_ratio_increments] = useState(1000);
  const [logarithmic, set_logarithmic] = useState(true);
  const [graph_logarithmic, set_graph_logarithmic] = useState("logarithmic");
  const [data, set_data] = useState("");
  const [graph_error, set_graph_error] = useState("");

  // eslint-disable-next-line
  useEffect(handle_graph_update, [
    tm,
    I_ratio_min,
    I_ratio_max,
    I_ratio_increments,
  ]);

  function handle_graph_update() {
    if (
      I_ratio_min !== "-" &&
      I_ratio_max !== "-" &&
      I_ratio_min !== "" &&
      I_ratio_max !== ""
    ) {
      set_graph_error("");
      var x = makeArr(
        parseFloat(I_ratio_min),
        parseFloat(I_ratio_max),
        parseInt(I_ratio_increments)
      );
      var y = fault_equation_array(x);
      set_data([x, y]);
    } else {
      set_graph_error("Error updating graph. Check your inputs.");
    }
  }

  var SUPERSCRIPTS = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
    "+": "⁺",
    "-": "⁻",
    a: "ᵃ",
    b: "ᵇ",
    c: "ᶜ",
    d: "ᵈ",
    e: "ᵉ",
    f: "ᶠ",
    g: "ᵍ",
    h: "ʰ",
    i: "ⁱ",
    j: "ʲ",
    k: "ᵏ",
    l: "ˡ",
    m: "ᵐ",
    n: "ⁿ",
    o: "ᵒ",
    p: "ᵖ",
    r: "ʳ",
    s: "ˢ",
    t: "ᵗ",
    u: "ᵘ",
    v: "ᵛ",
    w: "ʷ",
    x: "ˣ",
    y: "ʸ",
    z: "ᶻ",
  };

  function superScriptNumber(num, base) {
    var numStr = num.toString(base);
    if (numStr === "NaN") {
      return "ᴺᵃᴺ";
    }
    if (numStr === "Infinity") {
      return "⁺ᴵⁿᶠ";
    }
    if (numStr === "-Infinity") {
      return "⁻ᴵⁿᶠ";
    }
    return numStr
      .split("")
      .map(function (c) {
        var supc = SUPERSCRIPTS[c];
        if (supc) {
          return supc;
        }
        return "";
      })
      .join("");
  }

  function handle_log_change() {
    if (logarithmic === true) {
      set_logarithmic(false);
    } else {
      set_logarithmic(true);
    }

    if (graph_logarithmic === "logarithmic") {
      set_graph_logarithmic("linear");
    } else {
      set_graph_logarithmic("logarithmic");
    }
  }

  function fault_equation(tm, I_ratio) {
    return (tm * 0.14) / (Math.pow(I_ratio, 0.02) - 1);
  }

  function display_single_fault_equation() {
    var t = fault_equation(tm, I_ratio);
    if (isNaN(t) || tm === "" || I_ratio === "") {
      return "Error. Check your input values.";
    } else {
      return t + " seconds.";
    }
  }

  function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(parseFloat(startValue + step * i));
    }
    return arr;
  }

  function fault_equation_array(array) {
    var arr = [];
    for (const element of array) {
      arr.push(fault_equation(tm, element));
    }
    return arr;
  }

  function render_graph() {
    return (
      <Line
        data={{
          labels: data[0],
          datasets: [
            {
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              data: data[1],
            },
          ],
        }}
        options={{
          spanGaps: true,
          animation: false,
          interaction: {
            intersect: false,
            // mode: "nearest",
          },
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            point: {
              radius: 0,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Current Ratio (A/A)",
                font: {
                  size: 20,
                },
              },
              type: "linear",
              // min: parseFloat(I_ratio_min),
              // max: parseFloat(I_ratio_max),
              ticks: {
                font: {
                  size: 18,
                },
                // step: 50,
                // maxTicksLimit: 10,
                // beginAtZero: true,
              },
            },
            y: {
              title: {
                display: true,
                text: "Time (s)",
                font: {
                  size: 20,
                },
              },
              type: graph_logarithmic,
              ticks: {
                font: {
                  size: 18,
                },
                autoSkip: true,
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                  if (
                    graph_logarithmic === "logarithmic" &&
                    Number.isInteger(Math.log10(value))
                  ) {
                    return "10" + superScriptNumber(Math.log10(value));
                  } else if (graph_logarithmic !== "logarithmic") {
                    return value;
                  }
                },
              },
            },
          },
          plugins: {
            tooltip: {
              bodyAlign: "right",
              displayColors: false,
              callbacks: {
                beforeLabel: function (context) {
                  return "Time: " + context.parsed.y.toFixed(2) + "s";
                },
                label: function (context) {
                  return "Current Ratio: " + context.parsed.x.toFixed(2);
                },
                title: function () {},
              },
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: "Fault Equation",
              font: {
                size: 22,
              },
            },
          },
        }}
      />
    );
  }

  return (
    <div className="body">
      <h1 style={{ textAlign: "center" }}>Fault Equation Calculator</h1>

      <br></br>

      <div style={{ textAlign: "center" }}>
        <InlineMath math="t = \dfrac{t_m0.14}{I_{ratio}^{0.02}-1}" />
      </div>

      <br></br>
      <br></br>
      {/* xs (phones), sm (tablets), md (desktops), and lg (larger desktops). */}
      <Container>
        <Row>
          <Col>
            <h3>Calculator</h3>

            <Form>
              <Form.Label>
                Time Constant <InlineMath math="(t_m)" />
              </Form.Label>
              <Form.Control
                type="number"
                value={tm}
                onChange={(e) => {
                  set_tm(e.target.value);
                }}
                required
              />
              <br></br>
              <Form.Label>
                Current Ratio <InlineMath math="(I_{ratio})" />
              </Form.Label>
              <Form.Control
                type="number"
                value={I_ratio}
                onChange={(e) => set_I_ratio(e.target.value)}
                required
              />
              <br></br>
              <h5>Time</h5>
              <Form.Label>{display_single_fault_equation()}</Form.Label>
            </Form>
          </Col>

          <Col>
            <Form>
              <h3>Plot</h3>
              <Form.Label>
                Minimum Current Ratio <InlineMath math="(I_{ratio,min})" />
              </Form.Label>
              <Form.Control
                type="number"
                value={I_ratio_min}
                onChange={(e) => set_I_ratio_min(e.target.value)}
                required
              />
              <br></br>
              <Form.Label>
                Maximum Current Ratio <InlineMath math="(I_{ratio,max})" />
              </Form.Label>
              <Form.Control
                type="number"
                value={I_ratio_max}
                onChange={(e) => set_I_ratio_max(e.target.value)}
                required
              />
              <br></br>
              <Form.Label>Number of Increments</Form.Label>
              <Form.Control
                type="number"
                value={I_ratio_increments}
                onChange={(e) => set_I_ratio_increments(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                More increments will take longer to update.
              </Form.Text>
              <br></br>
              <br></br>
              <Form.Check
                type="checkbox"
                label="Logarithmic"
                checked={logarithmic}
                onChange={handle_log_change}
              />
            </Form>
          </Col>

          <Col
            lg="auto"
            md="auto"
            sm={true}
            xs={true}
            style={{
              height: "350px",
              width: "50%",
            }}
          >
            <h6 style={{ textAlign: "center" }}>{graph_error}</h6>
            {render_graph()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FaultEquationCalculator;
