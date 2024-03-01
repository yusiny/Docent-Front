/**
 * 위도, 경도 가져오기
 */
export async function getCoordinates() {
    return new Promise((resolve, reject) => {
        // 1. 권한 미허용 시 return
        const isPermissionDenied = localStorage.getItem(
            "locationPermissionDenied"
        );
        if (isPermissionDenied) return;

        // 2. 이미 위/경도 있을 경우, resolve
        const location = localStorage.getItem("location");
        if (location) {
            const loc = JSON.parse(location);
            if (isExpiredIn(loc.date, 5)) resolve(loc); // expires - 5분

            localStorage.removeItem("location");
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        date: new Date().toString(),
                    };
                    localStorage.setItem("location", JSON.stringify(loc));
                    resolve(loc);
                },
                (error) => {
                    reject(error);
                    localStorage.setItem("locationPermissionDenied", "true");
                }
            );
        } else {
            reject(new Error("위치 정보 수집이 허가되지 않았습니다"));
            localStorage.setItem("locationPermissionDenied", "true");
        }
    });
}
