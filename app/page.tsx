"use client";
import AutoInstall from "@/components/AutoInstall";
import CourseList from "@/components/CourseList";
import InstallIntroduction from "@/components/InstallIntroduction";
import JoinGame from "@/components/JoinGame";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { isInStandaloneMode } from "@/utils/pwa";
import { Preloader, Tabbar, TabbarLink, ToolbarPane } from "konsta/react";
import { Compass, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

function TabbarPageContent() {
  const [activeTab, setActiveTab] = useState<"explore" | "join">("explore");
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const [isInStandalone, setIsInStandalone] = useState(false);

  useEffect(() => { setIsInStandalone(isInStandaloneMode() as boolean) }, [])

  if (source === "pwa" || isInStandalone) {
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
          <CourseList />
        )}

        {activeTab === "join" && <JoinGame />}
      </ScreenWithBackground>
    );
  }
  // Handle auto-install screen
  if (source === "install") {
    return (
      <ScreenWithBackground
        headerProps={{
          title: "Installing..."
        }}
        view="scrollable"
        contentPosition="center"
      >
        <AutoInstall />
      </ScreenWithBackground>
    );
  }



  // Handle install introduction screen
  return (
    <ScreenWithBackground
      headerProps={{
        title: "Install App"
      }}
      view="scrollable"
      contentPosition="center"
    >
      <InstallIntroduction />
    </ScreenWithBackground>
  );
}

export default function TabbarPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <TabbarPageContent />
    </Suspense>
  );
}
