export const pageVariants = {
  initial: {
    opacity: 0.5,
  },
  in: {
    opacity: 1,
  },
};

export const fishingRodVariants = {
  start: {
    opacity: 0,
    translateX: 0,
  },
  end: {
    translateX: 100,
    opacity: 1,
    transition: { duration: 1, delay: 1 },
  },
};

export const sentenceVariants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.9,
      duration: 1,
    },
  },
};

export const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const letterVariants__title = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const sentenceVariants__slogan = {
  hidden: {
    opacity: 1,
    backgroundColor: "transparent",
  },
  visible: {
    backgroundColor: "#2A344F",
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 4,
    },
  },
};
