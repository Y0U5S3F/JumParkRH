// ** Axios Imports
import axios from 'axios'
import instance from 'src/configs/axios'

// ** Fetch Users

export const fetchData = async () => {
  const response = await instance.get('/auth/users/')
  return response.data
}

export const fetchUsers = async (page: number) => {
  try {
    const response = await instance.get(`/auth/employees-pagination/?page=${page}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch users')
  }
}
export const UpdateUser = async (data: any) => {
  return await instance.put(`/auth/users/update/${data.idUser}/`, data.data)
}

export const deletedUser = async (data: any) => {
  return await instance.put(`/auth/users/delete/${data.idUser}/`, data.data)
}

export const getUserById = async (id: number | string) => {
  const response = await instance.get(`/auth/users/detail/${id}/`)

  return response.data
}
export const getUsers = async () => {
  const response = await instance.get('/auth/list-employes/')
  return response.data
}

export const CreateUser = async (data: any) => {
  const response = await instance.post('/auth/register/employee/', data.data)

  return response.data
}

export const deleteUser = async (id: number) => {
  const response = await instance.delete(`/auth/delete/${id}/`)

  return response.data
}
export const detailUser = async (id: number) => {
  const response = await instance.get(`/auth/users/detail/${id}/`)

  return response.data
}
