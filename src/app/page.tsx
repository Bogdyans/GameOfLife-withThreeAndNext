"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Play, Pause } from "lucide-react"
import CubeWall from "@/components/cube-grid";

export default function CubeMatrix() {
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(250)
  const [grid, setGrid] = useState(() => {
    const size = 15
    return Array(size)
        .fill(false)
        .map(() => Array(size).fill(false))
  })

  useEffect(() => {
    if (!isRunning) return

    const simulationStep = () => {
      setGrid((currentGrid) => {
        const size = currentGrid.length
        const newGrid = currentGrid.map((arr) => [...arr])

        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            // Count live neighbors
            let neighbors = 0
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue
                const nx = (x + i + size) % size
                const ny = (y + j + size) % size
                if (currentGrid[nx][ny]) neighbors++
              }
            }

            // Rules
            if (currentGrid[x][y]) {
              // Live cell
              if (neighbors < 2 || neighbors > 3) {
                newGrid[x][y] = false // Dies
              }
            } else {
              // Dead cell
              if (neighbors === 3) {
                newGrid[x][y] = true // Becomes alive
              }
            }
          }
        }
        return newGrid
      })
    }

    const intervalId = setTimeout(simulationStep, speed)
    return () => clearTimeout(intervalId)
  }, [isRunning, grid, speed])

  const handleCellToggle = (x: number, y: number) => {
    if (isRunning) return //comment to able changes in running state

    setGrid((currentGrid) => {
      const newGrid = [...currentGrid]
      newGrid[x] = [...newGrid[x]]
      newGrid[x][y] = !newGrid[x][y]
      return newGrid
    })
  }

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => Math.max(50, prevSpeed - 50))
  }

  const decreaseSpeed = () => {
    setSpeed((prevSpeed) => Math.min(1000, prevSpeed + 50))
  }

  const speedInGenPerSec = (1000 / speed).toFixed(1)

  return (
      <div className="w-full h-screen bg-black relative">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 flex items-center gap-1"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Stop" : "Start"}
            </Button>

            <div className="flex items-center gap-1">
              <Button
                  onClick={decreaseSpeed}
                  className="px-2 py-2 bg-white text-black hover:bg-gray-200"
                  disabled={speed >= 1000}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Button
                  onClick={increaseSpeed}
                  className="px-2 py-2 bg-white text-black hover:bg-gray-200"
                  disabled={speed <= 50}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white/80 text-black px-3 py-1 rounded text-sm">
            Speed: {speedInGenPerSec} generations/second
          </div>
        </div>

        <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <CubeWall grid={grid} onCellToggle={handleCellToggle} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
  )
}

