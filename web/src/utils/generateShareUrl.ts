const encode2Base64 = (content: string) => {
  return window.btoa(content);
};

export const generateShareUrl = (code: string) => {
  const params = {
    code: encode2Base64(code),
  };

  const { origin, pathname } = window.location;
  return origin + pathname + '/?' + new URLSearchParams(params).toString();
};
