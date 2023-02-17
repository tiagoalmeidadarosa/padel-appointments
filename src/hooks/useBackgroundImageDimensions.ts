export const useBackgroundImageDimensions = (
  isBig: boolean,
  isMedium: boolean,
  isSmall: boolean
) => {
  const imageDimensions = {
    big: {
      width: 900,
      height: 900,
    },
    medium: {
      width: 700,
      height: 700,
    },
    small: {
      width: 500,
      height: 500,
    },
  };

  if (isBig) {
    return imageDimensions["big"];
  } else if (isMedium) {
    return imageDimensions["medium"];
  } else {
    return imageDimensions["small"];
  }
};
