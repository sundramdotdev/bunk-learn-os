// FakeApi.js
export const FAKE_DB = {
    users: [
        { id: 1, name: "Alice", role: "admin", email: "alice@example.com" },
        { id: 2, name: "Bob", role: "user", email: "bob@example.com" }
    ],
    products: [
        { id: 101, name: "Laptop", price: 1200, stock: 45 },
        { id: 102, name: "Mouse", price: 25, stock: 120 }
    ],
    orders: [
        { id: 1001, userId: 1, productId: 101, status: "shipped" }
    ],
    students: [
        { id: 1, name: "Charlie", major: "Computer Science", gpa: 3.8 },
        { id: 2, name: "Diana", major: "Mathematics", gpa: 3.9 }
    ]
};

export const HTTP_STATUS = {
    200: { text: "OK", desc: "The request succeeded." },
    201: { text: "Created", desc: "The request succeeded, and a new resource was created as a result." },
    204: { text: "No Content", desc: "The server successfully processed the request and is not returning any content." },
    400: { text: "Bad Request", desc: "The server could not understand the request due to invalid syntax." },
    404: { text: "Not Found", desc: "The server can not find the requested resource." },
    500: { text: "Internal Server Error", desc: "The server has encountered a situation it doesn't know how to handle." }
};

export const simulateApiCall = async (method, endpoint, bodyStr) => {
    // Simulate network delay
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(r => setTimeout(r, delay));

    const parts = endpoint.replace(/^\/api\//, '').split('/');
    const resource = parts[0];
    const id = parts[1] ? parseInt(parts[1], 10) : null;

    if (!FAKE_DB[resource]) {
        return { status: 404, data: { error: "Resource not found" }, time: delay };
    }

    let parsedBody = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
            parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
        } catch(e) {
            return { status: 400, data: { error: "Invalid JSON body" }, time: delay };
        }
    }

    switch(method) {
        case 'GET':
            if (id) {
                const item = FAKE_DB[resource].find(x => x.id === id);
                if (item) return { status: 200, data: item, time: delay };
                return { status: 404, data: { error: "Item not found" }, time: delay };
            }
            return { status: 200, data: FAKE_DB[resource], time: delay };
            
        case 'POST':
            const newId = Math.max(0, ...FAKE_DB[resource].map(x => x.id)) + 1;
            const newItem = { id: newId, ...parsedBody };
            FAKE_DB[resource].push(newItem);
            return { status: 201, data: newItem, time: delay };
            
        case 'PUT':
            if (!id) return { status: 400, data: { error: "ID required for PUT" }, time: delay };
            const idx = FAKE_DB[resource].findIndex(x => x.id === id);
            if (idx === -1) return { status: 404, data: { error: "Item not found" }, time: delay };
            FAKE_DB[resource][idx] = { id, ...parsedBody };
            return { status: 200, data: FAKE_DB[resource][idx], time: delay };
            
        case 'PATCH':
            if (!id) return { status: 400, data: { error: "ID required for PATCH" }, time: delay };
            const pIdx = FAKE_DB[resource].findIndex(x => x.id === id);
            if (pIdx === -1) return { status: 404, data: { error: "Item not found" }, time: delay };
            FAKE_DB[resource][pIdx] = { ...FAKE_DB[resource][pIdx], ...parsedBody, id };
            return { status: 200, data: FAKE_DB[resource][pIdx], time: delay };
            
        case 'DELETE':
            if (!id) return { status: 400, data: { error: "ID required for DELETE" }, time: delay };
            const dIdx = FAKE_DB[resource].findIndex(x => x.id === id);
            if (dIdx === -1) return { status: 404, data: { error: "Item not found" }, time: delay };
            FAKE_DB[resource].splice(dIdx, 1);
            return { status: 204, data: null, time: delay };
            
        default:
            return { status: 405, data: { error: "Method not allowed" }, time: delay };
    }
};
