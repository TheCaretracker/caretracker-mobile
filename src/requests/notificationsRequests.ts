import api from '@/api/api'

export const listNotifications = () => api.get('/notification')

export const unreadNotifications = () => api.get('/notification/unread')

export const deleteNotification = (id) => api.delete(`/notification/${id}`)
