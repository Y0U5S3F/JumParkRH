// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { SingleInvoiceType, InvoiceLayoutProps } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import PreviewCard from 'src/views/finance/PreviewCard'
import PreviewActions from 'src/views/finance/PreviewActions'
// import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
// import SendInvoiceDrawer from 'src/views/apps/invoice/shared-drawer/SendInvoiceDrawer'
import { useRouter } from 'next/router'

export function getServerSideProps(context: any) {
  return {
    props: { params: context.params }
  }
}

const InvoicePreview = ({ params }:any) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | SingleInvoiceType>(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)
  const router = useRouter()
  const { id } = params
  // const { id } = router.query

  console.log('idddd---', id)
  // useEffect(() => {
  //     axios
  //       .get('/apps/invoice/single-invoice', { params: { id } })
  //       .then(res => {
  //         setData(res.data)
  //         setError(false)
  //       })
  //       .catch(() => {
  //         setData(null)
  //         setError(true)
  //       })
  //   }, [id])
  // const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  // const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  // if (data) {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <PreviewCard />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <PreviewActions
            id={id}
            // toggleAddPaymentDrawer={toggleAddPaymentDrawer}
            // toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
          />
        </Grid>
      </Grid>
      {/* <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
    </>
  )
  // } else if (error) {
  //   return (
  //     <Grid container spacing={6}>
  //       <Grid item xs={12}>
  //         <Alert severity='error'>
  //           Invoice with the id: 12 does not exist. Please check the list of invoices:{' '}
  //           <Link href='/apps/invoice/list'>Invoice List</Link>
  //         </Alert>
  //       </Grid>
  //     </Grid>
  //   )
  // } else {
  //   return null
  // }
}

export default InvoicePreview
