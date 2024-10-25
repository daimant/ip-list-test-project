<script lang='tsx'>
import { defineComponent, onMounted, ref, type VNode } from 'vue'
import { type IPType, useIpStore } from '@/pages/store'
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Icons from '@/assets/icons/icons'

const detailTableParams: Array<'country' | 'countryCode' | 'region' | 'regionName' | 'city' | 'org' | 'as' | 'isp'> = ['country', 'countryCode', 'region', 'regionName', 'city', 'org', 'as', 'isp']
const iconsSelector: { [key: string]: VNode } = {
  country: <Icons.country/>,
  countryCode: <Icons.countryCode/>,
  region: <Icons.region/>,
  regionName: <Icons.regionName/>,
  city: <Icons.city/>,
  org: <Icons.org/>,
  as: <Icons.as/>,
  isp: <Icons.asName/>,
  mobile: <Icons.mobile/>,
  proxy: <Icons.proxy/>,
  hosting: <Icons.hosting/>,
  os: <Icons.os/>,
  browser: <Icons.browser/>,
  browserVersion: <Icons.browserVersion/>,
  headers: <Icons.headers/>,
  javaScript: <Icons.arrowsOpposite/>,
}
const osName = () => {
  let OSName = 'Unknown OS';
  if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
  if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
  if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
  if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

  return OSName
}
const fromBigLetter = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`

export default defineComponent({
  setup() {
    const ipStore = useIpStore()
    const item = ref<IPType>()
    const route = useRoute()
    const router = useRouter()

    onMounted(async () => {
      item.value = await ipStore.getIp(route.params.ip as string) || (await axios.get(`http://ip-api.com/json/${route.params.ip}`)).data
    })

    const Header = () => (
      <div>
        <div class='flex-align-center mb-6'>
          <span
            class='flex mr-3 pointer'
            onClick={() => {
              router.go(-1)
            }}
          >
            <Icons.arrowLeft/>
          </span>
          <span class='label-m mr-2'>Проверка IP</span>
          <span class='flex mr-3'><Icons.arrowRightGray/></span>
          <span class='label-m header-ip-additional-text'>{item?.value?.query}</span>
        </div>
        <h1>{item?.value?.query}</h1>
      </div>
    )

    const TableRow = ({ id, name, value, odd }: { id: string, name?: string, value: string, odd?: boolean }) => (
      <tr key={id} class={{ 'odd-row': odd }}>
        <td>
          <div class='flex bold-cell'>
            <span class='flex mr-2'>{iconsSelector[id]}</span>
            <span>{name ? name : id}</span>
          </div>
        </td>
        <td>{value}</td>
      </tr>
    )

    const LeftTable = () => (
      <div class='ip-detail-body-table'>
        <table>
          <thead>
          <tr class='odd-row'>
            <th>
              <div class='flex bold-cell'>
                <span class='flex mr-2'><Icons.arrowsOpposite/></span>
                <span>Query:</span>
              </div>
            </th>
            <th>
              <div class='flex'>
                <span class='flex mr-2'>{item.value?.query}</span>
                <span class='flex pointer'><Icons.copy/></span>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          {detailTableParams.map((tableItemParam, i) => (
            <tr key={tableItemParam} class={{ 'odd-row': i % 2 }}>
              <td>
                <div class='flex bold-cell'>
                  <span class='flex mr-2'>{iconsSelector[tableItemParam]}</span>
                  <span>{(tableItemParam === 'isp' ? 'Asname' : fromBigLetter(tableItemParam))}:</span>
                </div>
              </td>
              <td>{item.value ? item.value[tableItemParam] : '-'}</td>
            </tr>
          ))}
          <TableRow id='mobile' name='Mobile:' value='false'/>
          <TableRow id='proxy' name='Proxy:' value='false' odd={true}/>
          <TableRow id='hosting' name='Hosting:' value='false'/>
          </tbody>
        </table>
      </div>
    )

    const RightTable = () => (
      <div class='ip-detail-body-table'>
        <table>
          <tbody>
          <TableRow id='os' name='ОС:' value={osName()} odd={true}/>
          <TableRow id='browser' name='Браузер:' value={window.clientInformation.appCodeName}/>
          <TableRow id='browserVersion' name='Версия браузера:' value={window.clientInformation.appVersion} odd={true}/>
          <TableRow id='headers' name='Заголовок:' value={window.clientInformation.appVersion}/>
          <TableRow id='javaScript' name='JavaScript:' value={window.clientInformation.appVersion} odd={true}/>
          </tbody>
        </table>
      </div>
    )

    return () => item.value?.query && (
      <div class='layer-layout'>
        <Header/>
        <div class='gap-4'>
          <LeftTable/>
          <RightTable/>
        </div>
      </div>
    )
  }
})
</script>

<style lang='sass'>

.label-m
  &.header-ip-additional-text
    color: #303345

.ip-detail-body-table
  width: 50%
  min-width: 50%

  table
    width: 100%
    border-radius: 12px
    border: 1px solid #E1E8F1

  thead
    th
      border-bottom: 1px solid #E1E8F1
      text-align: left

  .odd-row
    background-color: #F7F9FB

  th, td
    min-width: 164px
    padding: 16px

  .bold-cell
    font-weight: 500
    white-space: nowrap

</style>
