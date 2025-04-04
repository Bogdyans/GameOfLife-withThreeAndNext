import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Cube({ position, isAlive, onClick }:
                                 { position: [x: number, y: number, z: number], isAlive: boolean, onClick: () => void }
) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + position[0]) * 0.1 - delta * 0;
        meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2 + position[1]) * 0.1;
    });

    return (
        <mesh ref={meshRef} position={position} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isAlive ? "#4CAF50" : "#e0e0e0"} />
        </mesh>
    );
}