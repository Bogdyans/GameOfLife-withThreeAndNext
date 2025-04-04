import Cube from "@/components/cube";


export default function CubeWall(
        { grid, onCellToggle }
        :
        { grid: boolean[][], onCellToggle: (x: number, y: number) => void },
) {
    const wallSize = grid.length
    const cubeSize = 1
    const gap = 0.2
    const totalSize = wallSize * (cubeSize + gap) - gap

    // Center the wall
    const startPos = -totalSize / 2 + cubeSize / 2

    const cubes = []
    for (let x = 0; x < wallSize; x++) {
        for (let y = 0; y < wallSize; y++) {
            const posX = startPos + x * (cubeSize + gap)
            const posY = startPos + y * (cubeSize + gap)

            cubes.push(
                <Cube key={`${x}-${y}`} position={[posX, posY, 0]} isAlive={grid[x][y]} onClick={() => onCellToggle(x, y)} />,
            )
        }
    }

    return <>{cubes}</>
}