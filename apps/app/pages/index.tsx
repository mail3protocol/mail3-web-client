import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button } from 'ui'
import { useDialog } from 'hooks'
import { Navbar } from '../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect', 'common'])),
  },
})

const Home: NextPage = () => {
  const dialog = useDialog()
  return (
    <div>
      <Navbar />
      <Button
        onClick={() => {
          dialog({
            type: 'warning',
            title: 'Warning',
            description: 'Are you sure you want to do this?',
          })
        }}
      >
        Open warning dialog
      </Button>
      <Button
        onClick={() => {
          dialog({
            type: 'text',
            description: 'Are you sure you want to do this?',
            showCloseButton: true,
            okText: 'OK',
            cancelText: 'cancel',
            onConfirm() {},
            onCancel() {},
          })
        }}
      >
        Open text dialog
      </Button>
    </div>
  )
}

export default Home
