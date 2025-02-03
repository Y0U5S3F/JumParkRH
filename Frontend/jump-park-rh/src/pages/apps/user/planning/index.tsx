// ** React Imports
import { Ref, useState, SyntheticEvent, forwardRef, ReactElement, MouseEvent, useEffect, FormEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { Theme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogContent from '@mui/material/DialogContent'
import Table from '@mui/material/Table'
import { Backdrop, CircularProgress, Grid, TableCell } from '@mui/material'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import TableRow from '@mui/material/TableRow'
import { CreateWeekly, getDayById, getWeekday, getWeekdaybyUserId, UpdateMultipleDays, UpdateWeeklyDay } from 'src/store/settings/configTime'
import { useMutation, useQueryClient, useQuery } from 'react-query'
// ** Configs Imports
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import addDays from 'date-fns/addDays'

// ** Hooks Imports
import { useSettings } from 'src/@core/hooks/useSettings'
import moment from 'moment'
import format from 'date-fns/format'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { styled } from '@mui/material/styles'

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface CustomInputProps {
    dates: Date[]
    label: string
    end: number | Date
    start: number | Date
    setDates?: (value: Date[]) => void
}

const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`
    props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
    const updatedProps = { ...props }
    delete updatedProps.setDates

    return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})


const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
    boxShadow: 'none !important',
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-of-type)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    },
    '&.Mui-expanded': {
        margin: 'auto'
    },
    '&:first-of-type': {
        '& .MuiButtonBase-root': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
        }
    },
    '&:last-of-type': {
        '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
        }
    }
}))

// Styled component for AccordionSummary component
const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
    marginBottom: -1,
    padding: theme.spacing(0, 4),
    minHeight: theme.spacing(12.5),
    transition: 'min-height 0.15s ease-in-out',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.default,
    '&.Mui-expanded': {
        minHeight: theme.spacing(12.5)
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
        margin: '10px 0'
    }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
    padding: `{ theme.spacing(4) }!important`
}))




const ConfigTimeFixe = (props: any) => {
    const { open, ID, onClose } = props
    console.log('props.id--', props.id)
    const queryClient = useQueryClient()

    const defaultValues = {
        time: '',
        time2: '',
        time3: '',
        time4: ''
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange'
    })
    // const { data: weekday, isLoading, error } = useQuery('weekday', () => getDayById(userId));
    // const { data: weekday } = useQuery(["weekday", userId], () => getDayById(userId));
    const userId = props.id

    // const { data: weekday } = useQuery(["weekday", userId], () =>
    //     getDayById(userId)
    // );

    const [arrayOfWeek, setArrayOfWeek] = useState<any>([])

    const { data: weekdayByUser } = useQuery(["weekdayByUser", userId], () =>
        getWeekdaybyUserId(userId), {
        onSuccess: (data) => {
            if (arrayOfWeek.length === 0) {
                setArrayOfWeek(data)
            }
        }
    }
    );

    console.log('arrayOfWeek', arrayOfWeek)


    // useEffect(() => {
    //     if (weekday) {
    //         setArrayOfWeek(weekday);
    //     }
    // }, [weekday]);

    useEffect(() => {
        if (weekdayByUser) {
            setArrayOfWeek(weekdayByUser);
        }
        setStartDateRange(new Date());
        setEndDateRange(addDays(new Date(), 45));
    }, [weekdayByUser]);


    const [expanded, setExpanded] = useState<string | false>('panel1')
    const [selectedDate, setSelectedDate] = useState(null);
    const [accordions, setAccordions] = useState([]);

    const [days, setDays] = useState([])
    const [duration, setDuration] = useState([])
    const [dates, setDates] = useState<Date[]>([])

    const [showDatePicker, setShowDatePicker] = useState(days.map(() => false))
    // const [startDateRange, setStartDateRange] = useState<DateType>(new Date())
    // const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45))
    const [startDateRange, setStartDateRange] = useState<DateType | null>(null);
    const [endDateRange, setEndDateRange] = useState<DateType | null>(null);

    const [weekdayName, setWeekdayName] = useState('')
    const [employee, setEmployee] = useState('')

    const handleOnChangeRange = (dates: any) => {
        const [start, end] = dates
        setStartDateRange(start)
        setEndDateRange(end)
    }
    const UpdateMultipleMutation = useMutation(UpdateWeeklyDay, {
        onSuccess: () => {
            queryClient.invalidateQueries('weekday')
            toast.success('updated successfully')

        }
    })
    console.log('user-id--', userId)

    // const handleChange = (weekIndex: any, dayIndex: any, property: any, value: any) => {
    //     // Copiez l'état actuel
    //     const updatedSchedule = [...arrayOfWeek];
    //     // Mise à jour de l'heure spécifique
    //     if (updatedSchedule[weekIndex]?.dayschedule_set) {
    //         updatedSchedule[weekIndex].dayschedule_set[dayIndex][property] = value;
    //         setArrayOfWeek(updatedSchedule);
    //     }
    // }


    const onSubmit = (data: any) => {
        UpdateMultipleMutation.mutate(arrayOfWeek)
    }

    const handleChangee = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }
    const expandIcon = (value: string) => <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} />

    // const handleChange = (id: any, idDay: any, property: any, value: any) => {

    //     if (arrayOfWeek) {
    //         const updatedWeekday = arrayOfWeek.find((week: any) => week.id === id);
    //         console.log("updatedWeekday---", updatedWeekday)
    //         console.log("value---", value)

    //         if (updatedWeekday) {
    //             const updatedSchedule = updatedWeekday.dayschedule_set.map((scheduleItem: any) => {
    //                 console.log("scheduleItem---", scheduleItem);
    //                 if (scheduleItem.id === idDay) {
    //                     // const updatedScheduleItem = { ...scheduleItem, [property]: value }

    //                     const updatedScheduleItem = { ...scheduleItem, [property]: value };
    //                     console.log("updatedScheduleItem---", updatedScheduleItem);

    //                     // Calcul de la durée
    //                     const startAt = moment(updatedScheduleItem.check_in, 'HH:mm:ss');
    //                     const endAt = moment(updatedScheduleItem.check_out, 'HH:mm:ss');
    //                     const durations = moment.duration(endAt.diff(startAt)).asHours();
    //                     const durationHours = moment.utc(durations * 60 * 60 * 1000).format('HH:mm:ss');
    //                     console.log('duration final---', durations);
    //                     console.log('durationHours---', durationHours);
    //                     const breakDuration = moment.duration(updatedScheduleItem.break_duration).asHours();
    //                     const duration = durations - breakDuration;
    //                     const durationFinal = moment.utc(duration * 60 * 60 * 1000).format('HH:mm:ss');
    //                     console.log('updatedDuration---', duration);
    //                     console.log('durationFinal---', durationFinal);

    //                     return { ...updatedScheduleItem, duration: durationFinal };
    //                 };

    //             })
    //             // setArrayOfWeek(updatedSchedule);
    //         }
    //     }
    // }
    const handleChange = (id: any, idDay: any, property: any, value: any) => {
        if (arrayOfWeek) {
            const updatedWeekday = arrayOfWeek.find((week: any) => week.id === id);

            if (updatedWeekday) {
                const updatedSchedule = updatedWeekday.dayschedule_set.map((scheduleItem: any) => {
                    if (scheduleItem.id === idDay) {
                        const updatedScheduleItem = { ...scheduleItem, [property]: value };

                        // ... (calcul de la durée et autres modifications)
                        const startAt = moment(updatedScheduleItem.check_in, 'HH:mm:ss');
                        const endAt = moment(updatedScheduleItem.check_out, 'HH:mm:ss');
                        const durations = moment.duration(endAt.diff(startAt)).asHours();
                        const durationHours = moment.utc(durations * 60 * 60 * 1000).format('HH:mm:ss');
                        console.log('duration final---', durations);
                        console.log('durationHours---', durationHours);
                        const breakDuration = moment.duration(updatedScheduleItem.break_duration).asHours();
                        const duration = durations - breakDuration;
                        const durationFinal = moment.utc(duration * 60 * 60 * 1000).format('HH:mm:ss');
                        console.log('updatedDuration---', duration);
                        console.log('durationFinal---', durationFinal);

                        return { ...updatedScheduleItem, duration: durationFinal };
                        // return updatedScheduleItem;
                    } else {
                        return scheduleItem; // Retournez les autres objets sans modification
                    }
                });

                // Mettez à jour l'état local avec les données mises à jour
                const updatedArrayOfWeek = [...arrayOfWeek];
                const updatedWeekdayIndex = updatedArrayOfWeek.findIndex((week: any) => week.id === id);
                updatedArrayOfWeek[updatedWeekdayIndex].dayschedule_set = updatedSchedule;

                setArrayOfWeek(updatedArrayOfWeek);
            }
        }
    }

    const handleChangeWeekDay = (event: any) => {
        setWeekdayName(event.target.value)
    }
    const handleAddWeeklySchedule = async () => {
        if (startDateRange && endDateRange) {
            const startDateFormatted = format(startDateRange, 'yyyy-MM-dd');
            const endDateFormatted = format(endDateRange, 'yyyy-MM-dd');
            const data = {
                week_name: weekdayName,
                employee: userId,
                start_date_of_week: startDateFormatted,
                end_date_of_week: endDateFormatted,
                dayschedule_set: [
                    {
                        "day": 1,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 2,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 3,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 4,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 5,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 6,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    },
                    {
                        "day": 7,
                        "check_in": "13:00:00",
                        "check_out": "17:00:00"
                    }
                ]
            };

            try {
                const response = await CreateWeekly(data);
                queryClient.invalidateQueries('weekdayByUser')

                toast.success('WeeklySchedule créé avec succès');
            } catch (error) {
                console.error(error);
                toast.error('Une erreur sest produite lors de la création de WeeklySchedule');
            }
        }
    };


    return (

        <Dialog
            fullWidth
            open={open}
            maxWidth='lg'
            scroll='body'
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={onClose}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Icon icon='mdi:close' />
                </IconButton>
                <DatePickerWrapper>

                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem', color: '#915592' }}>
                            Horaires de travail de mes utilisateurs fixed
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 6 }}>
                            <Grid item lg={4} md={4} sm={6}>
                                <DatePicker
                                    isClearable
                                    selectsRange
                                    monthsShown={2}
                                    endDate={endDateRange}
                                    selected={startDateRange}
                                    startDate={startDateRange}
                                    shouldCloseOnSelect={false}
                                    id='date-range-picker-months'
                                    onChange={handleOnChangeRange}
                                    customInput={
                                        <CustomInput
                                            dates={dates}
                                            setDates={setDates}
                                            label='Date'
                                            end={endDateRange as number | Date}
                                            start={startDateRange as number | Date}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6}>
                                <TextField
                                    value={weekdayName}
                                    onChange={handleChangeWeekDay}
                                    placeholder='Enter Name' />

                            </Grid>
                            <Grid item lg={4} md={4} sm={6}>
                                <Button size='medium' type='button' variant='contained' onClick={handleAddWeeklySchedule}>
                                    Add
                                </Button>
                            </Grid>
                        </Grid>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#fff' }}>
                                <CardContent sx={{ p: theme => `${theme.spacing(3.25, 8, 4.5)} !important` }}>
                                    <Table sx={{ minWidth: 650 }} aria-label='simple table' style={{ textAlign: 'left' }}>
                                        <TableHead>
                                            <TableRow></TableRow>
                                        </TableHead>
                                        {
                                            <TableBody>
                                                {arrayOfWeek?.map((week: any, index: any, weekIndex: number) => (
                                                    <TableRow key={week.id}>
                                                        <Accordion expanded={expanded === week.id} onChange={handleChangee(week.id)}>
                                                            <AccordionSummary
                                                                id='customized-panel-header-1'
                                                                expandIcon={expandIcon('panel1')}
                                                                aria-controls='customized-panel-content-1'
                                                            >
                                                                <Typography>{week.week_name} {week.start_date_of_week}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {week?.dayschedule_set?.map((day: any, index: any, dayIndex: number) => (
                                                                    <div key={day.id}>
                                                                        <TableCell><Box sx={{ display: 'flex' }}>
                                                                            <FormControlLabel
                                                                                label={day.day}
                                                                                control={
                                                                                    <Checkbox
                                                                                        name='color-secondary'
                                                                                        sx={{ color: '#915592', fontSize: '60px', fontWeight: 500 }}
                                                                                    // checked={true}
                                                                                    />
                                                                                }
                                                                                onChange={() => {
                                                                                    const newShowDatePicker = [...showDatePicker]
                                                                                    newShowDatePicker[day.id] = !newShowDatePicker[day.id]
                                                                                    setShowDatePicker(newShowDatePicker)
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {showDatePicker[day.id] && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                                                                                    <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                                                                                        de
                                                                                    </Typography>
                                                                                    <TextField
                                                                                        type='Time'
                                                                                        value={day.check_in}
                                                                                        onChange={event => handleChange(day.week_schedule, day.id, 'check_in', event.target.value)}

                                                                                    ></TextField>
                                                                                    <Typography
                                                                                        variant='body1'
                                                                                        sx={{ ml: 4, mr: 4, pt: 3.5, width: '30px', alignItems: 'center' }}
                                                                                    >
                                                                                        à
                                                                                    </Typography>
                                                                                    <TextField
                                                                                        type='Time'
                                                                                        value={day.check_out}
                                                                                        // onChange={(event) => handleChange(weekIndex, dayIndex, 'check_out', event.target.value)}
                                                                                        onChange={event => handleChange(day.week_schedule, day.id, 'check_out', event.target.value)}

                                                                                    ></TextField>

                                                                                    <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                                                                        pause
                                                                                    </Typography>

                                                                                    <TextField
                                                                                        type='Time'
                                                                                        value={day.break_duration}
                                                                                    // onChange={event => handleChange(day.id, 'break_duration', event.target.value)}
                                                                                    ></TextField>

                                                                                    <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                                                                        Temps de travail:
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant='body1'
                                                                                        sx={{
                                                                                            fontWeight: 500,
                                                                                            color: '#915592',
                                                                                            mr: 4,
                                                                                            ml: 1,
                                                                                            pt: 3.5,
                                                                                            alignItems: 'center'
                                                                                        }}
                                                                                    >
                                                                                        {day.duration}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                        </TableCell>
                                                                    </div>

                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </TableRow>


                                                    // <TableRow key={day.id}>
                                                    //     <TableCell>
                                                    //         <Box sx={{ display: 'flex' }}>
                                                    //             <FormControlLabel
                                                    //                 label={day.weekday}
                                                    //                 control={
                                                    //                     <Checkbox
                                                    //                         name='color-secondary'
                                                    //                         sx={{ color: '#915592', fontSize: '60px', fontWeight: 500 }}
                                                    //                     // checked={true}
                                                    //                     />
                                                    //                 }
                                                    //                 onChange={() => {
                                                    //                     const newShowDatePicker = [...showDatePicker]
                                                    //                     newShowDatePicker[index] = !newShowDatePicker[index]
                                                    //                     setShowDatePicker(newShowDatePicker)
                                                    //                 }}
                                                    //             />
                                                    //         </Box>
                                                    //     </TableCell>

                                                    //     <TableCell>
                                                    //         {showDatePicker[index] && (
                                                    //             <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                                                    //                 <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                                                    //                     de
                                                    //                 </Typography>
                                                    //                 <TextField
                                                    //                     type='Time'
                                                    //                     value={day.start_at}
                                                    //                     onChange={event => handleChange(day.id, 'start_at', event.target.value)}
                                                    //                 ></TextField>
                                                    //                 <Typography
                                                    //                     variant='body1'
                                                    //                     sx={{ ml: 4, mr: 4, pt: 3.5, width: '30px', alignItems: 'center' }}
                                                    //                 >
                                                    //                     à
                                                    //                 </Typography>
                                                    //                 <TextField
                                                    //                     type='Time'
                                                    //                     value={day.end_at}
                                                    //                     onChange={event => handleChange(day.id, 'end_at', event.target.value)}
                                                    //                 ></TextField>

                                                    //                 <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                                    //                     pause
                                                    //                 </Typography>

                                                    //                 <TextField
                                                    //                     type='Time'
                                                    //                     value={day.break_duration}
                                                    //                     onChange={event => handleChange(day.id, 'break_duration', event.target.value)}
                                                    //                 ></TextField>

                                                    //                 <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                                    //                     Temps de travail:
                                                    //                 </Typography>
                                                    //                 <Typography
                                                    //                     variant='body1'
                                                    //                     sx={{
                                                    //                         fontWeight: 500,
                                                    //                         color: '#915592',
                                                    //                         mr: 4,
                                                    //                         ml: 1,
                                                    //                         pt: 3.5,
                                                    //                         alignItems: 'center'
                                                    //                     }}
                                                    //                 >
                                                    //                     {day.duration}
                                                    //                 </Typography>
                                                    //             </Box>
                                                    //         )}
                                                    //     </TableCell>
                                                    // </TableRow>
                                                ))}
                                            </TableBody>
                                        }
                                    </Table>

                                    <Box m={3}>
                                        <Typography sx={{ color: '#915592' }} variant='h6'>
                                            Spécificités horaires
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                                            <Typography variant='h6' sx={{ pt: 3.5, mr: 3, alignItems: 'center' }}>
                                                Retard pris en compte à partir de
                                            </Typography>
                                            <TextField type='Time' value='05:00'></TextField>
                                            <Typography variant='h6' sx={{ pt: 3.5, ml: 4, alignItems: 'center' }}>
                                                minute(s)
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                                            <Typography variant='h6' sx={{ pt: 3.5, mr: 3, alignItems: 'center' }}>
                                                Temps supplémentaire pris en compte à partir de
                                            </Typography>
                                            <TextField type='Time' value='05:00'></TextField>
                                            <Typography variant='h6' sx={{ pt: 3.5, ml: 4, alignItems: 'center' }}>
                                                minute(s)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Box m={3}>
                                <Button size='medium' type='submit' variant='contained' sx={{ mr: 3 }}>
                                    Create
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </DatePickerWrapper>

            </DialogContent>
        </Dialog >

    )
}

export default ConfigTimeFixe
