import { Application, Rect } from "@pigma/engine";
import { useEffect, useRef, useState } from "react";
import { Toolbar } from "../toolbar";

export function Designer() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTool, setActiveTool] = useState<string>("select");

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

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    // 这里可以添加工具切换的逻辑
    console.log("Tool changed to:", tool);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#333]">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-[#2c2c2c] border-b border-[#444] flex items-center px-4 justify-between">
        {/* 左侧工具 */}
        <div className="flex items-center">
          <div className="flex space-x-1 mr-4">
            <button
              className={`w-8 h-8 rounded flex items-center justify-center ${
                activeTool === "select" ? "bg-[#444]" : "hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setActiveTool("select")}
              title="选择工具"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5L15 12L5 19V5Z"
                  fill={activeTool === "select" ? "white" : "#aaa"}
                />
              </svg>
            </button>
            <button
              className={`w-8 h-8 rounded flex items-center justify-center ${
                activeTool === "rectangle" ? "bg-[#444]" : "hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setActiveTool("rectangle")}
              title="矩形工具"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  stroke={activeTool === "rectangle" ? "white" : "#aaa"}
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              className={`w-8 h-8 rounded flex items-center justify-center ${
                activeTool === "text" ? "bg-[#444]" : "hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setActiveTool("text")}
              title="文本工具"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5H19V8H15V19H9V8H5V5Z"
                  fill={activeTool === "text" ? "white" : "#aaa"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 中间区域 - 页面名称 */}
        <div className="flex items-center">
          <span className="text-white text-sm">页面 1</span>
        </div>

        {/* 右侧工具 - 缩放控制 */}
        <div className="flex items-center">
          <button
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#3a3a3a]"
            onClick={() => setZoomLevel((prev) => Math.max(25, prev - 25))}
            title="缩小"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12H19" stroke="#aaa" strokeWidth="2" />
            </svg>
          </button>
          <div className="mx-2 text-white text-sm">{zoomLevel}%</div>
          <button
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#3a3a3a]"
            onClick={() => setZoomLevel((prev) => Math.min(400, prev + 25))}
            title="放大"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12H19M12 5V19" stroke="#aaa" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="flex-1 overflow-auto relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center w-full h-full">
          <div ref={canvasRef} className="shadow-lg w-full h-full"></div>
        </div>

        {/* 底部工具条 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Toolbar activeTool={activeTool} onToolChange={handleToolChange} />
        </div>
      </div>
    </div>
  );
}
