declare module "diff-match-patch" {
  export default class DiffMatchPatch {
    static DIFF_DELETE: -1;
    static DIFF_INSERT: 1;
    static DIFF_EQUAL: 0;

    Diff_Timeout: number;
    diff_main(text1: string, text2: string): [number, string][];
    diff_cleanupSemantic(diffs: [number, string][]): void;
    diff_levenshtein(diffs: [number, string][]): number;
  }
}
