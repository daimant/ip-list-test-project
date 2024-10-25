<script lang='tsx'>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash'
import axios from 'axios'
import LineLoader from '../components/line-loader.vue'
import Icons from '../assets/icons/icons'
import { useIpStore } from '@/pages/store'

const countryCodeToFlag = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2 || !/^[a-zA-Z]+$/.test(countryCode)) {
    return '🏳️'
  }
  return Array.from(countryCode.toUpperCase()).map(letter => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join('')
}

export default defineComponent({
  setup() {
    const ipStore = useIpStore()
    const route = useRoute()
    const router = useRouter()
    const searchIPList = ref('')
    const searchInTable = ref('')
    const isLoading = ref(false)
    const currentOrdering = ref<'query' | 'country' | 'region' | ''>('')
    const errorsIp = ref<string[]>([])

    onMounted(() => {
      if (route.query.search) searchInTable.value = route.query.search as string
    })

    const onInput = debounce((v: string) => {
      searchInTable.value = v
      router.push({ query: { search: v } })
    }, 500)

    const onSearchInput = (e: Event) => {
      onInput((e.target as HTMLInputElement).value)
    }

    const goCheckIPList = async () => {
      if (!searchIPList.value.length) return
      isLoading.value = true

      errorsIp.value = []
      ipStore.clearList()

      const preparedIpForCheck = searchIPList.value.split('\n')
      preparedIpForCheck.forEach((ip, i: number) => {
        if (ip.replace(/[^.]/gi, '').length !== 3 || ip.replace(/[0-9,.]/gi, '').length !== 0 || !ip || ip === ' ' || ip === '\n') {
          errorsIp.value.push(ip)
          preparedIpForCheck.splice(i, 1)
        }
      })

      preparedIpForCheck.forEach(async (ip) => {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}`)

        if (data.status === 'success') ipStore.addIP(data)
        else errorsIp.value.push(ip)
      })

      isLoading.value = false
    }

    const doSearchInTable = async () => {
      if (!searchInTable.value.length) return
      ipStore.search(searchInTable.value)
    }

    const doOrdering = (param: 'query' | 'country' | 'region') => {
      currentOrdering.value = param
      ipStore.sort(param)
    }

    const InputBlock = () => (
      <div class='mb-10'>
        <h1>Проверка IP</h1>
        <div class='input-ip-block'>
          <div class='mb-4'>
            <div class='label-m mb-3'>Ваши IP</div>
            <textarea
              placeholder='Введите несколько IP'
              value={searchIPList.value}
              onInput={(e: Event) => {
                searchIPList.value = ((e.target as HTMLInputElement).value)
              }}
            />
          </div>
          <button class={{ 'primary-button': true, disabled: !searchIPList.value.length }} onClick={goCheckIPList}>
            Начать проверку
          </button>
        </div>
      </div>
    )

    const TableHeaderCell = ({ title, ordering }: { title: string, ordering: 'query' | 'country' | 'region' }) => (
      <th>
        <div class='flex-align-center' style='width: 30%'>
          <span class='mr-2 label-s'>{title}</span>
          <span
            class='flex'
            onClick={() => {
              doOrdering(ordering)
            }}
          >
            <Icons.ordering/>
          </span>
        </div>
      </th>
    )

    const TableBody = () => (
      <div class='ip-table-body'>
        {isLoading.value && <LineLoader/>}
        <table>
          <thead>
          <tr>
            <TableHeaderCell title="IP" ordering="query"/>
            <TableHeaderCell title="Country" ordering="country"/>
            <TableHeaderCell title="Region" ordering="region"/>
            <th class='icon-header'/>
            <th class='icon-header'/>
          </tr>
          </thead>
          <tbody>
          {ipStore.getList.map((item, i) => (
            <tr key={item.query} class={{ 'last-row': ipStore.getList.length - 1 === i }}>
              <td>{item.query || '-'}</td>
              <td>
                <span class='flag-emoji'>{countryCodeToFlag(item.countryCode.toLowerCase())}</span>
                {item.country || '-'}
              </td>
              <td>{item.region || '-'}</td>
              <td
                onClick={() => {
                  ipStore.removeIP(i, 1)
                }}
              >
                <Icons.trash/>
              </td>
              <td
                onClick={() => {
                  router.push({ name: 'ip-detail', params: { ip: item.query } })
                }}
              >
                <Icons.arrowRight/>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )

    const TableBlock = () => (
      <div>
        <h1>Результаты</h1>
        <div class='ip-table'>
          <div class='ip-table-header'>
            <div class='label-s mb-2'>Поиск по таблице</div>
            <div class='search-block'>
              <input
                placeholder='Что вы хотите найти?'
                value={searchInTable.value}
                onInput={onSearchInput}
              />
              <button
                class={{ 'secondary-button': true, disabled: !searchInTable.value.length }}
                onClick={doSearchInTable}
              >
                Найти
              </button>
            </div>
          </div>
          <TableBody/>
        </div>
      </div>
    )

    return () => (
      <div class='layer-layout'>
        <InputBlock/>
        {ipStore.getList.length !== 0 && <TableBlock/>}
      </div>
    )
  }
})
</script>

<style lang='sass'>

.input-ip-block
  background-color: #F7F9FB
  border: 1px solid #E1E8F1
  font-weight: 500
  padding: 24px
  border-radius: 16px

  textarea
    color: #6B6D80
    border: 1px solid #E1E8F1
    width: 100%
    padding: 12px
    border-radius: 8px
    font-size: 14px
    line-height: 20px
    height: 180px
    resize: none

    &:focus
      outline: none !important

    &::placeholder
      color: #A4A5B1

.primary-button
  color: white
  background-color: #070707
  padding: 8px 16px
  border-radius: 8px
  font-size: 14px
  line-height: 20px
  cursor: pointer
  border: none

  &:focus
    outline: none !important

  &:hover
    background-color: rgba(#070707, 0.7)

  &.disabled
    background-color: rgba(#070707, 0.2)
    cursor: not-allowed

.secondary-button
  color: #303345
  background-color: #ECF0F5
  padding: 12px 16px
  border-radius: 8px
  font-size: 14px
  line-height: 20px
  cursor: pointer
  border: none

  &:focus
    outline: none !important

  &:hover
    background-color: rgba(#ECF0F5, 0.7)

  &.disabled
    background-color: rgba(#ECF0F5, 0.2)
    cursor: not-allowed

.ip-table
  border: 1px solid #E1E8F1
  border-radius: 16px
  overflow: scroll

  &-header
    padding: 24px

    .search-block
      display: flex
      gap: 16px

      input
        background: url('@/assets/icons/search.svg') no-repeat left 12px center #F7F9FB
        color: #6B6D80
        border: 1px solid #E1E8F1
        border-radius: 8px
        width: 100%
        padding: 12px 12px 12px 40px

        &:focus
          outline: none !important

        &::placeholder
          color: #A4A5B1

  &-body
    table
      width: 100%

      th, td
        padding: 12px
        border-bottom: 1px solid #E1E8F1

      .last-row
        th, td
          border: none

      thead
        th
          width: 31%
          background-color: #F7F9FB

          &.icon-header
            min-width: 44px
            width: 44px

      td
        padding: 12px

      svg
        cursor: pointer

.flag-emoji
  font-size: 17px
  margin-right: 8px

</style>
