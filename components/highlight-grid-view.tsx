import * as React from "react"
import Image from "next/image";
import Link from "next/link";


interface ContentAttribute {
  content: {
    data: {
      id: number,
      attributes: {
        cover: {
          data: {
            attributes: {
              url: string,
              alternativeText: string
            }
          }
        }
        name: string
      }
    }
  }
}

interface Ctn {
  id: number,
  attributes: ContentAttribute;
}

interface ContentData {
  data: Ctn[];
}

interface HighlightGridViewProps {
  contentData: ContentData;
}

export function HighlightGridView(props: HighlightGridViewProps) {
  const { contentData } = props;
  return (
    <div className="w-full grid md:grid-cols-4 gap-4">
      {
        contentData.data.map((ctn: Ctn, index: number) => (
          <div className={`relative aspect-square ${(index == 0) ? 'col-span-2 row-span-2' : ''}`}>
            <Link href={"contents/" + ctn.attributes.content.data.id} className="group point-cursor">
              <div className="overflow-hidden object-cover object-center h-full w-full">
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL + "" + ctn.attributes.content.data.attributes.cover.data.attributes.url}
                  width={1200}
                  height={1200}
                  alt={ctn.attributes.content.data.attributes.cover.data.attributes.alternativeText}
                  className="transition group-hover:scale-110 object-cover object-center h-full w-full duration-300"
                />
              </div>
              <div
                className="duration-300 w-full h-full flex justify-center items-end absolute bottom-0 text-center text-xl font-semibold p-4 
                bg-gradient-to-t
              from-black/70 from-20% via-black/30 via-70% to-black/0 transition-all hover:bg-black/50 ">
                <div className="text-white duration-300 transition-all absolute bottom-8 group-hover:bottom-1/2 group-hover:translate-y-1/2 group-hover:text-primary">
                  {ctn.attributes.content.data.attributes.name}
                </div>
              </div>
            </Link>
          </div>
        ))
      }
    </div >
  )
}