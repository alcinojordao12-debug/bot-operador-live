'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AgentRobot, TradingRobot, Department, CryptoMarketAsset } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Compass,
  Maximize2,
  Minimize2,
  Camera,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Users,
} from 'lucide-react';

interface OfficeScene3DProps {
  agents: AgentRobot[];
  tradingRobots: TradingRobot[];
  departments: Department[];
  marketAssets: CryptoMarketAsset[];
  onSelectAgent: (agent: AgentRobot) => void;
  onSelectTradingRobot: (robot: TradingRobot) => void;
  onOpenMeetingRoom: () => void;
  onTriggerEmergencyModal: () => void;
  selectedAgentId?: string;
  selectedTradingRobotId?: string;
}

export const OfficeScene3D: React.FC<OfficeScene3DProps> = ({
  agents,
  tradingRobots,
  departments,
  marketAssets,
  onSelectAgent,
  onSelectTradingRobot,
  onOpenMeetingRoom,
  onTriggerEmergencyModal,
  selectedAgentId,
  selectedTradingRobotId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // UI state for bottom dock
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState<string>('iso');
  const [hoveredObjectName, setHoveredObjectName] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // References for raycasting and selection
  const interactiveObjectsRef = useRef<{
    mesh: THREE.Object3D;
    type: 'agent' | 'trader';
    data: AgentRobot | TradingRobot;
  }[]>([]);

  // Function to create procedural texture for visor plate
  const createVisorTexture = (text: string, bgColor: string, textColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Rounded background plate
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.fill();

      // Border
      ctx.lineWidth = 4;
      ctx.strokeStyle = textColor;
      ctx.stroke();

      // Text
      ctx.font = 'bold 22px "Press Start 2P", monospace, sans-serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 34);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // Function to create monitor screen texture
  const createMonitorTexture = (asset: string, decision: string, price: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 256, 256);

      // CRT scanlines
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      for (let y = 0; y < 256; y += 4) {
        ctx.fillRect(0, y, 256, 2);
      }

      // Title
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(asset, 16, 36);

      // Decision badge
      ctx.fillStyle = decision === 'BUY' ? '#10b981' : decision === 'SELL' ? '#ef4444' : '#f59e0b';
      ctx.fillRect(16, 56, 110, 32);
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#090d16';
      ctx.fillText(decision, 28, 78);

      // Price
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#f8fafc';
      const priceText = price < 0.01 ? `$${price.toFixed(6)}` : `$${price.toFixed(2)}`;
      ctx.fillText(priceText, 16, 130);

      // Mini simulated chart line
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(16, 200);
      ctx.lineTo(60, 185);
      ctx.lineTo(110, 210);
      ctx.lineTo(160, 170);
      ctx.lineTo(210, 175);
      ctx.lineTo(240, 150);
      ctx.stroke();

      // Footer
      ctx.font = '14px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('PAPER TRADING', 16, 238);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.007);

    // 2. Camera Setup (Isometric Perspective)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(0, 75, 75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera from dipping below floor
    controls.minDistance = 15;
    controls.maxDistance = 140;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    // Hemisphere Light (Cool sky / Warm ground)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.85);
    scene.add(hemiLight);

    // Main Directional Key Light (Warm sunlight with shadows)
    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    dirLight.position.set(45, 70, 35);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    dirLight.shadow.bias = -0.0003;
    scene.add(dirLight);

    // Accent Point Lights in Key Rooms
    const dirRoomLight = new THREE.PointLight(0xf59e0b, 1.5, 40);
    dirRoomLight.position.set(0, 10, -22);
    scene.add(dirRoomLight);

    const tradingRoomLight = new THREE.PointLight(0x10b981, 1.8, 50);
    tradingRoomLight.position.set(28, 12, 22);
    scene.add(tradingRoomLight);

    const meetingRoomLight = new THREE.PointLight(0x8b5cf6, 1.6, 40);
    meetingRoomLight.position.set(30, 10, -22);
    scene.add(meetingRoomLight);

    // 6. Procedural Base Floor & Rooms Architecture
    // Outer Ground
    const groundGeo = new THREE.PlaneGeometry(130, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor Overlay
    const gridHelper = new THREE.GridHelper(120, 60, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Interactive target meshes list
    const interactiveList: {
      mesh: THREE.Object3D;
      type: 'agent' | 'trader';
      data: AgentRobot | TradingRobot;
    }[] = [];

    // Helper: Build a 3D Room Box / Platform
    const createRoomPlatform = (
      x: number,
      z: number,
      w: number,
      d: number,
      floorColor: number,
      borderColor: number,
      roomTitle: string
    ) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(x, 0, z);

      // Floor Platform
      const floorGeo = new THREE.BoxGeometry(w, 0.4, d);
      const floorMat = new THREE.MeshStandardMaterial({
        color: floorColor,
        roughness: 0.6,
        metalness: 0.2,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.y = 0.2;
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // Trim Walls / Low Partitions (Super Mario RPG style)
      const wallMat = new THREE.MeshStandardMaterial({
        color: borderColor,
        roughness: 0.5,
        metalness: 0.3,
      });

      // North Wall with door gap
      const nwGeo = new THREE.BoxGeometry(w, 1.2, 0.6);
      const nw = new THREE.Mesh(nwGeo, wallMat);
      nw.position.set(0, 0.8, -d / 2);
      nw.castShadow = true;
      nw.receiveShadow = true;
      roomGroup.add(nw);

      // West Wall
      const wwGeo = new THREE.BoxGeometry(0.6, 1.2, d);
      const ww = new THREE.Mesh(wwGeo, wallMat);
      ww.position.set(-w / 2, 0.8, 0);
      ww.castShadow = true;
      roomGroup.add(ww);

      // East Wall
      const ew = ww.clone();
      ew.position.x = w / 2;
      roomGroup.add(ew);

      scene.add(roomGroup);
      return roomGroup;
    };

    // Helper: Create 3D Mario-style Potted Plant
    const createMarioPlant = (x: number, y: number, z: number) => {
      const plantGroup = new THREE.Group();
      plantGroup.position.set(x, y, z);

      // Terracotta Pot (Cylinder)
      const potGeo = new THREE.CylinderGeometry(0.6, 0.45, 0.9, 12);
      const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8 });
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.y = 0.45;
      pot.castShadow = true;
      plantGroup.add(pot);

      // Green Piranha Leaf Sphere
      const leafGeo = new THREE.DodecahedronGeometry(0.7);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.y = 1.3;
      leaf.castShadow = true;
      plantGroup.add(leaf);

      scene.add(plantGroup);
    };

    // Helper: Create Floating 3D Mario Question Block (?)
    const floatingBlocks: THREE.Mesh[] = [];
    const createQuestionBlock = (x: number, y: number, z: number) => {
      const blockGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const blockMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xb45309,
        emissiveIntensity: 0.3,
      });
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(x, y, z);
      block.castShadow = true;
      scene.add(block);
      floatingBlocks.push(block);
    };

    // Helper: Create 3D Green Warp Pipe
    const createWarpPipe = (x: number, z: number) => {
      const pipeGroup = new THREE.Group();
      pipeGroup.position.set(x, 0, z);

      const baseGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 16);
      const pipeMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.3,
        metalness: 0.4,
      });
      const base = new THREE.Mesh(baseGeo, pipeMat);
      base.position.y = 1.1;
      base.castShadow = true;
      pipeGroup.add(base);

      const lipGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.6, 16);
      const lip = new THREE.Mesh(lipGeo, pipeMat);
      lip.position.y = 2.2;
      lip.castShadow = true;
      pipeGroup.add(lip);

      scene.add(pipeGroup);
    };

    // 7. BUILD THE 12 ROOMS
    // -------------------------------------------------------------
    // SALA 1: DIREÇÃO E COORDENAÇÃO (Center North)
    createRoomPlatform(0, -22, 28, 20, 0x451a03, 0xb45309, 'SALA 1 · DIREÇÃO');
    // Red executive carpet
    const carpetGeo = new THREE.PlaneGeometry(18, 12);
    const carpetMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.42, -22);
    carpet.receiveShadow = true;
    scene.add(carpet);
    // Big command screen on north wall
    const cmdScreenGeo = new THREE.BoxGeometry(14, 4, 0.4);
    const cmdScreenMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    });
    const cmdScreen = new THREE.Mesh(cmdScreenGeo, cmdScreenMat);
    cmdScreen.position.set(0, 4, -31.5);
    scene.add(cmdScreen);
    createQuestionBlock(0, 7.5, -22);

    // SALA 10: SALA DE REUNIÕES (North East)
    createRoomPlatform(34, -22, 24, 20, 0x2e1065, 0x7e22ce, 'SALA 10 · REUNIÕES');
    // Conference table
    const tableGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.8, 24);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(34, 1.4, -22);
    table.castShadow = true;
    scene.add(table);
    // Floating consensus crystal in center
    const crystalGeo = new THREE.OctahedronGeometry(1.2);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(34, 3.2, -22);
    scene.add(crystal);
    floatingBlocks.push(crystal);

    // SALA 11: ÁREA DE SUPERVISÃO (North West)
    createRoomPlatform(-34, -22, 24, 20, 0x1e293b, 0x475569, 'SALA 11 · SUPERVISÃO');
    createWarpPipe(-42, -28);

    // SALA 2: ANÁLISE DE MERCADO (Mid West)
    createRoomPlatform(-34, 0, 24, 18, 0x083344, 0x0e7490, 'SALA 2 · MERCADO');

    // SALA 3: ANÁLISE TÉCNICA (Mid North-Central)
    createRoomPlatform(-10, 0, 20, 18, 0x064e3b, 0x059669, 'SALA 3 · TÉCNICA');

    // SALA 4: INVESTIGAÇÃO & INTELIGÊNCIA (Mid South-Central)
    createRoomPlatform(10, 0, 20, 18, 0x2e1065, 0x6d28d9, 'SALA 4 · INVESTIGAÇÃO');

    // SALA 5: ESTRATÉGIAS QUANTITATIVAS (Mid East)
    createRoomPlatform(34, 0, 24, 18, 0x172554, 0x2563eb, 'SALA 5 · ESTRATÉGIAS');

    // SALA 6: GESTÃO DE RISCO (South West)
    createRoomPlatform(-34, 22, 24, 18, 0x450a0a, 0xb91c1c, 'SALA 6 · RISCO');

    // SALA 7: APRENDIZAGEM & MEMÓRIA (South Central)
    createRoomPlatform(-10, 22, 20, 18, 0x500724, 0xbe185d, 'SALA 7 · MEMÓRIA');

    // SALA 8: EXECUÇÃO & MONITORIZAÇÃO (South East-Central)
    createRoomPlatform(10, 22, 20, 18, 0x042f2e, 0x0f766e, 'SALA 8 · EXECUÇÃO');

    // SALA 9: SALA DE TRADING (8 ROBÔS TRADERS) (South East)
    createRoomPlatform(34, 22, 24, 18, 0x022c22, 0x10b981, 'SALA 9 · TRADING');
    createQuestionBlock(34, 7.5, 22);

    // Potted Plants and Warp Pipes
    createMarioPlant(-42, 0, 30);
    createMarioPlant(44, 0, 30);
    createMarioPlant(-42, 0, -10);
    createMarioPlant(44, 0, -10);
    createWarpPipe(44, 30);
    createWarpPipe(-44, 30);

    // 8. PROCEDURAL 3D ROBOT COMPOSITE (3–12 Parts THREE.Group)
    // -------------------------------------------------------------
    const create3DRobotWorker = (
      agent: AgentRobot,
      x: number,
      z: number
    ): THREE.Group => {
      const robotGroup = new THREE.Group();
      robotGroup.position.set(x, 0.4, z);

      const colorHex = parseInt(agent.chassisColor.replace('#', '0x'), 16) || 0x38bdf8;

      // 1. Base / Treads (Dark Metallic)
      const baseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.35, 12);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.5 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.2;
      base.castShadow = true;
      robotGroup.add(base);

      // 2. Torso (Chassis color)
      const torsoGeo = new THREE.BoxGeometry(1.0, 1.0, 0.8);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.7,
      });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 0.85;
      torso.castShadow = true;
      robotGroup.add(torso);

      // 3. Heart Core LED
      const ledColor =
        agent.status === 'ERROR'
          ? 0xef4444
          : agent.status === 'BUSY'
          ? 0x10b981
          : agent.status === 'LEARNING'
          ? 0xec4899
          : 0xf59e0b;
      const ledGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const ledMat = new THREE.MeshStandardMaterial({
        color: ledColor,
        emissive: ledColor,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, 0.85, 0.42);
      robotGroup.add(led);

      // 4. Arms
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.6 });
      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-0.62, 0.75, 0);
      robotGroup.add(leftArm);
      const rightArm = leftArm.clone();
      rightArm.position.x = 0.62;
      robotGroup.add(rightArm);

      // 5. Head
      const headGeo = new THREE.BoxGeometry(0.85, 0.7, 0.75);
      const head = new THREE.Mesh(headGeo, torsoMat);
      head.position.y = 1.65;
      head.castShadow = true;
      robotGroup.add(head);

      // 6. Eye Screen (CRT Visor Screen)
      const eyeScreenGeo = new THREE.BoxGeometry(0.65, 0.35, 0.1);
      const eyeScreenMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9,
      });
      const eyeScreen = new THREE.Mesh(eyeScreenGeo, eyeScreenMat);
      eyeScreen.position.set(0, 1.65, 0.38);
      robotGroup.add(eyeScreen);

      // 7. Supervisor Golden Crown or Antenna
      if (agent.isSupervisor) {
        const crownGeo = new THREE.ConeGeometry(0.35, 0.4, 4);
        const crownMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.2,
          metalness: 0.9,
          emissive: 0xb45309,
          emissiveIntensity: 0.4,
        });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 2.2;
        robotGroup.add(crown);
      } else {
        const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4);
        const antMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
        const ant = new THREE.Mesh(antGeo, antMat);
        ant.position.y = 2.15;
        robotGroup.add(ant);
        const tipGeo = new THREE.SphereGeometry(0.08);
        const tipMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444 });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.y = 2.38;
        robotGroup.add(tip);
      }

      // 8. FLOATING 3D HEAD VISOR BILLBOARD (Sprite with real task text)
      const visorTex = createVisorTexture(agent.visorText, '#0f172a', '#38bdf8');
      const spriteMat = new THREE.SpriteMaterial({ map: visorTex, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(0, 2.7, 0);
      sprite.scale.set(3.6, 0.9, 1);
      robotGroup.add(sprite);

      // Mini desk in front of robot
      const deskGeo = new THREE.BoxGeometry(1.6, 0.7, 0.9);
      const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(0, 0.35, 0.9);
      desk.castShadow = true;
      robotGroup.add(desk);

      // Mini terminal monitor on desk
      const monGeo = new THREE.BoxGeometry(0.7, 0.5, 0.15);
      const monMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.4,
      });
      const mon = new THREE.Mesh(monGeo, monMat);
      mon.position.set(0, 0.95, 0.85);
      robotGroup.add(mon);

      scene.add(robotGroup);

      // Register for raycasting
      interactiveList.push({
        mesh: torso,
        type: 'agent',
        data: agent,
      });

      return robotGroup;
    };

    // 9. Position all 30 Agent Robots in their exact rooms
    // Room 1: Direção (3 agents)
    const dirAgents = agents.filter((a) => a.departmentId === 1);
    if (dirAgents[0]) create3DRobotWorker(dirAgents[0], 0, -20);
    if (dirAgents[1]) create3DRobotWorker(dirAgents[1], -6, -24);
    if (dirAgents[2]) create3DRobotWorker(dirAgents[2], 6, -24);

    // Room 2: Mercado (6 agents)
    const mktAgents = agents.filter((a) => a.departmentId === 2);
    mktAgents.forEach((ag, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      create3DRobotWorker(ag, -40 + col * 6, -4 + row * 6);
    });

    // Room 3: Técnica (4 agents)
    const tecAgents = agents.filter((a) => a.departmentId === 3);
    tecAgents.forEach((ag, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      create3DRobotWorker(ag, -14 + col * 7, -4 + row * 6);
    });

    // Room 4: Investigação (4 agents)
    const intAgents = agents.filter((a) => a.departmentId === 4);
    intAgents.forEach((ag, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      create3DRobotWorker(ag, 6 + col * 7, -4 + row * 6);
    });

    // Room 5: Estratégias (4 agents)
    const strAgents = agents.filter((a) => a.departmentId === 5);
    strAgents.forEach((ag, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      create3DRobotWorker(ag, 28 + col * 8, -4 + row * 6);
    });

    // Room 6: Risco (3 agents)
    const rskAgents = agents.filter((a) => a.departmentId === 6);
    rskAgents.forEach((ag, idx) => {
      create3DRobotWorker(ag, -40 + idx * 6, 22);
    });

    // Room 7: Memória (3 agents)
    const memAgents = agents.filter((a) => a.departmentId === 7);
    memAgents.forEach((ag, idx) => {
      create3DRobotWorker(ag, -16 + idx * 6, 22);
    });

    // Room 8: Execução (3 agents)
    const exeAgents = agents.filter((a) => a.departmentId === 8);
    exeAgents.forEach((ag, idx) => {
      create3DRobotWorker(ag, 4 + idx * 6, 22);
    });

    // 10. SALA DE TRADING: 8 3D ROBÔS TRADERS & 8 DEDICATED CRT MONITORS
    // -------------------------------------------------------------
    tradingRobots.forEach((robot, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const rx = 25 + col * 6;
      const rz = 18 + row * 8;

      const robotTrGroup = new THREE.Group();
      robotTrGroup.position.set(rx, 0.4, rz);

      // Gold/Emerald Trader Chassis
      const trGeo = new THREE.BoxGeometry(1.0, 1.1, 0.9);
      const trMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.25,
        metalness: 0.8,
      });
      const trMesh = new THREE.Mesh(trGeo, trMat);
      trMesh.position.y = 0.9;
      trMesh.castShadow = true;
      robotTrGroup.add(trMesh);

      // Head
      const trHeadGeo = new THREE.BoxGeometry(0.85, 0.7, 0.75);
      const trHead = new THREE.Mesh(trHeadGeo, trMat);
      trHead.position.y = 1.7;
      robotTrGroup.add(trHead);

      // Floating Trader Head Visor (Asset name)
      const trVisorTex = createVisorTexture(robot.assignedAsset, '#064e3b', '#34d399');
      const trSpriteMat = new THREE.SpriteMaterial({ map: trVisorTex, depthTest: false });
      const trSprite = new THREE.Sprite(trSpriteMat);
      trSprite.position.set(0, 2.7, 0);
      trSprite.scale.set(3.4, 0.85, 1);
      robotTrGroup.add(trSprite);

      // 3D DEDICATED CRT TRADING MONITOR
      const livePrice =
        marketAssets.find((m) => m.symbol === robot.assignedAsset)?.price ||
        robot.currentPosition?.currentPrice ||
        0;
      const monTex = createMonitorTexture(robot.assignedAsset, robot.currentDecision, livePrice);
      const crtGeo = new THREE.BoxGeometry(1.8, 1.4, 0.3);
      const crtMat = new THREE.MeshStandardMaterial({
        map: monTex,
        roughness: 0.3,
        emissive: 0x064e3b,
        emissiveIntensity: 0.2,
      });
      const crtMonitor = new THREE.Mesh(crtGeo, crtMat);
      crtMonitor.position.set(0, 1.4, 1.4);
      crtMonitor.castShadow = true;
      robotTrGroup.add(crtMonitor);

      scene.add(robotTrGroup);

      // Register for click & hover
      interactiveList.push({
        mesh: trMesh,
        type: 'trader',
        data: robot,
      });
      interactiveList.push({
        mesh: crtMonitor,
        type: 'trader',
        data: robot,
      });
    });

    interactiveObjectsRef.current = interactiveList;

    // 11. Raycasting for Mouse Hover & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targetMeshes = interactiveList.map((i) => i.mesh);
      const intersects = raycaster.intersectObjects(targetMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const matched = interactiveList.find(
          (item) => item.mesh === hit || item.mesh.children.includes(hit)
        );
        if (matched) {
          renderer.domElement.style.cursor = 'pointer';
          setHoveredObjectName(
            matched.type === 'agent'
              ? `${(matched.data as AgentRobot).name} (${(matched.data as AgentRobot).role})`
              : `${(matched.data as TradingRobot).name} [${(matched.data as TradingRobot).assignedAsset}]`
          );
          return;
        }
      }
      renderer.domElement.style.cursor = 'default';
      setHoveredObjectName(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targetMeshes = interactiveList.map((i) => i.mesh);
      const intersects = raycaster.intersectObjects(targetMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const matched = interactiveList.find(
          (item) => item.mesh === hit || item.mesh.children.includes(hit)
        );
        if (matched) {
          if (matched.type === 'agent') {
            soundFx.playBlip(800);
            onSelectAgent(matched.data as AgentRobot);
          } else {
            soundFx.playCoin();
            onSelectTradingRobot(matched.data as TradingRobot);
          }
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // 12. Animation Loop with Delta and Smooth Damping
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle floating animation for question blocks & crystals
      floatingBlocks.forEach((block, idx) => {
        block.position.y += Math.sin(elapsed * 2 + idx) * 0.003;
        block.rotation.y += 0.01;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 13. Handle Window Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [agents, tradingRobots, marketAssets, onSelectAgent, onSelectTradingRobot]);

  // Camera Presets handler
  const setCameraView = (preset: string) => {
    soundFx.playWarp();
    setActiveCameraPreset(preset);
    if (!controlsRef.current || !cameraRef.current) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;

    switch (preset) {
      case 'iso': // Isometric HQ Overview
        camera.position.set(0, 75, 75);
        controls.target.set(0, 0, 0);
        break;
      case 'dir': // Sala da Direção
        camera.position.set(0, 20, 2);
        controls.target.set(0, 2, -22);
        break;
      case 'trading': // Sala de Trading (8 Robôs)
        camera.position.set(34, 22, 45);
        controls.target.set(34, 2, 22);
        break;
      case 'meeting': // Sala de Reuniões
        camera.position.set(34, 18, -4);
        controls.target.set(34, 2, -22);
        break;
      case 'mkt': // Mercado
        camera.position.set(-34, 20, 20);
        controls.target.set(-34, 2, 0);
        break;
      case 'rsk': // Gestão de Risco
        camera.position.set(-34, 22, 42);
        controls.target.set(-34, 2, 22);
        break;
      case 'top': // Pure Top-down
        camera.position.set(0, 95, 0.1);
        controls.target.set(0, 0, 0);
        break;
      default:
        camera.position.set(0, 75, 75);
        controls.target.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[660px] md:h-[740px] bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="relative w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge (Minimal Title & Room Telemetry) */}
      <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-2 bg-slate-950/85 border border-slate-800/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-pixel text-[11px] text-amber-400">
          ESCRITÓRIO 3D · SUPER MARIO RPG STYLE
        </span>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          30 Agentes Robôs · 8 Robôs Traders · WebGL
        </span>
      </div>

      {/* Hover Info Tooltip (Center-Top) */}
      {hoveredObjectName && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-amber-500/90 text-slate-950 px-3 py-1 rounded-md text-xs font-pixel font-bold shadow-lg animate-in fade-in duration-100">
          {hoveredObjectName}
        </div>
      )}

      {/* Quick Meeting & Emergency Trigger Floating Pill (Top-Right) */}
      <div className="absolute top-3 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playCoin();
            onOpenMeetingRoom();
          }}
          className="px-3 py-1.5 bg-purple-600/90 hover:bg-purple-500 text-white rounded-lg text-xs font-bold font-pixel flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sala de Reuniões</span>
        </button>

        <button
          onClick={() => {
            const next = !isAudioMuted;
            setIsAudioMuted(next);
            soundFx.setMuted(next);
            if (!next) soundFx.playCoin();
          }}
          className="p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
          title={isAudioMuted ? 'Ativar Efeitos 8-bit' : 'Silenciar'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Ergonomic Unified Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 w-[94%] max-w-4xl flex flex-col items-center ${
          isDockCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            soundFx.playBlip(600);
            setIsDockCollapsed(!isDockCollapsed);
          }}
          className="px-3 py-1 rounded-t-lg bg-slate-900/95 border border-b-0 border-slate-700 text-slate-400 hover:text-white text-[10px] font-mono flex items-center gap-1 shadow-md"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3 text-amber-400" />
              <span>Mostrar Controles 3D</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 text-amber-400" />
              <span>Ocultar Controles (Modo Cinema)</span>
            </>
          )}
        </button>

        {/* Dock Controls Body */}
        <div className="w-full p-2.5 bg-slate-900/95 border-2 border-slate-700 rounded-xl shadow-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Camera Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline mr-1">
              Câmera 3D:
            </span>
            {[
              { id: 'iso', label: 'Isométrica Geral' },
              { id: 'dir', label: '1. Direção' },
              { id: 'trading', label: '9. Sala Trading' },
              { id: 'meeting', label: '10. Reuniões' },
              { id: 'mkt', label: '2. Mercado' },
              { id: 'rsk', label: '6. Risco' },
              { id: 'top', label: 'Visto de Cima' },
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => setCameraView(cam.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                  activeCameraPreset === cam.id
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>

          {/* Quick Help text */}
          <div className="text-[10px] text-slate-400 font-mono hidden md:flex items-center gap-2">
            <span>🖱️ Clique num robô para abrir ficha</span>
            <span>·</span>
            <span>Girar: Botão Esquerdo</span>
            <span>·</span>
            <span>Pan: Botão Direito</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeScene3D;

