// plugins/axios.ts

import { useAxios } from "~/composables/useAxios";
export default defineNuxtPlugin((nuxtApp) => {
    const { API } = useAxios();
    let isRedirecting = false;

    /* /signin 페이지 접근 시, isRedirecting = false */
    nuxtApp.vueApp.$nuxt.$router.beforeEach((from, to) => {
        if (to.fullPath === "/signin") {
            isRedirecting = false;
        }
    });

    /* Response Inteceptor */
    API.interceptors.response.use((response) => {
        switch (response.data.status_code) {
            case 4220: // (4220) JWT 토큰이 필요합니다.
            case 4998: // (4998) 회원가입이 완료되지 않았습니다.
                if (nuxtApp._route.path !== "/signin" && !isRedirecting) {
                    isRedirecting = true;

                    const errorMsg = `[${response.data.code}] - ${response.data.message}`;
                    console.error(errorMsg);
                    navigateTo("/signin");
                }
                return response;

            default:
                return response;
        }
    });
});
