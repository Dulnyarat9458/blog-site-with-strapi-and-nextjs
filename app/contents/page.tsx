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

interface searchParams {
  searchParams: { [key: string]: string | string[] | undefined }
}


interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getLastedData(searchParams: any) {

  const keyword = searchParams.keyword;
  const category = searchParams.category;
  const tag = searchParams.tag;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };


  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/contents?populate=cover`;

  if(keyword || category || tag){
    url += `&filters`
  }

  // (keyword.isEmpty() || category || tag) ??  url  `?filters` 

  keyword ? url = url + `?[name][$contains]=${keyword}` : "";

  const finalUrl = url + `&sort[0]=createdAt:desc&pagination[limit]=12`;

  console.log("====")
  console.log(finalUrl);
  console.log("====")

  const res = await fetch(finalUrl, options)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function TagsPage({ searchParams }: Props) {

  console.log(searchParams)

  const contents = await getLastedData(searchParams);



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
