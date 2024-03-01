<template>
    <div v-show="show">
        <Starter v-if="!isLoading && !isFetching && list.length < 1" />
        <div class="board-items">
            <div class="add_btn-box">
                <AddBtn :isCard="true" />
            </div>

            <div v-for="(data, idx) in list" :key="idx" class="item">
                <BoardMemo :memo="data" v-if="data.diary_type === 3" />
                <BoardDiary :diary="data" v-else />
            </div>

            <!-- 초기에는 3개, 나머지 경우에는 2개 skeleton 노출 -->
            <div v-if="isFetching" class="item empty" />
            <div v-if="isFetching" class="item empty" />
            <div v-if="isFetching && !data?.pages" class="item empty" />

            <InfiniteLoading
                :first-load="false"
                :distance="1000"
                @infinite="loadMore"
            />
        </div>
    </div>
</template>

<script>
import BoardMemo from "~/components/diary/BoardMemo.vue";
import BoardDiary from "~/components/diary/BoardDiary.vue";
import AddBtn from "../common/buttons/AddBtn.vue";
import InfiniteLoading from "v3-infinite-loading";
import Starter from "../../components/diary/Starter.vue";

export default {
    name: "BoardItems",
    components: { BoardMemo, BoardDiary, AddBtn, InfiniteLoading, Starter },
};
</script>

<script setup>
import { useDiaryService } from "../services/diary";
/**
 * Data
 */
const props = defineProps({
    type: { type: Number, default: 0 },
    show: { type: Boolean, default: false },
});

const typeNameEN = getTypeNameEN(props.type);
const hasNextPage = computed(() => {
    return list.value.length < totalCounts.value;
});
const list = computed(() => {
    return data.value?.pages?.flatMap((page) => page.data.list) || [];
});

const totalCounts = computed(() => {
    const lastPage = data.value?.pages?.[data.value.pages.length - 1];
    return lastPage?.data.total_count || 0;
});

/**
 * Data Fetching
 */
const {
    isLoading,
    isFetching,
    data: data,
    fetchNextPage,
    refetch,
} = useInfiniteQuery({
    queryKey: ["mypage", props.type],
    queryFn: ({ pageParam = 1 }) => getMypageList(pageParam),
    getNextPageParam: (lastPage, allPages) => {
        return allPages.length + 1;
    },
});

/**
 * Function
 */
function getMypageList(pageParam) {
    return useDiaryService().getGalleryList(typeNameEN, pageParam);
}

function loadMore() {
    if (isLoading.value || isFetching.value || !hasNextPage.value) return;

    fetchNextPage();
}

//// 삭제, 생성 시 Refetch
const { $eventBus } = useNuxtApp();
$eventBus.$on("refetch", ({ path }) => {
    if (path.includes("/mypage")) refetch();
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";

.board-items {
    background: $gradient_bg_light;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 1rem;

    box-sizing: border-box;
    justify-content: flex-start;
    gap: 6px;

    &:last-child {
        padding-bottom: 2rem;
    }

    .item {
        flex: 0 0 auto;
        width: calc(50% - 3px);
        height: auto;
        aspect-ratio: 1/1;
        box-sizing: border-box;

        &.empty {
            @include skeleton;
            padding-bottom: calc(50% - 3px);
        }
    }
}

.add_btn-box {
    flex: 0 0 calc(50% - 3px);
    height: auto;
}
</style>
