'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useToastStore } from '@/lib/store/toastStore'
import {
  useMe,
  useUpdateMe,
  useChangePassword,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from '@/lib/hooks/useProfile'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'
import type { AddressResponse } from '@/lib/api/types'
import { BalanceModal } from '@/components/profile/BalanceModal'

interface PageProps {
  params: Promise<{ lang: string }>
}

// ── Address form fields ───────────────────────────────────────────────────────

interface AddressFields {
  regionType: string
  cityType: string
  homeNumber: string
  roomNumber: string
}

const REGIONS = [
  { value: 'TASHKENT_CITY',   label: 'Toshkent shahri' },
  { value: 'TASHKENT_REGION', label: 'Toshkent viloyati' },
  { value: 'ANDIJAN',         label: 'Andijon viloyati' },
  { value: 'FERGANA',         label: "Farg'ona viloyati" },
  { value: 'NAMANGAN',        label: 'Namangan viloyati' },
  { value: 'SAMARKAND',       label: 'Samarqand viloyati' },
  { value: 'BUKHARA',         label: 'Buxoro viloyati' },
  { value: 'NAVOI',           label: 'Navoiy viloyati' },
  { value: 'KASHKADARYA',     label: 'Qashqadaryo viloyati' },
  { value: 'SURKHANDARYA',    label: 'Surxondaryo viloyati' },
  { value: 'JIZZAKH',         label: 'Jizzax viloyati' },
  { value: 'SIRDARYA',        label: 'Sirdaryo viloyati' },
  { value: 'KHOREZM',         label: 'Xorazm viloyati' },
  { value: 'KARAKALPAKSTAN',  label: "Qoraqalpog'iston Respublikasi" },
]

const REGION_CITIES: Record<string, { value: string; label: string }[]> = {
  TASHKENT_CITY: [
    { value: 'TASHKENT', label: 'Toshkent' },
  ],
  TASHKENT_REGION: [
    { value: 'CHIRCHIQ',   label: 'Chirchiq' },
    { value: 'ANGREN',     label: 'Angren' },
    { value: 'ALMALYK',    label: 'Olmaliq' },
    { value: 'BEKABAD',    label: 'Bekobod' },
    { value: 'YANGIYO_L',  label: "Yangiyo'l" },
    { value: 'NURAFSHON',  label: 'Nurafshon' },
  ],
  ANDIJAN: [
    { value: 'ANDIJAN',   label: 'Andijon' },
    { value: 'ASAKA',     label: 'Asaka' },
    { value: 'SHAHRIXON', label: 'Shahrixon' },
    { value: 'XONOBOD',   label: 'Xonobod' },
    { value: 'PAP',       label: 'Pap' },
  ],
  FERGANA: [
    { value: 'FERGANA',  label: "Farg'ona" },
    { value: 'MARGILAN', label: "Marg'ilon" },
    { value: 'QOQON',    label: "Qo'qon" },
    { value: 'QUVA',     label: 'Quva' },
    { value: 'RISHTON',  label: 'Rishton' },
  ],
  NAMANGAN: [
    { value: 'NAMANGAN',     label: 'Namangan' },
    { value: 'CHUST',        label: 'Chust' },
    { value: 'TO_RAQO_RG_ON', label: "To'raqo'rg'on" },
    { value: 'POP',          label: 'Pop' },
    { value: 'KOSONSOY',     label: 'Kosonsoy' },
  ],
  SAMARKAND: [
    { value: 'SAMARKAND',     label: 'Samarqand' },
    { value: 'KATTAQO_RG_ON', label: "Kattaqo'rg'on" },
    { value: 'URGUT',         label: 'Urgut' },
    { value: 'ISHTIXON',      label: 'Ishtixon' },
    { value: 'PASTDARG_OM',   label: "Pastdarg'om" },
  ],
  BUKHARA: [
    { value: 'BUKHARA',        label: 'Buxoro' },
    { value: 'KOGON',          label: 'Kogon' },
    { value: 'KAGAN',          label: 'Kagan' },
    { value: 'QOROVULBOZOR',   label: 'Qorovulbozor' },
    { value: 'GAZLI',          label: 'Gazli' },
  ],
  NAVOI: [
    { value: 'NAVOI',     label: 'Navoiy' },
    { value: 'ZARAFSHON', label: 'Zarafshon' },
    { value: 'KARMANA',   label: 'Karmana' },
    { value: 'NUROTA',    label: 'Nurota' },
    { value: 'UCHQUDUQ',  label: 'Uchquduq' },
  ],
  KASHKADARYA: [
    { value: 'KARSHI',     label: 'Qarshi' },
    { value: 'SHAHRISABZ', label: 'Shahrisabz' },
    { value: 'MUBORAK',    label: 'Muborak' },
    { value: 'G_UZOR',     label: "G'uzor" },
    { value: 'KITOB',      label: 'Kitob' },
  ],
  SURKHANDARYA: [
    { value: 'TERMEZ',      label: 'Termiz' },
    { value: 'DENOV',       label: 'Denov' },
    { value: 'BOYSUN',      label: 'Boysun' },
    { value: 'SARIOSIYO',   label: 'Sariosiyo' },
    { value: 'QUMQO_RG_ON', label: "Qumqo'rg'on" },
  ],
  JIZZAKH: [
    { value: 'JIZZAKH',     label: 'Jizzax' },
    { value: 'DO_STLIK',    label: "Do'stlik" },
    { value: 'GAGARIN',     label: 'Gagarin' },
    { value: 'PAXTAKOR',    label: 'Paxtakor' },
    { value: 'ZO_FAROBIOD', label: 'Zofarobod' },
  ],
  SIRDARYA: [
    { value: 'GULISTON', label: 'Guliston' },
    { value: 'YANGIYER', label: 'Yangiyer' },
    { value: 'SIRDARYO', label: 'Sirdaryo' },
    { value: 'BOYOVUT',  label: 'Boyovut' },
    { value: 'SHIRIN',   label: 'Shirin' },
  ],
  KHOREZM: [
    { value: 'URGENCH',    label: 'Urganch' },
    { value: 'XIVA',       label: 'Xiva' },
    { value: 'PITNAK',     label: 'Pitnak' },
    { value: 'GURLAN',     label: 'Gurlan' },
    { value: 'YANGIBOZOR', label: 'Yangibozor' },
  ],
  KARAKALPAKSTAN: [
    { value: 'NUKUS',     label: 'Nukus' },
    { value: 'MOYNAQ',    label: "Mo'ynaq" },
    { value: 'CHIMBOY',   label: 'Chimboy' },
    { value: 'XO_JAYLI',  label: "Xo'jayli" },
    { value: 'QONLIKO_L', label: "Qonliko'l" },
  ],
}

const selectCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

function AddressForm({
  initial,
  dict,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: AddressFields
  dict: Dictionary
  onSave: (data: AddressFields) => void
  onCancel: () => void
  isPending: boolean
}) {
  const { register, handleSubmit, control, setValue } = useForm<AddressFields>({
    defaultValues: initial ?? { regionType: '', cityType: '', homeNumber: '', roomNumber: '' },
  })

  const selectedRegion = useWatch({ control, name: 'regionType' })
  const availableCities = REGION_CITIES[selectedRegion] ?? []

  // Reset city when region changes (skip on initial render)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    setValue('cityType', '')
  }, [selectedRegion, setValue])

  return (
    <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-2 gap-3 mt-3">
      {/* Region */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{dict.profile.region}</label>
        <select {...register('regionType', { required: true })} className={selectCls}>
          <option value="">— Viloyat —</option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{dict.profile.city}</label>
        <select
          {...register('cityType', { required: true })}
          disabled={!selectedRegion}
          className={`${selectCls} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">— Shahar —</option>
          {availableCities.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Home number */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{dict.profile.homeNumber}</label>
        <input
          {...register('homeNumber', { required: true })}
          className={selectCls}
        />
      </div>

      {/* Room number */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{dict.profile.roomNumber}</label>
        <input
          {...register('roomNumber', { required: true })}
          className={selectCls}
        />
      </div>

      <div className="col-span-2 flex gap-2 justify-end mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {dict.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
        >
          {dict.common.save}
        </button>
      </div>
    </form>
  )
}

// ── Profile edit form ─────────────────────────────────────────────────────────

interface ProfileFields {
  name: string
  surname: string
  phoneNumber: string
  birthdayAt: string
}

interface PasswordFields {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PersonalDataPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const isAuthInitialized = useRef(false)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const initialize = useAuthStore((s) => s.initialize)
  const addToast = useToastStore((s) => s.addToast)
  const { data: me, isLoading: meLoading } = useMe()
  const { data: addressList, isLoading: addrLoading } = useAddresses()
  const updateMe = useUpdateMe()
  const changePassword = useChangePassword()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()

  useEffect(() => {
    initialize()
    isAuthInitialized.current = true
  }, [initialize])

  // Redirect if not logged in (after mount)
  useEffect(() => {
    if (isAuthInitialized.current && !isLoggedIn) {
      router.replace(`/${lang}/login`)
    }
  }, [isLoggedIn, lang, router])

  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [showTopUp, setShowTopUp] = useState(false)

  const profileForm = useForm<ProfileFields>()
  const passwordForm = useForm<PasswordFields>()

  // Populate profile form once data loads
  useEffect(() => {
    if (me) {
      profileForm.reset({
        name: me.name,
        surname: me.surname,
        phoneNumber: me.phoneNumber ?? '',
        birthdayAt: me.birthdayAt ? me.birthdayAt.split('T')[0] : '',
      })
    }
  }, [me]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!dict) return null

  const roleLabels: Record<string, string> = {
    CUSTOMER: dict.profile.roleCustomer,
    ADMIN: dict.profile.roleAdmin,
    DELIVERY: dict.profile.roleDelivery,
    SUPER_ADMIN: dict.profile.roleSuperAdmin,
  }

  const handleProfileSubmit = async (data: ProfileFields) => {
    try {
      await updateMe.mutateAsync({
        name: data.name,
        surname: data.surname,
        phoneNumber: data.phoneNumber || undefined,
        birthdayAt: data.birthdayAt || undefined,
      })
      addToast(dict.profile.profileUpdated, 'success')
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const handlePasswordSubmit = async (data: PasswordFields) => {
    if (data.newPassword !== data.confirmNewPassword) {
      passwordForm.setError('confirmNewPassword', { message: 'Passwords do not match' })
      return
    }
    try {
      await changePassword.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      addToast(dict.profile.passwordChanged, 'success')
      passwordForm.reset()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 400 || axiosErr?.response?.status === 401) {
        addToast(dict.profile.wrongPassword, 'error')
      } else {
        addToast(dict.common.error, 'error')
      }
    }
  }

  const handleCreateAddress = async (data: AddressFields) => {
    try {
      await createAddress.mutateAsync(data)
      addToast(dict.profile.addressSaved, 'success')
      setShowAddAddress(false)
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const handleUpdateAddress = async (id: number, data: AddressFields) => {
    try {
      await updateAddress.mutateAsync({ id, payload: data })
      addToast(dict.profile.addressSaved, 'success')
      setEditingAddressId(null)
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id)
      addToast(dict.profile.addressDeleted, 'success')
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const initials = me
    ? `${me.name.charAt(0)}${me.surname.charAt(0)}`.toUpperCase()
    : '?'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left column ── */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Profile card with avatar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 select-none">
            {meLoading ? '?' : initials}
          </div>
          <div>
            {meLoading ? (
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-4 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ) : (
              <>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {me?.name} {me?.surname}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{me?.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Edit profile form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {dict.profile.editProfile}
          </h2>
          {meLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          ) : (
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dict.auth.name}
                  </label>
                  <input
                    {...profileForm.register('name', { required: true })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dict.auth.surname}
                  </label>
                  <input
                    {...profileForm.register('surname', { required: true })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dict.auth.phone}
                  </label>
                  <input
                    {...profileForm.register('phoneNumber')}
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dict.auth.birthday}
                  </label>
                  <input
                    {...profileForm.register('birthdayAt')}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateMe.isPending}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {dict.profile.saveChanges}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change password */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {dict.profile.changePassword}
          </h2>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.profile.currentPassword}
              </label>
              <input
                {...passwordForm.register('oldPassword', { required: true })}
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.profile.newPassword}
              </label>
              <input
                {...passwordForm.register('newPassword', { required: true, minLength: 8 })}
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.profile.confirmNewPassword}
              </label>
              <input
                {...passwordForm.register('confirmNewPassword', { required: true, minLength: 8 })}
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {passwordForm.formState.errors.confirmNewPassword?.message && (
                <p className="text-xs text-red-500 mt-0.5">
                  {passwordForm.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
              >
                {dict.profile.changePassword}
              </button>
            </div>
          </form>
        </div>

        {/* Addresses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {dict.profile.addresses}
            </h2>
            {!showAddAddress && (
              <button
                onClick={() => setShowAddAddress(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {dict.profile.addAddress}
              </button>
            )}
          </div>

          {addrLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(addressList ?? []).map((addr: AddressResponse) => (
                <div key={addr.id}>
                  {editingAddressId === addr.id ? (
                    <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-blue-50/40 dark:bg-blue-900/10">
                      <AddressForm
                        initial={{
                          regionType: addr.regionType,
                          cityType: addr.cityType,
                          homeNumber: addr.homeNumber,
                          roomNumber: addr.roomNumber,
                        }}
                        dict={dict}
                        onSave={(data) => handleUpdateAddress(addr.id, data)}
                        onCancel={() => setEditingAddressId(null)}
                        isPending={updateAddress.isPending}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {addr.regionType}, {addr.cityType}, {dict.profile.homeNumber.toLowerCase()} {addr.homeNumber}, {dict.profile.roomNumber.toLowerCase()} {addr.roomNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditingAddressId(addr.id)}
                          className="px-3 py-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm transition-colors"
                        >
                          {dict.profile.editAddress}
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={deleteAddress.isPending}
                          className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          {dict.profile.deleteAddress}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {(addressList ?? []).length === 0 && !showAddAddress && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  —
                </p>
              )}

              {showAddAddress && (
                <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-blue-50/40 dark:bg-blue-900/10">
                  <AddressForm
                    dict={dict}
                    onSave={handleCreateAddress}
                    onCancel={() => setShowAddAddress(false)}
                    isPending={createAddress.isPending}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col gap-6">
        {/* Balance card */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg p-6 text-white">
          <p className="text-sm font-medium text-blue-100 mb-1">{dict.profile.balance}</p>
          <p className="text-3xl font-bold mb-4">
            {meLoading
              ? '—'
              : `${(me?.balance ?? 0).toLocaleString()} сум`}
          </p>
          <button
            onClick={() => setShowTopUp(true)}
            className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium text-sm transition-colors backdrop-blur-sm border border-white/30"
          >
            {dict.profile.topUp}
          </button>
        </div>

        {/* User info card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {dict.profile.personalData}
          </h2>
          {meLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">{dict.auth.email}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">{me?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">{dict.profile.role}</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {me?.role ? roleLabels[me.role] ?? me.role : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">{dict.profile.emailStatus}</span>
                {me?.emailVerified ? (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    {dict.profile.verified}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                    {dict.profile.unverified}
                  </span>
                )}
              </div>
              {me?.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{dict.profile.memberSince}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(me.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BalanceModal
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        currentBalance={me?.balance ?? 0}
        dictionary={dict}
      />
    </div>
  )
}
