export function isMulterFile(file: unknown): file is Express.Multer.File {
  return (
    typeof file === 'object' &&
    file !== null &&
    'originalname' in file &&
    'buffer' in file &&
    'mimetype' in file
  );
}
