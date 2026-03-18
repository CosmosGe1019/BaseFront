import { defineStore } from 'pinia'
import http from '../api/http'
import router from '../router'
let messageInstance: any = null
try {
  // 兼容全局message挂载和动态引入
  // @ts-ignore
  messageInstance = (window && window.$message) ? window.$message : require('ant-design-vue').message
} catch (e) {
  // SSR等场景下不处理
}

export interface KnowledgeFile {
  uuid: string
  name: string
  ext?: string
  fullName?: string
  chunkCount?: number
  uploadDate?: string

  [key: string]: any
}

export interface KnowledgeItem {
  name: string
  uuid: string
  description?: string
}

export interface KnowledgeState {
  knowledges: KnowledgeItem[]
  showUploadModal: boolean
  uploadFileList: any[]
  selectedKnowledge: string
  knowledgeFiles: Record<string, KnowledgeFile[]>
  showCreateModal: boolean
  newKnowledgeName: string
  searchKeyword: string
  showDeleteFileModal: boolean
  deleteFileTarget: KnowledgeFile | null
}

export const useKnowledgeStore = defineStore('knowledge', {
  state: (): KnowledgeState => ({
    knowledges: [],
    showUploadModal: false,
    uploadFileList: [],
    selectedKnowledge: '',
    knowledgeFiles: {},
    showCreateModal: false,
    newKnowledgeName: '',
    searchKeyword: '',
    showDeleteFileModal: false,
    deleteFileTarget: null,
  }),
  getters: {
    getUploadFileList: (state) => state.uploadFileList,
    getKnowledges: (state) => state.knowledges,
  },
  actions: {
    // 删除知识库
    async deleteKnowledge(item: KnowledgeItem) {
      // 删除知识库本身
      await http
        .deleteNamespace(item.uuid)
        .then(() => {
          console.log('删除知识库成功', item.name)
        })
        .catch((err) => {
          console.error('删除知识库失败:', err)
          alert('删除知识库失败，请稍后重试')
        })
      this.knowledges = this.knowledges.filter((k) => k.name !== item.name)
      // 删除对应的文件记录
      if (this.knowledgeFiles[item.name]) {
        delete this.knowledgeFiles[item.name]
      }
      // 如果当前选中被删，重置选中
      if (this.selectedKnowledge === item.name) {
        this.selectedKnowledge = this.knowledges.length > 0 ? this.knowledges[0].name : ''
      }
      router.go(0)
    },
    setSearchKeyword(val: string) {
      this.searchKeyword = val
    },
    setShowUploadModal(val: boolean) {
      this.showUploadModal = val
    },
    setUploadFileList(val: any[]) {
      this.uploadFileList = val
    },
    setShowCreateModal(val: boolean) {
      this.showCreateModal = val
    },
    setNewKnowledgeName(val: string) {
      this.newKnowledgeName = val
    },
    setSelectedKnowledge(val: string) {
      this.selectedKnowledge = val
    },
    setShowDeleteFileModal(val: boolean) {
      this.showDeleteFileModal = val
    },
    setDeleteFileTarget(val: KnowledgeFile | null) {
      this.deleteFileTarget = val
    },
    addFile(file: any) {
      this.uploadFileList.push(file)
    },
    addKnowledgeFile(uuid: string, file: KnowledgeFile) {
      if (!this.knowledgeFiles[uuid]) {
        this.knowledgeFiles[uuid] = []
      }
      this.knowledgeFiles[uuid].push(file)
    },
    removeFile(file: any) {
      const targetUid = file?.uid ?? file?.name
      this.uploadFileList = this.uploadFileList.filter((f: any) => (f?.uid ?? f?.name) !== targetUid)
    },
   async addFilesToKnowledge() {
  if (!this.selectedKnowledge) return
  
  this.knowledgeFiles[this.selectedKnowledge] =
    this.knowledgeFiles[this.selectedKnowledge] || []
  
  // 使用 Promise.all 等待所有上传操作完成
  try {
    // 创建上传 Promise 数组
    const uploadPromises = this.uploadFileList.map(async (file) => {
      console.log('ADDfile: ', file)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('namespace_uuid', this.selectedKnowledge)

      // 上传并矢量化文件
      const res = await http.uploadAndVectorize(formData)
      console.log('res: ', res)
      
      // 上传成功后才添加到知识库文件列表
      const extMatch = file.name.match(/\.[^.]+$/)
      this.knowledgeFiles[this.selectedKnowledge].push({
        uuid: res.data?.uuid || '', // 根据实际返回结构调整
        name: file.name.replace(/\.[^.]+$/, ''),
        ext: extMatch ? extMatch[0].slice(1) : '',
        fullName: file.name,
        chunkCount: res.data?.chunkCount || 1, // 根据实际返回结构调整
        uploadDate: new Date().toLocaleDateString(),
      })
      
      return res
    })

    // 等待所有文件上传完成
    await Promise.all(uploadPromises)
    
    // 清空上传列表
    this.uploadFileList = []
    
    // 所有文件上传成功后刷新页面
    router.go(0)
  } catch (error) {
    console.error('文件上传失败:', error)
    // 即使有错误也刷新页面以反映当前状态
    router.go(0)
  }
},
    async createKnowledge(desc: string) {
      const name = this.newKnowledgeName.trim()
      if (!name) return
      if (this.knowledges.some((item) => item.name === name)) {
        alert('知识库已存在！')
        return
      }
      await http
        .createNamespace({
          description: desc,
          name: this.newKnowledgeName || '',
        })
        .then((res) => {
          const uuid = res.uuid
          this.selectedKnowledge = res.uuid
          this.knowledgeFiles[uuid] = []
          this.knowledges.push({ name, uuid, description: desc?.slice(0, 15) || '' })
          this.selectedKnowledge = uuid
          console.log('创建知识库' + res)
        })
        .catch((err) => {
          console.error('创建知识库失败:', err)
          alert('创建知识库失败，请稍后重试')
        })
      // 简单生成uuid

      this.showCreateModal = false
      this.newKnowledgeName = ''
      
    },
    async deleteFileFromKnowledge() {
      if (!this.selectedKnowledge || !this.deleteFileTarget) return
      console.log('删除文件', this.deleteFileTarget)
      
      await http.deleteFile(this.deleteFileTarget.uuid)

      // 立即从当前列表里移除，避免必须刷新才能看到结果
      const files = this.knowledgeFiles[this.selectedKnowledge] || []
      this.knowledgeFiles[this.selectedKnowledge] = files.filter(
        (f: any) => (f.uuid || f.uid) !== (this.deleteFileTarget as any).uuid,
      )
    },
    setKnowledgeList(list: KnowledgeItem[]) {
      this.knowledges = []
      this.knowledges = list ? [...list] : []
    },
    removeKnowledgeFile(uuid: string) {
      this.knowledgeFiles[uuid] = []
    },
  },
})
