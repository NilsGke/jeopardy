export class FileHandlePermissionError extends Error {
  static name = "FileHandlePermissionError";
  handle: FileSystemDirectoryHandle;

  constructor(message: string, handle: FileSystemDirectoryHandle) {
    super(message);
    this.name = FileHandlePermissionError.name;
    this.handle = handle;
  }

  static errorIsFileHandlePermissionError(
    error: Error,
  ): error is FileHandlePermissionError {
    return error.name === FileHandlePermissionError.name;
  }
}
