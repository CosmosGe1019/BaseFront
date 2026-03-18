<template>
  <div class="flex h-full flex-1 min-h-0">
    <!-- 侧边栏：知识库列表 -->
    <aside
      class="w-[260px] border-r border-gray-300 shadow-sm flex-shrink-0 flex flex-col theme-aside"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-300">
        <span class="font-bold text-base text-gray-800">知识库</span>
        <button
          class="bg-[var(--theme-main)] cursor-target text-white hover:bg-[var(--theme-button-hover)] px-5 py-2 rounded text-sm font-medium shadow"
          @click="showCreateModal = true"
          title="新建知识库"
        >
          + 新建知识库
        </button>
      </div>
      <div class="flex-1 overflow-y-auto">
        <!-- 知识库列表（动态渲染） -->
        <ul class="py-2">
          <li
            v-for="item in knowledgeList"
            :key="item.uuid"
            @click="selectKnowledge(item.uuid)"
            :class="[
              'px-4 mt-2 cursor-target py-2 flex flex-col gap-1 cursor-pointer rounded font-medium transition-colors duration-150 group',
              selectedKnowledge === item.uuid
                ? 'bg-[var(--theme-select-button)] text-black'
                : 'hover:bg-white/50 text-black',
            ]"
          >
            <div class="flex items-center min-w-0 w-full">
              <div
                class="flex items-center flex-1 min-w-0 cursor-pointer" 
              >
                <span
                  class="flex items-center justify-center w-6 h-6 rounded mr-2"
                  :class="
                    selectedKnowledge === item.uuid
                      ? 'bg-[var(--theme-select-button)]'
                      : 'theme-aside hover:bg-white/50'
                  "
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16v16H4z" fill="#e5e7eb" />
                    <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h7v2H7z" fill="#60a5fa" />
                  </svg>
                </span>
                <span class="truncate">{{ item.name }}</span>
              </div>
              <div class="flex items-center gap-1 ml-auto">
                <button
                  class="p-1 rounded hover:bg-white/50 cursor-target transition-colors duration-150"
                  @click.stop="openEditDesc(item)"
                  title="编辑简介"
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
                <button
                  class="p-1 rounded hover:bg-red-300 transition-colors cursor-target duration-150 text-red-500 hover:text-red-700"
                  @click.stop="confirmDeleteKnowledge(item)"
                >
                  <svg
                    width="23"
                    height="23"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                    />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="pl-8 text-xs text-gray-500 truncate max-w-full min-h-[18px]">
              {{ item.description || '暂无简介' }}
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 p-8 overflow-auto bg-[var(--theme-body)]">
      <div class="flex justify-between mb-6">
        <button
          class="bg-[var(--theme-main)] cursor-target hover:bg-[var(--theme-button-hover)] px-5 py-2 rounded text-sm font-medium shadow"
          @click="showUpload"
        >
          <span class="text-white">+ 新增文件</span>
        </button>
      </div>
      <div
        class="rounded-2xl shadow-lg border border-gray-200 overflow-x-auto"
      >
        <a-table
          :columns="tableColumns"
  :data-source="pagedFiles"
  :pagination="tablePagination"
  :row-key="(record) => record.uid || record.fullName || record.name + (record.ext ? '.' + record.ext : '')"
  :loading="false"
  :scroll="{ y: 600 }"
  class="custom-table-center"
  :rowClassName="() => ''"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="record.__empty">
              <div style="height: 32px"></div>
            </template>
            <template v-else-if="column.dataIndex === 'name'">
              <div class="flex items-center justify-center gap-2 min-h-[32px] h-full">
                <span class="flex items-center justify-center w-7 h-7 bg-gray-100 rounded shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="2" fill="#f3f4f6" />
                    <text
                      x="4"
                      y="16"
                      font-size="10"
                      fill="#1677ff"
                      font-weight="bold"
                      alignment-baseline="middle"
                      dominant-baseline="middle"
                    >
                      {{ getFileTypeLabel(record.ext) }}
                    </text>
                  </svg>
                </span>
                <a
                  href="#"
                  class="text-blue-600 hover:underline truncate max-w-[180px] block leading-[32px] text-center"
                  >{{ record.fullName || record.name + (record.ext ? '.' + record.ext : '') }}</a
                >
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'chunkCount'">
              <div class="flex items-center justify-center h-full">
                {{ record.chunkCount || 1 }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'uploadDate'">
              <div class="flex items-center justify-center h-full">
                {{ record.uploadDate || '' }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div class="flex items-center justify-center h-full">
                <template v-if="uploadProgressMap[record.uid] !== undefined && uploadProgressMap[record.uid] < 100">
                  <a-progress :percent="uploadProgressMap[record.uid]" size="small" style="width:60px;" :show-info="false" />
                </template>
                <template v-else>
                  <button
                    class="flex items-center justify-center mx-auto text-gray-500 hover:text-red-600 transition"
                    @click="confirmDeleteFile(record)"
                  >
                    <svg
                      t="1753951689098"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="5076"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M874.011741 138.270167v746.665215c0 29.35461-12.003532 57.457666-33.336825 78.22207A115.455776 115.455776 0 0 1 760.234184 995.555611h-511.999004c-30.179497 0-59.135885-11.6622-80.469177-32.398159a109.084232 109.084232 0 0 1-33.30838-78.22207V138.270167h739.554118z m-85.333168 82.972283h-568.887783V884.906937c0 7.338652 2.986661 14.364417 8.305762 19.56974 5.347545 5.176879 12.57242 8.078207 20.138628 8.078206h511.999004c7.537763 0 14.791082-2.901328 20.110183-8.078206a27.278169 27.278169 0 0 0 8.334206-19.56974V221.24245z m-383.999253 580.720648c-23.580399 0-42.666584-18.545742-42.666584-41.471919V428.658935c0-22.897733 19.086185-41.471919 42.666584-41.471919 23.551954 0 42.666584 18.574186 42.666583 41.471919v331.860688c0 22.926178-19.114629 41.471919-42.666583 41.47192z m199.110724 0c-23.580399 0-42.666584-18.545742-42.666584-41.471919V428.658935c0-22.897733 19.086185-41.471919 42.666584-41.471919 23.551954 0 42.666584 18.574186 42.666583 41.471919v331.860688c0 22.926178-19.114629 41.471919-42.666583 41.47192z m355.554864-580.720648h-910.220452c-23.580399 0-42.666584-18.574186-42.666584-41.500364 0-22.897733 19.086185-41.471919 42.666584-41.471919h910.220452c23.551954 0 42.666584 18.574186 42.666584 41.471919 0 22.926178-19.114629 41.500364-42.666584 41.500364z m-331.377133-138.268176l7.111097 55.295893h-261.68838l7.111097-55.295893h247.466186zM652.998837 0.001991h-297.52831c-28.842611-0.227555-53.304785 20.565293-56.888779 48.383906l-21.902179 172.856553h455.110226l-22.186624-172.856553c-3.612437-27.818613-28.074612-48.611461-56.888778-48.355462h0.284444z"
                        fill="#d81e06"
                        p-id="5077"
                      ></path>
                    </svg>
                  </button>
                </template>
              </div>
            </template>
          </template>
        </a-table>
      </div>
      <!-- 上传文件弹窗 -->
      <a-modal
        v-model:open="showUploadModal"
        title="上传文件"
        :ok-button-props="{ disabled: !uploadFileList.length }"
        @cancel="resetUpload"
        @ok="handleUploadOk"
        ok-text="确定"
        cancel-text="取消"
      >
        <a-upload-dragger
          :before-upload="beforeUpload"
          :file-list="(uploadFileList as any)"
          :multiple="false"
          :show-upload-list="true"
          :custom-request="dummyRequest"
          @remove="handleRemove"
          class="w-full dragger-large cursor-target"
        >
          <div
            style="
              height: 180px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <div style="font-size: 22px; color: #1677ff; margin-bottom: 12px">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="8" fill="#e6f4ff" />
                <path
                  d="M24 12v18M24 30l-6-6m6 6l6-6"
                  stroke="#1677ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect x="12" y="36" width="24" height="2" rx="1" fill="#1677ff" />
              </svg>
            </div>
            <div style="font-size: 16px; color: #333">点击或拖拽文件到此区域上传</div>
            <div style="font-size: 13px; color: #888; margin-top: 8px">
              仅支持上传 txt、json、csv、xml、md 文件，且一次只能拖动一个文件，上传文件不能为空
            </div>
          </div>
        </a-upload-dragger>
      </a-modal>
      <!-- 二次确认弹窗（删除文件） -->
      <div
        v-if="showDeleteFileModal"
        class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded shadow-lg p-6 w-80">
          <div class="font-bold text-lg mb-4">确认删除</div>
          <div class="mb-4 text-gray-700">
            确定要删除文件
            <span class="text-red-600 font-bold">{{ deleteFileTarget?.name }}</span>
            吗？此操作不可恢复。
          </div>
          <div class="flex justify-end gap-2">
            <button class="px-4 py-1 rounded cursor-target border" @click="showDeleteFileModal = false">
              取消
            </button>
            <button class="px-4 py-1 rounded cursor-target bg-red-600 text-white" @click="handleDeleteFile">
              删除
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 新建知识库弹窗 -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-80">
        <div class="font-bold text-lg mb-4">新建知识库</div>
        <input
          v-model="newKnowledgeName"
          class="border rounded px-3 py-2 w-full mb-2"
          placeholder="请输入知识库名称"
          maxlength="15"
        />
        <input
          v-model="newKnowledgeDesc"
          class="border rounded px-3 py-2 w-full mb-4"
          placeholder="请输入简介（最多15字）"
          maxlength="15"
        />
        <div class="flex justify-end gap-2">
          <button class="px-4 py-1 rounded border" @click="showCreateModal = false">取消</button>
          <button
            class="px-4 py-1 rounded border"
            :disabled="!newKnowledgeName.trim()"
            @click="handleCreate"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑简介弹窗 -->
    <div
      v-if="showEditDescModal"
      class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-80">
        <div class="font-bold text-lg mb-4">编辑简介</div>
        <input
          v-model="editDescValue"
          class="border cursor-target rounded px-3 py-2 w-full mb-4"
          placeholder="请输入简介（最多15字）"
          maxlength="15"
        />
        <div class="flex justify-end gap-2">
          <button class="px-4 py-1 cursor-target rounded border" @click="showEditDescModal = false">取消</button>
          <button
            class="px-4 cursor-target py-1 rounded border"
            :disabled="!editDescValue.trim()"
            @click="saveEditDesc"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 二次确认弹窗（删除知识库） -->
    <div
      v-if="showDeleteKnowledgeModal"
      class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-80">
        <div class="font-bold text-lg mb-4">确认删除知识库</div>
        <div class="mb-4 text-gray-700">
          确定要删除知识库
          <span class="text-red-600 font-bold">{{ deleteKnowledgeTarget?.name }}</span>
          吗？此操作不可恢复。
        </div>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-1 rounded cursor-target border" @click="cancelDeleteKnowledge">取消</button>
          <button class="px-4 py-1 rounded cursor-target bg-red-600 text-white" @click="handleDeleteKnowledge">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
// 上传进度状态
const uploadProgressMap = ref({}) // { [fileUid]: percent }
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/index.js' // 按需引入 message 组件样式
import { useKnowledgeStore } from '@/stores/konwledge'
import http from '@/api/http'
// 新增知识库简介相关
const newKnowledgeDesc = ref('')
const showEditDescModal = ref(false)
const editDescValue = ref('')
const editDescTarget = ref(null)

// 上传进度状态

let showUploadModal = computed({
  get: () => knowledgeStore.showUploadModal,
  set: (v) => knowledgeStore.setShowUploadModal(v),
})
function showUpload(){
  if (!knowledgeStore.selectedKnowledge) {
    message.warning('请先新建或选择一个知识库')
    return
  }
  showUploadModal.value = true
}

// 日期格式化函数

import router from '@/router'


// 让uploadProgressMap在模板可用
defineExpose({ uploadProgressMap })

function openEditDesc(item) {
  editDescTarget.value = item
  editDescValue.value = item.description || ''
  showEditDescModal.value = true
}

function saveEditDesc() {
  if (!editDescTarget.value) return
  const idx = knowledgeStore.knowledges.findIndex((k) => k.name === editDescTarget.value.name)
  if (idx !== -1) {
    knowledgeStore.knowledges[idx].description = editDescValue.value.slice(0, 15)
  }
  showEditDescModal.value = false
}

// 知识库删除相关
const showDeleteKnowledgeModal = ref(false)
const deleteKnowledgeTarget = ref(null)

function confirmDeleteKnowledge(item) {
  deleteKnowledgeTarget.value = item
  showDeleteKnowledgeModal.value = true
}

function handleDeleteKnowledge() {
  if (deleteKnowledgeTarget.value) {
    knowledgeStore.deleteKnowledge(deleteKnowledgeTarget.value)
    showDeleteKnowledgeModal.value = false
    deleteKnowledgeTarget.value = null
  }
}

function cancelDeleteKnowledge() {
  showDeleteKnowledgeModal.value = false
  deleteKnowledgeTarget.value = null
}

// 文件类型标签映射
const typeMap = {
  txt: 'TXT',
  doc: 'DOC',
  docx: 'DOCX',
  xls: 'XLS',
  xlsx: 'XLSX',
  csv: 'CSV',
  ppt: 'PPT',
  pptx: 'PPTX',
  png: 'PNG',
  jpg: 'JPG',
  jpeg: 'JPG',
  gif: 'GIF',
  zip: 'ZIP',
  rar: 'RAR',
  md: 'MD',
  lnk: 'LNK',
  json: 'JSON',
  xml: 'XML',
  mp3: 'MP3',
  mp4: 'MP4',
  wav: 'WAV',
  avi: 'AVI',
  other: 'FILE',
}

const knowledgeStore = useKnowledgeStore()

const filteredFiles = computed(() => {
  if (
    !knowledgeStore.selectedKnowledge ||
    !knowledgeStore.knowledgeFiles[knowledgeStore.selectedKnowledge]
  )
    return []
  const files = knowledgeStore.knowledgeFiles[knowledgeStore.selectedKnowledge]
  if (!knowledgeStore.searchKeyword.trim()) return files
  return files.filter((f) =>
    (f.fullName || f.name + (f.ext ? '.' + f.ext : ''))
      .toLowerCase()
      .includes(knowledgeStore.searchKeyword.trim().toLowerCase()),
  )
})

function getFileTypeLabel(ext) {
  if (!ext) return 'FILE'
  const key = ext.toLowerCase()
  return typeMap[key] || ext.toUpperCase().slice(0, 6)
}


const uploadFileList = computed({
  get: () => knowledgeStore.uploadFileList,
  set: (v) => knowledgeStore.setUploadFileList(v),
})

function beforeUpload(file, fileList) {
  console.log('beforeUpload', file, fileList)
  const allowedTypes = ['txt', 'json', 'csv', 'xml', 'md']
  const ext = file.name.split('.').pop().toLowerCase()
  if (!allowedTypes.includes(ext)) {
    message.warning('仅支持上传 txt、json、csv、xml、md 文件')
    return false
  }
  if (fileList && fileList.length > 1) {
    message.warning('不支持拖拽多个文件，请逐个拖拽或点击选择多个文件')
    return false
  }
  knowledgeStore.addFile(file)
  return false
}

function handleRemove(file) {
  knowledgeStore.removeFile(file)
}

function dummyRequest(options: any) {
  const onSuccess = options?.onSuccess
  setTimeout(() => {
    onSuccess && onSuccess()
  }, 100)
}

async function handleUploadOk() {
  if (!knowledgeStore.selectedKnowledge) {
    message.warning('请先选择一个知识库')
    return
  }
  if (!knowledgeStore.uploadFileList.length) {
    message.warning('请先选择文件')
    return
  }
  message.success('开始上传,请稍等...', 0)
  try {
    await knowledgeStore.addFilesToKnowledge()
    knowledgeStore.setShowUploadModal(false)
    knowledgeStore.setUploadFileList([])
    message.success('上传成功')
    setTimeout(() => {
      router.go(0)
    }, 900)
  } catch (e: any) {
    message.error(e?.message || '上传失败，请稍后重试')
  }
}

function resetUpload() {
  knowledgeStore.setShowUploadModal(false)
  knowledgeStore.setUploadFileList([])
}

const showCreateModal = computed({
  get: () => knowledgeStore.showCreateModal,
  set: (v) => knowledgeStore.setShowCreateModal(v),
})
const newKnowledgeName = computed({
  get: () => knowledgeStore.newKnowledgeName,
  set: (v) => knowledgeStore.setNewKnowledgeName(v),
})
const knowledgeList = computed(() => knowledgeStore.knowledges)
const selectedKnowledge = computed({
  get: () => knowledgeStore.selectedKnowledge,
  set: (v) => knowledgeStore.setSelectedKnowledge(v),
})

async function selectKnowledge(uuid) {
  await knowledgeStore.setSelectedKnowledge(uuid)
  console.log('selectKnowledge', uuid)
  knowledgeStore.removeKnowledgeFile(uuid)
  await http
      .listFilesByNamespace(1, 20, uuid)
      .then((res) => {
        if (res) {
          if (Array.isArray(res)) {
            res.forEach((file) => {
              knowledgeStore.addKnowledgeFile(uuid, {
                name: file.name,
                uuid: file.uuid,
                chunkCount: file.slice_count,
                uploadDate: file.update_time,
              })
            })
          } else {
            if (res.uuid) {
              knowledgeStore.addKnowledgeFile(uuid, {
                uuid: res.uuid,
                name: res.name,
              })
            }
          }
        } else {
          console.log('加载知识库文件列表为空')
        }
      })
      .catch((err) => {
        console.error('加载知识库文件列表失败:', err)
        message.error('加载知识库文件列表失败，请稍后重试')
      })
}

const showDeleteFileModal = computed({
  get: () => knowledgeStore.showDeleteFileModal,
  set: (v) => knowledgeStore.setShowDeleteFileModal(v),
})
const deleteFileTarget = computed({
  get: () => knowledgeStore.deleteFileTarget,
  set: (v) => knowledgeStore.setDeleteFileTarget(v),
})

function confirmDeleteFile(file) {
  knowledgeStore.setDeleteFileTarget(file)
  knowledgeStore.setShowDeleteFileModal(true)
}

async function handleDeleteFile() {
  const hide = message.loading('正在删除文件...', 0)
  try {
    await knowledgeStore.deleteFileFromKnowledge()
    message.success('删除成功')
    knowledgeStore.setShowDeleteFileModal(false)
    knowledgeStore.setDeleteFileTarget(null)
  } catch (e: any) {
    message.error(e?.message || '删除失败，请稍后重试')
  } finally {
    hide && hide()
  }
}

function handleCreate() {
  if (!newKnowledgeName.value.trim()) return
  if (newKnowledgeDesc.value.length > 15) {
    message.warning('简介不能超过15字')
    return
  }
  console.log('创建知识库', newKnowledgeName.value, newKnowledgeDesc.value)
  knowledgeStore.createKnowledge(newKnowledgeDesc.value.slice(0, 15))
  newKnowledgeDesc.value = ''
}

const tableColumns: any = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 220, align: 'center' },
  { title: '分块数', dataIndex: 'chunkCount', key: 'chunkCount', width: 100, align: 'center' },
  { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate', width: 160, align: 'center' },
  { title: '操作', dataIndex: 'action', key: 'action', width: 80, align: 'center' },
]

const tableCurrent = ref(1)
const tablePageSize = ref(9)
const tablePagination = computed(() => ({
  total: filteredFiles.value.length,
  current: tableCurrent.value,
  pageSize: 9,
  showSizeChanger: false,
  showQuickJumper: true,
  onChange: (page) => {
    tableCurrent.value = page
  },
}))
const pagedFiles = computed<any[]>(() => {
  const start = (tableCurrent.value - 1) * tablePageSize.value
  const pageData: any[] = filteredFiles.value.slice(start, start + tablePageSize.value).map((f: any) => ({
    ...f,
    uid: f.uid || f.uuid,
  }))
  // 保证每页都渲染 pageSize 行（空行用 __empty 标记）
  const emptyCount = tablePageSize.value - pageData.length
  if (emptyCount > 0) {
    for (let i = 0; i < emptyCount; i++) {
      pageData.push({ __empty: true, uid: `empty-row-${i}` })
    }
  }
  return pageData
})

onMounted(async () => {
  const prevent = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  window.addEventListener('dragover', prevent)
  window.addEventListener('drop', prevent)
  ;(window as any)._dragPrevent = prevent
  await http
    .listNamespace(1, 20)
    .then(async (res) => {
      const filteredData = res
        .filter((a) => a.uuid !== '')
        .map((item) => ({
          uuid: item.uuid,
          name: item.name,
          description: item.description || '',
        })).reverse()
      await knowledgeStore.setKnowledgeList(filteredData)
    })
    .catch((err) => {
      console.error('加载知识库列表失败:', err)
      message.error('加载知识库列表失败，请稍后重试')
    })
  if (knowledgeStore.knowledges.length > 0) {
    
    await selectKnowledge(knowledgeStore.knowledges[0].uuid)
    console.log('selectKnowledge', knowledgeStore.knowledges[0].uuid)
  }
})
onBeforeUnmount(() => {
  const dp = (window as any)._dragPrevent
  if (dp) {
    window.removeEventListener('dragover', dp)
    window.removeEventListener('drop', dp)
    delete (window as any)._dragPrevent
  }
})
</script>
<style scoped>
/* 在 KnowledgeHome.vue 里 style scoped 下添加 */
::v-deep(.ant-table-body) {
  min-height: 550px;
  background: var(--theme-div) !important;
}

::v-deep(.ant-table-thead > tr > th) {
  background: var(--theme-select-button) !important;
  color: var(--theme-text, #222) !important;
}

.custom-table-center .ant-table-thead > tr > th,
.custom-table-center .ant-table-tbody > tr > td {
  text-align: center !important;
  border-right: 1px solid #e5e7eb;
}

.custom-table-center .ant-table-thead > tr > th:last-child,
.custom-table-center .ant-table-tbody > tr > td:last-child {
  border-right: none;
}

::v-deep(.ant-table-tbody > tr > td) {
  background: var(--theme-div)  !important;
  transition: background 0s !important;
}



::v-deep(.ant-table-tbody > tr:hover > td),
::v-deep(.ant-table-tbody > tr.ant-table-row-selected > td),
::v-deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td) {
  background: var(--theme-div)  !important;
  transition: background 0s !important;
}

::v-deep(.ant-pagination) {
  /* 分页整体背景色和外边距区域 */
  background: var(--theme-div) !important;
  padding: 12px 0 12px 0;
  margin: 0 !important;
  box-shadow: none !important;
}

::v-deep(.ant-pagination),
::v-deep(.ant-pagination > li),
::v-deep(.ant-pagination > li > button),
::v-deep(.ant-pagination-item),
::v-deep(.ant-pagination-prev),
::v-deep(.ant-pagination-next),
::v-deep(.ant-pagination-jump-prev),
::v-deep(.ant-pagination-jump-next) {
  background: var(--theme-div) !important;
}

/* 彻底消除 hover/选中/取消选中时的白色闪烁 */
/* 保持表格 hover/选中背景与整体一致，避免闪白 */
</style>
