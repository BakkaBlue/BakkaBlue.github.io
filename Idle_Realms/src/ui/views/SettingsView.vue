<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gameSettings, applyTheme } from '@/ui/services/SettingsState'
import { getSlotIndex, exportSlot, importSlot, deleteSlot } from '@/engine/services/SaveSystem'
import { eventBus } from '@/engine/events/EventBus'

const { locale } = useI18n()

function switchLocale(e: Event) {
  const val = (e.target as HTMLSelectElement).value as 'zh-CN' | 'en-US'
  locale.value = val
  localStorage.setItem('idleRealms_lang', val)
}

const activeTab = ref('general')

// 主题颜色块
const themes = [
  { id: 'default', color: '#e6b566', label: '暗金' },
  { id: 'forest',  color: '#66bb6a', label: '翠绿' },
  { id: 'magic',   color: '#b968e0', label: '暗紫' },
]

function setTheme(id: string) {
  gameSettings.personalize.theme = id as any
  applyTheme()
}

function setFontSize(size: number) {
  gameSettings.personalize.fontSize = size
  applyTheme()
}

// 存档导出
function onExport(slotId: number) {
  const code = exportSlot(slotId)
  if (code) {
    navigator.clipboard?.writeText(code)
    eventBus.emit('toast', { message: '存档码已复制到剪贴板', type: 'success' })
  }
}

function onImport() {
  const code = importCode.value.trim()
  if (!code) { eventBus.emit('toast', { message: '请输入存档码', type: 'danger' }); return }
  const ok = importSlot(0, code)
  if (ok) {
    eventBus.emit('toast', { message: '导入成功！请重新进入游戏', type: 'success' })
    importCode.value = ''
  } else {
    eventBus.emit('toast', { message: '存档码格式错误！', type: 'danger' })
  }
}

function onDeleteSlot(slotId: number) {
  if (!confirm(`确定删除存档 ${slotId + 1} 吗？`)) return
  deleteSlot(slotId)
  eventBus.emit('toast', { message: `存档 ${slotId + 1} 已删除`, type: 'danger' })
}

function onResetAll() {
  if (!confirm('警告！这将清除所有游戏数据！确定继续吗？')) return
  if (!confirm('再次确认：真的要失去一切吗？')) return
  localStorage.clear()
  location.reload()
}

const importCode = ref('')
const slotIndex = computed(() => getSlotIndex())
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <div class="page-title">设置中心</div>
      <div class="page-sub">管理游戏行为、外观和数据</div>
    </div>

    <!-- 标签导航 -->
    <div class="tab-bar">
      <button :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
        <i class="fa-solid fa-sliders"></i> 通用
      </button>
      <button :class="{ active: activeTab === 'personalize' }" @click="activeTab = 'personalize'">
        <i class="fa-solid fa-palette"></i> 个性化
      </button>
      <button :class="{ active: activeTab === 'player' }" @click="activeTab = 'player'">
        <i class="fa-solid fa-user-gear"></i> 玩家
      </button>
      <button :class="{ active: activeTab === 'saves' }" @click="activeTab = 'saves'">
        <i class="fa-solid fa-floppy-disk"></i> 存档管理
      </button>
    </div>

    <!-- === 通用设置 === -->
    <div v-if="activeTab === 'general'" class="tab-content">
      <div class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <h4>自动保存</h4>
            <p>游戏将在后台自动保存进度，防止数据丢失。</p>
          </div>
          <div class="toggle" :class="{ on: gameSettings.general.autoSave }" @click="gameSettings.general.autoSave = !gameSettings.general.autoSave"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h4>自动保存频率</h4>
            <p>设置自动保存的间隔时间。</p>
          </div>
          <select v-model.number="gameSettings.general.autoSaveInterval">
            <option :value="30">30 秒</option>
            <option :value="60">60 秒</option>
            <option :value="120">2 分钟</option>
            <option :value="300">5 分钟</option>
          </select>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h4>显示右侧信息栏</h4>
            <p>控制右侧当前活动和日志面板的显示与隐藏。</p>
          </div>
          <div class="toggle" :class="{ on: gameSettings.general.showRightPanel }" @click="gameSettings.general.showRightPanel = !gameSettings.general.showRightPanel"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h4>减少动态效果</h4>
            <p>关闭所有 CSS 动画和过渡特效，适合低端设备或省电模式。</p>
          </div>
          <div class="toggle" :class="{ on: gameSettings.general.reduceMotion }" @click="gameSettings.general.reduceMotion = !gameSettings.general.reduceMotion"></div>
        </div>
      </div>
    </div>

    <!-- === 个性化 === -->
    <div v-if="activeTab === 'personalize'" class="tab-content">
      <div class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <h4>界面主题</h4>
            <p>选择你喜欢的配色方案。</p>
          </div>
          <div class="theme-selector">
            <div
              v-for="t in themes" :key="t.id"
              class="theme-opt"
              :class="{ active: gameSettings.personalize.theme === t.id }"
              :style="{ background: t.color }"
              @click="setTheme(t.id)"
              :title="t.label"
            ></div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h4>字体大小</h4>
            <p>调整游戏全局文字的基准大小。</p>
          </div>
          <select :value="gameSettings.personalize.fontSize" @change="setFontSize(Number(($event.target as HTMLSelectElement).value))">
            <option :value="12">小</option>
            <option :value="14">中 (默认)</option>
            <option :value="16">大</option>
          </select>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h4>语言 / Language</h4>
            <p>切换界面显示语言。</p>
          </div>
          <select :value="locale" @change="switchLocale">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>
    </div>

    <!-- === 玩家设置 === -->
    <div v-if="activeTab === 'player'" class="tab-content">
      <div class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <h4>角色名称</h4>
            <p>修改你在游戏中的称呼。</p>
          </div>
          <input type="text" v-model="gameSettings.player.name" maxlength="12" />
        </div>
      </div>
      <div class="setting-card">
        <h4 style="margin-bottom:16px;color:var(--gold-hi)">数据管理</h4>
        <div class="setting-row">
          <div class="setting-info">
            <h4>导出存档码</h4>
            <p>将当前存档编码为一串文本，可跨设备转移。</p>
          </div>
          <button class="btn" @click="onExport(0)"><i class="fa-solid fa-file-export"></i> 生成码</button>
        </div>
        <div class="setting-row col">
          <div class="setting-info" style="width:100%">
            <h4>导入存档码</h4>
            <p>粘贴存档码以覆盖当前数据。<strong style="color:var(--danger)">警告：将清除当前进度！</strong></p>
          </div>
          <textarea v-model="importCode" placeholder="在此粘贴存档码..."></textarea>
          <button class="btn btn-danger" @click="onImport"><i class="fa-solid fa-file-import"></i> 确认导入</button>
        </div>
      </div>
    </div>

    <!-- === 存档管理 === -->
    <div v-if="activeTab === 'saves'" class="tab-content">
      <div
        v-for="i in 3" :key="i"
        class="slot-item"
      >
        <div class="slot-info">
          <h4>存档 {{ i }}: {{ slotIndex.find(s => s.id === i - 1)?.name ?? '空闲' }}</h4>
          <p v-if="slotIndex.find(s => s.id === i - 1)">
            总等级 {{ slotIndex.find(s => s.id === i - 1)!.totalLevel }} ·
            最后保存: {{ new Date(slotIndex.find(s => s.id === i - 1)!.lastSave).toLocaleString('zh-CN') }}
          </p>
          <p v-else>空闲槽位</p>
        </div>
        <div class="slot-actions">
          <button v-if="slotIndex.find(s => s.id === i - 1)" class="btn" @click="onExport(i - 1)">复制存档码</button>
          <button v-if="slotIndex.find(s => s.id === i - 1)" class="btn btn-danger" @click="onDeleteSlot(i - 1)"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div class="setting-card danger-card">
        <div class="setting-row" style="border:none">
          <div class="setting-info">
            <h4 style="color:var(--danger)">重置全部数据</h4>
            <p>清空所有存档和设置，将游戏恢复到初始状态。此操作不可撤销！</p>
          </div>
          <button class="btn btn-danger" @click="onResetAll"><i class="fa-solid fa-skull-crossbones"></i> 一键核平</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view { animation: fadeIn 0.2s ease; max-width: 700px; }

.page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.page-title { font-family: var(--font-title); font-size: 28px; font-weight: 700; color: var(--gold-hi); margin-bottom: 4px; }
.page-sub { color: var(--text-dim); font-size: 13px; }

/* 标签栏 */
.tab-bar { display: flex; gap: 4px; margin-bottom: 20px; }
.tab-bar button {
  padding: 10px 18px; background: var(--bg-card); border: 1px solid var(--border);
  color: var(--text-dim); border-radius: 8px; cursor: pointer; font-size: 13px;
  display: flex; align-items: center; gap: 6px; transition: all 0.15s; font-family: var(--font-body);
}
.tab-bar button:hover { border-color: var(--border-hi); color: var(--text); }
.tab-bar button.active { background: var(--bg-card-hi); border-color: var(--gold); color: var(--gold-hi); }

.tab-content { animation: fadeIn 0.2s ease; }

/* 设置卡片 */
.setting-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.danger-card { border-color: var(--danger); }

.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
.setting-row:last-child { border-bottom: none; }
.setting-row.col { flex-direction: column; align-items: flex-start; gap: 8px; }

.setting-info h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.setting-info p { font-size: 12px; color: var(--text-dim); max-width: 400px; }

/* 开关 */
.toggle { position: relative; width: 44px; height: 24px; background: var(--bg-deep); border: 1px solid var(--border-hi); border-radius: 12px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.toggle.on { background: var(--gold-dim); border-color: var(--gold); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: var(--text-dim); border-radius: 50%; transition: all 0.2s; }
.toggle.on::after { left: 22px; background: #1a1410; }

/* 主题选择器 */
.theme-selector { display: flex; gap: 10px; }
.theme-opt { width: 48px; height: 36px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; }
.theme-opt.active { border-color: var(--gold-hi); box-shadow: 0 0 10px rgba(230,181,102,0.3); transform: scale(1.1); }

/* 表单 */
select, input[type="text"], textarea {
  background: var(--bg-deep); border: 1px solid var(--border-hi); color: var(--text);
  padding: 8px 12px; border-radius: 6px; font-family: var(--font-body); font-size: 13px; outline: none;
}
select:focus, input:focus, textarea:focus { border-color: var(--gold); }
textarea { width: 100%; min-height: 80px; resize: vertical; }

/* 存档槽 */
.slot-item { background: var(--bg-card-hi); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
.slot-info h4 { font-size: 15px; color: var(--gold); margin-bottom: 4px; }
.slot-info p { font-size: 12px; color: var(--text-dim); }
.slot-actions { display: flex; gap: 8px; }

/* 按钮 */
.btn { padding: 8px 16px; background: var(--bg-card-hi); border: 1px solid var(--border-hi); color: var(--text); border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-body); white-space: nowrap; }
.btn:hover { border-color: var(--gold-dim); }
.btn-danger { background: transparent; border-color: var(--danger); color: var(--danger); }
.btn-danger:hover { background: var(--danger); color: white; }
</style>
