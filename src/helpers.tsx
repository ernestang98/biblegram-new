const isMobile = (): boolean => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export {
  isMobile
}