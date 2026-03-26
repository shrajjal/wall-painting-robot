import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(8);
  const [obstacles, setObstacles] = useState([]);
  const [animatedPath, setAnimatedPath] = useState([]);
  const [speed, setSpeed] = useState(80);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [savedList, setSavedList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const BASE_URL="https://wall-painting-robot-edx3.onrender.com";

  // ---------------------------
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // ---------------------------
  const toggleObstacle = (x, y) => {
    const exists = obstacles.some(o => o.x === x && o.y === y);

    if (exists) {
      setObstacles(obstacles.filter(o => !(o.x === x && o.y === y)));
    } else {
      setObstacles([...obstacles, { x, y, width: 1, height: 1 }]);
    }
  };

  // ---------------------------
  const animatePath = async (path) => {
    setAnimatedPath([]);
    for (let i = 0; i < path.length; i++) {
      setAnimatedPath(prev => [...prev, path[i]]);
      await sleep(speed);
    }
  };

  // ---------------------------
  const generatePath = async () => {
    if (isRunning) return;

    setIsRunning(true);

    const res = await axios.post(`${BASE_URL}/trajectory`, {
      width,
      height,
      obstacles
    });

    await animatePath(res.data.path);
    fetchAll();

    setIsRunning(false);
  };

  // ---------------------------
  const fetchAll = async () => {
    const res = await axios.get(`${BASE_URL}/trajectories`);
    setSavedList(res.data.reverse());
  };

  // ---------------------------
  const loadTrajectory = async (id) => {
    if (isRunning) return;

    setIsRunning(true);

    const res = await axios.get(`${BASE_URL}/trajectory/${id}`);

    // 🔥 FIXES
    setWidth(res.data.width);
    setHeight(res.data.height);
    setObstacles(res.data.obstacles || []);

    await animatePath(res.data.path);

    setIsRunning(false);
  };

  // ---------------------------
  const deleteTrajectory = async (id) => {
    await axios.delete(`${BASE_URL}/trajectory/${id}`);
    fetchAll();
  };

  // ---------------------------
  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------------------
  const totalSteps = animatedPath.length;
  const uniqueCells = new Set(animatedPath.map(p => `${p[0]}-${p[1]}`)).size;
  const revisits = totalSteps - uniqueCells;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex">

      {/* PANEL */}
      <div className="w-72 bg-white shadow-lg p-4 overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">Controls</h2>

        <div className="mb-4 flex gap-2">
          <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="border p-1 w-16 rounded" />
          <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="border p-1 w-16 rounded" />
        </div>

        <div className="mb-4">
          <label>Speed</label>
          <input type="range" min="20" max="200" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-full" />
        </div>

        <button onClick={generatePath} className="bg-blue-500 text-white w-full py-2 mb-2 rounded">
          Generate Path
        </button>

        <button onClick={() => setAnimatedPath([])} className="bg-yellow-500 text-white w-full py-2 mb-2 rounded">
          Reset Path
        </button>

        <button onClick={() => { setObstacles([]); setAnimatedPath([]); }} className="bg-red-500 text-white w-full py-2 rounded">
          Clear All
        </button>

        {/* METRICS */}
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <p>Steps: {totalSteps}</p>
          <p>Unique: {uniqueCells}</p>
          <p>Revisits: {revisits}</p>
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 bg-purple-500 text-white w-full py-2 rounded"
        >
          {showAll ? "Hide Paths" : "Show All Paths"}
        </button>

        {/* SAVED PATHS */}
        {showAll && (
          <div className="mt-3">
            {savedList.map(item => (
              <div key={item.id} className="flex items-center gap-2 mb-2">

                <button
                  onClick={() => loadTrajectory(item.id)}
                  className="flex-1 bg-gray-200 px-2 py-1 rounded text-left"
                >
                  Path #{item.id}
                </button>

                <button
                  onClick={() => deleteTrajectory(item.id)}
                  className="bg-red-400 text-white px-2 py-1 rounded"
                >
                  ❌
                </button>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* GRID */}
      <div className="flex-1 flex justify-center items-center">

          <p className="mb-4 text-gray-700 font-medium">
            Click on boxes to create obstacles
          </p>        

        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${width}, 42px)` }}
          onMouseLeave={() => setIsDrawing(false)}
        >
          {Array.from({ length: width * height }).map((_, i) => {
            const x = i % width;
            const y = Math.floor(i / width);

            const isObstacle = obstacles.some(o => o.x === x && o.y === y);
            const isPath = animatedPath.some(p => p[0] === x && p[1] === y);
            const isRobot =
              animatedPath.length > 0 &&
              animatedPath[animatedPath.length - 1][0] === x &&
              animatedPath[animatedPath.length - 1][1] === y;

            return (
              <div
                key={i}
                onMouseDown={() => {
                  setIsDrawing(true);
                  toggleObstacle(x, y);
                }}
                onMouseUp={() => setIsDrawing(false)}
                onMouseEnter={() => {
                  if (isDrawing) toggleObstacle(x, y);
                }}
                className="w-10 h-10 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor:
                    isObstacle ? "#000000" :
                    isRobot ? "#f97316" :
                    isPath ? "#86efac" :
                    "#f9fafb"
                }}
              >
                {isRobot ? "🤖" : ""}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}