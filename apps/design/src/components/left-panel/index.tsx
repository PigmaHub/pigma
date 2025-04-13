import { FC, useState } from "react";

interface LeftPanelProps {}

export const LeftPanel: FC<LeftPanelProps> = () => {
  const [activeTab, setActiveTab] = useState<"layers" | "pages" | "file">(
    "layers"
  );

  return (
    <div className="w-[260px] h-full bg-[#2c2c2c] text-white flex flex-col border-r border-[#444]">
      {/* 顶部标签栏 */}
      <div className="flex border-b border-[#444]">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "file" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("file")}
        >
          文件
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "pages" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("pages")}
        >
          页面
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "layers" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("layers")}
        >
          图层
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {activeTab === "file" && (
          <div className="p-2">
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer">
              文件
            </div>
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer">
              资源
            </div>
          </div>
        )}

        {activeTab === "pages" && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span>页面</span>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#444]">
                +
              </button>
            </div>
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer ml-2">
              页面 1
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span>图层</span>
              <div className="flex">
                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#444]">
                  +
                </button>
                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#444] ml-1">
                  -
                </button>
              </div>
            </div>
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer ml-2 flex items-center">
              <span className="mr-1">▶</span>
              <span>Frame 1</span>
            </div>
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer ml-4">
              Section 1
            </div>
            <div className="px-2 py-1 hover:bg-[#444] rounded cursor-pointer ml-4">
              Rectangle 1
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
