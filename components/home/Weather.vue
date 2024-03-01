<template>
    <section class="landing">
        <div class="landing__weather">
            <div class="date-box">
                <div class="date">{{ $dayjs().format("YYYY.MM.DD") }}</div>
                <div class="date-icon" v-if="!isLocationDenied">
                    <!-- <div v-if="!weather.icon" class="skeleton" /> -->
                    <img
                        v-if="
                            weather.icon && !(weather.icon === 'not supported')
                        "
                        :src="`/weathers/ic_${weather.icon}.svg`"
                        :alt="weather.icon"
                    />
                </div>
            </div>
            <div class="degree-box" v-if="!isLocationDenied">
                <!-- <div v-if="!weather.tmx" class="skeleton" /> -->
                <div
                    class="degree-wrapper"
                    v-if="weather.tmx && !(weather.icon === 'not supported')"
                >
                    <div>
                        <span>최고기온</span>
                        <span class="degree"
                            >{{ parseInt(parseFloat(weather.tmx)) }}°C</span
                        >
                    </div>
                    <div>
                        <span>최저기온</span>
                        <span class="degree minimum"
                            >{{ parseInt(parseFloat(weather.tmn)) }}°C</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "Weather",
    data() {
        return {
            isLocationDenied: false,
        };
    },
    mounted() {
        const isPermissionDenied = window.localStorage.getItem(
            "locationPermissionDenied"
        );
        this.isLocationDenied = !!isPermissionDenied;
    },
};
</script>

<script setup>
import { useTodayService } from "~/services/today";

const props = defineProps({
    location: { type: Object, default: null },
});

const { data: data, refetch } = useQuery({
    queryKey: ["weather", props.latitude, props.longitude],
    queryFn: () =>
        useTodayService().getTodayWeather(
            props.location.latitude,
            props.location.longitude
        ),
    enabled: !props.location,
});

const weather = computed(() => {
    return data.value ? data.value.data : {};
});

watch(
    () => props.location,
    (newVal) => newVal?.longitude && newVal?.latitude && refetch(),
    { deep: true }
);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";

.landing {
    padding: 2rem;
    width: 100%;
    margin-top: 0;
    color: $vc-gray-500;

    &__weather {
        display: flex;
        justify-content: space-between;
        height: 20px;

        // @media screen and (max-width: 340px) {
        //     margin-bottom: 2rem;
        // }
    }

    &__greeting {
        margin: 2.3rem 0 2rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 3.6rem;
        font-size: 2.4rem;
        font-family: $font-bold;

        @media screen and (max-width: 380px) {
            font-size: 120%;
        }
        @media screen and (max-width: 340px) {
            font-size: 110%;
        }
    }
}

.date-box {
    // color: $vc-gray-100;
    font-size: var(--vc-text-base);
    display: flex;
    align-items: center;

    @media screen and (max-width: 340px) {
        margin-bottom: 0.5rem;
    }

    .date {
        margin-right: 1.5rem;
        @media screen and (max-width: 380px) {
            font-size: 90%;
        }
    }

    .date-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;

        img {
            width: 100%;
            height: 100%;
        }
    }
}

.degree-box {
    // color: $vc-gray-100;
    font-size: var(--vc-text-xs);
    font-weight: 400;
    display: flex;
    justify-content: right;
    align-items: center;
    /* width: 200px; */

    @media screen and (max-width: 340px) {
        width: 100px;
    }

    .degree-wrapper {
        width: 100%;
        display: flex;
        justify-content: right;

        @media screen and (max-width: 340px) {
            flex-direction: column;
            align-items: flex-end;
            width: 100px;
        }
    }

    .degree {
        margin: 0 0.75rem 0 0.25rem;
        font-family: $font-bold;

        &.minimum {
            margin-right: 0;
        }

        @media screen and (max-width: 340px) {
            margin-right: 0;
        }
    }
}

.skeleton {
    position: absolute;
    width: 90%;
    height: 15px;
    background-color: transparent;
    border-radius: $border-radius-default;

    @include skeleton;
    @media screen and (max-width: 340px) {
        margin-top: 0.3rem;
    }

    &.fortune {
        width: 50px;
        height: 50px;
    }
}
</style>
