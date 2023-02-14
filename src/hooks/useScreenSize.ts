import { useMediaQuery } from "react-responsive";

export const useScreenSize = () => {
  const isBig = useMediaQuery({
    query: "(min-width: 1920px)",
  });
  const isMedium = useMediaQuery({
    query: "(max-width: 1920px) and (min-width: 1440px)",
  });
  const isSmall = useMediaQuery({ query: "(max-width: 1440px)" });

  return {
    isBig,
    isMedium,
    isSmall,
  };
};
