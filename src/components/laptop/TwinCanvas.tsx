import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { healthMeta, type PartKind, type TwinModel, type TwinPart } from "@/data/twin";

const SHELL = "#0E5E50";
const GOLD = "#B98A2F";

export default function TwinCanvas({
  model,
  selected,
  onSelect,
  roofOpen,
  lang,
}: {
  model: TwinModel;
  selected: PartKind | null;
  onSelect: (id: PartKind | null) => void;
  roofOpen: number;
  lang: "en" | "ar";
}) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      camera={{ position: [6.4, 4.2, 7.2], fov: 34 }}
      style={{ height: "100%", width: "100%" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#F4F1E9"]} />
      <hemisphereLight args={["#FFF6E2", "#CFC7B2", 1.1]} />
      <directionalLight position={[6, 9, 5]} intensity={1.1} />
      <directionalLight position={[-6, 5, -4]} intensity={0.4} />
      <Scene
        model={model}
        selected={selected}
        onSelect={onSelect}
        roofOpen={roofOpen}
        lang={lang}
      />
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.7, 0]}
      />
    </Canvas>
  );
}

function Scene({
  model,
  selected,
  onSelect,
  roofOpen,
  lang,
}: {
  model: TwinModel;
  selected: PartKind | null;
  onSelect: (id: PartKind | null) => void;
  roofOpen: number;
  lang: "en" | "ar";
}) {
  const [hovered, setHovered] = useState<TwinPart | null>(null);
  const [hw, hh, hd] = model.hall;
  const [ww, wh, wd] = model.women;
  const shellOpacity = 0.17 * (1 - roofOpen * 0.75);
  const ghost = selected !== null;
  const scale = model.scale;

  const parts = useMemo(
    () => model.parts.map((p) => ({ ...p, world: scaleVec(p.pos, scale) })),
    [model.parts, scale],
  );

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onClick={() => onSelect(null)}>
        <circleGeometry args={[9 * scale, 64]} />
        <meshStandardMaterial color="#EDEAE0" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[5.4 * scale, 4.6 * scale]} />
        <meshStandardMaterial color="#E5E0D2" />
      </mesh>

      {/* main hall */}
      <Shell
        position={[-0.35 * scale, hh / 2, 0]}
        args={[hw, hh, hd]}
        opacity={shellOpacity}
        wire
      />
      {/* dome, lifts with the roof slider */}
      <group position={[-0.35 * scale, hh + roofOpen * 1.5, 0]}>
        <mesh>
          <sphereGeometry args={[Math.min(hw, hd) * 0.42, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={SHELL}
            transparent
            opacity={0.32}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, Math.min(hw, hd) * 0.44, 0]}>
          <coneGeometry args={[0.06 * scale, 0.22 * scale, 12]} />
          <meshStandardMaterial color={GOLD} />
        </mesh>
      </group>

      {/* women's hall */}
      <Shell
        position={[0.95 * scale, wh / 2, -0.55 * scale]}
        args={[ww, wh, wd]}
        opacity={shellOpacity}
        wire
      />

      {/* ablution area */}
      <Shell
        position={[-1.4 * scale, 0.34 * scale, 0.7 * scale]}
        args={[0.9 * scale, 0.68 * scale, 0.7 * scale]}
        opacity={shellOpacity}
        wire
      />

      {/* courtyard, an open low wall */}
      <mesh position={[-1.35 * scale, 0.12 * scale, -0.95 * scale]}>
        <boxGeometry args={[1.5 * scale, 0.24 * scale, 1.3 * scale]} />
        <meshStandardMaterial color={SHELL} transparent opacity={0.12} />
      </mesh>

      {/* minaret */}
      <group position={[1.95 * scale, 0, 1.2 * scale]}>
        <mesh position={[0, model.minaretHeight / 2, 0]}>
          <cylinderGeometry args={[0.13 * scale, 0.16 * scale, model.minaretHeight, 16]} />
          <meshStandardMaterial color={SHELL} transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, model.minaretHeight + 0.05, 0]}>
          <sphereGeometry args={[0.17 * scale, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={GOLD} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* mihrab niche on the qibla wall */}
      <mesh position={[-0.35 * scale - hw / 2, 0.34 * scale, 0]}>
        <boxGeometry args={[0.16 * scale, 0.68 * scale, 0.44 * scale]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} />
      </mesh>

      {parts.map((p) => {
        const isSel = selected === p.id;
        const dim = ghost && !isSel;
        const hex = healthMeta[p.health].hex;
        return (
          <group key={p.id} position={p.world}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(p);
              }}
              onPointerOut={() => setHovered((h) => (h?.id === p.id ? null : h))}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(isSel ? null : p.id);
              }}
            >
              <boxGeometry args={scaleVec(p.size, scale)} />
              <meshStandardMaterial
                color={hex}
                transparent
                opacity={dim ? 0.18 : 0.95}
                emissive={hex}
                emissiveIntensity={p.health === "faulty" && !dim ? 0.55 : 0.05}
              />
            </mesh>
            {p.health !== "healthy" && !dim ? (
              <mesh>
                <sphereGeometry args={[Math.max(...p.size) * scale * 0.95, 20, 16]} />
                <meshBasicMaterial
                  color={hex}
                  transparent
                  opacity={p.health === "faulty" ? 0.16 : 0.1}
                />
              </mesh>
            ) : null}
          </group>
        );
      })}

      {hovered ? (
        <Html position={scaleVec(hovered.pos, scale)} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div className="pointer-events-none flex items-center gap-2 whitespace-nowrap rounded-[9px] bg-deep-green px-2.5 py-1.5 text-primary-foreground shadow-soft">
            <span
              className="size-2 rounded-full"
              style={{ background: healthMeta[hovered.health].hex }}
            />
            <span className="t-caption">{lang === "ar" ? hovered.name_ar : hovered.name_en}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Shell({
  position,
  args,
  opacity,
  wire,
}: {
  position: [number, number, number];
  args: [number, number, number];
  opacity: number;
  wire?: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color={SHELL} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      {wire ? (
        <mesh>
          <boxGeometry args={args} />
          <meshBasicMaterial color={SHELL} wireframe transparent opacity={0.18} />
        </mesh>
      ) : null}
    </group>
  );
}

function scaleVec(v: [number, number, number], s: number): [number, number, number] {
  return [v[0] * s, v[1] * s, v[2] * s];
}
