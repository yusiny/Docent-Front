<!-- Custom Modal -->
<template>
    <div v-if="visible" class="dim">
        <div class="alert">
            <div class="alert-title">{{ title }}</div>
            <div class="alert-desc">{{ desc }}</div>
            <div class="alert-buttons">
                <div class="alert-button" @click="cancel">
                    {{ button.cancel }}
                </div>
                <div class="alert-button primary" @click="confirm">
                    {{ button.confirm }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CustomModal",
    data() {
        return {
            visible: false,
            title: null,
            desc: null,
            button: {
                confirm: "확인",
                cancel: "취소",
            },
            callback: null,
        };
    },
    created() {
        this.$eventBus.$on(
            "onCustomModal",
            ({ title, desc, cancel, confirm, callback, cancelCallback }) => {
                this.visible = true;
                this.title = title;
                this.desc = desc;
                if (confirm) this.button.confirm = confirm;
                if (cancel) this.button.cancel = cancel;
                if (callback) this.callback = callback;
                if (cancelCallback) this.cancelCallback = cancelCallback;
            },
        );
    },
    methods: {
        confirm() {
            this.visible = false;
            if (this.callback) this.callback();
            this.callback = null;
        },
        cancel() {
            this.visible = false;
            if (this.cancelCallback) this.cancelCallback();
            this.callback = null;
        },
    },
};
</script>
<style lang="scss" scoped></style>
