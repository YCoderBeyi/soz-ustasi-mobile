import * as THREE from 'three';

export const goldMaterial = new THREE.MeshStandardMaterial({
  color: '#F1C96A',
  metalness: 0.3,
  roughness: 0.4,
  emissive: '#D9A441',
  emissiveIntensity: 0.1,
});

export function createGoldMaterial(): THREE.MeshStandardMaterial {
  return goldMaterial.clone();
}

export function createWaxMaterial(color = '#9F2D3E'): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.1,
    roughness: 0.8,
    emissive: color,
    emissiveIntensity: 0.05,
  });
}

export function createParchmentMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#F5E6C8',
    metalness: 0.0,
    roughness: 0.9,
  });
}

export const themeLightColors: Record<string, { fog: string; ambient: string; key: string }> = {
  'eski-istanbul':    { fog: '#8B6914', ambient: '#F5E6C8', key: '#FFD700' },
  'cappadocia':       { fog: '#E8B4B8', ambient: '#FFD1DC', key: '#FF9EAA' },
  'blacksea_highland':{ fog: '#87CEEB', ambient: '#B0E0E6', key: '#E0F7FA' },
  'ege_coast':        { fog: '#FFFFFF', ambient: '#FFF8E7', key: '#FFFDE7' },
  'nemrut_dawn':      { fog: '#4A148C', ambient: '#6A1B9A', key: '#CE93D8' },
  'anatolian_autumn': { fog: '#D2691E', ambient: '#F4A460', key: '#FFD700' },
  'seljuk_courtyard': { fog: '#00695C', ambient: '#00897B', key: '#4DB6AC' },
  'ottoman_library':  { fog: '#1A237E', ambient: '#283593', key: '#5C6BC0' },
};
