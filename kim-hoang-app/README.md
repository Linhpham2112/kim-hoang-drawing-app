# Tranh Kim Hoàng

Expo app for the Kim Hoàng drawing project. Target device is an iPhone or iPad.

## What you need

- Node.js 20 or newer
- A phone or tablet on the same Wi-Fi as the computer, or tunnel mode if LAN fails (VPN often breaks LAN)
- [Expo Go](https://expo.dev/go) built for SDK 57, or a local dev client

## Run it

```bash
cd kim-hoang-app
npm install
npx expo start --clear
```

Scan the QR code with the Camera app (Expo Go) or the dev client.

If the phone cannot see the packager, press `s` in the terminal for tunnel mode and scan again.

Other entry points from this folder:

```bash
npm start
npm run ios
npm run android
npm run web
```

`ios` and `android` still go through Expo. The portfolio target is iOS.

## What you will walk through

The header counts nine stages. Some share a screen:

1. Home
2. Choose woodblock (pig or rooster)
3. Carve the relief
4. Roll black ink on the block
5. Choose chu sa or son đỏ paper
6. Place the block and stamp
7. Color on the print (pig: reserved white; rooster: seven plates)
8. Poem (rooster stamps calligraphy; pig is told it does not need a poem)
9. Done (save to Photos)

Home also has Xem tranh nghệ nhân / Artists' gallery. That stack is `Gallery`, then an optional album, then one print. It sits outside the nine stages and has no `step/9` header. To add files, see `assets/gallery/README.md`.

Landscape works if rotation lock is off. iPad is on (`supportsTablet` in `app.json`). Layout width comes from `src/hooks/useLayout.ts`.

## Rebuild motif files (optional)

Runtime art is already in `assets/motifs/` and `src/assets/motifs/`. Rebuild only if you change a scan or SVG.

From `kim-hoang-app/`:

```bash
python3 scripts/build.py
python3 scripts/build_pig_plates.py
python3 scripts/recolor_rooster.py
python3 scripts/build_poem.py
```

`build.py` needs `potrace`, `numpy`, `pillow`, and `scipy`. See `assets/references/README.md`.

## Other writing

The full list lives in the repo root [`README.md`](../README.md).

## Stack

Expo SDK 57, React Native 0.86, TypeScript. Navigation is React Navigation native stack. Session state is Zustand. Drawing uses `react-native-svg` and Reanimated 4. Fonts load in `App.tsx` (Playfair Display, Be Vietnam Pro).
