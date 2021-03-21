// w b w w b w b w w b w b w b w w b w b w w b w b w b w w b
// ^-     -^ ^-     -^ ^-^
// w b w w b
// w b w w b
// w b
// w b w w b
// w b w w b
// w b
const WB_SUB_PATTERN_ONE: Array<'w' | 'b'> = ['w', 'b'];
const WB_SUB_PATTERN_TWO: Array<'w' | 'b'> = [
	...WB_SUB_PATTERN_ONE,
	'w',
	...WB_SUB_PATTERN_ONE
];
export const WB_PATTERN: Array<'w' | 'b'> = [
	...WB_SUB_PATTERN_TWO,
	...WB_SUB_PATTERN_TWO,
	...WB_SUB_PATTERN_ONE
];
/**
 * Kept for posterity
const BLACK_88_IDS = [
  22,
  25, 3 <-- start
  27, 2
  30, 3
  32, 2
  34, 2 <-- end
  37, 3
  39, 2
  42, 3
  44, 2
  46, 2
  49, 3
  51, 2
  54, 3
  56, 2
  58, 2
  61, 3
  63, 2
  66, 3
  68, 2
  70, 2
  73, 3
  75, 2
  78, 3
  80, 2
  82, 2
  85, 3
  87, 2
  90, 3
  92, 2
  94, 2
  97, 3
  99, 2
  102,3
  104,2
  106 2
];
const WHITE_88_IDS = [
  21,
  23, 2  <-- start
  24, 1
  26, 2
  28, 2
  29, 1
  31, 2
  33, 2 <-- end
  35, 2
  36, 1
  38, 2
  40, 2
  41, 1
  43, 2
  45, 2
  47, 2
  48, 1
  50, 2
  52, 2
  53, 1
  55, 2 
  57, 2
  59, 2
  60, 1
  62,
  64,
  65,
  67,
  69,
  71,
  72,
  74,
  76,
  77,
  79,
  81,
  83,
  84,
  86,
  88,
  89,
  91,
  93,
  95,
  96,
  98,
  100,
  101,
  103,
  105,
  107,
  108
];
*/
