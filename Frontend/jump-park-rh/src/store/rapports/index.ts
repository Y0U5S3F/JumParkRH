import axios from 'axios'
import instance from 'src/configs/axios'

export const getRecap = async () => {
  const { data } = await instance.get('/attendances/recap-monthly')
  console.log('dattt', data)
  return data
}
export const getRecapFilter = async (data: any) => {
  const response = await instance.post('/attendances/recap-monthly', data)
  console.log('respone----', data)
  return response.data
}

export const getEmployes = async () => {
  const response = await instance.get('/auth/employees/')
  return response.data
}

export const deleteServices = async (id: number) => {
  const response = await instance.delete(`/services/delete/${id}/`)

  return response.data
}
export const UpdateService = async (id: number) => {
  return await instance.put(`/services/update/${id}/`)
}

export const getServiceById = async (id: number | string) => {
  const response = await instance.get(`/services/detail/${id}/`)

  return response.data
}
export const CreateAttendance = async (data: any) => {
  const response = await instance.post('/attendances/create-attendance', data.data)

  return response.data
}
