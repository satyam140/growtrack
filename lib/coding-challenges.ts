export type CodingLanguage = "javascript" | "python" | "java" | "c" | "cpp";
export type CodingTestCase = { input: unknown[]; expected: unknown };

export type CodingChallenge = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium";
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  functionNames: Record<CodingLanguage, string>;
  tests: CodingTestCase[];
};

export const codingChallenges: CodingChallenge[] = [
  {
    id: "two-sum",
    title: "Pair Sum Indices",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target, return the indices of the two distinct values that add up to the target. Return the pair in ascending index order. Each input has exactly one solution.",
    examples: [
      {
        input: "values = [4, 9, 6, 7], target = 10",
        output: "[0, 2]",
        explanation: "values[0] + values[2] equals 10.",
      },
      {
        input: "values = [5, 3, 8], target = 11",
        output: "[1, 2]",
        explanation: "values[1] + values[2] equals 11.",
      },
    ],
    functionNames: {
      javascript: "pairSumIndices",
      python: "pair_sum_indices",
      java: "pairSumIndices",
      c: "pairSumIndices",
      cpp: "pairSumIndices",
    },
    tests: [
      { input: [[4, 9, 6, 7], 10], expected: [0, 2] },
      { input: [[5, 3, 8], 11], expected: [1, 2] },
      { input: [[6, 6], 12], expected: [0, 1] },
    ],
  },
  {
    id: "valid-palindrome",
    title: "Normalized Palindrome",
    difficulty: "Easy",
    description:
      "Return true when a string reads the same forward and backward after converting letters to lowercase and removing every non-alphanumeric character.",
    examples: [
      {
        input: '"Never odd, or even!"',
        output: "true",
        explanation: 'After normalization the text is "neveroddoreven".',
      },
      {
        input: '"Campus IQ"',
        output: "false",
        explanation: "The normalized string does not read the same backward.",
      },
    ],
    functionNames: {
      javascript: "isNormalizedPalindrome",
      python: "is_normalized_palindrome",
      java: "isNormalizedPalindrome",
      c: "isNormalizedPalindrome",
      cpp: "isNormalizedPalindrome",
    },
    tests: [
      { input: ["Never odd, or even!"], expected: true },
      { input: ["Campus IQ"], expected: false },
      { input: ["A man, a plan, a canal: Panama."], expected: true },
      { input: [" "], expected: true },
    ],
  },
];

export function findCodingChallenge(challengeId: string) {
  return codingChallenges.find((challenge) => challenge.id === challengeId);
}
