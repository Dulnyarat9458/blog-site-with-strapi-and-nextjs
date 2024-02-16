import * as React from "react"
import Image from "next/image";
import Link from "next/link";

async function getData() {

  const options: any = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/contents?populate=cover&sort[0]=createdAt:desc&pagination[limit]=12`;
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function LastedGridView() {
  const contentData = await getData();

  return (
    <div className="w-full grid md:grid-cols-4 gap-4">
      {
        contentData.data.map((content: any, index: number) => (
          <div key={index} className="relative aspect-square">
            <Link href={"contents/" + content.id} className="group point-cursor">
              <div className="overflow-hidden object-cover object-center h-full w-full">
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL + "" + content.attributes.cover.data.attributes.url}
                  width={1200}
                  height={1200}
                  alt={content.attributes.cover.data.attributes.alternativeText}
                  className="transition group-hover:scale-110 object-cover object-center h-full w-full duration-300"
                />
              </div>
              <div
                className="duration-300 w-full h-full flex justify-center items-end absolute bottom-0 text-center text-xl font-semibold p-4 
                bg-gradient-to-t
              from-black/70 from-20% via-black/30 via-70% to-black/0 transition-all hover:bg-black/50 ">
                <div className="text-white duration-300 transition-all absolute bottom-8 group-hover:bottom-1/2 group-hover:translate-y-1/2 group-hover:text-primary">
                  {content.attributes.name}
                </div>
              </div>
            </Link>
          </div>
        ))
      }
    </div >
  )
}
