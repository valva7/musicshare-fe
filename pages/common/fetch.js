const BASE_URL = 'http://localhost:8080'

// 토큰을 로컬스토리지에서 가져오는 함수
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Post Fetch
export const postWithAuthFetch = async (router, url, options = {}) => {
  let accessToken = getAccessToken();

  // Header
  const headers = {
    ...options.headers,
    method: "POST",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // API 호출
    let response = await fetch(BASE_URL + url, {...options, headers});

    // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
    const clonedResponse = response.clone();

    // JSON 응답을 파싱
    const result = await clonedResponse.json();

    if (result.code === 401) {
      // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
      accessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${accessToken}`;

      // 액세스 토큰 갱신 후, 다시 요청
      response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
    }

    // 최종 응답 본문 반환
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Get Fetch
export const getWithAuthFetch = async (url, options = {}) => {
  let accessToken = getAccessToken();

  // Header
  const headers = {
    ...options.headers,
    method: "GET",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // API 호출
    let response = await fetch(`${BASE_URL}${url}`, {...options, headers});

    // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
    const clonedResponse = response.clone();

    // JSON 응답을 파싱
    const result = await clonedResponse.json();

    if (result.code === 401) {
      // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
      accessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${accessToken}`;

      // 액세스 토큰 갱신 후, 다시 요청
      response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
    }

    // 최종 응답 본문 반환
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Authorization 헤더를 포함하여 요청을 보냄 (multipart/form-data)
export const fetchFileWithAuth = async (url, options = {}) => {
  let accessToken = getAccessToken();

  // Header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // API 호출
    let response = await fetch(BASE_URL + url, {...options, headers});

    // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
    const clonedResponse = response.clone();

    // JSON 응답을 파싱
    const result = await clonedResponse.json();

    if (result.code === 401) {
      // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
      accessToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${accessToken}`;

      // 액세스 토큰 갱신 후, 다시 요청
      response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
    }

    // 최종 응답 본문 반환
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// 액세스 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: getRefreshToken()
      }),
    });

    if (response.code !== 0) {
      throw new Error('Refresh token expired');
    }

    const result = await response.json();
    localStorage.setItem('access_token', result.value.accessToken);

    return result.value.accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 리다이렉트
    throw error;
  }
};

// login check
export const loginCheckFetch = async () => {
  const accessToken = getAccessToken();

  // Header
  const headers = {
    method: "GET",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Header
    const response = await fetch(BASE_URL + '/auth/check', {headers});

    // JSON 응답을 파싱
    const result = await response.json();

    if (result.code === 0) {
      window.location.href = '/main/home'; // 메인 페이지로 리다이렉트
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};