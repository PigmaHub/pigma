import { Application, Rect } from "@pigma/engine";
import { useEffect, useRef } from "react";

export function Designer() {
  let canvasRef = useRef<HTMLDivElement>(null);

  let app: Application = null!;

  useEffect(() => {
    app = new Application({
      container: canvasRef.current!,
    });

    let timer = setTimeout(() => {
      app.init().then(() => {
        const en = app.append(new Rect());

        en.Position = { x: 100, y: 100 };
      });
    }, 10);

    return () => {
      clearTimeout(timer);
      app?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex-1">
      <div ref={canvasRef} className="w-full h-full"></div>
    </div>
  );
}
