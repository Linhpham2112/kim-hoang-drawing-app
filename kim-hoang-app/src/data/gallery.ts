import type { ImageSourcePropType } from 'react-native';

export type GalleryWork = {
  id: string;
  source: ImageSourcePropType;
  titleVi: string;
  titleEn: string;
  artist: string;
};

export type GalleryAlbum = {
  id: string;
  titleVi: string;
  titleEn: string;
  artist: string;
  works: GalleryWork[];
};

const ARTISAN = 'Linh Pham';

/**
 * Artist showcase only. Import from Gallery screens — never from Home
 * or the carve/paint steps. `require()` registers the file; the bitmap
 * is decoded only when an <Image> mounts.
 */
export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 'bo-kieu',
    titleVi: 'Bộ Kiều',
    titleEn: 'The Kiều album',
    artist: ARTISAN,
    works: [
      {
        id: 'bo-kieu-tuong-ngo',
        source: require('../../assets/gallery/bo-kieu/01-tuong-ngo.jpg'),
        titleVi: 'Tương ngộ',
        titleEn: 'First meeting',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-tu-tinh',
        source: require('../../assets/gallery/bo-kieu/02-tu-tinh.jpg'),
        titleVi: 'Tự tình',
        titleEn: 'Confiding',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-thuc-sinh',
        source: require('../../assets/gallery/bo-kieu/03-thuc-sinh.jpg'),
        titleVi: 'Thúc Sinh',
        titleEn: 'Thúc Sinh',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-thanh-lau',
        source: require('../../assets/gallery/bo-kieu/04-thanh-lau.jpg'),
        titleVi: 'Thanh lâu',
        titleEn: 'The green mansion',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-truoc-quan',
        source: require('../../assets/gallery/bo-kieu/05-truoc-quan.jpg'),
        titleVi: 'Trước quan',
        titleEn: 'Before the court',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-tai-hop',
        source: require('../../assets/gallery/bo-kieu/06-tai-hop.jpg'),
        titleVi: 'Tái hợp',
        titleEn: 'Reunion',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-duc',
        source: require('../../assets/gallery/bo-kieu/07-duc.jpg'),
        titleVi: 'Đức',
        titleEn: 'Virtue',
        artist: ARTISAN,
      },
      {
        id: 'bo-kieu-phuc',
        source: require('../../assets/gallery/bo-kieu/08-phuc.jpg'),
        titleVi: 'Phúc',
        titleEn: 'Fortune',
        artist: ARTISAN,
      },
    ],
  },
];

export const GALLERY_WORKS: GalleryWork[] = [
  {
    id: 'lon-doc',
    source: require('../../assets/gallery/lon-doc.jpg'),
    titleVi: 'Lợn độc',
    titleEn: 'Lone pig',
    artist: ARTISAN,
  },
  {
    id: 'than-ke',
    source: require('../../assets/gallery/than-ke.jpg'),
    titleVi: 'Thần kê',
    titleEn: 'Divine rooster',
    artist: ARTISAN,
  },
  {
    id: 'tan-tai',
    source: require('../../assets/gallery/tan-tai.jpg'),
    titleVi: 'Tấn tài',
    titleEn: 'Advancing wealth',
    artist: ARTISAN,
  },
  {
    id: 'tan-loc',
    source: require('../../assets/gallery/tan-loc.jpg'),
    titleVi: 'Tấn lộc',
    titleEn: 'Advancing fortune',
    artist: ARTISAN,
  },
  {
    id: 'ma-dao-hong',
    source: require('../../assets/gallery/ma-dao-hong.jpg'),
    titleVi: 'Mã đáo thành công',
    titleEn: 'Horse of success — rose',
    artist: ARTISAN,
  },
  {
    id: 'ma-dao-trang',
    source: require('../../assets/gallery/ma-dao-trang.jpg'),
    titleVi: 'Mã đáo thành công',
    titleEn: 'Horse of success — white',
    artist: ARTISAN,
  },
];

export function findGalleryAlbum(albumId: string): GalleryAlbum | undefined {
  return GALLERY_ALBUMS.find((album) => album.id === albumId);
}

export function findGalleryWork(workId: string): GalleryWork | undefined {
  const single = GALLERY_WORKS.find((work) => work.id === workId);
  if (single) return single;
  for (const album of GALLERY_ALBUMS) {
    const piece = album.works.find((work) => work.id === workId);
    if (piece) return piece;
  }
  return undefined;
}
