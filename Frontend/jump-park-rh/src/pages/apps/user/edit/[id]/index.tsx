// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { CreateUser, getUserById, UpdateUser } from 'src/store/user'
import FormHelperText from '@mui/material/FormHelperText'
import UserEdit from './edit'

export function getServerSideProps(context: any) {
  return {
    props: { params: context.params }
  }
}
const FormLayoutsSeparator = ({ params }: any) => {
  // ** States

  // const router = useRouter()
  const { id } = params

  //** get details user with id */
  const userkey = useMemo(() => ['user', id], [id])
  const { data: user, isLoading: isLoading } = useQuery(userkey, async () => {
    const result = await getUserById(id)
    return result
  })

  return <>{user && <UserEdit user={user} />}</>
}

export default FormLayoutsSeparator
