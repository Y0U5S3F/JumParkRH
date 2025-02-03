// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import React, { useState, forwardRef, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer'
import PreviewCard from 'src/views/finance/PreviewCard'
import { Router, useRouter } from 'next/router'

interface Props {
  id: any
  // toggleAddPaymentDrawer: () => void
  // toggleSendInvoiceDrawer: () => void
}

const PreviewActions = (props: Props) => {
  const router = useRouter()

  const handlePrint = () => {
    router.push('/finance/print/1')
  }
  const viewerRef = useRef()

  // const handlePrintClick = () => {
  //   viewerRef.current && viewerRef.current.window.print()
  // }
  return (
    <Card>
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          variant='contained'
          // onClick={toggleSendInvoiceDrawer}
          startIcon={<Icon icon='mdi:send-outline' />}
        >
          Send Invoice
        </Button>

        <Button
          fullWidth
          target='_blank'
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/finance/print/${props.id}`}
          // onClick={handlePrint}
        >
          Print
        </Button>
        <Button fullWidth sx={{ mb: 3.5 }} color='secondary' variant='outlined'>
          Download
        </Button>
        {/* <PDFViewer width='100%' height='600px' ref={viewerRef}>
          <Document />
        </PDFViewer>
        <Button variant='contained' onClick={handlePrintClick}>
          Print
        </Button> */}
        {/* <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/invoice/edit/${id}`}
        >
          Edit Paie
        </Button> */}
        {/* <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={toggleAddPaymentDrawer}
          startIcon={<Icon icon='mdi:currency-usd' />}
        >
          Add Payment
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default PreviewActions
