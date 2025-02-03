import axios from 'axios'
import instance from 'src/configs/axios'

export const getDevices = async () => {
  const { data } = await instance.get('/devices/')
  console.log('dattt', data)
  return data
}

export const deleteDevice = async (id: number) => {
  const response = await instance.delete(`/devices/delete/${id}/`)

  return response.data
}
export const UpdateDevice = async (data: any) => {
  return await instance.put(`/devices/update/${data.idDevice}/`, data.data)
}

export const CreateDevice = async (data: any) => {
  const response = await instance.post('/devices/create/', data)

  return response.data
}
export const ConnectDevice = async (data: any) => {
  const response = await instance.post('/devices/connect/', data)

  return response.data
}
