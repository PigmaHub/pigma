import { FC, useState } from "react";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const Toolbar: FC<ToolbarProps> = ({ activeTool, onToolChange }) => {
  const [showToolOptions, setShowToolOptions] = useState(false);
  
  const tools = [
    { id: "rectangle", icon: "□", label: "矩形", shortcut: "R" },
    { id: "line", icon: "╱", label: "线条", shortcut: "L" },
    { id: "arrow", icon: "↗", label: "箭头", shortcut: "Shift+L" },
    { id: "ellipse", icon: "○", label: "椭圆", shortcut: "O" },
    { id: "polygon", icon: "△", label: "多边形", shortcut: "" },
    { id: "star", icon: "★", label: "星形", shortcut: "" },
    { id: "image", icon: "🖼", label: "图片/视频...", shortcut: "Ctrl+Shift+K" },
  ];

  const handleToolSelect = (toolId: string) => {
    onToolChange(toolId);
    setShowToolOptions(false);
  };

  // 根据当前活动工具获取对应图标
  const getActiveToolIcon = () => {
    switch(activeTool) {
      case "rectangle": return "□";
      case "ellipse": return "○";
      case "line": return "╱";
      case "arrow": return "↗";
      case "polygon": return "△";
      case "star": return "★";
      default: return "□";
    }
  };

  const toolGroups = [
    { id: "shapes", icon: getActiveToolIcon(), tools: ["rectangle", "line", "arrow", "ellipse", "polygon", "star"] },
    { id: "frame", icon: "▢", tools: ["frame"] },
    { id: "pen", icon: "✎", tools: ["pen"] },
    { id: "text", icon: "T", tools: ["text"] },
    { id: "hand", icon: "✋", tools: ["hand"] },
    { id: "comments", icon: "💬", tools: ["comments"] },
    { id: "code", icon: "</>", tools: ["code"] },
  ];

  return (
    <>
      {/* 工具选项弹出菜单 */}
      {showToolOptions && (
        <div className="absolute bottom-16 left-4 bg-[#222] rounded shadow-lg z-10 w-64">
          <div className="p-1">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`flex items-center justify-between px-3 py-2 hover:bg-[#444] rounded cursor-pointer ${
                  activeTool === tool.id ? "bg-[#444]" : ""
                }`}
                onClick={() => handleToolSelect(tool.id)}
              >
                <div className="flex items-center">
                  {tool.id === activeTool && (
                    <span className="mr-2">✓</span>
                  )}
                  <span className="w-6 text-center">{tool.icon}</span>
                  <span className="ml-2">{tool.label}</span>
                </div>
                <span className="text-xs text-gray-400">{tool.shortcut}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部工具栏 */}
      <div className="h-12 bg-[#222] rounded-md flex items-center px-2 shadow-lg">
        {toolGroups.map((group) => (
          <div key={group.id} className="relative">
            <button
              className={`w-10 h-10 flex items-center justify-center rounded hover:bg-[#444] mx-0.5 ${
                (group.id === "shapes" && tools.some(t => t.id === activeTool)) || 
                group.id === activeTool ? "text-[#0099ff]" : "text-white"
              }`}
              onClick={() => {
                if (group.id === "shapes") {
                  setShowToolOptions(!showToolOptions);
                } else {
                  onToolChange(group.id);
                }
              }}
            >
              <span className="text-xl">{group.icon}</span>
              {group.id === "shapes" && (
                <span className="absolute bottom-1 right-1 text-xs">▼</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
