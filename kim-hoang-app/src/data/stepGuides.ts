/** Distinct stages in the header: home → motif → carve → ink → paper → stamp → color → poem → done. */
export const TOTAL_STEPS = 9;

export type GuideId =
  | 'home'
  | 'motif'
  | 'carve'
  | 'ink'
  | 'paper'
  | 'print'
  | 'color'
  | 'poem'
  | 'poemPig'
  | 'done';

export type GuideLang = 'vi' | 'en';

export interface StepGuide {
  step: number;
  titleVi: string;
  titleEn: string;
  linesVi: string[];
  linesEn: string[];
  ctaVi: string;
  ctaEn: string;
}

export const STEP_GUIDES: Record<GuideId, StepGuide> = {
  home: {
    step: 1,
    titleVi: 'Chào mừng bé',
    titleEn: 'Welcome',
    linesVi: [
      'Bé sắp làm tranh dân gian Kim Hoàng — giống nghệ nhân làng tranh.',
      'Khắc gỗ, in đen trắng lên giấy đỏ. Con lợn chỉ tô trắng — đỏ là giấy. Con gà tô màu rồi thêm bài thơ.',
    ],
    linesEn: [
      'You are about to make a Kim Hoàng folk print — the way the village artists do.',
      'Carve wood, stamp black on red paper. The pig only gets white — red is the paper. The rooster gets color, then a poem.',
    ],
    ctaVi: 'Bắt đầu!',
    ctaEn: "Let's start!",
  },
  motif: {
    step: 2,
    titleVi: 'Chọn mộc bản',
    titleEn: 'Choose a woodblock',
    linesVi: [
      'Chạm vào con lợn hoặc con gà — đó là hình sẽ in lên giấy.',
      'Sau khi in đen trắng, con lợn tô thêm trắng; con gà tô màu lên tranh.',
    ],
    linesEn: [
      'Tap the pig or the rooster — that is the picture that will print on the paper.',
      'After the black-and-white stamp, the pig gets white paint; the rooster gets color on the print.',
    ],
    ctaVi: 'Được rồi!',
    ctaEn: 'Got it!',
  },
  carve: {
    step: 3,
    titleVi: 'Khắc gỗ',
    titleEn: 'Carve the wood',
    linesVi: [
      'Mỗi lần chạm là một nhát đục. Khoét phần gỗ xung quanh, giữ lại hình nổi.',
      'Chọn đầu đục Nhỏ, Vừa hoặc To.',
      'Chụm hai ngón tay để phóng to chỗ nhỏ — chạm hai lần để trở lại.',
    ],
    linesEn: [
      'Each tap is a gouge. Cut away the wood around the picture; leave the raised shape.',
      'Pick a Small, Medium, or Large gouge.',
      'Pinch with two fingers to zoom in — double-tap to go back.',
    ],
    ctaVi: 'Khắc thôi!',
    ctaEn: 'Carve!',
  },
  ink: {
    step: 4,
    titleVi: 'Lăn mực đen',
    titleEn: 'Roll black ink',
    linesVi: [
      'Chạm đĩa mực Đen để nhúng con lăn.',
      'Lăn con lăn qua lại trên hình nổi cho đến khi mực đen phủ kín.',
      'Rồi mới in nét đen trắng lên giấy đỏ.',
    ],
    linesEn: [
      'Tap the Black ink plate to load the brayer.',
      'Roll back and forth on the raised shape until black ink covers it.',
      'Then stamp the black-and-white picture onto red paper.',
    ],
    ctaVi: 'Lăn thôi!',
    ctaEn: 'Roll!',
  },
  paper: {
    step: 5,
    titleVi: 'Chọn giấy đỏ',
    titleEn: 'Choose red paper',
    linesVi: [
      'Tranh Kim Hoàng in trên giấy đỏ.',
      'Chọn Chu Sa hoặc Son Đỏ — đó là tờ giấy sẽ đóng dấu.',
    ],
    linesEn: [
      'Kim Hoàng prints on red paper.',
      'Pick Chu Sa or Son Đỏ — that is the sheet you will stamp.',
    ],
    ctaVi: 'Được rồi!',
    ctaEn: 'Got it!',
  },
  print: {
    step: 6,
    titleVi: 'Đóng dấu',
    titleEn: 'Stamp',
    linesVi: [
      'Kéo mộc bản tới chỗ muốn in. Xoay bằng hai ngón hoặc nút ↺ ↻.',
      'Nhấn Đóng dấu: mộc bản đè lên giấy, rồi nhấc lên — hình in nằm trên giấy.',
    ],
    linesEn: [
      'Drag the block where you want the print. Twist with two fingers or the ↺ ↻ buttons.',
      'Press Stamp: the block presses onto the paper, then lifts — the picture stays on the sheet.',
    ],
    ctaVi: 'Được rồi!',
    ctaEn: 'Got it!',
  },
  color: {
    step: 7,
    titleVi: 'Tô màu',
    titleEn: 'Paint',
    linesVi: [
      'Tranh in còn đen trắng trên giấy đỏ — tô trên tờ tranh, không phải trên mộc bản.',
      'Chạm đúng đĩa màu kế tiếp, rồi kéo bút lông trên tranh cho đến khi màu đó hiện ra.',
      'Con lợn chỉ tô trắng — đỏ là giấy. Con gà: 7 màu. Sau đó vào góc thơ.',
    ],
    linesEn: [
      'The print is still black and white on red paper — paint on the sheet, not on the woodblock.',
      'Tap the next color plate, then brush on the print until that color shows.',
      'The pig only gets white — red is the paper. The rooster: 7 colors. Then the poem corner.',
    ],
    ctaVi: 'Vẽ nào!',
    ctaEn: 'Paint!',
  },
  poem: {
    step: 8,
    titleVi: 'Thêm bài thơ',
    titleEn: 'Add the poem',
    linesVi: [
      'Tranh gà Kim Hoàng có bài thơ mực đen ở góc giấy đỏ.',
      'Chạm Thêm thơ để viết bài thơ mực đen cho đủ khổ giấy.',
      'Rồi kéo bài thơ để đổi chỗ — không vuốt sang trái (nút ← để quay lại).',
    ],
    linesEn: [
      'A Kim Hoàng rooster print has a black-ink poem in the corner of the red sheet.',
      'Tap Add the poem to stamp the verse in black ink onto the paper.',
      'Then drag the poem to move it — do not swipe left (use ← to go back).',
    ],
    ctaVi: 'Được rồi!',
    ctaEn: 'Got it!',
  },
  poemPig: {
    step: 8,
    titleVi: 'Không cần thêm thơ',
    titleEn: 'No poem needed',
    linesVi: [
      'Tranh lợn Kim Hoàng thường không có bài thơ.',
      'Con lợn đã to, chiếm cả tờ giấy — không cần thêm chữ.',
    ],
    linesEn: [
      'Kim Hoàng pig prints usually have no poem.',
      'The pig is already large and fills the sheet — no extra writing.',
    ],
    ctaVi: 'Được rồi!',
    ctaEn: 'Got it!',
  },
  done: {
    step: 9,
    titleVi: 'Tranh của bé đã xong',
    titleEn: 'Your print is done',
    linesVi: [
      'Bé có thể lưu tranh vào ảnh.',
      'Hoặc chạm Vẽ lại để làm một bức mới.',
    ],
    linesEn: [
      'You can save the print to Photos.',
      'Or tap Paint again to make a new one.',
    ],
    ctaVi: 'Xem tranh!',
    ctaEn: 'See the print!',
  },
};
