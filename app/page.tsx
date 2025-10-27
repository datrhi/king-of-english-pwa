"use client";
import ExploreList from "@/components/ExploreList";
import Header from "@/components/Header";
import JoinGame from "@/components/JoinGame";
import { Page, Tabbar, TabbarLink, ToolbarPane } from "konsta/react";
import { Compass, Users } from "lucide-react";
import { useState } from "react";

const Tabs = {
  explore: {
    label: "Explore",
    icon: <Compass size={24} />,
    header: "Explore a category",
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
    <Page className="no-overscroll">
      <Header title={Tabs[activeTab].header} />
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
        <div className="mb-24">
          <ExploreList />
        </div>
      )}

      {activeTab === "join" && <JoinGame />}
    </Page>
  );
}
