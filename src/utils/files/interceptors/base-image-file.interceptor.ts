import { FileInterceptor, MulterOptions } from '@nest-lab/fastify-multer';
import { diskStorage, MulterError } from 'fastify-multer';
import { extname } from 'path';

export function createBaseImageFileInterceptor(
  folder: string,
  options?: Partial<MulterOptions>
): ReturnType<typeof FileInterceptor> {
  return FileInterceptor('file', createFileInterceptorOptions(options));
}

function createFileInterceptorOptions(options?: Partial<MulterOptions>): MulterOptions {
  return {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 1024 * 1024, // 1MB
    },
    ...options,
  };
}
