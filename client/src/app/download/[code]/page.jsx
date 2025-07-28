import DownloadClient from './DownloadClient';

export default async function Page({ params }) {
  const { code } = await params;

  return <DownloadClient code={code} />;
}
