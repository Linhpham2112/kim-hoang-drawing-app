export type RootStackParamList = {
  Home: undefined;
  Gallery: undefined;
  GalleryAlbum: { albumId: string };
  GalleryWork: { workId: string };
  Motif: undefined;
  Carve: undefined;
  Paper: undefined;
  Color: undefined;
  Poem: undefined;
  Done: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackScreenName = keyof RootStackParamList;
