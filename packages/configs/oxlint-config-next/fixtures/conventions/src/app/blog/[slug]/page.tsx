import type { Metadata } from 'next';

type BlogPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return [{ slug: 'first' }];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <main>{slug}</main>;
}
