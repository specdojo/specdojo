/**
 * 一覧を出すコマンドの出力を `head` などで途中で切ると、標準出力が閉じられて EPIPE になる。
 * 読み手が去った場合は例外にせず、終了コード 0 で静かに終える。
 */
export function exitQuietlyOnClosedStdout(stream: NodeJS.WriteStream = process.stdout): void {
  stream.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EPIPE") {
      process.exit(0);
      return;
    }
    throw error;
  });
}
