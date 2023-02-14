export const useDimensions = (
  isBig: boolean,
  isMedium: boolean,
  isSmall: boolean
) => {
  const supportedDimensions = {
    big: {
      width: 1920,
      height: 1080,
    },
    medium: {
      width: 1440,
      height: 780,
    },
    small: {
      width: 1280,
      height: 600,
    },
  };

  if (isBig) {
    return supportedDimensions["big"];
  } else if (isMedium) {
    return supportedDimensions["medium"];
  } else {
    return supportedDimensions["small"];
  }
};
