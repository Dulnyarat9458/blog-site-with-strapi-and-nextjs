import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from 'next'
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import RelatedCarousel from "@/components/related-carousel";
import CurrentDirectory from "@/components/current-directory";

interface Props {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

interface Tag {
  id: string
  attributes: {
    name: string
  }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/contents/${slug}?populate=cover`;
  const res = await fetch(url, options);
  const contents = await res.json();
  return {
    title: contents.data.attributes.name,
    description: contents.data.attributes.description,
  }
}

async function getData(slug: string) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/contents/${slug}?populate[0]=cover&populate[1]=tags&populate[2]=categories`;
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('That content can’t be found.')
  }
  return res.json()
}

export default async function ContentPage(props: Props) {
  const content = await getData(props.params.slug);
  const categories = content.data.attributes.categories.data;
  const tags = content.data.attributes.tags.data;
  const categoriesListId: any = [];
  const tagsListId: any = [];
  const publishedAt = new Date(content.data.attributes.publishedAt);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    hour12: false
  }).format(publishedAt);

  categories.map((value: any) => {
    categoriesListId.push(value.id)
  })
  tags.map((value: any) => {
    tagsListId.push(value.id)
  })

  return (
    <>
      <CurrentDirectory title={content.data.attributes.name} />
      <div>
        <div className="mx-auto my-4 px-5 text-sm text-secondary-foreground">Published: {formattedDate}</div>
        <div className="mb-12">
          <h1 className="text-center mx-auto font-bold text-4xl mt-14 mb-5">{content.data.attributes.name}</h1>
        </div>
        <div>
          <BlocksRenderer content={content.data.attributes.block} />
        </div>
        <div className="my-8"></div>
        <div><span>Tag:</span>
          {
            content.data.attributes.tags.data.map((tag: Tag) => {
              return (
                <Link href={`/tags/${tag.id}`}>
                  <span className="mx-2 bg-primary text-primary-foreground px-2 py-1 rounded-lg mb-8 duration-200 transition-all hover:text-black">{tag.attributes.name}</span>
                </Link>
              )
            })
          }
        </div>
        <RelatedCarousel categoriesId={categoriesListId} tagsId={tagsListId} cid={props.params.slug} />
      </div>
    </>
  );
}
