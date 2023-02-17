export const useBackgroundImagePoints = (
  isBig: boolean,
  isMedium: boolean,
  isSmall: boolean
) => {
  if (isBig) {
    return {
      coords: [
        [238, 22, 660, 280],
        [28, 457, 286, 878],
        [609, 457, 868, 878],
      ],
    };
  } else if (isMedium) {
    return {
      coords: [
        [186, 18, 512, 217],
        [223, 683, 22, 357],
        [675, 683, 474, 357],
      ],
    };
  } else {
    return {
      coords: [
        [133, 13, 366, 155],
        [158, 487, 16, 255],
        [482, 487, 339, 255],
      ],
    };
  }
};
