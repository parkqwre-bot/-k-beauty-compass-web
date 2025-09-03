import React, { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ dataAdSlot }) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line @typescript-eslint/no-explicit-any
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-YOUR_ADSENSE_PUBLISHER_ID" // TODO: Replace with your actual AdSense Publisher ID
      data-ad-slot={dataAdSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;
