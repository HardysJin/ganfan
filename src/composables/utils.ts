// import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'

import { defineStore } from 'pinia'

export const globalStore = defineStore('global_store', () => {
  const checked_meals = ref([])
  const [mealinfos, meals_priceRefs] = loadMeals()
  const user = getUser()
  const login = ref(user.value._id === null)
  const bill_table = ref(null)
  return { checked_meals, meals_priceRefs, mealinfos, user, login, bill_table }
})

function getUser() {
  const theDefaultUser = {
    _id: null,
    name: null,
    isAdmin: false,
  }
  const state = useStorage('user', theDefaultUser)
  return state
}

function loadMeals() {
  const mealinfos = ref(null)
  const meals_priceRefs = {}

  console.log(`${import.meta.env.VITE_BASE_URL}/api/meals`)
  fetch(`${import.meta.env.VITE_BASE_URL}/api/meals`)
    .then(response => response.json())
    .then((data) => {
      // console.log(data)
      // Object.keys(data).forEach((key) => {
      //   data[key].date = new Date(data[key].date)
      // });
      // console.log(data)

      data.map(meal => meal.date = new Date(meal.date))
      data = data.sort((a, b) => b.date - a.date)
      mealinfos.value = data // Object.values(data)

      // Object.keys(data).forEach((key) => {
      //   meals_priceRefs[data[key]._id] = ref(data[key].totalFinal)
      // });

      data.forEach((info) => {
        meals_priceRefs[info._id] = ref(info.totalFinal)
      })

      // console.log(Object.keys(globalStore().mealinfos)
      // .filter( key => globalStore().mealinfos[key].archive === false)
      // .reduce( (res, key) => (res[key] = globalStore().mealinfos[key], res), {} ))
      // console.log(Object.fromEntries(Object.entries(globalStore().mealinfos).filter(([_id, mealinfo]) => mealinfo.archive === false)))

      // const out = Object.keys(mealinfos.value)
      //   .filter( key => {
      //     console.log(mealinfos.value[key].archive)
      //     return mealinfos.value[key].archive === false
      //   })
      //   .reduce( (res, key) => (res[key] = mealinfos.value[key], res), {} )
      // console.log(out)
      // console.log(mealinfos)
      // console.log(meals_priceRefs)
    })
  return [mealinfos, meals_priceRefs]
}

export async function onClickCalculate() {
  const data = {
    meals: [],
  }

  globalStore().checked_meals.forEach((id) => {
    data.meals.push({
      _id: id,
      totalFinal: globalStore().meals_priceRefs[id],
    })
  })

  // console.log(data)

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  globalStore().bill_table = await response.json()
  // console.log(globalStore().bill_table)
}

async function updateMeal(id: string, data: object) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/meals/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const idx = globalStore().mealinfos.findIndex(info => info._id === id)
  globalStore().mealinfos[idx] = await response.json()
  // console.log( globalStore().mealinfos )
}

export async function archiveCheckedMeal() {
  globalStore().checked_meals.forEach((id) => {
    updateMeal(id, { archive: true })
  })
  globalStore().checked_meals = []
}
