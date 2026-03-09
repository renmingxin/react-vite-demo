import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.less";
import { useClickAway } from "ahooks";

type Props = {
  visible: boolean;
  triggerId: string;
  menu: any[];
  onChange: (item: any) => void;
  onCancel: () => void;
};
const Dropdown = (props: Props) => {
  const { visible, triggerId, menu, onChange, onCancel } = props;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  useClickAway(
    () => {
      console.log('333333')
      onCancel();
    },
    dropdownRef,
    ["click"]
  );
  const calculatePosition = (rect: any) => {
    const d: any = dropdownRef.current;
    const dropdownWidth = d ? d?.offsetWidth : 0;
    const dropdownHeight = d ? d?.offsetHeight : 0;
    const { innerWidth, innerHeight } = window;

    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    if (left + dropdownWidth > innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth;
    }

    if (top + dropdownHeight > innerHeight) {
      top = rect.top + window.scrollY - dropdownHeight;
    }

    return { top, left };
  };

  useEffect(() => {
    if (visible && dropdownRef.current) {
      const triggerElement = document.getElementById(triggerId);
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        setPosition(calculatePosition(rect));
      }
    }
  }, [visible, triggerId]);

  return visible
    ? ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: `${position.top}px`,
            left: `${position.left}px`,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            maxWidth: "200px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {menu.map((item: any) => (
              <li
                key={item.key}
                title={item.title}
                style={{ padding: "8px 16px", cursor: "pointer" }}
                className={styles.item}
                onClick={() => {
                  onChange(item);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )
    : null;
};

export default Dropdown;
