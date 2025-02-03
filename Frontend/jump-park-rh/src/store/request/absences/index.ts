import axios from 'axios'
import instance from 'src/configs/axios'

export const getAbsences = async () => {
  const { data } = await instance.get('/absences/absences/')
  console.log('dattt', data)
  return data
}

export const deleteAbsence = async (id: number) => {
  const response = await instance.delete(`/absences/absences/${id}/`)

  return response.data
}
export const UpdateAbsence = async (data: any) => {
  return await instance.put(`/absences/absences/${data.idType}/`, data.data)
}

export const CreateAbsence = async (data: any) => {
  const response = await instance.post('/absences/absences/', data)

  return response.data
}
