import axios from 'axios'
import instance from 'src/configs/axios'

export const getdepartments = async () => {
  const { data } = await instance.get('/departments/')
  console.log('dattt', data)
  return data
}

export const getdepartmentCount = async () => {
  const response = await instance.get('/dashboards/number-employes-by-department/')

  return response.data
}

export const deletedepartment = async (id: number) => {
  const response = await instance.delete(`/departments/delete/${id}/`)

  return response.data
}
export const Updatedepartment = async (data: any) => {
  return await instance.put(`/departments/update/${data.iddepartment}/`, data.data)
}

export const getdepartmentById = async (id: number | string) => {
  const response = await instance.get(`/departments/detail/${id}/`)

  return response.data
}
export const Createdepartment = async (data: any) => {
  const response = await instance.post('/departments/create/', data)

  return response.data
}
