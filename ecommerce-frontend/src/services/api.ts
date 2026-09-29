import type { Product } from "../types/Product";
import type { Category } from "../types/Category";

const API_URL = "http://localhost:8080/api";

export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const response = await fetch(
        `${API_URL}/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);

    if (!text) {
        if (!response.ok) {
            throw new Error(
                `Registration failed. Status: ${response.status}`
            );
        }

        return {
            message: "Registration successful",
        };
    }

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            `Backend returned invalid response: ${text}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
}


export async function loginUser(
    email: string,
    password: string
) {
    const response = await fetch(
        `${API_URL}/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const text = await response.text();

    console.log("Login Status:", response.status);
    console.log("Login Response:", text);

    if (!text) {
        throw new Error(
            `Login failed. Status: ${response.status}`
        );
    }

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            `Backend returned invalid response: ${text}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
}


export async function getProfile() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users/profile`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    const text = await response.text();

    console.log("Profile Status:", response.status);
    console.log("Profile Response:", text);

    if (!response.ok) {
        throw new Error(
            `Profile request failed: ${response.status} ${text}`
        );
    }

    return JSON.parse(text);
}


export function logoutUser() {
    localStorage.removeItem("token");
}


export async function getProducts(): Promise<Product[]> {

    const response = await fetch(
        `${API_URL}/products`
    );

    const text = await response.text();

    console.log(
        "Products Status:",
        response.status
    );

    console.log(
        "Products Response:",
        text
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch products: ${response.status}`
        );
    }

    return JSON.parse(text);
}


export async function getProductById(
    id: number
): Promise<Product> {

    const response = await fetch(
        `${API_URL}/products/${id}`
    );

    const text = await response.text();

    console.log(
        "Product Status:",
        response.status
    );

    console.log(
        "Product Response:",
        text
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch product: ${response.status}`
        );
    }

    return JSON.parse(text);
}


export async function getProductsByCategory(
    categoryId: number
): Promise<Product[]> {

    const response = await fetch(
        `${API_URL}/products/category/${categoryId}`
    );

    const text = await response.text();

    console.log(
        "Category Products Status:",
        response.status
    );

    console.log(
        "Category Products Response:",
        text
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch category products: ${response.status}`
        );
    }

    return JSON.parse(text);
}

export async function getCategories(): Promise<Category[]> {

    const response = await fetch(
        `${API_URL}/categories`
    );

    const text = await response.text();

    console.log(
        "Categories Status:",
        response.status
    );

    console.log(
        "Categories Response:",
        text
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch categories: ${response.status}`
        );
    }

    return JSON.parse(text);
}

export async function addToCart(
    productId: number,
    quantity: number
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/cart`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId,
                quantity,
            }),
        }
    );

    const text = await response.text();

    console.log(
        "Add Cart Status:",
        response.status
    );

    console.log(
        "Add Cart Response:",
        text
    );

    if (!response.ok) {
        throw new Error(
            `Failed to add product to cart: ${response.status} ${text}`
        );
    }

    return JSON.parse(text);
}

export async function getCart() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/cart`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    const text = await response.text();

    console.log(
        "Cart Status:",
        response.status
    );

    console.log(
        "Cart Response:",
        text
    );

    if (!response.ok) {

        throw new Error(
            `Failed to fetch cart: ${response.status} ${text}`
        );

    }

    return JSON.parse(text);
}