import React from "react";
import { Steps } from "antd";
import ReactSvg from "@/assets/react.svg";
import { useLocation } from "react-router";

function TravelCuangxi() {
  const location = useLocation();
  console.log("location", location);
  return (
    <div>
      <img src={ReactSvg} alt="" />
      <div>
        <Steps
          current={1}
          labelPlacement={"horizontal"}
          items={[
            {
              title: "成都-中和",
              description: "早上7：00出发",
              subTitle: "4小时50分钟/282.5km",
            },
            {
              title: "康定",
              description: "12点到达，吃午饭1小时，13点出发",
              subTitle: "2小时/58km",
            },
            {
              title: "红海子",
              description: "15点分到达",
              subTitle: "42分钟/34km",
            },
            {
              title: "格底拉姆",
              description: "16点到达，玩1小时，17点出发，可能会堵",
              subTitle: "20分钟/5.2km",
            },
            {
              title: "鱼子西",
              description: "17点半到达，19点走",
              subTitle: "1小时/32km",
            },
            {
              title: "新都桥",
              description: "20点到达，休息",
            },
          ]}
        />
      </div>
      <div style={{ marginTop: "50px" }}>
        <Steps
          current={1}
          labelPlacement={"horizontal"}
          items={[
            {
              title: "新都桥",
              description: "早上7：00醒，吃饭收拾8点出发",
              subTitle: "50分钟/36km",
            },
            {
              title: "塔公草原",
              description: "9点到达，玩1小时，10点出发",
              subTitle: "23分钟/10km",
            },
            {
              title: "姑弄村",
              description: "10点30到达，玩1小时，11点30出发",
              subTitle: "4小时10分/186km",
            },
            {
              title: "红海子",
              description: "15点40到达，玩1小时，16点半出发",
              subTitle: "5小时/308km",
            },

            {
              title: "成都-中和",
              description: "21点到达",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default TravelCuangxi;
