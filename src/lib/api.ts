
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // const session = await getSession()
    // const headers = new Headers(options.headers || {})
    // if (!token) {
    //     token = session?.user.accessToken
    // }

    // if (token) {
    //     headers.set("Authorization", `Bearer ${token}`)
    // }

    const response = await fetch(`${url}`, {
        ...options
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "An error occurred while fetching the data.")
    }

    return response.json()
}

export const api = {
    auth: {
        login: (credentials: { email: string; password: string; username: string,login_type: string }) =>
            fetch(`/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            }).then((res) => res.json()),
        register: (userData: { email: string; password: string; name: string }) =>
            fetch(`/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }).then((res) => res.json()),
    },
    user: {
        getProfile: () => fetchWithAuth(`/api/user/profile`, {}),
        updateProfile: (userData: { name?: string; email?: string }) =>
            fetchWithAuth("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }),
    },
    get: (url: string) => fetchWithAuth(url, {}),
    post: (url: string, data: any) =>
        fetchWithAuth(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }),
    put: (url: string, data: any) =>
        fetchWithAuth(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }),
    delete: (url: string) =>
        fetchWithAuth(url, {
            method: "DELETE",
        }),
}