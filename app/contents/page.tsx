import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ContentAttributes {
  cover: {
    data: {
      attributes: {
        url: string;
        alternativeText: string;
      }
    }
  },
  name: string;
}

interface Content {
  id: string;
  attributes: ContentAttributes;
}

async function getLastedData() {



  const options = {
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

export default async function TagsPage(props:any) {

  console.log(props)
  
  const contents = await getLastedData();
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-center mx-auto font-bold text-4xl mt-14 mb-5">Contents</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {
            contents.data.map(
              (content: Content) => {
                return (
                  <Link href={"/contents/" + content.id}>
                    <Card className="h-full">
                      <CardHeader className="p-0">
                        <Image
                          src={process.env.NEXT_PUBLIC_API_URL + "" + content.attributes.cover.data.attributes.url}
                          layout="responsive"
                          alt={content.attributes.cover.data.attributes.alternativeText}
                          className="w-full aspect-square object-cover rounded-t"
                          width={1200}
                          height={1200}
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-xl">{content.attributes.name}</CardTitle>
                        <CardDescription></CardDescription>
                      </CardContent>
                      <CardFooter>
                      </CardFooter>
                    </Card>
                  </Link>
                )
              }
            )
          }
        </div>
      </div>
    </div>
  );
}
