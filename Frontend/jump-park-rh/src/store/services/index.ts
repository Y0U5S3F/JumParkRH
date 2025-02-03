import axios from 'axios'
import instance from 'src/configs/axios'

export const getServices = async () => {
  const { data } = await instance.get('/services/')
  console.log('dattt', data)
  return data
}

export const deleteServices = async (id: number) => {
  const response = await instance.delete(`/services/delete/${id}/`)

  return response.data
}
export const UpdateService = async (data: any) => {
  return await instance.put(`/services/update/${data.idService}/`, data.data)
}

export const getServiceById = async (id: number | string) => {
  const response = await instance.get(`/services/detail/${id}/`)

  return response.data
}
export const CreateService = async (data: any) => {
  const response = await instance.post('/services/create/', data)

  return response.data
}
