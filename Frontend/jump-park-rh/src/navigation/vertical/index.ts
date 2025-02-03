// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const navigation = () => {
  let items = [
    {
      sectionTitle: 'Home',
      type: 'admin'
    },

    {
      title: 'Dashboards',
      path: '/dashboards/crm',
      icon: 'mdi:home-outline',
      type: 'admin'
    },
    {
      title: 'Rapports',
      path: '/rapports',
      icon: 'material-symbols:insert-chart-outline',
      type: 'admin'
    },

    {
      sectionTitle: 'Gestion des employes',
      type: 'admin'
    },
    {
      icon: 'mdi:account-cog-outline',
      title: 'Account',
      type: 'admin',
      children: [
        {
          title: 'Personnel',
          path: '/apps/user/list'
        },
        {
          title: 'Manager',
          path: '/manager'
        },
        {
          title: 'Ajouter employe',
          path: '/apps/user/add'
        }
      ]
    },
    {
      title: 'Département',
      path: '/departments',
      icon: 'mdi:store-marker-outline',
      type: 'admin'
    },
    {
      title: 'Service',
      path: '/services',
      icon: 'mdi:account-service-outline',
      type: 'admin'
    },

    {
      sectionTitle: 'Gestion du pointage',
      type: 'admin'
    },

    {
      title: 'Suivi du temps',
      path: '/attendances',
      icon: 'mdi:alarm',
      type: 'admin'
    },

    {
      title: 'Plannigs',
      path: '/plannigs',
      icon: 'mdi:calendar-clock',
      type: 'admin'
    },
    {
      sectionTitle: 'Gestion Absences et conges',
      type: 'admin'
    },
    {
      title: 'Demande congés',
      path: '/request/conges',
      icon: 'mdi:calendar-remove-outline',
      type: 'admin'
    },
    {
      title: 'Demande Absences',
      path: '/request/absences',
      icon: 'mdi:calendar-remove-outline',
      type: 'admin'
    },
    {
      title: 'Absences et congés',
      path: '/absences',
      icon: 'mdi:calendar-remove-outline',
      type: 'admin'
    },

    // {
    //   title: 'Recrutement',
    //   path: '/recruitments',
    //   icon: 'mdi:account-search-outline'
    // },
    // {
    //   title: 'Penaltes',
    //   path: '/penaltes',
    //   icon: 'mdi:account-search-outline'
    // },
    {
      sectionTitle: 'Comptabilité',
      type: 'admin'
    },
    {
      icon: 'mdi:account-cash-outline',
      title: 'Finance',
      type: 'admin',
      children: [
        {
          title: 'Fiche de paie',
          path: '/finance/list'
        }
      ]
    },
    {
      sectionTitle: 'Paramétrage',
      type: 'admin'
    },
    {
      icon: 'ic:baseline-settings',
      title: 'Configuration',
      type: 'admin',
      children: [
        // {
        //   title: 'Géneral',
        //   path: '/settings/informations'
        // },
        {
          title: 'Horaires de travail',
          path: '/settings/timeTable'
        },
        {
          title: 'Type d’absence',
          path: '/settings/absence'
        },
        {
          title: 'Type de congé',
          path: '/settings/conge'
        },
        {
          title: 'Device',
          path: '/settings/device'
        }
      ]
    },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'mdi:shield-outline'
    // }

    {
      sectionTitle: 'Home',
      type: 'HR'
    },
    {
      title: 'Dashboards',
      path: '/dashboards/rh',
      icon: 'mdi:home-outline',
      type: 'HR'
    },
    {
      sectionTitle: 'Gestion RH',
      type: 'HR'
    },

    {
      title: 'Département',
      path: '/departments',
      icon: 'mdi:store-marker-outline',
      type: 'HR'
    },
    {
      title: 'Service',
      path: '/services',
      icon: 'mdi:account-service-outline',
      type: 'HR'
    },

    {
      icon: 'mdi:account-cog-outline',
      title: 'Account',
      type: 'HR',
      children: [
        {
          title: 'Personnel',
          path: '/apps/user/list'
        },
        {
          title: 'Manager',
          path: '/manager'
        },
        {
          title: 'Ajouter employe',
          path: '/apps/user/add'
        }
      ]
    },
    {
      title: 'Plannigs',
      path: '/plannigs',
      icon: 'mdi:calendar-clock',
      type: 'HR'
    }
  ]
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth = <any>useAuth()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = <any>useRouter()

  if (auth.user.role === 'employee') {
    items = items.filter((item: any) => item.type === 'employee')
  } else if (auth.user.role === 'admin') {
    items = items.filter(item => item.type == 'admin')
  } else if (auth.user.role === 'HR') {
    items = items.filter(item => item.type == 'HR')
  } else {
    router.push('/401')
  }
  return items
}

export default navigation
