import Link from "next/link";

interface Cover {
  data: {
    attributes: {
      url: string;
      alternativeText: string;
    }
  }
}

interface Contents {
  data: Array<{
    id: string;
    attributes: {
      cover: Cover;
      name: string;
    };
  }>
}

interface Options {
  cache: 'force-cache' | 'no-store';
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
}

async function getData() {
  const options: Options = {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  };
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/tags`
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('That content can’t be found.')
  }
  return res.json()
}

export default async function TagsListPage() {
  const contents: Contents = await getData();
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-center mx-auto font-bold text-4xl mt-14 mb-16">Tag</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {
            contents.data.map(
              (content, index) => {
                return (
                  <Link key={index} href={"/tags/" + content.id} className="text-center mx-2 bg-primary text-primary-foreground px-2 py-1 rounded-lg mb-8 duration-200 transition-all">
                    {content.attributes.name}
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
