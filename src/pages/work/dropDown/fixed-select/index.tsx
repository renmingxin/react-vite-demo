import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.less";

const Dropdown = ({  triggerId, menu, triggerEvent = "click" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const triggerElement = document.getElementById(triggerId);

    const handleEvent = (event: any) => {
      console.log(
        33333333333,
        triggerElement,
        triggerElement?.contains(event.target)
      );
      if (triggerElement && triggerElement.contains(event.target)) {
        event.stopPropagation();
        setIsOpen((prev) => !prev);
      } else {
        setIsOpen(false);
      }
    };

    if (triggerElement) {
      switch (triggerEvent) {
        case "dblclick":
          triggerElement.addEventListener("dblclick", handleEvent);
          break;
        case "contextmenu":
          triggerElement.addEventListener("contextmenu", (event) => {
            event.preventDefault(); // 阻止默认的右键菜单
            handleEvent(event);
          });
          break;
        case "mouseenter":
          triggerElement.addEventListener("mouseenter", handleEvent);
          triggerElement.addEventListener("mouseleave", () => setIsOpen(false));
          break;
        default:
          triggerElement.addEventListener("click", handleEvent);
      }
      window.addEventListener("click", handleEvent);
    }

    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener("dblclick", handleEvent);
        triggerElement.removeEventListener("contextmenu", handleEvent);
        triggerElement.removeEventListener("mouseenter", handleEvent);
        triggerElement.removeEventListener("mouseleave", () =>
          setIsOpen(false)
        );
      }
      window.removeEventListener("click", handleEvent);

    };
  }, [triggerId, triggerEvent]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const triggerElement = document.getElementById(triggerId);
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        setPosition(calculatePosition(rect));
      }
    }
  }, [isOpen, triggerId]);

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

  return isOpen
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
                onClick={(event) => {
                  console.log("item", item);
                  setIsOpen(false);
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
