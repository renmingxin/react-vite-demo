import { Modal } from "antd";
import React, { useState } from "react";
function NodePropertiesSetting() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a onClick={() => setOpen(true)}>设置</a>
      <Modal
        title={"节点属性"}
        width={605}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {}}
      >
        {open && <div>1111</div>}
      </Modal>
    </>
  );
}

export default NodePropertiesSetting;
