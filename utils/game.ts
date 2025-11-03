export const scrambleWord = (word: string) => {
  let scrambledWord = word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("/");
  while (scrambledWord === word.split("").join("/")) {
    scrambledWord = word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("/");
  }
  return scrambledWord;
};
