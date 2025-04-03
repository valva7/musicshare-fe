export const BASE_URL_BACK = process.env.NEXT_PUBLIC_BASE_URL_BACK
export const BASE_URL_FRONT = process.env.NEXT_PUBLIC_BASE_URL_FRONT


// 토큰을 로컬스토리지에서 가져오는 함수
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getUserInfo = () => JSON.parse(localStorage.getItem('user_info'));


export const getWithAuthFetch = async (url) => {
  let accessToken = getAccessToken();

  let response = await fetch(`${BASE_URL_BACK}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
  const clonedResponse = response.clone();

  // JSON 응답을 파싱
  const result = await clonedResponse.json();

  // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
  if (result.code === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(`${BASE_URL_BACK}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  return response.json()
}

export const getWithAuthAndParamsFetch = async (url, params) => {
  let accessToken = getAccessToken();
  const queryString = new URLSearchParams(params).toString()

  let response = await fetch(`${BASE_URL_BACK}${url}?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
  const clonedResponse = response.clone();

  // JSON 응답을 파싱
  const result = await clonedResponse.json();

  // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
  if (result.code === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(`${BASE_URL_BACK}${url}?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  return response.json()
}

export const getWithoutAuthAndParamFetch = async (url, params) => {
  let queryString = "";
  if (params !== null){
    queryString = new URLSearchParams(params).toString()
  }
  let response = await fetch(`${BASE_URL_BACK}${url}?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  return response.json()
}

export const postWithAuthFetch = async (url, data) => {
  let accessToken = getAccessToken();

  let response = await fetch(`${BASE_URL_BACK}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
  const clonedResponse = response.clone();

  // JSON 응답을 파싱
  const result = await clonedResponse.json();

  // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
  if (result.code === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(`${BASE_URL_BACK}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
  }

  return response.json()
}

export const postWithAuthAndParamsFetch = async (url, params) => {
  let accessToken = getAccessToken();
  const queryString = new URLSearchParams(params).toString()

  let response = await fetch(`${BASE_URL_BACK}${url}?${queryString}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
  const clonedResponse = response.clone();

  // JSON 응답을 파싱
  const result = await clonedResponse.json();

  // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
  if (result.code === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(`${BASE_URL_BACK}${url}?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  return response.json()
}

export const fetchFileWithAuth = async (url, options) => {
  let accessToken = getAccessToken();

  let response = await fetch(`${BASE_URL_BACK}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 응답 본문을 읽기 위해 클론하여 두 번 읽을 수 있도록 처리
  const clonedResponse = response.clone();

  // JSON 응답을 파싱
  const result = await clonedResponse.json();

  // 액세스 토큰 만료 시, 새로운 액세스 토큰을 발급
  if (result.code === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(`${BASE_URL_BACK}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  return response.json()
}

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
    const response = await fetch(BASE_URL_BACK + '/auth/check', {headers});

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

// 액세스 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL_BACK}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: getRefreshToken()
      }),
    });

    if (response.code !== 0) {
      tokenClear();
      window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 리다이렉트
    }

    const result = await response.json();
    localStorage.setItem('access_token', result.value.accessToken);

    return result.value.accessToken;
  } catch (error) {
    tokenClear();
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 리다이렉트
    throw error;
  }
};

export const tokenClear = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
}