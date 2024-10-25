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
const mobileCheck = () => {
  let check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor)
  return `${check}`
}

export default defineComponent({
  setup() {
    const ipStore = useIpStore()
    const item = ref<IPType>()
    const route = useRoute()
    const router = useRouter()
    const browserInfo = window.clientInformation.appVersion.split(' ')
    const browserName = browserInfo[browserInfo.length - 2].split('/')[0]
    const browserVersion = browserInfo[browserInfo.length - 2].split('/')[1]

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
                <span
                  class='flex pointer'
                  onClick={() => {
                    if (item.value?.query) navigator.clipboard.writeText(item.value.query)
                  }}
                >
                  <Icons.copy/>
                </span>
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
          <TableRow id='mobile' name='Mobile:' value={mobileCheck()}/>
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
          <TableRow id='browser' name='Браузер:' value={browserName}/>
          <TableRow id='browserVersion' name='Версия браузера:' value={browserVersion} odd={true}/>
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
    font-weight: 400
    min-width: 164px
    padding: 16px

  .bold-cell
    font-weight: 500
    white-space: nowrap

</style>
