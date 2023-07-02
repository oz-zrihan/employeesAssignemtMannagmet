
class FileModel {
  public filesFolder?: string;
  public filesUrl?: string[];
  public filesFile?: File[];

  public constructor(
    filesFolder?: string,
    filesUrl?: string[],
    filesFile?: File[]
  ) {
    this.filesFolder = filesFolder;
    this.filesUrl = filesUrl;
    this.filesFile = filesFile;
  }
}

export default FileModel;
