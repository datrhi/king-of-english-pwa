import Image from "next/image";

interface Props {
    icon: string;
}

export default function StaticBackground({ icon }: Props) {
    return (
        <div className="fixed inset-0 h-screen overflow-hidden pointer-events-none z-0">
            {/* Rotated background images */}
            <div className="absolute top-0 left-8 rotate-12 opacity-20">
                <Image src={icon} alt="" width={200} height={200} />
            </div>
            <div className="absolute bottom-16 right-12 -rotate-12 opacity-12">
                <Image src={icon} alt="" width={150} height={150} />
            </div>
            <div className="absolute top-16 right-4 rotate-45 opacity-8">
                <Image src={icon} alt="" width={120} height={120} />
            </div>
        </div>
    )
}