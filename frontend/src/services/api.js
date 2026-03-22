import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Get all waste records (ordered by entry date desc)
 */
export async function fetchAllRecords() {
    const response = await api.get('waste-records')
    return response.data
}

/**
 * Get a single waste record by its ID
 */
export async function fetchRecordById(id) {
    const response = await api.get(`waste-records/${id}`)
    return response.data
}

/**
 * Get all waste records for a given SKU ID
 */
export async function fetchRecordsBySkuId(skuId) {
    const response = await api.get(`waste-records/sku/${skuId}`)
    return response.data
}

/**
 * Get aggregated dashboard statistics
 */
export async function fetchDashboardStats() {
    const response = await api.get('waste-records/stats')
    return response.data
}

/**
 * Create a new waste record
 * @param {Object} data - { skuId, paperWaste, plasticWaste, wetWaste, organicWaste, defectiveWaste }
 */
export async function createWasteRecord(data) {
    const response = await api.post('waste-records', data)
    return response.data
}

/**
 * Update an existing waste record
 */
export async function updateWasteRecord(id, data) {
    const response = await api.put(`waste-records/${id}`, data)
    return response.data
}

/**
 * Delete a waste record
 */
export async function deleteWasteRecord(id) {
    await api.delete(`waste-records/${id}`)
}

/**
 * Get AI-powered waste analysis summary
 */
export async function fetchAiAnalysis() {
    const response = await api.get('ai/analyze')
    return response.data.analysis
}

export default api
