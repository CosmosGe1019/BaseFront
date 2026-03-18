import { defineStore } from 'pinia';
export const useTempAiSetting = defineStore('tempAiSetting', {
    // 定义状态
    state: () => ({
        // 全局变量示例
        input: '',
    }),
    // 定义 action 方法，用于修改状态
    actions: {
        setValue(newValue) {
            this.input = newValue;
        },
        getValue() {
            return this.input;
        },
    },
});
