import { Page } from "konsta/react";
import { Props as NavbarProps } from "konsta/react/types/Navbar";
import DynamicBackground from "./DynamicBackground";
import Header from "./Header";
import StaticBackground from "./StaticBackground";

interface Props {
    children: React.ReactNode;
    icon?: string;
    headerProps: NavbarProps;
    view?: 'scrollable' | 'fixed';
    backgroundType?: 'static' | 'dynamic';
    contentPosition?: 'start' | 'center' | 'end';
}
export default function ScreenWithBackground({
    children,
    icon = "/images/crown.png",
    headerProps,
    view = 'fixed',
    backgroundType = 'static',
    contentPosition = 'center'
}: Props) {
    const className = view === 'scrollable' ? "no-overscroll min-h-screen" : "h-screen overflow-hidden";

    const justifyClass = {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end'
    }[contentPosition];

    return (
        <Page className={`${className} bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col`}>
            <Header title={"Join the Kingdom!"} {...headerProps} />

            <div className={`flex-1 flex flex-col items-center ${justifyClass} p-4 relative`}>
                {/* Background decoration - static or dynamic */}
                {backgroundType === 'static' ? (
                    <StaticBackground icon={icon} />
                ) : (
                    <DynamicBackground />
                )}

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        </Page>
    )
}