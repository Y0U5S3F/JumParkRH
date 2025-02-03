import axios from 'axios'
import instance from 'src/configs/axios'

export const getTypeConges = async () => {
  const { data } = await instance.get('/conges/conge-type/')
  console.log('dattt', data)
  return data
}

export const deleteTypeConge = async (id: number) => {
  const response = await instance.delete(`/conges/conge-type/${id}/`)

  return response.data
}
export const UpdateTypeConge = async (data: any) => {
  return await instance.put(`/conges/conge-type/${data.idType}/`, data.data)
}

export const getServiceById = async (id: number | string) => {
  const response = await instance.get(`/services/detail/${id}/`)

  return response.data
}
export const CreateTypeConge = async (data: any) => {
  const response = await instance.post('/conges/conge-type/', data)

  return response.data
}
