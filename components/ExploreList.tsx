"use client";

import { Dialog, DialogButton } from "konsta/react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ExploreItem {
  id: number;
  name: string;
  href: string;
  imgSrc: string;
  bgClass: string;
  heightClass: string;
  imgHeight: number;
}

const exploreData: ExploreItem[] = [
  {
    id: 1,
    name: "Animals",
    href: "https://langeek.co/en/vocab/subcategory/5336/learn",
    imgSrc: "https://cdn.langeek.co/photo/46019/original/animals?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 2,
    name: "Fish",
    href: "https://langeek.co/en/vocab/subcategory/5338/learn",
    imgSrc: "https://cdn.langeek.co/photo/46021/original/fish?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 3,
    name: "Drinks",
    href: "https://langeek.co/en/vocab/subcategory/5343/learn",
    imgSrc: "https://cdn.langeek.co/photo/46023/original/drinks?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 4,
    name: "Vegetables",
    href: "https://langeek.co/en/vocab/subcategory/5346/learn",
    imgSrc: "https://cdn.langeek.co/photo/46025/original/vegetables?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 5,
    name: "Face and Body",
    href: "https://langeek.co/en/vocab/subcategory/5349/learn",
    imgSrc: "https://cdn.langeek.co/photo/46027/original/face-body?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 6,
    name: "Home Appliances",
    href: "https://langeek.co/en/vocab/subcategory/5352/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46029/original/home-appliances?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 7,
    name: "Building Parts",
    href: "https://langeek.co/en/vocab/subcategory/5356/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46031/original/building-parts?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 8,
    name: "Sports",
    href: "https://langeek.co/en/vocab/subcategory/5364/learn",
    imgSrc: "https://cdn.langeek.co/photo/46033/original/sports?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 9,
    name: "Transportation",
    href: "https://langeek.co/en/vocab/subcategory/5366/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46035/original/transportation?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 10,
    name: "Hobbies and Games",
    href: "https://langeek.co/en/vocab/subcategory/5368/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46037/original/hobbies-games?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 11,
    name: "Feelings",
    href: "https://langeek.co/en/vocab/subcategory/5370/learn",
    imgSrc: "https://cdn.langeek.co/photo/46039/original/feelings?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 12,
    name: "Personal Care",
    href: "https://langeek.co/en/vocab/subcategory/5372/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46041/original/personal-care?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 13,
    name: "Birds and Insects",
    href: "https://langeek.co/en/vocab/subcategory/5337/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46020/original/birds-insects?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 14,
    name: "Food",
    href: "https://langeek.co/en/vocab/subcategory/5341/learn",
    imgSrc: "https://cdn.langeek.co/photo/46022/original/food?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 15,
    name: "Fruits",
    href: "https://langeek.co/en/vocab/subcategory/5344/learn",
    imgSrc: "https://cdn.langeek.co/photo/46024/original/fruits?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 16,
    name: "Jobs",
    href: "https://langeek.co/en/vocab/subcategory/5347/learn",
    imgSrc: "https://cdn.langeek.co/photo/46026/original/jobs?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 17,
    name: "Furniture",
    href: "https://langeek.co/en/vocab/subcategory/5350/learn",
    imgSrc: "https://cdn.langeek.co/photo/46028/original/furniture?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 18,
    name: "Kitchen Wares",
    href: "https://langeek.co/en/vocab/subcategory/5354/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46030/original/kitchen-wares?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 19,
    name: "Clothes",
    href: "https://langeek.co/en/vocab/subcategory/5357/learn",
    imgSrc: "https://cdn.langeek.co/photo/46032/original/clothes?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 20,
    name: "Nature",
    href: "https://langeek.co/en/vocab/subcategory/5365/learn",
    imgSrc: "https://cdn.langeek.co/photo/46034/original/nature?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 21,
    name: "City Locations",
    href: "https://langeek.co/en/vocab/subcategory/5367/learn",
    imgSrc: "https://cdn.langeek.co/photo/46036/original/city?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 22,
    name: "Shapes",
    href: "https://langeek.co/en/vocab/subcategory/5369/learn",
    imgSrc: "https://cdn.langeek.co/photo/46038/original/shapes?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
  {
    id: 23,
    name: "Musical Instruments",
    href: "https://langeek.co/en/vocab/subcategory/5371/learn",
    imgSrc:
      "https://cdn.langeek.co/photo/46040/original/musical-instruments?type=png",
    bgClass: "bg-blue-light-3",
    heightClass: "h-[192px] lg:h-[253px]",
    imgHeight: 92,
  },
  {
    id: 24,
    name: "Art",
    href: "https://langeek.co/en/vocab/subcategory/5373/learn",
    imgSrc: "https://cdn.langeek.co/photo/46042/original/arts?type=png",
    bgClass: "bg-blue-light-4",
    heightClass: "h-[144px] lg:h-[182px]",
    imgHeight: 72,
  },
];

export default function ExploreList() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ExploreItem | null>(null);

  const handleTopicClick = (item: ExploreItem) => {
    setSelectedTopic(item);
    setDialogOpened(true);
  };

  const handleConfirm = () => {
    if (selectedTopic) {
      // Mở link trong tab mới
      window.open(selectedTopic.href, "_blank", "noopener,noreferrer");
    }
    setDialogOpened(false);
    setSelectedTopic(null);
  };

  const handleCancel = () => {
    setDialogOpened(false);
    setSelectedTopic(null);
  };

  return (
    <div className="w-full">
      {/* FlatList-like container */}
      <div className="flex flex-col gap-4 p-4 pb-20">
        {exploreData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleTopicClick(item)}
            className={`${item.bgClass} w-full h-20 rounded-2xl flex flex-row items-center px-4 gap-4 hover:bg-blue-light-1 cursor-pointer active:scale-[0.98] transition-transform duration-150`}
          >
            <div className="flex-shrink-0">
              <Image
                alt="picture"
                className="dark:saturate-[1.2] dark:brightness-75"
                src={item.imgSrc}
                width={48}
                height={48}
              />
            </div>
            <div className="flex-1">
              <h2 className="font-text-medium text-title text-base font-semibold">
                {item.name}
              </h2>
            </div>
            <div className="flex-shrink-0 text-gray-400">
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        opened={dialogOpened}
        onBackdropClick={handleCancel}
        title="Create Quiz Room"
        content={
          selectedTopic
            ? `Do you want to create a quiz room with the topic "${selectedTopic.name}"?`
            : ""
        }
        buttons={
          <>
            <DialogButton onClick={handleCancel}>Cancel</DialogButton>
            <DialogButton strong onClick={handleConfirm}>
              Create Room
            </DialogButton>
          </>
        }
      />
    </div>
  );
}
