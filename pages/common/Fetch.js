// Authorization 헤더를 포함하여 요청을 보냄
export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem("access_token");  // 로컬 스토리지에서 토큰 가져오기

  // 헤더에 Authorization 추가
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",  // 필요한 헤더를 추가
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Authorization 헤더를 포함하여 요청을 보냄 (multipart/form-data)
export const fetchFileWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem("access_token");

  // Authorization 헤더 추가
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers, // headers에 Authorization만 추가
      // Content-Type을 명시적으로 설정하지 않음
    });

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};