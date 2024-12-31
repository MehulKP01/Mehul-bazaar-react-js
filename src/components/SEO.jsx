import Head from "next/head";
import { useSelector } from "react-redux";

const SEO = ({ title, slug, type, description, image, keyword }) => {
  const appData = useSelector((state) => state?.shop?.appdata?.app)
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="description" content={description || "Default description"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <title>{title || appData?.generalSetting?.bannerText}</title>
      <meta property="og:title" content={title || appData?.generalSetting?.bannerText} />
      <meta property="og:url" content={`https://digibulkmarketing.com${slug}`} />
      <meta property="og:description" content={description || "Default description"} />
      <meta property="og:image" content={image || "/default-image.jpg"} />
      {keyword && <meta name="keywords" content={keyword} />}
      {type && <meta property="og:type" content={type} />}
      {slug && <meta property="og:url" content={`https://digibulkmarketing.com${slug}`} />}
    </Head>
  );
};

export default SEO;