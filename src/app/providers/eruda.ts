export function setupEruda(): void {
  import('eruda').then((eruda) => {
    eruda.default.init();
  });
}
