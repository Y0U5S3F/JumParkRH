import axios from 'axios'
import instance from 'src/configs/axios'

export const getAttendances = async () => {
  const { data } = await instance.get('/attendances/list-attendance')
  return data
}

export const getAttendancesFiltre = async (department: number, start_date: Date, end_date: Date) => {
  const response = await instance.get(
    `/attendances/list-attendance-department/?department=${department}&start_date=${start_date}&end_date=${end_date}`
  )
  return response.data
}

export const getPointingDevice = async () => {
  const response = await instance.get('/attendances/import-attendances')
  return response.data
}

export const getEmployes = async () => {
  const response = await instance.get('/auth/list-employes/')
  return response.data
}

export const deleteAttendance = async (id: number) => {
  const response = await instance.delete(`/attendances/delete/${id}/`)

  return response.data
}
export const UpdateAttendance = async (data: any) => {
  return await instance.put(`/attendances/update-attendance/${data.Id}/`, data.data)
}

export const getServiceById = async (id: number | string) => {
  const response = await instance.get(`/services/detail/${id}/`)

  return response.data
}
export const CreateAttendance = async (data: any) => {
  const response = await instance.post('/attendances/create-attendance', data.data)

  return response.data
}
