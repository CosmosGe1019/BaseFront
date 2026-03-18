import { defineStore } from 'pinia'
import http from '../api/http'
import router from '../router'

let messageInstance = null
try {
  // 兼容全局message挂载和动态引入
  // @ts-ignore
  messageInstance = (window && window.$message) ? window.$message : require('ant-design-vue').message
} catch (e) {
  // SSR等场景下不处理
}

export const useKnowledgeStore = defineStore('knowledge', {
  state: () => ({
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
    async deleteKnowledge(item) {
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
    setSearchKeyword(val) {
      this.searchKeyword = val
    },
    setShowUploadModal(val) {
      this.showUploadModal = val
    },
    setUploadFileList(val) {
      this.uploadFileList = val
    },
    setShowCreateModal(val) {
      this.showCreateModal = val
    },
    setNewKnowledgeName(val) {
      this.newKnowledgeName = val
    },
    setSelectedKnowledge(val) {
      this.selectedKnowledge = val
    },
    setShowDeleteFileModal(val) {
      this.showDeleteFileModal = val
    },
    setDeleteFileTarget(val) {
      this.deleteFileTarget = val
    },
    addFile(file) {
      this.uploadFileList.push(file)
    },
    addKnowledgeFile(uuid, file) {
      if (!this.knowledgeFiles[uuid]) {
        this.knowledgeFiles[uuid] = []
      }
      this.knowledgeFiles[uuid].push(file)
    },
    removeFile(file) {
      this.uploadFileList = this.uploadFileList.filter((f) => f.uid !== file.uid)
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
       // router.go(0)
      } catch (error) {
        console.error('文件上传失败:', error)
        // 即使有错误也刷新页面以反映当前状态
      }
    },
    async createKnowledge(desc) {
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
      router.go(0)
      this.showCreateModal = false
      this.newKnowledgeName = ''
    },
    async deleteFileFromKnowledge() {
      if (!this.selectedKnowledge || !this.deleteFileTarget) return
      const files = this.knowledgeFiles[this.selectedKnowledge] || []
      // Ant Design Vue 删除等待 loading
      const hide = messageInstance ? messageInstance.loading('正在删除文件...', 0) : (() => {})
      console.log('删除文件', this.deleteFileTarget)
      
      await http.deleteFile(this.deleteFileTarget.uuid).then((res) => {
        console.log('删除文件成功', res)
      })
      hide()
      // this.knowledgeFiles[this.selectedKnowledge] = files.filter(f => (f.fullName || (f.name + (f.ext ? '.' + f.ext : ''))) !== (this.deleteFileTarget!.fullName || (this.deleteFileTarget!.name + (this.deleteFileTarget!.ext ? '.' + this.deleteFileTarget!.ext : ''))))
      router.go(0)
    },
    setKnowledgeList(list) {
      this.knowledges = []
      this.knowledges = list ? [...list] : []
    },
    removeKnowledgeFile(uuid) {
      this.knowledgeFiles[uuid] = []
    },
  },
})