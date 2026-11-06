import { useEffect, useRef } from 'react';

declare class Engine {
  constructor(element: HTMLDivElement);
  ready: Promise<void>;
  destroy(): void;
}
declare function publish(engine: Engine | null): void;

export function Wall() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const engine = new Engine(box.current!);
    let alive = true;
    engine.ready.then(() => {
      if (alive) publish(engine);
    });
    return () => {
      alive = false;
      engine.destroy();
    };
  }, []);

  return <div ref={box} />;
}
