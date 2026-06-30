'use client';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
  NodeProps,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ── Custom group container node ───────────────────────────────────────────
function SectionGroup({ data }: NodeProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
      <span style={{
        position: 'absolute',
        bottom: 9,
        left: 13,
        fontSize: 9,
        fontFamily: '"Geist Mono", ui-monospace, monospace',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#b0b7c3',
        userSelect: 'none',
      }}>
        {data.label as string}
      </span>
    </div>
  );
}

const nodeTypes = { sectionGroup: SectionGroup };

// ── Node style helper ─────────────────────────────────────────────────────
type Kind = 'launch' | 'sensor' | 'processing' | 'actuator' | 'core';

function ns(kind: Kind, w: number, h = 36): React.CSSProperties {
  const map: Record<Kind, { bg: string; border: string; color: string }> = {
    launch:     { bg: '#14181f', border: '#14181f',  color: '#fff'     },
    sensor:     { bg: '#f0fdf4', border: '#86efac',  color: '#14181f'  },
    processing: { bg: '#eff6ff', border: '#93c5fd',  color: '#14181f'  },
    actuator:   { bg: '#fefce8', border: '#fde047',  color: '#14181f'  },
    core:       { bg: '#f9fafb', border: '#d1d5db',  color: '#374151'  },
  };
  const { bg, border, color } = map[kind];
  return {
    width: w, height: h, background: bg, border: `1px solid ${border}`,
    borderRadius: 8, color, fontSize: 11,
    fontFamily: '"Geist Mono", ui-monospace, monospace',
    fontWeight: 500, display: 'flex', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', lineHeight: 1.25, padding: '0 8px',
  };
}

function groupBg(w: number, h: number): React.CSSProperties {
  return {
    width: w, height: h,
    border: '1px dashed #d1d5db',
    borderRadius: 12,
    background: 'rgba(249,250,251,0.6)',
    zIndex: -1,
  };
}

// ── Nodes ─────────────────────────────────────────────────────────────────
const nodes: Node[] = [
  // Background group containers
  { id: 'bg-rescue',  type: 'sectionGroup', selectable: false, draggable: false, connectable: false,
    position: { x: 26, y: 88 },  data: { label: 'Rescue Tool' },   style: groupBg(148, 284) },
  { id: 'bg-objdet',  type: 'sectionGroup', selectable: false, draggable: false, connectable: false,
    position: { x: 204, y: 88 }, data: { label: 'Object Detection' }, style: groupBg(286, 366) },
  { id: 'bg-mapping', type: 'sectionGroup', selectable: false, draggable: false, connectable: false,
    position: { x: 598, y: 76 }, data: { label: 'Mapping' },       style: groupBg(430, 366) },
  { id: 'bg-nav',     type: 'sectionGroup', selectable: false, draggable: false, connectable: false,
    position: { x: 316, y: 456 }, data: { label: 'Navigation' },   style: groupBg(516, 280) },

  // Launch
  { id: 'launch', data: { label: 'Launch' }, position: { x: 455, y: 22 },
    style: ns('launch', 130), sourcePosition: Position.Bottom, targetPosition: Position.Top },

  // Rescue Tool
  { id: 'gripper',       data: { label: 'Gripper' },       position: { x: 46, y: 140 },
    style: ns('actuator', 110), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'magnet-switch', data: { label: 'Magnet Switch' }, position: { x: 46, y: 268 },
    style: ns('actuator', 110), sourcePosition: Position.Bottom, targetPosition: Position.Top },

  // Object Detection
  { id: 'mipi-camera', data: { label: 'MIPI Camera' }, position: { x: 218, y: 140 },
    style: ns('sensor', 126), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tf',          data: { label: 'tf' },           position: { x: 370, y: 140 },
    style: ns('core', 74),   sourcePosition: Position.Bottom, targetPosition: Position.Left },
  { id: 'obj-det',     data: { label: 'Object Detection' }, position: { x: 222, y: 252 },
    style: ns('processing', 130), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'cam2map',     data: { label: 'Camera-to-Map\nConverter' }, position: { x: 222, y: 364 },
    style: { ...ns('processing', 190, 44), whiteSpace: 'pre-line' as const },
    sourcePosition: Position.Bottom, targetPosition: Position.Top },

  // Standalone
  { id: 'urdf', data: { label: 'URDF' }, position: { x: 454, y: 184 },
    style: ns('core', 80), sourcePosition: Position.Bottom, targetPosition: Position.Top },

  // Mapping
  { id: 'lidar',       data: { label: 'Lidar' },    position: { x: 610, y: 132 },
    style: ns('sensor', 88), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'odometry',    data: { label: 'Odometry' }, position: { x: 742, y: 132 },
    style: ns('sensor', 98), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'imu',         data: { label: 'IMU' },      position: { x: 890, y: 132 },
    style: ns('sensor', 74), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'cartographer', data: { label: 'Cartographer\nSLAM' }, position: { x: 700, y: 246 },
    style: { ...ns('processing', 150, 48), whiteSpace: 'pre-line' as const },
    sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'exploration', data: { label: 'Exploration' }, position: { x: 856, y: 354 },
    style: ns('processing', 120), sourcePosition: Position.Bottom, targetPosition: Position.Top },

  // Navigation (RViz moved here — it's the operator's window into the running system)
  { id: 'rviz',           data: { label: 'RViz' },            position: { x: 338, y: 510 },
    style: ns('core', 90), sourcePosition: Position.Right, targetPosition: Position.Top },
  { id: 'master-script',  data: { label: 'Master Script' },   position: { x: 474, y: 510 },
    style: ns('processing', 130), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'obstacle-avoid', data: { label: 'Obstacle\nAvoidance' }, position: { x: 474, y: 604 },
    style: { ...ns('processing', 130, 44), whiteSpace: 'pre-line' as const },
    sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'motor-controls', data: { label: 'Motor Controls' },  position: { x: 462, y: 694 },
    style: ns('actuator', 130), targetPosition: Position.Top },
];

// ── Edge helpers ──────────────────────────────────────────────────────────
const initEdge = (id: string, source: string, target: string): Edge => ({
  id, source, target,
  type: 'smoothstep',
  style: { stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '5 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#d1d5db', width: 8, height: 8 },
});

const dataEdge = (id: string, source: string, target: string, label?: string): Edge => ({
  id, source, target, label,
  type: 'smoothstep',
  style: { stroke: '#6e7681', strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6e7681', width: 10, height: 10 },
  labelStyle: { fontSize: 9, fill: '#6e7681', fontFamily: '"Geist Mono", ui-monospace, monospace' },
  labelBgStyle: { fill: '#ffffff', fillOpacity: 0.92 },
  labelBgPadding: [2, 4] as [number, number],
  labelBgBorderRadius: 3,
});

// ── Edges ─────────────────────────────────────────────────────────────────
const edges: Edge[] = [
  // Init: Launch → hardware (dashed, no labels — just "these nodes are started")
  initEdge('ei-launch-gripper',  'launch', 'gripper'),
  initEdge('ei-launch-mipi',     'launch', 'mipi-camera'),
  initEdge('ei-launch-tf',       'launch', 'tf'),
  initEdge('ei-launch-urdf',     'launch', 'urdf'),
  initEdge('ei-launch-lidar',    'launch', 'lidar'),
  initEdge('ei-launch-odom',     'launch', 'odometry'),
  initEdge('ei-launch-imu',      'launch', 'imu'),

  // Object Detection pipeline
  dataEdge('e-mipi-tf',    'mipi-camera', 'tf',       'image/raw'),
  dataEdge('e-tf-objdet',  'tf',          'obj-det',  'camera/tf'),
  dataEdge('e-objdet-c2m', 'obj-det',     'cam2map',  'detections'),
  dataEdge('e-c2m-rviz',   'cam2map',     'rviz'),
  dataEdge('e-c2m-master', 'cam2map',     'master-script', 'object_pose'),

  // URDF → RViz
  dataEdge('e-urdf-rviz', 'urdf', 'rviz', 'robot_desc'),

  // Mapping pipeline
  dataEdge('e-lidar-cart', 'lidar',       'cartographer', 'scan'),
  dataEdge('e-odom-cart',  'odometry',    'cartographer', 'odom'),
  dataEdge('e-imu-cart',   'imu',         'cartographer', 'imu'),
  dataEdge('e-cart-rviz',  'cartographer', 'rviz',         'map'),
  dataEdge('e-cart-master','cartographer', 'master-script','map'),
  dataEdge('e-explore-master', 'exploration', 'master-script'),

  // Navigation
  dataEdge('e-rviz-master',   'rviz',           'master-script',  'goal_pose'),
  dataEdge('e-master-avoid',  'master-script',  'obstacle-avoid', 'nav_goal'),
  dataEdge('e-avoid-motor',   'obstacle-avoid', 'motor-controls', 'cmd_vel'),

  // Rescue tool handshake (subtle init-style: these are command triggers, not data streams)
  initEdge('ei-gripper-master', 'gripper',       'master-script'),
  initEdge('ei-magnet-master',  'magnet-switch', 'master-script'),
];

// ── Component ─────────────────────────────────────────────────────────────
export default function RosmasterFlow() {
  return (
    <div style={{
      width: '100%', height: 640,
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid #e3e5e9',
      background: '#fcfcfd',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.3}
        maxZoom={2.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#e8eaed" />
        <Controls
          showInteractive={false}
          style={{
            bottom: 14, right: 14, left: 'auto', top: 'auto',
            boxShadow: 'none', border: '1px solid #e3e5e9',
            borderRadius: 8, background: '#fff',
          }}
        />
        <MiniMap
          style={{
            bottom: 14, left: 14, right: 'auto', top: 'auto',
            border: '1px solid #e3e5e9', borderRadius: 8,
            width: 126, height: 76, background: '#fff',
          }}
          nodeColor={(n) => {
            if (n.id.startsWith('bg-')) return 'transparent';
            const bg = n.style?.background;
            return typeof bg === 'string' ? bg : '#e3e5e9';
          }}
          maskColor="rgba(249,250,251,0.75)"
        />
      </ReactFlow>
    </div>
  );
}
