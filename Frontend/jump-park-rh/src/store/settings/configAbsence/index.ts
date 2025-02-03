import axios from 'axios'
import instance from 'src/configs/axios'

export const getTypeAbsence = async () => {
  const { data } = await instance.get('/absence/absence-type/')
  console.log('dattt', data)
  return data
}

export const deleteTypeAbsence = async (id: number) => {
  const response = await instance.delete(`/absence/absence-type/${id}/`)

  return response.data
}
export const UpdateTypeAbsence = async (data: any) => {
  return await instance.put(`/absence/absence-type/${data.idType}/`, data.data)
}

export const getServiceById = async (id: number | string) => {
  const response = await instance.get(`/absence/absence-type/${id}/`)

  return response.data
}
export const CreateTypeAbsence = async (data: any) => {
  const response = await instance.post('/absence/absence-type/', data)

  return response.data
}
