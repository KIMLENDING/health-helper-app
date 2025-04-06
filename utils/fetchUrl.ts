

export const fetchWithCookie = async (url: string, cookieName: string, cookieValue: string | undefined) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieValue ? `${cookieName}=${cookieValue}` : "",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

