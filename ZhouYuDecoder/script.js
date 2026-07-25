const MORSE_MAP = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',
  J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',
  S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  ' ':'/','.'  :'.-.-.-',',':'--..--','?':'..--..',
}
const MORSE_REV = Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v]) => [v, k]))

// ── 周语 mapping tables ──

const HIRAGANA_ROMAJI = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'っ':'','ゃ':'ya','ゅ':'yu','ょ':'yo','ゎ':'wa',
}

const YOON_HIRAGANA = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'じゃ':'ja','じゅ':'ju','じょ':'jo',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'てぃ':'ti','でぃ':'di',
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo',
}

const KATAKANA_SHAPE = {
  'ア':'了','イ':'亻','ウ':'宀','エ':'工','オ':'才',
  'カ':'力','キ':'丰','ク':'久','ケ':'个','コ':'口',
  'サ':'卅','シ':'氵','ス':'又','セ':'乜','ソ':'丿',
  'タ':'夕','チ':'千','ツ':'川','テ':'手','ト':'卜',
  'ナ':'十','ニ':'二','ヌ':'又','ネ':'礻','ノ':'丿',
  'ハ':'八','ヒ':'匕','フ':'丷','ヘ':'乛','ホ':'木',
  'マ':'币','ミ':'三','ム':'厶','メ':'乂','モ':'毛',
  'ヤ':'也','ユ':'由','ヨ':'彐',
  'ラ':'乚','リ':'刂','ル':'儿','レ':'乚','ロ':'口',
  'ワ':'冂','ヲ':'一','ン':'冫','ー':'一',
  'ガ':'力゛','ギ':'丰゛','グ':'久゛','ゲ':'个゛','ゴ':'口゛',
  'ザ':'卅゛','ジ':'氵゛','ズ':'又゛','ゼ':'乜゛','ゾ':'丿゛',
  'ダ':'夕゛','ヂ':'千゛','ヅ':'川゛','デ':'手゛','ド':'卜゛',
  'バ':'八゛','ビ':'匕゛','ブ':'丷゛','ベ':'乛゛','ボ':'木゛',
  'パ':'八゜','ピ':'匕゜','プ':'丷゜','ペ':'乛゜','ポ':'木゜',
  'ァ':'了','ィ':'亻','ゥ':'宀','ェ':'工','ォ':'才',
  'ッ':'丿','ャ':'也','ュ':'由','ョ':'彐','ヮ':'冂',
}

const KATAKANA_ROMAJI = {
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n','ー':'-',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po',
  'ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o',
  'ッ':'','ャ':'ya','ュ':'yu','ョ':'yo','ヮ':'wa',
}

const YOON_KATAKANA = {
  'キャ':'kya','キュ':'kyu','キョ':'kyo',
  'ギャ':'gya','ギュ':'gyu','ギョ':'gyo',
  'シャ':'sha','シュ':'shu','ショ':'sho',
  'ジャ':'ja','ジュ':'ju','ジョ':'jo',
  'チャ':'cha','チュ':'chu','チョ':'cho',
  'ニャ':'nya','ニュ':'nyu','ニョ':'nyo',
  'ヒャ':'hya','ヒュ':'hyu','ヒョ':'hyo',
  'ビャ':'bya','ビュ':'byu','ビョ':'byo',
  'ピャ':'pya','ピュ':'pyu','ピョ':'pyo',
  'ミャ':'mya','ミュ':'myu','ミョ':'myo',
  'リャ':'rya','リュ':'ryu','リョ':'ryo',
  'ティ':'ti','ディ':'di',
  'ファ':'fa','フィ':'fi','フェ':'fe','フォ':'fo',
}

const ZY_SPECIAL = [
  { pattern: 'じんてん', replacement: 'jingdian' },
]

const SMALL_H = 'ぁぃぅぇぉっゃゅょゎ'
const SMALL_K = 'ァィゥェォッャュョヮ'
const YOON_SMALL_H = 'ゃゅょぁぃぅぇぉ'
const YOON_SMALL_K = 'ャュョァィゥェォ'

function isHiragana(c) { const v = c.charCodeAt(0); return v >= 0x3040 && v <= 0x309F }
function isKatakana(c) { const v = c.charCodeAt(0); return v >= 0x30A0 && v <= 0x30FF }
function isCJK(c) { const v = c.charCodeAt(0); return (v >= 0x4E00 && v <= 0x9FFF) || (v >= 0x3400 && v <= 0x4DBF) }

function decodeZhouyu(text, shapeMode) {
  let processed = text
  const phs = []
  ZY_SPECIAL.forEach((rule, idx) => {
    const ph = `\x00ZY${idx}\x00`
    processed = processed.replaceAll(rule.pattern, () => { phs.push({ ph, rep: rule.replacement }); return ph })
  })

  const chars = [...processed]
  let result = ''
  let i = 0
  while (i < chars.length) {
    const ch = chars[i]
    const phMatch = phs.find(p => processed.substring(i, i + p.ph.length) === p.ph)
    if (phMatch) { result += phMatch.rep; i += phMatch.ph.length; continue }

    if (isHiragana(ch)) {
      if (i + 1 < chars.length && YOON_SMALL_H.includes(chars[i + 1])) {
        const combo = ch + chars[i + 1]
        if (YOON_HIRAGANA[combo]) { result += YOON_HIRAGANA[combo]; i += 2; continue }
      }
      if (ch === 'っ' && i + 1 < chars.length && isHiragana(chars[i + 1])) {
        const nr = HIRAGANA_ROMAJI[chars[i + 1]]
        if (nr) { result += nr[0] + nr; i += 2; continue }
      }
      result += HIRAGANA_ROMAJI[ch] ?? ch; i++
    } else if (isKatakana(ch)) {
      if (shapeMode) {
        if (i + 1 < chars.length && YOON_SMALL_K.includes(chars[i + 1])) {
          result += (KATAKANA_SHAPE[ch] ?? ch) + (KATAKANA_SHAPE[chars[i + 1]] ?? chars[i + 1])
          i += 2; continue
        }
        if (ch === 'ッ' && i + 1 < chars.length && isKatakana(chars[i + 1])) {
          result += KATAKANA_SHAPE['ッ'] ?? '丿'; i++; continue
        }
        result += KATAKANA_SHAPE[ch] ?? ch; i++
      } else {
        if (i + 1 < chars.length && YOON_SMALL_K.includes(chars[i + 1])) {
          const combo = ch + chars[i + 1]
          if (YOON_KATAKANA[combo]) { result += YOON_KATAKANA[combo]; i += 2; continue }
        }
        if (ch === 'ッ' && i + 1 < chars.length && isKatakana(chars[i + 1])) {
          const nr = KATAKANA_ROMAJI[chars[i + 1]]
          if (nr) { result += nr[0] + nr; i += 2; continue }
        }
        result += KATAKANA_ROMAJI[ch] ?? ch; i++
      }
    } else {
      result += ch; i++
    }
  }
  return result
}

const codecs = {
  base64: {
    encode: t => btoa(unescape(encodeURIComponent(t))),
    decode: t => { try { return decodeURIComponent(escape(atob(t.trim()))) } catch { return '[decode error]' } },
  },
  hex: {
    encode: t => Array.from(new TextEncoder().encode(t)).map(b => b.toString(16).padStart(2,'0')).join(' '),
    decode: t => { try { return new TextDecoder().decode(new Uint8Array(t.trim().split(/\s+/).map(h => parseInt(h,16)))) } catch { return '[decode error]' } },
  },
  binary: {
    encode: t => Array.from(new TextEncoder().encode(t)).map(b => b.toString(2).padStart(8,'0')).join(' '),
    decode: t => { try { return new TextDecoder().decode(new Uint8Array(t.trim().split(/\s+/).map(b => parseInt(b,2)))) } catch { return '[decode error]' } },
  },
  caesar: {
    encode: (t, s) => t.replace(/[a-zA-Z]/g, c => {
      const base = c < 'a' ? 65 : 97
      return String.fromCharCode((c.charCodeAt(0) - base + s) % 26 + base)
    }),
    decode: (t, s) => t.replace(/[a-zA-Z]/g, c => {
      const base = c < 'a' ? 65 : 97
      return String.fromCharCode((c.charCodeAt(0) - base - s + 26) % 26 + base)
    }),
  },
  rot13: {
    encode: t => codecs.caesar.encode(t, 13),
    decode: t => codecs.caesar.decode(t, 13),
  },
  morse: {
    encode: t => t.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' '),
    decode: t => t.trim().split(/\s{2,}|\s*\/\s*/).map(
      word => word.split(/\s+/).map(c => MORSE_REV[c] || c).join('')
    ).join(' '),
  },
  url: {
    encode: t => encodeURIComponent(t),
    decode: t => { try { return decodeURIComponent(t.trim()) } catch { return '[decode error]' } },
  },
  reverse: {
    encode: t => [...t].reverse().join(''),
    decode: t => [...t].reverse().join(''),
  },
  unicode: {
    encode: t => Array.from(t).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0')).join(''),
    decode: t => { try { return t.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h,16))) } catch { return '[decode error]' } },
  },
  zhouyu: {
    encode: t => t,
    decode: (t, _s, shapeMode) => decodeZhouyu(t, shapeMode),
  },
}

const presets = [
  { label: 'Hello from Zhou Yu', codec: 'base64', data: 'SGVsbG8gZnJvbSBaaG91IFl1' },
  { label: 'Secret Morse', codec: 'morse', data: '--. --- --- -..   -- --- .-. -. .. -. --.' },
  { label: 'Hex greeting', codec: 'hex', data: '48 65 6c 6c 6f 20 57 6f 72 6c 64' },
  { label: 'Binary flag', codec: 'binary', data: '01011010 01011001 01000100' },
  { label: 'Caesar shift-3', codec: 'caesar', data: 'Wkh duw ri zdu lv ri ylwdo lpsruwdqfh' },
  { label: 'ROT13 message', codec: 'rot13', data: 'Gur orfg ivpgbel vf gung juvpu erdhverf ab onggyr' },
  { label: 'Reversed wisdom', codec: 'reverse', data: '!ymedaca eht ta ees uoy tahw rebmemeR' },
  { label: '周语 · 示例密信', codec: 'zhouyu', data: 'をじあ　はいし　じんてんで　カエ家族' },
]

let currentCodec = 'base64'
let currentMode = 'decode'

const $input = document.getElementById('input')
const $output = document.getElementById('output')
const $caesarParams = document.getElementById('caesarParams')
const $caesarShift = document.getElementById('caesarShift')
const $zhouyuParams = document.getElementById('zhouyuParams')
const $katakanaShape = document.getElementById('katakanaShape')
const $zyHint = document.getElementById('zyHint')

function updateParamVisibility() {
  $caesarParams.style.display = currentCodec === 'caesar' ? 'flex' : 'none'
  $zhouyuParams.style.display = currentCodec === 'zhouyu' ? 'flex' : 'none'
}

function run() {
  const text = $input.value
  if (!text) { $output.value = ''; return }
  const shift = parseInt($caesarShift.value, 10) || 3
  const shapeMode = $katakanaShape.checked
  if ($zyHint) $zyHint.textContent = shapeMode ? 'shape' : 'romaji'
  const codec = codecs[currentCodec]
  const fn = currentMode === 'decode' ? codec.decode : codec.encode
  if (currentCodec === 'caesar') $output.value = fn(text, shift)
  else if (currentCodec === 'zhouyu') $output.value = fn(text, 0, shapeMode)
  else $output.value = fn(text)
}

document.querySelectorAll('.codec-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.codec-btn.active').classList.remove('active')
    btn.classList.add('active')
    currentCodec = btn.dataset.codec
    updateParamVisibility()
    run()
  })
})

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.mode-btn.active').classList.remove('active')
    btn.classList.add('active')
    currentMode = btn.dataset.mode
    run()
  })
})

$input.addEventListener('input', run)
$caesarShift.addEventListener('input', run)
$katakanaShape.addEventListener('change', run)

document.getElementById('swapBtn').addEventListener('click', () => {
  const tmp = $output.value
  $input.value = tmp
  $output.value = ''
  run()
})

document.getElementById('copyBtn').addEventListener('click', () => {
  if (!$output.value) return
  navigator.clipboard.writeText($output.value).then(() => toast('copied'))
})

const $presetList = document.getElementById('presetList')
presets.forEach(p => {
  const el = document.createElement('div')
  el.className = 'preset-item'
  el.innerHTML = `<span class="preset-label">${p.label}</span><span class="preset-codec">${p.codec}</span>`
  el.addEventListener('click', () => {
    document.querySelector('.codec-btn.active').classList.remove('active')
    document.querySelector(`.codec-btn[data-codec="${p.codec}"]`).classList.add('active')
    currentCodec = p.codec
    updateParamVisibility()

    document.querySelector('.mode-btn.active').classList.remove('active')
    document.querySelector('.mode-btn[data-mode="decode"]').classList.add('active')
    currentMode = 'decode'

    $input.value = p.data
    run()
  })
  $presetList.appendChild(el)
})

let toastTimer
function toast(msg) {
  let el = document.querySelector('.toast')
  if (!el) {
    el = document.createElement('div')
    el.className = 'toast'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('show'), 1400)
}
