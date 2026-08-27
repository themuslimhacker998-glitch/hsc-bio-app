// import { Canvas } from '@react-three/fiber'

// export default function R3FTest() {
//   return (
//     <div style={{ width: 300, height: 300, border: '1px solid red' }}>
//       <Canvas>
//         <ambientLight intensity={0.5} />
//         <mesh>
//           <boxGeometry args={[1, 1, 1]} />
//           <meshStandardMaterial color="hotpink" />
//         </mesh>
//       </Canvas>
//     </div>
//   )
// }
import { Canvas } from '@react-three/fiber';

export default function R3FTest() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}