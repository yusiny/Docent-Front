<template>
    <section class="viewport">
        <div class="header">
            <div class="button" @click="Download">
                <Icon class="logo_look_small" />
                <span>Looi 체험해보기</span>
            </div>
        </div>

        <article class="container">
            <!-- 1. 상단 영역 (날짜, 제목) -->
            <div class="diary-title-box">
                <div v-if="isLoading">
                    <div class="diary-title-not-generate-title__skeleton"></div>
                    <div class="tag-not-generate__skeleton"></div>
                </div>
                <div v-else>
                    <div class="diary-date">
                        {{ $dayjs(diary.create_date).format("YYYY.MM.DD") }}
                    </div>

                    <div class="diary-title">
                        {{ diary.diary_name }}
                    </div>

                    <div class="tag-wrap">
                        <div class="tag accent" v-for="tag in diary.keyword">
                            {{ tag }}
                        </div>
                    </div>
                </div>
                <div v-if="isLoading">
                    <div class="diary-image__skeleton"></div>
                </div>
            </div>

            <!-- 2. 중간 영역 (이미지, 삭제 버튼) -->
            <div v-if="!isLoading" class="diary-image-div">
                <Image
                    class="diary-image"
                    :url="diary.image_url"
                    width="calc(100% - 40px)"
                    maxWidth="400px"
                />
            </div>

            <!-- 3. 바텀시트 영역 -->
            <div class="bottom-container">
                <div class="bottom-diary">
                    <div class="bottom-diary-content">
                        <div
                            v-if="type == 1"
                            class="bottom-diary-content-title"
                        >
                            <Icon class="ic_memo" /> 꿈 내용
                        </div>
                        <div
                            v-else-if="type == 2"
                            class="bottom-diary-content-title"
                        >
                            <Icon class="ic_memo" /> 일기 내용
                        </div>
                        <div class="bottom-diary-content-desc">
                            {{ diary.content }}
                        </div>
                    </div>

                    <div v-if="type == 1" class="bottom-diary-content">
                        <div class="bottom-diary-content-title">
                            <Icon class="ic_crystal" />꿈을 통해 본 마음
                        </div>

                        <div class="bottom-diary-content-desc">
                            {{ diary.resolution }}
                        </div>
                    </div>
                    <div v-else-if="type == 2" class="bottom-diary-content">
                        <div class="bottom-diary-content-title">
                            <Icon class="ic_reply" />Looi의 답장
                        </div>

                        <div class="bottom-diary-content-desc">
                            {{ diary.resolution }}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>
<script setup>
const { getSharedDiary } = useDiaryService();

const id = useRoute().params.id;

const record = await useAsyncData(`content-${id}`, async () => {
    const res = await getSharedDiary(id);

    if (res.success) {
        return res.data?.diary || null;
    } else {
        // 실패 처리
        return null;
    }
});

useServerSeoMeta({
    title: () => record.data.value?.diary_name,
    description: () => record.data.value?.content,
    ogImage: () => record.data.value?.image_url,
    ogTitle: () => record.data.value?.diary_name,
    ogDescription: () => record.data.value?.content,
    twitterTitle: () => record.data.value?.diary_name,
    twitterDescription: () => record.data.value?.diary_name,
});
</script>
<script>
import { useDiaryService } from "../../services/diary";
import Button from "~/components/common/Button.vue";
import Icon from "~/components/common/Icon.vue";
import Image from "~/components/common/Image.vue";
import BottomSheet from "~/components/common/BottomSheet.vue";

export default {
    name: "Diary",
    components: {
        Button,
        Icon,
        Image,
        BottomSheet,
    },
    data() {
        return {
            diary: {},
            type: "1",
            isLoading: true,
            isOpen: false,
        };
    },
    methods: {
        async Download() {
            if (isIOS()) {
                const url =
                    "https://apps.apple.com/kr/app/looi-%EC%9E%90%EA%B8%B0%EA%B4%80%EB%A6%AC%EB%A5%BC-%EB%8F%84%EC%99%80%EC%A3%BC%EB%8A%94-ai-%EA%B8%B0%EB%A1%9D-%EB%B9%84%EC%84%9C/id6474598684";
                window.open(url, "_blank");
            } else if (isAndroid()) {
                const url =
                    "https://play.google.com/store/apps/details?id=zip.docent.looi";
                window.open(url, "_blank");
            }
        },
    },
    async mounted() {
        const { getSharedDiary } = useDiaryService();

        const id = this.$route.params.id;
        this.type = this.$route.query.type;

        const res = await getSharedDiary(id);

        if (!res.success) {
            this.$eventBus.$emit("onConfirmModal", {
                title: "조회 실패하였습니다.",
                desc: res.message,
                callback: () => {
                    this.$router.back();
                },
            });
        }

        this.diary = res.data.diary;
        if (this.diary.main_keyword && this.diary.main_keyword !== "")
            this.diary.keyword = JSON.parse(this.diary.main_keyword);
        this.isLoading = false;
    },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";
.header {
    background: none;
    border: none;
    justify-content: flex-end;
    background: #ffffff;
    border: none;
    justify-content: space-between;

    padding: 0 20px;

    .button {
        width: 100%;
        height: fit-content;
        padding: 0.8rem;

        /* b1/b1_med_16 */
        color: $vc-white;
        font-family: $font-medium;
        font-size: 16px;
        line-height: 160%; /* 25.6px */

        display: flex;
        gap: 20px;
    }
}

.container {
    overflow-y: auto;
    background: var(
        --v2-gradient_bg_light,
        linear-gradient(
            0deg,
            #ded2ff -46.93%,
            #d2daff -31.6%,
            #dee4ff -4.86%,
            #fff 117.99%
        )
    );
    // BottomSheet 높이: 108px =  calc(32px + (12px * 1.5) + 4px) + 40px + 14px;
    height: calc(100% - (60px));
    height: calc(100% - (60px + constant(safe-area-inset-top)));
    height: calc(100% - (60px + env(safe-area-inset-top)));
    width: 100%;
    padding: 2rem 0;

    margin-top: calc(60px);
    margin-top: calc(60px + constant(safe-area-inset-top));
    margin-top: calc(60px + env(safe-area-inset-top));

    display: flex;
    flex-direction: column;
    align-items: center;
}
.diary-image-div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.diary-image {
    border-radius: 0.94rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    margin-bottom: 16px;

    &__skeleton {
        @include skeleton;
        border-radius: 0.94rem;
        margin-top: 16px;
        aspect-ratio: 1/1;
        width: 100%;
        max-width: 500px;
        margin-bottom: 16px;
    }
}

.diary-title-box {
    width: calc(100% - 40px);
    overflow: visible;
    display: flex;
    flex-direction: column;

    justify-self: center;

    .tag-wrap {
        margin-top: 2rem;
        margin-bottom: 1.6rem;
        /* border: 1px solid red; */
        flex-wrap: wrap;
    }
}

.diary-title {
    width: 100%;

    /* h1/h1_bold_24 */
    font-family: "Pretendard Bold";
    // font-size: 20px;
    font-size: 1.8rem;
    line-height: 150%; /* 36px */

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;

    &__skeleton {
        @include skeleton;
        width: 80%;
        height: calc(20px * 1.5);
        margin-top: 5px;
    }
}

.diary-date {
    /* b2/b2_med_14 */
    font-family: "Pretendard Medium";
    font-size: 14px;
    line-height: 160%; /* 22.4px */
    color: var(--gray-500, #6b7280);

    &__skeleton {
        @include skeleton;
        width: 20%;
        height: calc(14px * 1.5);
    }
}

.diary-delete {
    display: flex;
    color: var(--gray-400, #9ca3af);
    font-family: "Pretendard";
    font-size: 12px;
    line-height: 160%;
}
.bottom-diary-title-box {
    display: flex;
    flex-direction: column;
}
.bottom-diary {
    margin-bottom: 16px;
    padding: 0 2rem;
    .bottom-diary-content {
        margin-top: 12px;
        .bottom-diary-content-title {
            color: var(--gray-700, #374151);

            /* b1/b1_bold_16 */
            font-family: "Pretendard Bold";
            font-size: 16px;
            line-height: 160%; /* 25.6px */

            display: flex;
            gap: 12px;

            height: auto;
        }

        .bottom-diary-content-desc {
            width: 100%;
            color: var(--gray-500, #6b7280);

            /* b2/b2_reg_14 */
            font-family: "Pretendard";
            font-size: 14px;
            line-height: 160%; /* 22.4px */

            margin-top: 8px;
        }
    }
}

.edit-input {
    margin-top: 0.4rem;
    border-radius: 8px;
    border: 1px solid var(--indigo-400, #6568fe);
    background: var(--indigo-100, #e0e7ff);
    color: #1f2937;
    width: 100%;
    height: auto;
    padding: 0.4rem 0.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;

    &.content {
        height: 20rem;
    }
}

textarea:focus {
    outline: 2.5px solid #ffffff35;
}
.bottom-container {
    width: 100%;
}
.ic_url {
    display: flex;
    width: 115px;
    height: 31px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 8px;
}
.header-title {
    text-align: left;
    color: var(--gray-800, #1f2937);
    font-family: "Pretendard SemiBold";
    font-size: 16px;
    line-height: 150%;
}
.bottom-diary-content-default {
    width: 100%;
    height: 110px;
    flex-shrink: 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.bottom-diary-content-default-title {
    color: var(--gray-600, #4b5563);
    text-align: center;
    margin-top: 33px;
    font-family: "Pretendard Bold";
    font-size: 16px;
    line-height: 160%;
}
.bottom-diary-content-default-content {
    color: var(--gray-500, #6b7280);
    text-align: center;
    font-family: "Pretendard";
    font-size: 12px;
    line-height: 160%;
}
.bottom-diary-content {
    margin-top: 8px;
    border-radius: 8px;
    background: var(--white, #fff);
    display: inline-flex;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
}
.bottom-generate {
    text-align: center;
    display: flex;
    align-items: center;
    width: 100vw !important;
    max-width: 500px;
    flex-direction: column;
    margin-top: 66px;
    padding: 0 20px;
    height: 161px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) -10.8%,
        rgba(255, 255, 255, 0.39) 39.17%,
        #fff 100%
    );
    flex-shrink: 0;
}
.generate {
    width: 100%;
    height: 48px;
    margin-top: 12px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--v2-CTA_accent, #9398ff);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.generate-text {
    color: var(--white, #fff);
    text-align: center;
    font-family: "Pretendard Bold";
    font-size: 16px;
    line-height: 160%;
}
.bottom-generate-title {
    margin-top: 36px;
    color: var(--indigo-500, #6366f1);
    text-align: center;
    font-family: "Pretendard Bold";
    font-size: 14px;
    line-height: 160%;
}
.bottom-generate-content {
    color: var(--gray-400, #9ca3af);
    text-align: center;
    font-family: "Pretendard";
    font-size: 12px;
    line-height: 160%;
}
.diary-title-box-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}
.diary-title-not-generate {
    padding: 0 12px;
    width: 100%;
    height: 48px;
    flex-shrink: 0;
    border-radius: 8px;
    background: var(--indigo-50, #eef2ff);
    align-items: center;
    display: flex;
}

.diary-title-not-generate-title {
    color: var(--gray-400, #9ca3af);
    font-family: "Pretendard";
    font-size: 12px;
    line-height: 160%;

    &__skeleton {
        @include skeleton;
        width: 100%;
        height: 48px;
        border-radius: 8px;
    }
}
.tag-not-generate {
    display: inline-flex;
    padding: 6px 11px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    background: rgba(145, 145, 145, 0.2);
    color: var(--gray-500, #6b7280);
    font-family: "Pretendard Bold";
    font-size: 12px;
    line-height: 160%; /* 19.2px */

    &__skeleton {
        @include skeleton;
        width: 100%;
        margin-top: 22px;
        height: 31px;
        border-radius: 12px;
        margin-bottom: 10px;
    }
}
.bottom-generate-loading {
    text-align: center;
    display: flex;
    align-items: center;
    width: 100vw !important;
    max-width: 500px;
    flex-direction: column;
    margin-top: 66px;
    padding: 0 20px;
    height: 161px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) -10.8%,
        rgba(255, 255, 255, 0.39) 39.17%,
        #fff 100%
    ) !important;
    flex-shrink: 0;
}
.bottom-diary-content-default-title-loading {
    color: var(--indigo-500, #6366f1);
    text-align: center;
    margin-top: 33px;
    font-family: "Pretendard Bold";
    font-size: 14px;
    line-height: 160%;
}
.bottom-diary-content-default-content-loading {
    color: var(--gray-400, #9ca3af);
    text-align: center;
    font-family: "Pretendard";
    font-size: 12px;
    line-height: 160%;
}
.generate-loading {
    width: 100%;
    height: 48px;
    margin-top: 12px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--indigo-100, #e0e7ff);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.generate-text-loading {
    color: var(--indigo-400, #6568fe);
    text-align: center;
    font-family: "Pretendard";
    font-size: 16px;
    line-height: 160%;
}
</style>
