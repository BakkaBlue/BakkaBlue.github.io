import type { StyleId, StyleInit } from '../../types';
import { initBurst } from './burst';
import { initFountain } from './fountain';
import { initSpiral } from './spiral';
import { initShatter } from './shatter';

export const styleInits: Record<StyleId, StyleInit> = {
  burst: initBurst,
  fountain: initFountain,
  spiral: initSpiral,
  shatter: initShatter,
};
