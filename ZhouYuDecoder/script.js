const MORSE_MAP = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',
  J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',
  S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  ' ':'/','.'  :'.-.-.-',',':'--..--','?':'..--..',
}
const MORSE_REV = Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v]) => [v, k]))

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
}

const presets = [
  { label: 'Hello from Zhou Yu', codec: 'base64', data: 'SGVsbG8gZnJvbSBaaG91IFl1' },
  { label: 'Secret Morse', codec: 'morse', data: '--. --- --- -..   -- --- .-. -. .. -. --.' },
  { label: 'Hex greeting', codec: 'hex', data: '48 65 6c 6c 6f 20 57 6f 72 6c 64' },
  { label: 'Binary flag', codec: 'binary', data: '01011010 01011001 01000100' },
  { label: 'Caesar shift-3', codec: 'caesar', data: 'Wkh duw ri zdu lv ri ylwdo lpsruwdqfh' },
  { label: 'ROT13 message', codec: 'rot13', data: 'Gur orfg ivpgbel vf gung juvpu erdhverf ab onggyr' },
  { label: 'Reversed wisdom', codec: 'reverse', data: '!ymedaca eht ta ees uoy tahw rebmemeR' },
]

let currentCodec = 'base64'
let currentMode = 'decode'

const $input = document.getElementById('input')
const $output = document.getElementById('output')
const $caesarParams = document.getElementById('caesarParams')
const $caesarShift = document.getElementById('caesarShift')

function run() {
  const text = $input.value
  if (!text) { $output.value = ''; return }
  const shift = parseInt($caesarShift.value, 10) || 3
  const codec = codecs[currentCodec]
  const fn = currentMode === 'decode' ? codec.decode : codec.encode
  $output.value = currentCodec === 'caesar' ? fn(text, shift) : fn(text)
}

document.querySelectorAll('.codec-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.codec-btn.active').classList.remove('active')
    btn.classList.add('active')
    currentCodec = btn.dataset.codec
    $caesarParams.style.display = currentCodec === 'caesar' ? 'flex' : 'none'
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
    $caesarParams.style.display = p.codec === 'caesar' ? 'flex' : 'none'

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
