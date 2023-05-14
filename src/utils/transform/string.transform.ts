import { Transform } from 'class-transformer';

export function FullTextSearch() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return null;

    let words = value.split(/\s+/);
    words = words.filter((el) => !!el.trim().length);

    words = words.map((word) => {
      return word.replace(/[^a-zA-Z0-9А-Яа-я]/g, '\\$&');
    });

    return words.join(' | ');
  });
}
