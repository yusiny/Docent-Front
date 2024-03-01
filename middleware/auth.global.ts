import { useUserStore } from "~/store/user";
import { useAuthService } from "~/services/auth";
import { isExpiredIn } from "~/utils/utils";

/**
 * 로그인 미들웨어
 * (1) store, cookie에서 토큰 확인
 * (2) 토큰 존재하면 유저 정보 업데이트 & 로그인 상태 활성화
 * (3) 로그인 상태 체크하여 리다이렉트 처리
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    const [fullPath] = to.fullPath.split("?") || from.fullPath.split("?");

    // 미들웨어를 거쳐가지 않는 페이지
    const paths = [];
    if (paths.includes(fullPath)) {
        return;
    }

    // 미로그인 시 접근 불가 페이지
    const restrictedPathsNotLogin = [];

    const { setAccessToken, setRefreshToken, setUser, accessToken } =
        useUserStore();
    const { refresh } = useAuthService();
    const accessTokenC = useCookie("access_token").value;
    const refreshTokenC = useCookie("refresh_token").value;
    const expiresIn = useCookie("expires_in").value;

    // (1) 액세스 토큰 없으면 쿠키 확인
    if (!accessToken) {
        // (2) 쿠키 액세스 & 리프레시 있다면? - 갱신 or 자동 로그인
        if (accessTokenC && refreshTokenC) {
            // (2)-1. 만료 15분 전이면 갱신
            // (2)-2. 15분 이상 남았으면 자동 로그인
            if (expiresIn && isExpiredIn(expiresIn, 15)) {
                try {
                    const res = await refresh(refreshTokenC);

                    const now = new Date();
                    const newAccessTokenExpires = new Date(
                        now.getTime() + res.data.expires_in * 1000
                    );
                    const newRefreshTokenExpires = new Date(
                        now.getTime() + res.data.refresh_expires_in * 1000
                    );

                    useCookie("access_token", {
                        expires: newAccessTokenExpires,
                    }).value = res.data.access_token;
                    useCookie("expires_in", {
                        expires: newAccessTokenExpires,
                    }).value = String(newAccessTokenExpires);
                    useCookie("refresh_token", {
                        expires: newRefreshTokenExpires,
                    }).value = res.data.refresh_token;

                    setAccessToken(res.data.access_token);
                    setRefreshToken(res.data.refresh_token);
                    await setUser();
                } catch (e) {
                    console.error(e);
                    useCookie("access_token").value = null;
                    useCookie("refresh_token").value = null;
                }
            } else {
                console.log("🔒 AutoLogin!");
                setAccessToken(accessTokenC);
                setRefreshToken(refreshTokenC);
                try {
                    await setUser();
                } catch (e) {
                    console.error(e);
                    useCookie("access_token").value = null;
                    useCookie("refresh_token").value = null;
                }
            }
        } else if (refreshTokenC) {
            // (3) 쿠키 리프레시만 있다면? - 갱신
            console.log("🔒 Refresh!");
            try {
                const res = await refresh(refreshTokenC);

                const now = new Date();
                const newAccessTokenExpires = new Date(
                    now.getTime() + res.data.expires_in * 1000
                );
                const newRefreshTokenExpires = new Date(
                    now.getTime() + res.data.refresh_expires_in * 1000
                );

                useCookie("access_token", {
                    expires: newAccessTokenExpires,
                }).value = res.data.access_token;
                useCookie("expires_in", {
                    expires: newAccessTokenExpires,
                }).value = String(newAccessTokenExpires);
                useCookie("refresh_token", {
                    expires: newRefreshTokenExpires,
                }).value = res.data.refresh_token;

                setAccessToken(res.data.access_token);
                setRefreshToken(res.data.refresh_token);
                await setUser();
            } catch (e) {
                console.error(e);
                useCookie("access_token").value = null;
                useCookie("refresh_token").value = null;
            }
        }

        // (4) 쿠키 액세스, 리프레시 없다면? - 아무것도 X
    }

    // 로그인 여부 확인 - false인 경우, 제한된 페이지에 있다면 /signin으로 리다이렉트
    const { loginStatus } = useUserStore();
    if (!loginStatus) {
        console.error("로그인되지 않았습니다.");
        const isNotLoginPath = !!restrictedPathsNotLogin.filter((path) =>
            fullPath.toLowerCase().includes(path)
        ).length;
        if (isNotLoginPath) return navigateTo("/signin");
    }
});
