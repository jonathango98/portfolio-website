"use client";

import { Fragment, useState } from "react";
import styles from "./RosArchitecture.module.css";

type Kind = "ours" | "existing" | "endpoint";
type Pt = [number, number];
type Node = { id: string; label: string[]; x: number; y: number; h?: number; kind: Kind };
type Edge = { id: string; from: string; to: string; pts: Pt[]; launch?: boolean };
type Label = { edges: string[]; topic: string; type?: string; x: number; y: number; at: "above" | "below" | "right" | "left" };

const W = 120;
const C1 = 76, C2 = 326, C3 = 576, C4 = 826, C5 = 1076;

const nodes: Node[] = [
  { id: "launch", label: ["Launch"], x: C1, y: 716, kind: "ours" },
  { id: "gripper", label: ["Gripper"], x: C1, y: 60, kind: "ours" },
  { id: "magnet", label: ["Magnet Switch"], x: C5, y: 60, kind: "endpoint" },
  { id: "mipi", label: ["MIPI Camera"], x: C1, y: 180, kind: "ours" },
  { id: "tf", label: ["tf"], x: C1, y: 262, kind: "existing" },
  { id: "objdet", label: ["Object Detection"], x: C2, y: 180, kind: "ours" },
  { id: "urdf", label: ["URDF"], x: C2, y: 340, kind: "existing" },
  { id: "conv", label: ["Camera-to-Map", "Frame Converter"], x: C3, y: 262, h: 50, kind: "ours" },
  { id: "rviz", label: ["RVIZ"], x: C5, y: 380, kind: "endpoint" },
  { id: "lidar", label: ["Lidar"], x: C1, y: 476, kind: "existing" },
  { id: "odom", label: ["Odometry"], x: C1, y: 556, kind: "existing" },
  { id: "imu", label: ["IMU"], x: C1, y: 636, kind: "existing" },
  { id: "carto", label: ["Cartographer", "SLAM"], x: C2, y: 556, h: 50, kind: "existing" },
  { id: "explore", label: ["Exploration"], x: C3, y: 556, kind: "ours" },
  { id: "master", label: ["Master Script"], x: C4, y: 476, kind: "ours" },
  { id: "oa", label: ["Obstacle", "Avoidance"], x: C4, y: 616, h: 50, kind: "ours" },
  { id: "motor", label: ["Motor Controls"], x: C5, y: 616, kind: "endpoint" },
];

const tick = (to: string, y: number): Edge => ({ id: `launch-${to}`, from: "launch", to, pts: [[4, y], [20, y]], launch: true });

const edges: Edge[] = [
  ...[["gripper", 60], ["mipi", 180], ["tf", 262], ["lidar", 476], ["odom", 556], ["imu", 636]].map(([to, y]) => tick(to as string, y as number)),
  { id: "launch-explore", from: "launch", to: "explore", pts: [[136, 716], [576, 716], [576, 576]], launch: true },
  { id: "gripper-magnet", from: "gripper", to: "magnet", pts: [[136, 60], [1016, 60]] },
  { id: "image", from: "mipi", to: "objdet", pts: [[136, 180], [266, 180]] },
  { id: "human", from: "objdet", to: "magnet", pts: [[326, 160], [326, 116], [1076, 116], [1076, 80]] },
  { id: "aruco", from: "objdet", to: "conv", pts: [[386, 180], [576, 180], [576, 237]] },
  { id: "tf-conv", from: "tf", to: "conv", pts: [[136, 262], [516, 262]] },
  { id: "tf-urdf", from: "tf", to: "urdf", pts: [[76, 282], [76, 340], [266, 340]] },
  { id: "urdf-rviz", from: "urdf", to: "rviz", pts: [[386, 340], [960, 340], [960, 380], [1016, 380]] },
  { id: "urdf-master", from: "urdf", to: "master", pts: [[386, 340], [780, 340], [780, 456]] },
  { id: "marker", from: "conv", to: "rviz", pts: [[636, 250], [980, 250], [980, 368], [1016, 368]] },
  { id: "pose", from: "conv", to: "master", pts: [[636, 274], [850, 274], [850, 456]] },
  { id: "scan", from: "lidar", to: "carto", pts: [[136, 476], [258, 476], [258, 543], [266, 543]] },
  { id: "odom", from: "odom", to: "carto", pts: [[136, 556], [266, 556]] },
  { id: "imu", from: "imu", to: "carto", pts: [[136, 636], [258, 636], [258, 569], [266, 569]] },
  { id: "carto-conv", from: "carto", to: "conv", pts: [[386, 538], [440, 538], [440, 280], [516, 280]] },
  { id: "map-rviz", from: "carto", to: "rviz", pts: [[386, 551], [500, 551], [500, 420], [940, 420], [940, 392], [1016, 392]] },
  { id: "map-explore", from: "carto", to: "explore", pts: [[386, 568], [516, 568]] },
  { id: "explore-master", from: "explore", to: "master", pts: [[636, 546], [700, 546], [700, 486], [766, 486]] },
  { id: "goal", from: "master", to: "oa", pts: [[826, 496], [826, 591]] },
  { id: "cmd", from: "oa", to: "motor", pts: [[886, 616], [1016, 616]] },
];

const labels: Label[] = [
  { edges: ["image"], topic: "/camera/image_raw", type: "sensor_msgs/Image", x: 201, y: 180, at: "above" },
  { edges: ["human"], topic: "/is_human", type: "std_msgs/Bool", x: 800, y: 116, at: "below" },
  { edges: ["aruco"], topic: "/aruco/transform", type: "geometry_msgs/TransformStamped", x: 479, y: 180, at: "above" },
  { edges: ["tf-conv"], topic: "/tf", x: 201, y: 262, at: "above" },
  { edges: ["marker"], topic: "/object_marker", type: "visualization_msgs/Marker", x: 806, y: 250, at: "above" },
  { edges: ["pose"], topic: "/object_pose_on_map", type: "geometry_msgs/PoseStamped", x: 842, y: 300, at: "left" },
  { edges: ["scan"], topic: "/laser_scan", type: "sensor_msgs/LaserScan", x: 198, y: 476, at: "above" },
  { edges: ["odom"], topic: "/odom", type: "nav_msgs/Odometry", x: 201, y: 556, at: "above" },
  { edges: ["imu"], topic: "/imu", type: "sensor_msgs/Imu", x: 198, y: 636, at: "above" },
  { edges: ["map-explore", "map-rviz"], topic: "/map", type: "nav_msgs/OccupancyGrid", x: 451, y: 568, at: "below" },
  { edges: ["goal"], topic: "/goal_pose", type: "geometry_msgs/PoseStamped", x: 836, y: 532, at: "right" },
  { edges: ["cmd"], topic: "/cmd_vel", type: "geometry_msgs/Twist", x: 951, y: 616, at: "above" },
];

const groups = [
  { name: "Rescue Tool", x: 12, y: 20, w: 1128, h: 80 },
  { name: "Object Detection", x: 12, y: 136, w: 638, h: 236 },
  { name: "Mapping", x: 12, y: 440, w: 386, h: 220 },
  { name: "Navigation", x: 508, y: 440, w: 492, h: 220 },
];

const KINDS: { kind: Kind; name: string }[] = [
  { kind: "ours", name: "Our nodes" },
  { kind: "existing", name: "Existing packages" },
  { kind: "endpoint", name: "Endpoints" },
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const name = (id: string) => byId[id].label.join(" ");
const topicOf = (e: Edge) => labels.find((l) => l.edges.includes(e.id))?.topic;
const d = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");

// Where a vertical run of one edge crosses a horizontal run of an edge from another node,
// the vertical one bridges over: a short gap is cut in the line underneath.
type Seg = { a: Pt; b: Pt };
const segs = (e: Edge): Seg[] => e.pts.slice(1).map((b, i) => ({ a: e.pts[i], b }));
const between = (v: number, a: number, b: number) => v > Math.min(a, b) + 1 && v < Math.max(a, b) - 1;
const bridges: { edge: string; under: string; x: number; y: number }[] = [];
for (const v of edges) for (const h of edges) {
  if (v.from === h.from) continue;
  for (const s of segs(v)) for (const t of segs(h)) {
    if (s.a[0] !== s.b[0] || t.a[1] !== t.b[1]) continue;
    const x = s.a[0], y = t.a[1];
    if (between(y, s.a[1], s.b[1]) && between(x, t.a[0], t.b[0])) bridges.push({ edge: v.id, under: h.id, x, y });
  }
}

/** The ROS 2 node graph, laid out left to right; point at a node to trace what it sends and receives. */
export default function RosArchitecture() {
  const [active, setActive] = useState<string | null>(null);
  const role = (e: Edge) => (!active ? "" : e.from === active ? "send" : e.to === active ? "receive" : "dim");
  const nodeRole = (id: string) =>
    !active || id === active ? "" : edges.some((e) => (e.from === active && e.to === id) || (e.to === active && e.from === id)) ? "" : "dim";
  const sends = active ? edges.filter((e) => e.from === active) : [];
  const receives = active ? edges.filter((e) => e.to === active && !e.launch) : [];
  const started = active ? edges.some((e) => e.to === active && e.launch) : false;
  const item = (e: Edge, other: string) => (topicOf(e) ? `${topicOf(e)} ${other}` : other);

  return (
    <figure className={styles.figure}>
      <div className={styles.scroll}>
        <svg
          className={styles.svg}
          viewBox="0 0 1144 750"
          role="group"
          aria-label="ROS 2 node graph of the SAR rover"
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          onPointerUp={(e) => e.pointerType !== "mouse" && !(e.target as Element).closest("[role=button]") && setActive(null)}
        >
          <defs>
            {["", "send", "receive", "dim"].map((r) => (
              <marker key={r} id={`arrow${r}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" className={`${styles.head} ${r ? styles[r] : ""}`} />
              </marker>
            ))}
          </defs>

          {groups.map((g) => (
            <g key={g.name}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={12} className={styles.group} />
              <text x={g.x + 14} y={g.y + 4} className={styles.groupName}>{g.name}</text>
            </g>
          ))}

          <path d="M4 60V716H16" className={`${styles.edge} ${styles.launch} ${active === "launch" ? styles.send : active ? styles.dim : ""}`} />
          {edges.map((e) => (
            <path
              key={e.id}
              d={d(e.pts)}
              className={`${styles.edge} ${e.launch ? styles.launch : ""} ${role(e) ? styles[role(e)] : ""}`}
              markerEnd={`url(#arrow${role(e)})`}
            />
          ))}
          {bridges.map((b, i) => {
            const e = edges.find((x) => x.id === b.edge)!;
            const under = edges.find((x) => x.id === b.under)!;
            if (role(e) === "dim" && role(under) !== "dim") return null;
            return (
              <Fragment key={i}>
                <path d={`M${b.x} ${b.y - 7}V${b.y + 7}`} className={styles.halo} />
                <path d={`M${b.x} ${b.y - 8}V${b.y + 8}`} className={`${styles.edge} ${role(e) ? styles[role(e)] : ""}`} />
              </Fragment>
            );
          })}

          {labels.map((l) => {
            const r = l.edges.map((id) => role(edges.find((e) => e.id === id)!)).find((x) => x && x !== "dim") ?? (active ? "dim" : "");
            const anchor = l.at === "right" ? "start" : l.at === "left" ? "end" : "middle";
            const y0 = l.at === "above" ? l.y - (l.type ? 19 : 7) : l.at === "below" ? l.y + 15 : l.y;
            return (
              <text key={l.topic} x={l.x} y={y0} textAnchor={anchor} className={`${styles.label} ${r ? styles[r] : ""}`}>
                <tspan className={styles.topic}>{l.topic}</tspan>
                {l.type && <tspan x={l.x} dy={13} className={styles.type}>{l.type}</tspan>}
              </text>
            );
          })}

          {nodes.map((n) => {
            const h = n.h ?? 40;
            return (
              <g
                key={n.id}
                className={`${styles.node} ${styles[n.kind]} ${active === n.id ? styles.on : ""} ${nodeRole(n.id) ? styles.dim : ""}`}
                tabIndex={0}
                role="button"
                aria-pressed={active === n.id}
                aria-label={name(n.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(n.id)}
                onPointerUp={(e) => e.pointerType !== "mouse" && setActive((a) => (a === n.id ? null : n.id))}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(n.id)}
                onBlur={() => setActive(null)}
              >
                <rect x={n.x - W / 2} y={n.y - h / 2} width={W} height={h} rx={10} />
                <text x={n.x} y={n.y - (n.label.length - 1) * 7.5 + 4.5} textAnchor="middle">
                  {n.label.map((line, i) => (
                    <tspan key={line} x={n.x} dy={i ? 15 : 0}>{line}</tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className={styles.caption} aria-live="polite">
        {active ? (
          <dl className={styles.trace}>
            <dt className={styles.traceName}>{name(active)}</dt>
            {sends.length > 0 && (
              <dd>
                <span className={`${styles.traceKey} ${styles.send}`}>{active === "launch" ? "Starts" : "Sends"}</span>
                {sends.map((e) => item(e, `→ ${name(e.to)}`)).join(" · ")}
              </dd>
            )}
            {receives.length > 0 && (
              <dd>
                <span className={styles.traceKey}>Receives</span>
                {receives.map((e) => item(e, `← ${name(e.from)}`)).join(" · ")}
              </dd>
            )}
            {started && (
              <dd>
                <span className={styles.traceKey}>Started by</span>Launch
              </dd>
            )}
          </dl>
        ) : (
          <ul className={styles.legend}>
            {KINDS.map((k) => (
              <li key={k.kind}>
                <span className={`${styles.swatch} ${styles[k.kind]}`} aria-hidden="true" />
                {k.name}
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}
