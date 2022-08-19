import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useLocation, useNavigate } from "react-router-dom";

import HomeOutlined from "@mui/icons-material/HomeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AutoGraphOutlined from "@mui/icons-material/AutoGraphOutlined";
import LocalPhoneOutlined from "@mui/icons-material/LocalPhoneOutlined";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

const tabs = [
  {
    label: "Home",
    icon: <HomeOutlined />,
    path: "/",
  },
  {
    label: "Phone Lookup",
    icon: <LocalPhoneOutlined />,
    path: "/phone-lookup",
  },
  //   {
  //     label: "Search Everywhere",
  //     icon: <SearchOutlined />,
  //     path: "/search-everywhere",
  //   },
  //   {
  //     label: "Analyze Spreadsheet",
  //     icon: <AutoGraphOutlined />,
  //     path: "/analyze-spreadsheet",
  //   },
  {
    label: "Upload New Spreadsheet",
    icon: <FileUploadOutlined />,
    path: "/upload",
  },
];

export default function TabNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box>
      <Tabs
        value={location.pathname}
        onChange={(ev, val) => navigate(val)}
        centered
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            value={tab.path}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </Tabs>
    </Box>
  );
}
