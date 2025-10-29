"use client";
import ExploreList from "@/components/ExploreList";
import JoinGame from "@/components/JoinGame";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { Tabbar, TabbarLink, ToolbarPane } from "konsta/react";
import { Compass, Users } from "lucide-react";
import { useState } from "react";

const Tabs = {
  explore: {
    label: "Explore",
    icon: <Compass size={24} />,
    header: "Explore a course",
  },
  join: {
    label: "Join",
    icon: <Users size={24} />,
    header: "Join a room",
  },
};
export default function TabbarPage() {
  const [activeTab, setActiveTab] = useState<"explore" | "join">("explore");
  return (
    <ScreenWithBackground
      headerProps={{
        title: Tabs[activeTab].header
      }}
      view="scrollable"
      contentPosition={activeTab === "explore" ? "start" : "center"}
    >
      <Tabbar labels={true} icons={true} className="left-0 bottom-0 fixed">
        <ToolbarPane>
          <TabbarLink
            active={activeTab === "explore"}
            onClick={() => setActiveTab("explore")}
            icon={Tabs.explore.icon}
            label={Tabs.explore.label}
          />
          <TabbarLink
            active={activeTab === "join"}
            onClick={() => setActiveTab("join")}
            icon={Tabs.join.icon}
            label={Tabs.join.label}
          />
        </ToolbarPane>
      </Tabbar>

      {activeTab === "explore" && (
        <ExploreList />
      )}

      {activeTab === "join" && <JoinGame />}
    </ScreenWithBackground>
  )
}
