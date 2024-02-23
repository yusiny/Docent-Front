<template>
    <v-app id="app">
        <NuxtLayout>
            <NuxtPage />
            <ModalConfirmModal />
            <ModalCustomModal />
        </NuxtLayout>
    </v-app>
</template>

<script setup>
onMounted(() => {
    // Viewport 세팅
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    window.addEventListener("resize", () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    });
});

useSeoMeta({
    ogTitle: "나만의 기록 비서 Looi",
    description: `당신의 기록을 더욱 쉽고 가치있게!`,
    ogDescription: `당신의 기록을 더욱 쉽고 가치있게!`,
    ogImage:
        "https://kr.object.ncloudstorage.com/looi/%EA%B7%B8%EB%9E%98%ED%94%BD%20%EF%BC%86%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EC%9D%B4%EB%AF%B8%EC%A7%80.png",
    twitterCard: "summary_large_image",
    ogType: "website",
    ogSiteName: "나만의 기록 비서 Looi",
    twitterTitle: "나만의 기록 비서 Looi",
    twitterDescription: `당신의 기록을 더욱 쉽고 가치있게!`,
    twitterImage:
        "https://kr.object.ncloudstorage.com/looi/%EA%B7%B8%EB%9E%98%ED%94%BD%20%EF%BC%86%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EC%9D%B4%EB%AF%B8%EC%A7%80.png",
});
</script>
