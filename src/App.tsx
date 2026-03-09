import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LazyLoadComponent from "@/utils/lazyCom";

import Layout from "./components/layout";

const Login = LazyLoadComponent(
  () => import(/* webpackChunkName: "RMX-Login" */ "@/pages/login")
);
const TravelCuangxi = LazyLoadComponent(
  () =>
    import(/* webpackChunkName: "RMX-TravelCuangxi" */ "@/pages/life/travel")
);
const DropDown = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-DropDown" */ "@/pages/work/dropDown/dropDown"
    )
);
const DraggableColWidthTable = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-DraggableColWidthTable" */ "@/pages/work/table/draggableColWidthTable"
    )
);
const MyTable = LazyLoadComponent(
  () => import(/* webpackChunkName: "RMX-Welcome" */ "@/pages/work/table")
);
const VirtualList = LazyLoadComponent(
  () =>
    import(/* webpackChunkName: "RMX-VirtualList" */ "@/pages/work/virtualList")
);
const WebWorkerDemo = LazyLoadComponent(
  () =>
    import(/* webpackChunkName: "RMX-WebWorker" */ "@/pages/study/webWorker")
);
const RequestAnimationFrameDemo = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-requestAnimationFrame" */ "@/pages/study/requestAnimationFrame"
    )
);
const RequestIdleCallbackDemo = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-RequestIdleCallbackDemo" */ "@/pages/study/requestIdleCallback"
    )
);

const UeseRefDemo = LazyLoadComponent(
  () => import(/* webpackChunkName: "RMX-UeseRefDemo" */ "@/pages/study/useRef")
);

const TransferDemo = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-UeseRefDemo" */ "@/pages/study/transfer-demo"
    )
);

const WorkingHours = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-WorkingHours" */ "@/pages/work/workingHours"
    )
);
const RecoilDemo = LazyLoadComponent(
  () =>
    import(/* webpackChunkName: "RMX-RecoilDemo" */ "@/pages/study/recoil-demo")
);
const SystemSettingAntdTable = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-SystemSettingAntdTable" */ "@/pages/work/system-setting-antdTable"
    )
);

const DataQueryTree = LazyLoadComponent(
  () =>
    import(
      /* webpackChunkName: "RMX-DataQueryTree" */ "@/pages/work/dataQueryTree"
    )
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/study/webWorker" element={<WebWorkerDemo />} />
          <Route
            path="/study/requestAnimationFrame"
            element={<RequestAnimationFrameDemo />}
          />
          <Route
            path="/study/requestIdleCallback"
            element={<RequestIdleCallbackDemo />}
          />
          <Route path="/study/ueseRef" element={<UeseRefDemo />} />
          <Route path="/study/transfer" element={<TransferDemo />} />
          <Route path="/study/recoil" element={<RecoilDemo />} />

          <Route path="/work/dropDown" element={<DropDown />} />
          <Route
            path="/work/draggableTable"
            element={<DraggableColWidthTable />}
          />
          <Route path="/work/myTable" element={<MyTable />} />
          <Route path="/work/virtualList" element={<VirtualList />} />
          <Route path="/work/workingHours" element={<WorkingHours />} />
          <Route path="/work/workingHours" element={<WorkingHours />} />
          <Route
            path="/work/system-setting-antdTable"
            element={<SystemSettingAntdTable />}
          />
          <Route path="/work/bpm-dataQuery-tree" element={<DataQueryTree />} />
          <Route path="/life/travelCuangxi" element={<TravelCuangxi />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
