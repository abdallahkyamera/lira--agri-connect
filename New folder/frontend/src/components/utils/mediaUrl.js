const API_BASE_URL = ' http://localhost:8000/'

export const getMediaUrl =(mediaPath) => {
    if (!mediaPath) return null


    if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')){
        return mediaPath
    }

    if (mediaPath.startsWith('/')){
        return `${API_BASE_URL}${mediaPath}`
    }
    
    
    return `${API_BASE_URL}/media/${mediaPath}`
}