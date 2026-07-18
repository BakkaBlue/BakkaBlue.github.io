export type StylePresetId = 'quiet' | 'glass' | 'max'

export interface StylePreset {
  id: StylePresetId
  name: string
  tagline: string
  description: string
  /** visual effect toggles */
  particles: boolean
  particleDensity: 'sparse' | 'normal' | 'dense'
  particlePointer: boolean
  shapes: boolean
  noise: boolean
  noiseStrength: 'soft' | 'medium'
  cursor: boolean
  progress: boolean
  /** data-style value applied to <html> */
  styleAttr: string
}

export const STYLE_PRESETS: Record<StylePresetId, StylePreset> = {
  quiet: {
    id: 'quiet',
    name: '简约高级',
    tagline: 'Quiet Luxury',
    description: '大留白、低饱和、克制粒子。默认气质。',
    particles: true,
    particleDensity: 'sparse',
    particlePointer: false,
    shapes: true,
    noise: true,
    noiseStrength: 'soft',
    cursor: false,
    progress: true,
    styleAttr: 'quiet',
  },
  glass: {
    id: 'glass',
    name: '简约毛玻璃',
    tagline: 'Frosted Glass',
    description: '更通透的玻璃面板与柔和氛围光，干净不炫技。',
    particles: true,
    particleDensity: 'normal',
    particlePointer: false,
    shapes: true,
    noise: false,
    noiseStrength: 'soft',
    cursor: false,
    progress: true,
    styleAttr: 'glass',
  },
  max: {
    id: 'max',
    name: '超级无敌特效',
    tagline: 'Maximum Flair',
    description: '密粒子、磁吸光标、更强光斑与噪声。能炫就炫。',
    particles: true,
    particleDensity: 'dense',
    particlePointer: true,
    shapes: true,
    noise: true,
    noiseStrength: 'medium',
    cursor: true,
    progress: true,
    styleAttr: 'max',
  },
}

export const PRESET_LIST = Object.values(STYLE_PRESETS)
