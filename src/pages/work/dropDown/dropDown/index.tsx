import React, { useEffect, useState, useCallback } from "react";
import { Button } from "antd";
import styles from "./index.module.less";
import Dropdown from "../drop-down";

const wait = (timer = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, timer);
  });
};
const clac = () => {
  console.log("clac");
  return 1 + 1;
};
function Index() {
  console.log("Index");
  const [items, setItems] = useState<any[]>([]);
  const [options, setOptions] = useState<any>();
  const [count, setCount] = useState<any>(1);
  const [a, setA] = useState<any>(0);

  const init = async () => {
    // await wait(200);
    const _items: any[] = [
      {
        label: "公司领导审批",
        key: "1",
        title: "公司领导审批",
      },
      {
        label: "公司及部门领导阅办",
        key: "2",
        title: "公司及部门领导阅办",
      },
      {
        label: "部门成员阅办",
        key: "3",
        title: "部门成员阅办",
      },
      {
        label: "网关分支",
        key: "4",
        title: "网关分支",
      },
      {
        label: "公司领导审批",
        key: "5",
        title: "公司领导审批",
      },
      {
        label: "公司及部门领导阅办",
        key: "6",
        title: "公司及部门领导阅办",
      },
      {
        label: "部门成员阅办",
        key: "7",
        title: "部门成员阅办",
      },
      {
        label: "网关分支",
        key: "8",
        title: "网关分支",
      },
      {
        key: "9",
        title:
          "公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批公司领导审批",
      },
      {
        label: "公司及部门领导阅办",
        key: "10",
        title: "公司及部门领导阅办",
      },
      {
        label: "部门成员阅办",
        key: "11",
        title: "部门成员阅办",
      },
      {
        key: "12",
        title: "网关分支",
      },
    ];
    setItems(_items);
  };
  // const handleClick = () => {
  //   setOptions({ visible: false });
  //   console.log(111111111);
  //   window.removeEventListener("click", handleClick);
  // };
  useEffect(() => {
    init();
    const a1 = clac();
    setA(a1);
    return () => {
      // window.removeEventListener("click", handleClick);
    };
  }, []);

  const renderDrown = () => {
    setOptions({
      visible: true,
      triggerId: "aa1",
    });
  };
  const onChange = (val: unknown) => {
    console.log(val);
  };

  const seCountHandle = useCallback(() => {
    const a = count + 1;
    setCount(a);
  }, [count]);

  return (
    <>
      <div
        style={{
          border: "1px solid red",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            // seCountHandle();
            const a = count + 1;
            setCount(a);
          }}
        >
          1111
        </Button>
        <Button type="primary" onClick={renderDrown}>
          触发下拉
        </Button>
        <div id="aa1" style={{ position: "absolute", top: "50%", left: "50%" }}>
          <Button type="primary" onClick={renderDrown}>
            意见签署
          </Button>
        </div>
      </div>
      {options?.visible && (
        <Dropdown
          visible={options?.visible}
          triggerId={options?.triggerId}
          menu={items}
          onChange={onChange}
          onCancel={() => {
            console.log(2222222);

            // setOptions({
            //   visible: false,
            // });
          }}
        />
      )}
    </>
  );
}

export default Index;
