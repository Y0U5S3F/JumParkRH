import axios from 'axios'
import instance from 'src/configs/axios'

export const getConges = async () => {
  const { data } = await instance.get('/conges/conges/')
  console.log('dattt', data)
  return data
}

export const deleteConge = async (id: number) => {
  const response = await instance.delete(`/conges/conges/${id}/`)

  return response.data
}

export const UpdateConge = async (data: any) => {
  return await instance.put(`/conges/conges/${data.idType}/`, data.data)
}

export const CreateConge = async (data: any) => {
  const response = await instance.post('/conges/conges/', data)

  return response.data
}
