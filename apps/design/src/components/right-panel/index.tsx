import { FC, useState } from "react";

interface RightPanelProps {}

export const RightPanel: FC<RightPanelProps> = () => {
  const [activeTab, setActiveTab] = useState<"design" | "prototype" | "export">(
    "design"
  );

  return (
    <div className="w-[260px] h-full bg-[#2c2c2c] text-white flex flex-col border-l border-[#444]">
      {/* 顶部标签栏 */}
      <div className="flex border-b border-[#444]">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "design" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("design")}
        >
          设计
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "prototype" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("prototype")}
        >
          原型
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === "export" ? "bg-[#444]" : ""
          }`}
          onClick={() => setActiveTab("export")}
        >
          导出
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {activeTab === "design" && (
          <div className="p-3">
            {/* 页面设置部分 */}
            <div className="mb-4">
              <div className="text-xs text-[#aaa] uppercase mb-2">页面</div>
              <div className="flex items-center mb-2">
                <span className="text-sm mr-2 w-16">尺寸</span>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-16 mr-1"
                  defaultValue="100"
                />
                <span className="text-sm mx-1">x</span>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-16"
                  defaultValue="100"
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2 w-16">背景</span>
                <div className="w-4 h-4 bg-white rounded mr-2 border border-[#666]"></div>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-24"
                  defaultValue="#FFFFFF"
                />
              </div>
            </div>

            {/* 变量部分 */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#aaa] uppercase mb-2">变量</div>
                <button className="text-xs text-[#aaa]">+</button>
              </div>
              <div className="text-sm text-center py-2 text-[#aaa]">无变量</div>
            </div>

            {/* 样式部分 */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#aaa] uppercase mb-2">样式</div>
                <button className="text-xs text-[#aaa]">▼</button>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-sm mr-2 w-16">填充</span>
                <div className="w-4 h-4 bg-red-800 rounded mr-2 border border-[#666]"></div>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-24"
                  defaultValue="#8B0000"
                />
              </div>
              <div className="flex items-center mb-2">
                <span className="text-sm mr-2 w-16">描边</span>
                <div className="w-4 h-4 bg-transparent rounded mr-2 border border-[#666]"></div>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-24"
                  defaultValue="无"
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2 w-16">圆角</span>
                <input
                  type="text"
                  className="bg-[#444] text-white text-sm px-2 py-1 rounded w-16"
                  defaultValue="0"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "prototype" && (
          <div className="p-3">
            <div className="text-sm text-center py-4 text-[#aaa]">
              选择一个对象来添加交互
            </div>
          </div>
        )}

        {activeTab === "export" && (
          <div className="p-3">
            <div className="text-xs text-[#aaa] uppercase mb-2">导出</div>
            <div className="flex items-center justify-between mb-2 p-2 border border-[#444] rounded">
              <span className="text-sm">1x</span>
              <select className="bg-[#444] text-white text-sm px-2 py-1 rounded">
                <option>PNG</option>
                <option>JPG</option>
                <option>SVG</option>
              </select>
            </div>
            <button className="w-full bg-[#444] text-white text-sm py-2 rounded mt-2">
              导出
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
