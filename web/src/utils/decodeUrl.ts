type UrlParams = {
  code: string;
};

const decode2Base64 = (content: string) => {
  return window.atob(content);
};

export const decodeUrl = (url: string): UrlParams => {
  const u = new URL(url);
  const code = u.searchParams.get('code') ?? '';

  return {
    code: decode2Base64(code),
  };
};
