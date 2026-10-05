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

export interface StepGuide {
  step: number;
  title: string;
  lines: string[];
  cta: string;
}

export const STEP_GUIDES: Record<GuideId, StepGuide> = {
  home: {
    step: 1,
    title: 'Chào mừng bé',
    lines: [
      'Bé sắp làm tranh dân gian Kim Hoàng — giống nghệ nhân làng tranh.',
      'Khắc gỗ, in đen trắng lên giấy đỏ. Con lợn chỉ tô trắng — đỏ là giấy. Con gà tô màu rồi thêm bài thơ.',
    ],
    cta: 'Bắt đầu!',
  },
  motif: {
    step: 2,
    title: 'Chọn mộc bản',
    lines: [
      'Chạm vào con lợn hoặc con gà — đó là hình sẽ in lên giấy.',
      'Sau khi in đen trắng, con lợn tô thêm trắng; con gà tô màu lên tranh.',
    ],
    cta: 'Được rồi!',
  },
  carve: {
    step: 3,
    title: 'Khắc gỗ',
    lines: [
      'Mỗi lần chạm là một nhát đục. Khoét phần gỗ xung quanh, giữ lại hình nổi.',
      'Chọn đầu đục Nhỏ, Vừa hoặc To.',
      'Chụm hai ngón tay để phóng to chỗ nhỏ — chạm hai lần để trở lại.',
    ],
    cta: 'Khắc thôi!',
  },
  ink: {
    step: 4,
    title: 'Lăn mực đen',
    lines: [
      'Chạm đĩa mực Đen để nhúng con lăn.',
      'Lăn con lăn qua lại trên hình nổi cho đến khi mực đen phủ kín.',
      'Rồi mới in nét đen trắng lên giấy đỏ.',
    ],
    cta: 'Lăn thôi!',
  },
  paper: {
    step: 5,
    title: 'Chọn giấy đỏ',
    lines: [
      'Tranh Kim Hoàng in trên giấy đỏ.',
      'Chọn Chu Sa hoặc Son Đỏ — đó là tờ giấy sẽ đóng dấu.',
    ],
    cta: 'Được rồi!',
  },
  print: {
    step: 6,
    title: 'Đóng dấu',
    lines: [
      'Kéo mộc bản tới chỗ muốn in. Xoay bằng hai ngón hoặc nút ↺ ↻.',
      'Nhấn Đóng dấu: mộc bản đè lên giấy, rồi nhấc lên — hình in nằm trên giấy.',
    ],
    cta: 'Được rồi!',
  },
  color: {
    step: 7,
    title: 'Tô màu',
    lines: [
      'Tranh in còn đen trắng trên giấy đỏ — tô trên tờ tranh, không phải trên mộc bản.',
      'Chạm đúng đĩa màu kế tiếp, rồi kéo bút lông trên tranh cho đến khi màu đó hiện ra.',
      'Con lợn chỉ tô trắng — đỏ là giấy. Con gà: 7 màu. Sau đó vào góc thơ.',
    ],
    cta: 'Vẽ nào!',
  },
  poem: {
    step: 8,
    title: 'Thêm bài thơ',
    lines: [
      'Tranh gà Kim Hoàng có bài thơ mực đen ở góc giấy đỏ.',
      'Chạm Thêm thơ để viết bài thơ mực đen cho đủ khổ giấy.',
      'Rồi kéo bài thơ để đổi chỗ — không vuốt sang trái (nút ← để quay lại).',
    ],
    cta: 'Được rồi!',
  },
  poemPig: {
    step: 8,
    title: 'Không cần thêm thơ',
    lines: [
      'Tranh lợn Kim Hoàng thường không có bài thơ.',
      'Con lợn đã to, chiếm cả tờ giấy — không cần thêm chữ.',
    ],
    cta: 'Được rồi!',
  },
  done: {
    step: 9,
    title: 'Tranh của bé đã xong',
    lines: [
      'Bé có thể lưu tranh vào ảnh.',
      'Hoặc chạm Vẽ lại để làm một bức mới.',
    ],
    cta: 'Xem tranh!',
  },
};
