import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { letterCenterPercent, wheelLettersAlongSegment } from '../game/wheelDrag';

type Point = { x: number; y: number };

interface Options {
  letters: string[];
  /** The ring element: only its geometry is read; the gesture itself is bound to a larger surface. */
  ringRef: RefObject<HTMLElement | null>;
  /** Called on release with the collected word (2+ letters). */
  onSubmit: (word: string) => void;
  /** Called on release with fewer than two letters. */
  onCancel: () => void;
  /** Called for every newly picked letter (sound, haptics). */
  onLetter: () => void;
}

/**
 * Drag-to-connect gesture for the letter wheel.
 *
 * - The gesture surface is bigger than the ring, so the thumb may start outside it and slide in:
 *   the pointer is "armed" on press and the word starts at the first letter the finger crosses.
 * - Every pointer move is walked as a segment, so a fast swipe never skips a letter.
 * - Geometry is measured once per gesture and the trail updates at most once per animation frame.
 */
export function useWheelGesture({ letters, ringRef, onSubmit, onCancel, onLetter }: Options) {
  const [selected, setSelected] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pointer, setPointer] = useState<Point | null>(null);

  const seqRef = useRef<number[]>([]);
  const armedRef = useRef(false);
  const draggingRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const tileRef = useRef(56);
  const prevRef = useRef<Point | null>(null);
  const pendingRef = useRef<Point | null>(null);
  const frameRef = useRef<number | null>(null);

  const toRingPercent = useCallback((x: number, y: number): Point | null => {
    const rect = rectRef.current;
    if (!rect) return null;
    return { x: ((x - rect.left) / rect.width) * 100, y: ((y - rect.top) / rect.height) * 100 };
  }, []);

  const schedulePointer = useCallback((point: Point | null) => {
    pendingRef.current = point;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setPointer(pendingRef.current);
    });
  }, []);

  const endGesture = useCallback((surface: Element, pointerId: number) => {
    if (surface.hasPointerCapture(pointerId)) surface.releasePointerCapture(pointerId);
    armedRef.current = false;
    draggingRef.current = false;
    rectRef.current = null;
    prevRef.current = null;
    seqRef.current = [];
    if (frameRef.current !== null) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
    pendingRef.current = null;
    setSelected([]);
    setIsDragging(false);
    setPointer(null);
  }, []);

  const pickLetter = useCallback((index: number) => {
    const seq = seqRef.current;
    if (!draggingRef.current) {
      draggingRef.current = true;
      setIsDragging(true);
      seqRef.current = [index];
      setSelected([index]);
      onLetter();
      return;
    }
    if (index === seq[seq.length - 2]) {
      seqRef.current = seq.slice(0, -1);
      setSelected(seqRef.current);
      return;
    }
    if (seq.includes(index)) return;
    seqRef.current = [...seq, index];
    setSelected(seqRef.current);
    onLetter();
  }, [onLetter]);

  const walkTo = useCallback((to: Point) => {
    const rect = rectRef.current;
    const from = prevRef.current ?? to;
    prevRef.current = to;
    if (!rect) return;
    const last = seqRef.current[seqRef.current.length - 1] ?? null;
    const crossed = wheelLettersAlongSegment(from, to, rect, letters.length, tileRef.current, last);
    for (const index of crossed) pickLetter(index);
    if (draggingRef.current) schedulePointer(toRingPercent(to.x, to.y));
  }, [letters.length, pickLetter, schedulePointer, toRingPercent]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    // Real buttons (hint, shuffle, seal) keep their own taps; a mouse right-click is not a gesture.
    if ((e.target as Element).closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const ring = ringRef.current;
    if (!ring) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    rectRef.current = ring.getBoundingClientRect();
    const sample = ring.querySelector<HTMLElement>('.wheelLetter');
    if (sample) {
      const box = sample.getBoundingClientRect();
      tileRef.current = Math.min(box.width, box.height);
    }
    armedRef.current = true;
    const at = { x: e.clientX, y: e.clientY };
    prevRef.current = at;
    walkTo(at);
  }, [ringRef, walkTo]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!armedRef.current) return;
    e.preventDefault();
    // Coalesced events carry every raw sample the browser batched into this frame.
    const samples = typeof e.nativeEvent.getCoalescedEvents === 'function' ? e.nativeEvent.getCoalescedEvents() : [];
    if (samples.length > 0) for (const s of samples) walkTo({ x: s.clientX, y: s.clientY });
    else walkTo({ x: e.clientX, y: e.clientY });
  }, [walkTo]);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!armedRef.current) return;
    e.preventDefault();
    walkTo({ x: e.clientX, y: e.clientY });
    const word = seqRef.current.map((i) => letters[i]).join('');
    const wasDragging = draggingRef.current;
    endGesture(e.currentTarget, e.pointerId);
    if (!wasDragging) return;
    if (word.length >= 2) onSubmit(word);
    else onCancel();
  }, [endGesture, letters, onCancel, onSubmit, walkTo]);

  const onPointerCancel = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!armedRef.current) return;
    const wasDragging = draggingRef.current;
    endGesture(e.currentTarget, e.pointerId);
    if (wasDragging) onCancel();
  }, [endGesture, onCancel]);

  /** Drops any half-built word (the clear button or a level change). */
  const reset = useCallback(() => {
    seqRef.current = [];
    draggingRef.current = false;
    setSelected([]);
    setIsDragging(false);
    setPointer(null);
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const trail: Point[] = selected.map((i) => letterCenterPercent(i, letters.length));
  if (pointer && isDragging) trail.push(pointer);

  return {
    selected,
    isDragging,
    trail,
    reset,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
