// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer'

// ** Types
import { SingleInvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  data: SingleInvoiceType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = () => {
  // ** Hook
  // const styles = StyleSheet.create({
  //   page: {
  //     flexDirection: 'column',
  //     backgroundColor: theme.palette.background.paper,
  //     padding: theme.spacing(2),
  //     fontFamily: theme.typography.fontFamily
  //   },
  //   card: {
  //     marginBottom: theme.spacing(2)
  //   }
  // })

  const theme = useTheme()
  const invoice = [
    {
      id: 4987,
      issuedDate: '13/01/2023',
      address: '7777 Mendez Plains',
      company: 'Hall-Robbins PLC',
      companyEmail: 'don85@johnson.com',
      country: 'USA',
      contact: '(616) 865-4180',
      name: 'Jordan Stevenson',
      service: 'Software Development',
      total: 3428,
      avatar: '',
      avatarColor: 'primary',
      invoiceStatus: 'Paid',
      balance: '$724',
      dueDate: '13/01/2023'
    },
    {
      id: 4988,
      issuedDate: '13/01/2023',
      address: '04033 Wesley Wall Apt. 961',
      company: 'Mccann LLC and Sons',
      companyEmail: 'brenda49@taylor.info',
      country: 'Haiti',
      contact: '(226) 204-8287',
      name: 'Stephanie Burns',
      service: 'UI/UX Design & Development',
      total: 5219,
      avatar: '/images/avatars/1.png',
      invoiceStatus: 'Downloaded',
      balance: 0,
      dueDate: '3/01/2023'
    }
  ]
  const paymentDetails = {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905'
  }
  // if (data) {
  return (
    <Document>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <img width={80} src='/images/logo-jump-park.webp' />

                  {/* <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                    {themeConfig.templateName}
                  </Typography> */}
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Route de la Marsa GP9, Tunis 1100 <br />
                    San Diego County, CA 91905, USA <br />
                    +(216)28 554 670
                  </Typography>
                  {/* <Typography variant='body2' sx={{ mb: 1 }}>
                    San Diego County, CA 91905, USA
                  </Typography> */}
                  {/* <Typography variant='body2'> +(216)28 554 670</Typography> */}
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '200px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ mb: 1.5, fontWeight: 600, whiteSpace: 'nowrap' }} variant='h6'>
                          Bulletin de paie
                        </Typography>
                      </MUITableCell>
                      {/* <MUITableCell>
                      <Typography variant='h6'>#123</Typography>
                    </MUITableCell> */}
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date de creation:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>01/05/2023</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date de mis a jour:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>02/05/2023</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider
          sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(5.5)} !important` }}
        />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                Matricule: 0012
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Nom & Prénom : Bouaoud Aness
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                État Civil : C
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Nbre Enfant: 0
              </Typography>

              <Typography variant='body2' sx={{ mb: 2 }}>
                Matricule organisme: 123456
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                {/* <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                Bill To:
              </Typography> */}
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                            Année
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant='subtitle2'
                            sx={{ mb: 3, ml: 0, mr: 0, color: 'text.primary', letterSpacing: '.1px' }}
                          >
                            2023
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                            Mois:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant='subtitle2'
                            sx={{ mb: 3, ml: 2, mr: 0, color: 'text.primary', letterSpacing: '.1px' }}
                          >
                            Avril
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                            Nature de Paie:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant='subtitle2'
                            sx={{ mb: 3, ml: 2, mr: 0, color: 'text.primary', letterSpacing: '.1px' }}
                          >
                            Salaire Mensuelle
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                            Régime Horaire:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant='subtitle2'
                            sx={{ mb: 3, ml: 2, mr: 0, color: 'text.primary', letterSpacing: '.1px' }}
                          >
                            48
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      {/* <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>SWIFT code:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{paymentDetails.swiftCode}</Typography>
                      </MUITableCell>
                    </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: '0 !important' }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Libellé</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Gains</TableCell>
                <TableCell>Retenues</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Salaire de base</TableCell>
                <TableCell>26.00</TableCell>
                <TableCell>800.00</TableCell>
                <TableCell>0.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Salaire brut</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>800.000</TableCell>
                <TableCell>0.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>C.N.S.S.</TableCell>
                <TableCell> 0.000</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>73.440</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Salaire Imposable</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>726.560</TableCell>
                <TableCell>0.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Impots</TableCell>
                <TableCell> 0.000</TableCell>
                <TableCell>0.000</TableCell>
                <TableCell>61.685</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Net a payer</TableCell>
                <TableCell> 0.000</TableCell>
                <TableCell>664.875</TableCell>
                <TableCell>0.000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ pt: 8 }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Note:
                </Typography>
                <Typography variant='body2'>0.00</Typography>
              </Box>

              <Typography variant='body2'>Merci pour votre entreprise</Typography>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography variant='body2'>Net a payer:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  664.875
                </Typography>
              </CalcWrapper>

              <Divider
                sx={{ mt: theme => `${theme.spacing(5)} !important`, mb: theme => `${theme.spacing(3)} !important` }}
              />
              <CalcWrapper>
                <Typography variant='body2'>Mode de paiement:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  Virement
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant='body2'>Banque:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  BIAT
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant='body2'>Compte:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  M012365487995
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />

        {/* <CardContent>
        <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
          <strong>Note:</strong> It was a pleasure working with you and your team. We hope you will keep us in mind for
          future freelance projects. Thank You!
        </Typography>
      </CardContent> */}
      </Card>
    </Document>
  )
  // } else {
  //   return null
  // }
}

export default PreviewCard
