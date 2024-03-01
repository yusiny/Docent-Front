<template>
    <div class="skeleton-image">
        <img v-lazyload="url" ref="imgRef" @load="isLoading = false" v-once />
        <div class="skeleton" v-if="isLoading"></div>
    </div>
</template>

<script>
export default {
    name: "SkeletonImage",
    props: {
        url: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            isLoading: true,
        };
    },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";
.skeleton-image {
    width: 100%;
    height: 100%;
    position: relative;

    img {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .skeleton {
        position: absolute;
        @include skeleton;
        width: 100%;
        height: 100%;
    }
}
</style>
