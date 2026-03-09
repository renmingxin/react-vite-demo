import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Checkbox } from "antd";

/**
 * 虚拟滚动列表组件，支持复选框功能
 * @param {Object} props 组件属性
 * @param {Array} props.data 完整数据数组，每个项需包含id属性
 * @param {number} [props.height=500] 列表容器高度
 * @param {number} [props.rowHeight=50] 每行高度(固定)
 * @param {Function} props.renderItem 渲染每项的函数
 * @param {number} [props.overscan=5] 额外渲染的项数(缓冲区)，优化滚动体验
 * @param {Array} props.checkedKeys 已选中项的id数组
 * @param {Function} props.onCheckedKeys 选中项变化时的回调函数
 * @returns {JSX.Element} 虚拟滚动列表组件
 */
const VirtualList = ({
  data,
  height = 500,
  rowHeight = 50,
  renderItem,
  overscan = 5,
  checkedKeys,
  onCheckedKeys,
}) => {
  // 容器元素引用，用于监听滚动事件和获取容器信息
  const containerRef = useRef(null);
  // 滚动位置状态，用于计算可视区域的项目
  const [scrollTop, setScrollTop] = useState(0);

  /**
   * 计算可视区域内的项目范围
   * 考虑了overscan缓冲区，优化滚动时的视觉体验
   * @returns {Object} 包含start和end的范围对象
   */
  const getVisibleRange = useCallback(() => {
    // 可视区域起始索引 = 滚动距离 / 行高（向下取整）
    const startIndex = Math.floor(scrollTop / rowHeight);
    // 可视区域能显示的项数 = 容器高度 / 行高（向上取整）
    const visibleCount = Math.ceil(height / rowHeight);
    // 结束索引 = 起始索引 + 可视项数 + 缓冲区，不超过数据总长度
    const endIndex = Math.min(
      startIndex + visibleCount + overscan,
      data.length
    );

    // 返回计算后的范围，确保起始索引不小于0
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex,
    };
  }, [scrollTop, height, rowHeight, data.length, overscan]);

  /**
   * 处理滚动事件
   * 更新滚动位置状态，触发可视区域重新计算
   */
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  /**
   * 计算可视区域项目的偏移量样式
   * 用于将可视项目定位到正确的滚动位置
   * @returns {Object} 包含transform样式的对象
   */
  const getOffsetStyle = useCallback(() => {
    const { start } = getVisibleRange();
    return {
      transform: `translateY(${start * rowHeight}px)`,
    };
  }, [getVisibleRange, rowHeight]);

  // 计算列表总高度，用于撑起滚动条
  const totalHeight = data.length * rowHeight;

  // 获取当前可视范围内的项目
  const { start, end } = getVisibleRange();
  const visibleItems = data.slice(start, end);

  // 监听容器的滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // 组件卸载时移除事件监听
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      style={{
        height: `${height}px`,
        overflow: "auto",
        position: "relative",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* 占位元素，用于撑起滚动条高度，使滚动条比例正确 */}
      <div style={{ height: `${totalHeight}px` }} />

      {/* 可视区域的项目容器 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          ...getOffsetStyle(),
        }}
      >
        {visibleItems.map((item, index) => {
          // 计算原始索引（相对于完整数据的索引）
          const originalIndex = start + index;
          return renderItem(item, originalIndex, checkedKeys, (id, checked) => {
            // 更新选中状态的处理函数
            if (checked) {
              // 如果是选中操作，添加id（去重）
              onCheckedKeys(Array.from(new Set([...checkedKeys, id])));
            } else {
              // 如果是取消选中，过滤掉id
              onCheckedKeys(checkedKeys.filter((key) => key !== id));
            }
          });
        })}
      </div>
    </div>
  );
};

/**
 * 列表项组件，包含复选框
 * 使用React.memo避免不必要的重渲染
 */
const Item = React.memo(({ item, index, checked, onChange }) => (
  <div
    style={{
      height: "50px",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #f0f0f0",
      backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
      // 鼠标悬停效果
      transition: "background-color 0.2s",
    }}
  >
    <div style={{ marginRight: "8px" }}>
      <Checkbox
        checked={checked}
        onChange={(e) => {
          onChange(item.id, e.target.checked);
        }}
        // 添加key确保复选框正确更新
        key={`checkbox-${item.id}`}
      />
    </div>
    <div>{item.content}</div>
  </div>
));

// 使用示例组件
const VirtualListExample = () => {
  // 生成大量测试数据（1000条）
  const [largeData] = useState(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      content: `列表项 ${i + 1}`,
    }));
  });

  // 选中项的id数组状态
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 使用useMemo缓存renderItem函数，避免每次渲染创建新函数
  const renderItem = useMemo(
    () => (item, index, checkedKeys, onChange) =>
      (
        <Item
          key={item.id}
          item={item}
          index={index}
          checked={checkedKeys.includes(item.id)}
          onChange={onChange}
        />
      ),
    []
  );

  // 计算全选状态：全选、部分选择或未选
  const checkAllStatus = useMemo(() => {
    if (checkedKeys.length === 0) {
      return false;
    }
    if (checkedKeys.length === largeData.length) {
      return true;
    }
    return "indeterminate"; // 部分选择状态
  }, [checkedKeys, largeData.length]);

  // 处理全选/取消全选
  const handleCheckAll = (checked) => {
    setCheckedKeys(checked ? largeData.map((item) => item.id) : []);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <p>共 {largeData.length} 条数据</p>
      <p>已选中 {checkedKeys.length} 条数据</p>
      <p>
        <Checkbox
          checked={checkAllStatus === true}
          indeterminate={checkAllStatus === "indeterminate"}
          onChange={(e) => handleCheckAll(e.target.checked)}
        >
          全选
        </Checkbox>
      </p>
      <VirtualList
        data={largeData}
        height={500}
        rowHeight={50}
        checkedKeys={checkedKeys}
        onCheckedKeys={setCheckedKeys}
        renderItem={renderItem}
      />
    </div>
  );
};

export default VirtualListExample;
