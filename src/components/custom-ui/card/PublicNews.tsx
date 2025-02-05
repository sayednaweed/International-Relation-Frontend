import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CachedImage from "../image/CachedImage";
import { toLocaleDate } from "@/lib/utils";
import { News } from "@/database/tables";
import { ChevronRight } from "lucide-react";

export interface PublicNewsProps {
  news: News;
  viewOnClick: (news: News) => Promise<void>;
  detailText: string;
  state: any;
}

export function PublicNews(props: PublicNewsProps) {
  const { news, viewOnClick, detailText, state } = props;
  return (
    <Card
      key={news.id}
      className="shadow-xl max-h-[600px] w-[300px] md:w-[320px]"
    >
      <CardContent className="p-0  h-[200px] sm:h-[200px]">
        <CachedImage
          src={news.image}
          shimmerClassName="min-w-full h-full object-fill rounded-t"
          className="min-w-full shadow-lg h-full object-fill rounded-t"
        />
      </CardContent>
      <CardFooter className="flex flex-col justify-start items-start gap-y-2 pt-4">
        <h2 className="font-bold rtl:text-2xl-rtl ltr:text-2xl-ltr line-clamp-2">
          {news.title}
        </h2>
        <h1 className="rtl:text-xl-rtl ltr:text-xl-ltr text-primary/95 line-clamp-4 px-2">
          {news.contents}
        </h1>
        <div
          dir="ltr"
          className="flex justify-between w-full gap-y-1 mt-4 px-2"
        >
          <h1 className="text-[15px] font-bold text-primary/60">
            {toLocaleDate(new Date(news.date), state)}
          </h1>
          <h1
            onClick={() => viewOnClick(news)}
            className="flex items-center select-none gap-x-1 bg-tertiary rounded-sm hover:opacity-70 transition-opacity duration-500 text-white shadow-md px-3 py-1 ltr:text-xl-ltr rtl:text-xl-rtl"
          >
            {detailText}
            <ChevronRight className="size-[18px]" />
          </h1>
        </div>
      </CardFooter>
    </Card>
  );
}
