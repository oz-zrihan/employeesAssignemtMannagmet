
class ImageModel {
  public imagesFolder?: string;
  public imagesUrl?: string[];
  public imagesFile?: File[];

  public constructor(
    imagesFolder?: string,
    imagesUrl?: string[],
    imagesFile?: File[]
  ) {
    this.imagesFolder = imagesFolder;
    this.imagesUrl = imagesUrl;
    this.imagesFile = imagesFile;
  }
}

export default ImageModel;
