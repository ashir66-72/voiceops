// Fully compliant Lottie JSON specifications for VoiceOps characters
// Zero external network dependency - 100% offline & instant

export const runningPenguinAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: "Penguin Running on Treadmill",
  ddd: 0,
  assets: [],
  layers: [
    // Layer 1: Treadmill Base and Rollers
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Treadmill Base",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 340, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          nm: "Platform",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [260, 24] },
          r: { a: 0, k: 8 }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.12, 0.12, 0.12, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 2: Moving Treadmill Speed Lines
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Treadmill Speed Lines",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [260, 335, 0] },
            { t: 30, s: [140, 335, 0] },
            { t: 60, s: [20, 335, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          nm: "Belt Segment 1",
          p: { a: 0, k: [-60, 0] },
          s: { a: 0, k: [40, 6] },
          r: { a: 0, k: 3 }
        },
        {
          ty: "rc",
          nm: "Belt Segment 2",
          p: { a: 0, k: [40, 0] },
          s: { a: 0, k: [40, 6] },
          r: { a: 0, k: 3 }
        },
        {
          ty: "rc",
          nm: "Belt Segment 3",
          p: { a: 0, k: [140, 0] },
          s: { a: 0, k: [40, 6] },
          r: { a: 0, k: 3 }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [1, 0.85, 0.1, 1] },
          o: { a: 0, k: 100 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 3: Left Foot (Back leg)
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Back Foot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-30] },
            { t: 15, s: [20] },
            { t: 30, s: [35] },
            { t: 45, s: [-10] },
            { t: 60, s: [-30] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [165, 305, 0] },
            { t: 15, s: [195, 318, 0] },
            { t: 30, s: [230, 310, 0] },
            { t: 45, s: [180, 298, 0] },
            { t: 60, s: [165, 305, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Foot Shape",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [38, 20] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.95, 0.45, 0.1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 4: Penguin Body (Bobs up and down with running rhythm)
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Penguin Body Group",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [8] },
            { t: 15, s: [14] },
            { t: 30, s: [8] },
            { t: 45, s: [14] },
            { t: 60, s: [8] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [195, 215, 0] },
            { t: 15, s: [195, 202, 0] },
            { t: 30, s: [195, 218, 0] },
            { t: 45, s: [195, 202, 0] },
            { t: 60, s: [195, 215, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        // Outer black body
        {
          ty: "el",
          nm: "Torso Black",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [120, 160] }
        },
        {
          ty: "fl",
          nm: "Body Fill",
          c: { a: 0, k: [0.1, 0.1, 0.14, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Body Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 5 }
        },
        // White belly
        {
          ty: "el",
          nm: "Belly White",
          p: { a: 0, k: [14, 14] },
          s: { a: 0, k: [80, 115] }
        },
        {
          ty: "fl",
          nm: "Belly Fill",
          c: { a: 0, k: [1, 1, 1, 1] },
          o: { a: 0, k: 100 }
        },
        // Eye (side profile looking forward)
        {
          ty: "el",
          nm: "Eye White",
          p: { a: 0, k: [32, -36] },
          s: { a: 0, k: [24, 28] }
        },
        {
          ty: "fl",
          nm: "Eye White Fill",
          c: { a: 0, k: [1, 1, 1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Eye Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        },
        {
          ty: "el",
          nm: "Eye Pupil",
          p: { a: 0, k: [38, -36] },
          s: { a: 0, k: [12, 14] }
        },
        {
          ty: "fl",
          nm: "Pupil Fill",
          c: { a: 0, k: [0.05, 0.05, 0.05, 1] },
          o: { a: 0, k: 100 }
        },
        // Beak (pointing right)
        {
          ty: "rc",
          nm: "Beak",
          p: { a: 0, k: [56, -26] },
          s: { a: 0, k: [34, 18] },
          r: { a: 0, k: 6 }
        },
        {
          ty: "fl",
          nm: "Beak Fill",
          c: { a: 0, k: [1, 0.55, 0.05, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Beak Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 5: Front Wing / Flipper (Swings rhythmically)
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "Front Flipper",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-40] },
            { t: 15, s: [35] },
            { t: 30, s: [-30] },
            { t: 45, s: [40] },
            { t: 60, s: [-40] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [190, 215, 0] },
            { t: 15, s: [190, 202, 0] },
            { t: 30, s: [190, 218, 0] },
            { t: 45, s: [190, 202, 0] },
            { t: 60, s: [190, 215, 0] }
          ]
        },
        a: { a: 0, k: [0, -25, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Flipper Oval",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [32, 70] }
        },
        {
          ty: "fl",
          nm: "Flipper Fill",
          c: { a: 0, k: [0.15, 0.15, 0.2, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Flipper Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 6: Front Foot
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "Front Foot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [35] },
            { t: 15, s: [-10] },
            { t: 30, s: [-30] },
            { t: 45, s: [25] },
            { t: 60, s: [35] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [230, 310, 0] },
            { t: 15, s: [180, 298, 0] },
            { t: 30, s: [165, 305, 0] },
            { t: 45, s: [195, 318, 0] },
            { t: 60, s: [230, 310, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Foot Shape",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [42, 22] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [1, 0.55, 0.1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 7: Sweat Drop / Effort Indicator
    {
      ddd: 0,
      ind: 7,
      ty: 4,
      nm: "Sweat Drops",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 15, s: [100] },
            { t: 35, s: [100] },
            { t: 50, s: [0] },
            { t: 60, s: [0] }
          ]
        },
        r: { a: 0, k: 25 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [130, 160, 0] },
            { t: 30, s: [110, 140, 0] },
            { t: 60, s: [90, 120, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Drop",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [16, 24] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.2, 0.7, 1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

export const wavingPenguinAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: "Stationary Waving Penguin",
  ddd: 0,
  assets: [],
  layers: [
    // Layer 1: Feet
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Feet Group",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 310, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Left Foot",
          p: { a: 0, k: [-32, 0] },
          s: { a: 0, k: [46, 22] }
        },
        {
          ty: "el",
          nm: "Right Foot",
          p: { a: 0, k: [32, 0] },
          s: { a: 0, k: [46, 22] }
        },
        {
          ty: "fl",
          nm: "Feet Fill",
          c: { a: 0, k: [1, 0.55, 0.1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Feet Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 2: Main Penguin Body (Gentle idle breathing)
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Penguin Body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 205, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 30, s: [102, 98, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        // Outer body
        {
          ty: "el",
          nm: "Torso",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [140, 180] }
        },
        {
          ty: "fl",
          nm: "Body Fill",
          c: { a: 0, k: [0.1, 0.1, 0.14, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Body Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 5 }
        },
        // White belly
        {
          ty: "el",
          nm: "Belly",
          p: { a: 0, k: [0, 12] },
          s: { a: 0, k: [96, 130] }
        },
        {
          ty: "fl",
          nm: "Belly Fill",
          c: { a: 0, k: [1, 1, 1, 1] },
          o: { a: 0, k: 100 }
        },
        // Cheeks
        {
          ty: "el",
          nm: "Left Cheek",
          p: { a: 0, k: [-32, -18] },
          s: { a: 0, k: [18, 14] }
        },
        {
          ty: "el",
          nm: "Right Cheek",
          p: { a: 0, k: [32, -18] },
          s: { a: 0, k: [18, 14] }
        },
        {
          ty: "fl",
          nm: "Cheeks Fill",
          c: { a: 0, k: [1, 0.45, 0.65, 0.7] },
          o: { a: 0, k: 70 }
        },
        // Eyes
        {
          ty: "el",
          nm: "Left Eye",
          p: { a: 0, k: [-22, -35] },
          s: { a: 0, k: [16, 22] }
        },
        {
          ty: "el",
          nm: "Right Eye",
          p: { a: 0, k: [22, -35] },
          s: { a: 0, k: [16, 22] }
        },
        {
          ty: "fl",
          nm: "Eyes Fill",
          c: { a: 0, k: [0.08, 0.08, 0.08, 1] },
          o: { a: 0, k: 100 }
        },
        // Beak
        {
          ty: "el",
          nm: "Beak",
          p: { a: 0, k: [0, -20] },
          s: { a: 0, k: [30, 22] }
        },
        {
          ty: "fl",
          nm: "Beak Fill",
          c: { a: 0, k: [1, 0.55, 0.05, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Beak Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 3: Left Resting Wing
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Left Flipper",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 12 },
        p: { a: 0, k: [136, 205, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Left Wing",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [30, 75] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.12, 0.12, 0.16, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    // Layer 4: Right Waving Wing (Animated waving loop!)
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Right Waving Flipper",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-65] },
            { t: 15, s: [-105] },
            { t: 30, s: [-65] },
            { t: 45, s: [-105] },
            { t: 60, s: [-65] }
          ]
        },
        p: { a: 0, k: [265, 185, 0] },
        a: { a: 0, k: [0, 30, 0] }, // Pivot at shoulder!
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Right Wing",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [32, 80] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.12, 0.12, 0.16, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

export const waitingPenguinAnimation = wavingPenguinAnimation;

export const excitedPenguinAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: "Penguin Jumps with Microphone",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Microphone",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-15] },
            { t: 15, s: [-25] },
            { t: 30, s: [-15] },
            { t: 45, s: [-5] },
            { t: 60, s: [-15] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [255, 175, 0] },
            { t: 15, s: [255, 135, 0] },
            { t: 30, s: [255, 175, 0] },
            { t: 45, s: [255, 135, 0] },
            { t: 60, s: [255, 175, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "rc",
          nm: "Handle",
          p: { a: 0, k: [0, 20] },
          s: { a: 0, k: [12, 45] },
          r: { a: 0, k: 4 }
        },
        {
          ty: "fl",
          nm: "Handle Fill",
          c: { a: 0, k: [0.1, 0.1, 0.1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Handle Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        },
        {
          ty: "el",
          nm: "Mic Head",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [26, 32] }
        },
        {
          ty: "fl",
          nm: "Head Fill",
          c: { a: 0, k: [0.85, 0.88, 0.92, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Head Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        },
        {
          ty: "el",
          nm: "Live Dot",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [8, 8] }
        },
        {
          ty: "fl",
          nm: "Dot Fill",
          c: { a: 0, k: [1, 0.2, 0.2, 1] },
          o: { a: 0, k: 100 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Feet Group",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 310, 0] },
            { t: 15, s: [200, 270, 0] },
            { t: 30, s: [200, 310, 0] },
            { t: 45, s: [200, 270, 0] },
            { t: 60, s: [200, 310, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Left Foot",
          p: { a: 0, k: [-32, 0] },
          s: { a: 0, k: [46, 22] }
        },
        {
          ty: "el",
          nm: "Right Foot",
          p: { a: 0, k: [32, 0] },
          s: { a: 0, k: [46, 22] }
        },
        {
          ty: "fl",
          nm: "Feet Fill",
          c: { a: 0, k: [1, 0.55, 0.1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Feet Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Penguin Body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 15, s: [5] },
            { t: 30, s: [0] },
            { t: 45, s: [-5] },
            { t: 60, s: [0] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 205, 0] },
            { t: 15, s: [200, 160, 0] },
            { t: 30, s: [200, 205, 0] },
            { t: 45, s: [200, 160, 0] },
            { t: 60, s: [200, 205, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 15, s: [96, 106, 100] },
            { t: 30, s: [104, 94, 100] },
            { t: 45, s: [96, 106, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "el",
          nm: "Torso",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [140, 180] }
        },
        {
          ty: "fl",
          nm: "Body Fill",
          c: { a: 0, k: [0.1, 0.1, 0.14, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Body Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 5 }
        },
        {
          ty: "el",
          nm: "Belly",
          p: { a: 0, k: [0, 12] },
          s: { a: 0, k: [96, 130] }
        },
        {
          ty: "fl",
          nm: "Belly Fill",
          c: { a: 0, k: [1, 1, 1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "el",
          nm: "Left Cheek",
          p: { a: 0, k: [-32, -18] },
          s: { a: 0, k: [18, 14] }
        },
        {
          ty: "el",
          nm: "Right Cheek",
          p: { a: 0, k: [32, -18] },
          s: { a: 0, k: [18, 14] }
        },
        {
          ty: "fl",
          nm: "Cheeks Fill",
          c: { a: 0, k: [1, 0.4, 0.6, 0.8] },
          o: { a: 0, k: 80 }
        },
        {
          ty: "el",
          nm: "Left Eye",
          p: { a: 0, k: [-22, -35] },
          s: { a: 0, k: [16, 22] }
        },
        {
          ty: "el",
          nm: "Right Eye",
          p: { a: 0, k: [22, -35] },
          s: { a: 0, k: [16, 22] }
        },
        {
          ty: "fl",
          nm: "Eyes Fill",
          c: { a: 0, k: [1, 1, 1, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "el",
          nm: "Left Pupil",
          p: { a: 0, k: [-20, -35] },
          s: { a: 0, k: [8, 12] }
        },
        {
          ty: "el",
          nm: "Right Pupil",
          p: { a: 0, k: [24, -35] },
          s: { a: 0, k: [8, 12] }
        },
        {
          ty: "fl",
          nm: "Pupils Fill",
          c: { a: 0, k: [0.05, 0.05, 0.05, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "el",
          nm: "Beak",
          p: { a: 0, k: [0, -16] },
          s: { a: 0, k: [28, 22] }
        },
        {
          ty: "fl",
          nm: "Beak Fill",
          c: { a: 0, k: [1, 0.65, 0, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Beak Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 3 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Left Wing Joy",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [45] },
            { t: 15, s: [85] },
            { t: 30, s: [45] },
            { t: 45, s: [85] },
            { t: 60, s: [45] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [135, 185, 0] },
            { t: 15, s: [135, 140, 0] },
            { t: 30, s: [135, 185, 0] },
            { t: 45, s: [135, 140, 0] },
            { t: 60, s: [135, 185, 0] }
          ]
        },
        a: { a: 0, k: [0, 30, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "el",
          nm: "Left Wing",
          p: { a: 0, k: [0, -10] },
          s: { a: 0, k: [32, 80] }
        },
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: [0.12, 0.12, 0.16, 1] },
          o: { a: 0, k: 100 }
        },
        {
          ty: "st",
          nm: "Stroke",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 4 }
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};
