import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.toggletools.com";

  return [
    // Homepage
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    // Category Pages
    { url: `${baseUrl}/finance-tools`, lastModified: new Date() },
    { url: `${baseUrl}/dev-tools`, lastModified: new Date() },
    { url: `${baseUrl}/design-tools`, lastModified: new Date() },

    // Active Finance Tools
    { url: `${baseUrl}/finance-tools/sip-calculator`, lastModified: new Date() },

    // Active Dev Tools
    { url: `${baseUrl}/dev-tools/json-formatter`, lastModified: new Date() },
    { url: `${baseUrl}/dev-tools/gzip-compressor`, lastModified: new Date() },
    { url: `${baseUrl}/dev-tools/base64-converter`, lastModified: new Date() },

    // Active Design Tools
    { url: `${baseUrl}/design-tools/color-picker`, lastModified: new Date() },
    { url: `${baseUrl}/design-tools/color-palettes`, lastModified: new Date() },
    { url: `${baseUrl}/design-tools/image-resizer`, lastModified: new Date() },
  ];
}
