import { FileInterceptor, MulterOptions, StorageEngine } from '@nest-lab/fastify-multer';
import { MulterError } from 'fastify-multer';
import * as sharp from 'sharp';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { unlink } from 'fs';

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
    storage: baseStorage('./uploads/products'),
    limits: {
      fileSize: 1024 * 1024, // 1MB
    },
    ...options,
  };
}

function baseStorage(destination: string): StorageEngine {
  return {
    _handleFile(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}.webp`;
      const destPath = `${destination}/${filename}`;

      file.stream
        .pipe(sharp().webp({ quality: 80 }))
        .pipe(createWriteStream(destPath))
        .on('finish', () => callback(null, { path: destPath, filename }))
        .on('error', callback);
    },
    async _removeFile(req, file, callback) {
      const unlinkAsync = promisify(unlink);
      try {
        await unlinkAsync(file.path);
        callback(null);
      } catch (err) {
        callback(err);
      }
    },
  };
}
