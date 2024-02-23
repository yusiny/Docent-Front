<!-- Confirm Modal -->
<template>
    <div v-if="visible" class="dim">
        <div class="alert">
            <div class="alert-title">{{ title }}</div>
            <div class="alert-desc">{{ desc }}</div>
            <div class="alert-buttons" @click="confirm">
                <div class="alert-button primary">{{ button }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ConfirmModal",
    data() {
        return {
            visible: false,
            title: null,
            desc: null,
            button: "확인",
            callback: null,
        };
    },
    created() {
        this.$eventBus.$on(
            "onConfirmModal",
            ({ title, desc, button, callback }) => {
                this.visible = true;
                this.title = title;
                this.desc = desc;
                if (button) this.button = button;
                if (callback) this.callback = callback;
            },
        );
    },
    methods: {
        confirm() {
            this.visible = false;
            if (this.callback) this.callback();
            this.callback = null;
        },
    },
};
</script>
<style lang="scss" scoped></style>
