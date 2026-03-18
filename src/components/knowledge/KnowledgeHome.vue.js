/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/index.js'; // 按需引入 message 组件样式
import { useKnowledgeStore } from '@/stores/konwledge';
import http from '@/api/http';
// 新增知识库简介相关
const newKnowledgeDesc = ref('');
const showEditDescModal = ref(false);
const editDescValue = ref('');
const editDescTarget = ref(null);
function openEditDesc(item) {
    editDescTarget.value = item;
    editDescValue.value = item.description || '';
    showEditDescModal.value = true;
}
function saveEditDesc() {
    if (!editDescTarget.value)
        return;
    const idx = knowledgeStore.knowledges.findIndex((k) => k.name === editDescTarget.value.name);
    if (idx !== -1) {
        knowledgeStore.knowledges[idx].description = editDescValue.value.slice(0, 15);
    }
    showEditDescModal.value = false;
}
// 知识库删除相关
const showDeleteKnowledgeModal = ref(false);
const deleteKnowledgeTarget = ref(null);
function confirmDeleteKnowledge(item) {
    deleteKnowledgeTarget.value = item;
    showDeleteKnowledgeModal.value = true;
}
function handleDeleteKnowledge() {
    if (deleteKnowledgeTarget.value) {
        knowledgeStore.deleteKnowledge(deleteKnowledgeTarget.value);
        showDeleteKnowledgeModal.value = false;
        deleteKnowledgeTarget.value = null;
    }
}
function cancelDeleteKnowledge() {
    showDeleteKnowledgeModal.value = false;
    deleteKnowledgeTarget.value = null;
}
// 文件类型标签映射
const typeMap = {
    txt: 'TXT',
    pdf: 'PDF',
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
};
const knowledgeStore = useKnowledgeStore();
const searchKeyword = computed({
    get: () => knowledgeStore.searchKeyword,
    set: (v) => knowledgeStore.setSearchKeyword(v),
});
const selectedKnowledgeItem = computed(() => {
    return knowledgeList.value.find((item) => item.uuid === selectedKnowledge.value);
});
const filteredFiles = computed(() => {
    if (!knowledgeStore.selectedKnowledge ||
        !knowledgeStore.knowledgeFiles[knowledgeStore.selectedKnowledge])
        return [];
    const files = knowledgeStore.knowledgeFiles[knowledgeStore.selectedKnowledge];
    if (!knowledgeStore.searchKeyword.trim())
        return files;
    return files.filter((f) => (f.fullName || f.name + (f.ext ? '.' + f.ext : ''))
        .toLowerCase()
        .includes(knowledgeStore.searchKeyword.trim().toLowerCase()));
});
function getFileTypeLabel(ext) {
    if (!ext)
        return 'FILE';
    const key = ext.toLowerCase();
    return typeMap[key] || ext.toUpperCase().slice(0, 6);
}
const showUploadModal = computed({
    get: () => knowledgeStore.showUploadModal,
    set: (v) => knowledgeStore.setShowUploadModal(v),
});
const uploadFileList = computed({
    get: () => knowledgeStore.uploadFileList,
    set: (v) => knowledgeStore.setUploadFileList(v),
});
function beforeUpload(file, fileList) {
    console.log('beforeUpload', file, fileList);
    const allowedTypes = ['txt', 'json', 'csv', 'xml', 'md'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(ext)) {
        message.warning('仅支持上传 txt、json、csv、xml、md 文件');
        return false;
    }
    if (fileList && fileList.length > 1) {
        message.warning('不支持拖拽多个文件，请逐个拖拽或点击选择多个文件');
        return false;
    }
    knowledgeStore.addFile(file);
    return false;
}
function handleRemove(file) {
    knowledgeStore.removeFile(file);
}
function dummyRequest({ onSuccess }) {
    setTimeout(() => {
        onSuccess && onSuccess();
    }, 100);
}
function handleUploadOk() {
    if (!knowledgeStore.selectedKnowledge) {
        message.warning('请先选择一个知识库');
        return;
    }
    if (!knowledgeStore.uploadFileList.length) {
        message.warning('请先选择文件');
        return;
    }
    knowledgeStore.addFilesToKnowledge();
    knowledgeStore.setShowUploadModal(false);
    knowledgeStore.setUploadFileList([]);
    message.success('上传成功');
}
function resetUpload() {
    knowledgeStore.setShowUploadModal(false);
    knowledgeStore.setUploadFileList([]);
}
const showCreateModal = computed({
    get: () => knowledgeStore.showCreateModal,
    set: (v) => knowledgeStore.setShowCreateModal(v),
});
const newKnowledgeName = computed({
    get: () => knowledgeStore.newKnowledgeName,
    set: (v) => knowledgeStore.setNewKnowledgeName(v),
});
const knowledgeList = computed(() => knowledgeStore.knowledges);
const selectedKnowledge = computed({
    get: () => knowledgeStore.selectedKnowledge,
    set: (v) => knowledgeStore.setSelectedKnowledge(v),
});
const knowledgeFiles = computed(() => knowledgeStore.knowledgeFiles);
async function selectKnowledge(uuid) {
    await knowledgeStore.setSelectedKnowledge(uuid);
    console.log('selectKnowledge', uuid);
    await knowledgeStore.removeKnowledgeFile(uuid);
    await http
        .listFilesByNamespace(1, 20, uuid)
        .then((res) => {
        if (res) {
            if (Array.isArray(res)) {
                res.forEach((file) => {
                    knowledgeStore.addKnowledgeFile(uuid, {
                        uuid: file.uuid,
                        name: file.name,
                    });
                });
            }
            else {
                if (res.uuid) {
                    knowledgeStore.addKnowledgeFile(uuid, {
                        uuid: res.uuid,
                        name: res.name,
                    });
                }
            }
        }
        else {
            console.log('加载知识库文件列表为空');
        }
    })
        .catch((err) => {
        console.error('加载知识库文件列表失败:', err);
        message.error('加载知识库文件列表失败，请稍后重试');
    });
}
const showDeleteFileModal = computed({
    get: () => knowledgeStore.showDeleteFileModal,
    set: (v) => knowledgeStore.setShowDeleteFileModal(v),
});
const deleteFileTarget = computed({
    get: () => knowledgeStore.deleteFileTarget,
    set: (v) => knowledgeStore.setDeleteFileTarget(v),
});
function confirmDeleteFile(file) {
    knowledgeStore.setDeleteFileTarget(file);
    knowledgeStore.setShowDeleteFileModal(true);
}
function handleDeleteFile() {
    knowledgeStore.deleteFileFromKnowledge();
    knowledgeStore.setShowDeleteFileModal(false);
    knowledgeStore.setDeleteFileTarget(null);
}
function handleCreate() {
    if (!newKnowledgeName.value.trim())
        return;
    if (newKnowledgeDesc.value.length > 15) {
        message.warning('简介不能超过15字');
        return;
    }
    console.log('创建知识库', newKnowledgeName.value, newKnowledgeDesc.value);
    knowledgeStore.createKnowledge(newKnowledgeDesc.value.slice(0, 15));
    newKnowledgeDesc.value = '';
}
const tableColumns = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 220, align: 'center' },
    { title: '分块数', dataIndex: 'chunkCount', key: 'chunkCount', width: 100, align: 'center' },
    { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate', width: 160, align: 'center' },
    { title: '操作', dataIndex: 'action', key: 'action', width: 80, align: 'center' },
];
const tableCurrent = ref(1);
const tablePageSize = ref(7);
const tablePagination = computed(() => ({
    total: filteredFiles.value.length,
    current: tableCurrent.value,
    pageSize: 7,
    showSizeChanger: false,
    showQuickJumper: true,
    onChange: (page) => {
        tableCurrent.value = page;
    },
}));
const pagedFiles = computed(() => {
    const start = (tableCurrent.value - 1) * tablePageSize.value;
    return filteredFiles.value.slice(start, start + tablePageSize.value);
});
onMounted(async () => {
    const prevent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    window._dragPrevent = prevent;
    await http
        .listNamespace(1, 20)
        .then(async (res) => {
        const filteredData = res
            .filter((a) => a.uuid !== '')
            .map((item) => ({
            uuid: item.uuid,
            name: item.name,
            description: item.description || '',
        }));
        await knowledgeStore.setKnowledgeList(filteredData);
    })
        .catch((err) => {
        console.error('加载知识库列表失败:', err);
        message.error('加载知识库列表失败，请稍后重试');
    });
    if (knowledgeStore.knowledges.length > 0) {
        await knowledgeStore.setSelectedKnowledge(knowledgeStore.knowledges[0].uuid);
    }
});
onBeforeUnmount(() => {
    if (window._dragPrevent) {
        window.removeEventListener('dragover', window._dragPrevent);
        window.removeEventListener('drop', window._dragPrevent);
        delete window._dragPrevent;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ant-table-thead']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table-center']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-thead']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-tbody']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-tbody']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-tbody']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-tbody']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-tbody']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-table-row-selected']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "w-[260px] h-[88.5vh] border-r border-gray-300 shadow-sm flex-shrink-0 flex flex-col theme-aside" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between px-4 py-3 border-b border-gray-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold text-base text-gray-800" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showCreateModal = true;
        } },
    ...{ class: "text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors duration-150 flex items-center justify-center" },
    title: "新建知识库",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    t: "1753773389814",
    ...{ class: "inline-block align-middle" },
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    'p-id': "6648",
    width: "22",
    height: "22",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M0 61.466022v901.067956a64.151663 64.151663 0 0 0 66.570497 61.41733h77.297496V0.048692H66.570497A64.151663 64.151663 0 0 0 0 61.466022zM1023.902616 582.671996V61.466022A64.151663 64.151663 0 0 0 957.332119 0.048692h-76.771663v285.632653L737.218297 143.916685 593.876137 286.733011V0.048692h-368.083315v1023.902616h731.539297a64.151663 64.151663 0 0 0 66.570497-61.41733v-252.399988h-136.71666v136.71666H760.460129v-136.71666h-136.71666V582.671996h136.71666v-136.716659h126.93616v136.716659z",
    'p-id': "6649",
    fill: "#1296db",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 overflow-y-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "py-2" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.knowledgeList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (item.uuid),
        ...{ class: ([
                'px-4 mt-2 py-2 flex flex-col gap-1 cursor-pointer rounded font-medium transition-colors duration-150 group',
                __VLS_ctx.selectedKnowledge === item.uuid
                    ? 'bg-[var(--theme-select-button)] text-black'
                    : 'hover:bg-white/50 text-black',
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center min-w-0 w-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectKnowledge(item.uuid);
            } },
        ...{ class: "flex items-center flex-1 min-w-0 cursor-pointer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "flex items-center justify-center w-6 h-6 rounded mr-2" },
        ...{ class: (__VLS_ctx.selectedKnowledge === item.uuid
                ? 'bg-[var(--theme-select-button)]'
                : 'theme-aside hover:bg-white/50') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M4 4h16v16H4z",
        fill: "#e5e7eb",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M7 7h10v2H7zM7 11h10v2H7zM7 15h7v2H7z",
        fill: "#60a5fa",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "truncate" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-1 ml-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openEditDesc(item);
            } },
        ...{ class: "p-1 rounded hover:bg-white/50 transition-colors duration-150" },
        title: "编辑简介",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "22",
        height: "22",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 20h9",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.confirmDeleteKnowledge(item);
            } },
        ...{ class: "p-1 rounded hover:bg-red-300 transition-colors duration-150 text-red-500 hover:text-red-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "23",
        height: "23",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
        points: "3 6 5 6 21 6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pl-8 text-xs text-gray-500 truncate max-w-full min-h-[18px]" },
    });
    (item.description || '暂无简介');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "flex-1 p-8 overflow-auto bg-[var(--theme-bg)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showUploadModal = true;
        } },
    ...{ class: "bg-[var(--theme-main)] hover:bg-[var(--theme-button-hover)] px-5 py-2 rounded text-sm font-medium shadow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-2xl shadow-lg border border-gray-200 bg-[var(--theme-body)] overflow-x-auto" },
});
const __VLS_0 = {}.ATable;
/** @type {[typeof __VLS_components.ATable, typeof __VLS_components.aTable, typeof __VLS_components.ATable, typeof __VLS_components.aTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    columns: (__VLS_ctx.tableColumns),
    dataSource: (__VLS_ctx.pagedFiles),
    pagination: (__VLS_ctx.tablePagination),
    rowKey: ((record) => record.fullName || record.name + (record.ext ? '.' + record.ext : '')),
    loading: (false),
    scroll: ({ y: 448 }),
    ...{ class: "custom-table-center" },
    rowClassName: (() => ''),
}));
const __VLS_2 = __VLS_1({
    columns: (__VLS_ctx.tableColumns),
    dataSource: (__VLS_ctx.pagedFiles),
    pagination: (__VLS_ctx.tablePagination),
    rowKey: ((record) => record.fullName || record.name + (record.ext ? '.' + record.ext : '')),
    loading: (false),
    scroll: ({ y: 448 }),
    ...{ class: "custom-table-center" },
    rowClassName: (() => ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { bodyCell: __VLS_thisSlot } = __VLS_3.slots;
    const [{ column, record }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (record.__empty) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
    }
    else if (column.dataIndex === 'name') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-center gap-2 min-h-[32px] h-full" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "flex items-center justify-center w-7 h-7 bg-gray-100 rounded shrink-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
            width: "20",
            height: "20",
            x: "2",
            y: "2",
            rx: "2",
            fill: "#f3f4f6",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.text, __VLS_intrinsicElements.text)({
            x: "4",
            y: "16",
            'font-size': "10",
            fill: "#1677ff",
            'font-weight': "bold",
            'alignment-baseline': "middle",
            'dominant-baseline': "middle",
        });
        (__VLS_ctx.getFileTypeLabel(record.ext));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            href: "#",
            ...{ class: "text-blue-600 hover:underline truncate max-w-[180px] block leading-[32px] text-center" },
        });
        (record.fullName || record.name + (record.ext ? '.' + record.ext : ''));
    }
    else if (column.dataIndex === 'chunkCount') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-center h-full" },
        });
        (record.chunkCount || 1);
    }
    else if (column.dataIndex === 'uploadDate') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-center h-full" },
        });
        (record.uploadDate || '');
    }
    else if (column.dataIndex === 'action') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-center h-full" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(record.__empty))
                        return;
                    if (!!(column.dataIndex === 'name'))
                        return;
                    if (!!(column.dataIndex === 'chunkCount'))
                        return;
                    if (!!(column.dataIndex === 'uploadDate'))
                        return;
                    if (!(column.dataIndex === 'action'))
                        return;
                    __VLS_ctx.confirmDeleteFile(record);
                } },
            ...{ class: "flex items-center justify-center mx-auto text-gray-500 hover:text-red-600 transition" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            t: "1753951689098",
            ...{ class: "icon" },
            viewBox: "0 0 1024 1024",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            'p-id': "5076",
            width: "20",
            height: "20",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            d: "M874.011741 138.270167v746.665215c0 29.35461-12.003532 57.457666-33.336825 78.22207A115.455776 115.455776 0 0 1 760.234184 995.555611h-511.999004c-30.179497 0-59.135885-11.6622-80.469177-32.398159a109.084232 109.084232 0 0 1-33.30838-78.22207V138.270167h739.554118z m-85.333168 82.972283h-568.887783V884.906937c0 7.338652 2.986661 14.364417 8.305762 19.56974 5.347545 5.176879 12.57242 8.078207 20.138628 8.078206h511.999004c7.537763 0 14.791082-2.901328 20.110183-8.078206a27.278169 27.278169 0 0 0 8.334206-19.56974V221.24245z m-383.999253 580.720648c-23.580399 0-42.666584-18.545742-42.666584-41.471919V428.658935c0-22.897733 19.086185-41.471919 42.666584-41.471919 23.551954 0 42.666584 18.574186 42.666583 41.471919v331.860688c0 22.926178-19.114629 41.471919-42.666583 41.47192z m199.110724 0c-23.580399 0-42.666584-18.545742-42.666584-41.471919V428.658935c0-22.897733 19.086185-41.471919 42.666584-41.471919 23.551954 0 42.666584 18.574186 42.666583 41.471919v331.860688c0 22.926178-19.114629 41.471919-42.666583 41.47192z m355.554864-580.720648h-910.220452c-23.580399 0-42.666584-18.574186-42.666584-41.500364 0-22.897733 19.086185-41.471919 42.666584-41.471919h910.220452c23.551954 0 42.666584 18.574186 42.666584 41.471919 0 22.926178-19.114629 41.500364-42.666584 41.500364z m-331.377133-138.268176l7.111097 55.295893h-261.68838l7.111097-55.295893h247.466186zM652.998837 0.001991h-297.52831c-28.842611-0.227555-53.304785 20.565293-56.888779 48.383906l-21.902179 172.856553h455.110226l-22.186624-172.856553c-3.612437-27.818613-28.074612-48.611461-56.888778-48.355462h0.284444z",
            fill: "#d81e06",
            'p-id': "5077",
        });
    }
}
var __VLS_3;
const __VLS_4 = {}.AModal;
/** @type {[typeof __VLS_components.AModal, typeof __VLS_components.aModal, typeof __VLS_components.AModal, typeof __VLS_components.aModal, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onCancel': {} },
    ...{ 'onOk': {} },
    open: (__VLS_ctx.showUploadModal),
    title: "上传文件",
    okButtonProps: ({ disabled: !__VLS_ctx.uploadFileList.length }),
    okText: "确定",
    cancelText: "取消",
}));
const __VLS_6 = __VLS_5({
    ...{ 'onCancel': {} },
    ...{ 'onOk': {} },
    open: (__VLS_ctx.showUploadModal),
    title: "上传文件",
    okButtonProps: ({ disabled: !__VLS_ctx.uploadFileList.length }),
    okText: "确定",
    cancelText: "取消",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onCancel: (__VLS_ctx.resetUpload)
};
const __VLS_12 = {
    onOk: (__VLS_ctx.handleUploadOk)
};
__VLS_7.slots.default;
const __VLS_13 = {}.AUploadDragger;
/** @type {[typeof __VLS_components.AUploadDragger, typeof __VLS_components.aUploadDragger, typeof __VLS_components.AUploadDragger, typeof __VLS_components.aUploadDragger, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onRemove': {} },
    beforeUpload: (__VLS_ctx.beforeUpload),
    fileList: (__VLS_ctx.uploadFileList),
    multiple: (false),
    showUploadList: (true),
    customRequest: (__VLS_ctx.dummyRequest),
    ...{ class: "w-full dragger-large" },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onRemove': {} },
    beforeUpload: (__VLS_ctx.beforeUpload),
    fileList: (__VLS_ctx.uploadFileList),
    multiple: (false),
    showUploadList: (true),
    customRequest: (__VLS_ctx.dummyRequest),
    ...{ class: "w-full dragger-large" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onRemove: (__VLS_ctx.handleRemove)
};
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "48",
    height: "48",
    viewBox: "0 0 48 48",
    fill: "none",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    width: "48",
    height: "48",
    rx: "8",
    fill: "#e6f4ff",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M24 12v18M24 30l-6-6m6 6l6-6",
    stroke: "#1677ff",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "12",
    y: "36",
    width: "24",
    height: "2",
    rx: "1",
    fill: "#1677ff",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
var __VLS_16;
var __VLS_7;
if (__VLS_ctx.showDeleteFileModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded shadow-lg p-6 w-80" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4 text-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-red-600 font-bold" },
    });
    (__VLS_ctx.deleteFileTarget?.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showDeleteFileModal))
                    return;
                __VLS_ctx.showDeleteFileModal = false;
            } },
        ...{ class: "px-4 py-1 rounded border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleDeleteFile) },
        ...{ class: "px-4 py-1 rounded bg-red-600 text-white" },
    });
}
if (__VLS_ctx.showCreateModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded shadow-lg p-6 w-80" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ class: "border rounded px-3 py-2 w-full mb-2" },
        placeholder: "请输入知识库名称",
        maxlength: "15",
    });
    (__VLS_ctx.newKnowledgeName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ class: "border rounded px-3 py-2 w-full mb-4" },
        placeholder: "请输入简介（最多15字）",
        maxlength: "15",
    });
    (__VLS_ctx.newKnowledgeDesc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showCreateModal))
                    return;
                __VLS_ctx.showCreateModal = false;
            } },
        ...{ class: "px-4 py-1 rounded border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleCreate) },
        ...{ class: "px-4 py-1 rounded border" },
        disabled: (!__VLS_ctx.newKnowledgeName.trim()),
    });
}
if (__VLS_ctx.showEditDescModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded shadow-lg p-6 w-80" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ class: "border rounded px-3 py-2 w-full mb-4" },
        placeholder: "请输入简介（最多15字）",
        maxlength: "15",
    });
    (__VLS_ctx.editDescValue);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showEditDescModal))
                    return;
                __VLS_ctx.showEditDescModal = false;
            } },
        ...{ class: "px-4 py-1 rounded border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.saveEditDesc) },
        ...{ class: "px-4 py-1 rounded border" },
        disabled: (!__VLS_ctx.editDescValue.trim()),
    });
}
if (__VLS_ctx.showDeleteKnowledgeModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded shadow-lg p-6 w-80" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold text-lg mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4 text-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-red-600 font-bold" },
    });
    (__VLS_ctx.deleteKnowledgeTarget?.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.cancelDeleteKnowledge) },
        ...{ class: "px-4 py-1 rounded border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleDeleteKnowledge) },
        ...{ class: "px-4 py-1 rounded bg-red-600 text-white" },
    });
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[260px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[88.5vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-aside']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['align-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[18px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-bg)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-main)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--theme-button-hover)]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--theme-body)]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-7']} */ ;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-[32px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['dragger-large']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            newKnowledgeDesc: newKnowledgeDesc,
            showEditDescModal: showEditDescModal,
            editDescValue: editDescValue,
            openEditDesc: openEditDesc,
            saveEditDesc: saveEditDesc,
            showDeleteKnowledgeModal: showDeleteKnowledgeModal,
            deleteKnowledgeTarget: deleteKnowledgeTarget,
            confirmDeleteKnowledge: confirmDeleteKnowledge,
            handleDeleteKnowledge: handleDeleteKnowledge,
            cancelDeleteKnowledge: cancelDeleteKnowledge,
            getFileTypeLabel: getFileTypeLabel,
            showUploadModal: showUploadModal,
            uploadFileList: uploadFileList,
            beforeUpload: beforeUpload,
            handleRemove: handleRemove,
            dummyRequest: dummyRequest,
            handleUploadOk: handleUploadOk,
            resetUpload: resetUpload,
            showCreateModal: showCreateModal,
            newKnowledgeName: newKnowledgeName,
            knowledgeList: knowledgeList,
            selectedKnowledge: selectedKnowledge,
            selectKnowledge: selectKnowledge,
            showDeleteFileModal: showDeleteFileModal,
            deleteFileTarget: deleteFileTarget,
            confirmDeleteFile: confirmDeleteFile,
            handleDeleteFile: handleDeleteFile,
            handleCreate: handleCreate,
            tableColumns: tableColumns,
            tablePagination: tablePagination,
            pagedFiles: pagedFiles,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
