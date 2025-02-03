import axios from 'axios'
import instance from 'src/configs/axios'

export const getWeekday = async () => {
  const { data } = await instance.get('settings/days_configurations')
  console.log('getWeekday-------', data)
  return data
}
export const getWeekdaybyUserId = async (userId: any) => {
  const { data } = await instance.get(`settings/weekly-schedules-by-user-id/${userId}`)
  console.log('getWeekday-------', data)
  return data
}

export const UpdateWeeklyDay = async (data: any) => {
  const response = await instance.put(`/settings/bulk-update-schedules/`, data)
  console.log('update days--------', response)
  return data
}

export const CreateWeekly = async (data: any) => {
  const response = await instance.post('/settings/weekly-schedule/create/', data)

  return response.data
}

export const getDayById = async (userId: any) => {
  const { data } = await instance.get(`settings/list-day/${userId}`)
  console.log('list-day-------', data)
  return data
}

export const UpdateMultipleDays = async (data: any) => {
  const response = await instance.put(`/settings/update_days/`, data)
  console.log('update days--------', response)
  return data
}

export const CreateService = async (data: any) => {
  const response = await instance.post('/services/create/', data)

  return response.data
}
