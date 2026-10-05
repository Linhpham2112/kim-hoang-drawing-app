# Artist gallery

Village prints shown from Home (Xem tranh nghệ nhân). The paintings are by Linh Pham. Motif plates for the game stay in `assets/motifs/`.

Catalog: `src/data/gallery.ts`. Only gallery screens import that file.

## Add a single print

1. Put a JPEG in this folder.
2. Name it ASCII, no spaces: `than-ke.jpg`.
3. Long edge about 1600px. A 4000px scan will hitch if the grid decodes it.
4. Add a `require('../../assets/gallery/….jpg')` row to `GALLERY_WORKS` in `gallery.ts`.

## Add or change an album

Bộ Kiều is one album. Its eight files live in `bo-kieu/` and are listed on `GALLERY_ALBUMS` in `gallery.ts`, not as eight singles.

1. Keep album files in a subfolder (`bo-kieu/`).
2. Number them in story order (`01-….jpg` …).
3. Register the folder as one `GalleryAlbum` with a `works` array. The gallery packet fans three of those sheets; the rest load on the album screen.

## Current set

Singles: Lợn độc, Thần kê, Tấn tài, Tấn lộc, two Mã đáo thành công.

`bo-kieu/`: Tương ngộ, Tự tình, Thúc Sinh, Thanh lâu, Trước quan, Tái hợp, Đức, Phúc.

Plate titles were read off the chữ Hán on the sheets. Correct them in `gallery.ts` if a name is wrong.
